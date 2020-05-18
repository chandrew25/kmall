<?php
	require_once ("../../../../init.php");
	header('Content-type: text/html; charset='.Gc::$encoding);
	$ptype_id=$_REQUEST['ptype_id'];
	//若ptype_id为空，则默认为3
	if(empty($ptype_id))$ptype_id=3;
	//得到分类的等级
	$ptype_level = Ptype::select_one( "level" , array("ptype_id"=>$ptype_id));
	if ( $ptype_level.level == 1 ){
		$recommen_clause['ptype1_id']=$ptype_id;//设置1级条件下的 推荐 条件
	}else if ( $ptype_level.level == 2 ){
        $ptype_key = array();
        $ptype_key[] = "-".Ptype::select_one( "parent_id" , array("ptype_id"=>$ptype_id) );
        $ptype_key[] = $ptype_id."-";
        $where_clause["ptype_key"] =  implode("-",$ptype_key);
	}else if ( $ptype_level.level == 3 ){
		$ptype_2_id = Ptype::select_one( "parent_id" , array("ptype_id"=>$ptype_id));
		$recommen_clause['ptype2_id']=$ptype_2_id; //设置3级条件下的推荐条件
	}
	$recommen_clause["isRecommend"]="1";
    $recommen_clause["isUp"]="1";
	$rec_products_no=$_REQUEST['rec_products_no'];
	$ar["rec_products_no"]=$rec_products_no+3;
	$ar["products"]=Product::get($recommen_clause, "sort_order desc",$ar["rec_products_no"].",3");
	//继续查询一次判断是否还有下一页
	$after_products=Product::get($recommen_clause, "sort_order desc",($ar["rec_products_no"]+3).",3");
	if(count($after_products)==0||$after_products[0]->product_id==$ar["products"][0]->product_id){
		$ar["rec_products_after"]="false";
	}else{
		$ar["rec_products_after"]="true";
	}
	echo json_encode($ar);
?>