<?php
/**
 +---------------------------------------<br/>
 * 控制器:商品<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Goods extends ActionMobile
{
    /**
     * 商品列表
     */
    public function lists()
    {
        $this->loadCss("resources/css/index.css");
        $this->loadCss("resources/css/myscroll.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/myscroll.js");
        // $cardno = HttpSession::get("cardno");
        // $result = UtilApi::getMember($cardno);
        // if ($result->code != "A00006") {
        //     $this->redirect("member", "add");
        // }
        // $member = $result->data;
        //根据会员卡的储值显示商品
        $where = "isValid=1";
        // if ((int)$member->user_balance ==300) {
        //     $where = " and voucher_name='菲生活卡300型'";
        // }elseif ((int)$member->user_balance ==500){
        //     $where = " and voucher_name='菲生活卡500型'";
        // }else{
        //     $where = " and (voucher_name='菲生活卡300型' or voucher_name='菲生活卡500型')";
        // }
        $id = isset($_GET['id'])?$_GET['id']:"";
        if ($id) {
            $where .= " and voucher_id=".$id;
        }
        $voucher = Voucher::get($where);
        $where = "";
        if (!empty($voucher)) {
            $goodsid = array();
            foreach ($voucher as $k => $val) {
                $vouchergoods = Vouchergoods::get("isValid=1 and voucher_id=".$val->voucher_id);
                if (!empty($vouchergoods)) {
                    foreach ($vouchergoods as $key => $value) {
                        $goodsid[]= $value->goods_id;
                    }
                }else{
                   $where .=" 1=2";
                }
            }
            $where .="isUp=1 and goods_id in(".implode(",",$goodsid).")";
        }else{
            $where .=" 1=2";
        }

        $goods = Goods::get($where,"sort_order");
        if(!empty($goods)){
            foreach ($goods as $key => $value) {
                $product = Product::get_by_id($value->product_id);
                $goods[$key]->image = $product->image;
            }
        }
        HttpSession::set("foot","index");
        $this->view->set("goods",$goods);
        $this->view->set("site_name","特惠商品");
    }

    /**
     * 商品详情
     */
    public function info(){
        $this->loadCss("resources/css/commerce.css");
        $this->loadCss("resources/css/msg.css");
        $this->loadCss("resources/css/myscroll.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/myscroll.js");
        $this->loadJs("js/msg.js");
        $this->loadJs("js/goods.js");
        $goodsId = isset($_GET['id'])?$_GET['id']:0;
        if($goodsId){
            $goods = Goods::get_by_id($goodsId);
            $product = Product::get_by_id($goods->product_id);
            $goods->image = $product->image;
            $goods->intro = $product->intro;
            $goods->specification = $product->specification;
            $this->view->set("goods",$goods);
            $this->view->set("site_name","购买商品");
        }else{
            $this->redirect("goods", "lists");
        }

    }

    /**
     *商品详情介绍
     */
    public function specification(){
        $goodsId = isset($_GET['id'])?$_GET['id']:0;
        if($goodsId){
            $goods = Goods::get_by_id($goodsId);
            $product = Product::get_by_id($goods->product_id);
            $goods->image = $product->image;
            $goods->intro = $product->intro;
            $goods->specification = $product->specification;
            $this->view->set("goods",$goods);
            $this->view->set("site_name","商品详情");
        }else{
            $this->redirect("goods", "lists");
        }
    }

    /**
     *配送及售后
     */
    public function delivery(){
         $this->loadCss("resources/css/commerce.css");
         $this->view->set("site_name","配送售后");
    }

}

?>
