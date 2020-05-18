<?php
/**
 +---------------------------------------<br/>
 * 优惠规则作用优惠券表<br/>
 +---------------------------------------
 * @category kmall
 * @package preferentialrule
 * @author skygreen skygreen2001@gmail.com
 */
class Prefcoupon extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $prefcoupon_id;
    /**
     * 优惠规则标识
     * @var int
     * @access public
     */
    public $preferentialrule_id;
    /**
     * 优惠券标识
     * @var int
     * @access public
     */
    public $coupon_id;
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
