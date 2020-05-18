<?php
require_once ("../../../../init.php");
$smsPwd = $_GET["smsPwd"];
$username = $_GET["username"];
if ( !empty($smsPwd) && $smsPwd == HttpSession::get("smsPwd") ) {
    echo "1";
} else {
    echo "0";
}
