<?php
/**
 +---------------------------------------<br/>
 * 控制器:最新上架
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Newest extends Action
{
    /**
     * 销售排行榜列表页面
     */
    public function lists()
    {
        $ptype_id = $this->data['ptype_id'];           
        $websafe = is_numeric($ptype_id)||empty($ptype_id); 
        if($websafe){
            $this->loadCss("resources/css/newest.css");
            
            $ptypes=Ptype::get("level=2",null,"0,8");
            $ptype_id=$this->data["ptype_id"];
            if($ptype_id){
        	    $products=Product::get("isUp='1' and ptype_id=".$ptype_id,"uptime desc","0,10");
		    }else{
			    $products=Product::get("isUp=1","uptime desc","0,10");
		    }
            $this->view->set("ptype_id",$ptype_id);
            $this->view->set("ptypes",$ptypes);
            $this->view->set("products",$products);
            
            //导航条
            $nav_info->level = 2;
            $nav_info->info = "最新上架";
            $nav_info->link = Gc::$url_base."index.php?go=kmall.newest.lists";
            $this->view->set("nav_info",$nav_info);
        }else{
            $this->redirect("index","index");    
        }
    }
}
?>
