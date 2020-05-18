<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:商品类型  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumItemType extends Enum
{
    /**
     * 商品类型:产品
     */
    const GOODS='1';
    /**
     * 商品类型:礼物
     */
    const GIFT='2';
    /**
     * 商品类型:包裹
     */
    const PKG='3';

    /** 
     * 显示商品类型<br/>
     * 1:产品-goods<br/>
     * 2:礼物-gift<br/>
     * 3:包裹-pkg<br/>
     */
    public static function item_typeShow($item_type)
    {
       switch($item_type){ 
            case self::GOODS:
                return "产品"; 
            case self::GIFT:
                return "礼物"; 
            case self::PKG:
                return "包裹"; 
       }
       return "未知";
    }

    /** 
     * 根据商品类型显示文字获取商品类型<br/>
     * @param mixed $item_typeShow 商品类型显示文字
     */
    public static function item_typeByShow($item_typeShow)
    {
       switch($item_typeShow){ 
            case "产品":
                return self::GOODS; 
            case "礼物":
                return self::GIFT; 
            case "包裹":
                return self::PKG; 
       }
       return self::GOODS;
    }

}
?>
