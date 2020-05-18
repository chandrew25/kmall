 <?php
/**
 +---------------------------------------<br/>
 * 控制器:消费电子<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author fxf 924197212@qq.com
 */
class Action_Consume extends Action
{       
     /**
      * 控制器:活动页面
      */
     public function lists()
     { 
      
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
    
}
?>
