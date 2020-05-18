<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $username   = $_GET["username"];
    $memberdata = Member::get_one(array("username"=>$username));
    echo $memberdata->mobile;
    // echo $numbers;
    // echo $smsPwd;
?>
