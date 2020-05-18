<?php
require_once ("../../init.php");

$params = json_decode(file_get_contents('php://input'), true);
extract($params);
$code = 200;
$errorMsg = "";

$out_jifen = 0;
if (!empty($member_id)) {
    $member=Member::get_by_id($member_id);
    if ($member) {
      $jifenlog = new Jifenlog();
      $jifenlog->member_id = $member_id;
      $jifenlog->discribe = $intro;
      $jifenlog->jifenoriginal = $member->jifen;
      if ($action == 1) {
          $jifenlog->jifenraise = $jifen;
          $member->jifen += $jifen;
          $member->update();
          $out_jifen = $member->jifen;
      } else {
          if ($member->jifen >= $jifen) {
            $jifenlog->jifenreduce = $jifen;
            $member->jifen -= $jifen;
            $member->update();
            $out_jifen = $member->jifen;
          } else {
            $code = 201;
            $errorMsg = "券余额不足";
          }
      }
      $jifenlog->save();
    } else {
      $code = 300;
      $errorMsg = "该用户不存在";
    }
}

$result = array(
    "code" => $code,
    "errorMsg" => $errorMsg,
    "result" => array(
        "jifen" => $out_jifen
    ),
);


echo json_encode($result);
