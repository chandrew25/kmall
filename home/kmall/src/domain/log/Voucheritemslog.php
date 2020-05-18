<?php
/**
 +---------------------------------------<br/>
 * 卡券兑换日志表<br/>
 * <br/>
 +---------------------------------------
 * @category kmall
 * @package log
 * @author skygreen skygreen2001@gmail.com
 */
class Voucheritemslog extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $voucheritemslog_id;
    /**
     * 卡券类型标识
     * @var int
     * @access public
     */
    public $voucher_id;
    /**
     * 卡券标识
     * @var int
     * @access public
     */
    public $voucheritems_id;
    /**
     * 订单标识
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 姓名
     * @var string
     * @access public
     */
    public $username;
    /**
     * 手机号码
     * @var string
     * @access public
     */
    public $phone;
    /**
     * 排序<br/>
     * 
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>
    static $belong_has_one=array(
        "voucher"=>"Voucher",
        "voucheritems"=>"Voucheritems",
        "order"=>"Order"
    );
}
?>
