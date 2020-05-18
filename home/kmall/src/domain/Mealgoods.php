<?php
/**
 +---------------------------------------<br/>
 * 套餐货品<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Mealgoods extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $mealgoods_id;
    /**
     * 套餐标识
     * @var int
     * @access public
     */
    public $meal_id;
    /**
     * 货品标识
     * @var int
     * @access public
     */
    public $goods_id;
    //</editor-fold>
    /**
     * 规格说明
     * 表中不存在的默认列定义:commitTime,updateTime
     * @var mixed
     */


    //货品对应商品   多对一
    static $belong_has_one=array(
        "goods"=>"Goods"
    );


    public $field_spec=array(
        EnumDataSpec::REMOVE=>array(
            'commitTime',
            'updateTime'
        )
    );

}
?>