<?php
//参考：http://www.juyimeng.com/2-ways-of-php-simulator-post-request.html
$post_data = array();
$post_data['submit'] = "submit";
$url='http://api.huitouke.cn/get_member';

$sbs_id="103288888888888";
$card_no="13917320293";
$password="";
$tm = time();
//http://api.huitouke.cn/get_member?sbs_id=103388888888888&card_no=13916138488&password=&t=1364127437&sign=403b26f8715b38b4558a600707515ef6
$sign=md5($sbs_id.$card_no.$password.$tm."69f92d81117dc6b7ef52981a96367297");
$post_url=$url."?sbs_id=$sbs_id&card_no=$card_no&password=$password&t=$tm&sign=$sign";
echo $post_url;
$ch = curl_init($post_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ;
curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ;
$result = curl_exec($ch);
echo "<br/>";
echo $result;

?>