<?php
	require_once ("../../../../init.php");
	header('Content-type: text/html; charset='.Gc::$encoding);
	$btype_id=$_REQUEST['btype_id'];
	if(empty($btype_id))$btype_id=1;
	$btype_cate_id=$_REQUEST['btype_cate_id'];
	if(empty($btype_cate_id))$btype_cate_id=0;
	$rec_products_no=$_REQUEST['rec_products_no'];
	$filter["isRecommend"]="1";
	if($btype_cate_id==0){
		$filter["btype_parentid"]=$btype_id;
	}else{
		$filter["btype_id"] = $btype_cate_id;
	}
	$ar["rec_products_no"]=$rec_products_no+3;
	$ar["products"]=Pbtype::get($filter,"sort_order desc",$ar["rec_products_no"].",3");
	//继续查询一次判断是否还有下一页
	$after_products=Pbtype::get($filter,"sort_order desc",($ar["rec_products_no"]+3).",3");
	if(count($after_products)==0||$after_products[0]->pbtype_id==$ar["products"][0]->pbtype_id){
		$ar["rec_products_after"]="false";
	}else{
		$ar["rec_products_after"]="true";
	}
	echo json_encode($ar);
?>