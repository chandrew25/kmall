<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$supplier_id   = ($_REQUEST['supplier_id']!=null)&&($_REQUEST['supplier_id']!="?")&&($_REQUEST['supplier_id']!="？") ? trim($_REQUEST['supplier_id']) : "";
$query_type   = ($_REQUEST['query_type']!=null)&&($_REQUEST['query_type']!="?")&&($_REQUEST['query_type']!="？") ? trim($_REQUEST['query_type']) : "";
$warehouse_name = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$condition=array();
if (!empty($warehouse_name)){
	$condition["warehouse_name"]=" like '%$warehouse_name%'"; 
}


if ($query_type!=null){
	//查询渠道商的仓库
	if ($query_type=="1"){
		function sp_prefix(&$item,$key,$prefix){
			$item=$prefix."'{$item->supplier_id}'";
		}		
		$supplier_ids=Supplier::select("supplier_id",array("stype"=>1));
		if (is_array($supplier_ids)){
			array_walk($supplier_ids,'sp_prefix',"supplier_id=");
			$condition[]=implode(" or ",$supplier_ids);
		}else{
			$condition["supplier_id"]="'".$supplier_ids."'";
		}
	}
}

if ($supplier_id!=null){
	$condition["supplier_id"]=$supplier_id.""; 
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
$arr['totalCount']= Warehouse::count($condition);
$arr['warehouses']    = Warehouse::queryPage($start,$limit,$condition);
foreach ($arr['warehouses'] as $warehouse) {
	$warehouse->supplier_id=$warehouse->supplier_id;
}   
echo json_encode($arr);
?>
