<?php
header("Content-type: text/html; charset=utf-8");
require_once ("../../../../init.php");
include "sdk/TopSdk.php";
//将下载SDK解压后top里的TopClient.php第8行$gatewayUrl的值改为沙箱地址:http://gw.api.tbsandbox.com/router/rest,
//正式环境时需要将该地址设置为:http://gw.api.taobao.com/router/rest

$appkey    ="21390794";
$secretKey ="2138a74f5a9b1b4f01ad3c61054b1295";
$sessionKey="6100a14a1da62a6e0d0ec817f36eed4d5a508fc3ec8212647113524";

$sessionKey=HttpSession::get("top_session");
if (!$sessionKey){
    HttpSession::set("call_taobao_api_url",Gc::$url_base."open/tb/more/syncOrders.php");
    header('Location:http://container.open.taobao.com/container?appkey='.$appkey);
}else{
	//实例化TopClient类
	$c = new TopClient;
	//正式环境Appkey设置
	//李志刚的帐号
	$c->appkey    = $appkey;
	$c->secretKey = $secretKey;

	//菲生活的帐号
	// $c->appkey = "21392352";
	// $c->secretKey = "e5bc1f768c838e8cf317bc047fa445a3";
	// $sessionKey="6101421fa1c5142ab1c6ba30066d7132bee21251db2ae411585824546";


	//沙箱环境Appkey设置
	// $c->gatewayUrl="http://gw.api.tbsandbox.com/router/rest";
	// $c->appkey = "1021390794";
	// $c->secretKey = "sandboxf5a9b1b4f01ad3c61054b1295";
	// $sessionKey="6102b120a535150c77111315d210188ccf090001e766ae02066555142";

	$req = new TradesSoldGetRequest;
	$req->setFields("seller_nick,buyer_nick,title,type,created,sid,tid,seller_rate,buyer_rate,status,payment,discount_fee,adjust_fee,post_fee,total_fee,pay_time,end_time,modified,consign_time,buyer_obtain_point_fee,point_fee,real_point_fee,received_payment,commission_fee,pic_path,num_iid,num_iid,num,price,cod_fee,cod_status,shipping_type,receiver_name,receiver_state,receiver_city,receiver_district,receiver_address,receiver_zip,receiver_mobile,receiver_phone,orders.title,orders.pic_path,orders.price,orders.num,orders.iid,orders.num_iid,orders.sku_id,orders.refund_status,orders.status,orders.oid,orders.total_fee,orders.payment,orders.discount_fee,orders.adjust_fee,orders.sku_properties_name,orders.item_meal_name,orders.buyer_rate,orders.seller_rate,orders.outer_iid,orders.outer_sku_id,orders.refund_id,orders.seller_type");
	$resp = $c->execute($req, $sessionKey);
	echo "result:";
	print_r($resp);
}

?>