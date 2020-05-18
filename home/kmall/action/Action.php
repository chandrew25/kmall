<?php
/**
 +----------------------------------------------<br/>
 * 所有控制器的父类<br/>
 * class_alias("Action","Controller");<br/>
 +----------------------------------------------
 * @category kmall
 * @package core.model
 * @author skygreen
 */
class Action extends ActionBasic
{
    /**
     * SEO：keywords
     */
    public $keywords = "海鲜大礼包、炒货大礼包、员工福利、企业福利、大闸蟹、通兑券";
    /**
     * SEO：description
     */
    public $description = "海鲜大礼包、炒货大礼包、员工福利、企业福利、大闸蟹、通兑券";
    /**
     * 在Action所有的方法执行之前可以执行的方法
     */
    public function beforeAction()
    {
        $this->getPtypeMenu();//分类菜单
        //购物车 (通过js读取cookie public_static)
        $cookiecart=HttpCookie::get(Gc::$appName."_cart");
        if($cookiecart){
            $cookiecart=json_decode($cookiecart);
            $cookiecart =(array)$cookiecart;
            $statistic=array("totalprice"=>0);
            $count = 0;
            foreach ($cookiecart as $product) {
                $statistic["totalprice"] += $product->price * $product->num;
                $count += $product->num;
            }
            $count=array("count"=>$count,"totalprice"=>$statistic["totalprice"]);
            $this->view->set("memberInfo",$count);
            $this->view->set("cookiecart",$cookiecart);
        }

        //热门搜索
        $url = Gc::$url_base;
        $link = $url."index.php?go=kmall.search.lists&search_keyword";
        $hot_keyword = array("智能电视");
        $hot_link = array();
        foreach($hot_keyword as $key=>$value){
            if ($hot_link && $hot_link[$key]){
                $hot_link[$key]->link = $link."=".$value;
                $hot_link[$key]->keyword = $value;
            }
        }
        $this->view->set("hot_link",$hot_link);

        //获取登录用户名
        $member_name = HttpSession::get("member_name");
        $this->view->set("member_name",$member_name);

        //获取backurl
        $backurl = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING'];
        //设置backurl
        if($_SERVER['QUERY_STRING']!="go=kmall.ajax.getLogininfo"){
            HttpSession::set("backurl",$backurl);
        }
        $ifbackurl=HttpSession::get("backurl");
        if(!$ifbackurl){
            if(Gc::$website_status){
                $backurl = Gc::$url_base."index.html";
            }else{
                $backurl = Gc::$url_base."index.php?go=kmall.index.index";
            }
            HttpSession::set("backurl",$backurl);
        }

        //获取第三方登录方式
        $logintypes = Logintype::get("isShow=1","sort_order desc");
        $this->view->set("logintypes",$logintypes);

        //当前网页链接(去除参数)
        $index_no = strpos($_SERVER['QUERY_STRING'],"&");
        if($index_no){
            $str=str_split($_SERVER['QUERY_STRING'],$index_no);
            $string=$str[0];
        }else{
            $string=$_SERVER['QUERY_STRING'];
        }
        $now_url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].'?'.$string;
        $this->view->set("now_url",$now_url);

        //如果购物车为空,优惠券取消
        if (array_key_exists(Gc::$appName."_cart",$_COOKIE)){
            $carts=json_decode($_COOKIE[Gc::$appName."_cart"]);
            $carts=(array)$carts;
        }
        if (empty($carts)){
            HttpSession::removes(array("couponprice","couponitems_key"));
        }
    }

    /**
     * 在Action所有的方法执行之后可以执行的方法
     */
    public function afterAction()
    {
    parent::afterAction();
    }

    /**
     * 将过滤条件转换成需查询的模糊条件
     * @param array|object $filter 过滤条件
     * @return string 查询条件
     */
    protected function filtertoCondition($filter)
    {
        if (is_array($filter)){
            $condition=$filter;
        }else if (is_object($filter)){
            $condition=UtilObject::object_to_array($filter);
        }
        if (!empty($condition)&&(count($condition)>0)){
            $conditionArr=array();
            foreach ($condition as $key=>$value) {
                if (!UtilString::is_utf8($value)){
                    $value=UtilString::gbk2utf8($value);
                }
                if (is_numeric($value)){
                    $conditionArr[]=$key."='".$value."'";
                }else if (contain($value,"T00:00:00")){
                    $value=str_replace("T00:00:00","",$value);
                    $conditionArr[]=$key."='".$value."'";
                }else{
                    $conditionArr[]=$key." like '%".$value."%'";
                }

            }
            $condition=implode(" and ",$conditionArr);
        }else{
            $condition="";
        }
        return $condition;
    }

    private function getPtypeMenu(){
        $ptype_arr=array();
        $sub_ptype_arr=array();
        $thr_ptype_arr = array();
        // $top_ids="940,501,888,601,793,831";
        // $_top_ptype_arr=Ptype::get("isShow=1 and level=1 and ptype_id in ($top_ids)","sort_order desc","0,6");
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
        $_top_ptype_arr=Ptype::get("isShow=1 and level=1 ".$where,"sort_order desc");
        if ($_top_ptype_arr){
          foreach ($_top_ptype_arr as $ptype) {
               $ptype_arr[]=$ptype;
               $sub_ptype_arr[$ptype->ptype_id]=array();
          }
        }
        $_sub_ptype_arr=Ptype::get("isShow=1 and level=2 ".$where,"sort_order desc");
        if ($_sub_ptype_arr){
          foreach ($_sub_ptype_arr as $sub_ptype) {
              // if (count($sub_ptype_arr[$sub_ptype->parent_id])<3) {
                  $sub_ptype_arr[$sub_ptype->parent_id][]=$sub_ptype;
              // }
          }
        }
        $_thr_ptype_arr=Ptype::get("isShow=1 and level=3 ".$where,"sort_order desc");
        if ($_thr_ptype_arr){
          foreach ($_thr_ptype_arr as $thr_ptype) {
              // if (count($sub_ptype_arr[$sub_ptype->parent_id])<3) {
                  $thr_ptype_arr[$thr_ptype->parent_id][]=$thr_ptype;
              // }
          }
        }

        $this->view->set("ptype_arr",$ptype_arr);
        $this->view->set("sub_ptype_arr",$sub_ptype_arr);
        $this->view->set("thr_ptype_arr",$thr_ptype_arr);
    }
}
?>
