<?php
	require_once('../../../init.php');
	
	$xml=simplexml_load_file("payments.xml");
	//判断该支付方式是否存在
	foreach($xml->payment as $payment){
		$count=Paymenttype::count("paymenttype_code='".$payment->code."'");
		if($count==0){//如果不存在，则添加该支付方式
			$paymenttype=new Paymenttype();
			$paymenttype->paymenttype_code=$payment->code;
			$paymenttype->name=$payment->name;
			$paymenttype->description=$payment->description;
			$paymenttype->save();
			echo "添加".$payment->code."<br/>";
		}
	}
?>