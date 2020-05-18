 <?php
/**
 +---------------------------------------<br/>
 * 控制器:关于我们<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_About extends Action
{       
     /**
      * 控制器:活动页面
      */
     public function view()
     { 
        $this->loadCss("resources/css/about.css");
        
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
    
}
?>
