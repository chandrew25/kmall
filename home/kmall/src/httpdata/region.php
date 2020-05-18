<?php    
require_once ("../../../../init.php");     
header('Content-type: text/html; charset='.Gc::$encoding);   
$type   = !empty($_REQUEST['type'])   ? intval($_REQUEST['type'])   : 0;
$parent = !empty($_REQUEST['parent']) ? intval($_REQUEST['parent']) : 0;
$arr['regions'] = Region::select(array('region_id','region_name'),array('region_type'=>"'$type'",'parent_id'=>$parent),"region_id asc");
$arr['type']    = $type;
$arr['target']  = !empty($_REQUEST['target']) ? stripslashes(trim($_REQUEST['target'])) : '';
$arr['target']  = htmlspecialchars($arr['target']);   
echo json_encode($arr);  
?>