<?php 
require_once ("../../../../init.php"); 
$node=$_REQUEST["id"];
if ($node){
    $condition=array("parent_id"=>"$node");
}else{
    $condition=array("parent_id"=>'0');
}
$attributes=Attribute::get($condition,"attribute_id asc");
echo "[";
if (!empty($attributes)){
    $trees="";
    $maxLevel=Attribute::maxlevel();
    foreach ($attributes as $attribute){
        $trees.="{
            'text': '$attribute->attribute_name',
            'id': '$attribute->attribute_id',
            'level':'$attribute->level',";
        if ($attribute->level==$maxLevel){
            $trees.="'leaf':true,'cls': 'file'";
        }else{
            $trees.="'cls': 'folder'"; 
        }
        if (isset($attribute->countChild)){
            if ($attribute->countChild==0){
                $trees.=",'leaf':true"; 
            }
        }
        $trees.="},"; 
    }
    $trees=substr($trees, 0, strlen($trees)-1);
    echo $trees;
}
echo "]";
?>
