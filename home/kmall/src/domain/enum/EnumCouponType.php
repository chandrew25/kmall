<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:优惠券类型  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumCouponType extends Enum
{
    /**
     * 优惠券类型:多张使用一次
     */
    const ONCE='1';
    /**
     * 优惠券类型:一张无限使用
     */
    const INFINITE='2';

    /** 
     * 显示优惠券类型<br/>
     * 0:多张使用一次-once<br/>
     * 1:一张无限使用-infinite<br/>
     */
    public static function coupon_typeShow($coupon_type)
    {
       switch($coupon_type){ 
            case self::ONCE:
                return "多张使用一次"; 
            case self::INFINITE:
                return "一张无限使用"; 
       }
       return "未知";
    }

    /** 
     * 根据优惠券类型显示文字获取优惠券类型<br/>
     * @param mixed $coupon_typeShow 优惠券类型显示文字
     */
    public static function coupon_typeByShow($coupon_typeShow)
    {
       switch($coupon_typeShow){ 
            case "多张使用一次":
                return self::ONCE; 
            case "一张无限使用":
                return self::INFINITE; 
       }
       return self::ONCE;
    }

}
?>
