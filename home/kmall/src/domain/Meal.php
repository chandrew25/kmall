<?php
/**
 +---------------------------------------<br/>
 * 套餐<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Meal extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $meal_id;
    /**
     * 名称
     * @var string
     * @access public
     */
    public $name;
    //</editor-fold>
    /**
     * 规格说明
     * 表中不存在的默认列定义:commitTime,updateTime
     * @var mixed
     */
    public $field_spec=array(
        EnumDataSpec::REMOVE=>array(
            'commitTime',
            'updateTime'
        )
    );

}
?>