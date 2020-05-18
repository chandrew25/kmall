<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$username   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$roletype   = !empty($_REQUEST['roletypeSel'])&&($_REQUEST['roletypeSel']!="?")&&($_REQUEST['roletypeSel']!="？") ? trim($_REQUEST['roletypeSel']) : "";
$condition=array();
if (!empty($username)){
	$condition["username"]=" like '%$username%'"; 
}
if (!empty($roletype)){
	$condition["roletype"]=$roletype; 
}
$start=0;
if (isset($_REQUEST['start'])){
	$start=$_REQUEST['start']+1;
}
$limit=$pageSize;
if (isset($_REQUEST['limit'])){
	$limit=$_REQUEST['limit']; 
	$limit= $start+$limit-1;
}
$arr['totalCount']= Admin::count($condition);
$arr['admins']    = Admin::queryPage($start,$limit,$condition);
echo json_encode($arr);
?>
