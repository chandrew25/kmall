<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:规则分类  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumClassifyType extends Enum
{
    /**
     * 规则分类:优惠券
     */
    const COUPON='1';
    /**
     * 规则分类:促销活动
     */
    const PROMOTION='2';

    /** 
     * 显示规则分类<br/>
     * 1:优惠券-coupon<br/>
     * 2:促销活动-promotion<br/>
     */
    public static function classify_typeShow($classify_type)
    {
       switch($classify_type){ 
            case self::COUPON:
                return "优惠券"; 
            case self::PROMOTION:
                return "促销活动"; 
       }
       return "未知";
    }

    /** 
     * 根据规则分类显示文字获取规则分类<br/>
     * @param mixed $classify_typeShow 规则分类显示文字
     */
    public static function classify_typeByShow($classify_typeShow)
    {
       switch($classify_typeShow){ 
            case "优惠券":
                return self::COUPON; 
            case "促销活动":
                return self::PROMOTION; 
       }
       return self::COUPON;
    }

}
?>
