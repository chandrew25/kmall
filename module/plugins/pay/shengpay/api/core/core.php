<?php  
/**
 * 盛付通的支付接口         
 */
class shengpay
{
	private $payHost;
	private $debug=false;
	private $key='shengfutongSHENGFUTONGtest';
	public  $params=array(
		'Name'=>'',			    //版本名称
		'Version'=>'',		    //版本号
		'Charset'=>'',			//字符集
		'MsgSender'=>'',		//发送方标识
		'SendTime'=>'',			//发送支付请求时间
		'OrderNo'=>'',			//商户订单号
		'OrderAmount'=>'',		//支付金额
		'OrderTime'=>'',		//商户订单提交时间
		'PayType'=>'',			//支付类型编码
		'InstCode'=>'',			//银行编码
		'PageUrl'=>'',			//浏览器回调地址
		'NotifyUrl'=>'',		//商户后台回调地址
		'ProductName'=>'',		//商品名称
		'BuyerContact'=>'',		//支付人联系方式
		'BuyerIp'=>'',			//买家IP地址
		'Ext1'=>'',				//扩展1
		'Ext2'=>'',				//扩展2
		'SignType'=>'',			//签名类型
		'SignMsg'=>'',			//签名串
	);
				
	/**
	 * 初始化工作 
	 * @param mixed $array
	 */
	public function init($array=array())  
	{   
		if($this->debug)
			$this->payHost='http://mer.mas.sdo.com/web-acquire-channel/cashier.htm';
		else
			$this->payHost='http://mas.sdo.com/web-acquire-channel/cashier.htm'; 
		foreach($array as $key=>$value){
			$this->params[$key]=$value;  
		}  
	}         

	public function setKey($key)
	{
		$this->key=$key;
	}         
	
	public function setParam($key,$value)
	{
		$this->params[$key]=$value;
	}

	public function takeOrder($oid,$fee)
	{
		$this->params['OrderNo']=$oid;
		$this->params['OrderAmount']=$fee;
		$origin='';
		foreach($this->params as $key=>$value){
			if(!empty($value))
			$origin.=$value;
		}
		$SignMsg=strtoupper(md5($origin.$this->key));
		$this->params['SignMsg']=$SignMsg;
		echo '<meta http-equiv = "content-Type" content = "text/html;  charset = utf-8 "/>
			<form  method="post" action="'.$this->payHost.'">';
		foreach($this->params as $key=>$value){
			echo '<input type="hidden" name="'.$key.'" value="'.$value.'"/>';
		}
		echo '<input type="submit" name="submit" value="提交到盛付通" id="dh" style="display:none;">
				<script>var a=document.getElementById("dh");a.click();</script>
			</form>';
	}
	
	/**
	 * 支付发出请求返回信号 
	 */
	public function returnSign()
	{
		$params=array(
			'Name'=>'',
			'Version'=>'',
			'Charset'=>'',
			'TraceNo'=>'',
			'MsgSender'=>'',
			'SendTime'=>'',
			'InstCode'=>'',
			'OrderNo'=>'',
			'OrderAmount'=>'',
			'TransNo'=>'',
			'TransAmount'=>'',
			'TransStatus'=>'',
			'TransType'=>'',
			'TransTime'=>'',
			'MerchantNo'=>'',
			'ErrorCode'=>'',
			'ErrorMsg'=>'',
			'Ext1'=>'',
			'Ext2'=>'',
			'SignType'=>'MD5',
		);
		foreach($_POST as $key=>$value){
			if(isset($params[$key])){
				$params[$key]=$value;
			}
		}
		$TransStatus=(int)$_POST['TransStatus'];
		$origin='';
		foreach($params as $key=>$value){
			if(!empty($value))
			$origin.=$value;
		}
		$SignMsg=strtoupper(md5($origin.$this->key));
		if($SignMsg==$_POST['SignMsg'] and $TransStatus==1){
			return true;
		}else{
			return false;
		}                                                                                              
	}  
}

