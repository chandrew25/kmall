<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $request=$_GET;
    $addlink = new Indexpage($request);
    $addlink->title = "自定义";
    $addlink->link = "自定义";
    $addlink->sort_order = 0;
    $addlink->save();
    echo json_encode($addlink); 
?>