<?php
/**
 +---------------------------------------<br/>
 * 订单发票<br/>
 +---------------------------------------
 * @category kmall
 * @package shop
 * @author skygreen skygreen2001@gmail.com
 */
class Invoice extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $invoice_id;
    /**
     * 会员标识
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 订单标识
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 发票号
     * @var string
     * @access public
     */
    public $invoice_code;
    /**
     * 发票状态<br/>
     * 1：待审核-waitaudit<br/>
     * 2：有效-effective<br/>
     * 3：无效-invalid<br/>
     *
     * @var enum
     * @access public
     */
    public $invoice_state;
    /**
     * 开票方
     * @var string
     * @access public
     */
    public $invoice_party;
    /**
     * 开票金额
     * @var float
     * @access public
     */
    public $price;
    /**
     * 发票类型<br/>
     * 1：普通发票-cominvoice<br/>
     * 2：增值税发票-taxinvoice
     * @var enum
     * @access public
     */
    public $type;
    /**
     * 发票抬头<br/>
     * 1：个人-owners<br/>
     * 2：单位-enterprises
     * @var enum
     * @access public
     */
    public $type1_header;
    /**
     * 个人单位名称
     * @var string
     * @access public
     */
    public $type1_name;
    /**
     * 发票内容
     * @var string
     * @access public
     */
    public $content;
    /**
     * 单位名称
     * @var string
     * @access public
     */
    public $company;
    /**
     * 纳税人识别号
     * @var string
     * @access public
     */
    public $taxpayer;
    /**
     * 注册地址
     * @var string
     * @access public
     */
    public $reg_address;
    /**
     * 注册电话
     * @var string
     * @access public
     */
    public $reg_tel;
    /**
     * 开户银行
     * @var string
     * @access public
     */
    public $bank;
    /**
     * 银行账号
     * @var string
     * @access public
     */
    public $bank_account;
    /**
     * 备注
     * @var string
     * @access public
     */
    public $memo;
    /**
     * 发票费用
     * @var float
     * @access public
     */
    public $fee;
    //</editor-fold>

    /**
     * 显示发票状态<br/>
     * 1：待审核-waitaudit<br/>
     * 2：有效-effective<br/>
     * 3：无效-invalid<br/>
     * <br/>
     */
    public function getInvoice_stateShow()
    {
        return self::invoice_stateShow($this->invoice_state);
    }

    /**
     * 显示发票类型<br/>
     * 1：普通发票-cominvoice<br/>
     * 2：增值税发票-taxinvoice<br/>
     */
    public function getTypeShow()
    {
        return self::typeShow($this->type);
    }

    /**
     * 显示发票抬头<br/>
     * 1：个人-owners<br/>
     * 2：单位-enterprises<br/>
     */
    public function getType1_headerShow()
    {
        return self::type1_headerShow($this->type1_header);
    }

    /**
     * 显示发票状态<br/>
     * 1：待审核-waitaudit<br/>
     * 2：有效-effective<br/>
     * 3：无效-invalid<br/>
     * <br/>
     */
    public static function invoice_stateShow($invoice_state)
    {
        return EnumInvoiceState::invoice_stateShow($invoice_state);
    }

    /**
     * 显示发票类型<br/>
     * 1：普通发票-cominvoice<br/>
     * 2：增值税发票-taxinvoice<br/>
     */
    public static function typeShow($type)
    {
        return EnumInvoiceType::typeShow($type);
    }

    /**
     * 显示发票抬头<br/>
     * 1：个人-owners<br/>
     * 2：单位-enterprises<br/>
     */
    public static function type1_headerShow($type1_header)
    {
        return EnumType1Header::type1_headerShow($type1_header);
    }
}
?>