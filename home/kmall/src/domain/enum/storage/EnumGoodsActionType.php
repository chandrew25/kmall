<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:行为  <br/>
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumGoodsActionType extends Enum
{
    /**
     * 行为:新产品入库
     */
    const NEWIN='0';
    /**
     * 行为:已有产品入库
     */
    const HAVEIN='1';
    /**
     * 行为:出库
     */
    const OUT='2';
    /**
     * 行为:网店管家[盘点]
     */
    const WDGJ_PD='3';

    /**
     * 显示行为<br/>
     * 0:新产品入库-newin<br/>
     * 1:已有产品入库-havein<br/>
     * 2:出库-out<br/>
     */
    public static function goodsActionTypeShow($goodsActionType)
    {
       switch($goodsActionType){

            case self::NEWIN:
                return "新商品入库";
            case self::WDGJ_PD:
                return "网店管家:盘点";
            case self::HAVEIN:
                return "已有商品入库";
            case self::OUT:
                return "出库";
       }
       return "未知";
    }

    /**
     * 根据行为显示文字获取行为<br/>
     * @param mixed $goodsActionTypeShow 行为显示文字
     */
    public static function goodsActionTypeByShow($goodsActionTypeShow)
    {
       switch($goodsActionTypeShow){
            case "新商品入库":
                return self::NEWIN;
            case "网店管家:盘点":
                return self::WDGJ_PD;
            case "已有商品入库":
                return self::HAVEIN;
            case "出库":
                return self::OUT;
       }
       return self::NEWIN;
    }

}
?>
