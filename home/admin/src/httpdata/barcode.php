<?php
require_once ("../../../../init.php");
$order_no   = !empty($_REQUEST['order_no'])&&($_REQUEST['order_no']!="?")&&($_REQUEST['order_no']!="？") ? trim($_REQUEST['order_no']) : "";
$codetype   = !empty($_REQUEST['codetype'])&&($_REQUEST['codetype']!="?")&&($_REQUEST['codetype']!="？") ? trim($_REQUEST['codetype']) : "";
if (method_exists("UtilBarCode",$codetype)){
	call_user_func('UtilBarCode::'.$codetype,$order_no);
}
//UtilBarCode::Code128()
?>
