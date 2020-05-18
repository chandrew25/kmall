<?php
/**
 +---------------------------------------<br/>
 * 控制器:优惠券<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Coupon extends ActionMobile
{
    /**
     *添加会员页面
     */
    public function lists(){
        $this->loadCss("resources/css/coupon.css");
        $this->loadCss("resources/css/myscroll.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/myscroll.js");
        $mobile = HttpSession::get("mobile");
        $data = array();
        $data['user_mobile'] = $mobile;
        $data['status'] = 0;
        $data['inv_type'] = 2;

        $result = UtilApi::buy_coupon($data);
        $coupon = array();
        if ($result->code == "A00006") {
            $coupon = $result->data;
            foreach ($coupon as $key => $value) {
                $coupon[$key]->amount = (int)$value->amount;
                $coupon[$key]->time = date("Y-m-d",strtotime($value->time));
                $coupon[$key]->exp_date = date("Y-m-d",strtotime($value->exp_date));
            }
        }
        $this->view->set("coupon",$coupon);
        $this->view->set("site_name","优惠券");
    }
}

?>