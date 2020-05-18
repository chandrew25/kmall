<?php
/**
  * wechat php test
  */
//define your token
define("TOKEN", "foru18");
$wechatObj = new wechatCallbackapiTest();
if (array_key_exists("echostr",$_GET)){
    $wechatObj->valid();
}else{
    $wechatObj->responseMsg();
}

class wechatCallbackapiTest
{
	public function valid()
    {
        $echoStr = $_GET["echostr"];

        //valid signature , option
        if($this->checkSignature()){
            echo $echoStr;
        	$this->responseMsg();
        	exit;
        }
    }

    public function responseMsg()
    {
		//get post data, May be due to the different environments
		$postStr = $GLOBALS["HTTP_RAW_POST_DATA"];

      	//extract post data
		if (!empty($postStr)){
			$resultStr = "";
			$postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
			$fromUsername = $postObj->FromUserName;
			$toUsername = $postObj->ToUserName;
			$keyword = trim($postObj->Content);
			$time = time();
			$textTpl = "<xml>
							<ToUserName><![CDATA[%s]]></ToUserName>
							<FromUserName><![CDATA[%s]]></FromUserName>
							<CreateTime>%s</CreateTime>
							<MsgType><![CDATA[%s]]></MsgType>
							<Content><![CDATA[%s]]></Content>
							<FuncFlag>0</FuncFlag>
							</xml>";
			$msgType = $postObj->MsgType;
			if($msgType == "event"){
				$event = $postObj->Event;
				switch ($event) {
					case "subscribe":
						$contentStr="菲生活网欢迎您!(订阅测试)";
					break;
					case "unsubscribe":
					break;
					case "CLICK":
						$eventKey = $postObj->EventKey;
						switch ($eventKey) {
							case "event1":
								$contentStr="菲生活网欢迎您!(菲生活介绍点击测试)";
							break;
							case "event2":
								$contentStr="菲生活网欢迎您!(手机商城介绍点击测试)";
							default:
								;
							break;
						}
					break;
					default:
						 ;
					break;
				}
				$msgType = "text";
				$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
			}else if(!empty( $keyword)){
				$msgType = "text";
				$contentStr = "惟有你，惟有礼！(消息回复测试)";
				$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
			}
			echo $resultStr;
        }else {
        	echo "";
        	exit;
        }
    }

	private function checkSignature()
	{
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

		$token = TOKEN;
		$tmpArr = array($token, $timestamp, $nonce);
		sort($tmpArr);
		$tmpStr = implode( $tmpArr );
		$tmpStr = sha1( $tmpStr );

		if( $tmpStr == $signature ){
			return true;
		}else{
			return false;
		}
	}
}

?>
