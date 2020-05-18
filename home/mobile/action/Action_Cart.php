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
//        $this->loadCss("resources/css/cart.css");
//        $this->loadCss("resources/css/myscroll.css");
//        $this->loadCss("resources/css/scrollbar.css");
//        $this->loadCss("resources/css/msg.css");
//        $this->loadJs("js/iscroll.js");
//        $this->loadJs("js/myscroll.js");
//        $this->loadJs("js/msg.js");
        $this->loadJs("js/cart.js");
        //显示购物车商品列表信息
        $carts= json_decode($_COOKIE[Gc::$appName."_cart"]);
        $carts=(array) $carts;
        $this->view->set("carts",$carts);
        //显示购物车商品列表统计信息
        $statistic=array("totalPrice"=>0,"totalJifen"=>0,"totalMarketPrice"=>0,"totalSavePrice"=>0,"ratio"=>"0");
        foreach ($carts as $goods) {
            $statistic["totalPrice"]+=$goods->sales_price*$goods->num;
            $statistic["totalMarketPrice"]+=$goods->market_price*$goods->num;
            $statistic["totalJifen"]+=$goods->jifen*$goods->num;
        }
        $statistic["totalSavePrice"]=$statistic["totalMarketPrice"]-$statistic["totalPrice"];
        if ($statistic["totalPrice"]>0){
            $statistic["ratio"] =round($statistic["totalSavePrice"]*100.0/$statistic["totalMarketPrice"]);
        }
//        echo "<pre>";var_dump($carts);var_dump($statistic);die;
        $this->view->set("statistic",$statistic);
        $foo=10;//运费
        $this->view->set("foo",$foo);
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
        $product_id = isset($_POST['goods_id'])?$_POST['goods_id']:"";
        $num = isset($_POST['num'])?$_POST['num']:0;
        $t = isset($_POST['t'])?$_POST['t']:0;
        if (!$product_id) {
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

        $product=Product::get_by_id($product_id);
        if (empty($product)) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"您要加入购物车的商品已下架"
            );
            echo json_encode($response);
            die();
        }
        //从cookie获取购物车信息
        $cart_arr=json_decode(($_COOKIE[Gc::$appName."_cart"]));
        //判断购物车中是否存在该购买商品
        $goods_arr=$cart_arr->$product_id;
        if(empty($goods_arr)){
            $goods_arr->goods_code=$product->product_code;
            $goods_arr->goods_name=$product->productShow;
            $goods_arr->sales_price=$product->price;
            $goods_arr->goods_id=$product->product_id;
            $goods_arr->ico=$product->image;
            $goods_arr->product_id=$product->product_id;
            $goods_arr->jifen=$product->jifen;
            $goods_arr->market_price=$product->market_price;
            $goods_arr->price=$product->price;
            $goods_arr->num=$num;
            $goods_arr->isLimited = $isLimited;
        }else{
            if ($t){
                $goods_arr->num-=$num;
            }else{
                $goods_arr->num+=$num;
            }
        }
        //购物车商品信息存入购物车数组
        $cart_arr->$product_id=$goods_arr;
        setcookie(Gc::$appName."_cart",json_encode($cart_arr),time()+3600*24*30,"/");
        $_COOKIE[Gc::$appName."_cart"]=json_encode($cart_arr);

        $response = array(
            "success" => "success",
            "data" =>"恭喜您！商品已加入购物车"
        );
        echo json_encode($response);
        die();


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
        $cartId = isset($_POST['goods_id'])?$_POST['goods_id']:"";
        if (!$cartId) {
            $response = array(
                "success" => "no",
                "title"=>"温馨提示",
                "data" =>"请选择您要删除的购物车商品"
            );
            echo json_encode($response);
            die();
        }
        //从cookie获取购物车信息
        $cart_arr=json_decode(($_COOKIE[Gc::$appName."_cart"]));
        //判断购物车中是否存在该购买商品
        $goods_arr=$cart_arr->$cartId;
        if ($goods_arr){
            unset($cart_arr->$cartId);
            setcookie(Gc::$appName."_cart",json_encode($cart_arr),time()+3600*24*30,"/");
        }
        $response = array(
            "success" => "success",
            "title"=>"温馨提示"
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