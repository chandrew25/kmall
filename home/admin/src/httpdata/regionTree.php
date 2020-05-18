<?php
require_once ("../../../../init.php");   
$node=$_REQUEST["id"];
if ($node){   
	$condition=array("parent_id"=>"$node");  
}else{
	$condition=array("region_type"=>EnumRegionType::COUNTRY);
}
$regions=Region::get($condition,"region_id asc");
echo "[";
if (!empty($regions)){
	$trees="";
	$maxLevel=Manager_Service::regionService()->maxlevelInRegion();
	foreach ($regions as $region){
		$trees.="{
			'text': '$region->region_name',
			'id': '$region->region_id',
			'level':'$region->region_type',";
		if ($region->region_type==$maxLevel){
			$trees.="'leaf':true,'cls': 'file'";
		}else{
			$trees.="'cls': 'folder'";  
			if ($region->region_type==EnumRegionType::REGION){
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
