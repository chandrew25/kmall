<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$delivery_no   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
if (!empty($delivery_no)){
    $condition["delivery_no"]=" like '%$delivery_no%'"; 
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
$arr['totalCount']= Delivery::count($condition);
$arr['deliverys']    = Delivery::queryPage($start,$limit,$condition);
echo json_encode($arr);
?>
