<?php
/**
 +---------------------------------------<br/>
 * 订购商品<br/>
 +---------------------------------------
 * @category yile
 * @package shop.order.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Orderproducts extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 
	 * @var int
	 * @access public
	 */
	public $orderproducts_id;
	/**
	 * 会员编号
	 * @var string
	 * @access public
	 */
	public $member_id;  
	/**
	 * 订单编号
	 * @var int
	 * @access public
	 */
	public $order_id;
	/**
	 * 商品编号
	 * @var string
	 * @access public
	 */
	public $product_id;
	/**
	 * 商品唯一标识
	 * @var string
	 * @access public
	 */
	public $product_code;
	/**
	 * 商品名称
	 * @var string
	 * @access public
	 */
	public $product_name;
	/**
	 * 订购商品的链接<br/>
	 * 第三方提供或者自定义的显示页面的URL。
	 * @var string
	 * @access public
	 */
	public $url;
	/**
	 * 总价
	 * @var float
	 * @access public
	 */
	public $amount;
	/**
	 * 单价
	 * @var float
	 * @access public
	 */
	public $price;
	/**
	 * 实际购买价格
	 * @var float
	 * @access public
	 */
	public $real_price;
	/**
	 * 积分
	 * @var int
	 * @access public
	 */
	public $jifen;
	/**
	 * 数量
	 * @var string
	 * @access public
	 */
	public $nums;
	//</editor-fold>

	/**
	 * 从属一对一关系
	 */
	static $belong_has_one=array(
		"app"=>"App",
		"member"=>"Member",
		"order"=>"Order",
		"product"=>"Product"
	);
}
?>