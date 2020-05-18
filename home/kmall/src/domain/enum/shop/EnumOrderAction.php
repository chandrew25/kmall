<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:订单行为  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumOrderAction extends Enum
{
    /**
     * 订单行为:创建
     */
    const CREATE='0';
    /**
     * 订单行为:审核
     */
    const AUDIT='1';
    /**
     * 订单行为:确认
     */
    const CONFIRM='2';
    /**
     * 订单行为:生效
     */
    const ACTIVE='3';
    /**
     * 订单行为:发货
     */
    const SEND='4';
    /**
     * 订单行为:收货
     */
    const RECEIVE='5';
    /**
     * 订单行为:付款
     */
    const TOPAY='6';
    /**
     * 订单行为:收款
     */
    const PAY='7';
    /**
     * 订单行为:完成
     */
    const FINISH='8';
    /**
     * 订单行为:无效
     */
    const DEAD='9';

    /** 
     * 显示订单行为<br/>
     * 0:创建-create<br/>
     * 1:审核-audit<br/>
     * 2:确认-confirm<br/>
     * 3:生效-active<br/>
     * 4:发货-send<br/>
     * 5:收货-receive<br/>
     * 6:付款-topay<br/>
     * 7:收款-pay<br/>
     * 8:完成-finish<br/>
     * 9:无效-dead<br/>
     * <br/>
     */
    public static function orderActionShow($orderAction)
    {
       switch($orderAction){ 
            case self::CREATE:
                return "创建"; 
            case self::AUDIT:
                return "审核"; 
            case self::CONFIRM:
                return "确认"; 
            case self::ACTIVE:
                return "生效"; 
            case self::SEND:
                return "发货"; 
            case self::RECEIVE:
                return "收货"; 
            case self::TOPAY:
                return "付款"; 
            case self::PAY:
                return "收款"; 
            case self::FINISH:
                return "完成"; 
            case self::DEAD:
                return "无效"; 
       }
       return "未知";
    }

    /** 
     * 根据订单行为显示文字获取订单行为<br/>
     * @param mixed $orderActionShow 订单行为显示文字
     */
    public static function orderActionByShow($orderActionShow)
    {
       switch($orderActionShow){ 
            case "创建":
                return self::CREATE; 
            case "审核":
                return self::AUDIT; 
            case "确认":
                return self::CONFIRM; 
            case "生效":
                return self::ACTIVE; 
            case "发货":
                return self::SEND; 
            case "收货":
                return self::RECEIVE; 
            case "付款":
                return self::TOPAY; 
            case "收款":
                return self::PAY; 
            case "完成":
                return self::FINISH; 
            case "无效":
                return self::DEAD; 
       }
       return self::CREATE;
    }

}
?>
