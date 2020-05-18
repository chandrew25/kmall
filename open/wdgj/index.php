<?php
require_once ("../../init.php");
$uCode="123456";
$mType="mOrderSearch";
$data=array_merge($_POST,$_GET);
$gUCode=$data["uCode"];
$gMType=$data["mType"];
if ($gUCode==$uCode){
	if ($gMType=="mTest") {
		$result= '<?xml version="1.0" encoding="gb2312"?>'."\r\n";
		$result.= "<rsp>\r\n";
		$result.="<result>1</result>";
		$result.="</rsp>\r\n";
		$result=str_replace("\r\n","",$result);
		echo $result;
	}else{
		require_once($gMType.".php");
	}
}
?>