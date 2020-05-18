<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:退款状态  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumRefundproductsStatus extends Enum
{
    /**
     * 退款状态:进行中
     */
    const PROGRESS='0';
    /**
     * 退款状态:退款完成
     */
    const FINISH='1';
    /**
     * 退款状态:取消退款
     */
    const CANCEL='2';

    /**
     * 显示退款状态<br/>
     * 0:进行中-progress<br/>
     * 1:退款完成-finish<br/>
     * 2:取消退款-cancel<br/>
     * <br/>
     */
    public static function statusShow($status)
    {
       switch($status){
            case self::PROGRESS:
                return "进行中";
            case self::FINISH:
                return "退款完成";
            case self::CANCEL:
                return "取消退款";
       }
       return "未知";
    }

    /**
     * 根据退款状态显示文字获取退款状态<br/>
     * @param mixed $statusShow 退款状态显示文字
     */
    public static function statusByShow($statusShow)
    {
       switch($statusShow){
            case "进行中":
                return self::PROGRESS;
            case "退款完成":
                return self::FINISH;
            case "取消退款":
                return self::CANCEL;
       }
       return self::PROGRESS;
    }

}
?>
