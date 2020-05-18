<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    // $numbers="13917320293";
    $numbers   = $_GET["mobile"];
    $smsPwdKey = "smsPwd";
    HttpSession::init();
    $smsPwd  = UtilString::rand_string(4, 1);
    HttpSession::set($smsPwdKey, $smsPwd);//存入Session
    $content = "【菲彼生活】尊敬的用户: 您的验证码:" . $smsPwd ."，工作人员不会索取，请勿泄漏。";
    $isSendSucc = UtilSMS::send($numbers,$content);
    echo $isSendSucc;
    // echo $numbers;
    // echo $smsPwd;
?>
