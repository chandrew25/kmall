<?php
/**
 * 控制器:404    
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author fxf 924197212@qq.com
 */
class Action_Building extends Action
{        
     /**
      * 控制器:404
      */
     public function view()
     {
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
} 
?>
