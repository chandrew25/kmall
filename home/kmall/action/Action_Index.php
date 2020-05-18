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
class Action_Index extends Action
{
    /**
      * 控制器:首页
      */
    public function welcome(){
        $this->loadCss("resources/css/welcome.css");
    }

    public function index() {
        $this->loadCss("resources/css/common.css");
        $this->loadCss("resources/css/main.css");
        $this->loadJs("js/main.js");

        $brands = Brand::get("isShow=1",'','0,7');//品牌
        $this->view->set("brands",$brands);

        $hotSaleProducts=Product::get("isShow=1 and isUp=1",'sales_count desc','0,4');
        $this->view->set("hotSaleProducts", $hotSaleProducts);
        $this->view->set("recommend_products",$this->getRecommendProducts());//f1右侧推荐商品

        //礼包
        $fitProducts1=Product::get("isShow=1 and isUp=1 and isPackage=1",null,'0,4');
        $this->view->set("fitProducts1", $fitProducts1);

        // echo "<pre>";var_dump($fitProducts1[0]->getProductImg);die;

        // $fitProducts2=Product::get("isShow=1 and isUp=1 and ptype_id = 5592",null,'4,3');
        // $this->view->set("fitProducts2", $fitProducts2);
        // $fitProducts3=Product::get("isShow=1 and isUp=1 and ptype_id = 5592",null,'7,3');
        // $this->view->set("fitProducts3", $fitProducts3);
        // $fitProducts4=Product::get("isShow=1 and isUp=1 and ptype_id = 5592",null,'10,3');
        // $this->view->set("fitProducts4", $fitProducts4);

        //首页banner
        $banner = Banner::get("isShow=1 and type=1",'sort desc');
        $this->view->set("banner", $banner);

        //热销排行榜广告
        $f1_last_item = Banner::get_one("isShow=1 and type=2",'sort desc');
        $this->view->set("f1_last_item", $f1_last_item);

        //首页精品推荐广告
        $f2_imgs_item = Banner::get("isShow=1 and type=3",'sort desc','0,2');
        $this->view->set("f2_imgs_item", $f2_imgs_item);

        //首页礼包左广告
        $f3_img1 = Banner::get_one("isShow=1 and type=4",'sort desc');
        $this->view->set("f3_img1", $f3_img1);

        //首页礼包右广告
        $f3_img2 = Banner::get_one("isShow=1 and type=5",'sort desc');
        $this->view->set("f3_img2", $f3_img2);

        //首页楼层广告
        $ad_line = Banner::get_one("isShow=1 and type=6",'sort desc');
        $this->view->set("ad_line", $ad_line);

        //首页家纺天地
        $pro_item1 = Banner::get_one("isShow=1 and type=7",'sort desc');
        $this->view->set("pro_item1", $pro_item1);

        //首页家电世界
        $pro_item2 = Banner::get_one("isShow=1 and type=8",'sort desc');
        $this->view->set("pro_item2", $pro_item2);

        //首页家居生活
        $pro_item3 = Banner::get_one("isShow=1 and type=9",'sort desc');
        $this->view->set("pro_item3", $pro_item3);

        //首页食品饮料
        $pro_item4 = Banner::get_one("isShow=1 and type=10",'sort desc');
        $this->view->set("pro_item4", $pro_item4);

        //首页母婴精品
        $pro_item5 = Banner::get_one("isShow=1 and type=11",'sort desc');
        $this->view->set("pro_item5", $pro_item5);

        //首页珠宝配饰
        $pro_item6 = Banner::get_one("isShow=1 and type=12",'sort desc');
        $this->view->set("pro_item6", $pro_item6);

        //首页衣包鞋帽
        $pro_item7 = Banner::get_one("isShow=1 and type=13",'sort desc');
        $this->view->set("pro_item7", $pro_item7);

        //首页轻奢美妆
        $pro_item8 = Banner::get_one("isShow=1 and type=14",'sort desc');
        $this->view->set("pro_item8", $pro_item8);

        //首页旅游户外
        $pro_item9 = Banner::get_one("isShow=1 and type=15",'sort desc');
        $this->view->set("pro_item9", $pro_item9);

        $product = Product::get("isShow=1 and isUp=1");
        $ids = array();
        if (!empty($product)) {
            foreach ($product as $key => $value) {
                if($value->ptype_key){
                    $ptype_key = array_filter(explode("-", $value->ptype_key));
                    $ids = array_merge($ids,$ptype_key);
                }
            }
            $ids = array_unique($ids);
        }
        $where = "";
        if (!empty($ids)) {
            $where = " and ptype_id in(".implode(",",$ids).")";
        }

        $f0_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-1000-%'",'sort_order desc','0,8');
        $f0_ptype = Ptype::get("isShow=1 and level=2 and parent_id=1000 ".$where,'sort_order desc','0,6');

        $f1_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-1500-%'",'sort_order desc','0,8');
        $f1_ptype = Ptype::get("isShow=1 and level=2 and parent_id=1500 ".$where,'sort_order desc','0,6');

        $f2_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-2000-%'",'sort_order desc','0,8');
        $f2_ptype = Ptype::get("isShow=1 and level=2 and parent_id=2000 ".$where,'sort_order desc','0,6');

        $f3_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-2500-%'",'sort_order desc','0,8');
        $f3_ptype = Ptype::get("isShow=1 and level=2 and parent_id=2500 ".$where,'sort_order desc','0,6');

        $f4_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-3000-%'",'sort_order desc','0,8');
        $f4_ptype = Ptype::get("isShow=1 and level=2 and parent_id=3000 ".$where,'sort_order desc','0,6');

        $f5_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-3500-%'",'sort_order desc','0,8');
        $f5_ptype = Ptype::get("isShow=1 and level=2 and parent_id=3500 ".$where,'sort_order desc','0,6');

        $f6_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-4000-%'",'sort_order desc','0,8');
        $f6_ptype = Ptype::get("isShow=1 and level=2 and parent_id=4000 ".$where,'sort_order desc','0,6');

        $f7_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-4500-%'",'sort_order desc','0,8');
        $f7_ptype = Ptype::get("isShow=1 and level=2 and parent_id=4500 ".$where,'sort_order desc','0,6');

        $f8_arr=Product::get("isShow=1 and isUp=1 and ptype_key like '%-5000-%'",'sort_order desc','0,8');
        $f8_ptype = Ptype::get("isShow=1 and level=2 and parent_id=5000 ".$where,'sort_order desc','0,6');

        $this->view->set("f0_arr",$f0_arr);
        $this->view->set("f1_arr",$f1_arr);
        $this->view->set("f2_arr",$f2_arr);
        $this->view->set("f3_arr",$f3_arr);
        $this->view->set("f4_arr",$f4_arr);
        $this->view->set("f5_arr",$f5_arr);
        $this->view->set("f6_arr",$f6_arr);
        $this->view->set("f7_arr",$f7_arr);
        $this->view->set("f8_arr",$f8_arr);

        $this->view->set("f0_ptype",$f0_ptype);
        $this->view->set("f1_ptype",$f1_ptype);
        $this->view->set("f2_ptype",$f2_ptype);
        $this->view->set("f3_ptype",$f3_ptype);
        $this->view->set("f4_ptype",$f4_ptype);
        $this->view->set("f5_ptype",$f5_ptype);
        $this->view->set("f6_ptype",$f6_ptype);
        $this->view->set("f7_ptype",$f7_ptype);
        $this->view->set("f8_ptype",$f8_ptype);
        
    }

    public function wealth(){
        $this->loadCss("resources/css/common.css");
        $type = intval($this->data['t']);
        $banner = Banner::get_one("isShow=1 and type=".$type,'sort desc');
        $this->view->set("banner", $banner);
    }
     /**
      * 控制器:首页
      */
    public function index1() {
        $this->loadCss("resources/css/index.css");
        //$this->loadJs("js/index.js");

        $brands = Brand::get("isShow=1");//品牌
        $this->view->set("brands",$brands);

        $this->view->set("recommend_products",$this->getRecommendProducts());//f1右侧推荐商品
        $this->view->set("four_products",$this->getSideFour()); //f0 - f3 4个并排商品
        $this->view->set("up_products",$this->getSideUp()); //f0 - f3 4个并排商品

    }

    public function index_foru() {
        $this->loadCss("resources/css/index.css");
        $this->loadJs("js/index.js");

        $brands = Brand::get("isShow=1",'','0,7');//品牌
        $this->view->set("brands",$brands);

        //$this->view->set("recommend_products",$this->getRecommendProducts());//f1右侧推荐商品
        $f0_arr=Product::get("isShow=1 and ptype_key like '%-501-%'",'','0,4');
        $f1_arr=Product::get("isShow=1 and ptype_key like '%-601-%'",'','0,4');
        $f2_arr=Product::get("isShow=1 and ptype_key like '%-640-%'",'','0,4');
        $f3_arr=Product::get("isShow=1 and ptype_key like '%-705-%'",'','0,4');
        $f4_arr=Product::get("isShow=1 and ptype_key like '%-817-%'",'','0,4');
        $f5_arr=Product::get("isShow=1 and ptype_key like '%-793-%'",'','0,4');
        $this->view->set("f0_arr",$f0_arr);
        $this->view->set("f1_arr",$f1_arr);
        $this->view->set("f2_arr",$f2_arr);
        $this->view->set("f3_arr",$f3_arr);
        $this->view->set("f4_arr",$f4_arr);
        $this->view->set("f5_arr",$f5_arr);

        //$this->view->set("four_products",$this->getSideFour());
        //$this->view->set("up_products",$this->getSideUp()); //f0 - f3 4个并排商品
    }

    private function getRecommendProducts() {
        $result = Product::get('isUp=1 and isRecommend=1','sort_order desc','0,5');
        return $result;
        // return array(
        //     'f11'=>Product::get('isUp=1 and isRecommend=1','sort_order desc','0,8'),//f1-1推荐商品右侧
        //     'f12'=>$this->getProductByStyle('欧式'),//f1_2欧式风格右侧
        //     'f13'=>$this->getProductByStyle('现代') //f1_3现代风格右侧
        //     );
    }

    private function getSideFour(){
        $floors=array('f0'=>'0','f1'=>'1','f2'=>'2','f3'=>'3','f4'=>'4','f5'=>'5');
        foreach ($floors as $key => $floor) {
             $floors[$key]=$this->getSideByfloor($floor,0);

        }
        return $floors;
    }

    private function getSideUp() {
        $floors=array('f2'=>'4','f3'=>'5');
        $products=array();
        foreach ($floors as $key => $floor) {
            $left=$this->getSideByfloor($floor,1);
            $right=$this->getSideByfloor($floor,2);
          $products[$key]['left']  = $left[0] ;
            $products[$key]['right'] = $right[0] ;
        }
        return $products;
    }


    private function getProductByStyle($style){
        return sqlExecute("select a.* from ji_product a,ji_product_re_productspec b where a.product_id=b.product_id and a.isUp=1 and a.isRecommend=1 and b.attr_p_name='风格' and b.attr_name like '%".$style."%' order by a.sort_order desc limit 0,8",'Product');
    }

    private function getSideByfloor($floor,$side){
        $side_products=Indexpage::get("floor='$floor' and side='$side' and isShow=1",'sort_order desc',"0,4");
        if (!$side_products) {
            $products=Product::get("isUp=1 and isShow=1",'sort_order desc',"0,4");
            return $products;
        }
        foreach ($side_products as $key => $value) {
             $side_products[$key]=$value->product;
             if(!empty($value->image)){//如果设置了商品图 则替换原来的商品图
                 $side_products[$key]->image=$value->image;
             }
             if ($side==0 && $value->fimage) {//如果设置了焦点图则使用焦点图
                 $side_products[$key]->fimage=$value->fimage;
             }
        }
        return $side_products;
    }

}
?>
