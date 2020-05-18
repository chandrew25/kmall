<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $verify=md5($_REQUEST['verify']);
    HttpSession::init();
    $validate=HttpSession::get("validate");
    if($verify==$validate){
        echo "1";
    }
    else{
        echo "";
    }
?>
