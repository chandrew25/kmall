<?php
require_once ("../../../../init.php");
$node=$_REQUEST["node"];
$goodsType = Manager_ExtService::gtypeService()->goodsType($node); 
echo "[";
if (!empty($goodsType)){
	$trees="";
	$maxLevel=Manager_ExtService::gtypeService()->maxlevelInGoodsType();
	
	foreach ($goodsType as $type){
		$trees.="{
			'text': '$type->name',
			'id': '$type->gtype_id',
			'level':'$type->level',";
		if ($type->level==$maxLevel){
			$trees.="'leaf':true,'cls': 'file'";
		}else{
			$trees.="'cls': 'folder'";  
			if ($type->countChild==0){
				$trees.=",'leaf':true";  
			}
		}
		$trees.="},";    
	}
	$trees=substr($trees, 0, strlen($trees));
	echo $trees;
}
echo "]"; 
?>
