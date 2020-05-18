<?php
/**
 +---------------------------------------<br/>
 * 订单优惠记录表<br/>
 * <br/>
 +---------------------------------------
 * @category kmall
 * @package log.shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Promotionlog extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $promotionlog_id;
    /**
     * 订单标识
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 促销活动标识
     * @var int
     * @access public
     */
    public $promotion_id;
    /**
     * 促销活动名称
     * @var string
     * @access public
     */
    public $promotion_name;
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