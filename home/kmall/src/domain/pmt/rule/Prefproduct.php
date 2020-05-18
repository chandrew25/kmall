<?php
/**
 +---------------------------------------<br/>
 * 优惠规则作用商品表<br/>
 +---------------------------------------
 * @category kmall
 * @package preferentialrule
 * @author skygreen skygreen2001@gmail.com
 */
class Prefproduct extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $prefproduct_id;
    /**
     * 优惠规则标识
     * @var int
     * @access public
     */
    public $preferentialrule_id;
    /**
     * 商品标识
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 是否有效
     * @var string
     * @access public
     */
    public $isValid;
    /**
     * 排序
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>

}
?>
