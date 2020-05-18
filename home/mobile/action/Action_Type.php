<?php
/**
 +---------------------------------------<br/>
 * 控制器:商品类型<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Type extends ActionMobile
{
    /**
     * 类型列表
     */
    public function lists()
    {
        $this->loadJs("js/fill_name.js");

        $ptype_arr     = array();
        $sub_ptype_arr = array();
        // 获取所有已上架需显示的商品的一级分类
        $_top_ptype_arr = sqlExecute("select ptype_id, name from km_dic_ptype where ptype_id in (select distinct(t.ptype_id) from (select product_id,SUBSTR(SUBSTRING_INDEX(ptype_key, '-', 2), 2) as ptype1 from km_product where isShow=1 and isUp=1) pt1,km_dic_ptype t where pt1.ptype1 = t.ptype_id)  order by sort_order desc", "Ptype");
        if ( $_top_ptype_arr ) {
            foreach ( $_top_ptype_arr as $ptype ) {
                $ptype_arr[] = $ptype;
                $sub_ptype_arr[$ptype->ptype_id] = array();
            }
        }

        // 获取所有已上架商品的二级分类
        $_sub_ptype_arr = sqlExecute("select ptype_id, name, ico, parent_id from km_dic_ptype where ptype_id in (select distinct(t.ptype_id) from (select product_id,SUBSTRING_INDEX(SUBSTRING_INDEX(ptype_key, '-', 3), '-', -1) as ptype2 from km_product where isShow=1 and isUp=1) pt2,km_dic_ptype t where pt2.ptype2 = t.ptype_id) order by sort_order desc", "Ptype");
        if ( $_sub_ptype_arr ) {
            foreach ($_sub_ptype_arr as $sub_ptype) {
                $sub_ptype_arr[$sub_ptype->parent_id][]=$sub_ptype;
            }
        }



//         $ptype_arr     = array();
//         $sub_ptype_arr = array();
//         $thr_ptype_arr = array();
//         $product       = Product::get("isShow=1 and isUp=1");
//         $ids = array();
//         if ( !empty($product) ) {
//             foreach ($product as $key => $value) {
//                 if ( $value->ptype_key ) {
//                     $ptype_key = array_filter(explode("-", $value->ptype_key));
//                     $ids = array_merge($ids, $ptype_key);
//                 }
//             }
//             $ids = array_unique($ids);
//         }
//         $where = "";
//         if ( !empty($ids) ) {
//             $where = " and ptype_id in(" . implode(",", $ids) . ")";
//         }
//         $_top_ptype_arr = Ptype::get("isShow=1 and level=1 " . $where, "sort_order desc");
//         if ( $_top_ptype_arr ) {
//             foreach ( $_top_ptype_arr as $ptype ) {
//                 $ptype_arr[] = $ptype;
//                 $sub_ptype_arr[$ptype->ptype_id] = array();
//             }
//         }
//         $_sub_ptype_arr = Ptype::get("isShow=1 and level=2 " . $where, "sort_order desc");
//         if ( $_sub_ptype_arr ) {
//             foreach ($_sub_ptype_arr as $sub_ptype) {
//                 $sub_ptype_arr[$sub_ptype->parent_id][]=$sub_ptype;
//             }
//         }
//
// //        $_thr_ptype_arr=Ptype::get("isShow=1 and level=3 ".$where,"sort_order desc");
// //        if ($_thr_ptype_arr){
// //            foreach ($_thr_ptype_arr as $thr_ptype) {
// //                $thr_ptype_arr[$thr_ptype->parent_id][]=$thr_ptype;
// //            }
// //        }
        $this->view->set("ptype_arr", $ptype_arr );
        $this->view->set("sub_ptype_arr", $sub_ptype_arr);
// //       $this->view->set("thr_ptype_arr",$thr_ptype_arr);
    }

    /**
     * 二级分类页面
     */
    public function lists_info(){
        $this->loadJs("js/inner.js");
        $this->loadCss("resources/css/type.css");
        $ptype_id = intval($this->data['ptype_id']); //二级分类
        $ptypeid = intval($this->data['ptypeid']); //三级级分类
        $pty   = Ptype::get_by_id($ptype_id); // 二级分类类型，用于显示筛选所有二级分类下的所有三级分类
        $ptype = sqlExecute("SELECT p.*,count(g.product_id) as num from km_dic_ptype as p left join km_product as g on g.ptype_key like concat('%-',p.ptype_id,'-%') where p.isShow=1 and g.isShow=1 and g.isUp=1 and p.parent_id=" . $ptype_id . " GROUP BY p.ptype_id ORDER BY num DESC, p.ptype_id desc");
        // if ( empty($ptypeid) ) {
        //     $ptypeid = $ptype[0]['ptype_id'];

        //     $ptypeid = 0;
        //     $where_clause = "isShow=1 and isUp=1 and ptype_key like '%-" . $ptype_id . "-%'";
        // } else {
        //     $where_clause = "isShow=1 and isUp=1 and ptype_key like '%-" . $ptypeid . "-%'";
        // }
        // $productData = Product::queryPageByPageNo( 1, $where_clause, 10, 'sort_order desc' );
        // $productData = $productData["data"];

        if ( empty($ptypeid) ) {
            $ptypeid = $ptype[0]['ptype_id'];

            $ptypeid = 0;
            $where_clause = "isShow=1 and isUp=1 and ptype_key like '%-" . $ptype_id . "-%'";
            $count = Product::count($where_clause);

            $where_clause = " p.isShow=1 and p.isUp=1 and p.ptype_key like '%-" . $ptype_id . "-%' ";
        } else {
            $where_clause = "isShow=1 and isUp=1 and ptype_key like '%-" . $ptypeid . "-%'";
            $count = Product::count($where_clause);
            
            $where_clause = " p.isShow=1 and p.isUp=1 and p.ptype_key like '%-" . $ptypeid . "-%' ";
        }

        $where_clause = $where_clause . " and p.brand_id=b.brand_id ";
        $sort_order   = " b.sort_order desc, p.sort_order desc ";
        //分页内容初始化，每页10个单项内容
        $bb_page      = UtilPage::init( 1, $count, 10 );
        $productData  = Product::queryPageMultitable($bb_page->getStartPoint(), $bb_page->getEndPoint(), "km_product p,km_brand b", $where_clause, $sort_order);

        $this->view->set("pty", $pty);
        $this->view->set("ptype_id", $ptype_id);
        $this->view->set("ptypeid", $ptypeid);
        $this->view->set("ptype", $ptype);
        $this->view->set("productData", $productData);
    }

    /**
     * 一级分类页面
     */
    public function lists_info2(){
        $this->loadJs("js/inner.js");
        $this->loadCss("resources/css/type.css");
//        $this->loadJs("js/pay_success.js");
        $ptype_id = intval($this->data['ptype_id']); //一级分类
        $ptypeid  = intval($this->data['ptypeid']); //二级分类
        $pty      = Ptype::get_by_id($ptype_id); // 一级分类类型，用于显示筛选所有一级分类下的所有二级分类
        $ptype    = sqlExecute("SELECT p.*,count(g.product_id) as num from km_dic_ptype as p left join km_product as g on g.ptype_key like concat('%-',p.ptype_id,'-%') where p.isShow=1 and g.isShow=1 and g.isUp=1 and p.parent_id=".$ptype_id." GROUP BY p.ptype_id ORDER BY num DESC, p.ptype_id desc");
        // 一级分类类型，用于显示筛选所有一级分类下的所有二级分类
        // if ( empty($ptypeid) ) {
        //     $ptypeid = $ptype[0]['ptype_id'];
        //     $ptypeid = 0;
        //     $where_clause = "isShow=1 and isUp=1 and ptype_key like '%-" . $ptype_id . "-%'";
        // } else {
        //     $where_clause = "isShow=1 and isUp=1 and ptype_key like '%-" . $ptypeid . "-%'";
        // }
        // $productData = Product::queryPageByPageNo( 1, $where_clause, 10, 'sort_order desc' );
        // $productData = $productData["data"];


        if ( empty($ptypeid) ) {
            $ptypeid = $ptype[0]['ptype_id'];
            $ptypeid = 0;
            $where_clause = " isShow=1 and isUp=1 and ptype_key like '%-" . $ptype_id . "-%' ";
            $count = Product::count($where_clause);

            $where_clause = " p.isShow=1 and p.isUp=1 and p.ptype_key like '%-" . $ptype_id . "-%' ";
        } else {
            $where_clause = " isShow=1 and isUp=1 and ptype_key like '%-" . $ptypeid . "-%' ";
            $count = Product::count($where_clause);
            
            $where_clause = " p.isShow=1 and p.isUp=1 and p.ptype_key like '%-" . $ptypeid . "-%' ";
        }

        $where_clause = $where_clause . " and p.brand_id=b.brand_id ";
        $sort_order   = " b.sort_order desc, p.sort_order desc ";
        //分页内容初始化，每页10个单项内容
        $bb_page      = UtilPage::init( 1, $count, 10 );
        $productData  = Product::queryPageMultitable($bb_page->getStartPoint(), $bb_page->getEndPoint(), "km_product p,km_brand b", $where_clause, $sort_order);


        // 当前二级分类下所有的商品
        $this->view->set("pty", $pty);
        $this->view->set("ptype_id", $ptype_id);
        $this->view->set("ptypeid", $ptypeid);
        $this->view->set("ptype", $ptype);
        $this->view->set("productData", $productData);
    }
}

?>
