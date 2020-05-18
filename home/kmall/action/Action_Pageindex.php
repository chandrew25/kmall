<?php
/**
 +---------------------------------------<br/>
 * 控制器:动态页面<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Pageindex extends Action
{
     /**
      * 控制器:首页
      */
     public function index()
     {
         $this->loadCss("resources/css/index.css");
         $this->loadJs("js/indexshow.js");
         $this->loadJs("js/pageindex.js");
         $this->loadJs("js/jquery.form.js");
         //新品上市
         $newshows = Indexpage::get(array("classify_id=1","isShow=1"),"sort_order desc","1,3");
         $this->view->set("newshows",$newshows);
         //热卖排行
         $hotshows = Indexpage::get(array("classify_id=2","isShow=1"),"sort_order desc","1,3");
         $this->view->set("hotshows",$hotshows);
         //新闻
         $newslists = Indexpage::get(array("classify_id=9","isShow=1"),"sort_order desc","1,9");
         $this->view->set("newslists",$newslists);
         //center内容
         $centers = Indexpage::get(array("classify_id=5"),"sort_order desc","1,5");
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

         //提供倒计时
        $time = time();
        $this->view->set("time",$time);
        $timef = strtotime("2013-1-4 18:15:00");
        $this->view->set("timef",$timef);

        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
}
?>
