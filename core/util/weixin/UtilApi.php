<?php
require_once("config.inc.php");
// require_once("function_class.php");
/**
 * 回头客接口
 * @category betterlie
 * @package util.email
 * @subpackage phpmailer
 */
class UtilApi extends Util
{

	static function GET_Api($url, $PostData) {
	    $o = "";
	    foreach ($PostData as $k => $v) {
	        $o .= "$k=" . urlencode($v) . "&";
	    }
	    $post_data = substr($o, 0, - 1);
	    return file_get_contents($url . $post_data);
	}

	static function POST_Api($url, $PostData) {
	    $o = "";
	    foreach ($PostData as $k => $v) {
	        $o .= "$k=" . urlencode($v) . "&";
	    }
	    $post_data = substr($o, 0, - 1);

	    //echo $url.$post_data;die();
	    //请求参数为get方式
	    $curl = curl_init();
	    // 设置你需要抓取的URL
	    curl_setopt($curl, CURLOPT_URL, $url);
	    curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
	    // 设置cURL 参数，要求结果保存到字符串中还是输出到屏幕上。
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

	    curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 5);
	    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);

	    // 运行cURL，请求网页
	    $rdata = curl_exec($curl);

	    // 关闭URL请求
	    curl_close($curl);
	    return $rdata;
	}

	/*
	 * rc4加密算法
	 * $pwd 密钥
	 * $data 要加密的数据
	 */

	static function RC4($pt, $key = H_PASS) {
	    $s = array();
	    for ($i = 0; $i < 256; $i++) {
	        $s[$i] = $i;
	    }
	    $j = 0;
	    $x;
	    for ($i = 0; $i < 256; $i++) {
	        $j = ($j + $s[$i] + ord($key[$i % strlen($key)])) % 256;
	        $x = $s[$i];
	        $s[$i] = $s[$j];
	        $s[$j] = $x;
	    }
	    $i = 0;
	    $j = 0;
	    $ct = '';
	    $y;
	    for ($y = 0; $y < strlen($pt); $y++) {
	        $i = ($i + 1) % 256;
	        $j = ($j + $s[$i]) % 256;
	        $x = $s[$i];
	        $s[$i] = $s[$j];
	        $s[$j] = $x;
	        $ct .= $pt[$y] ^ chr($s[($s[$i] + $s[$j]) % 256]);
	    }

	    $length = strlen($ct);
	    $cipher = '';
	    for ($i = 0; $i < $length; $i++) {
	        $cipher .= sprintf('%02s', dechex(ord($ct[$i])));
	    }

	    $ct = $cipher;

	    return $ct;
	}
	//新增会员
	public static function member_add($data){
		$realname			 = trim($data['realname']);
		$password			 = trim($data['password']);
		$mobile				 = trim($data['mobile']);
		$email				 = trim($data['email']);
		$birthday			 = trim($data['birthday']);
		$gender				 = trim($data['gender']);

		//RC4密码
		$password = self::RC4($password,ApiKey);
		$time = time();
		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['realname']		 = $realname;
		$PostData['password']		 = $password;
		$PostData['mobile']			 = $mobile;
		$PostData['birthday']		 = $birthday;
		$PostData['gender']			 = $gender;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$realname.$password.$mobile.$birthday.$gender.$time.ApiKey);
		$result = self::POST_Api(ApiURL."member_add.php?",$PostData);
		return json_decode($result);
	}

	//登录
	public static function login($cardno,$passwd){
		//RC4密码
		$password = self::RC4($passwd,DefaultKey);
		//$password = RC4(TestCardPwd,ApiKey);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']		 = sbs_id;
		$PostData['card_no']	 = $cardno;
		$PostData['password']	 = $password;
		$PostData['t']			 = $time;
		$PostData['sign']		 = md5(sbs_id.$cardno.$password.$time.ApiKey);

		$result = self::POST_Api(ApiURL."app_login.php",$PostData);
		return json_decode($result);
	}
	//获取会员信息
	public static function getMember($cardno,$passwd=""){
		//RC4密码
		$cardno = trim($cardno);
		$passwd = trim($passwd);

		$password = self::RC4($passwd,ApiKey);
		$time = time();
		$PostData = array();

		$PostData['sbs_id']		 = sbs_id;
		$PostData['card_no']	 = $cardno;
		$PostData['password']	 = $password;
		$PostData['t']			 = $time;
		$PostData['sign']		 = md5(sbs_id.$cardno.$password.$time.ApiKey);

		$result = self::GET_Api(ApiURL."get_member.php?",$PostData);
		return json_decode($result);
	}

    //修改会员信息
	public static function modify_member($data){
		$cardno		 = trim($data['cardno']);
		$passwd		 = trim($data['passwd']);
		$realname	 = trim($data['realname']);
		$gender		 = trim($data['gender']);
		$birthday	 = trim($data['birthday']);
		$idnum		 = trim($data['idnum']);
		$phone		 = trim($data['phone']);
		$mobile		 = trim($data['mobile']);
		$email		 = trim($data['email']);
		$province	 = trim($data['province']);
		$city		 = trim($data['city']);
		$area		 = trim($data['area']);
		$address	 = trim($data['address']);
		$zipcode	 = trim($data['zipcode']);
		$ext_ids	 = trim($data['ext_ids']);
		$ext_values	 = trim($data['ext_values']);
		$str	 = trim($data['str']);
		//RC4密码
		$password = self::RC4($passwd,ApiKey);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']		 = sbs_id;
		$PostData['card_no']	 = $cardno;
		$PostData['password']	 = $password;
		$PostData['realname']	 = $realname;
		$PostData['gender']		 = $gender;
		$PostData['birthday']	 = $birthday;
		$PostData['idnum']		 = $idnum;
		$PostData['phone']		 = $phone;
		$PostData['mobile']		 = $mobile;
		$PostData['email']		 = $email;
		$PostData['province']	 = $province;
		$PostData['city']		 = $city;
		$PostData['area']		 = $area;
		$PostData['address']	 = $address;
		$PostData['zipcode']	 = $zipcode;
		$PostData['ext_ids']	 = $ext_ids;
		$PostData['ext_values']	 = $ext_values;
		$PostData['str']	     = $str;
		$PostData['t']			 = $time;
		$PostData['sign']		 = md5(sbs_id.$cardno.$password.$realname.$gender.$birthday.$idnum.$phone.$mobile.$email.$province.$city.$area.$address.$zipcode.$ext_ids.$ext_values.$time.ApiKey);
		$result = self::POST_Api(ApiURL."modify_member.php?",$PostData);
		return json_decode($result);
	}

	//绑卡
	public static function card_bind($data){
		$cardno				 = trim($data['cardno']);
		$password			 = trim($data['password']);
		$mobile				 = trim($data['mobile']);

		//RC4密码
		$password = self::RC4($password,ApiKey);
		$time = time();
		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['card_no']		 = $cardno;
		$PostData['password']		 = $password;
		$PostData['mobile']			 = $mobile;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$cardno.$password.$mobile.$time.ApiKey);
		$result = self::POST_Api(ApiURL."modify_member.php?",$PostData);
		return json_decode($result);
	}

	//交易记录
	public static function view_invoice($data){
		$cardno			 = trim($data['cardno']);
		$type			 = trim($data['type']);
		$sdate			 = trim($data['sdate']);
		$edate			 = trim($data['edate']);
		$page			 = trim($data['page']);


		//RC4密码
		// $password = RC4($passwd,ApiKey);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['card_no']		 = $cardno;
		$PostData['type']			 = $type;
		$PostData['sdate']			 = $sdate;
		$PostData['edate']			 = $edate;
		$PostData['page']			 = $page;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$cardno.$type.$sdate.$edate.$page.$time.ApiKey);
		$result = self::GET_Api(ApiURL."view_invoice.php?",$PostData);
		return json_decode($result);
	}

	//日志
	public static function get_card_opt($data){
		$store_id			 = trim($data['store_id']);
		$card_no			 = trim($data['cardno']);
		$type			 = trim($data['type']);
		$stime			 = trim($data['sdate']);
		$etime			 = trim($data['edate']);
		$page			 = trim($data['page']);


		//RC4密码
		// $password = RC4($passwd,ApiKey);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['store_id']		 = $store_id;
		$PostData['card_no']		 = $card_no;
		$PostData['type']			 = $type;
		$PostData['stime']			 = $stime;
		$PostData['etime']			 = $etime;
		$PostData['page']			 = $page;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$store_id.$card_no.$type.$etime.$etime.$page.$time.ApiKey);
		$result = self::GET_Api(ApiURL."get_card_opt.php?",$PostData);
		return json_decode($result);
	}


	//券返回规则
	public static function rule_range($type=0){
		$time = time();
		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['type']		 = $type;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$type.$time.ApiKey);
		$result = self::GET_Api(ApiURL.'rule_range.php?',$PostData);
		return json_decode($result);
	}

	//购买卡
	public static function buy_card_no($data){
		$card_num		 = trim($data['card_num']);
		$order_number	 = trim($data['order_number']);

		//RC4密码
		$password = self::RC4($passwd,ApiKey);
		$time = time();
		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['card_num']		 = $card_num;
		$PostData['order_number']	 = $order_number;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$card_num.$order_number.$time.ApiKey);
		$result = self::POST_Api(ApiURL."buy_card_no.php?",$PostData);
		return json_decode($result);
	}

	//门店用户登录
    public static function store_login($data) {
        $username = trim($data['username']);
        $password = trim($data['password']);
        $time = time();

        $PostData = array();
        $PostData['sbs_id'] = sbs_id;
        $PostData['username'] = $username;
        $PostData['password'] = $password;
        $PostData['t'] = $time;
        $PostData['sign'] = md5(sbs_id . $username . $password . $time . ApiKey);
        $result = self::POST_Api(ApiURL . "store_login.php?", $PostData);
        return json_decode($result);
    }

    //会员列表
    public static function get_card($data){
        $offset = trim($data['offset']);
        $limit = trim($data['limit']);
        $keys = trim($data['keys']);
        $values = trim($data['values']);
        $time = time();

        $PostData = array();
        $PostData['sbs_id'] = sbs_id;
        $PostData['offset'] = $offset;
        $PostData['limit'] = $limit;
        $PostData['keys'] = $keys;
        $PostData['values'] = $values;
        $PostData['t'] = $time;
        $PostData['sign'] = md5(sbs_id . $offset . $limit . $keys . $values . $time . ApiKey);
        $result = self::GET_Api(ApiURL ."get_card.php?", $PostData);
        return json_decode($result);
    }

    //用户信息
    public static function get_store($user_id){
        $user_id = trim($user_id);
        $time = time();

        $PostData = array();
        $PostData['sbs_id'] = sbs_id;
        $PostData['user_id'] = $user_id;
        $PostData['t'] = $time;
        $PostData['sign'] = md5(sbs_id . $user_id . $time . ApiKey);
        $result = self::GET_Api(ApiURL ."get_store.php?", $PostData);
        return json_decode($result);
    }

    //会员充值
    public static function charge($data){
        $cardno          = trim($data['cardno']);
        $amount          = trim($data['amount']);
        $order_number    = trim($data['order_number']);
        $store_id        = trim($data['store_id']);

        $time = time();

        $PostData = array();
        $PostData['sbs_id']          = sbs_id;
        $PostData['card_no']         = $cardno;
        $PostData['amount']          = $amount;
        $PostData['order_number']    = $order_number;
        $PostData['store_id']        = $store_id;
        $PostData['t']               = $time;
        $PostData['sign']            = md5(sbs_id.$cardno.$amount.$order_number.$store_id.$time.ApiKey);
        $result = self::POST_Api(ApiURL.'charge.php?',$PostData);
        return json_decode($result);
    }

    //卡激活
    public static function card_active($data){
        $card_no		 = trim($data['card_no']);
		$passwd			 = trim($data['passwd']);
		$mobile			 = trim($data['mobile']);
		$birthday		 = trim($data['birthday']);
		$store_id		 = trim($data['store_id']);
		//RC4密码
		$password = self::RC4($passwd,ApiKey);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['store_id']	     = $store_id;
		$PostData['card_no']		 = $card_no;
		$PostData['password']		 = $password;
		$PostData['mobile']			 = $mobile;
		$PostData['birthday']		 = $birthday;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$store_id.$card_no.$password.$mobile.$birthday.$time.ApiKey);

		$result = self::POST_Api(ApiURL."card_active.php?",$PostData);

        return json_decode($result);
    }

    //卡支付
    public static function trade($data){
        $cardno          = trim($data['cardno']);
        $passwd          = trim($data['passwd']);
        $saving_sub      = trim($data['saving_sub']);
        $cash            = trim($data['cash']);
        $bank_amount     = trim($data['bank_amount']);
        $point_sub       = trim($data['point_sub']);
        $order_number    = trim($data['order_number']);
        $store_id        = trim($data['store_id']);
        $coupon_pwd      = trim($data['coupon_pwd']);

        //RC4密码
        $password = self::RC4($passwd,ApiKey);


        $time = time();

        $PostData = array();
        $PostData['sbs_id']          = sbs_id;
        $PostData['card_no']         = $cardno;
        $PostData['password']        = $password;
        $PostData['saving_sub']      = $saving_sub;
        $PostData['cash']            = $cash;
        $PostData['bank_amount']     = $bank_amount;
        $PostData['point_sub']       = $point_sub;
        $PostData['order_number']    = $order_number;
        $PostData['store_id']        = $store_id;
        $PostData['coupon_pwd']      = $coupon_pwd;
        $PostData['t']               = $time;
        $PostData['sign']            = md5(sbs_id.$cardno.$password.$saving_sub.$cash.$bank_amount.$point_sub.$order_number.$store_id.$coupon_pwd.$time.ApiKey);
        $result = self::POST_Api(ApiURL.'trade.php?',$PostData);
        return json_decode($result);
    }

    //卡挂失
    public static function report_lost($data){
    	$cardno	= trim($data['card_no']);
		$password	= trim($data['password']);
		//RC4密码
		$password = self::RC4($password,ApiKey);
		$time = time();
		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['card_no']		 = $cardno;
		$PostData['password']		 = $password;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$cardno.$password.$time.ApiKey);
		$result = self::POST_Api(ApiURL."report_lost.php?",$PostData);
		return json_decode($result);
    }

    //转账
    public static function transfer($data){
    	$from_card_no	 = trim($data['from_card_no']);
		$passwd			 = trim($data['passwd']);
		$to_card_no		 = trim($data['to_card_no']);
		$user_balance	 = trim($data['user_balance']);
		$order_number	 = trim($data['order_number']);
		$store_id		 = trim($data['store_id']);
		//RC4密码
		$password = self::RC4($passwd,ApiKey);
		$time = time();
		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['from_card_no']	 = $from_card_no;
		$PostData['password']		 = $password;
		$PostData['to_card_no']		 = $to_card_no;
		$PostData['user_balance']	 = $user_balance;
		$PostData['order_number']	 = $order_number;
		$PostData['store_id']		 = $store_id;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$from_card_no.$password.$to_card_no.$user_balance.$order_number.$store_id.$time.ApiKey);
		$result = self::POST_Api(ApiURL."transfer.php?",$PostData);
		return json_decode($result);
    }

    //卡修改密码
    public static function update_password($data){
    	$cardno				 = trim($data['card_no']);
		// $oldpassword		 = trim($data['oldpassword']);
		$newpassword		 = trim($data['newpassword']);
		//RC4密码
		// $oldpassword = self::RC4($oldpassword,ApiKey);
		$newpassword = self::RC4($newpassword,ApiKey);
		$time = time();
		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['card_no']		 = $cardno;
		// $PostData['oldpassword']	 = $oldpassword;
		$PostData['newpassword']	 = $newpassword;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$cardno.$newpassword.$time.ApiKey);
		$result = self::POST_Api(ApiURL."update_password.php?",$PostData);
		return json_decode($result);
    }

    //关注送优惠券
	function bindCoupon($mobile){
		$user_mobile = trim($mobile);
		$time = time();
		$PostData = array();
		$PostData['sbs_id']	 = sbs_id;
		$PostData['user_mobile'] = $user_mobile;
		$PostData['uniacid'] = $uniacid;
		$PostData['t']	= $time;
		$PostData['sign']= md5(sbs_id.$user_mobile.$uniacid.$time.ApiKey);
		$result = self::POST_Api(ApiURL."bindCoupon.php?",$PostData);
		return json_decode($result);
	}

    //查询会员优惠券
	public static function buy_coupon($data){
		$user_mobile = trim($data['user_mobile']);
		$status = trim($data['status']);
		$inv_type = trim($data['inv_type']);
		//RC4密码
		$time = time();

		$PostData = array();
		$PostData['sbs_id']		 = sbs_id;
		$PostData['user_mobile'] = $user_mobile;
		$PostData['status'] = $status;
		$PostData['inv_type'] = $inv_type;
		$PostData['t']	= $time;
		$PostData['sign']= md5(sbs_id.$user_mobile.$status.$inv_type.$time.ApiKey);
		$result = self::POST_Api(ApiURL."buy_coupon.php?",$PostData);
		return json_decode($result);

	}

	//撤销
	public function trade_cancel($data){
		$invoice_id = trim($data['invoice_id']);
		$store_id = trim($data['store_id']);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']		 = sbs_id;
		$PostData['invoice_id'] = $invoice_id;
		$PostData['store_id'] = $store_id;
		$PostData['t']	= $time;
		$PostData['sign']= md5(sbs_id.$store_id.$invoice_id.$time.ApiKey);
		$result = self::POST_Api(ApiURL."trade_cancel.php?",$PostData);
		return json_decode($result);
	}

	//加减券
	public function decrease_point($data){
		$store_id		 = trim($data['store_id']);
		$cardno			 = trim($data['card_no']);
		$point		     = trim($data['point']);
		$comment		 = trim($data['comment']);
		$emp		     = trim($data['emp']);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']			 = sbs_id;
		$PostData['store_id']		 = $store_id;
		$PostData['card_no']		 = $cardno;
		$PostData['point']		     = $point;
		$PostData['comment']		 = $comment;
		$PostData['emp']		     = $emp;
		$PostData['t']				 = $time;
		$PostData['sign']			 = md5(sbs_id.$store_id.$cardno.$point.$comment.$emp.$time.ApiKey);
		$result = self::GET_Api(ApiURL."decrease_point.php?",$PostData);
		return json_decode($result);
	}

	//根据订单号查询记录
	public function get_order($data){
		$order_number = trim($data['order_number']);
		$store_id = trim($data['store_id']);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']		 = sbs_id;
		$PostData['order_number'] = $order_number;
		$PostData['store_id'] = $store_id;
		$PostData['t']	= $time;
		$PostData['sign']= md5(sbs_id.$order_number.$time.ApiKey);
		$result = self::GET_Api(ApiURL."get_order.php?",$PostData);
		return json_decode($result);
	}

	//换卡
	public function replace_card($data){
		$store_id = trim($data['store_id']);
		$emp_no = trim($data['emp_no']);
		$oldcard = trim($data['old_card']);
		$newcard = trim($data['new_card']);
		$oldpwd = trim($data['password']);
		$newpwd = trim($data['new_password']);
		$code = "";
		$encoding = "";
		$time = time();
		$oldpwds = self::RC4($oldpwd,ApiKey);
		$newpwds = self::RC4($newpwd,ApiKey);

		$PostData = array();
		$PostData['sbs_id']		 = sbs_id;
		$PostData['store_id'] = $store_id;
        $PostData['emp_no'] = $emp_no;
        $PostData['old_card'] = $oldcard; //被补办的卡号
        $PostData['new_card'] = $newcard; //补办的卡号
        $PostData['password'] = $oldpwds; //原始卡密码
        $PostData['new_password'] = $newpwds; //新密码
        $PostData['code'] = $code;
        $PostData['encoding'] = $encoding;
		$PostData['t']	= $time;
		$PostData['sign']= md5(sbs_id.$store_id.$emp_no.$oldcard.$newcard.$oldpwds.$newpwds.$code.$encoding.$time.ApiKey);
		$result = self::POST_Api(ApiURL."replace_card.php?",$PostData);
		return json_decode($result);
	}
	//报表
	public function app_total($data){
		$store_id = trim($data['store_id']);
		$sdate = trim($data['sdate']);
		$edate = trim($data['edate']);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']		 = sbs_id;
		$PostData['store_id'] = $store_id;
		$PostData['start_date'] = $sdate;
		$PostData['end_date'] = $edate;
		$PostData['t']	= $time;
		$PostData['sign']= md5(sbs_id.$store_id.$sdate.$edate.$time.ApiKey);
		$result = self::GET_Api(ApiURL."app_total.php?",$PostData);
		return json_decode($result);
	}
	//发送短信
	public function send_sms($data){
		$mobile = trim($data['mobile']);
		$contents = trim($data['contents']);
		$time = time();

		$PostData = array();
		$PostData['sbs_id']		 = sbs_id;
		$PostData['mobile'] = $mobile;
		$PostData['contents'] = $contents;
		$PostData['t']	= $time;
		$PostData['sign']= md5(sbs_id.$mobile.$contents.$time.ApiKey);
		$result = self::GET_Api(ApiURL."send_sms.php?",$PostData);
		return json_decode($result);
	}

	//验证优惠券
	public static function get_coupon($coupon_pwd){
		$time = time();
        $PostData = array();
        $PostData['sbs_id'] = sbs_id;
        $PostData['coupon_pwd'] = $coupon_pwd;
        $PostData['t'] = $time;
        $PostData['sign'] = md5(sbs_id.$coupon_pwd.$time.ApiKey);
        $result = self::POST_Api(ApiURL."get_coupon.php?", $PostData);
        return json_decode($result);
	}

	//兑换券
    public static function exchange_coupon($data) {
        $store_id = trim($data['store_id']);
        $emp_no = trim($data['emp_no']);
        $card_no = trim($data['card_no']);
        $coupon_id = trim($data['coupon_id']);
        $coupon_amount = trim($data['coupon_amount']);
        //RC4密码
        $time = time();

        $PostData = array();
        $PostData['sbs_id'] = sbs_id;
        $PostData['store_id'] = $store_id;
        $PostData['emp_no'] = $emp_no;
        $PostData['card_no'] = $card_no;
        $PostData['coupon_id'] = $coupon_id;
        $PostData['coupon_amount'] = $coupon_amount;
        $PostData['t'] = $time;
        $PostData['sign'] = md5(sbs_id.$store_id.$emp_no.$card_no.$coupon_id.$coupon_amount.$time.ApiKey);
        $result = self::POST_Api(ApiURL."exchange_coupon.php?", $PostData);
        return json_decode($result);
    }
}

?>
