<?php
/**
 +---------------------------------------<br/>
 * 国家<br/>
 +---------------------------------------
 * @category kmall
 * @package
 * @author skygreen skygreen2001@gmail.com
 */
class Country extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $country_id;
	/**
	 * 国家名称
	 * @var string
	 * @access public
	 */
	public $name;
	/**
	 * 缩略图
	 * @var string
	 * @access public
	 */
	public $thumbnail;
	/**
	 * 国旗图片
	 * @var string
	 * @access public
	 */
	public $flagimage;
	/**
	 * 风景图片
	 * @var string
	 * @access public
	 */
	public $images;
	/**
	 * 链接地址
	 * @var string
	 * @access public
	 */
	public $url;
	/**
	 * 是否已开放：1开放 0 未开放
	 * @var string
	 * @access public
	 */
	public $isShow;
	/**
	 * 排序数值越大越排前
	 * @var int
	 * @access public
	 */
	public $sort_order;
	/**
	 * 介绍
	 * @var string
	 * @access public
	 */
	public $introduction;
	//</editor-fold>

	public function getProduct(){
		$product = array();
		if ($this->country_id) {
			$product = Product::get("isShow=1 and isUp=1 and country_id=".$this->country_id,'sort_order desc');
		}
		return $product;
	}

	/**
	 * 一对多关系
	 */
	static $has_many=array(
		"products"=>"Product"
	);
}
?>
