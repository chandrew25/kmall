<?php
require_once("core/lib/alipay_submit.class.php");
/**
 * 通用:调用支付宝的支付接口
 */
class Payment_Ali
{
	public static $alipay_config;
	
	/**
	 * 初始化工作 
	 */
	private function init()
	{
		$parameter=array();
		$parameter["notify_url"]=Gc::$url_base."module/plugins/pay/alipay/notifyurl.php";//服务器异步通知页面路径,需http://格式的完整路径，不允许加?id=123这类自定义参数
		$parameter["return_url"]=Gc::$url_base."module/plugins/pay/alipay/pageurl.php";//页面跳转同步通知页面路径,需http://格式的完整路径，不允许加?id=123这类自定义参数
		$parameter["show_url"]="";//商品展示地址,需以http://开头的完整路径，如：http://210.14.78.202:86/myorder.html
		$parameter["body"]="";//订单描述
		$parameter["receive_address"]="shanghaixuhui";//收货地址,如：XX省XXX市XXX区XXX路XXX小区XXX栋XXX单元XXX号
		$parameter["receive_name"]="lzggsj";//收货人姓名
		$parameter["receive_zip"]="200001";//收货人邮编,如：123456
		$parameter["receive_phone"]="021-88888888";//收货人电话号码,如：0571-88158090
		$parameter["receive_mobile"]="13817661606";//收货人手机号码,如：13312341234
		$parameter["seller_email"]=Payment_Ali::$alipay_config["seller_email"];//卖家支付宝帐户,必填
		$parameter["logistics_type"]="EXPRESS";//物流类型,必填，三个值可选：EXPRESS（快递）、POST（平邮）、EMS（EMS）
		$parameter["logistics_fee"]="0.00";//物流费用,必填，即运费
		$parameter["logistics_payment"]="SELLER_PAY";//物流支付方式,必填，两个值可选：SELLER_PAY（卖家承担运费）、BUYER_PAY（买家承担运费）
		$parameter["payment_type"]="1";//支付类型,必填，不能修改
		$parameter["quantity"]="1";//商品数量,必填，建议默认为1，不改变值，把一次交易看成是一次下订单而非购买一件商品
		$parameter["service"]="create_partner_trade_by_buyer";
		$parameter["partner"]=trim(self::$alipay_config['partner']);
		$parameter["_input_charset"]=trim(strtolower(self::$alipay_config['input_charset']));
		return $parameter;
	}

	/**
	 * 发送支付请求到支付宝
	 * @param string $order_code 订单编号
	 * @param string $subject 订单名称
	 * @param double $price 交易的金额
	 */
	public function pay($order_code,$order_name,$price)
	{
		if(empty($order_code))return '订单编号不能为空';
		if(empty($order_name))return '订单名称不能为空';
		$pay_param=$this->init();
		$pay_param["out_trade_no"]=$order_code;
		$pay_param["subject"]=$order_name;
		$pay_param["price"]=$price;
		
		LogPay::log_file("发起支付请求:".print_pre($pay_param));
		LogPay::log_file("发起支付请求:订单号-$order_code,支付费用-$price");
		$alipaySubmit = new AlipaySubmit(self::$alipay_config);
		$html_text=$alipaySubmit->buildRequestForm($pay_param,"get", "确认");
		echo $html_text;
	}
}
if(empty(Payment_Ali::$alipay_config)){
	$paymenttype=Paymenttype::get_one("paymenttype_code='alipay'");
	//卖家支付宝帐户
	Payment_Ali::$alipay_config["seller_email"] =$paymenttype->getValue("seller_email");
	//合作身份者id，以2088开头的16位纯数字
	Payment_Ali::$alipay_config['partner']	    =$paymenttype->getValue("partner");
	//安全检验码，以数字和字母组成的32位字符
	Payment_Ali::$alipay_config['key']		    =$paymenttype->getValue("key");
	//签名方式 不需修改
	Payment_Ali::$alipay_config['sign_type']    = strtoupper('MD5');
	//字符编码格式 目前支持 gbk 或 utf-8
	Payment_Ali::$alipay_config['input_charset']= strtolower('utf-8');
	//ca证书路径地址，用于curl中ssl校验
	//请保证cacert.pem文件在当前文件夹目录中
	Payment_Ali::$alipay_config['cacert']       = getcwd().'\\core\\cacert.pem';
	//访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
	Payment_Ali::$alipay_config['transport']    = 'http';
}
?>