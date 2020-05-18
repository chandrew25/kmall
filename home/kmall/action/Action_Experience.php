 <?php
/**
 +---------------------------------------<br/>
 * 控制器:线下体验店<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author fxf 924197212@qq.com
 */
class Action_Experience extends Action
{       
     /**
      * 控制器:订单查询页面
      */
     public function show()
     {
        $this->loadCss("resources/css/experience.css");
        $this->loadJs("js/experience.js");
        
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
    
}
?>
