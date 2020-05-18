<?php
/**
 +---------------------------------------<br/>
 * 合同<br/>
 +---------------------------------------
 * @category yile
 * @package supplier
 * @author skygreen skygreen2001@gmail.com
 */
class Contract extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $contract_id;
    /**
     * 合同号<br/>
     * 唯一标示合同的业务编号。
     * @var string
     * @access public
     */
    public $contract_no;
    /**
     * 合同名称
     * @var string
     * @access public
     */
    public $contract_name;
    /**
     * 供应商标识
     * @var int
     * @access public
     */
    public $supplier_id;
    /**
     * 公司名<br/>
     * 签订合同的供应商
     * @var string
     * @access public
     */
    public $company;
    /**
     * 合同状态<br/>
     * 0:未确认-UNCONFIRM<br/>
     * 1:执行中-PROCESS<br/>
     * 2:结束-END
     * @var enum
     * @access public
     */
    public $contract_status;
    /**
     * 合同签订时间
     * @var date
     * @access public
     */
    public $confirmTime;
    /**
     * 合同甲方<br/>
     * 签订合同的甲方  
     * @var string
     * @access public
     */
    public $f_party;
    /**
     * 合同乙方<br/>
     * 签订合同的乙方
     * @var string
     * @access public
     */
    public $s_party;
    /**
     * 经办人<br/>
     * 管理员的用户名
     * @var string
     * @access public
     */
    public $operator;
    /**
     * 签订合同的金额
     * @var int
     * @access public
     */
    public $amount;
    /**
     * 备注
     * @var string
     * @access public
     */
    public $terms;
    /**
     * 生效日期 <br/>
     * 合同的生效日期 
     * @var date
     * @access public
     */
    public $effective_date;
    /**
     * 到期日期
     * @var date
     * @access public
     */
    public $expire_date;
    //</editor-fold>

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "supplier"=>"Supplier"
    );

    /** 
     * 显示合同状态<br/>
     * 0:未确认-UNCONFIRM<br/>
     * 1:执行中-PROCESS<br/>
     * 2:结束-END<br/>
     */
    public function getContract_statusShow()
    {
        return self::contract_statusShow($this->contract_status);
    }

    /** 
     * 显示合同状态<br/>
     * 0:未确认-UNCONFIRM<br/>
     * 1:执行中-PROCESS<br/>
     * 2:结束-END<br/>
     */
    public static function contract_statusShow($contract_status)
    {
        return EnumContractStatus::contract_statusShow($contract_status);
    }
}
?>