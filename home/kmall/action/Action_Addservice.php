 <?php
/**
 +---------------------------------------<br/>
 * 控制器:增值服务<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Addservice  extends Action
{       
	 /**
	  * 控制器:显示提示信息
	  */
	 public function lists()
	 { 
        $this->loadCss("resources/css/addservice.css"); 
        
        //导航条
        $nav_info->level = 2;
        $nav_info->info = "增值服务";
        $nav_info->link = Gc::$url_base."index.php?go=kmall.addservice.lists";
        $this->view->set("nav_info",$nav_info);
	 }
	
}
?>
