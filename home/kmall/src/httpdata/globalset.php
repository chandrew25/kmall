<?php
	require_once ("../../../../init.php");
	$data=ConfigStore::init();
	$arr=array("success"=>true,"data"=>$data);
	echo json_encode($arr);
?>