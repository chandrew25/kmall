
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
require_once "wx.JsApiPay.php";
require_once "wx.config.php";
require_once 'logs.php';

$order_id = $_GET['order_id'];
$orders=Order::get_by_id($order_id);
$out_trade_no = $orders->order_no.date("YmdHis");
$total_fee = $orders->total_amount * 100;
if (isset($orders->getPayQrcode->orderqrcode_id) && $orders->getPayQrcode->orderqrcode_id) {
    $qrcode = Orderqrcode::get_by_id($orders->getPayQrcode->orderqrcode_id);
//    $qrcode->out_trade_no = $out_trade_no;
//    $qrcode->total_fee = $total_fee;
//    $qrcode->url = "";
//    $qrcode->commitTime = $time;
//    $qrcode->updateTime = date("Y-m-d H:i:s");
//    $qrcode->update();
    $out_trade_no = $qrcode->out_trade_no;
}else{
    $qrcode = new Orderqrcode();
    $qrcode->order_id = $order_id;
    $qrcode->out_trade_no = $out_trade_no;
    $qrcode->total_fee = $total_fee;
    $qrcode->url = "";
    $qrcode->commitTime = $time;
    $qrcode->updateTime = date("Y-m-d H:i:s");
    $qrcode->save();
}
//初始化日志
$logHandler= new CLogFileHandler(dirname(dirname(__FILE__))."/logs/".date('Y-m-d').'.log');
$log = Logs::Init($logHandler, 15);

//打印输出数组信息
function printf_info($data)
{
    foreach($data as $key=>$value){
        echo "<font color='#00ff55;'>$key</font> :  ".htmlspecialchars($value, ENT_QUOTES)." <br/>";
    }
}
$goodstr = $body = "菲彼生活-";
$goods = array();
if ($orders->getOrderGoods) {
    foreach ($orders->getOrderGoods as $key => $value) {
        $goods[] = $value->goods_name;
    }
    $goodstr = implode("+",$goods);
}
//①、获取用户openid
try{

    $tools = new JsApiPay();
    $openId = $tools->GetOpenid();

    //②、统一下单
    $input = new WxPayUnifiedOrder();
    $input->SetBody($body.$goodstr);
    $input->SetAttach($body);
    $input->SetOut_trade_no($out_trade_no);

    $input->SetTotal_fee($total_fee);
    $input->SetTime_start(date("YmdHis"));
    $input->SetTime_expire(date("YmdHis", time() + 600));
    $input->SetGoods_tag($goodstr);
    $input->SetNotify_url("http://www.phoebelife.com/module/plugins/pay/wxpay/pagepay/payCallback.php");
    $input->SetTrade_type("JSAPI");
    $input->SetOpenid($openId);
    $config = new WxPayConfig();
    $order = WxPayApi::unifiedOrder($config, $input);
    $jsApiParameters = $tools->GetJsApiParameters($order);

    //获取共享收货地址js函数参数
    $editAddress = $tools->GetEditAddressParameters();
} catch(Exception $e) {
    Logs::ERROR(json_encode($e));
}
//③、在支持成功回调通知中处理成功之后的事宜，见 notify.php
/**
 * 注意：
 * 1、当你的回调地址不可访问的时候，回调通知会失败，可以通过查询订单来确认支付是否成功
 * 2、jsapi支付时需要填入用户openid，WxPay.JsApiPay.php中有获取openid流程 （文档可以参考微信公众平台“网页授权接口”，
 * 参考http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html）
 */
?>

<html>
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>菲彼生活-微信支付</title>
    <script type="text/javascript">
        //调用微信JS api 支付
        function jsApiCall()
        {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                <?php echo $jsApiParameters;?>,
                function(res){
                    WeixinJSBridge.log(res.err_msg);
                    // alert(res.err_code+res.err_desc+res.err_msg);
                    if(res.err_msg == "get_brand_wcpay_request:ok"){
                        window.location.href="http://www.phoebelife.com/index.php?go=mobile.order.info&id=<?php echo $order_id;?>";
                    }else{
                        //返回跳转到订单详情页面
                        alert(支付失败);
                    }
                }
            );
        }

        function callpay()
        {
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                    document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                }
            }else{
                jsApiCall();
            }
        }
    </script>
    <script type="text/javascript">
        //获取共享地址
        function editAddress()
        {
            WeixinJSBridge.invoke(
                'editAddress',
                <?php echo $editAddress;?>,
                function(res){
                    var value1 = res.proviceFirstStageName;
                    var value2 = res.addressCitySecondStageName;
                    var value3 = res.addressCountiesThirdStageName;
                    var value4 = res.addressDetailInfo;
                    var tel = res.telNumber;
                    // alert(value1 + value2 + value3 + value4 + ":" + tel);
                }
            );
        }

        window.onload = function(){
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', editAddress, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', editAddress);
                    document.attachEvent('onWeixinJSBridgeReady', editAddress);
                }
            }else{
                editAddress();
            }
        };

    </script>
</head>
<body>
<br/>
<font color="#9ACD32">
    <b>该笔订单支付金额为
        <span style="color:#f00;font-size:50px"><?php echo round($orders->total_amount,2);?>元</span>
    </b>
</font>
<br/>
<br/>
<div align="center">
    <button style="width:210px; height:50px; border-radius: 15px;background-color:#FE6714; border:0px #FE6714 solid; cursor: pointer;  color:white;  font-size:16px;" type="button" onclick="callpay()" >立即支付</button>
</div>
</body>
</html>