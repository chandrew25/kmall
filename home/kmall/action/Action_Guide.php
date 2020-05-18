 <?php
/**
 +---------------------------------------<br/>
 * 控制器:引导页面<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Guide extends Action
{       
     /**
      * 控制器:活动页面
      */
     public function lists()
     { 
        $this->loadCss("resources/css/guide.css");
        $this->loadJs("js/guide.js");     
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
    
}
?>
