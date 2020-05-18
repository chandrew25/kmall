<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:案例类型  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumCaseType extends Enum
{
    /**
     * 案例类型:经典案例
     */
    const CLASSIC='1';
    /**
     * 案例类型:福利档案
     */
    const SERVICE='2';
    /**
     * 案例类型:高层访谈
     */
    const WELFARE='3';
    /**
     * 案例类型:成功案例
     */
    const SUCCESS='4';

    /**
     * 显示案例类型<br/>
     * 1:经典案例-classic<br/>
     * 2:福利档案-service<br/>
     * 3:高层访谈-welfare<br/>
     * 4:成功案例-success<br/>
     * <br/>
     */
    public static function case_typeShow($case_type)
    {
       switch($case_type){
            case self::CLASSIC:
                return "经典案例";
            case self::SERVICE:
                return "福利档案";
            case self::WELFARE:
                return "高层访谈";
            case self::SUCCESS:
                return "成功案例";
       }
       return "未知";
    }

    /**
     * 根据案例类型显示文字获取案例类型<br/>
     * @param mixed $case_typeShow 案例类型显示文字
     */
    public static function case_typeByShow($case_typeShow)
    {
       switch($case_typeShow){
            case "经典案例":
                return self::CLASSIC;
            case "福利档案":
                return self::SERVICE;
            case "高层访谈":
                return self::WELFARE;
            case "成功案例":
                return self::SUCCESS;
       }
       return self::CLASSIC;
    }

}
?>
