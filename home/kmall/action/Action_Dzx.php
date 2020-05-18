<?php
/**
 +---------------------------------<br/>
 * 控制器:网站前台首页<br/>
 +---------------------------------
 * @category kmall
 * @package  web.back.admin 
 * @subpackage action
 * @author skygreen
 */
class Action_Dzx extends Action
{
	 /**
	  * 控制器:首页
	  */
	 public function index_old(){
	 	$this->loadCss("resources/css/ptype_sp.css");
	 	$this->loadJs("js/jquery.lazyload.js");
	 	$time_products=Product::get('isRecommend=1','sort_order desc','0,3');
	 	$this->view->set("time_products",$time_products);
	 	$brands=array(133,132,127,129,130,131);
	 	// $brands=array(133);
	 	foreach ($brands as $brand) {
	 		$sp_products[$brand]=Product::get(null,null,'8');
	 	}
	 	// $sp_products=Product::get('product_id BETWEEN 2237 and 2246');
	 	$this->view->set("sp_products",$sp_products);
	 	$this->view->set("brands",$brands);
	 }
     
     /**
      * 控制器:活动页面
      */
     public function index(){
         $this->loadCss("resources/css/activity.css");
         $this->loadJs("js/jquery.lazyload.js");
         $product398Packages = Product::get_by_id(2);//398的套餐
         $product398Coupon = Product::get_by_id(3);//398的兑换券
         $product598Packages = Product::get_by_id(4);//598的套餐
         $product598Coupon = Product::get_by_id(5);//598的兑换券
         $product798Packages = Product::get_by_id(6);//798的套餐
         $product798Coupon = Product::get_by_id(7);//798的兑换券
         $product998Packages = Product::get_by_id(8);//998的套餐
         $product998Coupon = Product::get_by_id(9);//998的兑换券
         $product1398Packages = Product::get_by_id(10);//1398的套餐
         $product1398Coupon = Product::get_by_id(11);//1398的兑换券
         $product1698Packages = Product::get_by_id(12);//1698的套餐
         $product1698Coupon = Product::get_by_id(13);//1698的兑换券
         $this->view->set("product398Packages",$product398Packages);
         $this->view->set("product398Coupon",$product398Coupon);
         $this->view->set("product598Packages",$product598Packages);
         $this->view->set("product598Coupon",$product598Coupon);
         $this->view->set("product798Packages",$product798Packages);
         $this->view->set("product798Coupon",$product798Coupon);
         $this->view->set("product998Packages",$product998Packages);
         $this->view->set("product998Coupon",$product998Coupon);
         $this->view->set("product1398Packages",$product1398Packages);
         $this->view->set("product1398Coupon",$product1398Coupon);
         $this->view->set("product1698Packages",$product1698Packages);
         $this->view->set("product1698Coupon",$product1698Coupon);
     }
     
	 public function index2()
	 {        
		 $this->init();
		 $this->loadIndexJs();
		 $this->loadCss("resources/css/index.css");
		 $this->loadJs("js/indexshow.js");
		 $newshows = Indexpage::get(array("classify_id=1","isShow=1"),"sort_order desc","1,3");
		 $this->view->set("newshows",$newshows);
		 //热卖排行
		 $hotshows = Indexpage::get(array("classify_id=2","isShow=1"),"sort_order desc","1,3");
		 $this->view->set("hotshows",$hotshows);
		 //新闻
		 $newslists = Indexpage::get(array("classify_id=9","isShow=1"),"sort_order desc","1,9");
		 $this->view->set("newslists",$newslists);
		 //center内容
		 $centers = Indexpage::get(array("classify_id=5","isShow=1"),"sort_order desc","1,4");
		 $this->view->set("centers",$centers);
		 //center商品
		 $center_products = array();
		 foreach($centers as $key=>$value){
			 //左侧展示图片
			 $value->showimg = Indexpage::get_one(array("parent_id=".$value->indexpage_id,"classify_id=6"));
			 //顶部链接
			 $value->children = Indexpage::get(array("classify_id=7","isShow=1","parent_id=".$value->indexpage_id),"sort_order desc");
			 //展示商品
			 $value->kids= Indexpage::get(array("classify_id=8","isShow=1","parent_id=".$value->indexpage_id),"sort_order desc","1,3");
			 $center_products = array_merge($center_products,$value->kids);
		 }
		 $this->view->set("center_images",$center_images);
		 $this->view->set("center_links",$center_links);
		 //合并数组
		 $allproducts = array_merge($newshows,$hotshows,$center_products);
		 $this->view->set("allproducts",$allproducts);
		 
         /*提供倒计时
		$time = time();
		$this->view->set("time",$time);
		$timef = strtotime("2013-2-6 18:15:00");
		$this->view->set("timef",$timef);*/
        
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
	 }
	 /**
	  * 初始化，加载Css和Javascript库。
	  */
	 private function init()
	 {
		 //初始化加载Css和Javascript库
		 $this->view->viewObject=new ViewObject();
		 $this->loadCss();
	 }
	 
	 /**
	  * 预加载首页JS定义库。
	  * @param ViewObject $viewobject 表示层显示对象
	  * @param string $templateurl
	  */
	 private function loadIndexJs()
	 {    
		$this->loadJs("js/jquery.lazyload.js"); 
		//UtilJavascript::loadJsReady($this->view->viewObject,$this->view->template_url."js/jquery.lazyload.js");

		$this->loadJs();         
		//UtilJavascript::loadJsReady($this->view->viewObject,$this->view->template_url."js/index.js");  
	 }
}
?>