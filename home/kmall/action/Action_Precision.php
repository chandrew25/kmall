 <?php
/**
 +---------------------------------------<br/>
 * 控制器:精密仪器<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author fxf 924197212@qq.com
 */
class Action_Precision extends Action
{       
     /**
      * 控制器:活动页面
      */
     public function lists()
     { 
        $this->loadCss("resources/css/precision.css");
        $this->loadJs("js/precision.js");
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
    
}
?>
