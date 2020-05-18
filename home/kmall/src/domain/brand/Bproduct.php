<?php
/**
 +---------------------------------------<br/>
 * 品牌推荐商品<br/>
 * 每个品牌两个商品<br/>
 +---------------------------------------
 * @category kmall
 * @package brand
 * @author skygreen skygreen2001@gmail.com
 */
class Bproduct extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     *
     * @var int
     * @access public
     */
    public $bproduct_id;
    /**
     * 品牌商品分类关系标识
     * @var int
     * @access public
     */
    public $brandptype_id;
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
     * 商品价格
     * @var float
     * @access public
     */
    public $product_price;
    /**
     * 商品图标
     * @var string
     * @access public
     */
    public $ico;
    //</editor-fold>
}
?>
