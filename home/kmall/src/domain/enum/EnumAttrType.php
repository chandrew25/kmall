<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:属性类型  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumAttrType extends Enum
{
    /**
     * 属性类型:文字
     */
    const LETTER='1';
    /**
     * 属性类型:图片
     */
    const PICTURE='2';

    /** 
     * 显示属性类型<br/>
     * 1:文字-letter<br/>
     * 2:图片-picture<br/>
     */
    public static function attr_typeShow($attr_type)
    {
       switch($attr_type){ 
            case self::LETTER:
                return "文字"; 
            case self::PICTURE:
                return "图片"; 
       }
       return "未知";
    }

    /** 
     * 根据属性类型显示文字获取属性类型<br/>
     * @param mixed $attr_typeShow 属性类型显示文字
     */
    public static function attr_typeByShow($attr_typeShow)
    {
       switch($attr_typeShow){ 
            case "文字":
                return self::LETTER; 
            case "图片":
                return self::PICTURE; 
       }
       return self::LETTER;
    }

}
?>
