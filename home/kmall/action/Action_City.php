<?php
/**
 * 城市运营商
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author fxf 924197212@qq.com
 */
class Action_City extends Action
{        
     /**
      * 城市运营商
      */
     public function city()
     {
        $this->loadCss("resources/css/city.css");
        $this->loadJs("js/city.js");
        
        //$this->loadJs("js/member_results.js");
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
}  
?>
