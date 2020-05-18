<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:订单工作流类型  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumWorkfloworderType extends Enum
{
    /**
     * 订单工作流类型:采购审核
     */
    const PURCHASER='1';
    /**
     * 订单工作流类型:客服确认
     */
    const KEFU='2';
    /**
     * 订单工作流类型:已发货
     */
    const SEND='3';
    /**
     * 订单工作流类型:已收货
     */
    const RECEIVE='4';
    /**
     * 订单工作流类型:财务结算
     */
    const ACCOUT='5';

    /** 
     * 显示订单工作流类型<br/>
     * 1:采购审核-purchaser<br/>
     * 2:客服确认-kefu<br/>
     * 3:已发货-send<br/>
     * 4:已收货-receive<br/>
     * 5:财务结算-accout<br/>
     */
    public static function typeShow($type)
    {
       switch($type){ 
            case self::PURCHASER:
                return "采购审核"; 
            case self::KEFU:
                return "客服确认"; 
            case self::SEND:
                return "已发货"; 
            case self::RECEIVE:
                return "已收货"; 
            case self::ACCOUT:
                return "财务结算"; 
       }
       return "未知";
    }

    /** 
     * 根据订单工作流类型显示文字获取订单工作流类型<br/>
     * @param mixed $typeShow 订单工作流类型显示文字
     */
    public static function typeByShow($typeShow)
    {
       switch($typeShow){ 
            case "采购审核":
                return self::PURCHASER; 
            case "客服确认":
                return self::KEFU; 
            case "已发货":
                return self::SEND; 
            case "已收货":
                return self::RECEIVE; 
            case "财务结算":
                return self::ACCOUT; 
       }
       return self::PURCHASER;
    }

}
?>
