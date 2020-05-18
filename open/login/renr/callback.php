<?php
    require_once ("../../../init.php");

    $code = $_REQUEST["code"];
    //返回登录的地址  在core/model/action/Action.php beforeAction()设置session
    $back_url = HttpSession::get("backurl");

    if($_REQUEST['state'] == $_SESSION['state'])
    {
        OpenLoginRenren::new_instance()->callBack($code);
        //跳转回登录页面
        header('Location:'.$back_url);
    }else {
        echo("The state does not match. You may be a victim of CSRF.");
    }
?>
