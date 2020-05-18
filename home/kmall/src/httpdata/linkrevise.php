<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $request=$_GET;
    unset($request["parent_id"],$request["classify_id"]);
    foreach($request["clink"] as $key=>$value){
        Indexpage::updateProperties($key,array("title"=>$value["title"],"link"=>$value["link"],"sort_order"=>$value["sort_order"]));
    }
    $linkshow = Indexpage::get(array("classify_id=".$_GET["classify_id"],"parent_id=".$_GET["parent_id"]),"sort_order desc");
    echo json_encode($linkshow); 
?>