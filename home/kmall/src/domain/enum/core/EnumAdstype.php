<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:广告类型  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumAdstype extends Enum
{
    /**
     * 广告类型:首页中央
     */
    const INDEXMID='1';
    /**
     * 广告类型:首页右侧
     */
    const INDEXRIG='2';
    /**
     * 广告类型:首页右下
     */
    const INDEXRND='3';
    /**
     * 广告类型:首页下方
     */
    const INDEXDOW='4';
    /**
     * 广告类型:首页中上
     */
    const INDEXMNT='5';

    /**
     * 显示广告类型<br/>
     * 1:首页中央-IndexMid<br/>
     * 2:首页右侧-IndexRig<br/>
     * 3:首页右下-IndexRnD<br/>
     * 4:首页下方-IndexDow<br/>
     */
    public static function adstypeShow($adstype)
    {
       switch($adstype){
            case self::INDEXMID:
                return "首页中央";
            case self::INDEXRIG:
                return "首页右侧";
            case self::INDEXRND:
                return "首页右下";
            case self::INDEXDOW:
                return "首页下方";
            case self::INDEXMNT:
                return "滚动广告";
       }
       return "未知";
    }

    /**
     * 根据广告类型显示文字获取广告类型<br/>
     * @param mixed $adstypeShow 广告类型显示文字
     */
    public static function adstypeByShow($adstypeShow)
    {
       switch($adstypeShow){
            case "首页中央":
                return self::INDEXMID;
            case "首页右侧":
                return self::INDEXRIG;
            case "首页右下":
                return self::INDEXRND;
            case "首页下方":
                return self::INDEXDOW;
            case "滚动广告":
                return self::INDEXMNT;
       }
       return self::INDEXMID;
    }

}
?>
