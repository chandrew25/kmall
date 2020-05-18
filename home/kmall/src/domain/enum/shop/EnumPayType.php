<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:支付类型  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumPayType extends Enum
{
    /**
     * 支付类型:在线支付
     */
    const ONLINE='online';
    /**
     * 支付类型:线下支付
     */
    const OFFLINE='offline';
    /**
     * 支付类型:预存款支付
     */
    const DEPOSIT='deposit';
    /**
     * 支付类型:预存款充值
     */
    const RECHARGE='recharge';
    /**
     * 支付类型:加盟费
     */
    const JOINFEE='joinfee';

    /** 
     * 显示支付类型<br/>
     * online:在线支付<br/>
     * offline:线下支付<br/>
     * deposit:预存款支付<br/>
     * recharge:预存款充值<br/>
     * joinfee:加盟费<br/>
     */
    public static function pay_typeShow($pay_type)
    {
       switch($pay_type){ 
            case self::ONLINE:
                return "在线支付"; 
            case self::OFFLINE:
                return "线下支付"; 
            case self::DEPOSIT:
                return "预存款支付"; 
            case self::RECHARGE:
                return "预存款充值"; 
            case self::JOINFEE:
                return "加盟费"; 
       }
       return "未知";
    }

    /** 
     * 根据支付类型显示文字获取支付类型<br/>
     * @param mixed $pay_typeShow 支付类型显示文字
     */
    public static function pay_typeByShow($pay_typeShow)
    {
       switch($pay_typeShow){ 
            case "在线支付":
                return self::ONLINE; 
            case "线下支付":
                return self::OFFLINE; 
            case "预存款支付":
                return self::DEPOSIT; 
            case "预存款充值":
                return self::RECHARGE; 
            case "加盟费":
                return self::JOINFEE; 
       }
       return self::ONLINE;
    }

}
?>
