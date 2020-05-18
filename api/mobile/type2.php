<?php
// error_reporting(0);
require_once ("../../init.php");

$page         = $_GET["page"];
$page_size    = $_GET["pageSize"];
$query        = $_GET["query"];

$ptype_id = intval($_GET['ptype_id']); //一级分类
$ptypeid  = intval($_GET['ptypeid']); //二级分类

$where_clause = "";
$orderDes     = "sort_order desc";

if ( !empty($query) ) {
    $where_clause = "(";
    $search_atom  = explode(" ", trim($query));
    array_walk($search_atom, function(&$value, $key) {
        $value = " ( product_name LIKE '%" . $value . "%' ) ";
    });
    $where_clause .= implode(" and ", $search_atom);
    $where_clause .= ")";
}


// if ( empty($ptypeid) ) {
//     $where_clause = "isShow=1 and isUp=1 and ptype_key like '%-" . $ptype_id . "-%'";
// } else {
//     $where_clause = "isShow=1 and isUp=1 and ptype_key like '%-" . $ptypeid . "-%'";
// }
// $productData  = Product::queryPageByPageNo( $page, $where_clause, $page_size, $orderDes );
// $data = $productData["data"];
// $recordsFiltered = $productData["count"];


if ( empty($ptypeid) ) {
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
$bb_page      = UtilPage::init( $page, $count, $page_size );
$data         = Product::queryPageMultitable($bb_page->getStartPoint(), $bb_page->getEndPoint(), "km_product p,km_brand b", $where_clause, $sort_order);

if ($data){
    foreach ($data as $key => $product) {
        if ( !empty($product->image) ) {
            $product->image = Gc::$upload_url . "images/" . $product->image;
        }
        $product->productShow = $product->getProductShow();
        // $product->price       = sprintf("%.2f", $product->price);
        $product->price       = intval($product->price);
        $product->jifen       = intval($product->jifen);

    }
}
$recordsFiltered = $count;
$recordsTotal    = Product::count();
$result = array(
  'data' => $data,
  'recordsFiltered' => $recordsFiltered,
  'recordsTotal' => $recordsTotal
);

//调试使用的信息
$result["debug"] = array(
  'where' => $where_clause
);
echo json_encode($result);
?>
