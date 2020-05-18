<?php
/**
 +---------------------------------------<br/>
 * 会员<br/>
 * 菲商城平台的用户、会员。<br/>
 +---------------------------------------
 * @category kmall
 * @package
 * @author skygreen skygreen2001@gmail.com
 */
class Member extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var string
     * @access public
     */
    public $member_id;
    /**
     * 折扣角色标识
     * @var string
     * @access public
     */
    public $raterule_id;
    /**
     * 用户名称
     * @var string
     * @access public
     */
    public $username;
    /**
     * 密码
     * @var string
     * @access public
     */
    public $password;
    /**
     * 真实姓名
     * @var string
     * @access public
     */
    public $realname;
    /**
     * 用户手机<br/>
     * 用于用户注册，验证，传送密码和用户服务通信的通道
     * @var string
     * @access public
     */
    public $mobile;
    /**
     * 家庭地址
     * @var string
     * @access public
     */
    public $address;
    /**
     * 卡号
     * @var string
     * @access public
     */
    public $cardno;
    /**
     * 用户Email
     * @var string
     * @access public
     */
    public $email;
    /**
     * 用户类型<br/>
     * 0:后台管理员-admin<br/>
     * 1:普通会员-member<br/>
     * 2:第三方管理员-thirdadmin
     * @var enum
     * @access public
     */
    public $usertype;
    /**
     * 会员性别<br/>
     * 0：女-female<br/>
     * 1：男-male<br/>
     * -1：待确认-unknown<br/>
     * 默认男
     * @var enum
     * @access public
     */
    public $sex;
    /**
     * 生日
     * @var string
     * @access public
     */
    public $birthday;
    /**
     * 身份证号
     * @var string
     * @access public
     */
    public $idCard;
    /**
     * 是否愿意接受邮件
     * @var string
     * @access public
     */
    public $isCanEmail;
    /**
     * 是否愿意接收短信<br/>
     *
     * @var string
     * @access public
     */
    public $isCanSms;
    /**
     * 手机验证<br/>
     * 默认为“0”
     * @var string
     * @access public
     */
    public $isValSms;
    /**
     * 邮箱验证<br/>
     * 默认为“0”
     * @var string
     * @access public
     */
    public $isValEmail;
    /**
     * 卡号激活<br/>
     * 默认为“0”
     * @var string
     * @access public
     */
    public $isValCard;
    /**
     * 是否已激活
     */
    public $isActive;
    /**
     * 积分
     * @var int
     * @access public
     */
    public $jifen;
    /**
     * 等级积分
     * @var int
     * @access public
     */
    // public $rankjifen;
    /**
     * 注册IP
     * @var string
     * @access public
     */
    public $regip;
  	/**
  	 * 商户号
  	 * @var string
  	 * @access public
  	 */
  	public $sbs_id;
  	/**
  	 * 微信openid
  	 * @var string
  	 * @access public
  	 */
  	public $openid;
    /**
     * 商户
     * @var string
     * @access public
     */
    public $sourceCompany;
    /**
     * 门店
     * @var string
     * @access public
     */
    public $sourceDept;
    /**
     * 代理商
     * @var string
     * @access public
     */
    public $agent;
    /**
     * 注册时间
     * @var int
     * @access public
     */
    public $regtime;
  	/**
  	 * 父父级
  	 * @var int
  	 * @access public
  	 */
  	public $level_one;
  	/**
  	 * 父级
  	 * @var int
  	 * @access public
  	 */
  	public $level_two;
  	/**
  	 * 银行卡号
  	 * @var int
  	 * @access public
  	 */
  	public $bank_card;
    //</editor-fold>
    /**
     * 规格说明
     * 表中不存在的默认列定义:commitTime
     * @var mixed
     */
    public $field_spec=array(
        EnumDataSpec::REMOVE=>array(
            'commitTime'
        )
    );
    static $belong_has_one=array(
        'raterule'=>'Raterule'
    );
    /**
     * 一对多关系
     */
    static $has_many=array(
        "address"=>"Address",
        "collect"=>"Collect",
        "comment"=>"Comment",
        "company"=>"Company",
        "seeproduct"=>"Seeproduct",
        "cart"=>"Cart",
        "delivery"=>"Delivery",
        "invoice"=>"Invoice",
        "order"=>"Order",
        "consult"=>"Consult",
        "orderproducts"=>"Orderproducts",
        "payments"=>"Payments"
    );


    /**
     * 显示用户类型<br/>
     * 0:后台管理员-admin<br/>
     * 1:普通会员-member<br/>
     * 2:第三方管理员-thirdadmin<br/>
     */
    public function getUsertypeShow()
    {
        return self::usertypeShow($this->usertype);
    }

    /**
     * 显示会员性别<br/>
     * 0：女-female<br/>
     * 1：男-male<br/>
     * -1：待确认-unknown<br/>
     * 默认男<br/>
     */
    public function getSexShow()
    {
        return self::sexShow($this->sex);
    }

    /**
     * 显示用户类型<br/>
     * 0:后台管理员-admin<br/>
     * 1:普通会员-member<br/>
     * 2:第三方管理员-thirdadmin<br/>
     */
    public static function usertypeShow($usertype)
    {
        return EnumUsertype::usertypeShow($usertype);
    }

    /**
     * 显示会员性别<br/>
     * 0：女-female<br/>
     * 1：男-male<br/>
     * -1：待确认-unknown<br/>
     * 默认男<br/>
     */
    public static function sexShow($sex)
    {
        return EnumSex::sexShow($sex);
    }

    /**
     * 显示用户等级
     */
    public function getUserrankShow()
    {
        return self::userrankShow($this->rankjifen,$this->sex);
    }

    /**
     * 显示用户等级
     */
    public static function userrankShow($rankjifen,$sex)
    {
        $str=null;
        if($rankjifen<=5000){
            $str=$sex?"男爵级":"灰姑娘级";
        }else if($rankjifen<=20000){
            $str=$sex?"子爵级":"千金级";
        }else if($rankjifen<=50000){
            $str=$sex?"伯爵级":"公主级";
        }else if($rankjifen<=100000){
            $str=$sex?"侯爵级":"王妃级";
        }else{
            $str=$sex?"公爵级":"女王级";
        }
        return $str;
    }
}
?>
