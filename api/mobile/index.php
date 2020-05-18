<?php
// error_reporting(0);
require_once ("../../init.php");


$ptype_goods = Ptype::get("isShow=1 and level=1 ","sort_order desc","3,10");
if ( !empty($ptype_goods) ) {
    foreach ($ptype_goods as $key => $value) {
        $prodcuts = Product::get( "isShow=1 and isUp=1 and ptype_key like '%-" . $value->ptype_id . "-%'", 'sort_order desc', '1,12' );
        
        foreach ($prodcuts as $product) {
            $product->productShow = $product->getProductShow();
            // $product->price       = sprintf("%.2f", $product->price);
            $product->price       = intval($product->price);
            $product->jifen       = intval($product->jifen);
        }
        $ptype_goods[$key]['goods'] = $prodcuts;
    }
}
$result = array(
    'data' => $ptype_goods
);

$result["debug"] = array(
    'where' => $where_clause
);
echo json_encode($result);

?>