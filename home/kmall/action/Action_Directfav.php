<?php
/**
 * 控制器:优惠直达
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author fxf 924197212@qq.com
 */
class Action_Directfav extends Action
{        
     /**
      * 控制器:优惠直达
      */
    public function check()
    {
        $couponitems_key=$this->data["couponitems_key"];
        $product_id=trim($this->data["product_id"]);
        if($couponitems_key&&is_numeric($product_id)){
            //判断优惠券是否存在且未兑换
            $couponitems=Couponitems::get_one(array("couponitems_key='$couponitems_key'","isExchange=0"));
            if($couponitems){
                $coupon_id=$couponitems->coupon_id;
                $isExchange=$couponitems->isExchange;
                $coupon=Coupon::get_by_id($coupon_id);
                $nowtime=UtilDateTime::dateToTimestamp(UtilDateTime::now());
                if($coupon->isValid==1 && $nowtime > $coupon->begin_time && $nowtime < $coupon->end_time){
                    $preferentialrule=Preferentialrule::get_one("classify_id='$coupon_id'");
                    if($preferentialrule->classify_type==1 && $preferentialrule->ifCoupon==1){
                        if($nowtime > $preferentialrule->begin_time && $nowtime < $preferentialrule->end_time){
                            //立减优惠
                            if($preferentialrule->preferential_type==5){
                                //找到该优惠的所有商品
                                $pidarr=Prefproduct::select("product_id","preferentialrule_id='$preferentialrule->preferentialrule_id'");
                                $pidarr=(array)$pidarr;
                                //判断所购买商品是否享受该优惠
                                $pexist=false;
                                if(in_array($product_id,$pidarr)){
                                    //添加相应商品到购物车
                                    $product=Product::get_by_id($product_id);
                                    //根据商品选择货品(临时性修改，现在货品唯一)
                                    $goods=Goods::get_one("product_id=".$product_id);
                                    $goods_id=$goods->goods_id;
                                    //增加一个
                                    $num=1;
                                    if ($product){
                                       //从cookie获取购物车信息
                                        $cart_arr=json_decode(($_COOKIE[Gc::$appName."_cart"]));
                                        //判断购物车中是否存在该购买商品
                                        $goods_arr=$cart_arr->$goods_id;
                                        if(empty($goods_arr)){
                                            $goods_arr->goods_code=$goods->goods_code;
                                            $goods_arr->goods_name=$goods->goods_name;
                                            $goods_arr->ico=$product->image;
                                            $goods_arr->goods_id=$goods->goods_id;
                                            $goods_arr->product_id=$product->product_id;
                                            $goods_arr->sales_price=$goods->sales_price;
                                            $goods_arr->market_price=$goods->market_price;
                                            $goods_arr->num=$num;
                                        }else{
                                            $goods_arr->num+=$num;
                                        }
                                        //选择赠品(现阶段临时选择电视机底座)
                                        $pgift=Productgift::get_one("product_id=".$product_id,"gift_id desc");
                                        $gift_id=$pgift->gift_id;
                                        //获取赠品信息
                                        $gift=Goods::get_by_id($gift_id);
                                        //如果存在赠品
                                        $gnum=$pgift->nums;
                                        if($gift){
                                            //赠品数量*购买商品数量
                                            $giftnum=$gnum*$num;
                                            //判断该赠品是否在赠品数组中
                                            $gift_arr=$goods_arr->gift_arr->$gift_id;
                                            if(empty($gift_arr)){
                                                $gift_arr->gift_id=$gift_id;
                                                $gift_arr->gift_code=$gift->goods_code; 
                                                $gift_arr->gift_name=$gift->goods_name;
                                                $gift_arr->gift_price=$gift->sales_price;
                                                $gift_arr->gift_num=$giftnum;   
                                            }else{
                                                $gift_arr->gift_num+=$giftnum;
                                            }
                                            //赠品信息存入赠品数组
                                            $goods_arr->gift_arr->$gift_id=$gift_arr;  
                                        }
                                        //购物车商品信息存入购物车数组
                                        $cart_arr->$goods_id=$goods_arr;
                                        setcookie(Gc::$appName."_cart",json_encode($cart_arr),time()+3600*24*30,"/"); 
                                    }
                                    //优惠券号存入session
                                    HttpSession::set("couponitems_key",$couponitems_key);
                                    //优惠金额
                                    $couponprice=$preferentialrule->limit_reduce;
                                    HttpSession::set("couponprice",$couponprice);
                                    //跳转到预定页面
                                    $this->redirect("reservation","view");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        $this->redirect("index","index");
    }
} 
?>
