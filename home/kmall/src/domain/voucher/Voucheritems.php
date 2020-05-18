<?php
/**
 +---------------------------------------<br/>
 * 卡券表<br/>
 +---------------------------------------
 * @category kmall
 * @package voucher
 * @author skygreen skygreen2001@gmail.com
 */
class Voucheritems extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $voucheritems_id;
    /**
     * 卡券类型标识
     * @var int
     * @access public
     */
    public $voucher_id;
    /**
     * 卡券号码
     * @var string
     * @access public
     */
    public $vi_key;
    /**
     * 卡券密码
     * @var string
     * @access public
     */
    public $vi_cipher;
    /**
     * 是否兑换
     * @var string
     * @access public
     */
    public $isExchange;
    /**
     * 排序
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>
    static $belong_has_one=array(
        "voucher"=>"Voucher"
    );
}
?>