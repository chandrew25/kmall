<?php
/**
 +---------------------------------------<br/>
 * 控制器:订单<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Order extends ActionMobile
{
    /**
     * 交易记录
     */
    public function invoice()
    {
        $this->loadCss("resources/css/order.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadCss("resources/css/custom.scroll.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/custom.scroll.js");
        $cardno = HttpSession::get("cardno");
        $data = array();
        $data['cardno'] = $cardno;
        $data['type'] = 1;
        $data['sdate'] = "0000-00-00 00:00:00";
        $data['edate'] = "9999-12-31 23:59:59";
        $data['page'] = 1;
        $infos = UtilApi::view_invoice($data);
        if ($infos->code != "A00006") {
            $infos = array();
            $count = 0;
        } else {
            $count = $infos->count;
            $infos = (array)$infos->data;
        }
        $this->view->set("count",$count);
        $this->view->set("orders",$infos);
        $this->view->set("site_name","交易记录");
    }
    /**
     * 交易记录加载
     */
    public function invoiceAjax()
    {
        $cardno = HttpSession::get("cardno");
        $data = array();
        $data['cardno'] = $cardno;
        $data['type'] = 1;
        $data['sdate'] = "0000-00-00 00:00:00";
        $data['edate'] = "9999-12-31 23:59:59";
        $data['page'] = $_GET['page'];
        $infos = UtilApi::view_invoice($data);
        if ($infos->code != "A00006") {
            $infos = array();
            $count = 0;
        } else {
            $count = $infos->count;
            $infos = (array)$infos->data;
        }
        $html = "";
        if (!empty($infos)) {
            foreach ($infos as $key => $value) {
               $html .='<div class="list">
                            <div class="left"></div>
                            <div class="top">
                                <div class="time color1">'.$value->time.'</div>
                                <div class="add">
                                    <div class=" color2">'.$value->store_name.'</div>
                                    <div class="map"><img src="home/youzan/view/default/resources/images/add.png"></div>
                                </div>
                            </div>
                            <div class="bott">
                                <div class="time color1">消费金额：
                                    <span class="color3">￥'.$value->total.'</span>
                                </div>
                                <div class="add color1">';
                $html .=($value->coupon_amount=="0")?"未使用优惠券":"使用".$value->coupon_amount."元优惠券";
                $html .="</div></div></div>";    
            }
        }
        echo json_encode($html);
        die();
    }

    /**
     * 充值记录
     */
    public function recharge()
    {
        $this->loadCss("resources/css/order.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadCss("resources/css/custom.scroll.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/custom.scroll.js");
        $cardno = HttpSession::get("cardno");
        $data = array();
        $data['cardno'] = $cardno;
        $data['type'] = 0;
        $data['sdate'] = "0000-00-00 00:00:00";
        $data['edate'] = "9999-12-31 23:59:59";
        $data['page'] = 1;
        $infos = UtilApi::view_invoice($data);
        if ($infos->code != "A00006") {
            $infos = array();
            $count = 0;
        } else {
            $count = $infos->count;
            $infos = (array)$infos->data;
        }
        $this->view->set("count",$count);
        $this->view->set("orders",$infos);
        $this->view->set("site_name","充值记录");
    }
    /**
     * 充值记录加载
     */
    public function rechargeAjax()
    {
        $cardno = HttpSession::get("cardno");
        $data = array();
        $data['cardno'] = $cardno;
        $data['type'] = 0;
        $data['sdate'] = "0000-00-00 00:00:00";
        $data['edate'] = "9999-12-31 23:59:59";
        $data['page'] = $_GET['page'];
        $infos = UtilApi::view_invoice($data);
        if ($infos->code != "A00006") {
            $infos = array();
            $count = 0;
        } else {
            $count = $infos->count;
            $infos = (array)$infos->data;
        }
        $html = "";
        if (!empty($infos)) {
            foreach ($infos as $key => $value) {
               $html .='<div class="list">
                            <div class="left"></div>
                            <div class="top">
                                <div class="time color1">'.$value->time.'</div>
                                <div class="add">
                                    <div class=" color2">'.$value->store_name.'</div>
                                </div>
                            </div>
                            <div class="bott">
                                <div class="time color1">充值金额：
                                    <span class="color3">￥'.$value->total.'</span>
                                </div>
                            </div>
                        </div>';    
            }
        }
        echo json_encode($html);
        die();
    }
}

?>