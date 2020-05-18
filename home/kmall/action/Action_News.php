<?php
/**
 +---------------------------------------<br/>
 * 控制器:菲彼生活新闻<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_News extends Action
{
    /**
     * 菲彼生活新闻列表页面
     */
    public function lists()
    {
        $news_id = $this->data['news_id'];
        $websafe = is_numeric($news_id)||empty($news_id);
        if($websafe){
            $this->loadCss("resources/css/news.css");
            //商城公告
            $noticelist=News::get("isShow=1 and news_type=1","sort_order desc");
            $this->view->set("noticelist",$noticelist);
            //导购信息
            $guidelist=News::get("isShow=1 and news_type=3","sort_order desc");
            $this->view->set("guidelist",$guidelist);

            $news_id=$this->data["news_id"];
            $news=News::get_by_id($news_id);
            if(empty($news)){//默认：关于我们
        	    $news=News::get_one("news_type=1");
		    }
		    $this->view->set("news",$news);

            //导航条
            $nav_info->level = 2;
            $nav_info->info = "关于我们";
            $nav_info->link = Gc::$url_base."index.php?go=kmall.news.lists";
            $this->view->set("nav_info",$nav_info);
        }else{
            $this->redirect("index","index");
        }
    }
}
?>
