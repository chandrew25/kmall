<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:优惠类型  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumPreferentialType extends Enum
{
    /**
     * 优惠类型:商品直接打折
     */
    const PDISCOUNT='1';
    /**
     * 优惠类型:满金额送优惠券
     */
    const OCOUPONS='2';
    /**
     * 优惠类型:满金额打折
     */
    const ODISCOUNT='3';
    /**
     * 优惠类型:满金额立减
     */
    const OREDUCE='4';
    /**
     * 优惠类型:现金抵扣
     */
    const DEDUCTION='5';

    /** 
     * 显示优惠类型<br/>
     * 1:商品直接打折-pdiscount<br/>
     * 2:满金额送优惠券-ocoupons<br/>
     * 3:满金额打折-odiscount<br/>
     * 4:满金额立减-oreduce<br/>
     * 5:现金抵扣-deduction<br/>
     */
    public static function preferential_typeShow($preferential_type)
    {
       switch($preferential_type){ 
            case self::PDISCOUNT:
                return "商品直接打折"; 
            case self::OCOUPONS:
                return "满金额送优惠券"; 
            case self::ODISCOUNT:
                return "满金额打折"; 
            case self::OREDUCE:
                return "满金额立减"; 
            case self::DEDUCTION:
                return "现金抵扣"; 
       }
       return "未知";
    }

    /** 
     * 根据优惠类型显示文字获取优惠类型<br/>
     * @param mixed $preferential_typeShow 优惠类型显示文字
     */
    public static function preferential_typeByShow($preferential_typeShow)
    {
       switch($preferential_typeShow){ 
            case "商品直接打折":
                return self::PDISCOUNT; 
            case "满金额送优惠券":
                return self::OCOUPONS; 
            case "满金额打折":
                return self::ODISCOUNT; 
            case "满金额立减":
                return self::OREDUCE; 
            case "现金抵扣":
                return self::DEDUCTION; 
       }
       return self::PDISCOUNT;
    }

}
?>
