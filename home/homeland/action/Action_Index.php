<?php
/**
 * 控制器:首页     
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Index extends ActionMobile
{        
	/**
	 * 首页
	 */
	public function index()
	{

        //首页banner
        $banner = Banner::get("isShow=1 and type=35",'sort desc');
        $this->view->set("banner", $banner);

        //首页广告
        $banner2 = Banner::get_one("isShow=1 and type=36",'sort desc');
        $this->view->set("banner2", $banner2);

        $ptype_arr=Ptype::get("isShow=1 and level=1 ","sort_order desc","1,8");
        $this->view->set("ptype_arr", $ptype_arr);

        $ptype_goods = Ptype::get("isShow=1 and level=1 ","sort_order desc","1,10");
        if (!empty($ptype_goods)){
            foreach ($ptype_goods as $key=>$value){
                $ptype_goods[$key]['goods']=Product::get("isShow=1 and isUp=1 and ptype_key like '%-".$value->ptype_id."-%'",'sort_order desc','1,4');
            }
        }
        $this->view->set("ptype_goods",$ptype_goods);

	}

	public function addno(){
		$this->loadCss("resources/css/index.css");
		$msg = isset($_GET['msg'])?$_GET['msg']:"";
		if($msg==1){
			$msg = "分类";
			HttpSession::set("foot","type");
		}elseif ($msg==2) {
			$msg = "购物车";
			HttpSession::set("foot","cart");
		}elseif ($msg==3) {
			$msg = "优惠券";
		}else{
			$msg = "正在建设中...";
		}
		$this->view->set("site_name",$msg);
	}

	/**
	 *
	 */
	public function brandinfo(){
		$this->loadCss("resources/css/index.css");
		$this->loadCss("resources/css/myscroll.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/myscroll.js");
        $this->view->set("site_name","品牌介绍");
	}

	public function weixin(){
		$result = UtilWeixin::token();
		var_dump($result);
	}
} 
?>