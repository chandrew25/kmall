<?php
header("Content-type: text/html; charset=utf-8");
include "sdk/TopSdk.php";
//将下载SDK解压后top里的TopClient.php第8行$gatewayUrl的值改为沙箱地址:http://gw.api.tbsandbox.com/router/rest,
//正式环境时需要将该地址设置为:http://gw.api.taobao.com/router/rest

//实例化TopClient类
$c = new TopClient;
//正式环境Appkey设置
//$c->appkey = "21390794";
//$c->secretKey = "2138a74f5a9b1b4f01ad3c61054b1295";
//沙箱环境Appkey设置
$c->gatewayUrl="http://gw.api.tbsandbox.com/router/rest";
$c->appkey = "1021390794";
$c->secretKey = "sandboxf5a9b1b4f01ad3c61054b1295";

//实例化具体API对应的Request类
$req = new UserGetRequest;
//$req->setFields("nick,sex,uid,created");
$req->setFields("user_id,uid,nick,sex,buyer_credit,seller_credit,location,created,last_visit,birthday,type,status,alipay_no,alipay_account,alipay_account,email,consumer_protection,alipay_bind");
$req->setNick("sandbox_seller_0");

//执行API请求并打印结果
$resp = $c->execute($req);
echo "result:";
print_r($resp);
echo "<br>";
echo "nick:".$req->getNick();


?>