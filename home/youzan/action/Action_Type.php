<?php
/**
 +---------------------------------------<br/>
 * 控制器:商品类型<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Type extends ActionMobile
{
    /**
     * 购物车列表
     */
    public function lists()
    {
        $this->loadCss("resources/css/type.css");
        $this->loadCss("resources/css/myscroll.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/myscroll.js");
        $voucher = Voucher::get("isValid=1","sort_order");
        $this->view->set("voucher",$voucher);
        $this->view->set("site_name","商品类型");
        HttpSession::set("foot","type");
    }

}

?>