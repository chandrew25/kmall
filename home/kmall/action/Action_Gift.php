<?php
/**
 +---------------------------------------<br/>
 * 控制器:礼包馆<br/>
 +---------------------------------------
 * @category ikmall
 * @package web.front.action
 * @author jakeon jakeon@126.com
 */
class Action_Gift extends Action
{
	/**
	 * 礼包馆
	 */
	public function lists()
	{
		$this->loadCss("resources/css/front/iconfont.css");
        $this->loadCss("resources/css/gift.css");
		$this->loadJs("js/brand.js");
		//banner
        $banner = Banner::get("isShow=1 and type=24",'sort desc');
        $this->view->set("banner", $banner);
        //我们的爱从这礼开始-广告
        $banner1 = Banner::get("isShow=1 and type=25",'sort desc','0,4');
        $this->view->set("banner1", $banner1);
        //我们的爱从这礼开始-礼包
        $hotSaleProducts=Product::get("isShow=1 and isUp=1 and isPackage=1",'sort_order desc','0,4');
        $this->view->set("hotSaleProducts", $hotSaleProducts);

        //特别的爱给特别的她-广告
        $banner2 = Banner::get("isShow=1 and type=25",'sort desc','5,4');
        $this->view->set("banner2", $banner2);
        //特别的爱给特别的她-礼包
        $hotSaleProducts2=Product::get("isShow=1 and isUp=1 and isPackage=1",'sort_order desc','5,4');
        $this->view->set("hotSaleProducts2", $hotSaleProducts2);
	}
 
}
?>