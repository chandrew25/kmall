<?php    
require_once("core/core.php");   
/**
 *---------------------------------------<br/>
 * 枚举类型:盛付通支付类型编码  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum.pay.shengpay 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumShengPayType extends Enum    
{
	/**
	 * 网银支付
	 */
	const NETBANK='PT001';
	/**
	 * 余额支付
	 */ 
	const RESTMONEY="PT002";
	/**
	 * 盛付通卡支付
	 */
	const SELFCARD='PT003';
	/**
	 * 一点充支付
	 */ 
	const ONEPOINTFILL="PT004";
	/**
	 * 手机充值卡支付
	 */
	const MOBILEFILLCARD='PT005';
	/**
	 * 手机话费支付
	 */ 
	const MOBILEFEE="PT006";
	/**
	 * 固话支付
	 */
	const STATICPHONE='PT007';
	/**
	 * 盛大卡支付
	 */ 
	const SDO="PT008";  
	/**
	 * 积分支付
	 */
	const JIFEN='PT009';
	/**
	 * 银联快捷支付
	 */ 
	const UNIONPAY="PT010";
	/**
	 * 线下支付
	 */
	const OFFLINE='PT011';
	/**
	 * 宽带支付
	 */ 
	const BROADBAND="PT012";
	/**
	 * PPC预付卡支付
	 */
	const PPC='PT013';
	/**
	 * 无磁无密支付
	 */ 
	const NOSECRET="PT014"; 
}   

/**
 *---------------------------------------<br/>
 * 枚举类型:盛付通银行编码  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain       
 * @subpackage enum.pay.shengpay 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumShengInstCode extends Enum
{
	/**
	 * 测试银行
	 */
	const SDTBNK='SDTBNK';
	/**
	 * 工商银行
	 */ 
	const ICBC="ICBC";
	/**
	 * 建设银行
	 */
	const CCB='CCB';
	/**
	 * 农业银行
	 */ 
	const ABC="ABC";
	/**
	 * 招商银行
	 */
	const CMB='CMB';
	/**
	 * 交通银行
	 */ 
	const COMM="COMM";
	/**
	 * 中国银行
	 */
	const BOC='BOC';
	/**
	 * 中国邮政储蓄银行
	 */ 
	const PSBC="PSBC";  
	/**
	 * 北京银行
	 */
	const BCCB='BCCB';
	/**
	 * 民生银行
	 */ 
	const CMBC="CMBC";
	/**
	 * 深圳发展银行
	 */
	const SDB='SDB';
	/**
	 * 平安银行
	 */ 
	const SZPAB="SZPAB";
	/**
	 * 上海银行
	 */
	const BOS='BOS';
	/**
	 * 浦东发展银行
	 */ 
	const SPDB="SPDB"; 
	/**
	 * 光大银行
	 */
	const CEB='CEB';
	/**
	 * 中信银行
	 */ 
	const CITIC="CITIC"; 
	/**
	 * 兴业银行
	 */
	const CIB='CIB';
	/**
	 * 温州银行
	 */ 
	const WZCB="WZCB"; 
}
						 
/**
 * 通用:调用盛付通的支付接口 
 * @example 调用示例如下: 
 * $params=array(
 * 		'PayType'=>$_GET["PayType"],							//支付类型编码
 * 		'InstCode'=>$_GET["InstCode"],							//银行编码
 * 		'ProductName'=>$_GET["ProductName"],					//商品名称
 * 		'BuyerContact'=>$_GET["BuyerContact"],					//支付人联系方式
 * 		'oid'=>$_GET["oid"],									//商品订单
 * 		'fee'=>$_GET["fee"]										//交易的金额
 * );
 * $pay=new ElePayment();
 * print ($pay->paymentForEle($params));
 */
class Payment_Sheng
{
	/**
	 * 发送方标识
	 * 由盛付通提供,默认为:商户号(由盛付通提供的6位正整数),用于盛付通判别请求方的身份 
	 */
	public static $MsgSender="";
	/**
	 * 盛付通申请的键值 
	 * @var mixed
	 */
	public static $key='';
	/**
	 * 版本名称
	 * 版本名称,默认属性值为:B2CPayment 
	 */
	const Name="B2CPayment";
	/**
	 * 版本号
	 * 版本号,默认属性值为: V4.1.1.1.1
	 */
	const Version="V4.1.1.1.1";
	/**
	 * 字符集
	 * 字符集,支持GBK、UTF-8、GB2312,默认属性值为:UTF-8
	 */
	const Charset="UTF-8";     
	/**
	 * 签名类型
	 * 签名类型,如：MD5
	 */
	const SignType="MD5";                
	
	private static $current; 
	/**
	 *当前正在处理的支付线程
	 */
	public static function current()
	{
		if (self::$current==null){
			self::$current=new Payment_Sheng();
		}    
		return self::$current;
	}
	
	/**
	 * 初始化工作 
	 */
	private function init()
	{
		$pay_param['PageUrl']  =Gc::$url_base.'module/plugins/pay/shengpay/pageurl.php';  //浏览器回调地址
		$pay_param['NotifyUrl']=Gc::$url_base.'module/plugins/pay/shengpay/notifyurl.php';//商户后台回调地址
		$pay_param["Name"]=self::Name;
		$pay_param["Version"]=self::Version;
		$pay_param["Charset"]=self::Charset;
		$pay_param["MsgSender"]=self::$MsgSender;      
		$pay_param["SignType"]=self::SignType;
		
		$pay_param["BuyerIp"]=UtilNet::client_ip();
		$pay_param['SendTime']=date('YmdHis');
		$pay_param['OrderTime']=date('YmdHis');                                                              
		return $pay_param;
	}     

	/**
	 * 发送支付请求到盛付通
	 * @param string $order_code   订单编号
	 * @param string $product_name 商品名称
	 * @param string $contact_way  联系电话   
	 * @param string $fee          交易的金额
	 * @param string $instCode     银行编码,见附录7.2.1综合网银编码列表,机构代码列表以逗号分隔
	 * @param string $pay_type     交易的金额
	 * @return mixed
	 */
	public function pay($order_code,$product_name,$fee,$contact_way,$instCode="ICBC",$pay_type="PT001")
	{
		if(empty($order_code))return '订单编号不能为空';
		if(empty($product_name))return '商品名称不能为空';   
		if(empty($contact_way))return '联系电话不能为空';  
		$pay_param=$this->init();            
		$pay_param['PayType']=$pay_type;
		$pay_param['InstCode']=$instCode;
		$pay_param['ProductName']=$product_name;
		$pay_param['BuyerContact']=$contact_way;
		$pay_param['Ext1']="";
		$pay_param['Ext2']="";
		
		$shengpay=new shengpay();
		$shengpay->init($pay_param);
		LogPay::log_file("发起支付请求:".print_pre($pay_param));
		LogPay::log_file("发起支付请求:订单号-$order_code,支付费用-$fee");
		$shengpay->setKey(self::$key);      
		$shengpay->takeOrder($order_code,$fee);
	}
	
	/**
	 * 发送支付请求到盛付通
	 * @param array $payParams 支付请求参数数组
	 *        键名称:order_code   订单编号
	 *        键名称:product_name 商品名称
	 *        键名称:contact_way  联系电话   
	 *        键名称:fee          交易的金额
	 *        键名称:instCode     银行编码,见附录7.2.1综合网银编码列表,机构代码列表以逗号分隔
	 *        键名称:pay_type     交易的金额
	 * @return mixed
	 */
	public function payByParams($payParams)
	{
		extract($payParams);  
		if (empty($pay_type)) $pay_type=EnumShengPayType::NETBANK;
		if ($instCode==1) {$instCode="";$pay_type="";}
		$this->pay($order_code,$product_name,$fee,$contact_way,$instCode,$pay_type);
	}
	
	/**
	 * 商户后台回调地址
	 */
	public function returnSign()
	{
		$shengpay=new shengpay();
		$shengpay->setKey(self::$key);
		return $shengpay->returnSign();
	}
}
if(empty(Payment_Sheng::$MsgSender)){
	$paymenttype=Paymenttype::get_one("paymenttype_code='shengpay'");
	//发送方标识
	Payment_Sheng::$MsgSender=$paymenttype->getValue("MsgSender");
	//盛付通申请的键值
	Payment_Sheng::$key=$paymenttype->getValue("key");
}
?>