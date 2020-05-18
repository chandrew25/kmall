<?php
/**
 +---------------------------------------<br/>
 * 控制器:商品类型<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Search extends Action
{
    /**
     * 商品类型列表页面
     */
    public function lists()
    {
        //搜索关键字
        $keyword = trim($this->data['search_keyword']);
        $sorting = $this->data['sorting'];
        $websafe1 = !contain($keyword,"<script");
        $websafe2 = is_numeric($sorting)||empty($sorting);
        //非法请求判断
        $websafe = $websafe1&&$websafe2;
        if($websafe){
            $this->loadCss("resources/css/search_list.css");
            //初始化商品搜索条件
            $where_clause=array();

            //接受商品的搜索关键字
            if(empty($keyword)||$keyword=="请输入搜索关键字..."){
                $keyword = "";
            }
            $where_clause = "(a.product_name like '%".$keyword."%' or b.brand_name like '%".$keyword."%') and price_tag is not null and a.isUp=1 and a.isShow=1";
            $this->view->set("search_keyword",$keyword);

            //接受传入的排序方式，没有传入则默认为按‘主键’排序
            $sorting = $this->data['sorting'];
            if (empty($sorting) ){
                $sort_order = "price";
            }else{
                switch ($sorting){
                    case 1: $sort_order = "click_count"; break;
                    case 2: $sort_order = "product_id"; break;
                    case 3: $sort_order = "price"; break;
                }
            }
            $this->view->set("sorting",$sorting);

            //升序or降序
            $orderby=$this->data['orderby'];
            if (empty($orderby)) {
                $orderby = 1;
            }
            $sort_order.=($orderby==1?" asc":" desc");
            $this->view->set("orderby",$orderby);

            //得到分页数据信息
            if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
                  $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
            }else{
                  $nowpage=1;
            }
            $count= sqlExecute("select count(a.product_id) from km_product a,km_brand b where a.brand_id=b.brand_id and " . $where_clause);
            // Product::count($where_clause);
            $this->view->set("count",$count);

            //分页内容初始化，每页24个单项内容
            $bb_page=UtilPage::init($nowpage,$count,24);
            $where_clause = " a.brand_id=b.brand_id and " . $where_clause;
            $products = Product::queryPageMultitable($bb_page->getStartPoint(),$bb_page->getEndPoint(),"km_product a,km_brand b",$where_clause,$sort_order);
            $this->view->set("products",$products);

            //本周热销商品
            $top_seller=Product::get(array("isUp"=>'1',"isShow"=>'1'),"price asc,click_count desc",'0,5');
            $this->view->set("top_seller",$top_seller);

            //该用户已登录
            if( HttpSession::isHave('member_id')){
                $this->view->set("is_login",1);
                $member_id = HttpSession::get('member_id');
                //显示历史浏览记录
                $this->cookieSaveSeeProduct($member_id);
            }

            //导航条
            $nav_info->level = 2;
            $nav_info->info = "搜索页面";
            $nav_info->link = Gc::$url_base."index.php?go=kmall.search.lists&search_keyword=".$keyword;
            $this->view->set("nav_info",$nav_info);

        }else{
            $this->redirect("index","index");
        }
    }

    /**
     * 添加商品浏览记录(cookie操作)
     */
    public function cookieSaveSeeProduct($member_id,$product_id=NULL)
    {
        $seeproducts=unserialize($_COOKIE['seeproduct_member_'.$member_id]);
        if(empty($seeproducts))$seeproducts=array();
        $month_ago=time()-3600*24*30;//计算30天之前的时间
        //除去30天之前的浏览记录
        $j=0;
        $seeproducts_=array();
        for($i=0;$i<count($seeproducts);$i++,$j++){
            if($seeproducts[$i]["time"]<$month_ago){
                $j--;
                continue;
            }
            $seeproducts_[$j]=$seeproducts[$i];
        }
        $seeproducts=$seeproducts_;
        $history_items=array();
        //取出要显示的三个浏览记录，最后浏览的三个商品
        $showcount=count($seeproducts)>3?count($seeproducts)-3:0;
        for($i=count($seeproducts)-1;$i>=$showcount;$i--){
            $history_items[$i]=$seeproducts[$i];
        }
        $this->view->set("history_items",$history_items);
        $product=Product::get_by_id($product_id);
        //查看是否已浏览该商品
        if($product){
            for($i=0;$i<count($seeproducts);$i++){
                if($seeproducts[$i]["product_id"]==$product->product_id){
                    $seeproducts[$i]["time"]=time();
                    break;
                }
            }
            $product_array["product_id"]=$product->product_id;
            $product_array["sales_price"]=$product->price;
            $product_array["image"]=$product->image;
            $product_array["product_name"]=$product->product_name;
            $product_array["jifen"]=$product->jifen;
            $product_array["unit"]=$product->unit;
            $product_array["time"]=time();
            if($i==count($seeproducts)){//如果未浏览过该商品，则添加该商品
                $seeproducts[count($seeproducts)]=$product_array;
            }else{//如果已经浏览过该商品，则把该商品放在数组最后
                for(;$i<count($seeproducts)-1;$i++)
                    $seeproducts[$i]=$seeproducts[$i+1];
                $seeproducts[count($seeproducts)-1]=$product_array;
            }
            setcookie('seeproduct_member_'.$member_id,serialize($seeproducts));
        }
    }
}
?>
