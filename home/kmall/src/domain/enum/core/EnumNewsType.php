<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:新闻种类  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumNewsType extends Enum
{
    /**
     * 新闻种类:商城公告
     */
    const NOTICE='1';
    /**
     * 新闻种类:关于我们
     */
    const ABOUTUS='2';
    /**
     * 新闻种类:导购信息
     */
    const GUIDE='3';

    /** 
     * 显示新闻种类<br/>
     * 1:商城公告-notice<br/>
     * 2:关于我们-aboutus<br/>
     * 3:导购信息-guide<br/>
     */
    public static function news_typeShow($news_type)
    {
       switch($news_type){ 
            case self::NOTICE:
                return "商城公告"; 
            case self::ABOUTUS:
                return "关于我们"; 
            case self::GUIDE:
                return "导购信息"; 
       }
       return "未知";
    }

    /** 
     * 根据新闻种类显示文字获取新闻种类<br/>
     * @param mixed $news_typeShow 新闻种类显示文字
     */
    public static function news_typeByShow($news_typeShow)
    {
       switch($news_typeShow){ 
            case "商城公告":
                return self::NOTICE; 
            case "关于我们":
                return self::ABOUTUS; 
            case "导购信息":
                return self::GUIDE; 
       }
       return self::NOTICE;
    }

}
?>
