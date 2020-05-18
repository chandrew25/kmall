<?php
/**
 +---------------------------------------<br/>
 * 控制器:sina登录<br/>
 +---------------------------------------
 * @category kmall
 * @package open.api.login
 * @author 924197212@qq.com
 */
class OpenLoginSina extends OpenLogin
{
    /**
     * 登录logintype_id
     */
    const ID='2';
    /**
     * 获取授权接口地址
     */
    const LOGINURL="https://api.weibo.com/oauth2/authorize";
    /**
     * 获取ACCESS TOKEN接口地址
     */
    const LOGINTOKEN="https://api.weibo.com/oauth2/access_token";
    /**
     * 获取个人信息接口地址
     */
    const LOGINAPI='https://api.weibo.com/2/users/show.json';
    /**
     * 回调地址
     */
    const CALLBACKPATH="open/login/weibo/callback.php";
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
            self::$newInstance=new OpenLoginSina();
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
        $params["redirect_uri"] = Gc::$url_base.self::CALLBACKPATH;
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
        //post提交请求
        $params = array();
        $params["client_id"] = $app->app_key;
        $params["client_secret"] = $app->app_secret;
        $params["grant_type"] = self::GRANTTYPE;
        $params["code"] = $code;
        $params["redirect_uri"] = Gc::$url_base.self::CALLBACKPATH;
        $sendurl = self::LOGINTOKEN;
        $response = $this->postApi($sendurl,$params);
        if(!$response){
            echo "<h3>error: 获取access_token失败！</h3>";
            return;
        }
        $srt = json_decode($response);
        //access_token
        $access_token =  $srt->access_token;
        //用户uid
        $uid = $srt->uid;
        //Step3：使用Access Token来获取用户信息
        $infoparams = array();
        $infoparams["access_token"] = $access_token;
        $infoparams["uid"] = $uid;
        $sendurl = self::LOGINAPI;
        $infourl = $this->spliceUrl($sendurl,$infoparams);
        $infostr  = file_get_contents($infourl);
        if(!$infostr){
            echo "<h3>error: 获取用户信息失败！</h3>";
            return;
        }
        $info = json_decode($infostr);
        //openid
        $openid = $info->id;
        $member_name = $info->screen_name;
        //设置session
        if($openid&&$member_name){
            $this->setSession($openid,self::ID,$member_name);
        }
    }
}
?>
