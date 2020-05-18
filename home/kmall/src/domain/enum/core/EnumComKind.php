<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:公司性质  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumComKind extends Enum
{
    /**
     * 公司性质:政府机关/事业单
     */
    const GOVCAREER='1';
    /**
     * 公司性质:国营
     */
    const STATERUN='2';
    /**
     * 公司性质:私营
     */
    const PRIVATERUN='3';
    /**
     * 公司性质:中外合资
     */
    const JOINTVENTURE='4';
    /**
     * 公司性质:外资
     */
    const FOREIGNVENTURE='5';
    /**
     * 公司性质:其他
     */
    const OTHERS='6';

    /**
     * 显示公司性质<br/>
     * 1:政府机关/事业单-govcareer<br/>
     * 2:国营-staterun<br/>
     * 3:私营-privaterun<br/>
     * 4:中外合资-jointventure<br/>
     * 5:外资-foreignventure<br/>
     * 6:其他-others<br/>
     * <br/>
     */
    public static function com_kindShow($com_kind)
    {
       switch($com_kind){
            case self::GOVCAREER:
                return "政府机关/事业单";
            case self::STATERUN:
                return "国营";
            case self::PRIVATERUN:
                return "私营";
            case self::JOINTVENTURE:
                return "中外合资";
            case self::FOREIGNVENTURE:
                return "外资";
            case self::OTHERS:
                return "其他";
       }
       return "未知";
    }

    /**
     * 根据公司性质显示文字获取公司性质<br/>
     * @param mixed $com_kindShow 公司性质显示文字
     */
    public static function com_kindByShow($com_kindShow)
    {
       switch($com_kindShow){
            case "政府机关/事业单":
                return self::GOVCAREER;
            case "国营":
                return self::STATERUN;
            case "私营":
                return self::PRIVATERUN;
            case "中外合资":
                return self::JOINTVENTURE;
            case "外资":
                return self::FOREIGNVENTURE;
            case "其他":
                return self::OTHERS;
       }
       return self::GOVCAREER;
    }

}
?>
