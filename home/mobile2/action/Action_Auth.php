<?php
/**
 * 控制器:用户身份验证<br/>
 * User: jason
 * Date: 2019/2/21
 * Time: 12:05 AM
 */
class Action_Auth extends ActionMobile {
	/**
	 * 退出
	 */
	public function logout() {
		HttpSession::remove("member_id");
		HttpSession::remove("member_name");
		HttpCookie::set("username",null);
		HttpCookie::set("password",null);
		HttpCookie::set("remember",null);
		if(Gc::$website_status){
			$header_url=Gc::$url_base."index.html";
			header("location:".$header_url);
		}else{
			$this->redirect("index","index");
		}
	}

	/**
	 * 登录
	 */
	public function login()
	{
		$this->loadCss("resources/css/auth.css");
		$this->loadJs("js/auth.js");
		if(!empty($_POST)){
			$member = $this->model->Member;
			if($member->getUsername()== null|| $member->getPassword()==null){
				$this->view->set("message","用户名或者密码不能为空");
				return ;
			}
			$memberdata = Member::get_one(
				array(
					"username"=>$member->getUsername(),
					"password"=>md5($member->getPassword())
				)
			);
			if (empty($memberdata)){
                $memberdata = Member::get_one(
                  array(
                    "mobile"=>$member->getUsername(),
                    "password"=>md5($member->getPassword())
                  )
                );
			}
			if (empty($memberdata)){
				$this->view->set("message","用户名或者密码错误");
			}else{
				$remember=$this->data["remember"];
				if($remember){
					setcookie("remember",$remember,time()+2592000);
					setcookie("username",$memberdata->username,time()+2592000);
					setcookie("password",$memberdata->password,time()+2592000);
				}
				$member_id=$memberdata->member_id;
				HttpSession::set('member_id',$member_id);
				HttpSession::set('member_name',$memberdata->username);
				HttpSession::remove('validate');
				$backurl=HttpCookie::get("backurl");
				if($backurl){
					setcookie("backurl",null,-1);
					header("location:".$backurl);
					return;
				}
				$this->redirect("member","view","i=1");
			}
		}
	}

	/**
	 * 注册
	 */
	public function register()
	{
		if(empty($this->view->viewObject))
		{
			$this->view->viewObject=new ViewObject();
		}
		UtilCss::loadCssReady($this->view->viewObject,"ajax/jquery/jqueryui/jquery-ui.css",true);
		UtilAjaxJquery::loadJqueryUI($this->view->viewObject,"1.8");
		$this->loadCss("resources/css/datepicker.css");
		$this->loadCss("resources/css/auth.css");
		$this->loadJs("js/utils.js");
		$this->loadJs("js/auth.js");

		if(!empty($_POST)){
			$validate=$this->data['validate'];
			$member = $this->model->Member;
			if($member->getUsername()== null|| $member->getPassword()==null){
				$this->view->set("message","用户名或者密码不能为空");
				return ;
			}
			if(md5($validate) !=HttpSession::get('validate')){
				$this->view->set("message","验证码有误");
				return ;
			}
			$memberdata=Member::get_one(array("username"=>$member->getUsername()));
			if(empty($memberdata)){
				$member->setPassword(md5($member->getPassword()));
				$member->regtime=UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);
				$member->usertype=EnumUsertype::MEMBER;
				$member->isValSms = 1;
				if(empty($member->isCanEmail)) $member->isCanEmail=0;
				if(empty($member->isCanSms)) $member->isCanSms=0;
				$member->regip=UtilNet::client_ip();
        $memberdata = Member::get_one(
          array(
            "mobile"=>$member->getUsername()
          )
        );
        $member->isActive = true;
        if (empty($memberdata)){
				    $member->save();
        } else {
            $member->member_id = $memberdata->member_id;
            $member->update();
        }

				HttpSession::set('member_id',$member->member_id);
				HttpSession::set('member_name',$member->username);
				HttpSession::remove('validate');
				$backurl=HttpCookie::get("backurl");
				if($backurl){
					setcookie("backurl",null,-1);
					header("location:".$backurl);
					return;
				}
				$this->redirect("member","info","i=1");
			}else{
				$this->view->set("message","该用户名已有用户注册！");
			}
		}

		//导航条
		$nav_info->level = 2;
		$nav_info->info = "注册";
		$nav_info->link = Gc::$url_base."index.php?go=kmall.auth.register";
		$this->view->set("nav_info",$nav_info);
	}

	/**
	 * 忘记密码
	 */
	public function forgetPassword()
	{
		$this->loadCss("resources/css/auth.css");
		$this->loadJs("js/forgetPassword.js");
		if(!empty($_POST)){

			$username=$this->data['username'];
			$password=$this->data['password'];
            $validate=$this->data['smsPwd'];
            if($validate !=HttpSession::get("smsPwd")){
                $this->view->set("message","验证码有误");
                return ;
            }
			$memberdata = Member::get_one(array("mobile"=>$username));
            Member::updateProperties($memberdata->member_id,array("password"=>md5($password)));
//            $memberdata->update();
//            HttpSession::remove('smsPwd');
            $this->redirect("auth","login");
        }
	}
}
?>
