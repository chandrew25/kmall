<?php
/**
 +---------------------------------------<br/>
 * 商品图片<br/>
 +---------------------------------------
 * @category kmall
 * @package product
 * @author skygreen skygreen2001@gmail.com
 */
class Seriesimg extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $seriesimg_id;
	/**
	 * 商品编号<br/>
	 * 外键
	 * @var int
	 * @access public
	 */
	public $product_id;
	/**
	 * 缩略图
	 * @var string
	 * @access public
	 */
	public $ico;
	/**
	 * 图片
	 * @var string
	 * @access public
	 */
	public $img;
	/**
	 * 超大图
	 * @var string
	 * @access public
	 */
	public $image_large;
	/**
	 * 是否显示<br/>
	 * 默认为'1'
	 * @var string
	 * @access public
	 */
	public $isShow;
	/**
	 * 排序
	 * @var int
	 * @access public
	 */
	public $sort_order;
	//</editor-fold>
}
?>