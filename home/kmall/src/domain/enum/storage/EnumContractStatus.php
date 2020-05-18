<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:合同状态  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumContractStatus extends Enum
{
    /**
     * 合同状态:未确认
     */
    const UNCONFIRM='0';
    /**
     * 合同状态:执行中
     */
    const PROCESS='1';
    /**
     * 合同状态:结束
     */
    const END='2';

    /** 
     * 显示合同状态<br/>
     * 0:未确认-UNCONFIRM<br/>
     * 1:执行中-PROCESS<br/>
     * 2:结束-END<br/>
     */
    public static function contract_statusShow($contract_status)
    {
       switch($contract_status){ 
            case self::UNCONFIRM:
                return "未确认"; 
            case self::PROCESS:
                return "执行中"; 
            case self::END:
                return "结束"; 
       }
       return "未知";
    }

    /** 
     * 根据合同状态显示文字获取合同状态<br/>
     * @param mixed $contract_statusShow 合同状态显示文字
     */
    public static function contract_statusByShow($contract_statusShow)
    {
       switch($contract_statusShow){ 
            case "未确认":
                return self::UNCONFIRM; 
            case "执行中":
                return self::PROCESS; 
            case "结束":
                return self::END; 
       }
       return self::UNCONFIRM;
    }

}
?>
