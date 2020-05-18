<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$product_name   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$supplier_id=!empty($_REQUEST['supplier_id'])&&($_REQUEST['supplier_id']!="?")&&($_REQUEST['supplier_id']!="？") ? trim($_REQUEST['supplier_id']) : "";
$product_code=!empty($_REQUEST['product_code'])&&($_REQUEST['product_code']!="?")&&($_REQUEST['product_code']!="？") ? trim($_REQUEST['product_code']) : "";
$condition=array();
if (!empty($supplier_id)){
	$condition["supplier_id"]=$supplier_id; 
}
if (!empty($product_name)){
    $condition["product_name"]=$product_name; 
}

$filter_con = "";
if (!empty($product_code)){
    $goodss = Product::get("product_code like '%$product_code%'");
    if($goodss){
        $filter_con1 = " and ( ";
        $filter_con = "";
        foreach ($goodss as $goods) {
            $filter_con .= " or product_id = '".$goods->product_id."' "; 
        }
        $filter_con = substr($filter_con,3);
        $filter_con = $filter_con1.$filter_con." ) group by product_id ";    
    }
}

$condition_arr = $condition;
$condition = " 1=1 ";
foreach ($condition_arr as $key => $value) {
    $condition .= "and ".$key." = '".$value."'";
}
$condition .=  $filter_con;  

$start=0;
if (isset($_REQUEST['start'])){
	$start=$_REQUEST['start']+1;
}
$limit=$pageSize;
if (isset($_REQUEST['limit'])){
	$limit=$_REQUEST['limit']; 
	$limit= $start+$limit-1;
}


//执行SQL
$arr['totalCount'] = Manager_Db::newInstance()->dao()->sqlExecute(
"select count(tb.product_id) from (select product_id
 from ".Warehouseproduct::tablename()."
where ".$condition." ) as tb ");
//$arr['totalCount'] = Warehousegoods::count($condition);               
$arr['warehouseproducts'] = Warehouseproduct::queryPage($start,$limit,$condition); 

foreach ($arr['warehouseproducts'] as $warehouseproduct) {
	$product=Product::get_by_id($warehouseproduct->product_id);
    if (!empty($product)){
	    $warehouseproduct->product_name=$product->product_name;
	    $warehouseproduct->product_code=$product->product_code;
	    $warehouseproduct->in_price=$product->in_price;
    }
}
$arr['products']=$arr['warehouseproducts'];
echo json_encode($arr);
?>
