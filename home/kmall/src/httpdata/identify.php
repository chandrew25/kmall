<?php
    require_once ("../../../../init.php");
    $phonenumber=trim($_POST["phonenumber"]);
    if(strlen($phonenumber)==11&&is_numeric($_POST["phonenumber"])){
        //判断是否已经获取验证码
        $existnumber=HttpSession::get(Gc::$appName."_phone_number");
        if($existnumber==$phonenumber){
            $identify_code=HttpSession::get(Gc::$appName."_identify_code");
            $identify_code_return=HttpSession::get(Gc::$appName."_identify_code_return");
            if($identify_code==$identify_code_return){
                $result->phonenumber=$existnumber;
                $result->identify=$identify_code;
                $result->msg="短信已发送,请稍候并注意查收,谢谢!";
            }else{
                $result->msg="短信已发送,请稍候并注意查收,谢谢!";
            }
            echo json_encode($result);
            return;
        }
        $iforder = Order::count("ship_mobile=".$phonenumber);
        if($iforder){
            $code=UtilString::build_count_rand(1,6);
            HttpSession::set(Gc::$appName."_identify_code",$code[0]);
            HttpSession::set(Gc::$appName."_phone_number",$phonenumber);
            $content.="您好,您的订单查询验证码为 ".$code[0].",";
            $content.="客服热线400-700-8108，祝您购物愉快！[菲彼生活官方商城]";
            UtilSMS::send($phonenumber,$content);
            //清除缓冲区
            ob_clean();
            $result->msg="操作成功,请尽快查收您的短信！";
        }else{
            $result->msg="对不起,该手机号码没有下过订单!";
        }
    }else{
        $result->msg="获取验证码失败,请重新输入您的手机号码!";
    }
    echo json_encode($result);
?>
