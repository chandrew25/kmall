<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:操作描述  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumOperation extends Enum
{
    /**
     * 操作描述:管理员权限修改
     */
    const OPERATION1='1';

    /** 
     * 显示操作描述<br/>
     * 1:管理员权限修改-OPERATION1<br/>
     */
    public static function operationShow($operation)
    {
       switch($operation){ 
            case self::OPERATION1:
                return "管理员权限修改"; 
       }
       return "未知";
    }

    /** 
     * 根据操作描述显示文字获取操作描述<br/>
     * @param mixed $adstypeShow 操作描述显示文字
     */
    public static function operationByShow($operationShow)
    {
       switch($operationShow){ 
            case "管理员权限修改":
                return self::OPERATION1; 
       }
       return self::OPERATION1;
    }

}
?>
