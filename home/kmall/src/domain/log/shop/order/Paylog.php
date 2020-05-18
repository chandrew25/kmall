<?php
/**
 +---------------------------------------<br/>
 * 收退款记录<br/>
 +---------------------------------------
 * @category yile
 * @package log.shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Paylog extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $paylog_id;
	/**
	 * 订单编号
	 * @var int
	 * @access public
	 */
	public $order_id;
	/**
	 * 订单号
	 * @var string
	 * @access public
	 */
	public $order_no;
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
	 * 支付方式<br/>
	 * 收款为支付方式，退款为退款方式
	 * @var string
	 * @access public
	 */
	public $pay_type;
	/**
	 * 支付金额<br/>
	 * 收款为支付金额，退款为退款金额
	 * @var float
	 * @access public
	 */
	public $amount;
	/**
	 * 收退款行为<br/>
	 * 0:未收款-unpay<br/>
	 * 1:已收款-paid<br/>
	 * 2:已退款-return<br/>
	 *
	 * @var enum
	 * @access public
	 */
	public $payAction;
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
	 * 1.菲彼生活收款<br/>
	 * 2.菲彼生活退款
	 * @var string
	 * @access public
	 */
	public $intro;
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
	 * 显示收退款行为<br/>
	 * 0:未收款-unpay<br/>
	 * 1:已收款-paid<br/>
	 * 2:已退款-return<br/>
	 * <br/>
	 */
	public function getPayActionShow()
	{
		return self::payActionShow($this->payAction);
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
	 * 显示收退款行为<br/>
	 * 0:未收款-unpay<br/>
	 * 1:已收款-paid<br/>
	 * 2:已退款-return<br/>
	 * <br/>
	 */
	public static function payActionShow($payAction)
	{
		return EnumPayAction::payActionShow($payAction);
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
