<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$parent_id   = ($_REQUEST['parent_id']!=null)&&($_REQUEST['parent_id']!="?")&&($_REQUEST['parent_id']!="？") ? trim($_REQUEST['parent_id']) : "";
$region_type   = ($_REQUEST['region_type']!=null)&&($_REQUEST['region_type']!="?")&&($_REQUEST['region_type']!="？") ? trim($_REQUEST['region_type']) : "";
$region_name   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
if ($parent_id!=null){
	$condition["parent_id"]=$parent_id.""; 
}
if ($region_type!=null){
	$condition["region_type"]=$region_type.""; 
}
if (!empty($region_name)){
	$condition["region_name"]=" like '%$region_name%'"; 
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
$arr['totalCount']= Region::count($condition);
$arr['regions']    = Region::queryPage($start,$limit,$condition);
echo json_encode($arr);
?>
