<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:状态  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumPstatus extends Enum
{
    /**
     * 状态:未开
     */
    const NOOPEN='0';
    /**
     * 状态:开通
     */
    const OPEN='1';
    /**
     * 状态:已提
     */
    const TAKE='2';
    /**
     * 状态:作废
     */
    const CANCEL='3';

    /**
     * 显示状态<br/>
     * 0:未开-noopen<br/>
     * 1:开通-open<br/>
     * 2:已提-take<br/>
     * 3:作废-cancel<br/>
     */
    public static function pstatusShow($pstatus)
    {
       switch($pstatus){
            case self::NOOPEN:
                return "未开";
            case self::OPEN:
                return "开通";
            case self::TAKE:
                return "已提";
            case self::CANCEL:
                return "作废";
       }
       return "未知";
    }

    /**
     * 根据状态显示文字获取状态<br/>
     * @param mixed $pstatusShow 状态显示文字
     */
    public static function pstatusByShow($pstatusShow)
    {
       switch($pstatusShow){
            case "未开":
                return self::NOOPEN;
            case "开通":
                return self::OPEN;
            case "已提":
                return self::TAKE;
            case "作废":
                return self::CANCEL;
       }
       return self::NOOPEN;
    }

}
?>
