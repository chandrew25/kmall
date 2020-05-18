<?php
/**
 +---------------------------------------<br/>
 * 会员最近浏览过的商品<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Seeproduct extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $seeproduct_id;
    /**
     * 会员标识
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 商品标识
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 商品名称
     * @var string
     * @access public
     */
    public $product_name;
    /**
     * 商品标识
     * @var string
     * @access public
     */
    public $product_ico;
    /**
     * 价格
     * @var float
     * @access public
     */
    public $price;
    /**
     * 量词
     * @var string
     * @access public
     */
    public $unit;
    //</editor-fold>

    /**
     * 处理商品名称的长度
     * 超过指定长度截取
     * @var int
     * @access public
     */
    public function getProductNameShow(){
    	$new_name = $this->product_name;
    	if( UtilString::strlenChinaese($this->product_name) > 24 ){
    		//若标题名称字数超过24个，获取前23个，并在后面加上省略号
    		$new_name = UtilString::word_trim( $this->product_name , 23 , TRUE );
    	}
      	return $new_name;
    }
}
?>