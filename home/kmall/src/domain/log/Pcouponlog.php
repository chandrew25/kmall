<?php
/**
 +---------------------------------------<br/>
 * 促销生成优惠券记录表<br/>
 * <br/>
 +---------------------------------------
 * @category kmall
 * @package log
 * @author skygreen skygreen2001@gmail.com
 */
class Pcouponlog extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $pcouponlog_id;
    /**
     * 促销活动标识
     * @var int
     * @access public
     */
    public $promotion_id;
    /**
     * 优惠券标识
     * @var int
     * @access public
     */
    public $coupon_id;
    /**
     * 优惠券名称
     * @var string
     * @access public
     */
    public $coupon_name;
    /**
     * 优惠券数量
     * @var int
     * @access public
     */
    public $coupon_num;
    /**
     * 排序<br/>
     * 
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>

}
?>
