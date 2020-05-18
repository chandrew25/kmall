<?php
require_once ("../../init.php");

$params = json_decode(file_get_contents('php://input'), true);
extract($params);
// LogMe::log($params);
// LogMe::log("mobile::::::".$mobile);
$isSave = true;
if ( !empty($mobile) ) {
  $hadMember = Member::get_one("mobile='" . $mobile . "'");
  if ( $hadMember != null ) {
    $isSave = false;
  }
}

if ( $isSave ) {
  $member = new Member();
  $member->username = $mobile;
  $member->mobile = $mobile;
  $member->openid = $openid;
  $member->password = $password;

  $member->isActive = true;
  if (isset($level_one_id)&&!empty($level_one_id)) {
    $member->level_one = $level_one_id;
  }
  if (isset($level_two_id)&&!empty($level_two_id)) {
    $member->level_two = $level_two_id;
  }
  $member_id = $member->save();
} else {
  $hadMember->mobile = $mobile;
  $hadMember->openid = $openid;
  $hadMember->password = $password;
  $member->isActive = true;
  if (isset($level_one_id)&&!empty($level_one_id)) {
    $hadMember->level_one = $level_one_id;
  }
  if (isset($level_two_id)&&!empty($level_two_id)) {
    $hadMember->level_two_id = $level_two_id;
  }
  $hadMember->update();
  $member_id = $hadMember->member_id;
}

$result = array(
    "code" => 200,
    "errorMsg" => "",
    "result" => array(
        "member_id" => $member_id
    ),
);

echo json_encode($result);
