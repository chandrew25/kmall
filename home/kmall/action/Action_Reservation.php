 <?php
/**
 +---------------------------------------<br/>
 * 控制器:预约<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Reservation extends Action
{
    /**
    * 免注册预约
    *
    */
    public function view(){
        //如果已登陆
        if(HttpSession::isHave('member_id')&&HttpSession::get('member_id')!="thirdpartylogin") {
            $this->redirect("checkout","view");
            return;
        }
        $this->loadJs("js/checkout.js");
        //免注册信息
        $this->loadCss("resources/css/reservation.css");
        $this->loadJs("js/utils.js");
        $this->loadJs("js/AjaxClass.js");
        $this->loadJs("js/region/region.js");
        $this->loadJs("js/regaddress.js");
        $regions= Region::select(array('region_id','region_name'),array("region_type='1'"),"region_id asc");
        $this->view->set("regions",$regions);

        //至少选择一个商品
        $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
        $carts=(array)$carts;
        if (empty($carts)){
            $this->redirect("info","view","type=".EnumViewInfoType::CHECKOUTNOPRODUCT);
            return;
        }
        //显示购物车商品列表信息
        $this->view->set("carts",$carts);

        //显示购物车商品列表统计信息
        $statistic=array("totalPrice"=>0,"totalMarketPrice"=>0,"totalSavePrice"=>0,"ratio"=>"0");
        //最终的统计数据
        $statisticAll=array("totalPrice"=>0,"deliveryFee"=>0,"realFee"=>0);
        foreach ($carts as $cart) {
            $statistic["totalPrice"]+=$cart->sales_price*$cart->num;
            $statistic["totalMarketPrice"]+=$cart->market_price*$cart->num;
        }
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
        $this->view->set("statistic",$statistic);

        //配送方式列表
        $deliverytypes=Deliverytype::get("insure='1'");
        if (($deliverytypes!=null)&&(count($deliverytypes)>0)){
            if ($statisticAll['totalPrice']<$deliverytypes[0]->free_fee){
                $statisticAll['deliveryFee']=$deliverytypes[0]->fee;
            }
        }
        $this->view->set("deliverytypes",$deliverytypes);
        $statisticAll["deliveryFee"]=sprintf("%.2f",substr(sprintf("%.3f",$statisticAll["deliveryFee"]), 0, -1));
        $statisticAll['realFee']=$statisticAll['totalPrice']+$statisticAll['deliveryFee']- $statisticAll['couponprice'];
        $statisticAll['realFee']=sprintf("%.2f",substr(sprintf("%.3f",$statisticAll['realFee']), 0, -1));
        $this->view->set("statisticAll",$statisticAll);

        //支付方式列表
        $paymenttypes=Paymenttype::get("issetup=1 and level=1","sort_order desc,paymenttype_id asc");
        $this->view->set("paymenttypes",$paymenttypes);

        //导航条
        $nav_info->level = 2;
        $nav_info->info = "订单";
        $nav_info->link = Gc::$url_base."index.php?go=kmall.reservation.view";
        $this->view->set("nav_info",$nav_info);
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
    public function overOff(){
        //购物车内容
        $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
        $ifcarts=(array)$carts;
        //判断购物车是否为空
        if (empty($ifcarts)){
            $this->redirect("info","view","type=".EnumViewInfoType::CHECKOUTNOPRODUCT);
            return;
        }
        //发送邮件
        $ismail = $this->toemail($carts);
        if($ismail){
            HttpSession::set('member_id',$ismail["member_id"]);
            HttpSession::set('member_name',$ismail["username"]);
            $couponitems_key=HttpSession::get("couponitems_key");
            $couponprice=HttpSession::get("couponprice");
            HttpSession::removes(array("couponprice","couponitems_key"));
            //订单初始化
            $order=$this->Orderinit();
            $pbankcode=$this->data["ptype"];//支付方式父类型编码
            if($pbankcode=="bank"){
                $bankcode=$this->data["bankcode"];//支付平台或者支付银行编码
            }
            if ($pbankcode!="bank"){
                $paymenttype=Paymenttype::get_one("paymenttype_code='$pbankcode'");
                $order->pay_type=$paymenttype->paymenttype_id;//支付方式id
            }else{
                $paymenttype=Paymenttype::get_one("paymenttype_code='$bankcode'");
                $order->pay_type=$paymenttype->paymenttype_id;//支付方式id
            }
            //存入用户名
            $member_id=$ismail["member_id"];
            $order->member_id=$member_id;
            //订单收货信息
            $address_id=$ismail["address_id"];
            $order=$this->Setaddressinfo($order,$address_id);
            //购物车结算
            $order=$this->Settleaccounts($order,$carts,$couponprice);
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
                $invoice->invoice_code = "ns".time();
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
                foreach ($carts as $cart=>$value) {
                    $ordergoods=new Ordergoods();
                    $ordergoods->member_id=$member_id;
                    $ordergoods->order_id=$order_id;
                    $ordergoods->price=$value->sales_price;
                    $ordergoods->nums=$value->num;
                    $ordergoods->amount=$value->sales_price*$value->num;
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
            if ($pbankcode=="bank"){
                   $this->redirect("info","view","order_id=".$order_id."&type=".EnumViewInfoType::CHECKOUTOVER."&pbankcode=".$pbankcode);
            }else{
                $banksrc=$this->data["banksrc"];
                $bankcode=$this->data["bankcode"];
                $this->redirect("member","order_detail","order_id=$order_id&type=".EnumViewInfoType::CHECKOUTOVER.(empty($banksrc)?"":"&banksrc=".$banksrc."&bankcode=".$bankcode));
                /*$this->redirect("member","order_detail","order_id=".$order_id);*/
            }
        }else{
            echo "对不起,订单生成失败!<br /><a href=".Gc::$url_base.'index.php?go=kmall.index.index'.">点此返回首页面!</a>";
        }
    }

    /**
    * 非会员预约
    */
    public function toemail($carts)
    {
        //用户邮箱
        $email = $_POST["email"];
        //用户密码
        $passwd = UtilString::rand_string();
        //用户注册
        $member=new Member();
        $member->username=$email;
        $member->password=md5($passwd);
        $member->email=$email;
        $member->regtime=UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);
        $member->usertype=EnumUsertype::MEMBER;
        $member->regip=UtilNet::client_ip();
        //获取会员id
        $member->save();
        $member_id=$member->member_id;

        //第三方登录信息保存
        if(HttpSession::get('member_id')=="thirdpartylogin"){
            $third_info = HttpSession::get('kmall_third');
            $thirdparty = new Thirdpartylogin();
            $thirdparty->openid = $third_info["openid"];
            $thirdparty->logintype_id = $third_info["logintype_id"];
            $thirdparty->member_id = $member_id;
            $thirdparty->save();
        }

        //会员姓名
        $consignee = $_POST["consignee"];
        //区域
        $country = $_POST["country"];
        $province = $_POST["province"];
        $city = $_POST["city"];
        $district = $_POST["district"];
        //邮编
        $zipcode = $_POST["zipcode"];
        //详细地址
        $address_info = $_POST["address"];
        //电话
        $tel = $_POST["tel"];
        //手机
        $mobile = $_POST["mobile"];
        //会员地址信息
        $address=new Address();
        $address->member_id=$member_id;
        $address->consignee=$consignee;
        $address->country=$country;
        $address->province=$province;
        $address->city=$city;
        $address->district=$district;
        $address->zipcode=$zipcode;
        $address->address=$address_info;
        $address->tel=$tel;
        $address->mobile=$mobile;
        $address->save();
        $address_id=$address->address_id;
        //购买信息
        $ordershow = "";
        $notestr="亲爱的用户,您好!您已经成功购买了：";//短信内容
        foreach($carts as $key=>$value){
            $ordershow=$ordershow."<div style='height:20px;line-height:20px;font-size:14px;color:#256DFE;font-family:'微软雅黑';font-weight:bold;'>".$value->goods_name."</div>"
                                 ."<div style='height:20px;line-height:20px;font-family:'微软雅黑';>数量：".$value->num."台</div>"
                                 ."<div style='height:20px;line-height:20px;font-size:14px;margin-bottom:22px;font-family:'微软雅黑';'>价格：<span style='color:red'>".$value->sales_price*$value->num."</span>元</div>";
            $notestr.=$value->goods_name.",数量".$value->num.$value->unit.",价格".$value->sales_price*$value->num.";";
        }
        $notestr.="相关优惠以菲彼生活官方商城网站订单详情为准。";
        $notestr.="客服热线400-700-8108，祝您购物愉快！[菲彼生活官方商城]";
        if(!empty($mobile)){
            UtilSMS::send($mobile,$notestr);
            //清除缓冲区
            ob_clean();
        }
        //获取当前时间
        $date = UtilDateTime::now();
        //用户登录
        $login = Gc::$url_base."index.php?go=kmall.auth.imlogin&username=".$email."&password=".md5($passwd);
        //邮件正文
        $content="<div style='border:1px solid #E8E7E7;width:820px;float:left;margin-bottom:40px;'>"
                    ."<div style='border-bottom:1px solid #E8E7E7;width:820px;height:78px;float:left;'><img src='".Gc::$url_base."home/kmall/view/default/resources/images/email/title.jpg'></div>"
                    ."<div style='width:820px;background:#F9F9F9;float:left;'>"
                        ."<div style='width:778px;background:white;border:1px solid #E8E7E7;margin:20px auto;'>"
                            ."<div style='width:741px;margin:20px auto 20px 37px;'>"
                                ."<div style='height:20px;margin-top:22px;margin-bottom:24px;line-height:20px;font-family:'微软雅黑';font-size:14px;'>亲爱的用户,您好！</div>"
                                ."<div style='height:20px;line-height:20px;font-family:'微软雅黑';font-size:14px;'>您已经成功购买了</div>"
                                .$ordershow
                                ."<div style='height:40px;line-height:20px;'>相关优惠以菲彼生活官方商城网站订单详情为准</div>"
                                ."<div style='height:40px;line-height:20px;'><a href='".$login."' style='color:#256DFE;font-family:'微软雅黑';font-size:14px;'>".$login."</a></div>"
                                ."<div style='height:20px;line-height:20px;margin-bottom:22px;font-family:'微软雅黑';font-size:14px;'>点击立即登录(如果链接无法点击，请将它复制并粘贴到浏览器的地址栏中访问)</div>"
                                ."<div style='height:20px;line-height:20px;font-size:14px;'>您的会员登录邮箱：<span style='color:#256DFE;font-family:'微软雅黑';font-size:14px;'>".$email."</span></div>"
                                ."<div style='height:20px;line-height:20px;font-family:'微软雅黑';font-size:14px;'>您的会员登录密码：<span style='color:#256DFE;font-family:'微软雅黑';font-size:14px;'>".$passwd."</span> </div>"
                                ."<div style='height:20px;line-height:20px;margin-bottom:22px;font-family:'微软雅黑';font-size:14px;'>（此密码为随机选取,菲彼生活官方商城拥有最终解释权）</div>"
                                ."<div style='height:20px;line-height:20px;font-family:'微软雅黑';font-size:14px;'>本邮件是系统自动发送的，请勿直接回复！咨询请拨打客服热线(400-700-8108)感谢您的支持，</div>"
                                ."<div style='height:20px;line-height:20px;margin-bottom:22px;font-family:'微软雅黑';font-size:14px;'>祝您购物愉快！</div>"
                                ."<div style='height:20px;line-height:20px;font-family:'微软雅黑';font-size:14px;'>菲彼生活官方商城</div>"
                                ."<div style='height:20px;line-height:20px;'><a href='http://www.phoebelife.com/' style='color:#256DFE;font-family:'微软雅黑';font-size:14px;'>http://www.phoebelife.com/</a></div>"
                                ."<div style='height:20px;line-height:20px;font-family:'微软雅黑';font-size:14px;'>".$date."</div>"
                            ."</div>"
                        ."</div>"
                    ."</div>"
                ."</div>";
        $title="菲彼生活官方商城";
        $toname = $email;
        $the=UtilEmailer::sendEmail("菲彼生活官方商城",$email,$toname,$title,$content);
        //清除缓冲区
        ob_clean();
        if($the["success"]){
            $ismail = array();
            $ismail["member_id"] = $member_id;
            $ismail["address_id"] = $address_id;
            $ismail["username"] = $email;
        }else{
            $ismail = false;
        }
        return $ismail;
    }

    /**
     * 订单初始化
     */
    public function Orderinit()
    {
        //订单实例
        $order=new Order();
        /******************************暂时性修改（生成订单即为有效13-4-27）*/
        $order->status=EnumOrderStatus::ACTIVE;
        //准备支付
        $order->pay_status=EnumPayStatus::READY;
        //未发货
        $order->ship_status=EnumShipStatus::UNDISPATCH;
        return $order;
    }

    /**
     * 订单收货信息
     */
    public function Setaddressinfo($order,$address_id)
    {
        $address=Address::get_by_id($address_id);
        $ship_type=$this->data["delivtype"];
        if (!empty($address)){
            //填写订单信息
            //随机数
            $randnumber=UtilString::build_count_rand(1,5);
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
        return $order;
    }

    /**
     * 订单结算
     */
    public function Settleaccounts($order,$carts,$couponprice)
    {
        //显示购物车商品列表统计信息
        $statistic=array("totalPrice"=>0,"totalMarketPrice"=>0,"totalSavePrice"=>0,"ratio"=>"0");
        //最终的统计数据
        $statisticAll=array("totalPrice"=>0,"deliveryFee"=>0,"realFee"=>0);
        foreach ($carts as $cart) {
            $statistic["totalPrice"]+=$cart->sales_price*$cart->num;
            $statistic["totalMarketPrice"]+=$cart->market_price*$cart->num;
        }
        $statistic["totalSavePrice"]=$statistic["totalMarketPrice"]-$statistic["totalPrice"];
        if ($statistic["totalPrice"]>0){
            $statistic["ratio"] =round($statistic["totalSavePrice"]/$statistic["totalMarketPrice"]*100);
        }
        $statisticAll['totalPrice']=$statistic["totalPrice"];
        $statisticAll['realFee']=$statisticAll['totalPrice']+$statisticAll['deliveryFee']-$couponprice;
        $order->cost_item=$statistic["totalPrice"];
        $order->cost_other=$statisticAll['deliveryFee'];
        $order->total_amount=$statisticAll['realFee'];
        $order->final_amount=$statisticAll['realFee'];
        $order->pmt_amount=$couponprice;
        return $order;
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
        $couponprice=sprintf("%.2f",substr(sprintf("%.3f",$couponprice), 0, -1));
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
