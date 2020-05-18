<?php
//测试地址:http://localhost/kmall/open/wdgj/index.php?uCode=123456&mType=mSndGoods&OrderID=1366342878&OrderNO=1366342878&CustomerID=skygreen2001&SndStyle=圆通&BillID=test123456&SndDate=2013-04-22 14:56:03
/**
 * 接口名称:发货通知
 */
$admin_wdgj=Admin::wdgj();//网店管家的管理员标识
$OrderID=$data["OrderID"];//订单编号
$OrderNO=$data["OrderNO"];//原始订单编号（独立网店里面的订单编号）
$CustomerID=$data["CustomerID"];//客户网名
$SndStyle=$data["SndStyle"];//发货方式（中文 例：申通 圆通等）
$BillID=$data["BillID"];//货运单号
$SndDate=$data["SndDate"];//发货时间 （2011-11-14 10:26:03）
LogMe::log("********************发货通知同步开始*****************");
LogMe::log("********************同步订单参数为［OrderID:$OrderID,OrderNO:$OrderNO,CustomerID:$CustomerID
	,SndStyle:$SndStyle,BillID:$BillID,SndDate:$SndDate］*****************");
$result= '<?xml version="1.0" encoding="gb2312"?>'."\r\n";
$result.= "<rsp>\r\n";
if ($OrderID&&$OrderNO&&$CustomerID&&$SndStyle&&$BillID&&$SndDate)
{
	$admin_id=$admin_wdgj->admin_id;
	if (!empty($OrderNO)){
		//修改订单状态
		$order=Order::get_one("order_no='".$OrderNO."'");
		if ($order) {
			if ($order->ship_status==EnumShipStatus::DISPATCH) {
				$result.="<rsp><result>0</result><cause>订单标识:OrderID:$OrderID,OrderNO:$OrderNO 的订单已经发货了</cause></rsp>";
			}else{
				$order->ship_status=EnumShipStatus::DISPATCH;
				$order->update();
				if ($order) {
					$order_id=$order->order_id;
					$operator_memo="网店管家发货通知:客户网名［ $CustomerID ］,货运单号［ $BillID ］";
					//1.生成货运单
					$delivery = new Delivery($checks);
					$delivery->status=EnumDeliveryStatus::SUCC;
					$delivery->type=EnumDeliveryType::DELIVERY;
					$delivery->delivery_no=$BillID;
					$delivery->order_id=$order_id;
					$delivery->member_id=$order->member_id;
					$delivery->ship_name=$CustomerID;
					$delivery->ship_addr=$order->ship_addr;
					$delivery->ship_area=$order->country."-".$order->province."-".$order->city."-".$order->district;
					$delivery->ship_mobile=$order->ship_mobile;
					$delivery->ship_tel=$order->ship_tel;
					$delivery->ship_time=$order->ship_time;
					$delivery->ship_zip=$order->ship_zipcode;
					$delivery->delivery=$SndStyle;
					$delivery->memo=$operator_memo;
					$delivery->save();

					//2.工作流
					$workflow=Workfloworder::get_one(array("order_id"=>$order->order_id,"type"=>EnumWorkfloworderType::SEND));
					if ($workflow){
						//更新工作流信息
						$workflow->isConfirm=true;
						$workflow->operator_memo=$operator_memo;
						$workflow->operator_id=$admin_id;
						$workflow->update();
					}else{
						//保存工作流信息:网店发货通知
						$workflow=new Workfloworder();
						$workflow->order_id=$order_id;
						$workflow->isConfirm=true;
						$workflow->operator_memo=$operator_memo;
						$workflow->type=EnumWorkfloworderType::SEND;
						$workflow->operator_id=$admin_id;
						$workflow->save();
					}

					//3.记录发货日志
					$deliverylog = new Deliverylog();
					$deliverylog->order_id=$order_id;
					$deliverylog->order_no=$OrderNO;
					$deliverylog->delivery_no=$delivery->delivery_no;
					$deliverylog->admin_id=$admin_id;
					$deliverylog->operater=$admin_wdgj->realname;
					$deliverylog->deliveryAction=EnumDeliveryAction::SEND;
					$deliverylog->result=EnumResult::SUCC;
					$deliverylog->intro=$operator_memo;
					$deliverylog->ship_time=$SndDate;
					$deliverylog->save();

		            //4.记录订单状态日志
					$orderlog=new Orderlog();
					$orderlog->admin_id=$admin_wdgj->admin_id;
					$orderlog->operater=$admin_wdgj->realname;
					$orderlog->delivery_no=$delivery->delivery_no;
					$orderlog->orderAction=EnumOrderAction::SEND;
					$orderlog->result=EnumResult::SUCC;
					$orderlog->order_id=$order_id;
					$orderlog->order_no=$OrderNO;
					$orderlog->intro=$operator_memo;
					$orderlog->save();
				}
				$result.="<result>1</result>";
			}
		}else{
			$result.="<rsp><result>0</result><cause>订单标识:OrderID:$OrderID,OrderNO:$OrderNO 的订单不存在</cause></rsp>";

		}
	}
} else {
	$result.="<rsp><result>0</result><cause>缺少参数:OrderID:$OrderID,OrderNO:$OrderNO,CustomerID:$CustomerID
	,SndStyle:$SndStyle,BillID:$BillID,SndDate:$SndDate</cause></rsp>";
}

LogMe::log("********************发货通知同步结束*****************");
$result.="</rsp>\r\n";
$result=str_replace("\r\n","",$result);
echo $result;
?>