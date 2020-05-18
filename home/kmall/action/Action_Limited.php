<?php
/**
 +---------------------------------------<br/>
 * 控制器:秒杀活动<br/>
 +---------------------------------------
 * @category ikmall
 * @package web.front.action
 * @author jakeon jakeon@126.com
 */
class Action_Limited extends Action
{
	/**
	 * 活动
	 */
	public function lists()
	{
        $this->loadCss("resources/css/front/iconfont.css");
        $this->loadCss("resources/css/limited.css");
        $this->loadJs("js/leftTime.min.js");
        //头部banner
        $banner = Banner::get("isShow=1 and type=34",'sort desc');
        $this->view->set("banner", $banner);

        //秒杀活动
		$id =$this->data['id'];
		$seckill = Seckill::get_one("seckill_id=".$id);
		$this->view->set("seckill", $seckill);

		//参与秒杀活动的购买记录
		$sql = "SELECT o.ship_mobile,o.commitTime,sum(ps.price) as price,sum(ps.jifen) as jifen FROM km_shop_order as o left join km_shop_order_re_ordergoods as g on o.order_id=g.order_id left join km_product_seckill_re_seckillproduct as ps on g.goods_id = ps.product_id left join km_product_seckill as s on ps.seckill_id=s.seckill_id where o.pay_status='1' and s.seckill_id=".$id." and o.commitTime>=".strtotime($seckill->begin_datetime)." and o.commitTime<=".strtotime($seckill->end_datetime). " GROUP BY g.order_id";
		$data = sqlExecute($sql);
		$this->view->set("data", $data);
	}

	public function view(){
		
	}
 
}
?>