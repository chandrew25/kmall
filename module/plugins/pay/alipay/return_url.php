<!DOCTYPE HTML>
<html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<?php
/* *
 * 功能：支付宝页面跳转同步通知页面
 * 版本：2.0
 * 修改日期：2017-05-01
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。

 *************************页面功能说明*************************
 * 该页面可在本机电脑测试
 * 可放入HTML等美化页面的代码、商户业务逻辑程序代码
 */
require_once('../../../../init.php');
require_once("config.php");
require_once 'pagepay/service/AlipayTradeService.php';


$arr=$_GET;
$alipaySevice = new AlipayTradeService($config);
$result = $alipaySevice->check($arr);

/* 实际验证过程建议商户添加以下校验。
1、商户需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号，
2、判断total_amount是否确实为该订单的实际金额（即商户订单创建时的金额），
3、校验通知中的seller_id（或者seller_email) 是否为out_trade_no这笔单据的对应的操作方（有的时候，一个商户可能有多个seller_id/seller_email）
4、验证app_id是否为该商户本身。
*/
if ($result) {//验证成功
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //请在这里加上商户的业务逻辑程序代码

    //——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
    //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表

    //商户订单号
    $out_trade_no = htmlspecialchars($_GET['out_trade_no']);

    //支付宝交易号
    $trade_no = htmlspecialchars($_GET['trade_no']);

    LogPay::log_file("验证成功;\r\n支付宝交易号：" . $trade_no . ",商户订单号:" . $out_trade_no);
    $order=Order::get_one("order_no='$out_trade_no'");

    if ( $order ) {
        $order->trade_no   = $trade_no;
        $order->pay_status = EnumPayStatus::SUCC;
        $order->update();
        //增加会员的等级积分、消费积分
        $member_id=$order->member_id;
        $member=Member::get_by_id($member_id);
        $jifen = $member->jifen - $order->jifen;
        if ($jifen<0) $jifen = 0;
        Member::updateProperties(//增加消费积分、等级积分
          $member_id,
          array(
            "jifen" => $member->jifen - $order->jifen,
          )
        );

        //积分日志
        $jifenlog=new Jifenlog();
        $jifenlog->member_id=$member_id;
        $jifenlog->jifenoriginal=$member->jifen;
        $jifenlog->jifenreduce=$order->jifen;
        $jifenlog->discribe="购买商品使用支付宝支付";
        $jifenlog->save();
        $rankjifenlog=new Rankjifenlog();
        $rankjifenlog->member_id=$member_id;
        $rankjifenlog->jifenoriginal=$member->jifen;
        $rankjifenlog->jifenreduce=$order->jifen;
        $rankjifenlog->discribe="购买商品使用支付宝支付";
        $rankjifenlog->save();
    }

    header("location:".Gc::$url_base."index.php?go=kmall.member.order_detail&order_id=$order->order_id&type=".EnumViewInfoType::CHECKOUTOVER);
    // header("location:".Gc::$url_base."index.php?go=kmall.info.view&order_id=".$order->order_id."&type=".EnumViewInfoType::PAYOVER);
    //——请根据您的业务逻辑来编写程序（以上代码仅作参考）——

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
else {
    //验证失败
    // echo "验证失败";
    LogPay::log_file("验证失败;\r\n 回传数据: " . print_pre($arr) . "\r\n" . $result);
    header("location:".Gc::$url_base."index.php?go=kmall.info.view");
}
?>
        <title>支付宝电脑网站支付return_url</title>
    </head>
    <body>
    </body>
</html>
