<?php
/* *
 * 功能：支付宝服务器异步通知页面
 * 版本：3.3
 * 日期：2012-07-23
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 * 该代码仅供学习和研究支付宝接口使用，只是提供一个参考。


 *************************页面功能说明*************************
 * 创建该页面文件时，请留心该页面文件中无任何HTML代码及空格。
 * 该页面不能在本机电脑测试，请到服务器上做测试。请确保外部可以访问该页面。
 * 该页面调试工具请使用写文本函数logResult，该函数已被默认关闭，见alipay_notify_class.php中的函数verifyNotify
 * 如果没有收到该页面返回的 success 信息，支付宝会在24小时内按一定的时间策略重发通知
 */
require_once('../../../../init.php');
require_once("api/core/lib/alipay_notify.class.php");

//计算得出通知验证结果
$alipay_config=Payment_Ali::$alipay_config;
$alipayNotify = new AlipayNotify($alipay_config);
$verify_result = $alipayNotify->verifyNotify();
$v=$verify_result ? 'verify_result ok' : "verify_result fail";
LogPay::log_file("debug:".$v);
LogPay::log_file("debug:".print_r($_POST,true));
if($verify_result) {//验证成功
	//商户订单号
	$out_trade_no = $_POST['out_trade_no'];
	//支付宝交易号
	$trade_no = $_POST['trade_no'];
	//交易状态
	$trade_status = $_POST['trade_status'];
	if($trade_status == 'WAIT_BUYER_PAY') {
		//该判断表示买家已在支付宝交易管理中产生了交易记录，但没有付款
		//判断该笔订单是否在商户网站中已经做过处理
		//如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
		//如果有做过处理，不执行商户的业务程序
        echo "fail";
    }else if($trade_status == 'WAIT_SELLER_SEND_GOODS') {
		//该判断表示买家已在支付宝交易管理中产生了交易记录且付款成功，但卖家没有发货
		$order=Order::get_one("order_no='".$out_trade_no."'");
        if($order){
	        $order->pay_status=EnumPayStatus::SUCC;
	        $order->update();
	        LogPay::log_file("支付成功，订单号:".$out_trade_no."支付成功");
	    }
	    echo "success";
    }else if($trade_status == 'WAIT_BUYER_CONFIRM_GOODS') {
		//该判断表示卖家已经发了货，但买家还没有做确认收货的操作
		//判断该笔订单是否在商户网站中已经做过处理
		//如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
		//如果有做过处理，不执行商户的业务程序
        echo "fail";
    }else if($trade_status == 'TRADE_FINISHED') {
		//该判断表示买家已经确认收货，这笔交易完成
		//判断该笔订单是否在商户网站中已经做过处理
		//如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
		//如果有做过处理，不执行商户的业务程序
        echo "fail";
    }else {
		//其他状态判断
        echo "fail";
    }
}else {
    //验证失败
    echo "fail";
}
?>