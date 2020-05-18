<?php
/**
 +---------------------------------------<br/>
 * 控制器:帮助中心<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Helpcenter extends Action
{
    /**
     * 帮助中心详情页面
     */
    public function view()
    {
        $this->loadCss("resources/css/helpcenter.css");

        $help_id=$this->data["help_id"];
        $help_center=Helpcenter::get_by_id($help_id);
        if(empty($help_center)){
        	$help_center=Helpcenter::get_by_id(1);
		}
        $this->view->set("help_center",$help_center);

        $help = Helpcenter::get("isShow=1","sort_order desc");
        $this->view->set("help",$help);
    }
}
?>