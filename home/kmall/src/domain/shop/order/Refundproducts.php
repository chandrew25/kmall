<?php
/**
 +---------------------------------------<br/>
 * 退款商品<br/>
 +---------------------------------------
 * @category kmall
 * @package shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Refundproducts extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $refundproducts_id;
    /**
     * 会员号
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 退款状态<br/>
     * 0:进行中-progress<br/>
     * 1:退款完成-finish<br/>
     * 2:取消退款-cancel<br/>
     *
     * @var enum
     * @access public
     */
    public $status;
    /**
     * 订单号
     * @var string
     * @access public
     */
    public $order_code;
    /**
     * 产品标识
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 产品数量
     * @var int
     * @access public
     */
    public $product_num;
    /**
     * 支付金额
     * @var float
     * @access public
     */
    public $pay;
    /**
     * 退款金额
     * @var float
     * @access public
     */
    public $refund;
    /**
     * 申请时间
     * @var int
     * @access public
     */
    public $refundTime;
    /**
     * 退款原因
     * @var string
     * @access public
     */
    public $intro;
    //</editor-fold>
    static $belong_has_one=array(
        "product"=>"Product"
    );
    /**
     * 显示退款状态<br/>
     * 0:进行中-progress<br/>
     * 1:退款完成-finish<br/>
     * 2:取消退款-cancel<br/>
     * <br/>
     */
    public function getStatusShow()
    {
        return self::statusShow($this->status);
    }

    /**
     * 显示退款状态<br/>
     * 0:进行中-progress<br/>
     * 1:退款完成-finish<br/>
     * 2:取消退款-cancel<br/>
     * <br/>
     */
    public static function statusShow($status)
    {
        return EnumRefundproductsStatus::statusShow($status);
    }
}
?>