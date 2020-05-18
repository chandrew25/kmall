<?php
/**
 +---------------------------------------<br/>
 * 控制器:范例<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Example extends Action
{
	/**
	 * 视图
	 */
	public function view()
	{
        $this->loadCss("resources/css/example_view.css");
        $this->loadJs("js/example_view.js");
    }
    /**
      *  装修风格
      */
     public function lists()
     {
         $this->loadCss("resources/css/example_lists.css");
         $this->loadJs("js/example_lists.js");
         
        
     }
}
?>
