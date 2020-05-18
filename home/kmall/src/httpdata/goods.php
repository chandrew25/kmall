<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$gname   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$gname2   = !empty($_REQUEST['gname'])&&($_REQUEST['gname']!="?")&&($_REQUEST['gname']!="？") ? trim($_REQUEST['gname']) : "";
$supplier_id=!empty($_REQUEST['supplier_id'])&&($_REQUEST['supplier_id']!="?")&&($_REQUEST['supplier_id']!="？") ? trim($_REQUEST['supplier_id']) : "";
$goods_no=!empty($_REQUEST['goods_no'])&&($_REQUEST['goods_no']!="?")&&($_REQUEST['goods_no']!="？") ? trim($_REQUEST['goods_no']) : "";
$sptype=!empty($_REQUEST['sptype'])&&($_REQUEST['sptype']!="?")&&($_REQUEST['sptype']!="？") ? trim($_REQUEST['sptype']) : "";

$condition=array();
if (!empty($gname)){
	$condition["gname"]=" like '%$gname%'"; 
}      
if (!empty($gname2)){
    $condition["gname"]=" like '%$gname2%'"; 
}
if (!empty($supplier_id)){
	$condition["supplier_id"]=$supplier_id; 
}
//当身份为渠道商的时候
if (!empty($sptype)){
    unset($condition["supplier_id"]);
    $filter_sptype = " and (sptype = '0' or supplier_id = '".$supplier_id."') "; 
}
if (!empty($goods_no)){
    $condition["goods_no"]=" like '%$goods_no%' "; 
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

if(!empty($sptype)){
    $condition_arr = $condition;
    $condition = " 3=3 ";
    foreach ($condition_arr as $key=>$value) {
        if($value){
            if(contain($value,'like')){
                $condition .= " and ".$key.$value;
            }else{
                $condition .= " and ".$key." = ".$value;
            }    
        }  
    }
    $condition .= $filter_sptype;       
}

$arr['totalCount']= Goods::count($condition);
$arr['goodss']    = Goods::queryPage($start,$limit,$condition);
foreach ($arr['goodss'] as $goods) {
	$sp=Supplier::get_by_id($goods->sp_id);
	$goods->sp_name=$sp->sp_name;
}
echo json_encode($arr);
?>
