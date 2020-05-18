<?php
/**
 +---------------------------------------<br/>
 * 顾客留言<br/>
 +---------------------------------------
 * @category yile
 * @package shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Consult extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 客户咨询编号
	 * @var int
	 * @access public
	 */
	public $consult_id; 
	/**
	 * 订单编号<br/>
	 * 允许为空。<br/>
	 * 即客户咨询，不针对具体订单
	 * @var int
	 * @access public
	 */
	public $order_id;
	/**
	 * 用户名
	 * @var string
	 * @access public
	 */
	public $member_id;
	/**
	 * 标题
	 * @var string
	 * @access public
	 */
	public $title;
	/**
	 * 评论
	 * @var string
	 * @access public
	 */
	public $comments;
	/**
	 * 答复
	 * @var string
	 * @access public
	 */
	public $reply;
	//</editor-fold>

	/**
	 * 从属一对一关系
	 */
	static $belong_has_one=array(
		"app"=>"App",
		"order"=>"Order"
	);
}
?>