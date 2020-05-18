<?php
/**
 +----------------------------------------------<br/>
 * 所有采用BootStrap框架的控制器的父类<br/>
 +----------------------------------------------
 * @category kmall
 * @package core.model
 * @author FXF
 */
class ActionMobile extends ActionBasic
{
	/**
	 * 在Action所有的方法执行之前可以执行的方法
	 */
	public function beforeAction()
	{
		$openid = isset($_GET['openid']) ? $_GET['openid'] : "";
		if ( $openid ) {
			HttpSession::set("openid", $openid);
			$member = Member::get_one("openid='" . $openid . "'");
	    	if ($member) {
	            HttpSession::set("memberinfo", $member);
	            HttpSession::set("member_id", $member->member_id);
	            HttpSession::set("cardno", $member->cardno);
	        }
		}
		parent::beforeAction();
	}

	/**
	 * 在Action所有的方法执行之后可以执行的方法
	 */
	public function afterAction()
	{
		$foot = HttpSession::get("foot");
		if ( !$foot ) {
			$foot = "index";
		}
		$member_id = HttpSession::get("member_id");
		$cartnum = 0;
		if ( !empty($member_id) ) {
			$cartnum   = Cart::count("member_id=" . $member_id);
		}
		// if ( empty($cartnum) ) {
		// 	$cartnum = 0;
		// }
		$this->view->set("foot",$foot);
		$this->view->set("cartnum",$cartnum);
		parent::afterAction();
	}
}
?>