<?php
/**
 +---------------------------------------<br/>
 * 卡券类型关联货品表<br/>
 +---------------------------------------
 * @category kmall
 * @package voucher.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Vouchergoods extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $vouchergoods_id;
    /**
     * 卡券类型标识
     * @var int
     * @access public
     */
    public $voucher_id;
    /**
     * 关联货品标识
     * @var int
     * @access public
     */
    public $goods_id;
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
    static $belong_has_one=array(
        "goods"=>"Goods"
    );
}
?>
