<?php
require_once ("../../init.php");

$products = Product::get("ptype_key is null");
$i = 0;
foreach ($products as $product) {
    $ptype3_id = $product->ptype_id;
    if ($ptype3_id) {
        $ptype     = Ptype::get_by_id($ptype3_id);
        $ptype2    = Ptype::get_by_id($ptype->parent_id);
        $ptype2_id = $ptype2->ptype_id;
        $ptype1_id = $ptype2->parent_id;
        $ptype_key = "-" . $ptype1_id . "-" . $ptype2_id . "-" . $ptype3_id . "-";
    }
    $product->ptype_key = $ptype_key;
    $product->update();
    echo "[" . $product->product_id . "]" . $ptype3_id . ":" . $ptype_key; echo "<br/>";
    $i++;
}

echo "共计:" . $i . "条"; echo "<br/>";
// $product_id = 7072;
// 未执行: 批量替换缩略图
// for ($i=8839; $i > 2329; $i--) {
//     $product_id = $i;
//     echo "开始处理商品:" . $product_id;
//     echo("<br/>");
//     $product = Product::get_by_id($product_id);
//     if ($product) {
//         // print_r($product);
//         // if (!empty($product->image_large)) {
//         //     $dest_path  = Gc::$upload_path . "images" . DS . $product->image;
//         //     $orgin_path = Gc::$upload_path . "images" . DS . $product->image_large;
//         //     $result = thumbImage($orgin_path, $dest_path);
//         //     if ( !$result ) {
//         //       echo "商品图片不存在:" . $product_id . ":" . $orgin_path;echo("<br/>");
//         //     }
//         // }
//         // echo($orgin_path);echo("<br/>");
//         // echo($dest_path);echo("<br/>");
//
//         $seriesImgs = Seriesimg::get("product_id=" . $product_id);
//         if ($seriesImgs && count($seriesImgs)>0){
//             foreach ($seriesImgs as $seriesImg) {
//                 if (!empty($seriesImg->image_large)) {
//                     $dest_path  = Gc::$upload_path . "images" . DS . $seriesImg->ico;
//                     $orgin_path = Gc::$upload_path . "images" . DS . $seriesImg->image_large;
//                 // echo($orgin_path);echo("<br/>");
//                 // echo($dest_path);echo("<br/>");
//                     $result = thumbImage($orgin_path, $dest_path);
//                     if ( !$result ) {
//                       echo "商品图片不存在:" . $product_id . ":" . $orgin_path;echo("<br/>");
//                     }
//                 }
//             }
//         }
//         echo "完成重新生成商品图片:" . $product_id . ":" . $product->product_name;
//         echo("<br/>");echo("<br/>");
//     } else {
//         echo "商品不存在:" . $product_id;echo("<br/>");
//     }
// }
//
// function thumbImage($orgin_path, $dest_path){
//     $result = false;
//     if (file_exists($orgin_path)){
//         UtilFileSystem::deleteFiles(array($dest_path));
//         $suffix = explode('.',$orgin_path);
//         $suffix = end($suffix);
//         $isBuildThumb=UtilImage::thumb($orgin_path,$dest_path,$suffix,80,80,true,true);
//         echo "成功生成新的商品图片:" . $isBuildThumb . "; 后缀名:" . $suffix;echo("<br/>");
//         $result = true;
//     }
//     return $result;
//     // echo $isBuildThumb;
//
//     // $dest_url  = Gc::$url_base . "upload/images/" . $product->image;
//     // $orgin_url = Gc::$url_base . "upload/images/" . $product->image_large;
//     // echo "<img src='$orgin_url'>";echo("<br/>");echo("<br/>");
//     // echo "<img src='$dest_url'>";
// }


// UtilZipfile::zip( array(
//  "a/b/c/dabc.txt"=>Gc::$nav_root_path."index.php",
//  "e/f/g/h/def.xls"=>Gc::$attachment_path."model".DIRECTORY_SEPARATOR."pbtype.xls",
//  "h/i/j/l/ghi.jpg"=>Gc::$upload_path."delivery".DIRECTORY_SEPARATOR."dly_bg_1.jpg"
// ),
// Gc::$attachment_path."test.zip");

?>
