<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:供应商类型  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumSptype extends Enum
{
    /**
     * 供应商类型:渠道商
     */
    const CHANNEL='1';
    /**
     * 供应商类型:普通供应商
     */
    const NORMAL='0';

    /** 
     * 显示供应商类型<br/>
     * 1:渠道商-channel<br/>
     *  0:普通供应商-normal<br/>
     */
    public static function sptypeShow($sptype)
    {
       switch($sptype){ 
            case self::CHANNEL:
                return "渠道商"; 
            case self::NORMAL:
                return "普通供应商"; 
       }
       return "未知";
    }

    /** 
     * 根据供应商类型显示文字获取供应商类型<br/>
     * @param mixed $sptypeShow 供应商类型显示文字
     */
    public static function sptypeByShow($sptypeShow)
    {
       switch($sptypeShow){ 
            case "渠道商":
                return self::CHANNEL; 
            case "普通供应商":
                return self::NORMAL; 
       }
       return self::CHANNEL;
    }

}
?>
