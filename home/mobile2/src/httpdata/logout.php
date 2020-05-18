<?php
/**
 * for logout
 * @author FXF
 */
require_once ("../../../../init.php");
header('Content-type: text/html; charset='.Gc::$encoding);
HttpSession::init();
HttpSession::removeAll();
?>