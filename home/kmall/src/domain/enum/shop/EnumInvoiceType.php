<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:发票类型  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumInvoiceType extends Enum
{
    /**
     * 发票类型:普通发票
     */
    const COMINVOICE='1';
    /**
     * 发票类型:增值税发票
     */
    const TAXINVOICE='2';

    /**
     * 显示发票类型<br/>
     * 1：普通发票-cominvoice<br/>
     * 2：增值税发票-taxinvoice<br/>
     */
    public static function typeShow($type)
    {
       switch($type){
            case self::COMINVOICE:
                return "普通发票";
            case self::TAXINVOICE:
                return "增值税发票";
       }
       return "未知";
    }

    /**
     * 根据发票类型显示文字获取发票类型<br/>
     * @param mixed $typeShow 发票类型显示文字
     */
    public static function typeByShow($typeShow)
    {
       switch($typeShow){
            case "普通发票":
                return self::COMINVOICE;
            case "增值税发票":
                return self::TAXINVOICE;
       }
       return self::COMINVOICE;
    }

}
?>
