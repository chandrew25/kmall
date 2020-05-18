<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:商品分类所属栏目  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumColumnType extends Enum
{
    /**
     * 商品分类所属栏目:品牌特惠
     */
    const BRAND='1';
    /**
     * 商品分类所属栏目:特色专场
     */
    const SPECIAL='2';
    /**
     * 商品分类所属栏目:销售排行
     */
    const TOPSALE='3';

    /**
     * 显示商品分类所属栏目<br/>
     * 1:品牌特惠-brand<br/>
     * 2:特色专场-special<br/>
     * 3.销售排行-topsale<br/>
     */
    public static function column_typeShow($column_type)
    {
       switch($column_type){
            case self::BRAND:
                return "品牌特惠";
            case self::SPECIAL:
                return "特色专场";
            case self::TOPSALE:
                return "销售排行";
       }
       return "未知";
    }
    /**
     * 根据商品分类所属栏目显示文字获取商品分类所属栏目
     * @param mixed $column_typeShow 商品分类所属栏目显示文字
     */
    public static function column_typeByShow($column_typeShow)
    {
        switch ($column_typeShow) {
           case "品牌特惠":
             return self::BRAND;
           case "特色专场":
             return self::SPECIAL;
           case "销售排行":
             return self::TOPSALE;
        }
        return self::BRAND;
    }
}
?>
