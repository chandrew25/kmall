<?php
/**
 +----------------------------------------------<br/>
 * 所有第三方登录父类<br/>
 +----------------------------------------------
 * @category kmall
 * @package open.api.login
 * @author 924197212@qq.com
 */
abstract class OpenLogin
{

    /**
     * 第一次登录存入的SESSION值
     */
    const FIRST_SESSION="thirdpartylogin";
    /**
     * 提交方式
     */
    const TYPE="post";
    /**
     * 格式
     */
    const FORMAT="post";
    /**
     * 登录
     */
    abstract function login();
    /**
     * 回调
     * $param $code
     */
    abstract function callBack($code);

    /**
    * POST提交
    * @param $sendurl 请求地址
    * @param $params 请求参数
    */
    protected function postApi($sendurl,$params,$type=self::TYPE,$format=self::FORMAT)
    {
        $response = Manager_Communication::newInstance()->currentComm()->sendRequest($sendurl,$params,$type,$format);
        return $response;
    }

    /**
    * 拼接url请求
    * @param $sendurl 请求地址
    * @param $params 请求参数
    *
    */
    protected function spliceUrl($sendurl,$params)
    {
        $dialog_url = $sendurl."?";
        $count = 0;
        foreach($params as $key=>$value){
            if($count==0){
                $dialog_url = $dialog_url.$key."=".$value;
            }else{
                $dialog_url = $dialog_url."&".$key."=".$value;
            }
            $count++;
        }
        return $dialog_url;
    }

    /**
    * 登录成功设置session
    * @param $openid openid
    * @param $logintype 登录类型id号
    *
    */
    protected function setSession($openid,$logintype,$member_name)
    {
        HttpSession::init();
        $userexist = Thirdpartylogin::get_one(array("openid='".$openid."'","logintype_id=".$logintype));
        if($userexist){
            $user = Member::get_by_id($userexist->member_id);
            $_SESSION['member_id'] = $user->member_id;
            $_SESSION['member_name'] = $user->username;
        }else{
            $third_info = array();
            $third_info["openid"] = $openid;
            $third_info["logintype_id"] = $logintype;
            $_SESSION['member_id'] = self::FIRST_SESSION;
            $_SESSION['kmall_third'] = $third_info;
            $_SESSION['member_name'] = $member_name;
        }
        return true;
    }
}
?>
