<?php
/**
 +---------------------------------------<br/>
 * 控制器:大宗采购<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Buy extends Action
{
    public function lists()
    {
        $this->loadCss("resources/css/display.css"); 
        $this->loadJs("js/display.js");
        $this->loadCss("resources/css/jquery.jqzoom.css");
        $this->loadJs("js/jquery.jqzoom-core.js");
        $this->loadJs("js/jquery.lazyload.js");
        $this->loadJs("js/item.js");
        $this->loadJs("js/dateformat.js");
        
        //初始化商品搜索条件
        $where_clause=array();
        //初始化筛选条件品牌搜索条件
        $where_clause_brands=array();
        
        //接受商品的分类ptype_id
        $ptype_id = $this->data['ptype_id'];
        if ( empty($ptype_id) ){
            //若ptype_id为空，则默认为3
            $ptype_id = 3;
        }
        //得到分类的等级
        $ptype_level = Ptype::select_one( "level" , array("ptype_id"=>$ptype_id));
        //定义搜索条件
        if ( $ptype_level.level == 1 ){

        }
        else if ( $ptype_level.level == 2 ){
            $ptype_key = array();
            $ptype_key[] = "-".Ptype::select_one( "parent_id" , array("ptype_id"=>$ptype_id) );
            $ptype_key[] = $ptype_id."-";
            $where_clause["ptype_key"] =  implode("-",$ptype_key);
        }
        else if ( $ptype_level.level == 3 ){

        }
        
        //接受商品的品牌
        $brand_id = $this->data['brand_id'];
        if ( !empty($brand_id) ){
            $where_clause["brand_id"] = $brand_id;
        }
        $this->view->set("brand_id",$brand_id);
        
        //接受传入的排序方式，没有传入则默认为按‘热门’排序
        $sorting = $this->data['sorting'];
        if ( empty($sorting) ){
            $sort_order = "product_id";
        }
        else{
            switch ($sorting){
                case 1: $sort_order = "click_count"; break;
                case 2: $sort_order = "updateTime"; break;
                case 3: $sort_order = "price"; break;
            }
        }
        $this->view->set("sorting",$sorting);
        $orderby=$this->data['orderby'];
        $sort_order.=($orderby==1?" asc":" desc");
        
        //读取商务分类的推荐商品
        //暂时读取3个-------20120111
        $recommen_clause['isRecommend']="1";
        $rec_products = Product::get( $recommen_clause , "sort_order desc" , '0,3' );
        if(count($rec_products)==0){
            //如果推荐数为0 随机选出3条数据,设置为推荐
            $recommen_clause['isRecommend']="0";
            $rec_products =Product::get($recommen_clause,"rand()",'4');
            $rec_products_ids=array();
            for($i=0;$i<count($rec_products);$i++){
                $rec_products_ids[$i]=$rec_products[$i]->product_id;
            }
            Product::updateProperties($rec_products_ids,"isRecommend=1");    
        }else{
             //判断是否有下一组推荐商品
             $after_products=Product::get($recommen_clause, "sort_order desc",(1+3).",3");
            if(count($after_products)>0){
                $this->view->set("rec_products_after","true");
            }
        }
        $this->view->set("ptype_id",$ptype_id);
        $this->view->set("rec_products_no",1);
        $this->view->set("rec_products",$rec_products);
        
        //接受属性分类
        $attr_key = $this->data["attr_key"];
        $attr_type = sqlExecute("select distinct ".Ptypeattr::tablename().".attribute1_id from ".Ptypeattr::tablename()." where ".Ptypeattr::tablename().".ptype_id=".$ptype_id." order by ptypeattr_id asc");
        $attr_cut = array();
        $attr_selected = array();
        //获取该分类的属性分类
        for($i=0;$i<count($attr_type);$i++){
            $attr_cut[$i] = $attr_type[$i]["0"];
            $attr_selected[$attr_type[$i]["0"]] =0;
        }
        //属性分类字符串
        if(!$attr_key){
            for($i=0;$i<count($attr_cut);$i++){
                $attr_key .= "0-";
            }
            $attr_key = substr($attr_key,"0","-1"); 
        }else{
            $attribute1_id = $this->data["attribute1_id"];
            $attribute_id = $this->data["attribute_id"];
            $attr_key = explode("-",$attr_key);  
            //记录筛选属性
            if($attribute1_id){
                $j = 0;
                for($i=0;$i<count($attr_cut);$i++){
                    if($attr_cut[$i]==$attribute1_id){
                        $j = $i;
                    }
                }
                $attr_key[$j] = $attribute_id;
            }
            $k = 0;
            //记录筛选属性到属性数组
            foreach($attr_selected as $key=>$value){
                $attr_selected[$key] = $attr_key[$k];
                $k+=1;
            }
            $this->view->set("attr_selected",$attr_selected);
            //生成属性分类条件
            foreach($attr_key as $key=>$value){
                if($value){
                    $where_clause["attr_key"] .= " like '%-".$value."-%' and attr_key";    
                }
            }
            if($where_clause["attr_key"]){
                $where_clause["attr_key"]=substr($where_clause["attr_key"],"0","-13"); 
            }
            $attr_key =implode("-",$attr_key);  
        }
        //属性字符串
        $this->view->set("attr_key",$attr_key);
        //得到分页数据信息
        if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){          
            $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
        }else{
            $nowpage=1; 
        }
        $count=Product::count($where_clause);
        
        //分页内容初始化，每页6个单项内容
        $bb_page=UtilPage::init($nowpage,$count,24); 
        $products = Product::queryPage($bb_page->getStartPoint(),$bb_page->getEndPoint(),$where_clause,$sort_order);  
        $this->view->set("count",$count);
        $this->view->set("products",$products); 
            
        //读取第二级菜单的数据信息
        $ptype_2_level = Ptype::get(array("parent_id"=>0) ,"sort_order desc" );
        $this->view->set( "ptype_2_level",$ptype_2_level );
        
        //读取第三级菜单的数据信息
        $ptype_3_level = array();
        foreach ( $ptype_2_level as $temp_ptype ){
            $temp_ptype->children = Ptype::get(array("parent_id"=>$temp_ptype->ptype_id) , "sort_order desc" );
        }
        
        //获取属性列表
        $attributes = sqlExecute("select distinct ".Attribute::tablename().".attribute_name ,".Attribute::tablename().".attribute_id from ".Attribute::tablename()." INNER JOIN ".Ptypeattr::tablename()." ON ".Ptypeattr::tablename().".attribute1_id = ".Attribute::tablename().".attribute_id where ".Ptypeattr::tablename().".ptype_id=".$ptype_id );
                
        //读取第二级属性列表
        for($i=0;$i<count($attributes);$i++){
            $attributes[$i]["children"] = Ptypeattr::get(array("attribute1_id=".$attributes[$i]["attribute_id"],"ptype_id=".$ptype_id),"attribute_id asc");
        }
        $this->view->set("attributes",$attributes);
        
        //读出筛选条件--品牌
        $where_clause_brands["isShow"] = 1;
        $where_clause_brands["ptype2_id"] = $ptype_id;
        $brands_filter="";
        foreach ($where_clause_brands as $key=>$value) {
            $brands_filter.=$key."=".$value." and ";    
        }                   
        $brands_filter=substr($brands_filter,"0","-5"); 
           
        $where_clause_brands=implode(" and ",$where_clause_brands);  
        $search_brands = Brandptype::get( $brands_filter." group by brand_id ");         
        $this->view->set("search_brands",$search_brands); 
        
        //读出5个热销排行
        //$top_seller=Ptypeshow::get(array("showtype"=>3,"isshow"=>1),"sort_order desc",'0,5');   
        $top_seller=Product::get($hot_clause,"click_count desc",'0,5');
        $this->view->set("top_seller",$top_seller);
        
        //该用户已登录
        if( HttpSession::isHave('member_id')){
            $this->view->set("is_login",1);
            $member_id = HttpSession::get('member_id');
            //操作cookie
            $this->cookieSaveSeeProduct($member_id,$product_id);
        }
    }
    /**
     * 添加商品浏览记录(cookie操作)
     */
    public function cookieSaveSeeProduct($member_id,$product_id)
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
            for($i=0;$i<count($seeproducts);$i++)
                if($seeproducts[$i]["product_id"]==$product->product_id){
                    $seeproducts[$i]["time"]=time();
                    break;
                }
            $product_array["product_id"]=$product->product_id;
            $product_array["image"]=$product->image;
            $product_array["product_name"]=$product->product_name;
            $product_array["productNameShow"]=$product->nameShow;
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