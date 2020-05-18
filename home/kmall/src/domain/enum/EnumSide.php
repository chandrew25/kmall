<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:位置  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumSide extends Enum
{
    /**
     * 位置:下方
     */
    const SIDE_DOWN='0';
    /**
     * 位置:左上方
     */
    const SIDE_LEFT='1';
    /**
     * 位置:右上方
     */
    const SIDE_RIGHT='2';

    const SIDE_DOWN2='3';

    /** 
     * 显示位置<br/>
     * 0:下方-side_down<br/>
     * 1:左上方-side_left<br/>
     * 2:右上方-side_right<br/>
     */
    public static function sideShow($side)
    {
       switch($side){ 
            case self::SIDE_DOWN:
                return "下方"; 
            case self::SIDE_LEFT:
                return "左上方"; 
            case self::SIDE_RIGHT:
                return "右上方"; 
            case self::SIDE_DOWN2:
                return "F1幻灯";
       }
       return "未知";
    }

    /** 
     * 根据位置显示文字获取位置<br/>
     * @param mixed $sideShow 位置显示文字
     */
    public static function sideByShow($sideShow)
    {
       switch($sideShow){ 
            case "下方":
                return self::SIDE_DOWN; 
            case "左上方":
                return self::SIDE_LEFT; 
            case "右上方":
                return self::SIDE_RIGHT; 
            case "F1幻灯":
                return self::SIDE_DOWN2;
       }
       return self::SIDE_DOWN;
    }

}
?>
