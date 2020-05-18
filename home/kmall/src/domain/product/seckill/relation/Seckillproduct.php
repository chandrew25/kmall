<?php
/**
 +---------------------------------------<br/>
 * 秒杀商品<br/>
 +---------------------------------------
 * @category kmall
 * @package product.seckill.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Seckillproduct extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $seckillproduct_id;
	/**
	 * 秒杀标识
	 * @var int
	 * @access public
	 */
	public $seckill_id;
	/**
	 * 秒杀商品
	 * @var int
	 * @access public
	 */
	public $product_id;
	/**
	 * 秒杀货品
	 * @var int
	 * @access public
	 */
	public $goods_id;
	/**
	 * 秒杀价
	 * @var float
	 * @access public
	 */
	public $price;
	/**
	 * 秒杀积分
	 * @var int
	 * @access public
	 */
	public $jifen;
	/**
	 * 秒杀库存
	 * @var int
	 * @access public
	 */
	public $sec_num;
	/**
	 * 秒杀限买数量
	 * 每个人限制购买数量，默认是1
	 * @var int
	 * @access public
	 */
	public $limit_num;
	/**
	 * 购买人数
	 * @var int
	 * @access public
	 */
	public $bought_num;
	//</editor-fold>

	public function getProduct(){
		$product = array();
		if($this->product_id){
			$product = Product::get_one("product_id=".$this->product_id);
		}
		return $product;
	}
}
?>
