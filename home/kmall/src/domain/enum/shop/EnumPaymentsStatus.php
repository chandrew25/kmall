<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:支付状态  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumPaymentsStatus extends Enum
{
    /**
     * 支付状态:准备支付
     */
    const READY='ready';
    /**
     * 支付状态:支付中
     */
    const PROGRESS='progress';
    /**
     * 支付状态:退款
     */
    const RETURNS='return';
    /**
     * 支付状态:支付成功
     */
    const SUCC='succ';
    /**
     * 支付状态:支付失败
     */
    const FAILED='failed';
    /**
     * 支付状态:取消支付
     */
    const CANCEL='cancel';
    /**
     * 支付状态:支付错误
     */
    const ERROR='error';
    /**
     * 支付状态:非法支付
     */
    const INVALID='invalid';
    /**
     * 支付状态:支付超时
     */
    const TIMEOUT='timeout';

    /** 
     * 显示支付状态<br/>
     * ready:准备支付<br/>
     * progress:支付中<br/>
     * return:退款<br/>
     * succ:支付成功<br/>
     * failed:支付失败<br/>
     * cancel:取消支付<br/>
     * error:支付错误<br/>
     * invalid:非法支付<br/>
     * timeout:支付超时<br/>
     * <br/>
     */
    public static function statusShow($status)
    {
       switch($status){ 
            case self::READY:
                return "准备支付"; 
            case self::PROGRESS:
                return "支付中"; 
            case self::RETURNS:
                return "退款"; 
            case self::SUCC:
                return "支付成功"; 
            case self::FAILED:
                return "支付失败"; 
            case self::CANCEL:
                return "取消支付"; 
            case self::ERROR:
                return "支付错误"; 
            case self::INVALID:
                return "非法支付"; 
            case self::TIMEOUT:
                return "支付超时"; 
       }
       return "未知";
    }

    /** 
     * 根据支付状态显示文字获取支付状态<br/>
     * @param mixed $statusShow 支付状态显示文字
     */
    public static function statusByShow($statusShow)
    {
       switch($statusShow){ 
            case "准备支付":
                return self::READY; 
            case "支付中":
                return self::PROGRESS; 
            case "退款":
                return self::RETURNS; 
            case "支付成功":
                return self::SUCC; 
            case "支付失败":
                return self::FAILED; 
            case "取消支付":
                return self::CANCEL; 
            case "支付错误":
                return self::ERROR; 
            case "非法支付":
                return self::INVALID; 
            case "支付超时":
                return self::TIMEOUT; 
       }
       return self::READY;
    }

}
?>
