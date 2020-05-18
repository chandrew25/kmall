<?php
require_once ("../../../../init.php");
$session=$_GET["top_session"];
HttpSession::set("top_session",$session);
$call_taobao_api_url=HttpSession::get("call_taobao_api_url");
if ($call_taobao_api_url){
	header("Location:".$call_taobao_api_url);
}else{
	header("Location:".Gc::$url_base);
}
?>
