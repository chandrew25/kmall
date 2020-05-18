<?php
/**
 +---------------------------------------<br/>
 * 控制器:商品类型<br/>
 +---------------------------------------
 * @category ele
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Ptype extends Action
{
	/**
	 * 商品类型列表页面
	 */
	public function lists_()
	{
		$this->loadCss("resources/css/ptype.css");
		$this->loadJs("js/jquery.lazyload.js");
		$this->loadJs("js/ptype.js");

		$ptype_id = intval($this->data['ptype_id']);//查询分类
		$brand_id = intval($this->data['brand_id']);//查询品牌
		$sendto   = intval($this->data['sendto']);//查送礼对象
		$where_clause="isShow=1";//商品搜索条件
		$where_clause_brands=array();//品牌搜索条件
		//查询价格区间
		$pricebegin=floatval($this->data['pricebegin']);//起始价格
		$priceend=floatval($this->data['priceend']);//结束价格
		if($pricebegin>0){
			$where_clause.=" and market_price>=$pricebegin";
			$this->view->set("pricebegin",$pricebegin);
		}
		if($priceend>$pricebegin){
			$where_clause.=" and market_price<=$priceend";
			$this->view->set("priceend",$priceend);
		}

		$ptype_level = Ptype::select( "level" , array("ptype_id"=>$ptype_id));//查询分类等级



		if(is_array($ptype_level)){
			$ptype_level=$ptype_level[0];
		}
		if($ptype_level == 1){
			$where_clause.=" and ptype_key like '-".$ptype_id."-%'";
			// $where_clause_brands["ptype1_id"] =$ptype_id;
		}else if($ptype_level == 2){
			$ptype_1_id = Ptype::select_one( "parent_id" , array("ptype_id"=>$ptype_id));
			$where_clause.=" and ptype_key like '-".$ptype_1_id."-".$ptype_id."-%'";
			// $where_clause_brands["ptype2_id"] =$ptype_id;
		}
        //品牌
		if(!empty($brand_id)){
			$where_clause.=" and brand_id=".$brand_id;
		}

		$price_range = intval($this->data["price_range"]);//价格区间
		if(empty($price_range)){
			$price_range = 0;
		}
		switch($price_range){
			case 1:
				$where_clause.=" and (market_price BETWEEN 0 AND 200)";
                $pricebegin=0;
                $priceend=200;
                $this->view->set("pricebegin",$pricebegin);
                $this->view->set("priceend",$priceend);
				break;
			case 2:
				$where_clause.=" and (market_price BETWEEN 200 AND 500)";
                $pricebegin=200;
                $priceend=500;
                $this->view->set("pricebegin",$pricebegin);
                $this->view->set("priceend",$priceend);
				break;
			case 3:
				$where_clause.=" and (market_price BETWEEN 500 AND 2000)";
                $pricebegin=500;
                $priceend=2000;
                $this->view->set("pricebegin",$pricebegin);
                $this->view->set("priceend",$priceend);
				break;
			case 4:
				$where_clause.=" and (market_price BETWEEN 2000 AND 5000)";
                $pricebegin=2000;
                $priceend=5000;
                $this->view->set("pricebegin",$pricebegin);
                $this->view->set("priceend",$priceend);
				break;
			case 5:
				$where_clause.=" and (market_price BETWEEN 5000 AND 20000)";
                $pricebegin=5000;
                $priceend=20000;
                $this->view->set("pricebegin",$pricebegin);
                $this->view->set("priceend",$priceend);
				break;
			case 6:
				$where_clause.=" and market_price>20000";
                $pricebegin=20000;
                $this->view->set("pricebegin",$pricebegin);
				break;
		}
		$sorting = intval($this->data['sorting']);//排序
		switch ($sorting){
			case 1: $sort_order = "sales_count"; break;
			case 2: $sort_order = "uptime"; break;
			case 3: $sort_order = "price"; break;
			case 4: $sort_order = "product_id"; break;
			default:
				$sort_order = "product_id";
				$sorting=4;
				break;
		}
		$orderby=intval($this->data['orderby']);
		$sort_order.=($orderby==1?" asc":" desc");//正序、倒序
		if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){//得到分页数据信息
			$nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
		}else{
			$nowpage=1;
		}
		$count=Product::count($where_clause);
		$bb_page=UtilPage::init($nowpage,$count,15);//分页内容初始化

		$products = Product::queryPage($bb_page->getStartPoint(),$bb_page->getEndPoint(),$where_clause,$sort_order);
		//左侧分类
		$ptype1=Ptype::get("isShow=1 and level=1");
		$ptype2=array();
		foreach($ptype1 as $p){
			$ptype2[$p->ptype_id]=Ptype::get("isShow=1 and level=2 and parent_id=".$p->ptype_id);
		}
		$this->view->set("ptype1",$ptype1);
		$this->view->set("ptype2",$ptype2);

		//筛选品牌
        $where_clause_brands["isShow"] = 1;
		// $where_clause_brands["ptype"] = 1;



		$brands_filter=array();

		foreach ($where_clause_brands as $key=>$value) {
			$brands_filter[]=$key."=".$value;
		}

        $ptypes=array('ptype1_id','ptype2_id','ptype_id');
        $brand_ptype=$ptypes[$ptype_level-1];
        $brands_filter[]="$brand_ptype=$ptype_id";

		$brands_filter=implode(" and ",$brands_filter);

		// $search_brands = Brand::get( $brands_filter." group by brand_id ");
		$search_brands = Brandptype::get( $brands_filter." group by brand_id ");
    // var_dump($search_brands ); die;



		//热销排行
		$sortproducts=Product::get("isUp=1","sales_count desc","0,5");
		$this->view->set("sortproducts",$sortproducts);

		$this->view->set("search_brands",$search_brands);
		$this->view->set("count",$count);
		$this->view->set("products",$products);
		$this->view->set("ptype_id",$ptype_id);
		$this->view->set("brand_id",$brand_id);
		$this->view->set("pageNo",$pageNo);
		$this->view->set("price_range",$price_range);
		$this->view->set("sorting",$sorting);
        $this->view->set("orderby",$orderby);

	}



  private function getPtype(){
    //左侧分类
    $_ptype=Ptype::get("isShow=1 and level != 3","ptype_id asc");
    $ptype1=array();
    $ptype2=array();
    foreach ($_ptype as $key => $value) {
      if ($value->level==1) {
        $ptype1[]=$value;
      }else{
        $ptype2[$value->parent_id][]=$value;
      }
    }
    // var_dump($ptype2);die;
    return array($ptype1, $ptype2);
  }

  private function makeSort($sorting,$orderby){
    $sorts=array("b.sort_order","a.sales_count","a.product_id","a.price");
    $sort_order=$sorts[$sorting];
    $sort_order.=($orderby==1?" asc":" desc");//正序、倒序
    return $sort_order;
  }

  private function makeWhere($ptype_id, $brand_id, $pricebegin, $priceend,$country_id){
    $where=array('a.isShow=1 and a.isUp=1');
    if ($brand_id!=0) {
      $where[]="a.brand_id=$brand_id";
    }else{
      $where[]="a.brand_id!=0";
    }
    if ($country_id>0) {
        $where[]="a.country_id=$country_id";
    }
    if ($ptype_id!=0) {
      $where[]="a.ptype_key like '%-$ptype_id-%'";
    }

    if ($pricebegin!=null) {
      $pricebegin=floatval($pricebegin);
      $where[]="a.market_price >= $pricebegin";
    }
    if ($priceend!=null) {
      $priceend=floatval($priceend);
      $where[]="a.market_price <= $priceend";
    }
	$where[] = "a.price_tag is not null";
    return $where;
  }

  private function findProduct($where,$sort){
    if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){//得到分页数据信息
      $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
    }else{
      $nowpage=1;
    }
    $where[] = "a.brand_id = b.brand_id";
    $count=Product::countMultitable("km_product a,km_brand b",$where);
    $bb_page=UtilPage::init($nowpage,$count,15);//分页内容初始化
    $products = Product::queryPageMultitable($bb_page->getStartPoint(),$bb_page->getEndPoint(),"km_product a,km_brand b",$where,$sort);
    return array($count, $products);
  }

  private function findBrandByPtype($ptype_id,$where){
    unset($where[1]);
    unset($where[0]);
    $where[]='a.brand_id=b.brand_id';
    $where[]='isUp=1 and a.isShow=1 and b.isShow=1';
    $where=implode(' and ', $where);
    // if ($ptype_id==0) $where='';
    return sqlExecute("select a.brand_id,brand_name FROM km_product a , km_brand b  where $where group by brand_id order by initials asc",'Brand');
  }

  private function findCountry($country_id,$where){
    unset($where[0]);
    if ($country_id>0) {
        unset($where[2]);
    }
    $where[]='isUp=1 and a.isShow=1 and b.isShow=1';
    $where=implode(' and ', $where);

    return sqlExecute("select a.country_id,b.name FROM km_product a left join km_country b on a.country_id=b.country_id where $where group by a.country_id order by b.sort_order asc",'Country');
  }

  public function lists(){
    $this->loadCss("resources/css/ptype.css");
    $this->loadJs("js/jquery.lazyload.js");
    $this->loadJs("js/ptype.js");

    $country_id   = intval($this->data['country_id']);//查询国家
    $ptype_id   = intval($this->data['ptype_id']);//查询分类
    $brand_id   = intval($this->data['brand_id']);//查询品牌
    $sorting    = intval($this->data['sorting']);//排序
    $orderby    = intval($this->data['orderby']);

    $pricebegin = $this->data['pricebegin'];//起始价格
    $priceend   = $this->data['priceend'];//结束价格
    // $sendto   = intval($this->data['sendto']);//查送礼对象

    $where=$this->makeWhere($ptype_id, $brand_id, $pricebegin, $priceend,$country_id);
    $sort=$this->makeSort($sorting, $orderby);
    list($count,$products)=$this->findProduct($where, $sort);//商品
    $this->view->set("count",$count);
    $this->view->set("products",$products);

    list($ptype1 ,$ptype2)=$this->getPtype();//分类
    $this->view->set("ptype1",$ptype1);
    $this->view->set("ptype2",$ptype2);

    // var_dump($this->findBrandByPtype($ptype_id,$where));die;

    $this->view->set("search_brands",$this->findBrandByPtype($ptype_id,$where)); //品牌

    //热销排行
    $sortproducts=Product::get("isUp=1","sales_count desc","0,5");
    $this->view->set("sortproducts",$sortproducts);

    //banner
    $showimg = Banner::get_one("isShow=1 and type=16",'sort desc');
    $this->view->set("showimg", $showimg);
    //国家
    // $country = Country::get("isShow=1","sort_order desc");
    $country = $this->findCountry($country_id,$where);
    $this->view->set("country", $country);

    $this->view->set("pricebegin",$pricebegin);
    $this->view->set("priceend",$priceend);
    $this->view->set("ptype_id",$ptype_id);
    $this->view->set("brand_id",$brand_id);
    $this->view->set("country_id",$country_id);
    $this->view->set("sorting",$sorting);
    $this->view->set("orderby",$orderby);

  }
}
?>
