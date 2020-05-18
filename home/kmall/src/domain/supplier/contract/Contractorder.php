<?php
/**
 +---------------------------------------<br/>
 * 合同订单<br/>
 * 现已删除该需求，暂保留其开发，稍后删除<br/>
 +---------------------------------------
 * @category yile
 * @package supplier.contract
 * @author skygreen skygreen2001@gmail.com
 */
class Contractorder extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $contractorder_id;
    /**
     * 合同订单号<br/>
     * 标示合同订单的业务编号
     * @var string
     * @access public
     */
    public $co_no;
    /**
     * 供应商标识
     * @var int
     * @access public
     */
    public $supplier_id;
    /**
     * 合同标识
     * @var int
     * @access public
     */
    public $contract_id;
    /**
     * 产品名称
     * @var string
     * @access public
     */
    public $goods_name;
    /**
     * 产品数量<br/>
     * 计划订购产品数量
     * @var int
     * @access public
     */
    public $amount;
    /**
     * 单价
     * @var int
     * @access public
     */
    public $price;
    /**
     * 合同金额
     * @var int
     * @access public
     */
    public $money;
    //</editor-fold>
}
?>