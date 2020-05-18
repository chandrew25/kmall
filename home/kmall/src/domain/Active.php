<?php
/**
 +---------------------------------------<br/>
 * 活动表<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Active extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 
	 * @var int
	 * @access public
	 */
	public $id;
	/**
	 * 活动名称
	 * @var string
	 * @access public
	 */
	public $name;
	/**
	 * 活动图片
	 * @var string
	 * @access public
	 */
	public $images;
	/**
	 * 开始时间
	 * @var int
	 * @access public
	 */
	public $start_time;
	/**
	 * 结束时间
	 * @var int
	 * @access public
	 */
	public $end_time;
	/**
	 * 活动商品ID：ID之间以,分割
	 * @var string
	 * @access public
	 */
	public $product_ids;
	/**
	 * 活动说明
	 * @var string
	 * @access public
	 */
	public $explain;
	//</editor-fold>
	/**
	 * 规格说明
	 * 表中不存在的默认列定义:commitTime,updateTime
	 * @var mixed
	 */
	public $field_spec=array(
		EnumDataSpec::REMOVE=>array(
			'commitTime',
			'updateTime'
		)
	);

}
?>