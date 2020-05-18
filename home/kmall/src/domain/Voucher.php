<?php
/**
 +---------------------------------------<br/>
 * 卡券类型表<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Voucher extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $voucher_id;
    /**
     * 卡券类型名称
     * @var string
     * @access public
     */
    public $voucher_name;
    /**
     * 卡券总数量
     * @var int
     * @access public
     */
    public $voucher_num;
    /**
     * 开始时间
     * @var int
     * @access public
     */
    public $begin_time;
    /**
     * 结束时间
     * @var int
     * @access public
     */
    public $end_time;
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
    static $has_many=array(
        "vouchergoods"=>"Vouchergoods"
    );
}
?>
