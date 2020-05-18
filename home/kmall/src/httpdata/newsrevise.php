<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $request=$_GET;
    unset($request["classify_id"]);
    foreach($request["news"] as $key=>$value){
        Indexpage::updateProperties($key,array("title"=>$value["title"],"mouseover"=>$value["mouseover"],"link"=>$value["link"],"sort_order"=>$value["sort_order"]));
    }
    $newsshow = Indexpage::get("classify_id=".$_GET["classify_id"],"sort_order desc","1,9");
    echo json_encode($newsshow); 
?>