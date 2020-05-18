<?php
/**
 +---------------------------------------<br/>
 * 控制器:会员<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Member extends Action
{
    /**
     * 密码重置
     */
    public function pwdreset(){
        $this->loadCss("resources/css/pwdreset.css");
        $this->loadJs("js/pwdreset.js");

        $code=$this->data["code"];
        $pwdreset=Pwdreset::get_one("code='".$code."'");
        $sendTime=UtilDateTime::dateToTimestamp(UtilDateTime::now())-1800;
        //如果不存在信息或者已经被使用或者在30分钟之前
        if(!$pwdreset || $pwdreset->isUsed || $pwdreset->sendTime<$sendTime){
            //链接失效
            $this->view->set("error",true);
        }else{
            //如果没有进入过页面，则进入页面填写信息
            if(!$pwdreset->isIn){
                $pwdreset->isIn=true;
                $pwdreset->update();
                $this->view->set("code",$pwdreset->code);
                $this->view->set("form",true);
            }else{
                $password=$this->data["password"];
                if($password){//只有传过来密码不为空才修改用户密码
                    $member=Member::get_one("username='".$pwdreset->username."'");
                    Member::updateProperties($member->member_id,array("password"=>md5($password)));
                    $pwdreset->isUsed=true;
                    $pwdreset->update();
                    $this->view->set("success",true);
                }else{
                    $this->view->set("code",$pwdreset->code);
                    $this->view->set("form",true);
                }
            }
        }
        //导航条
        $nav_info->level = 2;
        $nav_info->info = "找回密码";
        $this->view->set("nav_info",$nav_info);
    }

    public function test(){
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/test.css");
    }
    public function test_login(){
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/test.css");
    }

    /**
     * 会员详情页面
     */
    public function view()
    {
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_view.css");

        //读取cookie的值
        $backurl=$_COOKIE['backurl'];
        if(HttpSession::isHave('member_id')){
            //根据cookie的值判断是否回跳
            if(!empty($backurl)){
                $this->redirect_url($backurl);
            }
            $member_id=HttpSession::get('member_id');
            $orders=Order::get("member_id=".$member_id." and status<>'dead'","commitTime desc","0,5");
            $this->view->set("orders",$orders);//定义orders
            foreach($orders as $key=>$value){
                $value->goods = Ordergoods::get(array("order_id=".$value->order_id,"isGiveaway=0"));
                foreach($value->goods as $eachgoods){
                    // $goods=Goods::get_by_id($eachgoods->goods_id);
                    $eachgoods->image=Product::get_by_id($eachgoods->goods_id)->image;
                }

            }

            $orders_ship=Order::get('(member_id='.$member_id.') and( ship_status="0" or ship_status="1")',"commitTime desc");
            $this->view->set("orders_ship",$orders_ship);
            $ordercount=count($orders_ship);
            $this->view->set("ordercount",$ordercount);//定义 待收订单


            $collects=Collect::get("member_id=".$member_id,"commitTime desc","0,5");//定义我的收藏
            $this->view->set("collects",$collects);



            $member=Member::get_by_id($member_id);
            $this->view->set("member",$member);//定义member

            $company_=Company::get("member_id=".$member->member_id,"");
            $company=$company_[0];

            $this->view->set("company",$company);//设置公司信息

            //是否弹出 完善信息 框
            $cn=$company->com_name;

            $isAlertCom=false;
            if($cn==""||$cn==" "){
                $isAlertCom=true;
            }
            $this->view->set("isAlertCom",$isAlertCom);

            //是否提供网上支付
            $paymenttype=Paymenttype::get_by_id(3);
            if($paymenttype){
                $ispay=1;
            }else{
                $ispay=0;
            }
            $this->view->set("ispay",$ispay);
            // $nav_info->level = 2;
            // $nav_info->info = "个人中心";
            // $this->view->set("nav_info",$nav_info);

        }else{
            $this->redirect("auth","login");
            return;
        }

    }

    /**
     * 会员收货地址
     */
    public function address()
    {
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_results.css");
        $this->loadJs("js/member_results.js");
        $this->loadJs("js/utils.js");
        $this->loadJs("js/AjaxClass.js");
        $this->loadJs("js/region/region.js");
        //$this->loadJs("js/address.js");
        $regions= Region::select(array('region_id','region_name'),array("region_type='1'"),"region_id asc");
        $this->view->set("regions",$regions);

        if(HttpSession::isHave('member_id')) {
            $member_id=HttpSession::get('member_id');
            $addresses=Address::get(array("member_id"=>$member_id));
            foreach ($addresses as $address) {
               $address->citys_by_province=Region::select(array('region_id','region_name'),"parent_id=".$address->province,"region_id asc");
               $address->district_by_city=Region::select(array('region_id','region_name'),"parent_id=".$address->city,"region_id asc");
               $province = Region::get_by_id($address->province)->region_name;
                $city = Region::get_by_id($address->city)->region_name;
                $district = Region::get_by_id($address->district)->region_name;
                $address->allregion = $province." ".$city." ".$district;
            }
            $this->view->set("addresses",$addresses);
        }else{
            $this->redirect("index","index");
        }

        //导航条
        $nav_info->level = 2;
        $nav_info->info = "收货地址";
        $nav_info->link = Gc::$url_base."index.php?go=kmall.member.address";
        $this->view->set("nav_info",$nav_info);
    }

    /**
     * 添加会员收货地址
     */
    public function addAddress()
    {
        $address=$this->model->Address;
        //前次链接所在的位置，以便操作结束后返回
        $location=$this->data['location'];
        if(HttpSession::isHave('member_id')) {
            $member_id=HttpSession::get('member_id');
            $address->member_id=$member_id;
            if (!empty($address->address_id)){
                $address->updateTime=UtilDateTime::now();
                $address->update();
            }else{
                $address->save();
            }
            if (empty($location)){
                $this->redirect("member","results");
            }else{
                $this->redirect("checkout","view");
            }
        }else{
            $this->redirect("index","index");
        }
    }

    /**
     * 删除会员地址
     */
    public function delAddress()
    {
        if(HttpSession::isHave('member_id')) {
            $addr_id=$this->data["address_id"];
            if (!empty($addr_id)){
                Address::deleteByID($addr_id);
            }
            $location=$this->data["location"];
            if($location){
                $this->redirect("member","address","location=".$location);
                return;
            }
            $this->redirect("member","results");
        }else{
            $this->redirect("index","index");
        }
        return;
    }


    /**
    * 注册/显示 会员卡信息
    *
    */
    public function activate()
    {
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_activate.css");
        $this->loadJs("js/member_activate.js");

        $member_id=HttpSession::get("member_id");
        if(!empty($member_id)){
            $member=Member::get_by_id($member_id);
            $this->view->set("member",$member);

            //标记是否有卡号信息
            $cardflag=false;
            if(!empty($member->cardno)){
                $cardflag=true;
            }
            if(!empty($_POST)){
                $validate=$this->data['validate_code'];
                //判断验证码是否正确
                if  (md5($validate) !=HttpSession::get('validate')){
                    $this->view->set("message","验证码有误");//setview
                    return ;
                }
                $member = $this->model->Member;
                $member->setMember_id($member_id);
                $member->isActive = true;
                $member->update();
                //清除session
                HttpSession::remove('validate');
                $this->redirect("member","infosuccess");
            }
            $this->view->set("cardflag",$cardflag);
        }else{
            $this->redirect("index","index");
            return;
        }
    }


    /*
    修改信息
     */
    public function info()
    {
        //导入Css、js、jquery等
        if(empty($this->view->viewObject))
        {
            $this->view->viewObject=new ViewObject();
        }
        UtilCss::loadCssReady($this->view->viewObject,"ajax/jquery/jqueryui/jquery-ui.css",true);
        UtilAjaxJquery::loadJqueryUI($this->view->viewObject,"1.8");
        $this->loadCss("resources/css/datepicker.css");
        $this->loadCss("resources/css/acl.css");
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_info_details.css");

        $this->loadJs("js/utils.js");
        $this->loadJs("js/acl.js");

        //获取member_id
        $member_id=HttpSession::get('member_id');
        if(!empty($_POST)) {
            //更新用户信息 如果用户将已有信息改为“空”时，则用“ ”代替
            $member = $this->model->Member;
            Member::updateProperties(
                $member_id,array(
                    "realname"=>$member->realname,
                    "sex"=>$member->sex,
                    "address"=>$member->address,
                    "mobile"=>$member->mobile,
                    "email"=>$member->email,
                    "birthday"=>$member->birthday,
                    "isCanEmail"=>$member->isCanEmail,
                    "isCanSms"=>$member->isCanSms,
                    "updateTime"=>$member->updateTime
                )
            );
        }
        //判断用户是否已登录
        if($member_id){
            $member =Member::get_by_id($member_id);
            $this->view->set("member",$member);

            $company_r =Company::get("member_id=".$member_id,"");

            if(count($company_r)>0){
                $company=$company_r[0];
            }

            $times=$this->data['i'];
            //导航条
            $nav_info->level = 2;
            $nav_info->info = "个人信息";
            $this->view->set("nav_info",$nav_info);
        }else{
            $this->redirect("index","index");
            return;
        }
    }


    public function infosuccess(){
        $this->loadCss("resources/css/acl.css");
    }


    /*
    订单
     */

    public function order()
    {
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_order.css");
        $this->loadJs("js/member_order.js");

        if(HttpSession::isHave('member_id')){
            //获得member_id
            $member_id= HttpSession::get('member_id');

            $order=$this->model->Order;
            $order_time=$order->getUpdateTime();
            $order_status=$order->getShip_status();
            $order_find=trim($order->getOrder_id());

            //定义查询--编号、货物名字、产品编号
            $temp_text="";
            if($order_find=="商品名称、商品编号、订单编号"){
                $temp_text=$order_find;
                $order_find=" like '%%' ";

            }else{
                $temp_text =$order_find;
                $order_find=" like '%$order_find%'";

            }
            $this->view->set("temp_text",$temp_text);

            //获得一个月前的 date 时间
            $inquerydt =date('Y-m-d H:i:s', time() - (30 * 24 * 60 * 60));
            //将inquerydt转换成 timestamp 类型
            $inquerytime=UtilDateTime::dateToTimestamp($inquerytime);

            //定义查询--时间
            $temp_t="0";
            if($order_time==0)
                $order_time="like '%%'";
            elseif($order_time==1){
                $order_time="< '".$inquerytime."'";
                $temp_t="1";
                $this->view->set("temp_t",$temp_t);
            }elseif($order_time==2){
                $order_time="> '".$inquerytime."'";
                $temp_t="2";
            }
            $this->view->set("temp_t",$temp_t);


            //定义查询--状态
            $temp_st="0";
            if($order_status==0)
                $order_status="<>'dead'";
            elseif($order_status==1){
                $order_status="='finish'";
                $temp_st="1";
            }elseif($order_status==2){
                $order_status="='dead'";
                $temp_st="2";
            }
            $this->view->set("temp_st",$temp_st);

            //分页功能
            $pageshow_num=5;

            //根据条件查出orders
            $orders_all=sqlExecute("select distinct a.* from ".Order::tablename()." as a,
                ".Ordergoods::tablename()." as b,
                ".Product::tablename()." as c"
                ."  where a.member_id =".$member_id." and a.commitTime ".$order_time." and a.status ".$order_status
                ." and a.order_id=b.order_id and b.goods_id=c.product_id and((a.order_no ".$order_find.")
                or (c.product_code ".$order_find.") or (b.goods_name ".$order_find."))"
                ,Order::classname_static());
            $count=count($orders_all);

            $sort_order ='sort_order desc';

            if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
              $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
              $nowpage=1;
            }
            $orders_page=UtilPage::init($nowpage, $count , $pageshow_num);

            $start=($nowpage-1)*$pageshow_num;

            //读出分类后的order
            $orders=sqlExecute("select distinct a.* from ".Order::tablename()." as a, "
                .Ordergoods::tablename()." as b, "
                .Product::tablename()." as c"
                ."  where a.member_id =".$member_id." and a.commitTime ".$order_time." and a.status ".$order_status
                ." and a.order_id=b.order_id and b.goods_id=c.product_id and( a.order_no ".$order_find."
                or c.product_code ".$order_find." or b.goods_name ".$order_find.") order by commitTime desc  limit "
                .$start.",".$pageshow_num."  "
                ,Order::classname_static());
            foreach($orders as $key=>$value){
                $value->goods = Ordergoods::get(array("order_id=".$value->order_id,"isGiveaway=0"));
                foreach($value->goods as $eachgoods){
                    // $goods=Goods::get_by_id($eachgoods->goods_id);
                    $eachgoods->image=Product::get_by_id($eachgoods->goods_id)->image;
                }
            }
            $this->view->set("orders",$orders);

            //是否提供网上支付
            $paymenttype=Paymenttype::get_by_id(3);
            if($paymenttype){
                $ispay=1;
            }else{
                $ispay=0;
            }
            $this->view->set("ispay",$ispay);

            $nav_info->level = 2;
            $nav_info->info = "订单查询";
            $this->view->set("nav_info",$nav_info);
        }else{
            $this->redirect("index","index");
            return;
        }

    }

    /**
     *收货地址
     */
    public function results(){
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_results.css");
        $this->loadJs("js/member_results.js");
        $this->loadJs("js/utils.js");
        $this->loadJs("js/AjaxClass.js");
        $this->loadJs("js/region/region.js");

        $regions= Region::select(array('region_id','region_name'),array("region_type='1'"),"region_id asc");
        $this->view->set("regions",$regions);
        //判断用户是否登录
        if(HttpSession::isHave('member_id')) {
            $member_id=HttpSession::get('member_id');
            $addresses=Address::get(array("member_id"=>$member_id));
            foreach ($addresses as $address) {
               $address->citys_by_province=Region::select(array('region_id','region_name'),"parent_id=".$address->province,"region_id asc");
               $address->district_by_city=Region::select(array('region_id','region_name'),"parent_id=".$address->city,"region_id asc");
               $province = Region::get_by_id($address->province)->region_name;
                $city = Region::get_by_id($address->city)->region_name;
                $district = Region::get_by_id($address->district)->region_name;
                $address->allregion = $province." ".$city." ".$district;
            }
            $this->view->set("addresses",$addresses);
        }else{
            $this->redirect("index","index");
        }
        //导航条
        $nav_info->level = 2;
        $nav_info->info = "收货地址";
        $this->view->set("nav_info",$nav_info);
    }

    /**
     * 我的收藏
     */
    public function collect(){
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_collect.css");

        //判断用户是否登录
        if(HttpSession::isHave('member_id')){
            $member_id=HttpSession::get('member_id');

            //对  collect  进行分页
            $where_clause=array();
            $where_clause['member_id']=$member_id;
            if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
                $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
                $nowpage=1;
            }
            $count=Collect::count($where_clause);
            $pageshow_num=15;
            $order="commitTime desc";
            $collect_page=UtilPage::init($nowpage,$count,$pageshow_num);
            $collects=Collect::queryPage($collect_page->getStartPoint(),$collect_page->getEndPoint(),$where_clause,$order);

            $this->view->set("collects",$collects);

            //导航条
            // $nav_info->level = 2;
            // $nav_info->info = "我的收藏";
            // $this->view->set("nav_info",$nav_info);
        }else{
            $this->redirect("index","index");
            return;
        }
    }
    /**
     * 积分查询
     */
    public function points(){
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_order.css");
        //判断用户是否登录
        if(HttpSession::isHave('member_id')){
            $member_id=HttpSession::get('member_id');
            $start=$this->data["start"];
            $end=$this->data["end"];
             //对  collect  进行分页
            $where_clause=array();
            $where_clause['member_id']=$member_id;
            // $where_clause['pay_status']= 1;
            // $where_clause['jifen']= ">1";
            if($start && $end){
                $where_clause['commitTime']= ">=".strtotime($start)." and commitTime<=".strtotime($end." 23:59:59");
            }elseif ($start) {
                $where_clause['commitTime']= ">=".strtotime($start);
            }elseif ($end) {
                $where_clause['commitTime']= "<=".strtotime($end." 23:59:59");
            }
            
            if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
                $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
                $nowpage=1;
            }
            $count=Jifenlog::count($where_clause);
            $pageshow_num=11;
            $order="commitTime desc";
            $points_page=UtilPage::init($nowpage,$count,$pageshow_num);
            $points=Jifenlog::queryPage($points_page->getStartPoint(),$points_page->getEndPoint(),$where_clause,$order);

            $this->view->set("points",$points);
            $this->view->set("start",$start); 
            $this->view->set("end",$end); 

        }else{
            $this->redirect("index","index");
            return;
        }
    }

    /**
    * 删除收藏
    */
    public function delCollect()
    {
        //若用户没用登录，跳转到登录界面
        if(!HttpSession::isHave('member_id')) {
            $this->redirect("index","index");
            return ;
        }
        //我的收藏
        $collect_id=$this->data["collect_id"];

        //根据 关注 返回页面
        $location= $this->data["location"];
        if (!empty($collect_id)){
            Collect::deleteByID($collect_id);
        }
        if($location=='mview'){
            $this->redirect("member","view");
        }else
            $this->redirect("member","collect");
    }
    /**
    * ‘我的收藏’加为关注
    */
    public function addAttention()
    {
        //若用户没用登录，跳转到登录界面
        if(!HttpSession::isHave('member_id')) {
            $this->redirect("index","index");
            return ;
        }
        //得到收藏产品id
        $collect_id=$this->data["collect_id"];

        //根据 关注 返回页面
        $location= $this->data["location"];

        if (!empty($collect_id)){
            $collect=Collect::get_by_id($collect_id);
            $flag=$collect->getIsAttent();
            if(!$flag){
                $collect->setIsAttent(true);
                $collect->update();
                $success=1;
            }else{
                $success=0;
            }
        }

        //根据 关注 情况选择返回页面
        if($location=='mview'){
            $this->redirect("member","view","success=".$success);
        }else{
            $this->redirect("member","collect","success=".$success);
        }
    }

    /**
    * 浏览历史
    */
    public function seeproduct()
    {
        $this->loadCss("resources/css/acl.css");
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_collect.css");

        //若用户没用登录，跳转到登录界面
        if(!HttpSession::isHave('member_id')) {
            $this->redirect("index","index");
            return ;
        }
        $member_id = HttpSession::get('member_id');

        //对浏览历史进行分页
        $where_clause=array();
        $where_clause['member_id']=$member_id;

        if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
                $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
                $nowpage=1;
            }
        $count=Seeproduct::count($where_clause);
        $pageshow_num=11;
        $order="commitTime desc";
        $seeproduct_page=UtilPage::init($nowpage,$count,$pageshow_num);
        $seeproducts=Seeproduct::queryPage($seeproduct_page->getStartPoint(),$seeproduct_page->getEndPoint(),$where_clause,$order);


        $seeproductnum=count($seeproducts);
        $this->view->set("seeproducts",$seeproducts);
        $this->view->set("seeproductnum",$seeproductnum);

    }

    /**
    * 删除浏览记录
    */
    public function delSeeproduct()
    {
        //若用户没用登录，跳转到登录界面
        if(!HttpSession::isHave('member_id')) {
            $this->redirect("index","index");
            return ;
        }
        $seeproduct_id=$this->data["seeproduct_id"];

        if (!empty($seeproduct_id)){
            Seeproduct::deleteByID($seeproduct_id);
        }
        $this->redirect("member","seeproduct");
    }

    /**
    * ‘浏览历史’加为关注
    */
    public function addAttentionBySeeproduct()
    {
        //若用户没用登录，跳转到登录界面
        if(!HttpSession::isHave('member_id')) {
            $this->redirect("index","index");
            return ;
        }

        $member_id=HttpSession::get('member_id');
        $seeproduct_id=$this->data["seeproduct_id"];
        $seeproduct=Seeproduct::get_by_id($seeproduct_id);
        $product_id=$seeproduct->product_id;


        //去Collect中查找是否已被收藏
        if (!empty($product_id)){
            $collect_=Collect::get("product_id=".$product_id,"");
            if(count($collect_)==0){
                $collect=new Collect();
                $collect->setMember_id($member_id);
                $collect->setProduct_id($product_id);
                $collect->setProduct_name($seeproduct->product_name);
                $collect->setPrice($seeproduct->price);
                $collect->setUnit($seeproduct->unit);
                $collect->setIsAttent(true);

                $collect->save();
                $success=1;
            }else if(count($collect_)==1){
                $collect=$collect_[0];
                $flag=$collect->getIsAttent();
                if(!$flag){
                    $collect->setIsAttent(true);
                    $collect->update();
                    $success=1;
                }else{
                    $success=0;
                }
            }
        }
        $this->redirect("member","seeproduct","success".$success);
    }
    /**
    * 我的定制
    */
    public function customize()
    {
        $this->loadCss("resources/css/acl.css");
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_customize.css");
        $this->loadJs("js/member_customize.js");
        //判断用户是否登录
        if(HttpSession::isHave('member_id')){
            $member_id=HttpSession::get('member_id');
            //分页
            $where_clause=array();
            $where_clause['member_id']=$member_id;
            if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
                $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
                $nowpage=1;
            }
            $count=Answer::count($where_clause);
            $pageshow_num=10;
            $order="commitTime desc";
            $page=UtilPage::init($nowpage,$count,$pageshow_num);
            $answers=Answer::queryPage($page->getStartPoint(),$page->getEndPoint(),$where_clause,$order);
            $this->view->set("answers",$answers);
        }else{
            $this->redirect("index","index");
            return;
        }
    }
    /**
    * 退款管理
    */
    public function refund()
    {
        //判断用户是否登录
        if(HttpSession::isHave('member_id')){
            $this->loadCss("resources/css/acl.css");
            $this->loadCss("resources/css/member_center.css");
            $this->loadCss("resources/css/member_refund.css");
            $this->loadJs("js/member_refund.js");

            $member_id = HttpSession::get("member_id");

            $filter = $this->data['queryfilter'];
            if($filter =="商品名称、商品编号、订单编号")$filter = "";
            $this->view->set("queryfilter_temp",$filter);

            //分页功能
            $pageshow_num=5;

            //根据条件查出orders
            $refundproductss_all = ServiceRefundproducts::sqlExecute("select rp.* from ".Product::tablename()." as p ,"
                .Refundproducts::tablename()." as rp where rp.member_id = '".$member_id."' and "
                ."p.product_id = rp.product_id and ( p.product_name  like '%".$filter."%' "
                ."or p.product_code like '%".$filter."%' or rp.order_no like '%".$filter."%')",Refundproducts::classname_static());

            $count=count($refundproductss_all);

            $sort_order ='sort_order desc';

            if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
              $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
              $nowpage=1;
            }
            $orders_page=UtilPage::init($nowpage, $count , $pageshow_num);

            $start=($nowpage-1)*$pageshow_num;

            //读出分页后的refundproducts
            $refundproductss = ServiceRefundproducts::sqlExecute("select rp.* from ".Product::tablename()." as p ,"
                .Refundproducts::tablename()." as rp where rp.member_id  = '".$member_id."' and "
                ."p.product_id = rp.product_id and ( p.product_name  like '%".$filter."%' "
                ."or p.product_code like '%".$filter."%' or rp.order_code like '%".$filter."%')  order by commitTime desc  limit "
                .$start.",".$pageshow_num."  ",Refundproducts::classname_static());


            $this->view->set("refundproductss",$refundproductss);
        }else{
            $this->redirect("index","index");
            return;
        }
    }

    /**
    *  申请退款
    */
    public function addrefund(){
        if(HttpSession::isHave('member_id')){

            $member_id = HttpSession::get("member_id");
            $order_no = $this->data['order_no'];
            $orders = Order::get(array("member_id"=>$member_id,"order_no"=>$order_no));
            $success = 0;
            if(count($orders) > 0){

                $name = $this->data['name'];
                $comment = $this->data['comment'];

                $refundcomment = new Refundcomment();

                $refundcomment->member_id=$member_id;
                $refundcomment->order_no=$order_no;
                $refundcomment->comment=$comment;
                $refundcomment->name=$name;
                $flag = $refundcomment->save();
                if($flag)$success = 1;
            }

            $this->redirect("member","refund","success=".$success);


        }else{
            $this->redirect("index","index");
            return;
        }

    }


    /**
    * 我的评论
    */
    public function comment()
    {
        $this->loadCss("resources/css/acl.css");
        $this->loadCss("resources/css/member_center.css");
        $this->loadCss("resources/css/member_comment.css");
        $this->loadJs("js/member_comment.js");
        //判断用户是否登录
        if(HttpSession::isHave('member_id')){
            $member_id=HttpSession::get('member_id');
            $queryText=$_REQUEST["queryText"];
            $comment_rank=$_REQUEST["comment_rank"];
            $order="a.add_time desc,b.name";//默认排序
            $where="select distinct a.* from ".Comment::tablename()." as a, ".Product::tablename()." as b where a.product_id=b.product_id";
            //分页
            $where=$where." and member_id=".$member_id;
            if($comment_rank>0){
                $where=$where." and comment_rank=".$comment_rank;
                $this->view->set("comment_rank",$comment_rank);
            }
            if($queryText!="产品名称"&&trim($queryText!="")){
                $where=$where." and b.product_name like'%".$queryText."%'";
                $this->view->set("queryText",$queryText);
                $order="b.product_name,a.add_time desc";//默认排序
            }
            //当前页码
            if($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
                $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
                $nowpage=1;
            }
            $comments=ServiceComment::sqlExecutes($where,Comment::classname_static());
            $count=count($comments);
            $pageshow_num=10;
            $page=UtilPage::init($nowpage,$count,$pageshow_num);
            $where=$where." limit ".$page->getStartPoint().",".$pageshow_num;
            $comments=ServiceComment::sqlExecutes($where,Comment::classname_static());
            //统计信息
            $day=60*60*24;//一天的秒数
            //好评
            $result=array(4=>5);//统计结果
            $result[0][0]=Comment::count("member_id=".$member_id." and comment_rank=3 and add_time>".(time()-$day*7));
            $result[0][1]=Comment::count("member_id=".$member_id." and comment_rank=3 and add_time>".(time()-$day*30));
            $result[0][2]=Comment::count("member_id=".$member_id." and comment_rank=3 and add_time>".(time()-$day*30*6));
            $result[0][3]=Comment::count("member_id=".$member_id." and comment_rank=3 and add_time<=".(time()-$day*30*6));
            $result[0][4]=$result[0][2]+$result[0][3];
            //中评
            $result[1][0]=Comment::count("member_id=".$member_id." and comment_rank=2 and add_time>".(time()-$day*7));
            $result[1][1]=Comment::count("member_id=".$member_id." and comment_rank=2 and add_time>".(time()-$day*30));
            $result[1][2]=Comment::count("member_id=".$member_id." and comment_rank=2 and add_time>".(time()-$day*30*6));
            $result[1][3]=Comment::count("member_id=".$member_id." and comment_rank=2 and add_time<=".(time()-$day*30*6));
            $result[1][4]=$result[1][2]+$result[1][3];
            //差评
            $result[2][0]=Comment::count("member_id=".$member_id." and comment_rank=1 and add_time>".(time()-$day*7));
            $result[2][1]=Comment::count("member_id=".$member_id." and comment_rank=1 and add_time>".(time()-$day*30));
            $result[2][2]=Comment::count("member_id=".$member_id." and comment_rank=1 and add_time>".(time()-$day*30*6));
            $result[2][3]=Comment::count("member_id=".$member_id." and comment_rank=1 and add_time<=".(time()-$day*30*6));
            $result[2][4]=$result[2][2]+$result[2][3];
            //总计
            $result[3][0]=$result[0][0]+$result[1][0]+$result[2][0];
            $result[3][1]=$result[0][1]+$result[1][1]+$result[2][1];
            $result[3][2]=$result[0][2]+$result[1][2]+$result[2][2];
            $result[3][3]=$result[0][3]+$result[1][3]+$result[2][3];
            $result[3][4]=$result[0][4]+$result[1][4]+$result[2][4];
            $this->view->set("result",$result);
            $this->view->set("comments",$comments);
        }else{
            $this->redirect("index","index");
            return;
        }
    }
    /**
     * 订单详情
     */
    public function order_detail()
    {
        $info=$this->data["i"];
        $order_id=$this->data["order_id"];
        $websafe1 = is_numeric($info)||empty($info);
        $websafe2 = is_numeric($order_id);
        $websafe = $websafe1&&$websafe2;
        if($websafe){
             //判断用户是否登录
            if(HttpSession::isHave('member_id')||HttpSession::isHave(Gc::$appName_alias.'admin_id')){
                $this->loadCss("resources/css/member_center.css");
                $this->loadCss("resources/css/member_order_detail.css");
                $this->loadJs("js/member_order_detail.js");
                $order=Order::get_by_id($order_id);

                //针对卡券订单特殊处理
                if($order->order_type==EnumOrderType::VOUCHER){
                    $order->final_amount = $order->cost_item;
                }

                $orderlogs=sqlExecute("select a.* from ".Orderlog::tablename()." a right join (select max(orderlog_id) orderlog_id from ".Orderlog::tablename()." group by orderAction) b on b.orderlog_id = a.orderlog_id where a.orderlog_id is not null and a.order_id=".$order_id." order by commitTime asc",Orderlog::classname_static());
                if($orderlogs){
                    foreach($orderlogs as $orderlog){
                        switch($orderlog->orderAction){
                            case 0:
                            $orderlog->info="订单创建";
                            break;
                            case 1:
                            $orderlog->info="订单通过审核";
                            break;
                            case 2:
                            $orderlog->info="订单通过确认";
                            break;
                            case 3:
                            $orderlog->info="订单确认有效";
                            break;
                            case 4:
                            $orderlog->info="订单发货完成,物流单号:".$orderlog->delivery_no;
                            break;
                            case 5:
                            $orderlog->info="订单确认收货";
                            break;
                            case 6:
                            $orderlog->info="订单".$orderlog->order_no."付款￥".$orderlog->order->final_amount;
                            break;
                            case 7:
                            $orderlog->info="订单".$orderlog->order_no."收款￥".$orderlog->order->final_amount;
                            break;
                            case 8:
                            $orderlog->info="订单完成";
                            break;
                            case 9:
                            $orderlog->info="订单取消";
                            break;
                        }
                    }
                    $this->view->set("orderlogs",$orderlogs);
                }
                if(HttpSession::isHave(Gc::$appName_alias.'admin_id')){
                    $member_id=$order->member_id;
                    $member=Member::get_by_id($member_id);
                    if($member){
                        $print_info='尊敬的用户:'.$member->username;
                    }else{
                        $print_info='';
                    }
                }else{
                    $print_info='尊敬的用户，您的订单还未处理，请您耐心等待。';
                }
                $this->view->set("print_info",$print_info);
                if(empty($order)){
                    $this->redirect("member","order");
                    return;
                }elseif($info==1){
                    $order->status=EnumOrderStatus::DEAD;
                    $order->update();
                    $this->redirect("member","order");
                    return;
                }
                $order->goods=Ordergoods::get(array("order_id=".$order->order_id,"isGiveaway=0"));
                foreach($order->goods as $eachgoods){
                    // $goods=Goods::get_by_id($eachgoods->goods_id);
                    $productdata=Product::get_by_id($eachgoods->goods_id);
                    $eachgoods->image=$productdata->image;
                    $eachgoods->goods_code=$productdata->goods_code;
                    //判断是否有赠品
                    $ifgift=Ordergoods::count("od_id=".$eachgoods->ordergoods_id);
                    if($ifgift){
                        $gifts=Ordergoods::get("od_id=".$eachgoods->ordergoods_id);
                        $eachgoods->gift=$gifts;
                    }
                }
                //订单是否允许修改
                $change=true;
                //判断订单时间是否已超过10分钟或状态不为未发货
                if($order->commitTime<time()-600||$order->ship_status!=0)$change=false;
                $this->view->set("change",$change);
                $this->view->set("order",$order);
                $couponitems_key=Couponlog::select_one("couponitems_key","order_id='$order_id'");
                if($couponitems_key){
                    $this->view->set("couponitems_key",$couponitems_key);
                }
            }else{
                $this->redirect("index","index");
            }
        }else{
            $this->redirect("index","index");
        }

    }

    /**
    *  修改密码
    */
    public function resetpwd(){
        if(HttpSession::isHave('member_id')){
            $this->loadCss("resources/css/acl.css");
            $this->loadCss("resources/css/member_center.css");
            $this->loadCss("resources/css/resetpwd.css");
            $this->loadJs("js/resetpwd.js");

            $member_id = HttpSession::get("member_id");
            if($_POST){
                //old password
                $oldpwd=$_POST['oldpwd'];
                $mdpwd=md5($oldpwd);
                $iflegal=Member::get_one(array("member_id=".$member_id,"password='$mdpwd'"));
                if($iflegal){
                    //new password
                    $newpwd=$_POST['newpwd'];
                    //转为md5值
                    $nmdpwd=md5($newpwd);
                    $iflegal->password=$nmdpwd;
                    //更新
                    $iflegal->update();
                    $this->redirect("member","infosuccess","success=".$success);
                }else{
                    $error=true;
                    $this->view->set("error",$error);
                }
            }
        }else{
            $this->redirect("index","index");
        }
    }

}

?>
