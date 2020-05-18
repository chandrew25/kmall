<?php
/**
 +---------------------------------------<br/>
 * 分销平台用户财富日志<br/>
 +---------------------------------------
 * @category kmall
 * @package log.member
 * @author skygreen skygreen2001@gmail.com
 */
class Wealthlog extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $wealthlog_id;
	/**
	 * 会员标识
	 * @var int
	 * @access public
	 */
	public $member_id;
	/**
	 * 积分原值
	 * @var int
	 * @access public
	 */
	public $wealthoriginal;
	/**
	 * 积分增加值
	 * @var int
	 * @access public
	 */
	public $wealthraise;
	/**
	 * 积分减少值
	 * @var int
	 * @access public
	 */
	public $wealthreduce;
	/**
	 * 积分变动描述
	 * @var string
	 * @access public
	 */
	public $intro;
	//</editor-fold>

}
?>