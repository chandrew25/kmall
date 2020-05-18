<?php
//测试地址  :http://localhost/kmall/open/wdgj/index.php?uCode=123456&mType=mGetOrder&OrderNO=1359705540
//开发者地址:http://shop.kmall.com//kmalldev/open/wdgj/index.php?uCode=123456&mType=mGetOrder&OrderNO=1366342878
/**
 * 接口名称:订单下载
 */
$OrderNO=$data["OrderNO"];
$order=Order::get_one("order_no=".$OrderNO);

$result= '<?xml version="1.0" encoding="gb2312"?>'."\r\n";
$result.= "<Order>\r\n";
if ($order) {
	$result.= "<Ver>1.0</Ver>";//版本号
	$result.= "<OrderNO>".$order->order_no."</OrderNO>\r\n";//订单号
	$orderTime=$order->ordertime;
	if ($orderTime) {
		$orderTime=UtilDateTime::timestampToDateTime($orderTime);
	}
	$result.= "<DateTime>".$orderTime."</DateTime>\r\n";//成交日期
	$member=Member::get_by_id($order->member_id);
	$result.= "<BuyerID><![CDATA[".$member->username."]]></BuyerID>\r\n";//买家用户名
	$result.= "<BuyerName><![CDATA[".$order->ship_name."]]></BuyerName>\r\n";//买家姓名
	$region=Region::get_by_id($order->country);
	$region_name="";
	if ($region)$region_name=$region->region_name;
	$result.= "<Country><![CDATA[".$region_name."]]></Country>\r\n";//国家
	$region=Region::get_by_id($order->province);
	$region_name="";
	if ($region)$region_name=$region->region_name;
	$result.= "<Province><![CDATA[".$region_name."]]></Province>\r\n";//省/州
	$region=Region::get_by_id($order->city);
	$region_name="";
	if ($region)$region_name=$region->region_name;
	$result.= "<City><![CDATA[".$region_name."]]></City>\r\n";//市/县
	$region=Region::get_by_id($order->district);
	$region_name="";
	if ($region)$region_name=$region->region_name;
	$result.= "<Town><![CDATA[".$region_name."]]></Town>\r\n";//区/镇
	$result.= "<Adr><![CDATA[".$order->ship_addr."]]></Adr>\r\n";//地址
	$result.= "<Zip><![CDATA[".$order->ship_zipcode."]]></Zip>\r\n";//邮编
	$result.= "<Email><![CDATA[".$member->email."]]></Email>\r\n";//Email
	$result.= "<Phone><![CDATA[".$order->ship_mobile."]]></Phone>\r\n";//联系电话
	$result.= "<Total>".$order->final_amount."</Total>\r\n";//货款总额
	$result.= "<Postage>".$order->cost_other."</Postage>\r\n";//货运费用
	$pay_type=Paymenttype::get_by_id($order->pay_type);
	$pay_type_code=$pay_type->paymenttype_code;
	$result.= "<PayAccount><![CDATA[]]></PayAccount>\r\n";//支付方式$pay_type->name
	$result.= "<PayID><![CDATA[]]></PayID>\r\n";//支付编号$pay_type_code
	$delivery_type=Deliverytype::get_by_id($order->ship_type);
	$result.= "<LogisticsName><![CDATA[".$delivery_type->name."]]></LogisticsName>\r\n";//发货方式
	if (($pay_type_code=='reserve')||($pay_type_code=='cod/card')){
		$result.= "<Chargetype><![CDATA[货到付款]]></Chargetype>\r\n";//结算方式
	}else if  ($pay_type_code=='remit/transfer'){
		$result.= "<Chargetype><![CDATA[现金收款]]></Chargetype>\r\n";//结算方式
	}else{
		$result.= "<Chargetype><![CDATA[担保交易]]></Chargetype>\r\n";//结算方式$pay_type->name
	}
	$result.= "<CustomerRemark><![CDATA[]]></CustomerRemark>\r\n";//客户备注
	if ($pay_type_code=='reserve'){
		$result.= "<Remark><![CDATA[预定订单《未付款》]]></Remark>\r\n";//客服备注
	}else if  ($pay_type_code=='remit/transfer'){
		$result.= "<Remark><![CDATA[银行汇款/转账《需财务确认收款》]]></Remark>\r\n";//客服备注
	}else{
		$result.= "<Remark><![CDATA[".$order->intro."]]></Remark>\r\n";//客服备注
	}
	$ordergoods=$order->ordergoods;
	if ($ordergoods && (count($ordergoods)>0)){
		foreach ($ordergoods as $eachgoods) {
            if($eachgoods->isGiveaway){
                $eachgoods->price=0;    
            }
			$specification="";//是html编码
			// $specification=htmlspecialchars($product->specification);
			$result.= "<Item>";//成交商品集
				$result.= "<GoodsID><![CDATA[".$eachgoods->goods_code."]]></GoodsID>\r\n";//库存编码
				$result.= "<GoodsName><![CDATA[".$eachgoods->goods_name."]]></GoodsName>\r\n";//货品名称
				$result.= "<GoodsSpec><![CDATA[".$specification."]]></GoodsSpec>\r\n";//货品规格
				$result.= "<Count>".$eachgoods->nums."</Count>\r\n";//数量
				$result.= "<Price>".$eachgoods->price."</Price>\r\n";//单价
			$result.= "</Item>\r\n";
		}
	}
}
$result.= "</Order>\r\n";
$result=UtilString::utf82gbk($result);
$result=str_replace("\r\n","",$result);

echo $result;
?>