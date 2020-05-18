<?php
/**
 +---------------------------------------<br/>
 * 控制器:购物车<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Cart extends ActionMobile
{
    /**
     * 购物车列表
     */
    public function lists()
    {
        $this->loadCss("resources/css/cart.css");
        $this->loadCss("resources/css/myscroll.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadCss("resources/css/msg.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/myscroll.js");
        $this->loadJs("js/msg.js");
        $this->loadJs("js/cart.js");
        $member_id = HttpSession::get("member_id");
        if(!$member_id){
            $this->redirect("member", "add");
            die();
        }
        $goods = Cart::get("member_id=".$member_id);
        if (empty($goods)) {
            $this->redirect("cart", "cartno");
        }
        $price = $this->getCartPrice();

        HttpSession::set("foot","cart");
        $this->view->set("price",$price);
        $this->view->set("goods",$goods);
        $this->view->set("site_name","购物车");
    }

    public function cartno(){
        $this->loadCss("resources/css/cart.css");
        HttpSession::set("foot","cart");
        $this->view->set("site_name","购物车");
    }
    /**
     *加入购物车
     */
    public function addCart(){
        $member_id = HttpSession::get("member_id");
        $goodsId = isset($_POST['goods_id'])?$_POST['goods_id']:"";
        $num = isset($_POST['num'])?$_POST['num']:0;
        if (!$goodsId) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"请选择您要加入购物车的商品"
            );
            echo json_encode($response);
            die();
        }
        if ($num<1) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"您要加入购物车的商品数量必须大于等于1"
            );
            echo json_encode($response);
            die();
        }
        
        $goods = Goods::get_by_id($goodsId);
        if (empty($goods)) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"您要加入购物车的商品已下架"
            );
            echo json_encode($response);
            die();
        }
        $where = "product_id=".$goods->product_id." and member_id=".$member_id;
        $cart = Cart::get_one($where);
        $Product = Product::get_by_id($goods->product_id);
        if ($cart) {
            $cartnum = 0;
            $num = $cart->num + $num;
            $cart->product_name = $Product->product_name;
            $cart->product_ico = $Product->image;
            $cart->market_price = $Product->market_price;
            $cart->price = $Product->price;
            $cart->goods_id = $goodsId;
            $cart->num = $num;
            $cart->commitTime = time();
            $cart_id = $cart->update();
        }else{
            $cartnum = 1;
            $cart = new Cart();
            $cart->member_id = $member_id;
            $cart->product_id = $goods->product_id;
            $cart->product_code = $Product->product_code;
            $cart->product_name = $Product->product_name;
            $cart->product_ico = $Product->image;
            $cart->goods_id = $goodsId;
            $cart->market_price = $Product->market_price;
            $cart->price = $Product->price;
            $cart->num = $num;
            $cart->commitTime = time();
            $cart_id = $cart->save();
        }
        if ($cart_id) {
            $response = array(
                "success" => "success",
                "title"=>"温馨提示",
                "data" =>"恭喜您！商品已加入购物车",
                "cartnum"=>$cartnum
            );
            echo json_encode($response);
            die();
        }else{
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"对不起!加入购物车失败"
            );
            echo json_encode($response);
            die();
        }

    }
    /**
     *修改购物车商品数量
     */
    public function setNum(){
        $member_id = HttpSession::get("member_id");
        $cartId = isset($_POST['cartId'])?$_POST['cartId']:"";
        $num = isset($_POST['num'])?$_POST['num']:0;
        if (!$cartId) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"请选择您要加入购物车的商品"
            );
            echo json_encode($response);
            die();
        }
        if ($num<1) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"您要加入购物车的商品数量必须大于等于1"
            );
            echo json_encode($response);
            die();
        }
        $cart = Cart::get_by_id($cartId);
        if (empty($cart)) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"请您选您要修改的购物车商品"
            );
            echo json_encode($response);
            die();
        }
        $cart->num = $num;
        $cart->update(); 
        $price = $this->getCartPrice();
        
        $response = array(
            "success" => "success",
            "title"=>"温馨提示",
            "data" => $price
        );
        echo json_encode($response);
        die();

    }
    /**
     * 删除购物车商品
     */
    public function delCart(){
        $member_id = HttpSession::get("member_id");
        $cartId = isset($_POST['cartId'])?$_POST['cartId']:"";
        if (!$cartId) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"请选择您要删除的购物车商品"
            );
            echo json_encode($response);
            die();
        }
        
        $cart = Cart::deleteByID($cartId);
        $price = $this->getCartPrice();
        $response = array(
            "success" => "success",
            "title"=>"温馨提示",
            "data" => $price
        );
        echo json_encode($response);
        die();

    }
    /**
     *获取购物车总额
     */
    public function getCartPrice(){
        $member_id = HttpSession::get("member_id");
        $goods = Cart::get("member_id=".$member_id);
        $price = 0;
        if (!empty($goods)) {
            foreach ($goods as $key => $value) {
                $price += $value->price * $value->num;
            }
        }
        return sprintf("%.2f",$price);
    }
    
}

?>