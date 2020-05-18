<?php
/**
 +---------------------------------------<br/>
 * 控制器:私宠馆<br/>
 +---------------------------------------
 * @category ikmall
 * @package web.front.action
 * @author jakeon jakeon@126.com
 */
class Action_Privatepet extends Action
{
	/**
	 * 私宠馆
	 */
	public function lists()
	{
		$this->loadCss("resources/css/front/iconfont.css");
                $this->loadCss("resources/css/privatepet.css");
		$this->loadJs("js/brand.js");
		//banner
        $banner = Banner::get("isShow=1 and type=26",'sort desc');
        $this->view->set("banner", $banner);

        $products=Product::get("isShow=1 and isUp=1 and ptype_id = 5609",'sort_order desc','0,7');
        $this->view->set("products", $products);
                
	}
 
}
?>