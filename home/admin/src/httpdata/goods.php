<?php
//货品信息查询 
require_once ("../../../../init.php"); 
$pageSize=15;
$goods_name  = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$goods_code  = $_REQUEST["goods_code"];
$ptype1_id   = !empty($_REQUEST['ptype1_id'])&&($_REQUEST['ptype1_id']!="?")&&($_REQUEST['ptype1_id']!="？") ? trim($_REQUEST['ptype1_id']) : "";
$supplier_id = !empty($_REQUEST['supplier_id'])&&($_REQUEST['supplier_id']!="?")&&($_REQUEST['supplier_id']!="？") ? trim($_REQUEST['supplier_id']) : "";
$condition=array();
if (!empty($goods_name)){
    $condition["goods_name"]=" like '%$goods_name%'"; 
}
if (!empty($goods_code)){
    $condition["goods_code"]=" like '%$goods_code%'"; 
}
if (!empty($ptype1_id)){
    $condition["ptype1_id"]=$ptype1_id;
}
if (!empty($supplier_id)){
    $condition["supplier_id"]=$supplier_id; 
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

foreach ($arr['goods'] as $eachgoods) {
    //货品归属商品
    $warehousegoods=Warehousegoods::get_one("goods_id=".$goods["goods_id"]); 
    $sp=Supplier::get_by_id($warehousegoods->supplier_id);
    $eachgoods->sp_name=$sp->sp_name;
    //供应商标志
    $eachgoods->supplier_id=$warehousegoods->supplier_id;
    //仓库标志
    $eachgoods->warehouse_id=$warehousegoods->warehouse_id;
}
echo json_encode($arr);
?>
