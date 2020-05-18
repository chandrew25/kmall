<?php
/**
 +---------------------------------------<br/>
 * 供应商<br/>
 * 提供产品的供应商<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Sbs extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var string
	 * @access public
	 */
	public $sbs_id;
	/**
	 * 商户名称
	 * @var string
	 * @access public
	 */
	public $sbs_name;
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
	 * 联系人
	 * @var string
	 * @access public
	 */
	public $contactman;
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
	 * 备注
	 * @var string
	 * @access public
	 */
	public $memo;
	/**
	 * 三证文件
	 * @var string
	 * @access public
	 */
	public $licence_image;
	/**
	 * 商户网站
	 * @var string
	 * @access public
	 */
	public $url;
	/**
	 * 是否已审核
	 * @var string
	 * @access public
	 */
	public $isOk;
	//</editor-fold>

}
?>