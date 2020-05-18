<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$order_no   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
if (!empty($order_no)){
    $condition["order_no"]=" like '%$order_no%'"; 
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
$arr['totalCount']= Order::count($condition);
$arr['orders']    = Order::queryPage($start,$limit,$condition);
echo json_encode($arr);
?>
