<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $request=$_GET;
    foreach($request as $key=>$value){
        Indexpage::updateProperties(substr($key,10),"sort_order=".$value);
    }
    $sortshow = Indexpage::get("classify_id=".$request["classify_id"],"sort_order desc");
    echo json_encode($sortshow); 
?>