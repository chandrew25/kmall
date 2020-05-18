<?php
/**
 +---------------------------------------<br/>
 * 产品所在仓库<br/>
 * 产品仓库<br/>
 +---------------------------------------
 * @category kmall
 * @package storage.product.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Warehouseproduct extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $warehouseproduct_id;
    /**
     * 商品标识
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 商品货号［商品唯一标识］
     * @var string
     */
    public $product_code;
    /**
     * 供应商标识
     * @var int
     * @access public
     */
    public $supplier_id;
    /**
     * 仓库标识
     * @var int
     * @access public
     */
    public $warehouse_id;
    /**
     * 数量
     * @var int
     * @access public
     */
    public $num;
    //</editor-fold>
}
?>