<?php
/**
 +---------------------------------------<br/>
 * 控制器:国家<br/>
 +---------------------------------------
 * @category ikmall
 * @package web.front.action
 * @author jakeon jakeon@126.com
 */
class Action_Country extends Action
{
	/**
	 * 国家馆
	 */
	public function lists()
	{
		$this->loadCss("resources/css/front/iconfont.css");
                $this->loadCss("resources/css/style.css");
		$this->loadJs("js/brand.js");
		//banner
                $banner = Banner::get("isShow=1 and type=18",'sort desc');
                $this->view->set("banner", $banner);
                //广告
                $banner1 = Banner::get_one("isShow=1 and type=19",'sort desc');
                $this->view->set("banner1", $banner1);

                //推荐的4个国家
                $country  = Country::get("isShow=1",'sort_order desc','0,4');
                $this->view->set("country",$country);

                //三个介绍国家
                $country1  = Country::get("isShow=1",'sort_order desc','0,3');
                $this->view->set("country1",$country1);
                //16个国家
                $country2  = Country::get("isShow=1",'sort_order desc','4,16');
                $this->view->set("country2",$country2);

                //待开发国家
                $country3  = Country::get("isShow=0",'sort_order desc','0,11');
                $this->view->set("country3",$country3);
	}
 
}
?>