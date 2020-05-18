<?php
/**
 +---------------------------------------<br/>
 * 控制器:会员<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Member extends ActionMobile
{

    /**
     * 会员中心
     */
    public function view()
    {
        //读取cookie的值
        $backurl=$_COOKIE['backurl'];
        if(HttpSession::isHave('member_id')){
            //根据cookie的值判断是否回跳
            if(!empty($backurl)){
                $this->redirect_url($backurl);
            }
            $member_id=HttpSession::get('member_id');
            $member=Member::get_by_id($member_id);
            $this->view->set("member",$member);//定义member

        }else{
            $this->redirect("auth","login");
            return;
        }
    }

    /**
     *收货地址
     */
    public function results(){
//        $this->loadCss("resources/css/member_center.css");
//        $this->loadCss("resources/css/member_results.css");
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
//        $nav_info->level = 2;
//        $nav_info->info = "收货地址";
//        $this->view->set("nav_info",$nav_info);
    }

    /**
     *订单收收货地址
     */
    public function selAddress(){
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
    }

    /**
     * 会员收货地址
     */
    public function address()
    {
        $this->loadJs("js/member_results.js");
        $this->loadJs("js/utils.js");
        $this->loadJs("js/AjaxClass.js");
        $this->loadJs("js/region/region.js");
        //$this->loadJs("js/address.js");
//        $regions= Region::select(array('region_id','region_name'),array("region_type='1'"),"region_id asc");
//        $this->view->set("regions",$regions);
//
//        if(HttpSession::isHave('member_id')) {
//            $member_id=HttpSession::get('member_id');
//            $addresses=Address::get(array("member_id"=>$member_id));
//            foreach ($addresses as $address) {
//                $address->citys_by_province=Region::select(array('region_id','region_name'),"parent_id=".$address->province,"region_id asc");
//                $address->district_by_city=Region::select(array('region_id','region_name'),"parent_id=".$address->city,"region_id asc");
//                $province = Region::get_by_id($address->province)->region_name;
//                $city = Region::get_by_id($address->city)->region_name;
//                $district = Region::get_by_id($address->district)->region_name;
//                $address->allregion = $province." ".$city." ".$district;
//            }
//            $this->view->set("addresses",$addresses);
//        }else{
//            $this->redirect("index","index");
//        }

        //导航条
//        $nav_info->level = 2;
//        $nav_info->info = "收货地址";
//        $nav_info->link = Gc::$url_base."index.php?go=mobile2.member.address";
//        $this->view->set("nav_info",$nav_info);
    }
    /**
     * 修改收货地址
     */
    public function addressupd()
    {
        $this->loadJs("js/member_results.js");
        $this->loadJs("js/utils.js");
        $this->loadJs("js/AjaxClass.js");
        $this->loadJs("js/region/region.js");
        //$this->loadJs("js/address.js");
        $regions= Region::select(array('region_id','region_name'),array("region_type='1'"),"region_id asc");
        $this->view->set("regions",$regions);
        $address_id = isset($_GET['aid'])?$_GET['aid']:"";
        $address=Address::get_by_id($address_id);
        $address->citys_by_province=Region::select(array('region_id','region_name'),"parent_id=".$address->province,"region_id asc");
        $address->district_by_city=Region::select(array('region_id','region_name'),"parent_id=".$address->city,"region_id asc");
        $this->view->set("address",$address);

        //导航条
//        $nav_info->level = 2;
//        $nav_info->info = "收货地址";
//        $nav_info->link = Gc::$url_base."index.php?go=mobile2.member.address";
//        $this->view->set("nav_info",$nav_info);
    }
    /**
     * 选择收货地址
     */
    public function checkouAddress()
    {

        $address_id = isset($_GET['aid'])?$_GET['aid']:"";
        $address=Address::get_by_id($address_id);
        $address->updateTime=UtilDateTime::now();
        $address->update();
        $this->redirect("checkout","view");

    }

    /**
     * 添加会员收货地址
     */
    public function addAddress()
    {

        $this->loadJs("js/member_results.js");
        $this->loadJs("js/utils.js");
        $this->loadJs("js/AjaxClass.js");
        $this->loadJs("js/region/region.js");
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

}

?>
