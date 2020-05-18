<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$name   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
if (!empty($name)){
	$condition["name"]=" like '%$name%'"; 
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
$arr['totalCount']= Btype::count($condition);
$arr['btypes']    = Btype::queryPage($start,$limit,$condition);
foreach ($arr['btypes'] as $btypes) {
	$btypes->name=$btypes->name.levelShow($btypes->level);
}
echo json_encode($arr);    
function levelShow($level)
{
	$result="";
	switch ($level) {
	   case 1:
		 $result="第一层";
		 break;
	   case 2:
		 $result="第二层";
		 break;
	}
	$result="[$result]";
	return $result;    
}
?>
