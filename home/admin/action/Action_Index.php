<?php
/**
 +---------------------------------------<br/>
 * 控制器:网站后台管理<br/>
 +---------------------------------------
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Index extends ActionExt
{
	/**
	 * 控制器:登录
	 */
	public function login()
	{
		if(HttpSession::isHave(Gc::$appName_alias.'admin_id')) {
			$this->redirect("index","index");
		}
		$this->loadCss("resources/css/login.css");  
		//UtilJavascript::loadJsReady($this->view->viewObject,Gc::$url_base."common/js/ajax/jquery/jquery-1.7.1.js");
		$this->loadJs("js/normal/DD_belatedPNG.js");
        UtilAjaxJquery::loadReady($this->view->viewObject);
		$this->loadJs("js/normal/jquery-1.7.1.js");
		$this->loadJs("js/normal/login.js");
		if (!empty($_POST)) {
			if (HttpSession::get("validate")!= md5($this->data["validate"])){
				$this->view->set("message","图形验证码输入错误");
				return;
			}
			$admin = $this->model->Admin;
			$admindata = Admin::get_one($admin);
			if (empty($admindata)) {
				$this->view->set("message","用户名或者密码错误");
			}else {
				HttpSession::sets(array('admin_id'=>$admindata->admin_id,'admin'=>$admindata));
				HttpSession::set(Gc::$appName_alias.'admin_id',$admindata->admin_id);
				HttpCookie::sets(array("admin_id"=>$admindata->admin_id,"operator"=>$admindata->username,'roletype'=>$admindata->roletype,'roleid'=>$admindata->roleid));
				$this->redirect("index","index");
			}
		}
	}
	
	/**
	 * 控制器:登出
	 */
    public function logout()
	{
		HttpSession::remove("admin_id");
        HttpSession::remove("admin");
		HttpSession::remove(Gc::$appName_alias."admin_id");
		$this->redirect("index","login");
	}

    /**
    * 控制器:首页
    */
    public function index()
    {
        //如果未登录，跳转至登陆页
        if(!HttpSession::isHave(Gc::$appName_alias.'admin_id')){
            $this->redirect("index","login");
        }
        $this->init();
        $this->loadIndexJs();

        $admin=HttpSession::get("admin");
        $authority=explode("-",$admin->authority);
        //加载菜单 
        $this->view->menuGroups=MenuGroup::all();
        //删除没有权限进入的子菜单
        if ($admin->roletype!="0"){
            foreach ($this -> view -> menuGroups as $key=>$menuGroup) {
                $ifmenu=false;
                foreach($menuGroup['menus'] as $mkey=>$mvalue){
                    //如果拥有该权限或者拥有for权限
                    $for = $mvalue['for'];
                    $forlist = explode(",",$for);
                    if (in_array($mvalue['id'],$authority)||(!empty($for)&&in_array($admin->roletype,$forlist))){
                        $ifmenu=true; 
                    }
                    //如果进入权限，删除
                    if(!$ifmenu){
                        $this -> view -> menuGroups[$key]->delMenus($mkey);
                    }
                    //标志位恢复
                    $ifmenu=false;
                }
            }
        }else{
            foreach ($this -> view -> menuGroups as $key=>$menuGroup) {
                $ifmenu=false;
                foreach($menuGroup['menus'] as $mkey=>$mvalue){
                    //for控制权限
                    $for = $mvalue['for'];
                    $forlist = explode(",",$for);
                    if (empty($for)||(!empty($for)&&in_array($admin->roletype,$forlist))){
                        $ifmenu=true; 
                    }
                    //如果进入权限，删除
                    if(!$ifmenu){
                        $this -> view -> menuGroups[$key]->delMenus($mkey);
                    }
                    //标志位恢复
                    $ifmenu=false;
                }
            }
        }      
    }

    /**
    * 预加载首页JS定义库。
    * @param ViewObject  表示层显示对象 
    * @param string 
    */
    private function loadIndexJs()
    {
        $viewobject=$this->view->viewObject;
        $this->loadExtCss("index.css",true);
        $this->loadExtJs("index.js",true); 
        //核心功能:外观展示
        $this->loadExtJs("layout.js",true);
        //左侧菜单组生成显示
        $admin=HttpSession::get("admin");
        UtilJavascript::loadJsContentReady($viewobject,MenuGroup::viewForExtJs()); 
        //核心功能:导航[Tab新建窗口]  
        $this->loadExtJs("navigation.js",true); 
        $this->ExtDirectMode();
        $this->loadExtJs("shared/grid/roweditor.js",true);
        $this->loadExtJs('shop/addorderIndex.js');
    }
	 
    /**
    * 提示信息页面
    */
    public function info(){

    }
	

}
?>