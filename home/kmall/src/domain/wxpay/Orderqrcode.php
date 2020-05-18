<?php
/**
 +---------------------------------------<br/>
 * 微信支付二维码<br/>
 +---------------------------------------
 * @category kmall
 * @package wxpay
 * @author skygreen skygreen2001@gmail.com
 */
class Orderqrcode extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 
	 * @var int
	 * @access public
	 */
	public $orderqrcode_id;
	/**
	 * 订单ID
	 * @var int
	 * @access public
	 */
	public $order_id;
	/**
	 * 微信支付订单号
	 * @var string
	 * @access public
	 */
	public $out_trade_no;
	/**
	 * 支付金额
	 * @var int
	 * @access public
	 */
	public $total_fee;
	/**
	 * 支付二维码
	 * @var string
	 * @access public
	 */
	public $url;
	//</editor-fold>

}
?>