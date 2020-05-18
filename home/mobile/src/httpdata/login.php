<?php
/**
 * for login
 * @author FXF
 */
require_once ("../../../../init.php");
header('Content-type: text/html; charset='.Gc::$encoding);
$username=htmlspecialchars(trim($_POST['username']));
$password=md5(htmlspecialchars(trim($_POST['password'])));
$member=Member::get_one(array("username='$username'","password='$password'"));
if($member){
	HttpSession::init();
	HttpSession::set("member_id", $member->member_id);
	HttpSession::set("username", $member->username);
	$msg->username=$member->username;
	$msg->error=false;
}else{
	$msg->error=true;
}
echo json_encode($msg);
?>