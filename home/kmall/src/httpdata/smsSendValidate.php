<?php
require_once ("../../../../init.php");
$smsPwd = $_GET["smsPwd"];
if ( !empty($smsPwd) && $smsPwd == HttpSession::get('smsPwd') ) {
    echo "1";
} else {
    echo "0";
}
