<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:联系人  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumComContractor extends Enum
{
    /**
     * 联系人:HR部门联系人
     */
    const HRDPT='1';
    /**
     * 联系人:工会联系人
     */
    const TRADE='2';

    /**
     * 显示联系人<br/>
     * 1:HR部门联系人-hrdpt<br/>
     * 2:工会联系人-trade<br/>
     * <br/>
     * <br/>
     */
    public static function com_contractorShow($com_contractor)
    {
       switch($com_contractor){
            case self::HRDPT:
                return "HR部门联系人";
            case self::TRADE:
                return "工会联系人";
       }
       return "未知";
    }

    /**
     * 根据联系人显示文字获取联系人<br/>
     * @param mixed $com_contractorShow 联系人显示文字
     */
    public static function com_contractorByShow($com_contractorShow)
    {
       switch($com_contractorShow){
            case "HR部门联系人":
                return self::HRDPT;
            case "工会联系人":
                return self::TRADE;
       }
       return self::HRDPT;
    }

}
?>
