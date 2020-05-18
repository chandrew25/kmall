<?php
/**
 * 控制器:结算<br/>
 * User: jason
 * Date: 2019/2/21
 * Time: 11:32 PM
 */
class Action_Checkout extends ActionMobile
{
    /**
     * 结算页面
     */
    public function view()
    {
        $this->loadCss("resources/css/chekcout_view.css");
        $this->loadJs("js/checkout_view.js");
        $goods_id = isset($_GET['id'])?$_GET['id']:"";
        $this->viewOff($goods_id);

    }

    /**
    * Cookie取数据
    *
    */
    public function viewOff($goods_id)
    {
        $member_id=HttpSession::get("member_id");
        if(!$member_id || $member_id=="thirdpartylogin"){
            $backurl='http://'.$_SERVER['SERVER_NAME'].':'.$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
            setcookie("backurl",$backurl);
            $this->redirect("auth","login");
            return;
        }
        $member=Member::get_by_id($member_id);
        $member_jifen=0;
        if ($member){
          $member_jifen=$member->jifen;
          $this->view->set("member_jifen", $member_jifen);
        }
        if (empty($goods_id)) {
            $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
        }else{
            $product=Product::get_by_id($goods_id);

            $goods_arr->goods_code=$product->product_code;
            $goods_arr->goods_name=$product->productShow;
            $goods_arr->sales_price=$product->price;
            $goods_arr->goods_id=$product->product_id;
            $goods_arr->ico=$product->image;
            $goods_arr->product_id=$product->product_id;
            $goods_arr->jifen=$product->jifen;
            $goods_arr->market_price=$product->market_price;
            $goods_arr->price=$product->price;
            $goods_arr->num=1;
//            $carts = new object();
            $carts->$goods_id=$goods_arr;

            $cart_arr=json_decode(($_COOKIE[Gc::$appName."_cart"]));
            $cart_arr->$goods_id=$goods_arr;
            setcookie(Gc::$appName."_cart",json_encode($cart_arr),time()+3600*24*30,"/");
            $_COOKIE[Gc::$appName."_cart"]=json_encode($cart_arr);
        }

        // $carts=(array)$carts;
        if (empty($carts)){//会员至少选择一个商品
            $this->redirect("cart","lists");
            return;
        }
        //需要至少一个收货地址，如果没有，先填写一个收货地址
        $address_id = isset($_GET['aid'])?$_GET['aid']:"";
        if ($address_id){
            $address=Address::get_by_id($address_id);
        }else{
            $address=Address::get_one(array("member_id"=>$member_id),"updateTime desc");
        }

        if (!$address){
            $this->redirect("member","address","location=checkout");
            return;
        }else{
            $province = Region::get_by_id($address->province)->region_name;
            $city = Region::get_by_id($address->city)->region_name;
            $district = Region::get_by_id($address->district)->region_name;
            $address->allregion = $province." ".$city." ".$district;
            $this->view->set("address",$address);
        }

        //显示购物车商品列表统计信息
        $statistic=array("totalPrice"=>0, "totalJifen"=>0, "totalMarketPrice"=>0, "totalSavePrice"=>0, "ratio"=>"0");
        //最终的统计数据
        $statisticAll=array("totalPrice"=>0, "totalJifen"=>0, "deliveryFee"=>0, "realFee"=>0);

        //显示购物车商品列表信息
         foreach ($carts as $cart) {
             $cart->totalPrice=$cart->sales_price*$cart->num;
             $cart->totalJifen=$cart->jifen*$cart->num;
             $statistic["totalPrice"]+=$cart->totalPrice;
             $statistic["totalJifen"]+=$cart->totalJifen;
             $statistic["totalMarketPrice"]+=$cart->market_price*$cart->num;
         }
        $this->view->set("carts",$carts);
        $statistic["totalPrice"]=sprintf("%.2f",substr(sprintf("%.3f",$statistic["totalPrice"]), 0, -1));
        $statistic["totalSavePrice"]=$statistic["totalMarketPrice"]-$statistic["totalPrice"];
        $statistic["totalSavePrice"]=sprintf("%.2f",substr(sprintf("%.3f",$statistic["totalSavePrice"]), 0, -1));
        if ($statistic["totalPrice"]>0){
            $statistic["ratio"] =round($statistic["totalSavePrice"]/$statistic["totalMarketPrice"]*100);
        }
        //计算判断优惠条件
        $calculationfav=$this->Calculationfav($statistic["totalPrice"],$carts);
        //如果有优惠
        if($calculationfav){
            //优惠金额
            $statistic["couponprice"]=$calculationfav["couponprice"];
            $statisticAll['couponprice']=$statistic["couponprice"];
            //优惠券号码
            $couponitems_key=$calculationfav["couponitems_key"];
            $this->view->set("couponitems_key",$couponitems_key);
        }
        $statisticAll['totalPrice']=$statistic["totalPrice"];
        $statisticAll['totalJifen']=$statistic["totalJifen"];
        $this->view->set("statistic",$statistic);
        //配送方式列表
        $deliverytypes=Deliverytype::get("insure='1'");
//        if (($deliverytypes!=null)&&(count($deliverytypes)>0)){
//            if ($statisticAll['totalPrice']<$deliverytypes[0]->free_fee){
//                $statisticAll['deliveryFee']=$deliverytypes[0]->fee;
//            }
//        }
        $statisticAll['deliveryFee'] = 10;
        $this->view->set("deliverytypes",$deliverytypes);
        $statisticAll["deliveryFee"]=sprintf("%.2f",substr(sprintf("%.3f",$statisticAll["deliveryFee"]), 0, -1));
        $statisticAll['realFee']=$statisticAll['totalPrice']+$statisticAll['deliveryFee']-$statisticAll['couponprice'];
        $statisticAll['realFee']=sprintf("%.2f",substr(sprintf("%.3f",$statisticAll['realFee']), 0, -1));
        $this->view->set("statisticAll",$statisticAll);
        //支付方式列表
        $paymenttypes=Paymenttype::get("issetup=1 and level=1","sort_order desc,paymenttype_id asc");

        $this->view->set("paymenttypes",$paymenttypes);
        //导航条
//        $nav_info->level = 2;
//        $nav_info->info = "订单";
//        $nav_info->link = Gc::$url_base."index.php?go=mobile.checkout.view&location=cart";
//        $this->view->set("nav_info",$nav_info);
    }

    /**
     * 完成结算，生成订单
     */
    public function over()
    {
        $this->overOff();
    }

    /**
    *   Cookie提交订单
    */
    public function overOff()
    {
        $member_id=HttpSession::get('member_id');
        if(!$member_id){
            $this->redirect("index","index");
        }
        $sels=$this->data['sels'];
        if (empty($sels)) {
            if (empty($carts)){//会员至少选择一个商品
                $this->redirect("cart","lists");
                return;
            }
        }

        $ifcarts=json_decode($_COOKIE[Gc::$appName."_cart"]);
        $ifcarts=(array)$ifcarts;
        if (empty($ifcarts)){//会员至少选择一个商品
            $this->redirect("cart","lists");
        }
        //获取优惠券
        $couponitems_key=HttpSession::get("couponitems_key");
        $couponprice=HttpSession::get("couponprice");
        HttpSession::removes(array("couponprice","couponitems_key"));
        $order=new Order();
        $order->member_id=$member_id;

        $order->status=EnumOrderStatus::ACTIVE;
        $order->pay_status=EnumPayStatus::READY;
        $order->ship_status=EnumShipStatus::UNDISPATCH;
        $address_id=$this->data["ness_address"];
        $address=Address::get_by_id($address_id);
        $ship_type=null;//$this->data["delivtype"];
        $pbankcode=$this->data["paymenttype"];//支付方式父类型编码
        if($pbankcode=="bank"){
            $bankcode=$this->data["bankcode"];//支付平台或者支付银行编码
        }

        if (!empty($address)){
            //填写订单信息
            $randnumber=UtilString::build_count_rand(1,5);//随机数
            $order->order_no=time().$randnumber[0];
            $order->country=$address->country;
            $order->province=$address->province;
            $order->city=$address->city;
            $order->district=$address->district;
            $order->ship_addr= $address->address;
            $order->ship_name=$address->consignee;
            $order->ship_mobile=$address->mobile;
            $order->ship_type=$ship_type;
            $order->ship_zipcode=$address->zipcode;
            $order->ship_sign_building=$address->sign_building;
        }
        if ($pbankcode!="bank"){
            $paymenttype=Paymenttype::get_one("paymenttype_code='$pbankcode'");
            $order->pay_type=$paymenttype->paymenttype_id;//支付方式id
        }else{
            $paymenttype=Paymenttype::get_one("paymenttype_code='$bankcode'");
            $order->pay_type=$paymenttype->paymenttype_id;//支付方式id
        }
        //购物车商品列表信息
        $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);

        //显示购物车商品列表统计信息
        $statistic=array("totalPrice"=>0, "totalJifen"=>0, "totalMarketPrice"=>0, "totalSavePrice"=>0, "ratio"=>"0");
        //最终的统计数据
        $statisticAll=array("totalPrice"=>0, "totalJifen"=>0, "deliveryFee"=>10, "realFee"=>0);
        foreach ($sels as $key => $value) {
            $cart = $carts->$value;
            $statistic["totalPrice"]+=$cart->sales_price*$cart->num;
            $statistic["totalMarketPrice"]+=$cart->market_price*$cart->num;
            $statistic["totalJifen"]+=$cart->jifen*$cart->num;
        }
        // foreach ($carts as $cart) {
        //     $statistic["totalPrice"]+=$cart->sales_price*$cart->num;
        //     $statistic["totalMarketPrice"]+=$cart->market_price*$cart->num;
        //     $statistic["totalJifen"]+=$cart->jifen*$cart->num;
        // }
        $statistic["totalSavePrice"]=$statistic["totalMarketPrice"]-$statistic["totalPrice"];
        if ($statistic["totalPrice"]>0){
            $statistic["ratio"] =round($statistic["totalSavePrice"]/$statistic["totalMarketPrice"]*100);
        }
        $statisticAll['totalPrice']=$statistic["totalPrice"];
        $statisticAll['totalJifen']=$statistic["totalJifen"];
        $statisticAll['realFee']=$statisticAll['totalPrice']+$statisticAll['deliveryFee']-$couponprice;

        $order->cost_item=$statisticAll['totalPrice'];
        $order->cost_other=$statisticAll['deliveryFee'];
        $order->total_amount=$statisticAll['realFee'];
        $order->final_amount=$statisticAll['realFee'];
        $order->jifen=$statisticAll["totalJifen"];
        $order->pmt_amount=$couponprice;
        $order->ordertime=UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);
        $order_id=$order->save();
        //order create log
        $orderlog = new Orderlog();
        $orderlog->order_id=$order->order_id;
        $orderlog->order_no=$order->order_no;
        $orderlog->orderAction=EnumOrderAction::CREATE;
        $orderlog->result=EnumResult::SUCC;
        $orderlog->save();
        //优惠券
        if($order_id>0 && $couponprice>0 && !empty($couponitems_key)){
            $couponlog=new Couponlog();
            $couponlog->order_id=$order_id;
            $couponlog->couponitems_key=$couponitems_key;
            $couponitems=Couponitems::get_one("couponitems_key='$couponitems_key'");
            $couponlog->coupon_id=$couponitems->coupon_id;
            $couponlog->save();
            $coupon=Coupon::get_by_id($couponlog->coupon_id);
            if($coupon->coupon_type==1){
                Couponitems::updateProperties($couponitems->couponitems_id,"isExchange=1");
            }
        }
        if ($order_id>0){
            //填写发票信息
            $invoice=new Invoice();
            $invoice=$this->model->Invoice;
            $invoice->member_id=$member_id;
            $invoice->order_id=$order_id;
            $invoice->invoice_code = "kmall".time();
            $invoice->invoice_state=1;
            $invoice->price=$order->total_amount;
            $invoice->type=$this->data["invoice_type"];
            if($invoice->type==1){
                $invoice->type1_header=$this->data["invoice_head"];
                $invoice->type1_name=$this->data["invoice_name"];
            }elseif($invoice->type==2){
                $invoice->company=$this->data["company"];
                $invoice->taxpayer=$this->data["taxpayer"];
                $invoice->reg_address=$this->data["reg_address"];
                $invoice->reg_tel=$this->data["reg_tel"];
                $invoice->bank=$this->data["bank"];
                $invoice->bank_account=$this->data["bank_account"];
            }
            if($invoice->type==1&&!empty($invoice->type1_name)||$invoice->type==2&&!empty($invoice->company)){
                $invoice->save();
                Order::updateProperties($order_id,"invoice_id=".$invoice->invoice_id);
            }
            foreach ($sels as $key => $cart) {
                $value = $carts->$cart;
            // foreach ($carts as $cart=>$value) {
                $ordergoods=new Ordergoods();
                $ordergoods->member_id=$member_id;
                $ordergoods->order_id=$order_id;
                $ordergoods->price=$value->sales_price;
                $ordergoods->nums=$value->num;
                $ordergoods->amount=$value->sales_price*$value->num;
                $ordergoods->jifen=$value->jifen;
                $ordergoods->goods_id=$value->goods_id;
                $ordergoods->goods_code=$value->goods_code;
                $ordergoods->goods_name=$value->goods_name;
                $od_id=$ordergoods->save();
                //如果存在赠品
                if($value->gift_arr){
                    foreach($value->gift_arr as $gift){
                        $ordergift=new Ordergoods();
                        //标记为赠品
                        $ordergift->od_id=$od_id;
                        $ordergift->member_id=$member_id;
                        $ordergift->order_id=$order_id;
                        $ordergift->price=$gift->gift_price;
                        $ordergift->nums=$gift->gift_num;
                        $ordergift->amount=$gift->gift_price*$gift->gift_num;
                        $ordergift->goods_id=$gift->gift_id;
                        $ordergift->goods_code=$gift->gift_code;
                        $ordergift->goods_name=$gift->gift_name;
                        $ordergift->isGiveaway=1;
                        $ordergift->save();
                    }
                }
                unset($carts->$cart);
            }
            setcookie(Gc::$appName."_cart",json_encode($carts),time()+3600*24*30,"/");
        }
        //当选择网上支付时
        if ($pbankcode=="bank" || $pbankcode=="alipay" || $pbankcode=="wxpay"){
               $this->redirect("checkout","show","order_id=".$order_id);
        }elseif($pbankcode=="jifen"){
            $order = Order::get_by_id($order_id);
            $member = Member::get_by_id($member_id);
            $member->jifen = $member->jifen - $order->jifen;
            $member->update();
            $order->pay_status=EnumPayStatus::SUCC;
            $order->update();
            //积分日志
            $jifenlog=new Jifenlog();
            $jifenlog->member_id=$member_id;
            $jifenlog->jifenoriginal=$member->jifen;
            $jifenlog->jifenreduce=$order->jifen;
            $jifenlog->discribe="购买商品使用券支付";
            $jifenlog->save();
            $rankjifenlog=new Rankjifenlog();
            $rankjifenlog->member_id=$member_id;
            $rankjifenlog->jifenoriginal=$member->jifen;
            $rankjifenlog->jifenreduce=$order->jifen;
            $rankjifenlog->discribe="购买商品使用券支付";
            $rankjifenlog->save();
            $this->redirect("member","order_detail","order_id=".$order_id);
        }else{
            $banksrc=$this->data["banksrc"];
            $bankcode=$this->data["bankcode"];
            $this->redirect("member","order_detail","order_id=$order_id&type=".EnumViewInfoType::CHECKOUTOVER.(empty($banksrc)?"":"&banksrc=".$banksrc."&bankcode=".$bankcode));
            /*$this->redirect("member","order_detail","order_id=".$order_id);*/
        }
    }

    /**
     * 转账交易
     */
    public function account(){
        //需要先登陆
        if(!HttpSession::isHave('member_id')){
            $this->redirect("auth","login");
            return;
        }
        $orderId=$this->data["order_id"];
        $order=Order::get_by_id($orderId);
        if(empty($order)){
            $this->redirect("index","index");
            return;
        }
        $member_id=HttpSession::get("member_id");
        $member=Member::get_by_id($member_id);
        $bankcode=$this->data["bankcode"];
        $products=$order->products;
        $name="";
        foreach($products as $product)
            $name=$name.$product->name.",";
        $params=array(
            'PayType'=>'PT008',        //支付类型编码
            'InstCode'=>$bankcode,    //银行编码
            'ProductName'=>$name,//商品名称
            'BuyerContact'=>$member->mobile,    //支付人联系方式
            'oid'=>$order->order_no,    //商品订单
            'fee'=>$order->final_amount    //交易的金额
        );
        $pay=new ElePayment();
        print ($pay->paymentForEle($params));
    }

    /**
     * 网上付款显示
     */
    public function show()
    {
        $pbankcode=$this->data["pbankcode"];
        $order_id=$this->data["order_id"];
        $order=Order::get_by_id($order_id);
        $goods=$order->ordergoods;
        $goods_name="";
        if ($goods){
            foreach ($goods as $eachgoods) {
                $goods_name.=$eachgoods->goods_name."&#&";
            }
            $goods_name=substr($goods_name,0,strlen($goods_name)-3);
        }
        $paymenttype=Paymenttype::get_by_id($order->pay_type);
        //支付方式的父类
        $paymenttypeparent=Paymenttype::get_by_id($paymenttype->parent_id);
        $payment_code=$paymenttype->paymenttype_code;
        //如果是预定，也转入支付宝支付
        if($payment_code=="alipay"||$payment_code=="reserve"){//支付宝
            // $pay=new Payment_Ali();
            // $pay->pay($order->order_no,$goods_name,sprintf("%01.2f",is_numeric($order->final_amount)?$order->final_amount:0));

            //商户订单号，商户网站订单系统中唯一订单号，必填
            $_POST['WIDout_trade_no'] = $order->order_no;

            //订单名称，必填
            $_POST['WIDsubject'] = $goods_name;

            //付款金额，必填
            $_POST['WIDtotal_amount'] = sprintf("%01.2f",is_numeric($order->final_amount)?$order->final_amount:0);

            //商品描述，可空
            $_POST['WIDbody'] = "菲生活";

            include_once(Gc::$nav_root_path . "module/plugins/pay/alipay/pagepay/pagepay.php");
            die();
        }else if($payment_code=="wxpay"||$payment_code=="reserve"){//微信支付

            //商户订单号，商户网站订单系统中唯一订单号，必填
            $_POST['WIDout_trade_no'] = $order->order_no;

            //订单名称，必填
            $_POST['WIDsubject'] = $goods_name;

            //付款金额，必填
            $_POST['WIDtotal_amount'] = sprintf("%01.2f",is_numeric($order->final_amount)?$order->final_amount:0);

            //商品描述，可空
            $_POST['WIDbody'] = "菲生活";

            include_once(Gc::$nav_root_path . "module/plugins/pay/wxpay/pagepay/mobilepay.php");
            die();
        }else if($payment_code=="shengpay"||$paymenttypeparent->paymenttype_code=="shengpay"){
            //盛大支付
            $InstCode=$paymenttype->getValue("InstCode");
            $params=array(
                'instCode'=>$InstCode,                                                        //银行编码
                'order_code'=>$order->order_no,                                                 //商品订单
                'product_name'=>$goods_name,                                                    //商品名称
                'contact_way'=>$order->member->mobile,                                            //支付人联系方式
                'fee'=>sprintf("%01.2f",is_numeric($order->final_amount)?$order->final_amount:0)//交易的金额
            );
            $pay=new Payment_Sheng();
            $pay->payByParams($params);
        }else{
            echo "支付出错了！";
            echo "<a href='".Gc::$url_base."index.php?go=mobile.member.view'>点击返回个人中心</a>";
        }
    }

    /**
     * 计算优惠条件
     */
    public function Calculationfav($totalprice,$carts)
    {
        //购物车商品
        $pids=array();
        foreach($carts as $cart){
            $pids[]=$cart->product_id;
        }
        $num=count($pids);
        $couponitems_key=HttpSession::get("couponitems_key");
        $couponitems=Couponitems::get_one("couponitems_key='$couponitems_key'");
        $coupon_id=$couponitems->coupon_id;
        $isExchange=$couponitems->isExchange;
        $coupon=Coupon::get_by_id($coupon_id);
        $nowtime=UtilDateTime::dateToTimestamp(UtilDateTime::now());
        $finalprice=$totalprice;
        if($isExchange==0){
            if($coupon->isValid==1 && $nowtime > $coupon->begin_time && $nowtime < $coupon->end_time){
                $preferentialrule=Preferentialrule::get_one("classify_id='$coupon_id'");
                if($preferentialrule->classify_type==1 && $preferentialrule->ifCoupon==1){
                    if($nowtime > $preferentialrule->begin_time && $nowtime < $preferentialrule->end_time){
                        if($preferentialrule->preferential_type==1){
                            $discount = $preferentialrule->discount;
                            if($preferentialrule->ifEffectall==1){
                                $finalprice = $discount*$totalprice;
                            }else{
                                $finalprice=0;
                                $pidarr=Prefproduct::select("product_id","preferentialrule_id='$preferentialrule->preferentialrule_id'");
                                $pidarr=(array)$pidarr;
                                $count=count($pidarr);
                                for($j=0;$j<$count;$j++){
                                    for($i=0;$i<$num;$i++){
                                        if($pids[$i]==$pidarr[$j]){
                                            $calcs[$i]=$discount*$calcs[$i];
                                            break;
                                        }
                                    }
                                }
                                for($i=0;$i<$num;$i++){
                                    $finalprice=$finalprice+$calcs[$i];
                                }
                            }
                        }else if($preferentialrule->preferential_type==3 && $totalprice > $preferentialrule->money_lower){
                            $discount = $preferentialrule->discount;
                            $finalprice = $discount*$totalprice;
                        }else if($preferentialrule->preferential_type==4 && $totalprice > $preferentialrule->money_lower){
                            $money_lower = $preferentialrule->money_lower;
                            $limit_reduce = $preferentialrule->limit_reduce;
                            $num = $totalprice/$money_lower;
                            $finalprice = $totalprice-($num*$limit_reduce);
                        }else if($preferentialrule->preferential_type==5){
                            //优惠券抵用金额
                            $limit_reduce = $preferentialrule->limit_reduce;
                            //找到该优惠的所有商品
                            $pidarr=Prefproduct::select("product_id","preferentialrule_id='$preferentialrule->preferentialrule_id'");
                            $pidarr=(array)$pidarr;
                            $count=count($pidarr);
                            //判断所购买商品是否享受该优惠
                            $pexist=false;
                            for($j=0;$j<$count;$j++){
                                for($i=0;$i<$num;$i++){
                                    if($pids[$i]==$pidarr[$j]){
                                        $pexist=true;
                                        break;
                                    }
                                }
                                if($pexist){
                                    //最终金额=总金额-立减金额
                                    $finalprice = $totalprice-$limit_reduce;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        //优惠金额
        $couponprice=$totalprice-$finalprice;
        $couponprice=sprintf("%.2f",substr(sprintf("%.3f",$couponprice), 0, -2));
        if($couponprice){
            $calculationfav["couponprice"]=$couponprice;
            $calculationfav["couponitems_key"]=$couponitems_key;
        }else{
            HttpSession::removes(array("couponprice","couponitems_key"));
            $calculationfav=false;
        }

        return $calculationfav;
    }
}
?>
