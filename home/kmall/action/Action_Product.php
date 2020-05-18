<?php
/**
 +---------------------------------------<br/>
 * 控制器:商品<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Product extends Action
{


    /**
     * 商品详情页面
     */
    public function view()
    {
        $this->loadCss("resources/css/product.css");
        $this->loadCss("resources/css/jquery.jqzoom.css");
        $this->loadJs("js/jquery.lazyload.js");
        $this->loadJs("js/jquery.jqzoom-core.js");
        $this->loadJs("js/product.js");
        $this->loadJs("js/leftTime.min.js");

        $product_id=$this->data["product_id"];
        $goods_id=$this->data["goods_id"];
        $product=Product::get_by_id($product_id);//商品
        // echo "<pre>";var_dump($product->getSeckill);die;

        if(empty($product)){
            $goods=Goods::get_by_id($goods_id);
            if(empty($goods)){
                $this->redirect("index","index");
                return;
            }
            $product=Product::get_by_id($goods->product_id);
            if(empty($product)){
                $this->redirect("index","index");
                return;
            }
            $product_id=$goods->product_id;
        }else{
            $goods=Goods::get_one("product_id=".$product_id);//商品的货品

            // if(empty($goods)){
            //     $this->redirect("index","index");
            //     return;
            // }
        }
        Product::updateProperties($product_id,array('click_count'=>$product->click_count+1));//增加点击次数

        $goods_ids=Goods::select('goods_id','product_id='.$product->product_id);

        //套餐
        if ($goods_ids){
            $meal_ids=Mealgoods::select("distinct meal_id","goods_id in (".implode(',', $goods_ids).")");
            $meals=array();//套餐
            $mealgoodss=array();//套餐货品
            $meal_master_goodses=array();//套餐主商品
            if ($meal_ids){
              foreach($meal_ids as $id){
                  $meal=Meal::get_by_id($id);
                  $total=0;
                  $mgs=Mealgoods::get("meal_id=$id");

                  //去掉当前货品
                  foreach ($mgs as $key => $value) {
                      if (array_search($value->goods_id, $goods_ids)!==false) {
                          $meal_master_goodses[$id]=$value->goods;
                          unset($mgs[$key]);
                          break;
                      }
                  }

                  $gs=array();
                  foreach($mgs as $mg){
                      $g=Goods::get_by_id($mg->goods_id);
                      $g->image=$g->product->image;
                      $gs[]=$g;
                      $total+=($g->sales_price);
                  }
                  $meal->total=$total+$goods->sales_price;
                  $meals[]=$meal;
                  $mealgoodss[$id]=$gs;
              }
            }
            $this->view->set("mealgoodss",$mealgoodss);
            $this->view->set("meals",$meals);
            $this->view->set("meal_master_goodses",$meal_master_goodses);//套餐的主货品
        }

        $_goodses=Goods::get('product_id='.$product->product_id);
        $goodses=array();
        if ($_goodses){
          foreach ($_goodses as $key => $value) {
               $goodses[$value->goods_id]=$value;
          }
        }
        //组合
        $allgroups=array();
        if ($goods_ids) {
          foreach ($goods_ids as $key => $pgid) {
              $gids=Groups::select("fgoods_id","pgoods_id=".$pgid);
              $groups=array();
              if (!is_array($gids)) {
                  $gids=array($gids);
              }
              foreach($gids as $gid){
                  $g=Goods::get_by_id($gid);
                  if($g){
                      $g->image=$g->product->image;
                      $groups[]=$g;
                  }

              }
              if (count($groups)>0) {
                  $allgroups[$pgid]=$groups;
              }
          }
        }
        /******************商品规格******************/
        $json_goods = null;
        $goodslist = null;
        $json_goodslist = null;
        $maxprice = 0;
        $minprice = 0;
        $bslist = null;
        $lslist = null;
        if($product->isMultiplespec){//如果为多规格商品
            $goodslist=Goods::get("product_id=$product->product_id");//货品列表
            $bslist=sqlExecute("select * from ".Attribute::tablename()." where attribute_id in(select distinct attr_p_id from ".Productspec::tablename()." where product_id=$product_id) order by sort_order desc","Attribute");//父规格列表
            $lslist=array();//子规格列表
            foreach($bslist as $bs){
                $lslist[$bs->attribute_id]=Productspec::get("product_id=$product_id and attr_p_id=".$bs->attribute_id);
            }
            $maxprice=$goods->sales_price;
            $minprice=$goods->sales_price;
            foreach($goodslist as $item){
                $maxprice=max($item->sales_price,$maxprice);
                $minprice=min($item->sales_price,$minprice);
            }
            $json_goods=str_replace("\"","'",json_encode($goods));

            $json_goodslist=str_replace("\"","'",json_encode($goodslist));
        }

        $seriesImgs=Seriesimg::get("isShow=1 and product_id=".$product_id,"sort_order desc");//商品系列图
        $seeproducts=Product::select("product_id,product_name,price,market_price,image,jifen","isUp=1 and price_tag is not null and product_id!=".$product_id,"rand()","0,5");//看过此商品的顾客还看过
        $hotproducts=Product::select("product_id,product_name,price,market_price,image,jifen","isUp=1 and price_tag is not null and ptype_id=".$product->ptype_id." and product_id!=".$product_id,"click_count desc","0,5");//同类商品人气排行


        //
        $banner = Banner::get_one("isShow=1 and type=33",'sort desc');
        $this->view->set("banner", $banner);
        $this->view->set("product",$product);
        // $this->view->set("groups",$groups);
        $this->view->set("allgroups",$allgroups);
        $this->view->set("goodses",$goodses);
        $this->view->set("seeproducts",$seeproducts);
        $this->view->set("hotproducts",$hotproducts);
        $this->view->set("seriesImgs",$seriesImgs);
        $this->view->set("goods",$goods);//货品
        $this->view->set("json_goods",$json_goods);//货品json
        $this->view->set("goodslist",$goodslist);//货品列表
        $this->view->set("json_goodslist",$json_goodslist);//货品列表json
        $this->view->set("maxprice",$maxprice);//货品最高价
        $this->view->set("minprice",$minprice);//货品最低价
        $this->view->set("bslist",$bslist);//父规格列表
        $this->view->set("lslist",$lslist);//子规格列表


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
            $product_array["product_name"]=$product->productShow;
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
    /**
     * 删除商品浏览记录(cookie操作)
     */
     public function baseDeleteSeeProduct()
     {
        $member_id = HttpSession::get('member_id');
        setcookie ('seeproduct_member_'.$member_id, "", time() - 3600);
        $url = $_SERVER['HTTP_REFERER'];
        $this->redirect_url($url);
     }

    /**
     * 添加商品浏览记录(数据库操作)
     */
    public function baseSaveSeeProduct($member_id,$product_id)
    {
        //读取用户的最近浏览过的商品（3个）
        $history_items = Seeproduct::get( array("member_id"=>$member_id) , "updateTime desc" , "0,3" );
        $this->view->set("history_items",$history_items);
        $is_new_history=Seeproduct::get(array("member_id"=>$member_id,"product_id"=>$product_id));
        if(!empty($is_new_history)){
            //若已浏览过此商品，则只更新商品的最新浏览时间
            Seeproduct::updateProperties(array($is_new_history[0]->seeproduct_id),array("updateTime"=>UtilDateTime::now()));
        }else{
            //若此次为第一次浏览此商品，数据库中写入新的记录
            $product = Product::get_by_id($product_id);
            $new_history = new Seeproduct();
            $new_history->member_id = $member_id;
            $new_history->product_id = $product->product_id;
            $new_history->product_name = $product->productShow;
            $new_history->product_ico = $product->image;
            $new_history->price = $product->price;
            $new_history->unit = $product->unit;
            $new_history->save();
        }
    }
    /**
     * 增加商品评论
     */
    public function add_comment()
    {
        //若用户没用登录，跳转到登录界面
        if(!HttpSession::isHave('member_id')) {
            $this->redirect("auth","login","a=".$backurl);
            return ;
        }
        //若用户增加了新的评论，则写入数据库中
        $is_new_comment = $this->data['is_new_comment'];

        if ( $is_new_comment == 1 ){


            $comment = new Comment();

            //定义member_id
            $my_member_id = HttpSession::get('member_id');
            $comment->member_id = $my_member_id;
            //定义username
            $my_member_name = Member::get_by_id( $my_member_id );
            $comment->memberName = $my_member_name->username;
            //定义comment_type
            $comment->comment_type = 0;
            //定义product_id
            $comment->product_id = $this->data['product_id'];
            //定义content
            $comment->content = $this->data['user_comment'];
            //定义add_time
            $comment->add_time = UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);
            //定义is_show
            $comment->isShow = 1;

            //将评论数据存入数据库
            $comment->save();
            //跳转到view页面
            $this->redirect( "product" , "view" , array('product_id'=>$this->data['product_id']) );

        }

    }

    /**
    * 加入收藏
    */
    public function addCollect()
    {
        //获得product_id    member_id
        $product_id=$this->data["product_id"];
        $websafe = is_numeric($product_id);
        $params=array();
        if ($websafe){
            //获取用户标识
            $member_id=HttpSession::get('member_id');
            //判断是否已经收藏过
            $hascollect=Collect::get_one("product_id=".$product_id,"");
            if($hascollect){
                $isCollect=true;
            }else{
                $isCollect=false;
            }
            //获得product
            $product=Product::get_by_id($product_id);
            if ($product){
                if(!$isCollect){
                    $collect= new Collect();
                    $collect->member_id    =$member_id;
                    $collect->product_id   =$product_id;
                    $collect->product_name =$product->productShow;
                    $collect->price        =$product->price;
                    $collect->jifen        =$product->jifen;
                    $collect->unit         =$product->unit;
                    $collect->isAttent     =false;
                    $collect->save();

                    $params['product_id']=$product_id;
                    $params['success']="1";
                }else{
                    $params['product_id']=$product_id;
                    $params['success']="0";
                }
            }
            $this->redirect('product','view',$params);
        }
    }

    private function backnUrl($addtype=2) {
        $backurl=$_SERVER["HTTP_REFERER"];//设置cookie 的backurl路径
        if($addtype==1){
            $this->redirect("cart","lists");
        }else if($addtype==3){
            $this->redirect("checkout","view");
        }else{
            $this->redirect_url($backurl);
        }
    }

    /**
    * 订购捆绑商品
    */
    public function addGroup() {
        $goods_ids=$this->data["goods_ids"];
        $goods_ids=explode('-', $goods_ids);
        foreach ($goods_ids as $goods_id) {
            $this->addGoods($goods_id,1);
        }
        $this->backnUrl();
    }

    /**
    * 订购套餐商品
    */
    public function addMeal() {
         $meal_id=$this->data["goods_ids"];
         $goods_ids=Mealgoods::select('goods_id','meal_id='.$meal_id);
         foreach ($goods_ids as $goods_id) {
            $this->addGoods($goods_id,1);
        }
        $this->backnUrl();
    }

        /**
    * 订购
    */
    public function addProduct()
    {
        $addtype= $this->data["addtype"];
        $goods_id=$this->data["goods_id"];
        $gift_id=$this->data["giveaway"];
        $gnum=intval($this->data["gnum"]);
        $num=intval($this->data["num"]);
        $product_id=$this->data["product_id"];

        // print_r($product_id);
        $this->addGoods($goods_id,$num,2,$gift_id,$gnum,$product_id);
        $this->backnUrl();
    }
    /**
    *秒杀抢购
    */
    public function addProduct2(){
        $addtype= $this->data["addtype"];
        $goods_id=$this->data["goods_id"];
        $gift_id=$this->data["giveaway"];
        $gnum=intval($this->data["gnum"]);
        $num=intval($this->data["num"]);
        $product_id=$this->data["product_id"];
        $this->addGoods($goods_id,$num,2,$gift_id,$gnum,$product_id);
        $this->redirect("cart","lists");
    }
    public function isLimited()
    {

        $product_id= $this->data["product_id"];
        $num=$this->data["num"];
        $product=Product::get_by_id($product_id);//商品
        $seckill = $product->getSeckill;
        $result = array("code"=>1);
        if ($seckill) {
            
            $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
            $numold = $carts->$product_id->num;
            $num = $numold + $num;
            if ($seckill['limit_num']<$num) {
                if ($seckill['limit_num'] >0) {
                    $result = array("code"=>2,"msg"=>'秒杀商品限购'.$seckill['limit_num'].'个');
                }else{
                    $result = array("code"=>2,"msg"=>'已秒杀完');
                }
                echo json_encode($result);
                die;
            }
            $sum = $seckill['sec_num'] - $seckill['bought_num'];
            if ($num>$sum) {
                if ($sum>0) {
                    $result = array("code"=>3,"msg"=>'秒杀商品库存只剩'.$sum.'个');
                }else{
                    $result = array("code"=>3,"msg"=>'已秒杀完');
                }
                echo json_encode($result);
                die;
            }
            if ($seckill['jifen']>4000) {
                $memberdata=Seckillproduct::get_by_id($seckill['seckillproduct_id']);
                $memberdata->bought_num = $memberdata->sec_num;
                $memberdata->update();
                $result = array("code"=>3,"msg"=>'已秒杀完');
            }
        }
        echo json_encode($result);
    }

    private function addGoods($goods_id,$num,$addtype=2,$gift_id=0,$gnum=0,$product_id=null) {
        if (!empty($product_id)){
            //获取商品信息
            $product=Product::get_by_id($product_id);
            $isLimited = 0;
            if ($product->getSeckill && $product->getSeckill['sec_num']>$product->getSeckill['bought_num']) {
                $product->price = $product->getSeckill['price'];
                $product->jifen = $product->getSeckill['jifen'];
                $isLimited = $product->getSeckill['seckill_id'];;
            }
            if ( $product ) {
              //从cookie获取购物车信息
              $cart_arr=json_decode(($_COOKIE[Gc::$appName."_cart"]));
              //判断购物车中是否存在该购买商品
              $goods_arr=$cart_arr->$product_id;
              if(empty($goods_arr)){
                $goods=Goods::get_by_id($goods_id);
                if ($goods) {
                  $goods_arr->goods_code=$goods->goods_code;
                  $goods_arr->goods_name=$goods->productShow;
                  $goods_arr->sales_price=$goods->sales_price;
                  $goods_arr->goods_id=$goods->goods_id;

                  $goods_arr->goods_id=$product->product_id;
                  $goods_arr->sales_price=$product->price;
                }else{
                  $goods_arr->goods_code=$product->product_code;
                  $goods_arr->goods_name=$product->productShow;
                  $goods_arr->sales_price=$product->price;
                  $goods_arr->goods_id=$product->product_id;
                }
                $goods_arr->ico=$product->image;
                $goods_arr->product_id=$product->product_id;
                $goods_arr->jifen=$product->jifen;
                $goods_arr->market_price=$product->market_price;
                $goods_arr->price=$product->price;
                $goods_arr->num=$num;
                $goods_arr->isLimited = $isLimited;
              }else{
                if ($goods_arr->isLimited == $isLimited) {
                    $goods_arr->num+=$num;
                }

              }
              //购物车商品信息存入购物车数组
              $cart_arr->$product_id=$goods_arr;
              setcookie(Gc::$appName."_cart",json_encode($cart_arr),time()+3600*24*30,"/");
              $_COOKIE[Gc::$appName."_cart"]=json_encode($cart_arr);
              if ($product->getSeckill) {
                    $memberdata=Seckillproduct::get_by_id($product->getSeckill['seckillproduct_id']);
                    $memberdata->bought_num = $memberdata->bought_num + $num;
                    $memberdata->update();
              }
            }
        } else {
            $websafe1 = is_numeric($addtype)||empty($addtype);
            $websafe2 = is_numeric($goods_id);
            $websafe3 = is_numeric($num);
            $websafe4 = is_numeric($gift_id)||empty($gift_id);
            $websafe5 = is_numeric($gnum);
            $websafe = $websafe1&&$websafe2&&$websafe3&&$websafe4&&$websafe5;

            if ($websafe){
                //获取goods信息
                $goods=Goods::get_by_id($goods_id);
                $product_id=$goods->product_id;
                //获取商品信息
                $product=Product::get_by_id($product_id);
                if ($goods&&$product) {
                    //从cookie获取购物车信息
                    $cart_arr=json_decode(($_COOKIE[Gc::$appName."_cart"]));
                    //判断购物车中是否存在该购买商品
                    $goods_arr=$cart_arr->$goods_id;
                    if(empty($goods_arr)){
                        $goods_arr->goods_code=$goods->goods_code;
                        $goods_arr->goods_name=$goods->productShow;
                        $goods_arr->ico=$product->image;
                        $goods_arr->goods_id=$goods->goods_id;
                        $goods_arr->product_id=$product->product_id;
                        $goods_arr->sales_price=$goods->sales_price;
                        $goods_arr->jifen=$product->jifen;
                        $goods_arr->market_price=$goods->market_price;
                        $goods_arr->num=$num;
                    }else{
                        $goods_arr->num+=$num;
                    }
                    //获取赠品信息
                    $gift=Goods::get_by_id($gift_id);
                    //如果存在赠品
                    if($gift){
                        //赠品数量*购买商品数量
                        $giftnum=$gnum*$num;
                        //判断该赠品是否在赠品数组中
                        $gift_arr=$goods_arr->gift_arr->$gift_id;
                        if(empty($gift_arr)){
                            $gift_arr->gift_id=$gift_id;
                            $gift_arr->gift_code=$gift->goods_code;
                            $gift_arr->gift_name=$gift->productShow;
                            $gift_arr->gift_price=$gift->sales_price;
                            $gift_arr->gift_num=$giftnum;
                        }else{
                            $gift_arr->gift_num+=$giftnum;
                        }
                        //赠品信息存入赠品数组
                        $goods_arr->gift_arr->$gift_id=$gift_arr;
                    }
                    //购物车商品信息存入购物车数组
                    $cart_arr->$goods_id=$goods_arr;
                    setcookie(Gc::$appName."_cart",json_encode($cart_arr),time()+3600*24*30,"/");
                    $_COOKIE[Gc::$appName."_cart"]=json_encode($cart_arr);

                }
            } else {
                $this->redirect("info","view","type=".EnumViewInfoType::CARTADDPRODUCT);
            }
        }
    }

}
?>
