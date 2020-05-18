<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:结果  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumResult extends Enum
{
    /**
     * 结果:成功
     */
    const SUCC='succ';
    /**
     * 结果:处理中
     */
    const PROC='proc';
    /**
     * 结果:失败
     */
    const FAIL='fail';

    /** 
     * 显示结果<br/>
     * succ:成功<br/>
     * proc:处理中<br/>
     * fail:失败<br/>
     */
    public static function resultShow($result)
    {
       switch($result){ 
            case self::SUCC:
                return "成功"; 
            case self::PROC:
                return "处理中"; 
            case self::FAIL:
                return "失败"; 
       }
       return "未知";
    }

    /** 
     * 根据结果显示文字获取结果<br/>
     * @param mixed $resultShow 结果显示文字
     */
    public static function resultByShow($resultShow)
    {
       switch($resultShow){ 
            case "成功":
                return self::SUCC; 
            case "处理中":
                return self::PROC; 
            case "失败":
                return self::FAIL; 
       }
       return self::SUCC;
    }

}
?>
