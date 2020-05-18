<?php
require_once('../../../../init.php');

LogPay::log_file("商户后台回调地址-notifyurl.php:\r\n".print_pre($_POST));
/**
 * 商户后台回调地址,查看返回信号是否交易成功
 */
if(Payment_Sheng::current()->returnSign()){
    $oid=$_POST['OrderNo'];
    $fee=$_POST['TransAmount'];
    //商家自行检测商家订单状态，避免重复处理，而且请检查fee的值与订单需支付金额是否相同
    if(($pos=strpos($oid,"topuplog"))!==false){//充值
        $topuplog_id=substr($oid,$pos+8);//充值记录标识
        $topuplog=Topuplog::get_by_id($topuplog_id);//充值记录
        if(sprintf("%01.2f",$topuplog->amount) == $fee){
            $member=Member::get_by_id($topuplog->member_id);
            $member->jifen+=$topuplog->amount;
            Member::updateProperties($topuplog->member_id,array("jifen"=>$member->jifen));
            Topuplog::updateProperties($topuplog_id,array("status"=>EnumTopuplogStatus::FINISH));//修改充值记录状态：完成
            LogPay::log_file("充值成功，充值标识:$topuplog_id充值成功");
            echo "OK";
            die();
        }
    }else{//支付
        $order=Order::get_one("order_no='$oid'");
        if(sprintf("%01.2f",$order->final_amount) == $fee){
            $amount = $order->final_amount;
            //修改订单状态：支付成功
            $order->pay_status=EnumPayStatus::SUCC;
            $order->update();
            LogPay::log_file("支付成功，订单号:$oid支付成功");
            //增加订单商品的购买数量
            $orderproducts=Orderproducts::get("order_id=".$order->order_id);
            foreach($orderproducts as $orderproduct){
                Product::increment("product_id=".$orderproduct->product_id,"sales_count",$orderproduct->nums);
            }
            //增加会员的等级积分、消费积分
            $member_id=$order->member_id;
            $member=Member::get_by_id($member_id);

            Member::updateProperties(//增加消费积分、等级积分
                $member_id,
                array(
                  "jifen"=>$member->jifen+$amount,
                ),
                // array(
                //     "jifenamount"=>$member->jifenamount+$amount,
                //     "rankjifen"=>$member->rankjifen+$amount
                // )
            );
            //积分日志
            $jifenlog=new Jifenlog();
            $jifenlog->member_id=$member_id;
            $jifenlog->jifenoriginal=$member->jifen;
            $jifenlog->jifenraise=$amount;
            $jifenlog->discribe="购买商品使用网银支付";
            $jifenlog->save();
            $rankjifenlog=new Rankjifenlog();
            $rankjifenlog->member_id=$member_id;
            $rankjifenlog->jifenoriginal=$member->jifen;
            $rankjifenlog->jifenraise=$amount;
            $rankjifenlog->discribe="购买商品使用网银支付";
            $rankjifenlog->save();
            echo "OK";
            die();
        }
    }
}
echo "Error";
?>
