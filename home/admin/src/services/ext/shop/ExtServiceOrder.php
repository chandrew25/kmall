<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:订单<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceOrder extends ServiceBasic
{
    /**
     * 保存订单
     * @param mixed $order
     */
    public function saveOrder($orderinfoObj)
    {
        HttpSession::init();
        //保存订单信息
        if (is_object($orderinfoObj)){
            $orderinfo=UtilObject::object_to_array($orderinfoObj->orderinfo);
            $memberinfo=UtilObject::object_to_array($orderinfoObj->memberinfo);
            $order=array_merge($orderinfo,$memberinfo);
            $order_exist=Order::get_one("order_no='".$order["order_no"]."'");
            if ($order_exist){
                return array('success' => true,'msg'=> "该订单已存在！");
            }
            if ($order["ordertime"]){
                $order["ordertime"]=UtilDateTime::dateToTimestamp($order["ordertime"]);
            }
            if ($order["delivery_date"]){
                $order["ship_time"]=UtilDateTime::dateToTimestamp($order["delivery_date"]." ".$order["delivery_time"]);
            }
            $orderObj=new Order($order);
            $orderObj->status=EnumOrderStatus::ACTIVE;
            $orderObj->pay_status=EnumPayStatus::READY;
            $orderObj->ship_status=EnumShipStatus::UNDISPATCH;
        }
        if ($orderObj instanceof Order){
            $admin=HttpSession::get("admin");
            $order_id=$orderObj->save();

            //保存工作流信息:需采购确认
            $workflow=new Workfloworder();
            $workflow->order_id=$order_id;
            $workflow->needer_id=$admin->admin_id;
            $workflow->operator_id=$orderinfo->operator_id;
            $workflow->isConfirm=false;
            $workflow->type=EnumWorkfloworderType::PURCHASER;
            $workflow->save();

            //保存订购商品信息
            foreach ($orderinfoObj->goods as $ordergoods) {
                $goods=UtilObject::object_to_array($ordergoods);
                $ordergoodsObj=new Ordergoods($goods);
                $ordergoodsObj->order_id=$order_id;
                $ordergoodsObj->save();
            }
            //保存发票信息
            foreach ($orderinfoObj->invoices as $invoice) {
                $invoice=UtilObject::object_to_array($invoice);
                $invoiceObj=new Invoice($invoice);
                $invoiceObj->order_id=$order_id;
                $invoiceObj->save();
            }
            if ($orderinfoObj->memberinfo&&($orderinfoObj->memberinfo->isFirstOrder=="on")){
                $isFirstOrder=true;
            }else{
                $isFirstOrder=false;
            }
            //保存订单日志
            $orderLogArr=array(
                "order_id"=>$order_id,
                "order_no"=>$orderObj->order_no,
                "admin_id"=>$admin->admin_id,
                "orderAction"=>EnumOrderAction::ACTIVE,
                "result"=>EnumResult::SUCC,
                "isFirstOrder"=>$isFirstOrder,
                "operater"=>$admin->username
            );
            $orderlog=new Orderlog($orderLogArr);
            $orderlog->save();
            return array('success' => true);
        }else{
            $data=false;
        }
        return array('success' => true,'msg'=> "保存订单失败，请查看是否填写有误！");
    }

    /**
     * 保存数据对象:订单
     * @param array|DataObject $order
     * @return int 保存对象记录的ID标识号
     */
    public function save($order)
    {
        if (is_array($order)){
            $orderObj=new Order($order);
        }
        if ($orderObj instanceof Order){
            $data=$orderObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 更新数据对象 :订单
     * @param array|DataObject $order
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($order)
    {
        if (!EnumOrderStatus::isEnumValue($order["status"])){
            $order["status"]=EnumOrderStatus::statusByShow($order["status"]);
        }
        if (!EnumPayStatus::isEnumValue($order["pay_status"])){
            $order["pay_status"]=EnumPayStatus::pay_statusByShow($order["pay_status"]);
        }
        if (!EnumShipStatus::isEnumValue($order["ship_status"])){
            $order["ship_status"]=EnumShipStatus::ship_statusByShow($order["ship_status"]);
        }
        if (isset($order["ship_time_date"])){
            $order["ship_time"]=$order["ship_time_date"]." ".$order["ship_time_time"];
            UtilDateTime::ChinaTime();
            $order["ship_time"]=UtilDateTime::dateToTimestamp($order["ship_time"]);
        }
        if (is_array($order)){
            $orderObj=new Order($order);
        }
        if ($orderObj instanceof Order){
            $data=$orderObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 修改订单备注
     * @param array|DataObject $order
     * @return boolen 是否更新成功；true为操作正常
     */
    public function updateIntro($order)
    {
        $order=UtilObject::object_to_array($order);
        if (is_array($order)){
            $orderObj=new Order($order);
        }
        if ($orderObj instanceof Order){
            $data=$orderObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 采购审核
     * @param mixed $orders 审核订单及相关内容
     */
    public function purchaserCheck($checks)
    {
        $content=$checks->text;
        HttpSession::init();
        $admin=HttpSession::get("admin");
        foreach ($checks->orders as $key=>$value) {
            if (!empty($value->order_id)){
                //1、修改订单状态
                Order::updateProperties($value->order_id,array("status"=>EnumOrderStatus::CONFIRM));
                //2、工作流
                $workflow=Workfloworder::get_one(array("order_id"=>$value->order_id,"type"=>EnumWorkfloworderType::PURCHASER));
                if ($workflow){
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$content;
                    $workflow->update();
                }else{
                    //保存工作流信息:需采购确认
                    $workflow=new Workfloworder();
                    $workflow->order_id=$value->order_id;
                    $workflow->isConfirm=true;
                    $workflow->type=EnumWorkfloworderType::PURCHASER;
                    $workflow->operator_memo=$content;
                    $workflow->operator_id=$admin->admin_id;
                    $workflow->save();
                }
                //3、记录订单状态日志
                $orderlog = new Orderlog();
                $orderlog->order_id=$value->order_id;
                $orderlog->order_no=$value->order_no;
                $orderlog->admin_id=$admin->admin_id;
                $orderlog->operater=$admin->realname;
                $orderlog->orderAction=EnumOrderAction::AUDIT;
                $orderlog->result=EnumResult::SUCC;
                $orderlog->intro=$content;
                $orderlog->save();
            }
        }
        return array('success' => true,'data'=> true);
    }

    /**
     * 客服确认
     * @param mixed $orders 客服确认订单及相关内容
     */
    public function kefuConfirm($checks)
    {
        $content=$checks->text;
        HttpSession::init();
        $admin=HttpSession::get("admin");
        foreach ($checks->orders as $key=>$value) {
            if (!empty($value->order_id)){
                //1、修改订单状态
                Order::updateProperties($value->order_id,array("status"=>EnumOrderStatus::ACTIVE));
                //2、工作流
                $workflow=Workfloworder::get_one(array("order_id"=>$value->order_id,"type"=>EnumWorkfloworderType::KEFU));
                if ($workflow){
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$content;
                    $workflow->update();
                }else{
                    //保存工作流信息:需采购确认
                    $workflow=new Workfloworder();
                    $workflow->order_id=$order_id;
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$content;
                    $workflow->type=EnumWorkfloworderType::KEFU;
                    $workflow->operator_id=$admin->admin_id;
                    $workflow->save();
                }
                //3、记录订单状态日志
                $orderlog = new Orderlog();
                $orderlog->order_id=$value->order_id;
                $orderlog->order_no=$value->order_no;
                $orderlog->admin_id=$admin->admin_id;
                $orderlog->operater=$admin->realname;
                $orderlog->orderAction=EnumOrderAction::CONFIRM;
                $orderlog->result=EnumResult::SUCC;
                $orderlog->intro=$content;
                $orderlog->save();
            }
        }
        return array('success' => true,'data'=> true);
    }

    /**
     * 发货
     * @param mixed $order_ids 确认已发货的订单标识们
     */
    public function send($checks)
    {
        if ( $checks ) {
            //获得操作人员信息
            HttpSession::init();
            $admin=HttpSession::get("admin");
            //注销无关项
            unset($checks["ship_area_from"]);
            unset($checks["ship_addr_from"]);
            unset($checks["ship_zip_from"]);
            unset($checks["ship_tel_from"]);
            unset($checks["ship_mobile_from"]);
            $order_no = $checks["order_no"];
            unset($checks["order_no"]);
            $checks["status"] = EnumDeliveryStatus::SUCC;
            $checks["type"]   = EnumDeliveryType::DELIVERY;
            $order = Order::get_by_id("order_id");
            if ( $order ) {
              $checks["member_id"] = $order->member_id;
            }
            //生成物流记录
            if($checks["delivery_id"]){
                if (is_array($checks)){
                    $deliveryObj=new Delivery($checks);
                }
                if ($deliveryObj instanceof Delivery){
                    $deliveryObj->update();
                }
                $delivery=$deliveryObj;
            }else{
                $delivery = new Delivery($checks);
                $delivery->save();
            }
            if (!empty($checks["order_id"])){
                //1、修改订单状态
                $deliverytype_id = $checks["deliverytype_id"];
                Order::updateProperties($checks["order_id"], array("ship_status"=>EnumShipStatus::DISPATCH, "ship_type"=>$deliverytype_id));
                //2、工作流
                $workflow=Workfloworder::get_one(array("order_id"=>$checks["order_id"],"type"=>EnumWorkfloworderType::SEND));
                if ($workflow){
                    //更新工作流信息
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$checks["memo"];
                    $workflow->update();
                }else{
                    //保存工作流信息:需客服确认
                    $workflow=new Workfloworder();
                    $workflow->order_id=$checks["order_id"];
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$checks["memo"];
                    $workflow->type=EnumWorkfloworderType::SEND;
                    $workflow->operator_id=$admin->admin_id;
                    $workflow->save();
                }
                //3、记录发货日志
                $deliverylog = new Deliverylog();
                $deliverylog->order_id=$checks["order_id"];
                $deliverylog->order_no=$order_no;
                $deliverylog->delivery_no=$delivery->delivery_no;
                $deliverylog->admin_id=$admin->admin_id;
                $deliverylog->operater=$admin->realname;
                $deliverylog->deliveryAction=EnumDeliveryAction::SEND;
                $deliverylog->result=EnumResult::SUCC;
                $deliverylog->intro=$checks["memo"];
                $deliverylog->ship_time=$checks["ship_time"];
                $deliverylog->save();

                //4、记录订单状态日志
                $orderlog = new Orderlog();
                $orderlog->order_id=$checks["order_id"];
                $orderlog->order_no=$order_no;
                $orderlog->delivery_no=$delivery->delivery_no;
                $orderlog->admin_id=$admin->admin_id;
                $orderlog->operater=$admin->realname;
                $orderlog->orderAction=EnumOrderAction::SEND;
                $orderlog->result=EnumResult::SUCC;
                $orderlog->intro=$checks["memo"];
                $orderlog->save();
            }
        }
        return array('success' => true,'data'=> true);
    }

    /**
     * 签收
     * @param mixed $order_ids 确认需要签收的订单标识们
     */
    public function sign($checks)
    {
        $content=$checks->text;
        HttpSession::init();
        $admin=HttpSession::get("admin");
        foreach ($checks->orders as $key=>$value) {
            if (!empty($value->order_id)){
                //1、修改订单状态
                Order::updateProperties($value->order_id,array("ship_status"=>EnumShipStatus::SIGNED));
                $order=Order::get_by_id($value->order_id);
                if ($order->ship_status==EnumShipStatus::SIGNED&&$order->pay_status==EnumPayStatus::WELL){
                    Order::updateProperties($value->order_id,array("status"=>EnumOrderStatus::FINISH));
                }
                //2、工作流
                $workflow=Workfloworder::get_one(array("order_id"=>$value->order_id,"type"=>EnumWorkfloworderType::RECEIVE));
                if ($workflow){
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$content;
                    $workflow->update();
                }else{
                    //保存工作流信息:需采购确认
                    $workflow=new Workfloworder();
                    $workflow->order_id=$value->order_id;
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$content;
                    $workflow->type=EnumWorkfloworderType::RECEIVE;
                    $workflow->operator_id=$admin->admin_id;
                    $workflow->save();
                }
                //3、记录收货日志
                $delivery=Delivery::get_one("order_id=".$value->order_id);
                $deliverylog = new Deliverylog();
                $deliverylog->order_id=$value->order_id;
                $deliverylog->order_no=$value->order_no;
                $deliverylog->delivery_no=$delivery->delivery_no;
                $deliverylog->admin_id=$admin->admin_id;
                $deliverylog->operater=$admin->realname;
                $deliverylog->deliveryAction=EnumDeliveryAction::TAKE;
                $deliverylog->result=EnumResult::SUCC;
                $deliverylog->intro=$content;
                $deliverylog->ship_time=UtilDateTime::now(EnumDateTimeFormat::DATE);
                $deliverylog->save();

                //4、记录订单状态日志
                $orderlog = new Orderlog();
                $orderlog->order_id=$value->order_id;
                $orderlog->order_no=$value->order_no;
                $orderlog->delivery_no=$delivery->delivery_no;
                $orderlog->admin_id=$admin->admin_id;
                $orderlog->operater=$admin->realname;
                $orderlog->orderAction=EnumOrderAction::RECEIVE;
                $orderlog->result=EnumResult::SUCC;
                $orderlog->intro=$content;
                $orderlog->save();

                //5、判断订单是否完成
                $ifinish=Order::select_one("status","order_id=".$value->order_id);
                if($ifinish=='finish'){
                    $orderlog = new Orderlog();
                    $orderlog->order_id=$value->order_id;
                    $orderlog->order_no=$value->order_no;
                    $orderlog->delivery_no=$delivery->delivery_no;
                    $orderlog->admin_id=$admin->admin_id;
                    $orderlog->operater=$admin->realname;
                    $orderlog->orderAction=EnumOrderAction::FINISH;
                    $orderlog->result=EnumResult::SUCC;
                    $orderlog->intro=$content;
                    $orderlog->save();
                }
            }

        }
        return array('success' => true,'data'=> true);
    }

    /**
     * 确认支付
     * @param mixed $order_ids 确认支付的订单标识们
     */
    public function settle($checks)
    {
        $content=$checks->text;
        HttpSession::init();
        $admin=HttpSession::get("admin");
        foreach ($checks->orders as $key=>$value) {
            if (!empty($value->order_id)){
                //1、改变订单状态
                Order::updateProperties($value->order_id,array("pay_status"=>EnumPayStatus::WELL));
                $order=Order::get_by_id($value->order_id);
                if ($order->ship_status==EnumShipStatus::SIGNED&&$order->pay_status==EnumPayStatus::WELL){
                    Order::updateProperties($value->order_id,array("status"=>EnumOrderStatus::FINISH));
                }
                //2、工作流
                $workflow=Workfloworder::get_one(array("order_id"=>$value->order_id,"type"=>EnumWorkfloworderType::ACCOUT));
                if ($workflow){
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$content;
                    $workflow->update();
                }else{
                    //保存工作流信息:需采购确认
                    $workflow=new Workfloworder();
                    $workflow->order_id=$value->order_id;
                    $workflow->isConfirm=true;
                    $workflow->operator_memo=$content;
                    $workflow->type=EnumWorkfloworderType::ACCOUT;
                    $workflow->operator_id=$admin->admin_id;
                    $workflow->save();
                }
                //3、记录支付日志
                $delivery=Delivery::get_one("order_id=".$value->order_id);
                $paylog = new Paylog();
                $paylog->order_id=$value->order_id;
                $paylog->order_no=$value->order_no;
                $paylog->admin_id=$admin->admin_id;
                $paylog->operater=$admin->realname;
                $paylog->pay_type=$value->pay_type;
                $paylog->amount=$value->final_amount;
                $paylog->payAction=EnumPayAction::PAID;
                $paylog->result=EnumResult::SUCC;
                $paylog->intro=$content;
                $paylog->save();

                //4、记录订单状态日志
                $orderlog = new Orderlog();
                $orderlog->order_id=$value->order_id;
                $orderlog->order_no=$value->order_no;
                $orderlog->delivery_no=$delivery->delivery_no;
                $orderlog->admin_id=$admin->admin_id;
                $orderlog->operater=$admin->realname;
                $orderlog->orderAction=EnumOrderAction::PAY;
                $orderlog->result=EnumResult::SUCC;
                $orderlog->intro=$content;
                $orderlog->save();

                //5、判断订单是否完成
                $ifinish=Order::select_one("status","order_id=".$value->order_id);
                if($ifinish=='finish'){
                    $orderlog = new Orderlog();
                    $orderlog->order_id=$value->order_id;
                    $orderlog->order_no=$value->order_no;
                    $orderlog->delivery_no=$delivery->delivery_no;
                    $orderlog->admin_id=$admin->admin_id;
                    $orderlog->operater=$admin->realname;
                    $orderlog->orderAction=EnumOrderAction::FINISH;
                    $orderlog->result=EnumResult::SUCC;
                    $orderlog->intro=$content;
                    $orderlog->save();
                }
            }
        }
        return array('success' => true,'data'=> true);
    }

    /**
     * 退货
     * @param mixed $order_ids 确认退货的订单标识们
     */
    public function returnGood($order_ids)
    {
        $orders = explode(",",$order_ids);
        HttpSession::init();
        $admin=HttpSession::get("admin");
        foreach($orders as $key=>$value){
            if(!empty($value)){
                //1、改变订单状态
                Order::updateProperties($value,array("ship_status"=>EnumShipStatus::RETURNED));
                Order::updateProperties($value,array("status"=>EnumOrderStatus::DEAD));
                //2、记录退货日志
                $order=Order::get_by_id($value);
                $delivery=Delivery::get_one("order_id=".$value);
                $deliverylog = new Deliverylog();
                $deliverylog->order_id=$order->order_id;
                $deliverylog->order_no=$order->order_no;
                $deliverylog->delivery_no=$delivery->delivery_no;
                $deliverylog->admin_id=$admin->admin_id;
                $deliverylog->operater=$admin->realname;
                $deliverylog->deliveryAction=EnumDeliveryAction::RETURNS;
                $deliverylog->result=EnumResult::SUCC;
                $deliverylog->ship_time=UtilDateTime::now(EnumDateTimeFormat::DATE);
                $deliverylog->save();
            }
        }
        return array('success' => true,'data'=> true);
    }

    /**
     * 退货
     * @param mixed $order_ids 确认退货的订单标识们
     */
    public function returnPartGood($order_ids)
    {
        $orders = explode(",",$order_ids);
        HttpSession::init();
        $admin=HttpSession::get("admin");
        foreach($orders as $key=>$value){
            if(!empty($value)){
                //1、改变订单状态
                Order::updateProperties($value,array("ship_status"=>EnumShipStatus::RETURNEDPART));
                // Order::updateProperties($value,array("status"=>EnumOrderStatus::DEAD));
                //2、记录退货日志
                $order=Order::get_by_id($value);
                $delivery=Delivery::get_one("order_id=".$value);
                $deliverylog = new Deliverylog();
                $deliverylog->order_id=$order->order_id;
                $deliverylog->order_no=$order->order_no;
                $deliverylog->delivery_no=$delivery->delivery_no;
                $deliverylog->admin_id=$admin->admin_id;
                $deliverylog->operater=$admin->realname;
                $deliverylog->deliveryAction=EnumDeliveryAction::RETURNS;
                $deliverylog->result=EnumResult::SUCC;
                $deliverylog->ship_time=UtilDateTime::now(EnumDateTimeFormat::DATE);
                $deliverylog->save();
            }
        }
        return array('success' => true,'data'=> true);
    }

    /**
     * 退款
     * @param mixed $order_ids 确认退款的订单标识们
     */
    public function refund($order_ids)
    {
        $orders = explode(",",$order_ids);
        HttpSession::init();
        $admin=HttpSession::get("admin");
        foreach($orders as $key=>$value){
            if(!empty($value)){
                //1、改变订单状态
                Order::updateProperties($value,array("pay_status"=>EnumPayStatus::RETURNEDS));
                Order::updateProperties($value,array("status"=>EnumOrderStatus::DEAD));
                //2、记录退款日志
                $delivery=Delivery::get_one("order_id=".$value);
                $order=Order::get_by_id($value);
                $paylog = new Paylog();
                $paylog->order_id=$order->order_id;
                $paylog->order_no=$order->order_no;
                $paylog->admin_id=$admin->admin_id;
                $paylog->operater=$admin->realname;
                $paylog->pay_type=$order->pay_type;
                $paylog->amount=$order->final_amount;
                $paylog->payAction=EnumPayAction::RETURNS;
                $paylog->result=EnumResult::SUCC;
                $paylog->save();
            }
        }
        return array('success' => true,'data'=> true);
    }

    /**
     * 订单无效
     * @param mixed $order_ids 确认需要无效的订单标识们
     */
    public function orderInvalid($order_ids)
    {
        $orders = explode(",",$order_ids);
        HttpSession::init();
        $admin=HttpSession::get("admin");
        foreach($orders as $key=>$value){
            if(!empty($value)){
                //1、改变订单状态
                Order::updateProperties($order_ids,array("status"=>EnumOrderStatus::DEAD));
                //2、记录订单状态日志
                $delivery=Delivery::get_one("order_id=".$value);
                $order=Order::get_by_id($value);
                $orderlog = new Orderlog();
                $orderlog->order_id=$order->order_id;
                $orderlog->order_no=$order->order_no;
                $orderlog->delivery_no=$delivery->delivery_no;
                $orderlog->admin_id=$admin->admin_id;
                $orderlog->operater=$admin->realname;
                $orderlog->orderAction=EnumOrderAction::DEAD;
                $orderlog->result=EnumResult::SUCC;
                $orderlog->save();
            }
        }
        return array('success' => true,'data'=> true);

    }

    /**
     * 根据主键删除数据对象:订单的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Order::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 数据对象:退换货分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认10个。
     * @return 数据对象:订单分页查询列表
     */
    public function queryPageReturnd($formPacket=null)
    {
      $condition=UtilObject::object_to_array($formPacket);
      if (empty($condition["ship_status"])) {
        $condition[] = " ship_status='3' or ship_status='4' or ship_status='7' ";
        unset($condition["ship_status"]);
      }
      // return $formPacket;
      return $this->queryPageOrderCondition($condition);
    }

    /**
     * 数据对象:订单分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认10个。
     * @return 数据对象:订单分页查询列表
     */
    public function queryPageOrder($formPacket=null)
    {
      $condition=UtilObject::object_to_array($formPacket);
      return $this->queryPageOrderCondition($condition);
    }

    /**
     * 数据对象:订单分页查询
     * @param stdclass $condition  查询条件数组
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认10个。
     * @return 数据对象:订单分页查询列表
     */
    public function queryPageOrderCondition($condition = null)
    {
        $start=1;
        $limit=10;

        HttpSession::init();
        $admin=HttpSession::get("admin");
        $roletype=$admin->roletype;
        if ( !empty($condition) ) {
          if (isset($condition['start'])){
              $start=$condition['start']+1;
            }
          if (isset($condition['limit'])){
              $limit=$condition['limit'];
              $limit=$start+$limit-1;
          }
          unset($condition['start'],$condition['limit']);
          if (!empty($condition)&&(count($condition)>0)){
              $conditionArr = array();
              foreach ($condition as $key=>$value) {
                  if ( $key && ($key == "order_starttime" || $key == "order_endtime") ) {
                    continue;
                  }

                  if (!UtilString::is_utf8($value)){
                      $value = UtilString::gbk2utf8($value);
                  }
                  if ( is_numeric($value) ) {
                      $conditionArr[] = $key . "='" . $value . "'";
                  } else {
                      if ( !empty($value) ) {
                        if ( empty($key) ) {
                          $conditionArr[] = " ( " . $value . " ) ";
                        } else {
                          $conditionArr[] = $key." like '%".$value."%'";
                        }
                      }
                  }
              }
              $condition_time = "";
              if ( array_key_exists("order_starttime", $condition) || array_key_exists("order_endtime", $condition) ) {
                if (!empty($condition["order_starttime"])&&!empty($condition["order_endtime"])) {
                  $order_starttime = $condition["order_starttime"];
                  $order_endtime   = $condition["order_endtime"];
                  if (!$order_starttime) {
                    $order_starttime = $order_endtime;
                  }
                  $order_starttime = str_replace("T"," ", $order_starttime);
                  if (!$order_endtime) {
                    $order_endtime = $order_starttime;
                  }
                  if (strlen($order_endtime) >= 10) $order_endtime = substr($order_endtime, 0, 10) . " 23:59:59";
                  if ( $conditionArr && count($conditionArr) > 0 ) $condition_time = " and ";
                  $order_starttime = UtilDateTime::dateToTimestamp($order_starttime);
                  $order_endtime   = UtilDateTime::dateToTimestamp($order_endtime);
                  $condition_time .= " ordertime between '" . $order_starttime . "' and '" . $order_endtime . "'";
                }
              }
              $condition = implode(" and ",$conditionArr) . $condition_time;
          }
        }
/*        //如果是采购权限登录
        if ($roletype==EnumRoletype::PSTAFF){
            $workflows=Workfloworder::get("operator=".$admin->admin_id);
        }*/
        $count = Order::count($condition);
        if ( $count > 0 ) {
            if ( $limit > $count ) $limit = $count;
            $data = Order::queryPage($start, $limit, $condition);
            if ( (!empty($data) ) && ( count($data) > 0) )
            {
                Order::propertyShow($data, array('status','pay_status','ship_status','order_type'));
            }
            foreach ($data as $order) {
                $member=Member::get_by_id($order->member_id);
                if($member){
                    $order['username']=$member->username;
                    // $order['member_no']=$member->member_no;
                    $order['realname']=$member->realname;
                    $order['email']=$member->email;
                    $order['mobile']=$member->mobile;
                }
                //优惠信息
                // $favourable=Couponlog::get_one("order_id=".$order->order_id);
                // if($favourable){
                //     $coupon=Coupon::get_by_id($favourable->coupon_id);
                //     $coupon_name=$coupon->coupon_name;
                //     if(!$coupon_name){
                //         $coupon_name="";
                //     }
                //     $preferentialrule =Preferentialrule::get_one(array("classify_type=".EnumClassifyType::COUPON,"classify_id=".$favourable->coupon_id));
                //     $prefdescribe=$preferentialrule->prefdescribe;
                //     if(!$prefdescribe){
                //         $prefdescribe="";
                //     }
                //     $order['favourable']='<font>优惠券名称:'.$coupon->coupon_name.'</font><br />'.
                //                          '<font>优惠券号码:'.$favourable->couponitems_key.'</font><br />'.
                //                          '<font>优惠券描述:'.$preferentialrule->prefdescribe.'</font>';
                // }else{
                //     $order['favourable']='无';
                // }

                //卡券兑换信息
                if($order['order_type']==EnumOrderType::VOUCHER){
                    $voucheritemslog = Voucheritemslog::get_one("order_id=".$order['order_id']);
                    if($voucheritemslog->voucheritems){
                        $voucheritems = $voucheritemslog->voucheritems;
                        $order['favourable']=$voucheritems->vi_key;
                    }
                }
                if(!empty($order->pay_type)){
                    $paymenttype=Paymenttype::get_by_id($order->pay_type);
                    if($paymenttype)$order['name_pay_type']=$paymenttype->name;
                }
                if ($order->country){
                    $region=Region::get_by_id($order->country);
                    if($region)$order['region_name_country']=$region->region_name;
                }
                if ($order->province){
                    $region=Region::get_by_id($order->province);
                    if($region)$order['region_name_province']=$region->region_name;
                }
                if ($order->city){
                    $region=Region::get_by_id($order->city);
                    if($region)$order['region_name_city']=$region->region_name;
                }
                if ($order->district){
                    $region=Region::get_by_id($order->district);
                    if($region)$order['region_name_district']=$region->region_name;
                }
                if($order->ship_type){
                    $deliverytype=Deliverytype::get_by_id($order->ship_type);
                    if($deliverytype)$order['name_ship_type']=$deliverytype->name;
                }
                if($order->pay_type){
                    $paytype=Paymenttype::get_by_id($order->pay_type);
                    if($paytype)$order['pay_typeShow']=$paytype->name;
                }
                $order['ordertime']=UtilDateTime::timestampToDateTime($order->ordertime);
                $order['ship_time']=$order->ship_time;
                $workflow=Workfloworder::get_one(array("order_id"=>$order->order_id,"type"=>EnumWorkfloworderType::PURCHASER));
                if ($workflow&&($workflow->isConfirm)){
                    $operator=Admin::get_by_id($workflow->operator_id);
                    $order["purchaser_man"]=$operator->realname;
                    $order["purchaser_memo"]=$workflow->operator_memo;
                    $order["purchasertime"]=$workflow->updateTime;
                }
                $workflow=Workfloworder::get_one(array("order_id"=>$order->order_id,"type"=>EnumWorkfloworderType::KEFU));
                if ($workflow&&($workflow->isConfirm)){
                    $operator=Admin::get_by_id($workflow->operator_id);
                    $order["kefu_man"]=$operator->realname;
                    $order["kefu_memo"]=$workflow->operator_memo;
                    $order["kefutime"]=$workflow->updateTime;
                }
                $workflow=Workfloworder::get_one(array("order_id"=>$order->order_id,"type"=>EnumWorkfloworderType::ACCOUT));
                if ($workflow&&($workflow->isConfirm)){
                    $operator=Admin::get_by_id($workflow->operator_id);
                    $order["account_man"]=$operator->realname;
                    $order["account_memo"]=$workflow->operator_memo;
                    $order["accounttime"]=$workflow->updateTime;
                }
                $workflow=Workfloworder::get_one(array("order_id"=>$order->order_id,"type"=>EnumWorkfloworderType::SEND));
                if ($workflow&&($workflow->isConfirm)){
                    $operator=Admin::get_by_id($workflow->operator_id);
                    $order["send_man"]=$operator->realname;
                    $order["send_memo"]=$workflow->operator_memo;
                    $order["sendtime"]=$workflow->updateTime;
                }
                $workflow=Workfloworder::get_one(array("order_id"=>$order->order_id,"type"=>EnumWorkfloworderType::RECEIVE));
                if ($workflow&&($workflow->isConfirm)){
                    $operator=Admin::get_by_id($workflow->operator_id);
                    $order["receive_man"]=$operator->realname;
                    $order["receive_memo"]=$workflow->operator_memo;
                    $order["receivetime"]=$workflow->updateTime;
                }
            }
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        return array(
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }

    /**
     * 批量上传订单
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."order" . DS . "import" . DS . "order$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Order::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $order) {
                        $order=new Order($order);
                        if (!EnumOrderStatus::isEnumValue($order["status"])){
                            $order["status"]=EnumOrderStatus::statusByShow($order["status"]);
                        }
                        if (!EnumPayStatus::isEnumValue($order["pay_status"])){
                            $order["pay_status"]=EnumPayStatus::pay_statusByShow($order["pay_status"]);
                        }
                        if (!EnumShipStatus::isEnumValue($order["ship_status"])){
                            $order["ship_status"]=EnumShipStatus::ship_statusByShow($order["ship_status"]);
                        }
                        $order_id=$order->getId();
                        if (!empty($order_id)){
                            $hadOrder=Order::get_by_id($order->getId());
                            if ($hadOrder!=null){
                                $result=$order->update();
                            }else{
                                $result=$order->save();
                            }
                        }else{
                            $result=$order->save();
                        }
                    }
                }else{
                    $result=false;
                }
            }else{
                return $result;
            }
        }
        return array(
            'success' => true,
            'data'    => $result
        );
    }

    /**
     * 导出订单
     * @param mixed $filter
     */
    public function exportOrder($filter=null)
    {
        $condition = UtilObject::object_to_array($filter);
        if (!empty($condition)&&(count($condition)>0)){
            unset($condition['start'], $condition['limit']);
            $conditionArr = array();
            foreach ($condition as $key=>$value) {
                if ( $key == "order_starttime" || $key == "order_endtime" ) {
                  continue;
                }

                if (!UtilString::is_utf8($value)){
                    $value=UtilString::gbk2utf8($value);
                }
                if (is_numeric($value)){
                    $conditionArr[]=$key."='".$value."'";
                }else{
                    if(!empty($value)){
                        $conditionArr[]=$key." like '%".$value."%'";
                    }
                }
            }
            $condition_time = "";
            if ( array_key_exists("order_starttime", $condition) || array_key_exists("order_endtime", $condition) ) {
              if (!empty($condition["order_starttime"])&&!empty($condition["order_endtime"])) {
                $order_starttime = $condition["order_starttime"];
                $order_endtime   = $condition["order_endtime"];
                if (!$order_starttime) {
                  $order_starttime = $order_endtime;
                }
                $order_starttime = str_replace("T"," ", $order_starttime);
                if (!$order_endtime) {
                  $order_endtime = $order_starttime;
                }
                if (strlen($order_endtime) >= 10) $order_endtime = substr($order_endtime, 0, 10) . " 23:59:59";
                if ( $conditionArr && count($conditionArr) > 0 ) $condition_time = " and ";
                $order_starttime = UtilDateTime::dateToTimestamp($order_starttime);
                $order_endtime   = UtilDateTime::dateToTimestamp($order_endtime);
                $condition_time .= " ordertime between '" . $order_starttime . "' and '" . $order_endtime . "'";
              }
            }
            $condition = implode(" and ",$conditionArr) . $condition_time;
        }
        $orders = Order::get( $condition );
        $data   = array();
        if ( ( !empty($orders) ) && ( count($orders) > 0 ) )
        {
            Order::propertyShow($data,array('status','pay_status','ship_status'));
            foreach ($orders as $order) {
                $order->status      = $order->statusShow;
                $order->pay_status  = $order->pay_statusShow;
                $order->ship_status = $order->ship_statusShow;
                $order->send_status = $order->ship_status;
                $order->ordertime   = UtilDateTime::timestampToDateTime($order->ordertime);
                $order_data_p = $order;
                $member = Member::get_by_id($order->member_id);
                if ( $member ) {
                    $order_data_p->username = $member->username;
                    $order_data_p->cardno   = $member->cardno;
                    $order_data_p->mobile   = $member->mobile;
                }
                $pay_type = Paymenttype::get_by_id($order->pay_type);
                if ( $pay_type ) $order_data_p->pay_type = $pay_type->name;
                $ordergoods = $order->ordergoods;
                if ( $ordergoods && count($ordergoods) > 0 ) {
                    foreach ($ordergoods as $order_goods) {
                        $order_data = clone $order_data_p;
                        if ($order_goods) {
                          $order_data->nums        = $order_goods->nums;
                          $order_data->order_price = $order_goods->price;
                          $order_data->amount      = $order_goods->amount;
                          $order_data->jifen       = $order_goods->jifen;
                          $order_data->total_jifen = $order_goods->jifen * $order_goods->nums;

                          $product = Product::get_by_id($order_goods->goods_id);
                          if ( $product ) {
                              $order_data->product_code = $product->product_code;
                              $order_data->product_name = $product->product_name;
                              $order_data->product_no   = $product->goods_no;
                              $order_data->price        = $product->cost;
                              $order_data->total_amount = $product->cost * $order_data->nums;
                              $order_data->scale        = $product->scale;
                              $order_data->brand_id     = $product->brand->brand_name;

                              $supplier_id = $product-> supplier_id;
                              if ( $supplier_id ) {
                                $supplier = Supplier::get_by_id( $supplier_id );
                                if ( $supplier ) {
                                  $order_data->supplier     = $supplier->sp_name;
                                  $order_data->bank_account = $supplier->bank_account;
                                  $order_data->bank_init    = $supplier->bank_init;
                                }
                              }
                          }
                          $data[] = $order_data;
                        }
                    }
                } else {
                    $data[] = $order_data;
                }

            }
        }
        $arr_output_header = array(
            "order_no"     => "订单号",
            "ordertime"    => "下单日期",
            "username"     => "会员",
            "cardno"       => "会员编码",
            "mobile"       => "会员手机号",
            "product_code" => "商品货号",
            "product_name" => "商品名称",
            "product_no"   => "货品内部编号",
            "brand_id"     => "品牌",
            "scale"        => "规格简述",
            "nums"         => "订购数量",
            "price"        => "单价",
            "total_amount" => "总价",
            "order_price"  => "单额",
            "amount"       => "总额",
            "jifen"        => "单额",
            "total_jifen"  => "总额",
            "intro"        => "备注",
            "status"       => "订单状态",
            "pay_status"   => "支付状态",
            "ship_status"  => "物流状态",
            "pay_type"     => "支付方式",
            "ship_name"    => "收货人",
            "ship_mobile"  => "电话",
            "ship_addr"    => "收货地址",
            "send_status"  => "发货状态",
            "supplier"     => "供货商名称",
            "bank_account" => "银行账户",
            "bank_init"    => "开户银行"
        );
        $arr_output_header_ext = array(
            "成本价（元）",
            "订单额（元）",
            "券额"
        );

        unset($arr_output_header['updateTime']);
        unset($arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."order" . DS . "export" . DS . "order$diffpart.xls";
        UtilFileSystem::createDir(dirname($outputFileName));
        UtilExcelOrder::arraytoExcel($arr_output_header, $arr_output_header_ext, $data, $outputFileName, false);
        $downloadPath  =Gc::$attachment_url."order/export/order$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }

    /**
    * 根据订单号显示编辑后的商品名称
    * order_id 订单号
    * product_id 商品号
    * product_io 商品情况，增加或者减少
    * product_io = "add" || "del"
    * return product_array
    */
    public function showproducts($formPacket=null)
    {
        //$order_id,$product_id,$product_io
        $condition=UtilObject::object_to_array($formPacket);
        $order_id = $condition['order_id'];
        $products = array();
        if(!empty($order_id)){
            $order = Order::get_by_id($order_id);
            if(!empty($order)){
                $orderproducts = Orderproducts::get(array("order_id"=>$order->order_id));
                if(!empty($orderproducts)){
                    foreach ($orderproducts as $key => $orderproduct) {
                        $product = Product::get_by_id($orderproduct->product_id);
                        if(!empty($product))
                            $product['orderproducts_id'] = $orderproduct['orderproducts_id'];
                            $product['member_id'] = $orderproduct['member_id'];
                            $product['order_id'] = $orderproduct['order_id'];
                            $product['url'] = $orderproduct['url'];
                            $product['amount'] = $orderproduct['amount'];
                            $product['price'] = $orderproduct['price'];
                            $product['nums'] = $orderproduct['nums'];
                            $products[$key] = $product;
                    }
                }
            }
        }
        return array(
            "success"=>true,
            "data" => $products
        );
    }

}
?>
