<?php
/**
 +---------------------------------------<br/>
 * 收发货记录<br/>
 +---------------------------------------
 * @category yile
 * @package log.shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Deliverylog extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $deliverylog_id;
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
	 * @var string
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
	 * 收发货行为<br/>
	 * 1:发货-send<br/>
	 * 2:收货-take<br/>
	 * 3:退货-return<br/>
	 *
	 * @var enum
	 * @access public
	 */
	public $deliveryAction;
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
	 * 3.会员退货
	 * @var string
	 * @access public
	 */
	public $intro;
    /**
     * 发货时间
     * @var string
     * @access public
     */
    public $ship_time;
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
		"app"=>"App",
		"order"=>"Order"
	);

	/**
	 * 显示收发货行为<br/>
	 * 1:发货-send<br/>
	 * 2:收货-take<br/>
	 * 3:退货-return<br/>
	 * <br/>
	 */
	public function getDeliveryActionShow()
	{
		return self::deliveryActionShow($this->deliveryAction);
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
	 * 显示收发货行为<br/>
	 * 1:发货-send<br/>
	 * 2:收货-take<br/>
	 * 3:退货-return<br/>
	 * <br/>
	 */
	public static function deliveryActionShow($deliveryAction)
	{
		return EnumDeliveryAction::deliveryActionShow($deliveryAction);
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
