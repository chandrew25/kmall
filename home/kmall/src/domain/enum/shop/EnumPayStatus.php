<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:支付状态  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumPayStatus extends Enum
{
    /**
     * 支付状态:准备支付
     */
    const READY='0';
    /**
     * 支付状态:支付成功
     */
    const SUCC='1';
    /**
     * 支付状态:支付中
     */
    const PROGRESS='2';
    /**
     * 支付状态:支付失败
     */
    const FAILED='3';
    /**
     * 支付状态:取消支付
     */
    const CANCEL='4';
    /**
     * 支付状态:退款
     */
    const RETURNEDS='5';
    /**
     * 支付状态:支付错误
     */
    const ERROR='6';
    /**
     * 支付状态:非法支付
     */
    const INVALID='7';
    /**
     * 支付状态:支付超时
     */
    const TIMEOUT='8';
    /**
     * 支付状态:部分退款
     */
    const RETURNEDPART='9';
    /**
     * 支付状态:已收款
     */
    const WELL='10';

    /** 
     * 显示支付状态<br/>
     * 0:准备支付-ready<br/>
     * 1:支付成功-succ<br/>
     * 2:支付中-progress<br/>
     * 3:支付失败-failed<br/>
     * 4:取消支付-cancel<br/>
     * 5:退款-returneds<br/>
     * 6:支付错误-error<br/>
     * 7:非法支付-invalid<br/>
     * 8:支付超时-timeout<br/>
     * 9:部分退款-returnedpart<br/>
     * 10:已收款-well<br/>
     */
    public static function pay_statusShow($pay_status)
    {
       switch($pay_status){ 
            case self::READY:
                return "准备支付"; 
            case self::SUCC:
                return "支付成功"; 
            case self::PROGRESS:
                return "支付中"; 
            case self::FAILED:
                return "支付失败"; 
            case self::CANCEL:
                return "取消支付"; 
            case self::RETURNEDS:
                return "退款"; 
            case self::ERROR:
                return "支付错误"; 
            case self::INVALID:
                return "非法支付"; 
            case self::TIMEOUT:
                return "支付超时"; 
            case self::RETURNEDPART:
                return "部分退款"; 
            case self::WELL:
                return "已收款"; 
       }
       return "未知";
    }

    /** 
     * 根据支付状态显示文字获取支付状态<br/>
     * @param mixed $pay_statusShow 支付状态显示文字
     */
    public static function pay_statusByShow($pay_statusShow)
    {
       switch($pay_statusShow){ 
            case "准备支付":
                return self::READY; 
            case "支付成功":
                return self::SUCC; 
            case "支付中":
                return self::PROGRESS; 
            case "支付失败":
                return self::FAILED; 
            case "取消支付":
                return self::CANCEL; 
            case "退款":
                return self::RETURNEDS; 
            case "支付错误":
                return self::ERROR; 
            case "非法支付":
                return self::INVALID; 
            case "支付超时":
                return self::TIMEOUT; 
            case "部分退款":
                return self::RETURNEDPART; 
            case "已收款":
                return self::WELL; 
       }
       return self::READY;
    }

}
?>
