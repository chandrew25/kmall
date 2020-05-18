<?php
/**
 +---------------------------------------<br/>
 * 仓库<br/>
 +---------------------------------------
 * @category yile
 * @package storage
 * @author skygreen skygreen2001@gmail.com
 */
class Warehouse extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识<br/>
	 * 仓库唯一标识
	 * @var int
	 * @access public
	 */
	public $warehouse_id;
	/**
	 * 供应商<br/>
	 * 供应商唯一标识
	 * @var int
	 * @access public
	 */
	public $supplier_id;
	/**
	 * 仓库名称
	 * @var string
	 * @access public
	 */
	public $warehouse_name;
	/**
	 * 联系人
	 * @var string
	 * @access public
	 */
	public $contactman;
	/**
	 * 联系电话
	 * @var string
	 * @access public
	 */
	public $mobilephone;
	/**
	 * 是否默认仓库
	 * @var string
	 * @access public
	 */
	public $isDefault;
	/**
	 * 仓库地址
	 * @var string
	 * @access public
	 */
	public $address;
	//</editor-fold>

	/**
	 * 从属一对一关系
	 */
	static $belong_has_one=array(
		"supplier"=>"Supplier"
	);  
    /**记录渠道商自身在仓库表里的标识ID*/
    public static function channel_id()
    {
        return 1;
    }
}
?>