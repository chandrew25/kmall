<?php
require_once ("../../init.php");

$member_id = $_GET["id"];
$username = "";
$jifen = 0;
if ( !empty($member_id) ) {
    $member=Member::get_by_id($member_id);
    if ($member) {
      $jifen = $member->jifen;
      $username = $member->username;
    } else {
      $code = 300;
      $errorMsg = "该用户不存在";
    }
}

$result = array(
    "code" => 200,
    "errorMsg" => "",
    "result" => array(
        "jifen" => $jifen,
        "username" => $username
    ),
);


echo json_encode($result);
