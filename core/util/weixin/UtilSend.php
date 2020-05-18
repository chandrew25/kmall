<?php
/**
 * 微信客接口
 * @category betterlie
 * @package util.weixin
 */
class UtilSend extends Util
{
    //判断微信是否加入会员
    public static function isMember($weixin){
        $data = Member::get_one("openid='".$weixin."'");
        if($data){
           return $data; 
        }else{
           return false; 
        }
    }
    
    public static function getMember($cardno){
        $result = UtilApi::getMember($cardno);
        if($result->code ="A00006"){
            return $result->data;
        }else{
            return false;
        }
        
    }
    
    public static function scratch_card($weixin){
        $data = Scratchcard::get_one("openid='".$weixin."'");
        if($data){
           return ture; 
        }else{
           return false; 
        }
    }

    public static function getCoupon($phone){
        $data['user_mobile'] = $phone;
        $data['status'] = 1;
        $data['inv_type'] = "";
        $result = UtilApi::buy_coupon($data);
        if ($result->code == "A00006") {
            return $result->data;
        }else{
            return array();
        }
    }
    
}