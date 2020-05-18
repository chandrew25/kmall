<?php
//根据编号查询货品
require_once ("../../../../init.php"); 
$pageSize=15;
$goods_code   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
if (!empty($goods_code)){
	$condition["goods_code"]=" like '%$goods_code%'"; 
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
$arr['totalCount']= Goods::count($condition);
$arr['goods']    = Goods::queryPage($start,$limit,$condition);
echo json_encode($arr);
?>
