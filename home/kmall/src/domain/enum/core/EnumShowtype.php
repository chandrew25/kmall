<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:显示类型  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumShowtype extends Enum
{
    /**
     * 显示类型:热门商品
     */
    const HOTPRODUCT='1';
    /**
     * 显示类型:新品上架
     */
    const NEWPRODUCT='2';

    /**
     * 显示显示类型<br/>
     * 1：热门商品-hotproduct<br/>
     * 2：新品上架-newproduct<br/>
     * 默认热门商品<br/>
     */
    public static function showtypeShow($showtype)
    {
       switch($showtype){
            case self::HOTPRODUCT:
                return "热门商品";
            case self::NEWPRODUCT:
                return "新品上架";
       }
       return "未知";
    }

    /**
     * 根据显示类型显示文字获取显示类型<br/>
     * @param mixed $showtypeShow 显示类型显示文字
     */
    public static function showtypeByShow($showtypeShow)
    {
       switch($showtypeShow){
            case "热门商品":
                return self::HOTPRODUCT;
            case "新品上架":
                return self::NEWPRODUCT;
       }
       return self::HOTPRODUCT;
    }

}
?>
