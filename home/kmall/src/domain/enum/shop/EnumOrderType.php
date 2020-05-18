<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:订单类型  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumOrderType extends Enum
{
    /**
     * 订单类型:电话订单
     */
    const PHONE='0';
    /**
     * 订单类型:网上订单
     */
    const WEB='1';
    /**
     * 订单类型:卡券提领订单
     */
    const VOUCHER='2';

    /** 
     * 显示订单类型<br/>
     * 0:电话订单-phone<br/>
     * 1:网上订单-web<br/>
     * 2:卡券提领订单-voucher<br/>
     */
    public static function order_typeShow($order_type)
    {
       switch($order_type){ 
            case self::PHONE:
                return "电话订单"; 
            case self::WEB:
                return "网上订单"; 
            case self::VOUCHER:
                return "卡券提领订单"; 
       }
       return "未知";
    }

    /** 
     * 根据订单类型显示文字获取订单类型<br/>
     * @param mixed $order_typeShow 订单类型显示文字
     */
    public static function order_typeByShow($order_typeShow)
    {
       switch($order_typeShow){ 
            case "电话订单":
                return self::PHONE; 
            case "网上订单":
                return self::WEB; 
            case "卡券提领订单":
                return self::VOUCHER; 
       }
       return self::PHONE;
    }

}
?>
