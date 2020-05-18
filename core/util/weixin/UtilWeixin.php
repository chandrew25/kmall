<?php
/**
 * 微信客接口
 * @category betterlie
 * @package util.weixin
 */
class UtilWeixin extends Util 
{
	static function GET_Api($url,$PostData){
		$o = '';	 
		foreach ($PostData as $k => $v )
		{
			 $o .= "$k=" . urlencode ( $v ) . "&" ;
		}
		$post_data = substr ( $o , 0 ,- 1 ) ;
		return file_get_contents($url.$post_data);
	}

	static function POST_Api($url,$PostData)
	{	
		//请求参数为get方式
		$curl = curl_init();
		// 设置你需要抓取的URL
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl , CURLOPT_POSTFIELDS , $PostData ) ;
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

	//获取token
    function token(){
		$PostData['grant_type']='client_credential';
		$PostData['appid']= Gc::$AppId;
		$PostData['secret']= Gc::$AppSecret;
		$result = self::POST_Api(Gc::$ApiURL."cgi-bin/token?",$PostData);
		$data = json_decode($result);
		return $data->access_token;
	}

	//获取关注者列表接口 
	function user_get(){
		$PostData['access_token'] = self::token();
		$PostData['next_openid'];
		$result = self::POST_Api(Gc::$ApiURL."cgi-bin/user/get?",$PostData);
		$data = json_decode($result);
		$userlist = array();
		if($data->total >0){
			foreach ($data->data->openid as $key => $value) {
				$userlist[]=self::user_info($value);
			}
		}
		return $userlist;
	}

	//获取微信用户信息
	function user_info($openid){
		$PostData['access_token'] = self::token();
		$PostData['openid'] = $openid;
		$result = self::POST_Api(Gc::$ApiURL."cgi-bin/user/info?",$PostData);
		$data = json_decode($result);
		return $data;
	}

	function access_token($code){
		$PostData['code']= $code;
		$PostData['appid']= Gc::$AppId;
		$PostData['secret']= Gc::$AppSecret;
		$PostData['grant_type']='authorization_code';
		$result = self::POST_Api(Gc::$ApiURL."sns/oauth2/access_token?",$PostData);
		$data = json_decode($result);
		return $data;
	}

	function refresh_token($code){
		$data = self::access_token($code);
		$PostData['grant_type']='refresh_token';
		$PostData['appid']= Gc::$AppId;
		$PostData['refresh_token']= 'REFRESH_TOKEN';
		$result = self::POST_Api(Gc::$ApiURL."sns/oauth2/refresh_token?",$PostData);
		$data = json_decode($result);
		return $data;
	}

    function send($data){
		$access_token = self::token();
		$url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=".$access_token;
		$data = json_encode($data);
		$result = self::POST_Api($url,$data);
		// $data = json_decode($result);
		return $result;
	}

	function meun(){
		$PostData['access_token'] = self::token();
		$PostData['body'] = json_encode(array(
			'button' => array(
				0 =>array(
					"name"=> "粉丝会员",
					"sub_button" => array(
						0=>array(
							"type"=> "click", 
		                    "name"=> "我的帐户", 
		                    "key"=> "userview"
						),
						1=>array(
							"type"=> "click", 
		                    "name"=> "会员权益", 
		                    "url"=> "userinfo"
						),
						2=>array(
							"type"=> "click", 
		                    "name"=> "加入会员", 
		                    "url"=> "adduser"
						)
					)
				),
				1=>array(
					"type"=> "click", 
                    "name"=> "刮刮卡", 
                    "key"=> "SCRATCH_CARD"
				),
			)
		));
		$result = self::POST_Api(Gc::$ApiURL."menu/create?",$PostData);
		$data = json_decode($result);
		return $result;
	}
}