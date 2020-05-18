<?php
/**
 +---------------------------------------<br/>
 * 网店管家订单下载<br/>
 +---------------------------------------
 * @category kmall
 * @package sync.wdgj
 * @author skygreen skygreen2001@gmail.com
 */
class Wsyncorder extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 网店管家同步订单标示
     * @var int
     * @access public
     */
    public $wsyncorder_id;
    /**
     * 订单标识
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 订单号
     * @var string
     * @access public
     */
    public $order_no;
    /**
     * 是否已经同步
     * @var string
     * @access public
     */
    public $isSync;
    //</editor-fold>

}
?>