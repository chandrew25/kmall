<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:发票抬头  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumType1Header extends Enum
{
    /**
     * 发票抬头:个人
     */
    const OWNERS='1';
    /**
     * 发票抬头:单位
     */
    const ENTERPRISES='2';

    /**
     * 显示发票抬头<br/>
     * 1：个人-owners<br/>
     * 2：单位-enterprises<br/>
     */
    public static function type1_headerShow($type1_header)
    {
       switch($type1_header){
            case self::OWNERS:
                return "个人";
            case self::ENTERPRISES:
                return "单位";
       }
       return "未知";
    }

    /**
     * 根据发票抬头显示文字获取发票抬头<br/>
     * @param mixed $type1_headerShow 发票抬头显示文字
     */
    public static function type1_headerByShow($type1_headerShow)
    {
       switch($type1_headerShow){
            case "个人":
                return self::OWNERS;
            case "单位":
                return self::ENTERPRISES;
       }
       return self::OWNERS;
    }

}
?>
