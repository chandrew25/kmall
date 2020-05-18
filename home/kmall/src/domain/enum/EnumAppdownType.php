<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:应用分类  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumAppdownType extends Enum
{
    /**
     * 应用分类:游戏天地
     */
    const GAMEWORLD='1';
    /**
     * 应用分类:影音娱乐
     */
    const ENTERTAINMENT='2';
    /**
     * 应用分类:教育阅读
     */
    const EDUREAD='3';
    /**
     * 应用分类:旅行购物
     */
    const TRAVELSHOP='4';
    /**
     * 应用分类:生活休闲
     */
    const LEISURE='5';

    /** 
     * 显示应用分类<br/>
     * 1：游戏天地-gameworld<br/>
     * 2：影音娱乐-entertainment<br/>
     * 3：教育阅读-eduread<br/>
     * 4：旅行购物-travelshop<br/>
     * 5：生活休闲-Leisure<br/>
     */
    public static function typeShow($type)
    {
       switch($type){ 
            case self::GAMEWORLD:
                return "游戏天地"; 
            case self::ENTERTAINMENT:
                return "影音娱乐"; 
            case self::EDUREAD:
                return "教育阅读"; 
            case self::TRAVELSHOP:
                return "旅行购物"; 
            case self::LEISURE:
                return "生活休闲"; 
       }
       return "未知";
    }

    /** 
     * 根据应用分类显示文字获取应用分类<br/>
     * @param mixed $typeShow 应用分类显示文字
     */
    public static function typeByShow($typeShow)
    {
       switch($typeShow){ 
            case "游戏天地":
                return self::GAMEWORLD; 
            case "影音娱乐":
                return self::ENTERTAINMENT; 
            case "教育阅读":
                return self::EDUREAD; 
            case "旅行购物":
                return self::TRAVELSHOP; 
            case "生活休闲":
                return self::LEISURE; 
       }
       return self::GAMEWORLD;
    }

}
?>
