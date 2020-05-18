<?php
//查看卡交易流水
//参考：http://www.juyimeng.com/2-ways-of-php-simulator-post-request.html
$post_data = array();
$post_data['submit'] = "submit";
$url='http://api.huitouke.cn/view_invoice';

$sbs_id="103288888888888";
$card_no="";//"1086103200010020";
$type=1;//交易类型；0:充值流水，1:消费流水；默认是0
$sdate="2013-03-01";
$edate="2013-03-26";
$page=1;

$tm = time();
$sign=md5($sbs_id.$card_no.$type.$sdate.$edate.$page.$tm."69f92d81117dc6b7ef52981a96367297");//"69f92d81117dc6b7ef52981a96367297");
$post_url=$url."?sbs_id=$sbs_id&card_no=$card_no&type=$type&sdate=$sdate&edate=$edate&page=$page&t=$tm&sign=$sign";
echo $post_url;
$ch = curl_init($post_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ;
curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ;
$result = curl_exec($ch);
echo $result;
?>