<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$app_name   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
if (!empty($app_name)){
    $condition["app_name"]=" like '%$app_name%'"; 
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
$arr['totalCount']= App::count($condition);
$arr['apps']    = App::queryPage($start,$limit,$condition);
echo json_encode($arr);
?>
