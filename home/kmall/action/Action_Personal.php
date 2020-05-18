 <?php
/**
 +---------------------------------------<br/>
 * 控制器:个人中心<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Personal extends Action
{       
     /**
      * 控制器:个人中心
      */
     public function personal()
     { 
        $this->loadCss("resources/css/personal.css");

     }
     public function order()
     { 
        $this->loadCss("resources/css/order.css");

     }
    
}
?>
