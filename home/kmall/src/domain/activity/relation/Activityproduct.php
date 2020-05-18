<?php
/**
 +---------------------------------------<br/>
 * 活动拥有的商品<br/>
 +---------------------------------------
 * @category kmall
 * @package activity.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Activityproduct extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $activityproduct_id;
	/**
	 * 活动标识
	 * @var int
	 * @access public
	 */
	public $activity_id;
	/**
	 * 商品标识
	 * @var string
	 * @access public
	 */
	public $product_id;
	//</editor-fold>

}
?>