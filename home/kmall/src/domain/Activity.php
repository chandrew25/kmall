<?php
/**
 +---------------------------------------<br/>
 * 活动表<br/>
 +---------------------------------------
 * @category kmall
 * @package
 * @author skygreen skygreen2001@gmail.com
 */
class Activity extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $activity_id;
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
	 * 链接
	 * @var string
	 * @access public
	 */
	public $url;
	//</editor-fold>
	/**
	 * 活动说明
	 * @var string
	 * @access public
	 */
	public $intro;
	//</editor-fold>

	public function getProduct(){
		$activity = array();
		if ($this->activity_id) {
			$activity = sqlExecute("SELECT p.*,b.brand_name from km_activity_re_activityproduct as a left join km_product as p on a.product_id = p.product_id left join km_brand as b on p.brand_id=b.brand_id where p.isShow=1 and p.isUp=1  and a.activity_id=".$this->activity_id." limit 0,3");
		}
		return $activity;
	}

	/**
	 * 一对多关系
	 */
	static $has_many=array(
		"activityProducts"=>"ActivityProduct"
	);

	/**
	 * 多对多关系
	 */
	static $many_many=array(
		"products"=>"Product"
	);

}
?>
