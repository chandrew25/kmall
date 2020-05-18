<?php
/**
 +---------------------------------------<br/>
 * 支付<br/>
 +---------------------------------------
 * @category yile
 * @package shop
 * @author skygreen skygreen2001@gmail.com
 */
class Payments extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $payments_id;
    /**
     * 订单号
     * @var int
     * @access public
     */
    public $order_id;    
    /**
     * 会员编号
     * @var string
     * @access public
     */
    public $member_id;      
    /**
     * 支付状态<br/>
     * ready:准备支付<br/>
     * progress:支付中<br/>
     * return:退款<br/>
     * succ:支付成功<br/>
     * failed:支付失败<br/>
     * cancel:取消支付<br/>
     * error:支付错误<br/>
     * invalid:非法支付<br/>
     * timeout:支付超时<br/>
     * 
     * @var enum
     * @access public
     */
    public $status;
    /**
     * 支付方式<br/>
     * 参考paymenttype的paymenttype_id<br/>
     * 
     * @var string
     * @access public
     */
    public $pay_type;
    /**
     * 收款账号
     * @var string
     * @access public
     */
    public $account;
    /**
     * 收款银行
     * @var string
     * @access public
     */
    public $bank;
    /**
     * 支付账号
     * @var string
     * @access public
     */
    public $pay_account;
    /**
     * 货币
     * @var string
     * @access public
     */
    public $currency;
    /**
     * 支付金额
     * @var float
     * @access public
     */
    public $money;
    /**
     * 支付的IP地址
     * @var string
     * @access public
     */
    public $ip;
    /**
     * 支付留言<br/>
     * 会员支付自动生成
     * @var string
     * @access public
     */
    public $intro;
    /**
     * 生成时间
     * @var int
     * @access public
     */
    public $t_begin;
    /**
     * 支付完成时间
     * @var int
     * @access public
     */
    public $t_end;
    //</editor-fold>

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "member"=>"Member",
        "order"=>"Order",
        "paymenttype"=>"Paymenttype"
    );

    /** 
     * 显示支付状态<br/>
     * ready:准备支付<br/>
     * progress:支付中<br/>
     * return:退款<br/>
     * succ:支付成功<br/>
     * failed:支付失败<br/>
     * cancel:取消支付<br/>
     * error:支付错误<br/>
     * invalid:非法支付<br/>
     * timeout:支付超时<br/>
     * <br/>
     */
    public function getStatusShow()
    {
        return self::statusShow($this->status);
    }

    /** 
     * 显示支付状态<br/>
     * ready:准备支付<br/>
     * progress:支付中<br/>
     * return:退款<br/>
     * succ:支付成功<br/>
     * failed:支付失败<br/>
     * cancel:取消支付<br/>
     * error:支付错误<br/>
     * invalid:非法支付<br/>
     * timeout:支付超时<br/>
     * <br/>
     */
    public static function statusShow($status)
    {
        return EnumPaymentsStatus::statusShow($status);
    }
}
?>