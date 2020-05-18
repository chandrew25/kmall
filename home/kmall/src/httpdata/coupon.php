<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    session_start();
    
    $coupontext=$_REQUEST["coupontext"];
    $totalprice=$_REQUEST["totalprice"];
    $canle=$_REQUEST["canle"];
    $pids=explode(",",$_REQUEST["pids"]);
    $calcs=explode(",",$_REQUEST["calcs"]);
    $num=count($pids);
    $couponitems=Couponitems::get_one("couponitems_key='$coupontext'");
    $coupon_id=$couponitems->coupon_id;
    $isExchange=$couponitems->isExchange;
    $coupon=Coupon::get_by_id($coupon_id);
    $nowtime=UtilDateTime::dateToTimestamp(UtilDateTime::now());
    $finalprice=$totalprice;
    if($isExchange==0){
        if($coupon->isValid==1 && $nowtime > $coupon->begin_time && $nowtime < $coupon->end_time){
            $preferentialrule=Preferentialrule::get_one("classify_id='$coupon_id'");
            if($preferentialrule->classify_type==1 && $preferentialrule->ifCoupon==1){
                if($nowtime > $preferentialrule->begin_time && $nowtime < $preferentialrule->end_time){
                    if($preferentialrule->preferential_type==1){
                        $discount = $preferentialrule->discount;
                        if($preferentialrule->ifEffectall==1){
                            $finalprice = $discount*$totalprice;
                        }else{
                            $finalprice=0;
                            $pidarr=Prefproduct::select("product_id","preferentialrule_id='$preferentialrule->preferentialrule_id'");
                            $count=count($pidarr);
                            for($j=0;$j<$count;$j++){
                                for($i=0;$i<$num;$i++){
                                    if($pids[$i]==$pidarr[$j]){
                                        $calcs[$i]=$discount*$calcs[$i];
                                        break;                               
                                    }
                                }
                            }
                            for($i=0;$i<$num;$i++){
                                $finalprice=$finalprice+$calcs[$i];
                            }
                        }
                    }else if($preferentialrule->preferential_type==3 && $totalprice > $preferentialrule->money_lower){
                        $discount = $preferentialrule->discount;
                        $finalprice = $discount*$totalprice;
                    }else if($preferentialrule->preferential_type==4 && $totalprice > $preferentialrule->money_lower){
                        $money_lower = $preferentialrule->money_lower;
                        $limit_reduce = $preferentialrule->limit_reduce;
                        $num = $totalprice/$money_lower;
                        $finalprice = $totalprice-($num*$limit_reduce);
                    }else if($preferentialrule->preferential_type==5){
                        //优惠券抵用金额
                        $limit_reduce = $preferentialrule->limit_reduce;
                        //找到该优惠的所有商品
                        $pidarr=Prefproduct::select("product_id","preferentialrule_id='$preferentialrule->preferentialrule_id'");
                        $count=count($pidarr);
                        //判断所购买商品是否享受该优惠
                        $pexist=false;
                        for($j=0;$j<$count;$j++){
                            for($i=0;$i<$num;$i++){
                                if($pids[$i]==$pidarr[$j]){
                                    $pexist=true;
                                    break;                              
                                }
                            }
                            if($pexist){
                                //最终金额=总金额-立减金额
                                $finalprice = $totalprice-$limit_reduce;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    //优惠金额
    $couponprice=$totalprice-$finalprice;
    $couponprice=sprintf("%.2f",substr(sprintf("%.3f",$couponprice), 0, -1));
    if($couponprice){
        HttpSession::set("couponitems_key",$coupontext);
        HttpSession::set("couponprice",$couponprice);
    }else{
        HttpSession::removes(array("couponprice","couponitems_key"));
    }
    if($canle==1){
        HttpSession::removes(array("couponprice","couponitems_key"));
        echo "";
    }else{
        echo json_encode($couponprice);
    }
?>
