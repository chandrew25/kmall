<?php
/**
 +---------------------------------------<br/>
 * 产品所在仓库<br/>
 * 产品仓库<br/>
 +---------------------------------------
 * @category kmall
 * @package storage.goods.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Warehousegoods extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $warehousegoods_id;
    /**
     * 产品标识
     * @var int
     * @access public
     */
    public $goods_id;
    /**
     * 商品货号［商品唯一标识］
     * @var string
     * @access public
     */
    public $goods_code;
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
    /**
     * 最低库存警报
     * @var int
     * @access public
     */
    public $low_alarm;
    /**
     * 单位
     * @var string
     * @access public
     */
    public $unit;
    //</editor-fold>

}
?>