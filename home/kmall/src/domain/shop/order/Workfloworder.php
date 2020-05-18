<?php
/**
 +---------------------------------------<br/>
 * 订单操作工作流<br/>
 +---------------------------------------
 * @category yile
 * @package shop.order
 * @author skygreen skygreen2001@gmail.com
 */
class Workfloworder extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $workfloworder_id;
    /**
     * 订单标识
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 1.采购审核<br/>
     * 2.客服确认<br/>
     * 3.财务结算
     * @var enum
     * @access public
     */
    public $type;
    /**
     * 是否已操作
     * @var string
     * @access public
     */
    public $isConfirm;
    /**
     * 发出请求者标识
     * @var int
     * @access public
     */
    public $needer_id;
    /**
     * 操作者标识
     * @var int
     * @access public
     */
    public $operator_id;
    /**
     * 操作者留言
     * @var string
     * @access public
     */
    public $operator_memo;
    //</editor-fold>

    /** 
     * 显示1.采购审核<br/>
     * 2.客服确认<br/>
     * 3.财务结算<br/>
     */
    public function getTypeShow()
    {
        return self::typeShow($this->type);
    }

    /** 
     * 显示1.采购审核<br/>
     * 2.客服确认<br/>
     * 3.财务结算<br/>
     */
    public static function typeShow($type)
    {
        return EnumWorkfloworderType::typeShow($type);
    }
}
?>