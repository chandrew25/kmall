<?php
require_once ("../../../../init.php");
$node=$_REQUEST["id"];
if(!$node)$node=$_REQUEST["node"];
if ($node){
    $condition=array("parent_id"=>"$node");
}else{
    $condition=array("parent_id"=>'0');
}
$ptypes=Ptype::get($condition,"ptype_id asc");
echo "[";
if (!empty($ptypes)){
    $trees="";
    $maxLevel=Ptype::maxlevel();
    foreach ($ptypes as $ptype){
        $trees.="{
            'text': '$ptype->name',
            'id': '$ptype->ptype_id',
            'level':'$ptype->level',";
        if ($ptype->level==$maxLevel){
            $trees.="'leaf':true,'cls': 'file'";
        }else{
            $trees.="'cls': 'folder'";
            if (isset($ptype->countChild)){
                if ($ptype->sCountChild()==0){
                    $trees.=",'leaf':true";
                }
            }
        }
        $trees.="},";
    }
    $trees=substr($trees, 0, strlen($trees)-1);
    echo $trees;
}
echo "]";

?>
