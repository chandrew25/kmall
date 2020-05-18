 <?php
/**
 +---------------------------------------<br/>
 * 控制器:智能电视<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Smartv  extends Action
{       
    /**
    * 列表
    */
    public function lists()
    { 
        $this->loadCss("resources/css/smartv.css");
        $this->loadJs("js/smartv.js");
    }

    /**
    * 详细
    */
    public function view()
    { 

    }
    
}
?>
