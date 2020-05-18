<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$department_name   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
$condition["isShow"]=1;
if (!empty($department_name)){
    $condition["department_name"]=" like '%$department_name%'";
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
$arr['totalCount']= Department::count($condition);
$arr['departments']    = Department::queryPage($start,$limit,$condition);
echo json_encode($arr);
?>