<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $request=$_GET;
    foreach($request as $key=>$value){
        Indexpage::updateProperties(substr($key,10),"sort_order=".$value);
    }
    $sortshow = Indexpage::get("classify_id=".$request["classify_id"],"sort_order desc");
    foreach($sortshow as $key=>$value){
        //左侧展示图片
        $value->showimg = Indexpage::get_one(array("parent_id=".$value->indexpage_id,"classify_id=6"));
        //顶部链接
        $value->children = Indexpage::get(array("classify_id=7","isShow=1","parent_id=".$value->indexpage_id),"sort_order desc");
        //展示商品
        $value->kids= Indexpage::get(array("classify_id=8","isShow=1","parent_id=".$value->indexpage_id),"sort_order desc","1,3");
    }
    echo json_encode($sortshow); 
?>