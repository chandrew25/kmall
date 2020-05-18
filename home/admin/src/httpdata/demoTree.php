<?php 
require_once ("../../../../init.php");
$parent_id = intval($_REQUEST['id']);
//分类
$roots  = Demo::get(array("parent_id"=>$parent_id),"sort_order desc");
//分类计数
$rCount = count($roots);
if(!$roots)return null;
echo '[';
for($i=0;$i<$rCount;$i++){
    echo '{';
        ptypeJsonOut($roots[$i]);
    echo '}';
    if($i<$rCount-1)echo ',';
}
echo ']'; 
//分类Json输出
function ptypeJsonOut($ptype){
    echo '"ptype_name":"'.$ptype->ptype_name.'",';
    echo '"demo_id":"'.$ptype->demo_id.'",';
    echo '"ico":"'.$ptype->ico.'",';
    if($ptype->ico){
        echo '"icoShow":"<img width=16 height=16 style=margin:2px; src='.Gc::$upload_url."images/".$ptype->ico.'>",';
    }else{
        echo '"icoShow":"",';
    }
    echo '"isShow":'.$ptype->isShow.',';
    echo '"isShowText":'.($ptype->isShow?'"是"':'"否"').',';
    echo '"parent_id":'.$ptype->parent_id.',';
    echo '"countChild":'.$ptype->countChild.',';
    echo '"level":'.$ptype->level.',';
    echo '"sort_order":'.$ptype->sort_order.',';
    echo '"commitTime":'.$ptype->commitTime.',';
    echo '"updateTime":"'.$ptype->updateTime.'",';
    echo '"leaf":'.($ptype->countChild>0?0:1).',';
    echo '"iconCls":'.($ptype->countChild>0?'"task-folder"':'"task"').'';
}
?>