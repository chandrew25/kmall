<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $indexpage_id=$_REQUEST["indexpage_id"];
    if($indexpage_id){
        Indexpage::deleteByID($indexpage_id);
        echo "1"; 
    }else{
        echo "";
    }
?>