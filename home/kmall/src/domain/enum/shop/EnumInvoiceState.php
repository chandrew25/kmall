<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:发票状态  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumInvoiceState extends Enum
{
    /**
     * 发票状态:待审核
     */
    const WAITAUDIT='1';
    /**
     * 发票状态:有效
     */
    const EFFECTIVE='2';
    /**
     * 发票状态:无效
     */
    const INVALID='3';

    /**
     * 显示发票状态<br/>
     * 1：待审核-waitaudit<br/>
     * 2：有效-effective<br/>
     * 3：无效-invalid<br/>
     * <br/>
     */
    public static function invoice_stateShow($invoice_state)
    {
       switch($invoice_state){
            case self::WAITAUDIT:
                return "待审核";
            case self::EFFECTIVE:
                return "有效";
            case self::INVALID:
                return "无效";
       }
       return "未知";
    }

    /**
     * 根据发票状态显示文字获取发票状态<br/>
     * @param mixed $invoice_stateShow 发票状态显示文字
     */
    public static function invoice_stateByShow($invoice_stateShow)
    {
       switch($invoice_stateShow){
            case "待审核":
                return self::WAITAUDIT;
            case "有效":
                return self::EFFECTIVE;
            case "无效":
                return self::INVALID;
       }
       return self::WAITAUDIT;
    }

}
?>
