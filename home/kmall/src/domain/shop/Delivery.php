<?php
/**
 +---------------------------------------<br/>
 * 菲彼生活物流<br/>
 +---------------------------------------
 * @category yile
 * @package shop
 * @author skygreen skygreen2001@gmail.com
 */
class Delivery extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 物流单号
	 * @var int
	 * @access public
	 */
	public $delivery_id;
	/**
	 * 物流单号
	 * @var string
	 * @access public
	 */
	public $delivery_no;
	/**
	 * 订单编号
	 * @var int
	 * @access public
	 */
	public $order_id;
	/**
	 * 会员编号
	 * @var int
	 * @access public
	 */
	public $member_id;
	/**
	 * 发送状态<br/>
	 * ready:准备发送<br/>
	 * progress:发送中<br/>
	 * return:退货<br/>
	 * succ:发送成功<br/>
	 * failed:发送失败<br/>
	 * cancel:取消发送<br/>
	 * lost:丢失<br/>
	 * timeout:发送超时
	 * @var enum
	 * @access public
	 */
	public $status;
	/**
	 * 快递类型<br/>
	 * return:返送<br/>
	 * delivery:发送
	 * @var enum
	 * @access public
	 */
	public $type;
	/**
	 * 快递公司
	 * @var string
	 * @access public
	 */
	public $delivery;
	/**
	 * 收货人
	 * @var string
	 * @access public
	 */
	public $ship_name;
    /**
     * 送货时间
     * @var string
     * @access public
     */
    public $ship_time;
	/**
	 * 收货地区
	 * @var string
	 * @access public
	 */
	public $ship_area;
	/**
	 * 收货地址
	 * @var string
	 * @access public
	 */
	public $ship_addr;
	/**
	 * 邮编
	 * @var string
	 * @access public
	 */
	public $ship_zip;
	/**
	 * 收货人电话
	 * @var string
	 * @access public
	 */
	public $ship_tel;
	/**
	 * 收货人手机
	 * @var string
	 * @access public
	 */
	public $ship_mobile;
	/**
	 * 备注
	 * @var string
	 * @access public
	 */
	public $memo;
	/**
	 * 生成时间
	 * @var int
	 * @access public
	 */
	public $committime;
	//</editor-fold>
	/**
	 * 规格说明
	 * 表中不存在的默认列定义:commitTime
	 * @var mixed
	 */
	public $field_spec=array(
		EnumDataSpec::REMOVE=>array(
			'commitTime'
		)
	);

	/**
	 * 从属一对一关系
	 */
	static $belong_has_one=array(
		"app"=>"App",
		"member"=>"Member",
		"order"=>"Order"
	);

	/**
	 * 显示发送状态<br/>
	 * ready:准备发送<br/>
	 * progress:发送中<br/>
	 * return:退货<br/>
	 * succ:发送成功<br/>
	 * failed:发送失败<br/>
	 * cancel:取消发送<br/>
	 * lost:丢失<br/>
	 * timeout:发送超时<br/>
	 */
	public function getStatusShow()
	{
		return self::statusShow($this->status);
	}

	/**
	 * 显示快递类型<br/>
	 * return:返送<br/>
	 * delivery:发送<br/>
	 */
	public function getTypeShow()
	{
		return self::typeShow($this->type);
	}

	/**
	 * 显示发送状态<br/>
	 * ready:准备发送<br/>
	 * progress:发送中<br/>
	 * return:退货<br/>
	 * succ:发送成功<br/>
	 * failed:发送失败<br/>
	 * cancel:取消发送<br/>
	 * lost:丢失<br/>
	 * timeout:发送超时<br/>
	 */
	public static function statusShow($status)
	{
		return EnumDeliveryStatus::statusShow($status);
	}

	/**
	 * 显示快递类型<br/>
	 * return:返送<br/>
	 * delivery:发送<br/>
	 */
	public static function typeShow($type)
	{
		return EnumDeliveryType::typeShow($type);
	}
}
?>
