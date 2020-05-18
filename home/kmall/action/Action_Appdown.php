<?php
/**
 +---------------------------------------<br/>
 * 控制器:应用下载<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Appdown extends Action
{
    /**
     * 应用下载列表
     */
    public function lists()
    {
        $this->loadCss("resources/css/appdown.css");
        $this->loadJs("js/appdown.js");
        $appfrees = Appdown::get("isFree=1","sort_order desc","1,25");
        $this->view->set("appfrees",$appfrees);
        $recommends = Appdown::get("isHotrecommend=1","sort_order desc","1,25");
        $apphotrecommendfirst = array_slice($recommends,0,1);
        $apphotrecommends = array_slice($recommends,1,24);
        $this->view->set("apphotrecommendfirst",$apphotrecommendfirst);
        $this->view->set("apphotrecommends",$apphotrecommends);
        $newests = Appdown::get("","sort_order desc","1,25");
        $appnewestfirst = array_slice($newests,0,1);
        $appnewests = array_slice($newests,1,24);
        $this->view->set('appnewestfirst',$appnewestfirst);
        $this->view->set('appnewests',$appnewests);
        //排行榜
        $select_items = "appdown_id,appdown_name,tag,ico,smallicon,recommendlevel,count(appdown_id)";
        $theweek = "YEARWEEK(date_format(updateTime,'%Y-%m-%d')) = YEARWEEK(now())  group by appdown_id";
        $lastweek = "YEARWEEK(date_format(updateTime,'%Y-%m-%d')) = YEARWEEK(now())-1 group by appdown_id";
        $themonth = "month(updateTime) = month(now()) group by appdown_id";
        $lastmonth = "date_format(updateTime ,'%Y-%m')=date_format(DATE_SUB(curdate(), INTERVAL 1 MONTH),'%Y-%m') group by appdown_id";
        $weektoptens = Applog::select($select_items,$theweek,"count(appdown_id) desc","1,10");
        if(empty($weektoptens)){
            $weektoptens = Applog::select($select_items,$lastweek,"count(appdown_id) desc","1,10");
        }
        $monthtoptens = Applog::select($select_items,$themonth,"count(appdown_id) desc","1,10");
        if(empty($monthtoptens)){
            $monthtoptens = Applog::select($select_items,$lastmonth,"count(appdown_id) desc","1,10");
        }
        $this->view->set("weektoptens",$weektoptens);
        $this->view->set("monthtoptens",$monthtoptens);
        
        //导航条
        $nav_info->level = 2;
        $nav_info->info = "应用下载";
        $nav_info->link = Gc::$url_base."index.php?go=kmall.appdown.lists";
        $this->view->set("nav_info",$nav_info);
    }
    /**
     * 应用下载详细
     */
    public function view()
    {
        $appdown_id = $this->data['appdown_id']; 
        $websafe = is_numeric($appdown_id); 
        if($websafe){
            $this->loadCss("resources/css/appdown_view.css");
            $this->loadJs("js/appdown.js");
            $appdown_id = $this->data['appdown_id'];
            $appdown = Appdown::get_by_id($appdown_id);
            $appdown->docsize = $appdown->docsize/(1024*1024);
            $this->view->set("appdown",$appdown);
            $guessshows = Appdown::get("type=".$appdown->type,"","1,4");
            $this->view->set("guessshows",$guessshows);
            //排行榜
            $select_items = "appdown_id,appdown_name,tag,ico,smallicon,recommendlevel,count(appdown_id)";
            $theweek = "YEARWEEK(date_format(updateTime,'%Y-%m-%d')) = YEARWEEK(now())  group by appdown_id";
            $lastweek = "YEARWEEK(date_format(updateTime,'%Y-%m-%d')) = YEARWEEK(now())-1 group by appdown_id";
            $themonth = "month(updateTime) = month(now()) group by appdown_id";
            $lastmonth = "date_format(updateTime ,'%Y-%m')=date_format(DATE_SUB(curdate(), INTERVAL 1 MONTH),'%Y-%m') group by appdown_id";
            $weektoptens = Applog::select($select_items,$theweek,"count(appdown_id) desc","1,10");
            if(empty($weektoptens)){
                $weektoptens = Applog::select($select_items,$lastweek,"count(appdown_id) desc","1,10");
            }
            $monthtoptens = Applog::select($select_items,$themonth,"count(appdown_id) desc","1,10");
            if(empty($monthtoptens)){
                $monthtoptens = Applog::select($select_items,$lastmonth,"count(appdown_id) desc","1,10");
            }
            $this->view->set("weektoptens",$weektoptens);
            $this->view->set("monthtoptens",$monthtoptens);
            
            //导航条
            $nav_info->level = 3;
            $nav_info->info = "应用下载";
            $nav_info->link = Gc::$url_base."index.php?go=kmall.appdown.lists";
            $nav_info->info_next = $appdown->appdown_name;
            $nav_info->link_next = Gc::$url_base."index.php?go=kmall.appdown.view&appdown_id=".$appdown_id;
            $this->view->set("nav_info",$nav_info);   
        }else{
            $this->redirect("index","index");       
        }
    }
    /**
     * 应用下载分类
     */
    public function classify()
    {
        $pageNo = $this->data['$pageNo'];
        $classify_id = $this->data['classify_id'];  
        $sorting = $this->data['sorting']; 
        $websafe1 = is_numeric($pageNo)||empty($pageNo); 
        $websafe2 = is_numeric($classify_id);
        $websafe3 = is_numeric($sorting)||empty($sorting);
        $websafe = $websafe1&&$websafe2&&$websafe3;
        if($websafe){
            $this->loadCss("resources/css/appdown_classify.css");
            $this->loadJs("js/appdown.js");
            $classify_id = $this->data["classify_id"];
            $this->view->set("classify_id",$classify_id);
            //接受传入的排序方式，没有传入则默认为按‘时间’排序
            $sorting = $this->data['sorting'];
            $this->view->set("sorting",$sorting);
            if ( empty($sorting) ){
                $sort_order = "publishtime";
            }
            else{
                switch ($sorting){
                    case 1: $sort_order = "publishtime"; break;
                    case 2: $sort_order = "docsize"; break;
                    case 3: $sort_order = "downloadcount"; break;
                }
            }
            $this->view->set("sorting",$sorting);
            $orderby=$this->data['orderby'];
            $sort_order.=($orderby==1?" asc":" desc");
            $where_clause["type"] = $classify_id;
            
            //得到分页数据信息
            if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){          
                $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
                $nowpage=1; 
            }
            $count=Appdown::count($where_clause);
            
            //分页内容初始化，每页6个单项内容
            $bb_page=UtilPage::init($nowpage,$count,10); 
            $appdownshows = Appdown::queryPage($bb_page->getStartPoint(),$bb_page->getEndPoint(),$where_clause,$sort_order);  
            $this->view->set("count",$count);
            for($i=0;$i<count($appdownshows);$i++){
                $appdownshows[$i]->docsize = $appdownshows[$i]->docsize/(1024*1024);
            }
            $this->view->set("appdownshows",$appdownshows); 
            $guessshows = Appdown::get("type=".$classify_id,"","1,4");
            $this->view->set("guessshows",$guessshows); 
            //排行榜
            $select_items = "appdown_id,appdown_name,tag,ico,smallicon,recommendlevel,count(appdown_id)";
            $theweek = "YEARWEEK(date_format(updateTime,'%Y-%m-%d')) = YEARWEEK(now())  group by appdown_id";
            $lastweek = "YEARWEEK(date_format(updateTime,'%Y-%m-%d')) = YEARWEEK(now())-1 group by appdown_id";
            $themonth = "month(updateTime) = month(now()) group by appdown_id";
            $lastmonth = "date_format(updateTime ,'%Y-%m')=date_format(DATE_SUB(curdate(), INTERVAL 1 MONTH),'%Y-%m') group by appdown_id";
            $weektoptens = Applog::select($select_items,$theweek,"count(appdown_id) desc","1,10");
            if(empty($weektoptens)){
                $weektoptens = Applog::select($select_items,$lastweek,"count(appdown_id) desc","1,10");
            }
            $monthtoptens = Applog::select($select_items,$themonth,"count(appdown_id) desc","1,10");
            if(empty($monthtoptens)){
                $monthtoptens = Applog::select($select_items,$lastmonth,"count(appdown_id) desc","1,10");
            }
            $this->view->set("weektoptens",$weektoptens);
            $this->view->set("monthtoptens",$monthtoptens);
            
            //导航条
            $nav_info->level = 3;
            $nav_info->info = "应用下载";
            $nav_info->link = Gc::$url_base."index.php?go=kmall.appdown.lists";
            switch ($classify_id){
                case 1:
                    $info = "游戏天地";
                    break;
                case 2:
                    $info = "影音娱乐";
                    break;
                case 3:
                    $info = "教育阅读";
                    break;
                case 4:
                    $info = "旅行购物";
                    break;
                case 5:
                    $info = "生活休闲";
                    break;
            }
            $nav_info->info_next = $info;
            $nav_info->link_next = Gc::$url_base."index.php?go=kmall.appdown.classify&classify_id=".$classify_id;
            $this->view->set("nav_info",$nav_info);
        }else{
            $this->redirect("index","index"); 
        }
    }
        
    /**
     * 下载
     */
    public function download()
    {
        $appdown_id = $this->data["appdown_id"];
        $appdown = Appdown::get_by_id($appdown_id);
        Appdown::increment("appdown_id=".$appdown_id,"downloadcount",1);
        $applog = new Applog(array("appdown_id"=>$appdown_id,"appdown_name"=>$appdown->appdown_name,"tag"=>$appdown->tag,"ico"=>$appdown->ico,"smallicon"=>$appdown->smallicon,"recommendlevel"=>$appdown->recommendlevel,"sort_order"=>$appdown->sort_order,"isShow"=>$appdown->isShow));
        $applog->save();
        $link = $appdown->filepath;
        if (isset($link)){
            $link = Gc::$upload_url.$link;
            Header("HTTP/1.1 303 See Other");
            Header("Location: $link");
            exit();
        } 
    }
    
}

?>
