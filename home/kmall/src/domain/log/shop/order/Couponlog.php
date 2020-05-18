<?php
/**
 +---------------------------------------<br/>
 * 优惠券使用记录表<br/>
 * <br/>
 +---------------------------------------
 * @category kmall
 * @package log.shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Couponlog extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $couponlog_id;
    /**
     * 订单标识
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 优惠券标识
     * @var int
     * @access public
     */
    public $coupon_id;
    /**
     * 优惠券号码
     * @var int
     * @access public
     */
    public $couponitems_key;
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