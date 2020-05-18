<?php
/**
 +---------------------------------------<br/>
 * 控制器:QQ登录<br/>
 +---------------------------------------
 * @category kmall
 * @package open.api.login
 * @author 924197212@qq.com
 */
class OpenLoginQQ extends OpenLogin
{
    /**
     * 登录logintype_id
     */
    const ID='1';
    /**
     * 获取授权接口地址
     */
    const LOGINURL='https://graph.qq.com/oauth2.0/authorize';
    /**
     * 获取ACCESS TOKEN接口地址
     */
    const LOGINTOKEN='https://graph.qq.com/oauth2.0/token';
    /**
     * 获取OPEN_ID接口地址
     */
    const LOGINOPENID='https://graph.qq.com/oauth2.0/me';
    /**
     * 获取个人信息接口地址
     */
    const LOGINAPI='https://graph.qq.com/user/get_user_info';
    /**
     * 回调地址
     */
    const CALLBACKPATH="open/login/tecent/callback.php";
    /**
     * 授权列表
     */
    const SCOPE="get_user_info,list_album,upload_pic,do_like";
    /**
     * response_type
     */
    const RESPONSETYPE="code";
    /**
     * grant_type
     */
    const GRANTTYPE="authorization_code";
    /**
     * 单例化
     */
    private static $newInstance;

    public static function new_instance()
    {
        if (self::$newInstance==null)
        {
            self::$newInstance=new OpenLoginQQ();
        }
        return self::$newInstance;
    }

    /**
     * 登录
     */
    public function login()
    {
        HttpSession::init();
        $app = Logintype::get_by_id(self::ID);
        $params = array();
        $params["client_id"] = $app->app_key;
        $_SESSION['state'] = md5(uniqid(rand(), TRUE));
        $params["state"] = $_SESSION['state'];
        $params["response_type"] = self::RESPONSETYPE;
        $params["scope"] = self::SCOPE;
        $params["redirect_uri"] = urlencode(Gc::$url_base.self::CALLBACKPATH);
        $sendurl = self::LOGINURL;
        $dialog_url = $this->spliceUrl($sendurl,$params,self::ID);
        header('Location:'.$dialog_url);
    }

    /**
     * 回调
     * $param $code
     */
    public function callBack($code)
    {
        //获取access_token
        $app = Logintype::get_by_id(self::ID);
        $params = array();
        $params["client_id"] = $app->app_key;
        $params["grant_type"] = self::GRANTTYPE;
        $params["redirect_uri"] = urlencode(Gc::$url_base.self::CALLBACKPATH);
        $params["client_secret"] = $app->app_secret;
        $params["code"] = $code;
        $sendurl = self::LOGINTOKEN;
        $token_url = $this->spliceUrl($sendurl,$params);
        $response = file_get_contents($token_url);
        if (strpos($response, "callback") !== false){
            $lpos = strpos($response, "(");
            $rpos = strrpos($response, ")");
            $response  = substr($response, $lpos + 1, $rpos - $lpos -1);
            $msg = json_decode($response);
            if (isset($msg->error))
            {
               echo "<h3>error:</h3>" . $msg->error;
               echo "<h3>msg  :</h3>" . $msg->error_description;
               exit;
            }
        }
        $reparams = array();
        parse_str($response, $reparams);
        //access_token
        $access_token = $reparams["access_token"];
        //获取openid
        $sendurl = self::LOGINOPENID;
        $params_token =array();
        $params_token["access_token"] = $access_token;
        $openidurl = $this->spliceUrl($sendurl,$params_token);
        $str  = file_get_contents($openidurl);
        if (strpos($str, "callback") !== false){
            $lpos = strpos($str, "(");
            $rpos = strrpos($str, ")");
            $str  = substr($str, $lpos + 1, $rpos - $lpos -1);
        }
        $user = json_decode($str);
        if (isset($user->error)){
            echo "<h3>error:</h3>" . $user->error;
            echo "<h3>msg  :</h3>" . $user->error_description;
            exit;
        }
        //openid
        $openid = $user->openid;
        //获取用户信息
        $sendurl = self::LOGINAPI;
        $params_openid =array();
        $params_openid["access_token"] = $access_token;
        $params_openid["oauth_consumer_key"] = $app->app_key;
        $params_openid["openid"] = $openid;
        $params_openid["format"] = "json";
        $infourl = $this->spliceUrl($sendurl,$params_openid);
        $infostr  = file_get_contents($infourl);
        $info = json_decode($infostr);
        $member_name = $info->nickname;
        //设置session
        if($openid&&$member_name){
            $this->setSession($openid,self::ID,$member_name);
        }
    }
}
?>
