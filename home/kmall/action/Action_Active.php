<?php
/**
 +---------------------------------------<br/>
 * 控制器:活动<br/>
 +---------------------------------------
 * @category ikmall
 * @package web.front.action
 * @author jakeon jakeon@126.com
 */
class Action_Active extends Action
{
	/**
	 * 活动
	 */
	public function lists()
	{
        	$this->loadCss("resources/css/front/iconfont.css");
                $this->loadCss("resources/css/active.css");
        	$this->loadJs("js/brand.js");
        	//banner
                $banner = Banner::get("isShow=1 and type=20",'sort desc');
                $this->view->set("banner", $banner);

                //热销排行广告
                $banner1 = Banner::get_one("isShow=1 and type=21",'sort desc');
                $this->view->set("banner1", $banner1);

                //热销排行
                $hotSaleProducts1=Product::get("isShow=1 and isUp=1",'sales_count desc','0,3');
                $hotSaleProducts2=Product::get("isShow=1 and isUp=1",'sales_count desc','4,5');
                $this->view->set("hotSaleProducts1", $hotSaleProducts1);
                $this->view->set("hotSaleProducts2", $hotSaleProducts2);
                //必买清单banner
                $banner2 = Banner::get("isShow=1 and type=22",'sort desc');
                $this->view->set("banner2", $banner2);

                //必买清单广告
                $banner3 = Banner::get("isShow=1 and type=23",'sort desc','0,4');
                $this->view->set("banner3", $banner3);

                $time = time();
                //活动
                $activity = Activity::get("start_time<=".$time." and end_time>=".$time,"commitTime desc");
                $this->view->set("activity", $activity);

        // echo "<pre>";var_dump($activity[1]->getProduct);die;
        
	}

        public function zhuanti1(){

        }

        public function zhuanti2(){
                
        }

        public function zhuanti3(){

























































































































































	    
        }
 
}
?>