<?php
/**
 +---------------------------------------<br/>
 * 退款评论<br/>
 +---------------------------------------
 * @category kmall
 * @package shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Refundcomment extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $refundcomment_id;
    /**
     * 会员标识
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 订单号
     * @var string
     * @access public
     */
    public $order_code;
    /**
     * 申请人姓名
     * @var string
     * @access public
     */
    public $name;
    /**
     * 申请原因
     * @var string
     * @access public
     */
    public $comment;
    /**
     * 备注
     * @var string
     * @access public
     */
    public $remarks;
    //</editor-fold>
}
?>
