<?php
/**
 +---------------------------------------<br/>
 * 控制器:票卡券处理<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author fxf 924197212@qq.com
 */
class Action_Voucher extends Action
{

    public function index(){
        $this->loadCss("resources/css/voucher_index.css");
    }
    /**
     * 礼券兑换页面
     */
    public function login(){
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/voucher.css");
        $this->loadJs("js/voucher.js");
    }

    /**
    * 礼券兑换商品选择页面
    */
    public function view(){
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/voucher.css");
        $this->loadJs("js/voucher_view.js");
        $vi_key = htmlspecialchars(trim($_POST["voucher_key"]));//卡券号码
        $vi_cipher = htmlspecialchars(trim($_POST["voucher_cipher"]));//卡券密码
        //post提交且值不为空
        if($_POST&&$vi_key&&$vi_cipher){
            //查询条件
            $where_clause = array(
                "vi_key"=>$vi_key,
                "vi_cipher"=>$vi_cipher
            );
            //验证卡券
            $result = $this->voucherInspect($where_clause);
            if($result){
                HttpSession::set("vi_key",$vi_key);//保存优惠券号码

                $this->view->set("exchangegoods",$result);
                $this->view->set("paytype",1);  //券兑换
            }else{
                //验证礼卡
                $result = $this->cardinspect($where_clause);
                if($result){
                    HttpSession::set("vi_key",$vi_key);//保存优惠券号码
                    HttpSession::set("vi_cipher",$vi_cipher);//保存优惠券密码
                    $this->view->set("exchangegoods",$result);
                    $this->view->set("paytype",2);  //卡值兑换
                }else{
                    $this->doException(4);
                }

            }
        }else{
            $this->doException(1);
        }
    }

    /**
    * 验证卡,返回卡券关联货品或者false
    * @param mixed $where_clause 卡券查询条件
    */
    public function cardinspect($where_clause,$goods_id=""){
        //判断是否为礼卡
        $result = UtilApi::getMember($where_clause['vi_key'],$where_clause['vi_cipher']);

        if ($result->code == "A00006") {
            $member = $result->data;
            //根据会员卡的储值显示商品
            $where = "isValid=1";
            if ((int)$member->user_balance ==300) {
                $voucher_name = "菲彼生活卡300型";
                $where .= " and voucher_name='".$voucher_name."'";
            }elseif ((int)$member->user_balance ==500){
                $voucher_name = "菲彼生活卡500型";
                $where .= " and voucher_name='".$voucher_name."'";
            }elseif ((int)$member->user_balance ==1500){
                $voucher_name = "菲彼生活卡1500型";
                $where .= " and voucher_name='".$voucher_name."'";
            }
            $voucher = Voucher::get_one($where);
            $where = "";
            if (!empty($voucher)) {
                $vouchergoods = Vouchergoods::get("isValid=1 and voucher_id=".$voucher->voucher_id);
                if (!empty($vouchergoods)) {
                    $goodsid = array();
                    if ($goods_id) {
                        foreach ($vouchergoods as $key => $value) {
                            if ($goods_id == $value->goods_id) {
                                $goodsid[]= $value->goods_id;
                            }
                        }
                    }else{
                        foreach ($vouchergoods as $key => $value) {
                            $goodsid[]= $value->goods_id;
                        }
                    }

                    $where .="isUp=1 and goods_id in(".implode(",",$goodsid).")";
                }else{
                   $where .=" 1=2";
                }
            }else{
                $where .=" 1=2";
            }

            $goods = Goods::get($where);
            if(!empty($goods)){
                foreach ($goods as $key => $value) {
                    $product = Product::get_by_id($value->product_id);
                    $goods[$key]->image = $product->image;
                    $goods[$key]->info  = $product->message;
                    $goods[$key]->num   = 1;//默认兑换1件
                }
            }
            return $goods;
        }
        return false;
    }

    /**
     * 确认结算页面
     */
    public function checkoutview(){
        $this->loadJs("js/voucher_checkout.js");
        $this->loadCss("resources/css/voucher_checkout.css");
        $this->loadJs("js/utils.js");
        $this->loadJs("js/AjaxClass.js");
        $this->loadJs("js/region/region.js");

        $vi_key = HttpSession::get('vi_key');//优惠券号码
        $goods_id = trim($_POST["goods_id"]);//货品标识
        $paytype = trim($_POST['paytype']); //支付方式
        if($_POST && $goods_id && $vi_key){
            //查询条件
            $where_clause = array(
                "vi_key"=>$vi_key
            );
            //验证卡券
            if ($paytype==1) {
                $result = $this->voucherInspect($where_clause,$goods_id);
            }elseif ($paytype==2) {
                $where_clause['vi_cipher']="";
                $result = $this->cardinspect($where_clause,$goods_id);
            }

            if($result){
                HttpSession::set("goods_id",$goods_id);//保存所选择货品的ID
                $totalprice = 0;
                foreach($result as $goods){
                    //$totalprice += $goods->sales_price*$goods->num;
                    $totalprice += $goods->market_price*$goods->num;
                }
                $delivery = 9;//暂定
                $this->view->set("delivery",$delivery);
                $this->view->set("totalprice",$totalprice);
                $this->view->set("goods",$result);
                $this->view->set("paytype",$paytype);
            }else{

            }
        }else{
            $this->doException(1);
        }
    }

    /**
     * 结算
     */
    public function checkoutover(){
        $vi_key   = HttpSession::get('vi_key');//优惠券号码
        $vi_cipher   = HttpSession::get('vi_cipher');//优惠券密码

        $goods_id = HttpSession::get('goods_id');//货品标识
        $paytype = trim($_POST['paytype']); //支付方式
        if($_POST && $vi_key && $goods_id){
            HttpSession::removes(array("vi_key","goods_id"));
            //查询条件
            $where_clause = array(
                "vi_key"=>$vi_key
            );
            //验证卡券
            if ($paytype==1) {
                $result = $this->voucherInspect($where_clause,$goods_id);
            }elseif ($paytype==2) {
                $where_clause['vi_cipher']="";
                $result = $this->cardinspect($where_clause,$goods_id);
            }
            $goods = $result[0];
            if($result && $goods){
                if ($paytype==2) {
                    /*--更新卡储值--*/
                    $card = UtilApi::getMember($vi_key);
                    $member = $card->data;
                    $data['cardno']= $vi_key;
                    $data['passwd']= $vi_cipher;
                    $data['saving_sub']= $member->user_balance;
                    $data['cash']= 0;
                    $data['bank_amount']= 0;
                    $data['point_sub']= 0;
                    $data['coupon_pwd']= '';
                    $data['order_number'] = "WL".time();
                    $data['store_id'] = 0;
                    $result = UtilApi::trade($data);
                    if ($result->code != "A00006") {
                        $this->doException(5);
                        die();
                    }
                }
                $minfo=$this->noteMember();//注册会员
                $order=$this->orderInit();//订单初始化

                //to-do 会员卡号
                $order->member_no = $vi_key;

                $order=$this->setMemberInfo($order,$minfo);//处理订单收货人相关
                $order=$this->settleAccount($order,$goods);//处理订单结算相关
                $order_id=$order->save();

                $ordergoods=new Ordergoods();
                $ordergoods->member_id  = $minfo["member_id"];
                $ordergoods->order_id   = $order_id;
                $ordergoods->price      = $goods->market_price;//卡券货品为市场价
                $ordergoods->nums       = $goods->num;
                $ordergoods->amount     = $goods->market_price*$goods->num;//卡券货品为市场价
                $ordergoods->goods_id   = $goods->goods_id;
                $ordergoods->goods_code = $goods->goods_code;
                $ordergoods->goods_name = $goods->goods_name;
                $ordergoods->save();//保存订单货品

                /*--订单创建日志--*/
                $orderlog = new Orderlog();
                $orderlog->order_id    = $order_id;
                $orderlog->order_no    = $order->order_no;
                $orderlog->orderAction = EnumOrderAction::CREATE;
                $orderlog->result      = EnumResult::SUCC;
                $orderlog->intro       = "卡券提领";
                $orderlog->save();

                if ($paytype==1) {
                   /*--更新卡券兑换状态--*/
                    Voucheritems::updateBy("voucheritems_id=".$goods->voucheritems_id,"isExchange=true");
                }

                /*--卡券兑换日志--*/
                $vilog = new Voucheritemslog();
                $vilog->voucher_id      = $goods->voucher_id;
                $vilog->voucheritems_id = $goods->voucheritems_id;
                $vilog->order_id        = $order_id;
                $vilog->username        = $minfo["consignee"];
                $vilog->phone           = $minfo["contactway"];
                $vilog->save();

                //跳转至订单详情页面
                $this->redirect("member","order_detail","order_id=$order_id&type=".EnumViewInfoType::PAYOVER.($minfo["newmember"]?"&isnew=1":""));
            }else{
                $this->doException(2);
            }
        }else{
            $this->doException(1);
        }
    }

    /**
    * 验证卡券,返回卡券关联货品或者false
    * @param mixed $where_clause 卡券查询条件
    * @param mixed $goods_id 选择的货品
    */
    private function voucherInspect($where_clause,$goods_id=null){
        /*****卡券号码印刷错误修改*****/
        $voucher_key=$where_clause["vi_key"];//卡券号码
        $where_clause["vi_key"]=preg_replace('/^800/',"0800",$voucher_key);//以800开头的替换成0800
        /*****卡券号码印刷错误修改*****/

        $now = UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);//当前时间戳
        $vi = Voucheritems::get_one($where_clause);//卡券实体记录
        $voucher = $vi->voucher;//卡券规则
        $vouchergoods = $voucher->vouchergoods;//卡券可兑换货品
        $exchangegoods = array();
        if($goods_id){
            foreach($vouchergoods as $items){
                //筛选有效的关联货品
                if($items->isValid && $items->goods_id==$goods_id){
                    $goods = $items->goods;
                    //货品上架状态
                    if($goods->isUp){
                        $goods->num             = 1;//默认兑换1件
                        $goods->voucher_id      = $voucher->voucher_id;//卡券类型ID
                        $goods->voucheritems_id = $vi->voucheritems_id;//卡券ID
                        $exchangegoods[] = $goods;
                        break;
                    }
                }
            }
        }else{
            foreach($vouchergoods as $items){
                //筛选有效的关联货品
                if($items->isValid){
                    $goods = $items->goods;
                    //货品缺货则在前台显示
                    $product = $goods->product;
                    if($product){
                        $goods->image = $product->image;
                        $goods->info  = $product->message;
                        $goods->num   = 1;//默认兑换1件
                        $exchangegoods[] = $goods;
                    }
                }
            }
        }
        //兑换规则完善，且符合兑换条件
        if($vi && $voucher && $now<$voucher->begin_time){
            $this->doException(3);
            die();
        }
        if($vi && $voucher && $exchangegoods && !$vi->isExchange && $now>=$voucher->begin_time && $now<=$voucher->end_time)return $exchangegoods ;else return false;
    }

    /**
    * 生成会员相关记录
    *
    */
    private function noteMember(){
        $email     = $_POST["email"];//用户邮箱
        $consignee = $_POST["consignee"];//会员姓名
        $country   = $_POST["country"];//国家
        $province  = $_POST["province"];//省
        $city      = $_POST["city"];//市
        $district  = $_POST["district"];//区县
        $zipcode   = $_POST["zipcode"];//邮编
        $addr_info = $_POST["address"];//详细地址
        $mobile    = $_POST["mobile"];//手机

        $prefix = $consignee;
        $suffix = $mobile;
        //中文转成拼音
        $is_chinese = UtilString::is_chinese($prefix);
        if($is_chinese){
            $prefix = UtilPinyin::translate($prefix);
        }

        $isnew = true;
        $username = $prefix.$suffix;//用户名为收货人加手机号码
        $isexist = Member::existBy("username='$username'");//判断用户名是否存在
        if($isexist){
            $member    = Member::get_one("username='$username'");
            $member_id = $member->member_id;
            $isnew     = false;
        }else{
            $passwd = 123456;//用户密码:默认123456
            //注册用户
            $member=new Member();
            $member->username=$username;//创建用户名
            $member->password=md5($passwd);
            $member->email=$email;
            $member->regtime=UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);
            $member->usertype=EnumUsertype::MEMBER;
            $member->regip=UtilNet::client_ip();
            $member_id=$member->save();
        }
        //设置会员登录
        HttpSession::set('member_id',$member_id);
        HttpSession::set('member_name',$member->username);

        //会员地址信息
        $address=new Address();
        $address->member_id=$member_id;
        $address->consignee=$consignee;
        $address->country=$country;
        $address->province=$province;
        $address->city=$city;
        $address->district=$district;
        $address->zipcode=$zipcode;
        $address->address=$addr_info;
        $address->tel=$tel;
        $address->mobile=$mobile;
        $address_id=$address->save();

        $minfo["member_id"]  = $member_id;
        $minfo["address_id"] = $address_id;
        $minfo["consignee"]  = $consignee;
        $minfo["contactway"] = $mobile;
        $minfo["newmember"]  = $isnew;
        return $minfo;
    }

    /**
     * 订单初始化
     * 返回初始化订单对象
     */
    private function orderInit()
    {
        $randnumber=UtilString::build_count_rand(1,5);//生成订单号
        $order=new Order();//创建订单实例
        $order->order_no    = time().$randnumber[0];
        $order->order_type  = EnumOrderType::VOUCHER;//卡券提领订单
        $order->status      = EnumOrderStatus::ACTIVE;//订单状态:有效
        $order->pay_status  = EnumPayStatus::SUCC;//支付状态:支付成功
        $order->ship_status = EnumShipStatus::UNDISPATCH;//发货状态:未发货
        $order->ordertime   = UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);//订购时间
        return $order;
    }

    /**
     * 设置订单收货信息
     * 返回订单对象
     */
    private function setMemberInfo($order,$minfo)
    {
        $address_id = $minfo["address_id"];
        $member_id  = $minfo["member_id"];
        $ship_type  = $this->data["delivtype"];
        $remark     = $this->data["remark"];//客户备注
        $address=Address::get_by_id($address_id);
        if ($address){
            //填写订单信息
            $order->member_id          = $member_id;
            $order->country            = $address->country;
            $order->province           = $address->province;
            $order->city               = $address->city;
            $order->district           = $address->district;
            $order->ship_addr          = $address->address;
            $order->ship_name          = $address->consignee;
            $order->ship_mobile        = $address->mobile;
            $order->ship_type          = $ship_type;
            $order->ship_zipcode       = $address->zipcode;
            $order->ship_sign_building = $address->sign_building;
            $order->remark             = $remark;
        }
        return $order;
    }

    /**
     * 订单金额结算
     * 返回订单对象
     */
    private function settleAccount($order,$goods)
    {
        $itemstotal = $goods->market_price*$goods->num;//商品市场价总计
        $totalPrice = $goods->sales_price*$goods->num;//商品销售价总计
        $order->cost_item    = $itemstotal;//卡券兑换货品的显示价格
        $order->cost_other   = 0;
        $order->pmt_amount   = 0;
        $order->total_amount = $totalPrice;
        $order->final_amount = $totalPrice;
        return $order;
    }

    /**
    * Exception Handler
    *
    * @param mixed $flag 返回状态
    */
    private function doException($flag){
        $this->redirect("voucher","login","flag=".$flag);
    }
}

?>
