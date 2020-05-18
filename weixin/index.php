<?php

include '../init.php';
//定义您的标识
define("TOKEN", "weixin"); //请将 "weixin" 改为您命名的 TOKEN
$wechatObj = new wechat();
if
 (isset($_GET['echostr'])) {
    $wechatObj->valid();
} else {
    $wechatObj->responseMsg();
}

class wechat {

    public function valid() {
        $echoStr = $_GET["echostr"];
        //有效签名，选项
        if
        ($this->checkSignature()) {
            echo $echoStr;
            exit;
        }
    }

    private function checkSignature() {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        $token = TOKEN;
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);

        if
        ($tmpStr == $signature) {
            return true;
        } else {
            return false;
        }
    }

    public function responseMsg() {
        //接收数据
        //使用 get 亦或 post 数据，取决于不同环境
        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
        //获取 post 数据
        if (!empty($postStr)) {
            //用 SimpleXML 解析 post 过来的 XML 数据
            $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
            $type = trim($postObj->MsgType);
            //判断数据类型
            switch ($type) {
                case "text":
                    $resultStr = $this->receiveText($postObj);
                    break;
                case "image":
                    $resultStr = $this->receiveImg($postObj);
                    break;
                case "event":
                    $resultStr = $this->receiveEvent($postObj);
                    break;
                default:
                    $resultStr = "unknow msg type: " . $type;
                    break;
            }
//             $resultStr =  mb_convert_encoding($resultStr,"UTF-8","GBK");
           // var_dump($resultStr);
            echo $resultStr; //输出结果
        } else {
            echo "";
            exit;
        }
    }

    private function receiveText($object) {
        $funcFlag = 0;
        $keyword = trim($object->Content); //获取消息内容
        $resultStr = "";
        $contentStr = "";
        $resultStr = $this->transmitText($object, $contentStr, $funcFlag);
        return $resultStr;
    }

    private function receiveImg($object) {
        $mediaid = "";
        $picurl = 'http://www.phoebelife.com/upload/weixin.jpg';
        $resultStr = $this->transmitImg($object, $picurl, $mediaid);
        return $resultStr;
    }

    private function receiveEvent($object) {
        $title = "";
        $description = "";
        $url = "";
        switch ($object->Event) {
            case "subscribe":
                //关注後自动推送消息
                $url = "http://www.phoebelife.com/index.php?go=mobile.index.index&openid=" . $object->FromUserName;
                $resultStr = "<xml>
                    <ToUserName><![CDATA[".$object->FromUserName."]]></ToUserName>
                    <FromUserName><![CDATA[".$object->ToUserName."]]></FromUserName>
                    <CreateTime>".time()."</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>
                    <ArticleCount>2</ArticleCount>
                    <Articles>
                    <item>
                    <Title><![CDATA[工美]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[http://www.phoebelife.com/upload/weixin.jpg]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    <item>
                    <Title><![CDATA[感谢关注工美，点我加粉丝绑定工美卡，祝您购物愉快哦！]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[http://www.phoebelife.com/upload/weixin.jpg]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    </Articles>
                    </xml>";
                break;
            case "CLICK":
                $resultStr = $this->functionClike($object);
                break;
        }
        return $resultStr;
    }

    private function transmitText($object, $content, $flag = 0) {
        //返回文本消息模板
        $textTpl = "<xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[%s]]></Content>
                    <FuncFlag>%d</FuncFlag>
                    </xml>";
        //格式化消息模板
        $resultStr = sprintf($textTpl, $object->FromUserName, $object->ToUserName, time(), $content, $flag);
        return $resultStr;
    }

    private function transmitImg($object, $picurl, $mediaid, $flag = 0) {
        $imgTpl = "<xml>
                 <ToUserName><![CDATA[%s]]></ToUserName>
                 <FromUserName><![CDATA[%s]]></FromUserName>
                 <CreateTime>%s</CreateTime>
                 <MsgType><![CDATA[image]]></MsgType>
                 <PicUrl><![CDATA[%s]]></PicUrl>
                 <MediaId><![CDATA[%s]]></MediaId>
                 <MsgId>%s</MsgId>
                 </xml>";
        //格式化消息模板
        $resultStr = sprintf($imgTpl, $object->FromUserName, $object->ToUserName, time(), $picurl, $mediaid, $flag);
        return $resultStr;
    }

    private function transmitLink($object, $title, $description, $url, $flag = 0) {
        $linkTpl = "<xml>
                <ToUserName><![CDATA[%s]]></ToUserName>
                <FromUserName><![CDATA[%s]]></FromUserName>
                <CreateTime>%s</CreateTime>
                <MsgType><![CDATA[link]]></MsgType>
                <Title><![CDATA[%s]]></Title>
                <Description><![CDATA[%s]]></Description>
                <Url><![CDATA[%s]]></Url>
                <MsgId>%s</MsgId>
                </xml>";
        //格式化消息模板
        $resultStr = sprintf($linkTpl, $object->FromUserName, $object->ToUserName, time(), $title, $description, $url, $flag);
        return $resultStr;
    }

    private function transmitImgText($object, $title, $description, $picurl, $url) {
        $imgtextTpl = "<xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>
                    <ArticleCount>1</ArticleCount>
                    <Articles>
                    <item>
                    <Title><![CDATA[%s]]></Title>
                    <Description><![CDATA[%s]]></Description>
                    <PicUrl><![CDATA[%s]]></PicUrl>
                    <Url><![CDATA[%s]]></Url>
                    </item>
                    </Articles>
                    </xml> ";
        //格式化消息模板
        $resultStr = sprintf($imgtextTpl, $object->FromUserName, $object->ToUserName, time(), $title, $description, $picurl, $url);
        return $resultStr;
    }

    private function functionClike($object) {
        switch ($object->EventKey) {
            case "MEMBER_ADD":
                $resultStr = $this->member_add($object);
                break;
            case "MEMBER_RIGHTS":
                $resultStr = $this->member_rights($object);
                break;
            case "MEMBER":
                $resultStr = $this->member($object);
                break;
            case "SCRATCH_CARD":
                $resultStr = $this->scratch_card($object);
                break;
            case "GOODS":
                $resultStr = $this->goods($object);
                break;
            case "GOODSHOME":
                $resultStr = $this->goodshome($object);
                break;
			case "ADDRESS":
                $resultStr = $this->address($object);
                break;
            case "PAYMENT":
                $resultStr = $this->payment($object);
                break;
        }
       // $resultStr = $this->member_add($object);
        return $resultStr;
    }
    private function payment($object){
          $url = "http://www.phoebelife.com/payment/wechat/js_api_call.php?o=" . $object->FromUserName;
          $resultStr = "<xml>
                    <ToUserName><![CDATA[".$object->FromUserName."]]></ToUserName>
                    <FromUserName><![CDATA[".$object->ToUserName."]]></FromUserName>
                    <CreateTime>".time()."</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>
                    <ArticleCount>2</ArticleCount>
                    <Articles>
                    <item>
                    <Title><![CDATA[微信支付测试]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[http://www.phoebelife.com/upload/weili.jpg]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    <item>
                    <Title><![CDATA[微信支付测试，微信支付测试，微信支付测试]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    </Articles>
                    </xml>";
        return $resultStr;
    }
	private function address($object){
        $contentStr = "";
        $resultStr = $this->transmitText($object,$contentStr, $funcFlag=0);
        return $resultStr;
    }
    private function member_add($object) {
        $data = UtilSend::isMember($object->FromUserName);
        if ($data) {
            $resultStr = $this->istMeber($object,$data);
        } else {
            $resultStr = $this->notMeber($object);
        }
        return $resultStr;
    }
    private function member($object){
        $data = UtilSend::isMember($object->FromUserName);
        if ($data) {
            $balance = $point = 0.00;
            $coupon = array();
            $result = UtilApi::getMember($data->cardno);
            if($result->code == "A00006") {
                $datacard = $result->data;
                $balance = $datacard->user_balance;
                $point = $datacard->user_point;
                $coupon = UtilSend::getCoupon($data->mobile);
            }

            $url = "http://www.phoebelife.com/index.php?go=mobile.member.info&openid=" . $object->FromUserName;
            $picurl = 'http://www.phoebelife.com/upload/weixin.jpg';
            $couponurl = "http://www.phoebelife.com/index.php?go=membership.coupon.index&openid=" . $object->FromUserName;

            $couponStr = "";
            $j = 3;
            if(!empty($coupon)){
                foreach ($coupon as $key => $value) {
                    $str = $value->batch_name."
面值：".$value->amount."(每桌每餐限用一张)
券码：".$value->coupon_pwd."
有效期：".$value->time."
至".$value->exp_date;
                    $couponStr .="<item>
                    <Title><![CDATA[".$str."]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[]]></PicUrl>
                    <Url><![CDATA[".$couponurl."]]></Url>
                    </item>";
                    $j++;
                }
            }
            $resultStr = "<xml>
                    <ToUserName><![CDATA[".$object->FromUserName."]]></ToUserName>
                    <FromUserName><![CDATA[".$object->ToUserName."]]></FromUserName>
                    <CreateTime>".time()."</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>
                    <ArticleCount>".$j."</ArticleCount>
                    <Articles>
                    <item>
                    <Title><![CDATA[出示手机号即可行使权益]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[".$picurl."]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    <item>
                    <Title><![CDATA[储值余额：".$balance."]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    <item>
                    <Title><![CDATA[券余额：".$point."]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    ".$couponStr."
                    </Articles>
                    </xml>";
            return $resultStr;
        } else {
            return $this->notMeber($object);
        }
    }
    private function member_rights($object) {
$contentStr = '1、扫码加入会员，输入工美卡卡号和背面密码区密码，激活工美卡；
2、我的帐户里显示卡内余额和消费券；
3、点击兑换商城，进入后选择商品，填写配送地址下单，用卡内余额支付；
4、礼品配送到家，任何疑问可以打400-033-0923热线咨询'; //返回消息内容
        $resultStr = $this->transmitText($object,$contentStr, $funcFlag=0);
        return $resultStr;
    }
    private function scratch_card($object){
        $data = UtilSend::scratch_card($object->FromUserName);
        if ($data) {
            $description = "您有一个张刮刮卡！请进入刮刮卡活动中心刮奖..";
        }else{
            $description = "谢谢您的关注！您目前拥护有0张刮刮卡，详情请进入刮刮卡活动中心..";
        }
        $title = "欢迎进入菲生活商城";
        $url = "http://www.phoebelife.com/index.php?go=mobile.goods.lists&openid=" . $object->FromUserName;
        $picurl = 'http://www.phoebelife.com/upload/guaguaka.png';
        $resultStr = $this->transmitImgText($object, $title, $description, $picurl, $url);
        return $resultStr;
    }
    private function notMeber($object) {
        $contentStr = "<a href='http://www.phoebelife.com/index.php?go=mobile.index.index&openid=" . $object->FromUserName."'>亲,加入会员请点击这里</a>";
        $resultStr = $this->transmitText($object,$contentStr, $funcFlag=0);
        return $resultStr;
    }

    private function istMeber($object,$data) {
        $contentStr = "您已经是粉丝会员了。
手机号：".$data->mobile."
<a href='http://www.phoebelife.com/index.php?go=mobile.member.info&openid=" . $object->FromUserName."'>请查看您的会员卡</a>";
        $resultStr = $this->transmitText($object,$contentStr, $funcFlag=0);
        return $resultStr;
    }

    private function goods($object){
          $url = "http://www.phoebelife.com/index.php?go=mobile.goods.lists&openid=" . $object->FromUserName;
          $resultStr = "<xml>
                    <ToUserName><![CDATA[".$object->FromUserName."]]></ToUserName>
                    <FromUserName><![CDATA[".$object->ToUserName."]]></FromUserName>
                    <CreateTime>".time()."</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>
                    <ArticleCount>2</ArticleCount>
                    <Articles>
                    <item>
                    <Title><![CDATA[兑换商城]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[http://www.phoebelife.com/upload/weili.jpg]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    <item>
                    <Title><![CDATA[2016年生肖吉祥物兑换！]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    </Articles>
                    </xml>";
        return $resultStr;
    }

    private function goodshome($object){
        $url = "http://www.phoebelife.com/index.php?go=mobile.index.brandinfo&openid=" . $object->FromUserName;
        $resultStr = "<xml>
                    <ToUserName><![CDATA[".$object->FromUserName."]]></ToUserName>
                    <FromUserName><![CDATA[".$object->ToUserName."]]></FromUserName>
                    <CreateTime>".time()."</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>
                    <ArticleCount>2</ArticleCount>
                    <Articles>
                    <item>
                    <Title><![CDATA[品牌介绍]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[http://www.phoebelife.com/upload/weixin.jpg]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    <item>
                    <Title><![CDATA[    取货有效期为2014年12月10日——2015年2月6日止
            2015年2月14日——2015年2月29日止
一、凭本专用凭证可在以下指定地点领取猴年十二生肖吉祥摆件一件。
    领取地点:
     上海工美珍宝馆 63275433 钦州路528号5楼 10：00-17:00   （节假日、周末休息）
     上海天平宾馆   54469999  天平路185  10:00-17:00
二、本专用凭证若有缺损、剪角、无防伪标记，即视无效。
三、本专用凭证在规定日期内使用，盖章有效;
    本专用凭证恕不兑换现金，遗失不补。
四、本专用凭证仅限于领取猴年十二生肖吉祥物。
    咨询电话：021-63273989
五、扫二维码通过电子平台输入券号进行兑换。
六、预约派送电话：4000330923工作时间周一至周五上午9点-下午5点，客户确认兑换信息后的2-3个工作日，我司安排发货。]]></Title>
                    <Description><![CDATA[]]></Description>
                    <PicUrl><![CDATA[]]></PicUrl>
                    <Url><![CDATA[".$url."]]></Url>
                    </item>
                    </Articles>
                    </xml>";
        return $resultStr;
    }

}

?>
