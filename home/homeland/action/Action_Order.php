<?php
/**
 +---------------------------------------<br/>
 * 控制器:订单<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Order extends ActionMobile
{
    /**
     * 订单列表
     */
    public function lists()
    {
        $member_id = HttpSession::get("member_id");
        if(!$member_id){
            $this->redirect("member", "view");
            die();
        }
        $orders = Order::get("member_id=".$member_id);
        if (!empty($orders)) {
            foreach ($orders as $key => $value) {
                $orders[$key]->status = EnumOrderStatus::statusShow($value->status);
                $orders[$key]->pay_status = $value->pay_status;
                $orders[$key]->ship_status = EnumShipStatus::ship_statusShow($value->ship_status);
                $orders[$key]->ordertime = date("Y-m-d H:i:s",$value->ordertime);
                $ordergoods = Ordergoods::get("order_id=".$value->order_id);
                foreach($ordergoods as $eachgoods){
                    // $goods=Goods::get_by_id($eachgoods->goods_id);
                    $eachgoods->image=Product::get_by_id($eachgoods->goods_id)->image;
                }
                $orders[$key]->goods =$ordergoods;
            }
        }

        $this->view->set("orders",$orders);
    }

    /**
     * 订单详情
     */
    public function info(){
        $this->loadCss("resources/css/order.css");
        $orderId = isset($_GET['id'])?$_GET['id']:0;
        if($orderId){
            $orders = Order::get_by_id($orderId);
            $orders->pay_status = EnumPayStatus::pay_statusShow($orders->pay_status);
            $orders->ship_status = EnumShipStatus::ship_statusShow($orders->ship_status);
            $orders->commitTime = date("Y-m-d H:i:s",$orders->commitTime);
            $ordergoods = Ordergoods::get("order_id=".$orderId);
            foreach($ordergoods as $eachgoods){
                // $goods=Goods::get_by_id($eachgoods->goods_id);
                $eachgoods->image=Product::get_by_id($eachgoods->goods_id)->image;
            }
            $this->view->set("orders",$orders);
            $this->view->set("ordergoods",$ordergoods);
            $province = Region::get_by_id($orders->province)->region_name;
            $city = Region::get_by_id($orders->city)->region_name;
            $district = Region::get_by_id($orders->district)->region_name;
            $address = $province." ".$city." ".$district." ".$orders->ship_addr;
            $this->view->set("address",$address);
            $this->view->set("site_name","订单详情");
        }else{
            $this->redirect("order", "lists");
        }
        
    }

    /**
     *填写订单收货地址
     */
    public function add(){
        $this->loadCss("resources/css/address.css");
        $this->loadCss("resources/css/msg.css");
        $this->loadJs("js/msg.js"); 
        $this->loadJs("js/order.js");
        $post = $_POST;

        $cart = isset($post['cart'])?$post['cart']:"";
        if ($cart) {
            $price = Cart::getCartPrice();
        }else{
            $price = $post['sales_price']*$post['num'];
        }

        $randnumber=UtilString::build_count_rand(1,5);//随机数
        $post['order_no']=time().$randnumber[0];

        $this->view->set("price",$price);
        $this->view->set("cart",$cart);
        $this->view->set("goods",$post);
        $this->view->set("site_name","填写收货地址"); 
    }
    /**
     *提交订单
     */
    public function checkOrder(){
        $member_id = HttpSession::get("member_id");
        $cardno = HttpSession::get("cardno");
        $cart = isset($_POST['cart'])?$_POST['cart']:"";
        if ($cart) {
            $cost_item = Cart::getCartPrice(); //商品总额
        }else{
            $goods = Goods::get_by_id($_POST['goods_id']);
            $cost_item = $goods->sales_price*$_POST['num'];  //商品总额
        }
        $cost_other = 0;   //其他费用
        $total_amount = $cost_item + $cost_other;  //订单总额
        $data['cardno']= $cardno;
        $data['passwd']= isset($_POST['passwd'])?$_POST['passwd']:'123456';
        $data['saving_sub']= $total_amount;
        $data['cash']= 0;
        $data['bank_amount']= 0;
        $data['point_sub']= 0;
        $data['coupon_pwd']= '';
        $data['order_number'] = isset($_POST['order_no'])?$_POST['order_no']:"";
        $data['store_id'] = 0;
        $result = UtilApi::trade($data);
        if ($result->code == "A00006") {
            //生成订单
            $order = new Order();
            $order->order_no  = $_POST['order_no'];  //订单号\n',
            $order->member_id = $member_id;  //会员标识',
            $order->member_no = $cardno;  //会员号',
            $order->order_type= '2';  //订单类型0:电话订单-phone1:网上订单-web2:卡券提领订单-voucher',
            $order->status= 'active';  //订单状态active:有效confirm:待确认finish:完成dead:无效audit:待审核',
            $order->pay_status= '1';  //支付状态 0:准备支付-ready 1:支付成功-succ 2:支付中-progress 3:支付失败-failed 4:取消支付-cancel 5:退款-returneds 6:支付错误-error 7:非法支付-invalid 8:支付超时-timeout 9:部分退款-returnedpart 10:已收款-well',
            $order->ship_status= '0';  //物流状态0:未发货-undispatch1:已发货-dispatch2:部分发货-dispatchpart3:部分退货-returnedpart4:已退货-returned5:已签收-signed',
            $order->total_amount= $total_amount;  //订单总额',
            $order->final_amount= $total_amount;  //成交总价格',
            $order->cost_item= $cost_item;  //商品总价格',
            $order->cost_other= $cost_other;  //其他费用.\n如货运费，税费，保价等。',
            $order->pmt_amount= 0;  //促销优惠总金额',
            $order->pay_type='';  //支付方式标识',
            $order->country='';  //国家\n参考region表的region_id字段',
            $order->province='';  //省\n参考region表的region_id字段',
            $order->city='';  //市\n参考region表的region_id字段',
            $order->district='';  //区\n参考region表的region_id字段',
            $order->ship_addr=$_POST['ship_addr'];  //收货地址',
            $order->ship_name=$_POST['ship_name'];  //收货人',
            $order->ship_tel='';  //收货电话',
            $order->ship_mobile=$_POST['ship_mobile'];  //收货手机',
            $order->ship_time='';  //送货时间如:     任何日期任何时间段     仅工作日上午     仅工作日下午     仅休息日下午     2011-05-01 下午',
            $order->ship_type='';  //配送方式标识\n',
            $order->ship_sign_building='';  //'标志建筑',
            $order->best_path='';  //最佳路径',
            $order->ship_zipcode='';  //邮编',
            $order->intro='';  //订单附言',
            $order->ordertime=time();  //订购时间',
            $order->commitTime=time();  //创建时间'
            $orderId = $order->save();
            //订单日志
            $orderlog = new Orderlog();
            $orderlog->order_id=$orderId;
            $orderlog->order_no=$order->order_no;
            $orderlog->intro = "卡券提领";
            $orderlog->orderAction=EnumOrderAction::CREATE;
            $orderlog->result=EnumResult::SUCC;
            $orderlog->save();
            //订单商品
            if ($cart) {
                $cartData = Cart::get("member_id=".$member_id);
                if (!empty($cartData)) {
                    foreach ($cartData as $key => $value) {
                        $ordergoods = new Ordergoods();
                        $ordergoods->member_id=$member_id;
                        $ordergoods->order_id=$orderId;
                        $ordergoods->price=$value->price;
                        $ordergoods->nums=$value->num;
                        $ordergoods->amount=$value->price*$value->num;
                        $ordergoods->goods_id=$value->goods_id;
                        $ordergoods->goods_code=$value->product_code;
                        $ordergoods->goods_name=$value->product_name;
                        $od_id=$ordergoods->save();
                        Cart::deleteByID($value->cart_id);
                    }
                }
            }else{
                $ordergoods = new Ordergoods();
                $ordergoods->member_id=$member_id;
                $ordergoods->order_id=$orderId;
                $ordergoods->price=$goods->sales_price;
                $ordergoods->nums=$_POST['num'];
                $ordergoods->amount=$goods->sales_price*$_POST['num'];
                $ordergoods->goods_id=$goods->goods_id;
                $ordergoods->goods_code=$goods->goods_code;
                $ordergoods->goods_name=$goods->goods_name;
                $od_id=$ordergoods->save();
            }
            

            $response = array(
                "success" => "success",
                "title"=>"成功",
                "data" =>"下单成功"
            );
        }else{
            $response = array(
                "success" => "no",
                "title"=>"失败",
                "data" => $result->result            
            );
        }
        echo json_encode($response);
        exit;
    }
    
}

?>