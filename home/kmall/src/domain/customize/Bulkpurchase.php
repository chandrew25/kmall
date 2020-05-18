<?php
/**
 +---------------------------------------<br/>
 * 大宗采购<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Bulkpurchase extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $bulkpurchase_id;
    /**
     * 商品标识
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 姓名
     * @var string
     * @access public
     */
    public $customername;
    /**
     * 需求
     * @var string
     * @access public
     */
    public $requirement;
    /**
     * 联系电话
     * @var string
     * @access public
     */
    public $telephone;
    /**
     * 公司名称
     * @var string
     * @access public
     */
    public $company_name;
    /**
     * 公司地址
     * @var string
     * @access public
     */
    public $company_addr;
    /**
     * 邮箱地址
     * @var string
     * @access public
     */
    public $email;
    /**
     * 是否已经处理
     * @var string
     * @access public
     */
    public $isolve;
    /**
     * 处理意见
     * @var string
     * @access public
     */
    public $suggestion;
    //</editor-fold>

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "product"=>"Product"
    );

}
?>