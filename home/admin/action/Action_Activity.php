<?php
/**
 * 控制器:活动管理管理
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Activity extends ActionExt
{

    /**
     * 控制器:活动
     */
    public function activity()
    {
        $this->init();
        $this->ExtDirectMode();
        $this->ExtUpload();
        $this->loadExtJs('activity/activity.js');
        $this->load_onlineditor('intro');
    }

    /**
     * 控制器:活动拥有的商品
     */
    public function activityproduct()
    {
        $this->init();
        $this->ExtDirectMode();
        $this->ExtUpload();
        $this->loadExtJs('activity/activityproduct.js');
    }


}
