<?php
/**
 +---------------------------------------<br/>
 * 供应商<br/>
 * 提供产品的供应商<br/>
 +---------------------------------------
 * @category yile
 * @package supplier
 * @author skygreen skygreen2001@gmail.com
 */
class Supplier extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var string
	 * @access public
	 */
	public $supplier_id;
	/**
	 * 供货商名称
	 * @var string
	 * @access public
	 */
	public $sp_name;
	/**
	 * 公司名称
	 * @var string
	 * @access public
	 */
	public $comany_name;
	/**
	 * 三证合一代码
	 * @var string
	 * @access public
	 */
	public $licence;
	/**
	 * 税号
	 * @var string
	 * @access public
	 */
	public $tax_no;
	/**
	 * 供应商类型<br/>
	 * 1:渠道商-channel<br/>
	 * 0:普通供应商-normal
	 * @var enum
	 * @access public
	 */
	public $stype;
	/**
	 * 联系人
	 * @var string
	 * @access public
	 */
	public $contactman;
	/**
	 * 电话
	 * @var string
	 * @access public
	 */
	public $telphone;
	/**
	 * 手机号码
	 * @var string
	 * @access public
	 */
	public $mobilephone;
	/**
	 * 地址
	 * @var string
	 * @access public
	 */
	public $address;
	/**
	 * 传真
	 * @var string
	 * @access public
	 */
	public $fax;
	/**
	 * 银行账户
	 * @var string
	 * @access public
	 */
	public $bank_account;
	/**
	 * 开户银行
	 * @var string
	 * @access public
	 */
	public $bank_init;
	/**
	 * 备注
	 * @var string
	 * @access public
	 */
	public $memo;
	/**
	 * 供应商网站
	 * @var string
	 * @access public
	 */
	public $url;
	/**
	 * 经办人标识
	 * @var int
	 * @access public
	 */
	public $admin_id;
	/**
	 * 经办人<br/>
	 * 管理员的用户名
	 * @var string
	 * @access public
	 */
	public $operator;
	/**
	 * 是否已审核
	 * 是否已激活
	 * @var string
	 * @access public
	 */
	public $isOk;
	//</editor-fold>

	/**
	 * 一对多关系
	 */
	static $has_many=array(
		"contracts"=>"Contract",
		"warehouses"=>"Warehouse",
		"goodses"=>"Goods"
	);

	/**
	 * 显示供应商类型<br/>
	 * 1:渠道商-channel<br/>
	 *  0:普通供应商-normal<br/>
	 */
	public function getStypeShow()
	{
		return self::stypeShow($this->stype);
	}

	/**
	 * 显示供应商类型<br/>
	 * 1:渠道商-channel<br/>
	 *  0:普通供应商-normal<br/>
	 */
	public static function stypeShow($stype)
	{
		return EnumStype::stypeShow($stype);
	}

    /**记录渠道商自身在供应商表里的标识ID*/
    public static function channel_id()
    {
        return 1;
    }
}
?>
