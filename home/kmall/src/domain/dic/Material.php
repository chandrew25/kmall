<?php
/**
 +---------------------------------------<br/>
 * 材质<br/>
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Material extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var string
     * @access public
     */
    public $material_id;
    /**
     * 名称
     * @var string
     * @access public
     */
    public $material_name;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
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