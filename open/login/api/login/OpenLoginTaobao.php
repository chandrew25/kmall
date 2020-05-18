<?php
/**
 +---------------------------------------<br/>
 * 控制器:淘宝登录<br/>
 +---------------------------------------
 * @category kmall
 * @package open.api.login
 * @author 924197212@qq.com
 */
class OpenLoginTaobao extends OpenLogin
{
    /**
     * 登录logintype_id
     */
    const ID='4';
    /**
     * 获取授权接口地址
     */
    const LOGINURL="https://oauth.taobao.com/authorize";
    /**
     * 获取ACCESS TOKEN接口地址
     */
    const LOGINTOKEN="https://oauth.taobao.com/token";
    /**
     * 回调地址
     */
    const CALLBACKPATH="open/login/tb/callback.php";
    /**
     * response_type
     */
    const RESPONSETYPE="code";
    /**
     * grant_type
     */
    const GRANTTYPE="authorization_code";
    /**
     * 授权列表
     */
    const SCOPE="item";
    /**
     * view
     */
    const VIEW="web";

    /**
     * 单例化
     */
    private static $newInstance;

    public static function new_instance()
    {
        if (self::$newInstance==null)
        {
            self::$newInstance=new OpenLoginTaobao();
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
        $params["scope"] = self::SCOPE;
        $params["view"] = self::VIEW;
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
        if(!$srt->error){
            //access_token
            $access_token = $srt->access_token;
            //openid
            $openid = $srt->taobao_user_id;
            $member_name = $srt->taobao_user_nick;
            //乱码问题  
            $member_name = urldecode($member_name);
            //设置session
            if($openid&&$member_name){
                $this->setSession($openid,self::ID,$member_name);
            }
        }
    }
}
?>
