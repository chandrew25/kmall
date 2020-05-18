<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:订单状态  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumOrderStatus extends Enum
{
    /**
     * 订单状态:待审核
     */
    const AUDIT='audit';
    /**
     * 订单状态:待确认
     */
    const CONFIRM='confirm';
    /**
     * 订单状态:有效
     */
    const ACTIVE='active';
    /**
     * 订单状态:完成
     */
    const FINISH='finish';
    /**
     * 订单状态:无效
     */
    const DEAD='dead';

    /** 
     * 显示订单状态<br/>
     * audit:待审核<br/>
     * confirm:待确认<br/>
     * active:有效<br/>
     * finish:完成<br/>
     * dead:无效<br/>
     */
    public static function statusShow($status)
    {
       switch($status){ 
            case self::AUDIT:
                return "待审核"; 
            case self::CONFIRM:
                return "待确认"; 
            case self::ACTIVE:
                return "有效"; 
            case self::FINISH:
                return "完成"; 
            case self::DEAD:
                return "无效"; 
       }
       return "未知";
    }

    /** 
     * 根据订单状态显示文字获取订单状态<br/>
     * @param mixed $statusShow 订单状态显示文字
     */
    public static function statusByShow($statusShow)
    {
       switch($statusShow){ 
            case "待审核":
                return self::AUDIT; 
            case "待确认":
                return self::CONFIRM; 
            case "有效":
                return self::ACTIVE; 
            case "完成":
                return self::FINISH; 
            case "无效":
                return self::DEAD; 
       }
       return self::AUDIT;
    }

}
?>
