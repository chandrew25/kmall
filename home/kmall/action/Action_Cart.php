<?php
/**
 +---------------------------------------<br/>
 * 控制器:购物车<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Cart extends Action
{
    /**
     * 购物车列表页面
     */
    public function lists()
    {
        //清除cookie
        setcookie("backurl","");
        $this->loadCss("resources/css/cart.css");
        $this->loadJs("js/cart.js");
        //SQL
        //$this->listsOn();
        $this->listsOff();
        $checkcoupon=HttpSession::get("couponitems_key");
        $this->view->set("checkcoupon",$checkcoupon);

        $foo=10;//运费
        $this->view->set("foo",$foo);
    }

    /**
     * 添加商品到购物车
     * 添加同样的商品到购物车，数量增加。
     */
    public function addProduct()
    {
        //设置cookie 的backurl路径
        $backurl=$_SERVER['HTTP_REFERER'];
        setcookie("backurl",$backurl,time()+3600*24*30);
        //SQL
        //$this->addProductOn();
        //COOKIE
        $this->addProductOff();
    }

    /**
     * 从购物车里删除商品
     */
    public function delProduct()
    {
        //SQL
        //$this->delProductOn();
        //COOKIE
        $this->delProductOff();
    }

    /**
     * 从购物车里删除选中商品
     */
    public function delSelProducts(){
        $sels=$this->data['sels'];
        $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
        foreach ($sels as $cart_id=>$checked) {
            if($checked=='on'){
                if (!empty($cart_id)){
                    $goods = $carts->$cart_id;
                    if ($goods->isLimited >0) {
                        $product=Seckillproduct::get_one("seckill_id=".$goods->isLimited." and product_id=".$cart_id);
                        $product->bought_num = $product->bought_num - $goods->num;
                        $product->update();
                    }
                    unset($carts->$cart_id);
                }
            }
            setcookie(Gc::$appName."_cart",json_encode($carts),time()+3600*24*30,"/");
        }
        $this->redirect("cart","lists");
    }

    /**
     * 更新购物车
     */
    public function refresh()
    {
        //SQL
        //$this->refreshOn();
        //COOKIE
        $this->refreshOff();
    }

    /**
     * 清空购物车
     */
    public function clear()
    {
        //SQL
        //$this->clearOn();
        //cookie
        $this->clearOff();
    }

    /**
     * 购物车列表页面    by数据库
     */
    public function listsOn()
    {
        //需要先登陆
        if(!HttpSession::isHave('member_id')) {
            $this->redirect("auth","login");
            return;
        }

        $member_id=HttpSession::get("member_id");
        //显示购物车商品列表信息
        $carts=Cart::get("member_id=".$member_id);
        $this->view->set("carts",$carts);

        //显示购物车商品列表统计信息
        $statistic=array("totalPrice"=>0,"totalJifen"=>0,"totalMarketPrice"=>0,"totalSavePrice"=>0,"ratio"=>"0");
        foreach ($carts as $cart) {
            $statistic["totalPrice"]+=$cart->price*$cart->num;
            $statistic["totalMarketPrice"]+=$cart->market_price*$cart->num;
            $statistic["totalJifen"]+=$cart->jifen*$cart->num;
        }
        $statistic["totalSavePrice"]=$statistic["totalMarketPrice"]-$statistic["totalPrice"];
        if ($statistic["totalMarketPrice"]>0){
            $statistic["ratio"] =round($statistic["totalSavePrice"]*100/$statistic["totalMarketPrice"]);
        }
        $this->view->set("statistic",$statistic);
    }

    /**
     * 购物车列表页面     by Cookie
     */
    public function listsOff()
    {
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
        $this->view->set("statistic",$statistic);

        $nav_info = new stdClass();
        //导航条
        $nav_info->level = 2;
        $nav_info->info = "购物车";
        $nav_info->link = Gc::$url_base."index.php?go=kmall.cart.lists";
        $this->view->set("nav_info",$nav_info);
    }



    /**
     * 添加商品到购物车
     * 添加同样的商品到购物车，数量增加。  by数据库
     */
    public function addProductOn()
    {
        $product_id=$this->data["product_id"];
        $num=1;
        if (array_key_exists('num',$this->data)){
            $num=$this->data["num"];
        }
        if (!empty($product_id)){
            if(!HttpSession::isHave('member_id')){
                $this->redirect("auth","login");
                return;
            }
            $member_id=HttpSession::get("member_id");
            $condition=array("member_id"=>$member_id,"product_id"=>$product_id);
            $cart=Cart::get($condition);
            if ($cart==null){
                $product=Product::get_by_id($product_id);
                if ($product!=null){
                    $cart=new Cart();
                    $cart->product_code=$product->product_code;
                    $cart->product_name=$product->name;
                    $cart->product_ico =$product->image;
                    $cart->product_id  =$product->product_id;
                    $cart->member_id   =$member_id;
                    $cart->market_price=$product->market_price;
                    $cart->price       =$product->price;
                    $cart->jifen       =$product->jifen;
                    $cart->num         =$num;
                    $cart->save();
                }
            }else{
                Cart::increment($condition,'num',$num);
            }
            $this->redirect('cart','lists');
        }else{
            $this->redirect("info","view","type=".EnumViewInfoType::CARTADDPRODUCT);
        }
    }



    /**
    * 添加商品到购物车
    * 添加同样的商品到购物车，数量增加。  by Cookie
    */
    public function addProductOff(){
        $product_id=$this->data["product_id"];
        $num=1;
        if (array_key_exists('num',$this->data)){
            $num=$this->data["num"];
        }
        if (!empty($product_id)){
            if(!HttpSession::isHave('member_id')){
                $this->redirect("auth","login");
                return;
            }
            $member_id=HttpSession::get("member_id");
            $product=Product::get_by_id($product_id);
            if ($product!=null){
                $array= json_decode(($_COOKIE[Gc::$appName."_cart"]));
                $oldproduct_id=$product->product_id;
                $oldproduct=$array->$oldproduct_id;
                if(empty($oldproduct)){
                    $product_arr->product_code=$product->product_code;
                    $product_arr->name=$product->productShow;
                    $product_arr->ico=$product->image;
                    $product_arr->product_id=$product->product_id;
                    $product_arr->market_price=$product->market_price;
                    $product_arr->price=$product->price;
                    $product_arr->jifen=$product->jifen;

                    $product_arr->num=$num;
                    $array_id= $product->product_id;
                    $array->$array_id=$product_arr;
                }else{
                    $oldproduct->num=$oldproduct->num+1;
                    $array_id= $product->product_id;
                    $array->$array_id=$oldproduct;
                }
                setcookie(Gc::$appName."_cart",json_encode($array),time()+3600*24*30,"/");
            }
            $this->redirect('cart','lists');
        }else{
            $this->redirect("info","view","type=".EnumViewInfoType::CARTADDPRODUCT);
        }
    }

    /**
     * 从购物车里删除商品  by数据库
     */
    public function delProductOn()
    {
        $cart_id=$this->data["cart_id"];
        if (!empty($cart_id)){
            Cart::deleteByID($cart_id);
        }
        $this->redirect("cart","lists");
    }

    /**
     * 从购物车里删除商品  by cookie
     */
    public function delProductOff()
    {
        $cart_id=$this->data["cart_id"];
        if (!empty($cart_id)){
            $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
            $goods = $carts->$cart_id;
            if ($goods->isLimited >0) {
                $product=Seckillproduct::get_one("seckill_id=".$goods->isLimited." and product_id=".$cart_id);
                $product->bought_num = $product->bought_num - $goods->num;
                $product->update();
            }
            unset($carts->$cart_id);
            setcookie(Gc::$appName."_cart",json_encode($carts),time()+3600*24*30,"/");
        }
        $this->redirect("cart","lists");
    }

    /**
     * 更新购物车 by 数据库
     */
    public function refreshOn()
    {
        if (array_key_exists('buy_num',$this->data)){
            $buy_num=$this->data['buy_num'];
            foreach ($buy_num as $cart_id=>$num) {
                Cart::updateProperties($cart_id,array('num'=>$num));
            }
        }
        $this->redirect("cart","lists");
    }


    /**
     * 验证秒杀商品
     */
    public function isLimited()
    {
        $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
        $product_id= $this->data["product_id"];
        $num=$this->data["num"];
        $isLimited=$this->data["isLimited"];
        $product=Seckillproduct::get_one("seckill_id=".$isLimited." and product_id=".$product_id);//商品
        $result = array("code"=>1);
        if ($product) {
            $numold = $carts->$product_id->num;
            if ($num>$numold) {
                if ($product->limit_num <$num) {
                    if ($product->limit_num >0) {
                        $result = array("code"=>2,"msg"=>'秒杀商品限购'.$product->limit_num.'个');
                    }else{
                        $result = array("code"=>2,"msg"=>'已秒杀完');
                    }
                    echo json_encode($result);
                    die;
                }
                $num = $num - $numold;
                $sum = $product->sec_num - $product->bought_num;
                if ($num>$sum) {
                    if ($sum>0) {
                        $result = array("code"=>3,"msg"=>'秒杀商品库存只剩'.$sum.'个');
                    }else{
                        $result = array("code"=>3,"msg"=>'已秒杀完');
                    }
                    echo json_encode($result);
                    die;
                }
                $product->bought_num = $product->bought_num + $num;
            }else{
                $num = $numold - $num;
                $product->bought_num = $product->bought_num + $num;
            }
            $product->update();
        }
        echo json_encode($result);
    }

    /**
     * 更新购物车 by cookie
     */
    public function refreshOff()
    {
        if (array_key_exists('buy_num',$this->data)){
            $buy_num=$this->data['buy_num'];
            $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
            $carts=(array)$carts;
            
            foreach ($carts as $key=>$value) {
                $carts[$key]=$value;
            }

            foreach ($buy_num as $goods_id=>$num) {
                //购物车中的商品
                $goods=$carts[$goods_id];
                //如果该商品有赠品
                $gift_arr=$goods->gift_arr;
                if($gift_arr){
                    $old_num=$goods->num;
                    //获取该货品的product_id
                    $product_id=Goods::select_one("product_id","goods_id=".$goods_id);
                    //获取该商品的赠品
                    $gifts=Productgift::get(array("product_id=".$product_id,"isShow=1"),"sort_order desc");
                    //赠品gift_id和nums对应关系
                    $gnums_arr=array();
                    foreach($gifts as $gift){
                        $gnums_arr[$gift->gift_id]=$gift->nums;
                    }
                    //处理购物车商品数量变化
                    if($num>$old_num){
                        //数量增加
                        $changenum=$num-$old_num;
                        //将赠品对象放入数组
                        foreach($gift_arr as $gift){
                            $re_gift_arr[]=$gift;
                        }
                        //获取已有的第一种赠品
                        $fgift_id=$re_gift_arr[0]->gift_id;
                        //该赠品的num基数
                        $gnum=$gnums_arr[$fgift_id];
                        //赠品增加个数
                        $increnum=$gnum*$changenum;
                        //该赠品数量增加
                        $gift_arr->$fgift_id->gift_num+=$increnum;
                    }else if($num<$old_num){
                        //数量减少
                        $changenum=$old_num-$num;
                        //将赠品对象放入数组
                        foreach($gift_arr as $gift){
                            //赠品id
                            $gift_id=$gift->gift_id;
                            //该赠品的num基数
                            $gnum=$gnums_arr[$gift_id];
                            //赠品减少个数
                            $reducenum=$gnum*$changenum;
                            if($gift->gift_num<=$reducenum){
                                $changenum-=($gift->gift_num/$gnum);
                                unset($gift_arr->$gift_id);
                            }else if($changenum){
                                $gift->gift_num-=$reducenum;
                                break;
                            }
                        }
                    }
                }
                $goods->num=$num;
            }
            setcookie(Gc::$appName."_cart",json_encode($carts),time()+3600*24*30,"/");
        }
        $this->redirect("cart","lists");
    }

    /**
     * 清空购物车 by数据库
     */
    public function clearOn()
    {
        Manager_Service::cartService()->deleteAll();
        $this->redirect("cart","lists");
    }

    /**
     * 清空购物车 by cookie
     */
    public function clearOff()
    {
        setcookie(Gc::$appName."_cart","","-1","/");
        $this->redirect("cart","lists");
    }
}

?>
