<?php
/**
 +---------------------------------------<br/>
 * 管理员<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Admin extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 管理员标识
	 * @var int
	 * @access public
	 */
	public $admin_id;
	/**
	 * 管理员名称
	 * @var string
	 * @access public
	 */
	public $username;
    /**
     * 真实姓名
     * @var string
     * @access public
     */
    public $realname;
	/**
	 * 管理员密码
	 * @var string
	 * @access public
	 */
	public $password;
    /**
     * 权限
     * @var string
     * @access public
     */
    public $authority;
    /**
     * 操作权限
     * @var string
     * @access public
     */
    public $operation;
    /**
     * 管理员所在部门
     * @var int
     * @access public
     */
    public $department_id;
	/**
	 * 系统管理员扮演角色<br/>
     * 0:超级管理员-superadmin<br/>
     * 1:管理员-manager<br/>
     * 2:客服-normal<br/>
     * 3:采购人员-buyer<br/>
     * 4:财务-finance<br/>
     * 5:库管-warehousekeeper<br/>
	 * @var enum
	 * @access public
	 */
	public $roletype;
	/**
	 * 角色标识
	 * @var int
	 * @access public
	 */
	public $roleid;
	/**
	 * 视野<br/>
	 * 0:只能查看自己的信息-self<br/>
	 * 1:查看所有的信息-all<br/>
	 *
	 * @var enum
	 * @access public
	 */
	public $seescope;
    /**
     * 角色操作者ID
     * @var int
     * @access public
     */
    public $operator_id;
	//</editor-fold>

    /**
     *一对一关系
     */
    static $belong_has_one=array(
        "department"=>"Department"
    );
    /**
     * 一对多关系
     */
    static $has_many=array(
        "deliverylog"=>"Deliverylog",
        "orderlog"=>"Orderlog",
        "paylog"=>"Paylog",
        "productlog"=>"Productlog",
        "contractlog"=>"Contractlog",
        "supplier"=>"Supplier"
    );

	/**
	 * 显示系统管理员扮演角色<br/>
	 * 0:超级管理员-superadmin<br/>
	 * 1:管理人员-manager<br/>
	 * 2:运维人员-normal<br/>
	 * 801:票券管理人员-couponer<br/>
	 * <br/>
	 */
	public function getRoletypeShow()
	{
		return self::roletypeShow($this->roletype);
	}

	/**
	 * 显示视野<br/>
	 * 0:只能查看自己的信息-self<br/>
	 * 1:查看所有的信息-all<br/>
	 * <br/>
	 */
	public function getSeescopeShow()
	{
		return self::seescopeShow($this->seescope);
	}

	/**
	 * 显示系统管理员扮演角色<br/>
	 * 0:超级管理员-superadmin<br/>
	 * 1:管理人员-manager<br/>
	 * 2:运维人员-normal<br/>
	 * 801:票券管理人员-couponer<br/>
	 * <br/>
	 */
	public static function roletypeShow($roletype)
	{
		return EnumRoletype::roletypeShow($roletype);
	}

	/**
	 * 显示视野<br/>
	 * 0:只能查看自己的信息-self<br/>
	 * 1:查看所有的信息-all<br/>
	 * <br/>
	 */
	public static function seescopeShow($seescope)
	{
		return EnumSeescope::seescopeShow($seescope);
	}

    /**
     * 返回网店管家管理员
     * @return Admin 管理员
     */
    public static function wdgj()
    {
        $admin=new Admin();
        $admin->admin_id=1000;
        $admin->username="wdgj";
        $admin->realname="网店管家";
        return $admin;
    }

    /**
     * 返回支付宝管理员
     * @return Admin 管理员
     */
    public static function alipay()
    {
        $admin=new Admin();
        $admin->admin_id=1001;
        $admin->username="alipay";
        $admin->realname="支付宝";
        return $admin;
    }

    /**
     * 返回盛付通管理员
     * @return Admin 管理员
     */
    public static function shengpay()
    {
        $admin=new Admin();
        $admin->admin_id=1002;
        $admin->username="shengpay";
        $admin->realname="盛付通";
        return $admin;
    }

	/**
	 * 指定角色类型是否可访问指定的链接地址
	 * @param mixed $url_current 指定的链接地址
	 * @param mixed $roletype 角色类型
	 */
	public static function canIn($url_current)
	{
        $url_current=strtolower($url_current);
        //免权限链接
        $globalGos=array(
            "admin.index.login",
            "admin.index.info",
            "admin.shop.addorder",
            "admin.view.admin",
            "admin.product.addproduct",
            "admin.page.indexpage",
            "admin.demo.d1",
            "admin.demo.d2"
        );
        //操作链接
        $globalOpe=array(
            "orderGrid_printDelivery"=>"admin.print.delivery",
            "orderGrid_printInvoice"=>"admin.print.invoice",
            "orderGrid_printExpress"=>"admin.print.express"
        );

        if (contain($url_current,"admin.upload.upload")){
            return true;
        }
        if(in_array($url_current,$globalGos)){
            return true;
        }
        $admin=HttpSession::get("admin");
        $operation=explode("-",$admin->operation);
        if($admin&&$url_current=="admin.index.index"){
            return true;
        }
        foreach($globalOpe as $key=>$value){
            if($value==$url_current){
                if(in_array($key,$operation)||$admin->roletype=="0"){
                    return true;
                }else{
                    return false;
                }
            }
        }
        //获取所有链接
        $menuGroups=MenuGroup::all();
        //权限
        $authority=explode("-",$admin->authority);
        //删除没有权限进入的子菜单
        if ($admin->roletype!="0"){
            foreach ($menuGroups as $menuGroup) {
                foreach($menuGroup['menus'] as $mkey=>$mvalue){
                    //链接地址
                    $address = explode("=",strtolower($mvalue['address']));
                    if(!empty($mvalue['address'])&&in_array($url_current,$address)){
                        //如果拥有该权限或者拥有for权限
                        $for = $mvalue['for'];
                        $forlist = explode(",",$for);
                        if (in_array($mvalue['id'],$authority)||(!empty($for)&&in_array($admin->roletype,$forlist))){
                            return true;
                        }else{
                            return false;
                        }
                    }
                }
            }
        }else{
            foreach ($menuGroups as $menuGroup) {
                foreach($menuGroup['menus'] as $mkey=>$mvalue){
                    //链接地址
                    $address = explode("=",strtolower($mvalue['address']));
                    if(!empty($mvalue['address'])&&in_array($url_current,$address)){
                        //for控制权限
                        $for = $mvalue['for'];
                        $forlist = explode(",",$for);
                        if (empty($for)||(!empty($for)&&in_array($admin->roletype,$forlist))){
                            return true;
                        }else{
                            return false;
                        }
                    }
                }
            }
        }
        return false;
	}
}
?>
