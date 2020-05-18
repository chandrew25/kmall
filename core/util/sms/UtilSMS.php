<?php
// require_once("nusoap.php");
/**
 +---------------------------------<br/>
 * 工具类：发送短信<br/>
 +---------------------------------
 * @category core
 * @package util.sms
 * @author skygreen2001
 */
class UtilSMS
{
    /**
     * 短信服务器地址
     */
    private static $sms_server_url = "http://210.14.64.74:81/SmsService/UnicomWdslRec.asmx?wsdl";
    /**
     * 传递给短信服务器的身份认证参数
     */
    private static $configParam=array(
        "Sd_UserName" => "201608111421",
        "Sd_UserPsd"  => "123456",
        "Sd_ExNumber" => "888",
        "Sd_SeqNum"   => ""
    );

    /**
     * 发送短信
     * @param $numbers 手机号码（多个手机号码之间用,分割）
     * @param $content 内容
     * @return 成功1，失败0
     */
    public static function send($numbers, $content)
    {
        Module_Loader::load_nusoap();
        $content = iconv("utf-8","gbk",$content);//字符转码
        $sms     = new nusoap_client(self::$sms_server_url,true);
        // echo var_dump($sms);
        // echo "<br>";
        $sms->soap_defencoding = "gbk";
        $sms->decode_utf8      = false;
        $contentParam          = array(
            "Sd_Phones"     => $numbers,
            "Sd_MsgContent" => $content,
            "Sd_SchTime"    => ""
        );
        $configParam = array_merge(self::$configParam,$contentParam);
        $aryResult   = $sms->call("SendMessage",array("parameters"=>$configParam));
        $err         = $sms->getError();
        if ( $aryResult["SendMessageResult"] == "0,send success!" ) {
            return "1";
        } else {
            return "0";
        }
    }
}
?>
