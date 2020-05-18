<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:推荐等级  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumRecommendlevel extends Enum
{
    /**
     * 推荐等级:等级1
     */
    const LEVEL1='1';
    /**
     * 推荐等级:等级2
     */
    const LEVEL2='2';
    /**
     * 推荐等级:等级3
     */
    const LEVEL3='3';
    /**
     * 推荐等级:等级4
     */
    const LEVEL4='4';
    /**
     * 推荐等级:等级5
     */
    const LEVEL5='5';

    /** 
     * 显示推荐等级<br/>
     * 1:等级1-level1<br/>
     * 2:等级2-level2<br/>
     * 3:等级3-level3<br/>
     * 4:等级4-level4<br/>
     * 5:等级5-level5<br/>
     * 6:等级6-level6<br/>
     * 7:等级7-level7<br/>
     * 8:等级8-level8<br/>
     * 9:等级9-level9<br/>
     * 10:等级10-level10<br/>
     */
    public static function recommendlevelShow($recommendlevel)
    {
       switch($recommendlevel){ 
            case self::LEVEL1:
                return "等级1"; 
            case self::LEVEL2:
                return "等级2"; 
            case self::LEVEL3:
                return "等级3"; 
            case self::LEVEL4:
                return "等级4"; 
            case self::LEVEL5:
                return "等级5"; 
       }
       return "未知";
    }

    /** 
     * 根据推荐等级显示文字获取推荐等级<br/>
     * @param mixed $recommendlevelShow 推荐等级显示文字
     */
    public static function recommendlevelByShow($recommendlevelShow)
    {
       switch($recommendlevelShow){ 
            case "等级1":
                return self::LEVEL1; 
            case "等级2":
                return self::LEVEL2; 
            case "等级3":
                return self::LEVEL3; 
            case "等级4":
                return self::LEVEL4; 
            case "等级5":
                return self::LEVEL5; 
       }
       return self::LEVEL1;
    }

}
?>
