<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:评价等级  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumCommentRank extends Enum
{
    /**
     * 评价等级:差评
     */
    const BAD='1';
    /**
     * 评价等级:中评
     */
    const MEDIUM='2';
    /**
     * 评价等级:好评
     */
    const GOOD='3';
    /**
     * 评价等级:默认
     */
    const DEFAULTS='4';

    /**
     * 显示评价等级<br/>
     * 1:差评-bad<br/>
     * 2:中评-medium<br/>
     * 3:好评-good<br/>
     * 4:默认-defaults<br/>
     * <br/>
     */
    public static function comment_rankShow($comment_rank)
    {
       switch($comment_rank){
            case self::BAD:
                return "差评";
            case self::MEDIUM:
                return "中评";
            case self::GOOD:
                return "好评";
            case self::DEFAULTS:
                return "默认";
       }
       return "未知";
    }

    /**
     * 根据评价等级显示文字获取评价等级<br/>
     * @param mixed $comment_rankShow 评价等级显示文字
     */
    public static function comment_rankByShow($comment_rankShow)
    {
       switch($comment_rankShow){
            case "差评":
                return self::BAD;
            case "中评":
                return self::MEDIUM;
            case "好评":
                return self::GOOD;
            case "默认":
                return self::DEFAULTS;
       }
       return self::BAD;
    }

}
?>
