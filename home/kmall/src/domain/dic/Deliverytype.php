<?php
/**
 +---------------------------------------<br/>
 * 配送方式
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Deliverytype extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var string
	 * @access public
	 */
	public $deliverytype_id;
	/**
	 * 付款方式代码
	 * @var string
	 * @access public
	 */
	public $deliverytype_code;
	/**
	 * 名称
	 * @var string
	 * @access public
	 */
	public $name;
	/**
	 * 描述
	 * @var string
	 * @access public
	 */
	public $description;
	/**
	 * 是否使用
	 * @var string
	 * @access public
	 */
	public $insure;
	/**
	 * 支持货到付款
	 * @var string
	 * @access public
	 */
	public $supportcod;
	/**
	 * 费用
	 * @var float
	 * @access public
	 */
	public $fee;
	/**
	 * 免费额度
	 * @var float
	 * @access public
	 */
	public $free_fee;
	/**
	 * 保价费用
	 * @var float
	 * @access public
	 */
	public $inassurance_fee;
	//</editor-fold>
}
?>