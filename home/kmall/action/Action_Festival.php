 <?php
/**
 +---------------------------------------<br/>
 * 控制器:引导页面<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author fxf 924197212@qq.com
 */
class Action_Festival extends Action
{       
     /**
      * 控制器:节日礼品
      */
     public function lists()
     { 
 		//seo
 		$this->keywords = "上海年货 春节年货 年会礼品 年货厂家 海鲜大礼包 四川腊肉礼盒装 上海厂家 年货团购 年货订购 年货批发 礼品定制 年会奖品 海鲜大礼包 礼品礼盒 礼品定制 礼品厂家 腊肉厂家 海鲜厂家 水产礼盒 土特产 特色食品 上海礼品厂家";
 		$this->description = "上海年货 春节年货 年会礼品 年货厂家 海鲜大礼包 四川腊肉礼盒装 上海厂家 年货团购 年货订购 年货批发 礼品定制 年会奖品 海鲜大礼包 礼品礼盒 礼品定制 礼品厂家 腊肉厂家 海鲜厂家 水产礼盒 土特产 特色食品 上海礼品厂家";
		
        $this->loadCss("resources/css/festival.css");
        $this->loadJs("js/festival.js");
		
		//年货礼包
		$nptype=929;
		$newyear   = Goods::get(array("ptype_id='$nptype'","isUp"=>true,"isShow"=>true),"sort_order desc","0,6");
		foreach($newyear as $goods){
			$product = $goods->product;
			$goods->img = $product->image;
		}
		//通用礼包
		$uptype=930;
		$universal = Goods::get(array("ptype_id='$uptype'","isUp"=>true,"isShow"=>true),"sort_order desc","0,6");
		foreach($universal as $goods){
			$product = $goods->product;
			$goods->img = $product->image;
		}
		//卡券
		$vptype=931;
		$voucher   = Goods::get(array("ptype_id='$vptype'","isUp"=>true,"isShow"=>true),"sort_order desc","0,6");
		foreach($voucher as $goods){
			$product = $goods->product;
			$goods->img = $product->image;
		}
		
		$this->view->set("nptype",$nptype);
		$this->view->set("uptype",$uptype);
		$this->view->set("vptype",$vptype);
		$this->view->set("newyear",$newyear);
		$this->view->set("universal",$universal);
		$this->view->set("voucher",$voucher);
     }
    
}
?>
