<?php
/**
 +---------------------------------------<br/>
 * 控制器:Ajax请求服务<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Ajax extends Action
{
	/**
	 * 获取登录信息
	 */
	public function getLogininfo()
	{
		$member_id=HttpSession::get("member_id");
		if($member_id){//用户已登录
            if($member_id=="thirdpartylogin"){
                $username=HttpSession::get("member_name");
                if(!$username){
                    $username="尊敬的您";
                }
                $memberdata->member_name=$username;
            }else{
                $member=Member::get_by_id($member_id);
                $memberdata->member_name=$member->username;
            }
		}
        //购物车(无需登录)
        $cart=HttpCookie::get(Gc::$appName."_cart");
        if($cart){
            $cart=json_decode($cart);
            $cart=(array)$cart;
            $carttotal=array("totalprice"=>0,"totalcount"=>0);
            foreach($cart as $goods){
                $carttotal["totalcount"]+=$goods->num;
                $carttotal["totalprice"]+=$goods->sales_price*$goods->num;
                $goods->sales_price=number_format($goods->sales_price,2,".","");
            }
            $carttotal["totalcount"]=$carttotal["totalcount"];
            $carttotal["totalprice"]=number_format($carttotal["totalprice"],2,".","");
        }
		echo json_encode(array(
			"member"=>$memberdata,//会员信息
			"cart"=>$cart,//购物车
			"carttotal"=>$carttotal//购物车统计
		));
	}
    
    /**
     * 获取登录信息
     */
    public function getComment()
    {
        $start    = !empty($_REQUEST['start']) ? intval($_REQUEST['start'])+1 : 0;
        $pageSize = 5;
        $limit    = $start.",".$pageSize;
        $product_id=$_REQUEST['product_id'];
        $count=Comment::count(array("product_id=".$product_id,"isShow=1"));
        $comments=Comment::get(array("product_id=".$product_id,"isShow=1"),"add_time desc",$limit);
        if(!$comments){
            $comments="";
        }else{
            foreach($comments as $comment){
                $comment->add_time=UtilDateTime::timestampToDateTime($comment->add_time);
            }
        }
        $now =count($comments);
        echo json_encode(array(
            "comments"=>$comments,//商品评价
            "count"=>$count,//评论总个数
            "now"=>$now//返回的评论个数
        ));
    }
	
	/**
	 * 用户名是否被使用
	 */
	public function checkUsername()
	{
		$username=$_POST["username"];
		$count=Member::count("username='$username'");
		echo json_encode($count>0?"1":"0");
	}
	
	/**
	 * 邮箱是否被使用
	 */
	public function checkEmail()
	{
		$email=$_POST["email"];
		$count=Member::count("email='$email'");
		echo json_encode($count>0?"1":"0");
	}
	
	/**
	* 密码重置
	*/
	public function pwdreset(){
		$username=$_POST["username"];
		$vcode=$_POST["vcode"];
		if(!empty($vcode)&&md5($vcode)==HttpSession::get("validate")){
			$member=Member::get_one("username='$username'");
			if($member!=null){
				if($member->email!=null){
					$maxCount=5;//每天允许发送邮件数量上限
					$sendTime=UtilDateTime::dateToTimestamp(UtilDateTime::now())-86400;
					$sendCount=Pwdreset::count("member_id=".$member->member_id." and sendTime>".$sendTime);
					if($sendCount>=$maxCount){//如果发送邮件数量达到上限，则不发送
						$result->status=4;
					}else{
						//密文：使用当前时间、用户名加密
						$code=md5(UtilDateTime::dateToTimestamp(UtilDateTime::now()).$member->username);
						//链接
						$link=Gc::$url_base."index.php?go=kmall.member.pwdreset&code=".$code;
						$content="<div style='width:660px;line-height:20px;font-size:14px;overflow:hidden;'>"
								."<p>欢迎使用菲彼生活官方商城找回密码功能。请点击以下链接重置您的密码（链接30分钟内有效） ：</p>"
								."<p><a target='_blank' href='".$link."'>".$link."</a></p>"
								."<p style='padding-top:10px'>如果点击以上链接没有反应，请将该网址复制并粘贴到新的浏览器窗口中。</p>"
								."<p style='padding-top:10px'>如果您并未发过此请求，则可能是因为其他用户在尝试重设密码时误输入了您的电子邮件地址而使您收到这封邮件，那么您可以放心的忽略此邮件，无需进一步采取任何操作。</p>"
								."</div>";
						$toname=$member->realname?$member->realname:$member->username;
						$title="菲彼生活官方商城 - 找回密码";
						$the=UtilEmailer::sendEmail("菲彼生活官方商城",$member->email,$toname,$title,$content);
						if($the["success"]){
							//添加记录
							$pwdreset=new Pwdreset();
							$pwdreset->code=$code;
							$pwdreset->member_id=$member->member_id;
							$pwdreset->username=$member->username;
							$pwdreset->sendTime=UtilDateTime::dateToTimestamp(UtilDateTime::now());
							$pwdreset->save();
							$result->status=3;//邮件发送成功
						}else{
							$result->status=2;//帐号未填写电子邮箱
						}
					}
				}else{
					$result->status=2;//帐号未填写电子邮箱
				}
			}else{
				$result->status=1;//用户名不存在
			}
		}else{
			$result->status=0;
		}
		switch($result->status){
			case 0:
				$result->msg="验证码错误";
				break;
			case 1:
				$result->msg="该用户名不存在";
				break;
			case 2:
				$result->msg="该帐号未填写电子邮箱";
				break;
			case 3:
				$result->msg="邮件已发送至您的邮箱，请在30分钟内收信并重置密码。";
				break;
			case 4:
				$result->msg="今天发送邮件过于频繁，请明天再试！";
				break;
		}
		echo json_encode($result);
	}
	
	/**
	 * 登录
	 */
	public function login()
	{
		$username=$_POST["username"];
		$password=$_POST["password"];
		$member=Member::get_one("username='$username'");
		if($member!=null){
			if($member->password==md5($password)){
				HttpSession::set("member_id",$member->member_id);
				HttpSession::set("member_name",$member->username);
				$result->status=2;
				$result->url=$_SERVER['HTTP_REFERER'];
			}else{
				$result->status=1;//密码错误
			}
		}else{
			$result->status=0;//用户名不存在
		}
		echo json_encode($result);
	}
	
	/**
	* 注册
	*/
	public function register()
	{
		$email=$_POST["email"];
		$username=$_POST["username"];
		$password=$_POST["password"];
		$vcode=$_POST["vcode"];
		if(!empty($vcode)&&md5($vcode)==HttpSession::get("validate")){
			$count=Member::count("email='$email'");
			if($count==0){
				$count=Member::count("username='$username'");
				if($count==0){
					$member=new Member();
					$member->email=$email;
					$member->username=$username;
					$member->password=md5($password);
					$member->regtime=UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);
					$member->usertype=EnumUsertype::MEMBER;
					$member->regip=UtilNet::client_ip();
					$member->save();
					
					HttpSession::set("member_id",$member->member_id);
					HttpSession::set("member_name",$member->username);
					$result->status=2;
					$result->url=$_SERVER['HTTP_REFERER']; 
				}else{
					$result->status=1;//用户名已被注册
				}
			}else{
				$result->status=3;//邮箱已被使用
			}
		}else{
			$result->status=0;//验证码错误
		}
		echo json_encode($result);
	}
	
	/**
	* 邮箱注册
	*/
	public function emailregister()
	{
		$email=$_POST["email"];
		$count=Member::count("username='$email'");
		if($count==0){
			$result->status=1;//邮箱可以被注册
		}else{
			$result->status=0;//邮箱已被使用
		}
		echo json_encode($result);
	}
    
    /**
     * 确认验证码
     */
    public function checkIdentify()
    {
        $identify=trim($_POST["identify"]);
        $phonenumber=trim($_POST["phonenumber"]);
        $seidentify=HttpSession::get(Gc::$appName."_identify_code");
        $sephone=HttpSession::get(Gc::$appName."_phone_number");
        if($identify==$seidentify&&$phonenumber==$sephone){
            //用户操作信息
            HttpSession::set(Gc::$appName."_identify_code_return",$seidentify);
            $result=true;
        }else{
            $result=false;
        }
        echo json_encode($result);
    }
}
?>
