<?php
/**
 * 接口凭证
 * @author FXF
 *
 */
class AccessToken{
	private $APPID="wx38e05cd1e77f4da3";
	private $APPSECRET="a8efbdc4a674472838f41824f6aae8ca";
	const ACCESS_TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
	private $access_token;
	private $expires_in;
	
	public function getAccess_token(){
		return $this->access_token;
	}
	
	private function setAccess_token($access_token){
		$this->access_token = $access_token;
	}
	
	public function getExpires_in(){
		return $this->expires_in;
	}
	
	private function setExpires_in($expires_in){
		$this->expires_in = $expires_in;
	}
	
	/**
	 * 请求Access_Token
	 */
	public function requestAccessToken() {
		$url=$this->genAccessTokenUrl();//生成access_token请求url
		$result=UtilWeChat::curl_get($url);//发送https get请求
		$access_token=json_decode($result);
		$this->setAccess_token($access_token->access_token);
		$this->setExpires_in($access_token->expires_in);
	}
	
	private function genAccessTokenUrl(){
		$url=self::ACCESS_TOKEN_URL;
		$url=str_replace("APPID",$this->APPID,$url);
		$url=str_replace("APPSECRET",$this->APPSECRET,$url);
		return $url;
	}
}
?>