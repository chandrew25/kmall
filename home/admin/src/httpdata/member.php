<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$username   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
if (!empty($username)){
    $condition["username"]=" like '%$username%'"; 
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
$arr['totalCount']= Member::count($condition);
$arr['members']    = Member::queryPage($start,$limit,$condition);
echo json_encode($arr);
?>
