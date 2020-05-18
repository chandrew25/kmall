<?php
/**
 +---------------------------------------<br/>
 * 证券<br/>
 +---------------------------------------
 * @category betterlife
 * @package stock
 * @author skygreen skygreen2001@gmail.com
 */
class Stock extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $stock_id;
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
    public $mobile;
    /**
     * 电子邮箱<br/>
     * 接收办理进度信息
     * @var string
     * @access public
     */
    public $email;
    /**
     * 收件地址<br/>
     * 接收股权证收件地址
     * @var string
     * @access public
     */
    public $addr;
    /**
     * 身份证号码
     * @var string
     * @access public
     */
    public $cardNo;
    /**
     * 收款账户姓名
     * @var string
     * @access public
     */
    public $bname;
    /**
     * 收款账号
     * @var string
     * @access public
     */
    public $baccount;
    /**
     * 开户行<br/>
     * XX银行XX支行(请务必填写正确)
     * @var string
     * @access public
     */
    public $bstartup;
    /**
     * 是否申请委托开户<br/>
     * （若已/计划自行在美国开户则填“否”）
     * @var bit
     * @access public
     */
    public $isDelegate;
    /**
     * 申请金额
     * @var string
     * @access public
     */
    public $money;
    //</editor-fold>


    /**
     * 是否申请委托开户<br/>
     * （若已/计划自行在美国开户则填“否”）
     */
    public function isDelegateShow()
    {
        if ( $this->isDelegate ) {
            return "是";
        }
        return "否";
    }
}

