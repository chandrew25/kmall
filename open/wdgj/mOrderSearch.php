<?php
//测试地址：http://localhost/kmall/open/wdgj/index.php?uCode=123456&mType=mOrderSearch
/**
 * 接口名称:订单查询
 * 网店管家同步订单下载两种订单:
 *		 1.已付款未发货
 *       2.全部货到付款的订单
 *       3.全部预定的订单
 * 订单同步后，需要做记录g以备查是否已经做过同步
 */
$result= '<?xml version="1.0" encoding="gb2312"?>'."\r\n";
$result.= "<OrderList>\r\n";

$filter_paid_undelivery=array(
	"status='".EnumOrderStatus::ACTIVE."'",
    "pay_status='".EnumPayStatus::SUCC."'",
    "ship_status='".EnumShipStatus::UNDISPATCH."'"
);

// $filter_pay_needDelivery=array(
// 	"pay_type='4'",//预定
// 	"status='".EnumOrderStatus::ACTIVE."'",
//     "ship_status='".EnumShipStatus::UNDISPATCH."'"
// );

// $filter_pay_prepay_needDelivery=array(
// 	"pay_type='1'",//货到付款，paymenttype 标示为1
// 	"status='".EnumOrderStatus::ACTIVE."'",
//     "ship_status='".EnumShipStatus::UNDISPATCH."'"
// );

// $filter_pay_money_afterDelivery=array(
// 	"pay_type='2'",//银行付款/银行转帐，paymenttype 标示为2
// 	"status='".EnumOrderStatus::ACTIVE."'",
//     "ship_status='".EnumShipStatus::UNDISPATCH."'"
// );

$filter_pay_money_afterDelivery=array(
	//"(pay_type='2' or pay_type='4' or pay_type='1')",//货到付款，paymenttype 标示为1||银行付款/银行转帐，paymenttype 标示为2||预定
	"status='".EnumOrderStatus::ACTIVE."'",
    "ship_status='".EnumShipStatus::UNDISPATCH."'"
);

// $filter="(".implode(" and ", $filter_paid_undelivery).") or (".
// 	implode(" and ", $filter_pay_needDelivery).") or (".
// 	implode(" and ", $filter_pay_prepay_needDelivery).") or (".
// 	implode(" and ", $filter_pay_money_afterDelivery).")";

$filter="(".implode(" and ", $filter_paid_undelivery).") or (".
	implode(" and ", $filter_pay_money_afterDelivery).")";

$orders=Order::get($filter);
$syncdOrder=array();
foreach ($orders as $order) {
	$order_no=$order->order_no;
	$isExist=Wsyncorder::existBy("order_no='".$order_no."'");
	if (!$isExist) {
		$result.= "<OrderNO>";
		$result.= $order->order_no;
		$result.= "</OrderNO>\r\n";
		$wsyncorder=new Wsyncorder();
		$wsyncorder->order_no=$order_no;
		$wsyncorder->order_id=$order->order_id;
		$wsyncorder->isSync=TRUE;
		$wsyncorder->save();
		$syncdOrder[]=$order;
	}
}
$count=count($syncdOrder);
$result.= "<OrderCount>";
$result.= $count;
$result.= "</OrderCount>\r\n";
$result.= "</OrderList>";

$result=str_replace("\r\n","",$result);
echo $result;
?>