<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:订单<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceTaobaoorder extends ServiceBasic
{
	/**
	 * 数据对象:订单分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:订单分页查询列表
	 */
	public function queryPageOrder($formPacket=null)
	{
		$data[0]=array(
			order_no=>"1359537297",
			username=>"zhouj",
			order_status=>"有效",
			pay_status=>"准备支付",
			ship_status=>"未发货",
			total_amount=>"680",
			ordertime=>"2013-01-30 17:14",
			pay_type=>"预定",
			ship_addr=>"田林路168号",
			ship_name=>"老李",
			ship_mobile=>"13601954527",
			ship_type=>"运费到付",
		);
		$data[1]=array(
			order_no=>"1359535625",
			username=>"zwy1111",
			order_status=>"有效",
			pay_status=>"准备支付",
			ship_status=>"未发货",
			total_amount=>"500",
			ordertime=>"2013-01-26 20:05",
			pay_type=>"预定",
			ship_addr=>"陈上路",
			ship_name=>"老张",
			ship_mobile=>"13601954527",
			ship_type=>"运费到付",
		);
		$data[2]=array(
			order_no=>"1359104017",
			username=>"skygreen2001",
			order_status=>"有效",
			pay_status=>"准备支付",
			ship_status=>"未发货",
			total_amount=>"4000",
			ordertime=>"2013-01-25 16:48",
			pay_type=>"预定",
			ship_addr=>"上海市闸北区",
			ship_name=>"老周",
			ship_mobile=>"13601954527",
			ship_type=>"运费到付",
		);
		$count=count($data);
		return array(
			'success' => true,
			'totalCount'=>$count,
			'data'    => $data
		);
	}
}
?>