<?php
/**
 +---------------------------------------<br/>
 * 商品出入库日志<br/>
 * 也是预订单；供应商与菲彼生活签订合同后即可产品入库
 * 商品入库生成预订单，但直到客户购买商品时，才生成真正的订单出入库日志<br/>
 +---------------------------------------
 * @category kmall
 * @package log.storage
 * @author skygreen skygreen2001@gmail.com
 */
class Productlog extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $productlog_id;
    /**
     * 源供应商<br/>
     * 产品来自供应商
     * @var int
     * @access public
     */
    public $fsp_id;
    /**
     * 源仓库
     * @var int
     * @access public
     */
    public $fsp_warehouse;
    /**
     * 目标供应商<br/>
     * 产品销售给供应商
     * @var int
     * @access public
     */
    public $tsp_id;
    /**
     * 目的仓库
     * @var int
     * @access public
     */
    public $tsp_warehouse;
    /**
     * 行为<br/>
     * 0:新商品入库-newin<br/>
     * 1:已有商品入库-havein<br/>
     * 2:出库-out
     * @var enum
     * @access public
     */
    public $goodsActionType;
    /**
     * 产品编号
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 价格
     * @var float
     * @access public
     */
    public $price;
    /**
     * 数量
     * @var int
     * @access public
     */
    public $num;
    /**
     * 经办人标识
     * @var int
     * @access public
     */
    public $admin_id;
    /**
     * 经办人
     * @var string
     * @access public
     */
    public $operator;
    //</editor-fold>
    /**
     * 规格说明
     * 表中不存在的默认列定义:updateTime
     * @var mixed
     */
    public $field_spec=array(
        EnumDataSpec::REMOVE=>array(
            'updateTime'
        )
    );

    /**
     * 显示行为<br/>
     * 0:新产品入库-newin<br/>
     * 1:已有产品入库-havein<br/>
     * 2:出库-out<br/>
     */
    public function getGoodsActionTypeShow()
    {
        return self::goodsActionTypeShow($this->goodsActionType);
    }

    /**
     * 显示行为<br/>
     * 0:新产品入库-newin<br/>
     * 1:已有产品入库-havein<br/>
     * 2:出库-out<br/>
     */
    public static function goodsActionTypeShow($goodsActionType)
    {
        return EnumGoodsActionType::goodsActionTypeShow($goodsActionType);
    }

}
?>
