<?php
/**
*
* example目录下为简单的支付样例，仅能用于搭建快速体验微信支付使用
* 样例的作用仅限于指导如何使用sdk，在安全上面仅做了简单处理， 复制使用样例代码时请慎重
* 请勿直接直接使用样例对外提供服务
* 
**/
require_once dirname(__FILE__).'/../../../../../init.php';
require_once dirname(dirname(__FILE__))."/lib/WxPay.Api.php";
require_once "wx.NativePay.php";
require_once 'logs.php';
$order_id = $_GET['order_id'];
//初始化日志
$logHandler= new CLogFileHandler(dirname(dirname(__FILE__))."/logs/".date('Y-m-d').'.log');
$log = Logs::Init($logHandler, 15);

$notify = new NativePay();
// $url1 = $notify->GetPrePayUrl("123456789");

//模式二
/**
 * 流程：
 * 1、调用统一下单，取得code_url，生成二维码
 * 2、用户扫描二维码，进行支付
 * 3、支付完成之后，微信服务器会通知支付成功
 * 4、在支付成功通知中需要查单确认是否真正支付成功（notify.php）
 */
$order=Order::get_by_id($order_id);
$url = "";
if ($order->getPayQrcode) {
	$time = time() - $order->getPayQrcode->commitTime;
	if ($time < 3600) {
		$url = $order->getPayQrcode->url;
	}
}
$goodstr = $body = "菲彼生活-";
$goods = array();
if ($order->getOrderGoods) {
	foreach ($order->getOrderGoods as $key => $value) {
		$goods[] = $value->goods_name;
	}
	$goodstr = implode("+",$goods);
}
if ($url=="") {
	
	$time = time();
	$input = new WxPayUnifiedOrder();
	$input->SetBody($body.$goodstr);
	$input->SetAttach($body);
	$out_trade_no = $order->order_no.date("YmdHis");
	$input->SetOut_trade_no($out_trade_no);
	$total_fee = $order->total_amount * 100;
	$input->SetTotal_fee($total_fee);
	$input->SetTime_start(date("YmdHis"));
	$input->SetTime_expire(date("YmdHis", $time + 600));
	// $input->SetGoods_tag($goodstr);
	$input->SetNotify_url("http://www.phoebelife.com/module/plugins/pay/wxpay/pagepay/payCallback.php");
	$input->SetTrade_type("NATIVE");
	$input->SetProduct_id($order->order_no);
	$result = $notify->GetPayUrl($input);
	$url = $result["code_url"];
	if (isset($order->getPayQrcode->orderqrcode_id) && $order->getPayQrcode->orderqrcode_id) {
		$qrcode = Orderqrcode::get_by_id($order->getPayQrcode->orderqrcode_id);
		$qrcode->out_trade_no = $out_trade_no;
		$qrcode->url = $url;
		$qrcode->commitTime = $time;
		$qrcode->updateTime = date("Y-m-d H:i:s");
		$qrcode->update();
	}else{
		$qrcode = new Orderqrcode();
		$qrcode->order_id = $order_id;
		$qrcode->out_trade_no = $out_trade_no;
		$qrcode->total_fee = $total_fee;
		$qrcode->url = $url;
		$qrcode->commitTime = $time;
		$qrcode->updateTime = date("Y-m-d H:i:s");
		$qrcode->save();
	}

}
?>

<html style="width:100%;">
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1" /> 
    <title>菲彼生活-微信支付</title>
</head>
<body style="width:100%;">
	<?php if($order->pay_status==1){?>
		<div style="width:1000px;height:200px;margin:0 auto;text-align:center;">
			<p>订单号：<?php echo $order->order_no;?> 已支付成功！</p>
			<p><a href="index.php?go=kmall.member.view">返回个人中心 >></a></p>
		</div>
	<?php }else{?>
		<div style="width:600px;height:600px;margin:0 auto;border: solid 1px #666;">
			<div  style="margin:0 auto;width:500px;height:50px;">
				<img src="">
			</div>
			<div style="margin:0 auto;width:500px;height:80px;">
				<p>订单号：<?php echo $order->order_no;?></p>
				<p>商品：<?php echo $goodstr;?></p>
			</div>
			<div style="margin:0 auto;width:500px;height:300px;text-align:center;">
				<h3>扫码付款</h3>
				<p style="color:#ff0000"><b>￥<?php echo $order->total_amount;?></b></p>
				<img alt="模式二扫码支付" src="module/plugins/pay/wxpay/pagepay/qrcode.php?data=<?php echo urlencode($url);?>" style="width:150px;height:150px;padding-bottom:64px;"/>
				<p><a href="index.php?go=kmall.member.view">已支付成功,返回个人中心 >></a></p>
			</div>
		</div>
	<?php }?>
</body>
</html>