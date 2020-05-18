<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:配送状态  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumShipStatus extends Enum
{
    /**
     * 配送状态:未发货
     */
    const UNDISPATCH='0';
    /**
     * 配送状态:已发货
     */
    const DISPATCH='1';
    /**
     * 配送状态:部分发货
     */
    const DISPATCHPART='2';
    /**
     * 配送状态:部分退货
     */
    const RETURNEDPART='3';
    /**
     * 配送状态:已退货
     */
    const RETURNED='4';
    /**
     * 配送状态:已签收
     */
    const SIGNED='5';
    /**
     * 配送状态:商品出库
     */
    const OUTBOUND='6';
    /**
     * 物流状态:申请退货
     */
    const APPLY='7';

    /**
     * 显示配送状态<br/>
     * 0:未发货-undispatch<br/>
     * 1:已发货-dispatch<br/>
     * 2:部分发货-dispatchpart<br/>
     * 3:部分退货-returnedpart<br/>
     * 4:已退货-returned<br/>
     * 5:已签收-signed<br/>
     * 6:商品出库-outbound<br/>
     * 7:申请退货-apply<br/>
     */
    public static function ship_statusShow($ship_status)
    {
       switch($ship_status){
            case self::UNDISPATCH:
                return "未发货";
            case self::DISPATCH:
                return "已发货";
            case self::DISPATCHPART:
                return "部分发货";
            case self::RETURNEDPART:
                return "部分退货";
            case self::RETURNED:
                return "已退货";
            case self::SIGNED:
                return "已签收";
            case self::OUTBOUND:
                return "商品出库";
            case self::APPLY:
                return "申请退货";
       }
       return "未知";
    }

    /**
     * 根据配送状态显示文字获取配送状态<br/>
     * @param mixed $ship_statusShow 配送状态显示文字
     */
    public static function ship_statusByShow($ship_statusShow)
    {
       switch($ship_statusShow){
            case "未发货":
                return self::UNDISPATCH;
            case "已发货":
                return self::DISPATCH;
            case "部分发货":
                return self::DISPATCHPART;
            case "部分退货":
                return self::RETURNEDPART;
            case "已退货":
                return self::RETURNED;
            case "已签收":
                return self::SIGNED;
            case "商品出库":
                return self::OUTBOUND;
            case "申请退货":
                return self::APPLY;
       }
       return self::UNDISPATCH;
    }

    /**
     * 通过枚举值获取枚举键定义<br/>
     */
    public static function ship_statusEnumKey($ship_status)
    {
        switch($ship_status){
            case '0':
                return "UNDISPATCH";
            case '1':
                return "DISPATCH";
            case '2':
                return "DISPATCHPART";
            case '3':
                return "RETURNEDPART";
            case '4':
                return "RETURNED";
            case '5':
                return "SIGNED";
            case '6':
                return "OUTBOUND";
            case '7':
                return "APPLY";
        }
        return "UNDISPATCH";
    }
}
?>
