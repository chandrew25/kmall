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
		$code = $_GET['code'];
		$url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxf65aec54da436c29&secret=8ab67330637eb09d9cd4680b1cc933ab&code=".$code."&grant_type=authorization_code";
		$result=file_get_contents($url);
		$data = json_decode($result);
		$openid = $data->openid;
		// $openid = "oRKWzt68QxqScWrMt2EnTKQijfXY";
    	if ($openid) {
    		HttpSession::set("openid", $openid);
    		$urserinfo = Usersinfo::get_one("openid='".$openid."'");
    		if (!empty($urserinfo)) {
    			HttpSession::set("mobile",$urserinfo->mobile);
    			$this->redirect("member", "info");
    		}else{
    			$this->redirect("member", "add");
    		}
        }
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

	public function test(){
		$this->loadCss("resources/css/address.css");
        $this->loadCss("resources/css/msg.css");
        $this->loadJs("js/msg.js"); 
        $this->loadJs("js/order.js");
		$result = UtilWeixin::token();
		
	}
} 
?>