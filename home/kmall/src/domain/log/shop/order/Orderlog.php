<?php
/**
 +---------------------------------------<br/>
 * 订单日志<br/>
 +---------------------------------------
 * @category kmall
 * @package log.shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Orderlog extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $orderlog_id;
    /**
     * 订单编号
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 订单号<br/>
     * 发货时为发货单号，退货时为退货单号
     * @var string
     * @access public
     */
    public $order_no;
    /**
     * 物流单号
     * @var string
     * @access public
     */
    public $delivery_no;
    /**
     * 经办人标识
     * @var int
     * @access public
     */
    public $admin_id;
    /**
     * 经办人
     * @var string
     * @access public
     */
    public $operater;
    /**
     * 订单行为<br/>
     * 0:创建-create<br/>
     * 1:审核-audit<br/>
     * 2:确认-confirm<br/>
     * 3:生效-active<br/>
     * 4:发货-send<br/>
     * 5:收货-receive<br/>
     * 6:付款-topay<br/>
     * 7:收款-pay<br/>
     * 8:完成-finish<br/>
     * 9:无效-dead<br/>
     *
     * @var enum
     * @access public
     */
    public $orderAction;
    /**
     * 结果<br/>
     * succ:成功<br/>
     * proc:处理中<br/>
     * fail:失败
     * @var enum
     * @access public
     */
    public $result;
    /**
     * 备注说明<br/>
     * 【示例如下】:<br/>
     * 1.菲彼生活发货<br/>
     * 2.会员收货<br/>
     * 3.会员退货<br/>
     * 4.网店管家发货通知<br/>
     * 5.支付宝付款<br/>
     * @var string
     * @access public
     */
    public $intro;
    /**
     * 是否首次订购
     * @var string
     * @access public
     */
    public $isFirstOrder;
    //</editor-fold>
    /**
     * 规格说明
     * 表中不存在的默认列定义:updateTime
     * @var mixed
     */
    public $field_spec=array(
        EnumDataSpec::REMOVE=>array(
            'updateTime'
        )
    );

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "order"=>"Order",
        "admin"=>"Admin",
        "order"=>"Order"
    );

    /**
     * 显示订单行为<br/>
     * 0:创建-create<br/>
     * 1:审核-audit<br/>
     * 2:确认-confirm<br/>
     * 3:生效-active<br/>
     * 4:发货-send<br/>
     * 5:收货-receive<br/>
     * 6:付款-topay<br/>
     * 7:收款-pay<br/>
     * 8:完成-finish<br/>
     * 9:无效-dead<br/>
     * <br/>
     */
    public function getOrderActionShow()
    {
        return self::orderActionShow($this->orderAction);
    }

    /**
     * 显示结果<br/>
     * succ:成功<br/>
     * proc:处理中<br/>
     * fail:失败<br/>
     */
    public function getResultShow()
    {
        return self::resultShow($this->result);
    }

    /**
     * 显示订单行为<br/>
     * 0:创建-create<br/>
     * 1:审核-audit<br/>
     * 2:确认-confirm<br/>
     * 3:生效-active<br/>
     * 4:发货-send<br/>
     * 5:收货-receive<br/>
     * 6:付款-topay<br/>
     * 7:收款-pay<br/>
     * 8:完成-finish<br/>
     * 9:无效-dead<br/>
     * <br/>
     */
    public static function orderActionShow($orderAction)
    {
        return EnumOrderAction::orderActionShow($orderAction);
    }

    /**
     * 显示结果<br/>
     * succ:成功<br/>
     * proc:处理中<br/>
     * fail:失败<br/>
     */
    public static function resultShow($result)
    {
        return EnumResult::resultShow($result);
    }

}
?>
