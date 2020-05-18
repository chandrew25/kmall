<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:用户类型  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumUsertype extends Enum
{
    /**
     * 用户类型:后台管理员
     */
    const ADMIN='0';
    /**
     * 用户类型:普通会员
     */
    const MEMBER='1';
    /**
     * 用户类型:第三方管理员
     */
    const THIRDADMIN='2';

    /**
     * 显示用户类型<br/>
     * 0:后台管理员-admin<br/>
     * 1:普通会员-member<br/>
     * 2:第三方管理员-thirdadmin<br/>
     */
    public static function usertypeShow($usertype)
    {
       switch($usertype){
            case self::ADMIN:
                return "后台管理员";
            case self::MEMBER:
                return "普通会员";
            case self::THIRDADMIN:
                return "第三方管理员";
       }
       return "未知";
    }

    /**
     * 根据用户类型显示文字获取用户类型<br/>
     * @param mixed $usertypeShow 用户类型显示文字
     */
    public static function usertypeByShow($usertypeShow)
    {
       switch($usertypeShow){
            case "后台管理员":
                return self::ADMIN;
            case "普通会员":
                return self::MEMBER;
            case "第三方管理员":
                return self::THIRDADMIN;
       }
       return self::ADMIN;
    }

}
?>
