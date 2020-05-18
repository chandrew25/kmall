<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:生成类型  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumCreateFrom extends Enum
{
    /**
     * 生成类型:优惠券发布
     */
    const PUBLISH='1';
    /**
     * 生成类型:促销活动
     */
    const PROMOTION='2';
    /**
     * 生成类型:使用优惠券
     */
    const COUPON='3';

    /** 
     * 显示生成类型<br/>
     * 1:优惠券发布-publish<br/>
     * 2:促销活动-promotion<br/>
     * 3:使用优惠券-coupon<br/>
     */
    public static function create_fromShow($create_from)
    {
       switch($create_from){ 
            case self::PUBLISH:
                return "优惠券发布"; 
            case self::PROMOTION:
                return "促销活动"; 
            case self::COUPON:
                return "使用优惠券"; 
       }
       return "未知";
    }

    /** 
     * 根据生成类型显示文字获取生成类型<br/>
     * @param mixed $create_fromShow 生成类型显示文字
     */
    public static function create_fromByShow($create_fromShow)
    {
       switch($create_fromShow){ 
            case "优惠券发布":
                return self::PUBLISH; 
            case "促销活动":
                return self::PROMOTION; 
            case "使用优惠券":
                return self::COUPON; 
       }
       return self::PUBLISH;
    }

}
?>
