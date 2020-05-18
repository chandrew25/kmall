<?php
/**
 +---------------------------------------<br/>
 * 货品组合<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Groups extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $groups_id;
    /**
     * 主货品
     * @var int
     * @access public
     */
    public $pgoods_id;
    /**
     * 从货品
     * @var int
     * @access public
     */
    public $fgoods_id;
    public $fproduct_id;
    public $pproduct_id;
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