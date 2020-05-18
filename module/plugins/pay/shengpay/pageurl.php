<?php
require_once('../../../../init.php');

LogPay::log_file("浏览器回调地址:\r\n".print_pre($_POST));
/**
 * 浏览器回调地址
 */
if(Payment_Sheng::current()->returnSign()){
	$oid=$_POST['OrderNo'];
	$fee=$_POST['TransAmount'];
	//商家自行检测商家订单状态，避免重复处理，而且请检查fee的值与订单需支付金额是否相同
	if(($pos=strpos($oid,"topuplog"))!==false){//充值
		$topuplog_id=substr($oid,$pos+8);//充值记录标识
		$topuplog=Topuplog::get_by_id($topuplog_id);//充值记录
		if(sprintf("%01.2f",$topuplog->amount) == $fee){
			header("location:".Gc::$url_base."index.php?go=kmall.info.view&type=".EnumViewInfoType::TOPUPOK."&topuplog_id=$topuplog_id");
			die();
		}
	}else{//支付
		$order=Order::get_one("order_no='$oid'");
		if(sprintf("%01.2f",$order->final_amount) == $fee){
			header("location:".Gc::$url_base."index.php?go=kmall.info.view&type=".EnumViewInfoType::PAYOVER."&order_id=".$order->order_id);
			die();
		}
	}
}
header("location:".Gc::$url_base."index.php?go=kmall.info.view");
?>