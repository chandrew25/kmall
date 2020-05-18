<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:分类  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumFloor extends Enum
{
    /**
     * 分类:今日热销
     */
    const F0='0';
    /**
     * 分类:推荐产品
     */
    const F11='1';
    /**
     * 分类:欧式家具
     */
    const F12='2';
    /**
     * 分类:现代家具
     */
    const F13='3';
    /**
     * 分类:建材城
     */
    const F3='4';
    /**
     * 分类:家纺家饰
     */
    const F3='5';

    /** 
     * 显示分类<br/>
     * 0:今日热销-f0<br/>
     * 1:推荐产品-f11<br/>
     * 2:欧式家具-f12<br/>
     * 3:现代家具-f13<br/>
     * 4:建材城-f3<br/>
     * 5:家纺家饰-f3<br/>
     */
    public static function floorShow($floor)
    {
       switch($floor){ 
            case self::F0:
                return "今日热销"; 
            case self::F11:
                return "推荐产品"; 
            case self::F12:
                return "欧式家具"; 
            case self::F13:
                return "现代家具"; 
            case self::F3:
                return "建材城"; 
            case self::F3:
                return "家纺家饰"; 
       }
       return "未知";
    }

    /** 
     * 根据分类显示文字获取分类<br/>
     * @param mixed $floorShow 分类显示文字
     */
    public static function floorByShow($floorShow)
    {
       switch($floorShow){ 
            case "今日热销":
                return self::F0; 
            case "推荐产品":
                return self::F11; 
            case "欧式家具":
                return self::F12; 
            case "现代家具":
                return self::F13; 
            case "建材城":
                return self::F3; 
            case "家纺家饰":
                return self::F3; 
       }
       return self::F0;
    }

}
?>
