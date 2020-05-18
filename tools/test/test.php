<?php
require_once ("../../init.php");

// $data = Order::get();
// print_r($data);
$arr_output_header = Manager_Db::newInstance()->dbinfo()->fieldMapNameList("km_shop_order");
echo "<pre>"; print_r($arr_output_header); echo "</pre>";
$arr_output_header_dest = array(
  "order_no"     => "订单号",
  "commitTime"   => "下单日期",
  "member_id"    => "会员",
  "member_no"    => "会员编码",
  "mobile"       => "会员手机号",
  "product_code" => "商品货号",
  "product_name" => "商品名称",
  "product_no"   => "货品内部编号",
  "scale"        => "规格简述",
  "product_num"  => "订购数量",
  "price"        => "单价",
  "total_amount" => "总价",
  "order_price"  => "单额",
  "final_amount" => "总额",
  "jifen"        => "单额",
  "total_jifen"  => "总额",
  "intro"        => "备注",
  "status"       => "订单状态",
  "pay_status"   => "支付状态",
  "ship_status"  => "物流状态",
  "pay_type"     => "支付方式",
  "ship_name"    => "收货人",
  "ship_mobile"  => "电话",
  "ship_addr"    => "收货地址",
  "send_status"  => "发货状态",
  "supplier"     => "供货商名称",
  "bank_no"      => "银行账户",
  "open_bank_no" => "开户银行"
);
$arr_output_header_dest_ext = array(
  "成本价（元）",
  "订单额（元）",
  "积分额（积分）"
);
echo "<pre>"; print_r($arr_output_header_dest); echo "</pre>";
$data = null;
$diffpart=date("YmdHis");
$outputFileName = "/Users/zyp/Downloads/member$diffpart.xls";

UtilExcelOrder::arraytoExcel($arr_output_header_dest, $arr_output_header_dest_ext, $data, $outputFileName, true);



// $image = Gc::$upload_path . "images" . DS . "2103103.png";
// $image = UtilImage::getImageInfo( $image );
// echo "<pre>";print_r($image);echo "</pre>";
// $image_o = Gc::$upload_path . "images" . DS . "2103103.jpg";
// $image = UtilImage::getImageInfo( $image_o );
// echo "<pre>";print_r($image);echo "</pre>";
// $dest_path = Gc::$upload_path . "images" . DS . "2103103_new.jpg";
// $isBuildThumb=UtilImage::thumb($image_o,$dest_path,$suffix,500,500,false,false);



// $image_o = Gc::$upload_path . "images" . DS . "s.GIF";
// $image = UtilImage::getImageInfo( $image_o );
// $dest_path = Gc::$upload_path . "images" . DS . "s_new.GIF";
// $suffix = "jpg";
// $isBuildThumb=UtilImage::thumb($image_o,$dest_path,$suffix,500,500,false,false);
// echo "<pre>";print_r($image_o);echo "</pre>";
// echo "<pre>";print_r($image);echo "</pre>";



// 批量替换图片后缀名和图片格式不一致的问题
// $check_path = Gc::$upload_path . "images" . DS . "product" . DS . "large" . DS;
// $files = UtilFileSystem::getAllFilesInDirectory($check_path,"*");
// // print_r($files);
// foreach ($files as $file) {
//     // echo $file;echo "<br/>";
//     $info = UtilImage::getImageInfo( $file );
//     $actualType = $info['type'];
//     // echo "<pre>";print_r($info);echo "</pre>";
//     $type = explode('.',$file);
//     $type = end($type);
//     $type = strtolower($type);
//     $filename  = basename($file);
//     // if (startWith($filename, ".")) continue;
//     // echo $type;echo "<br/>";
//     // echo $type . ":::" . $actualType;echo "<br/>";
//     if ( ( $actualType != $type && $actualType != "jpeg" ) || ( $actualType == "jpeg" && $type != "jpg" && $type != "jpeg" ) ) {
//         echo( "图片文件:" . $file . ",实际图片类型:" . $actualType );echo "<br/>";
//         $image_o   = $file;
//         $dest_path = Gc::$upload_path . "images" . DS . "product" . DS . "m_" . $filename;
//         // echo $image_o;echo "<br/>";
//         // echo $dest_path;echo "<br/>";
//         UtilImage::thumb($image_o,$dest_path,$type,500,500,false,false);
//     }
// }


// 批量替换png图片
// for ($i=8900; $i > 8833; $i--) {
//     $product_id = $i;
//     echo "开始处理商品:" . $product_id;
//     echo("<br/>");
//     $product = Product::get_by_id($product_id);
//     if ($product) {
//         // print_r($product);
//         if (!empty($product->image_large)) {
//             if (endWith($product->image_large, ".png")) {
//                 $dest_path  = Gc::$upload_path . "images" . DS . $product->image;
//                 $orgin_path = Gc::$upload_path . "images" . DS . $product->image_large;
//                 $result = thumbImage($orgin_path, $dest_path);
//                 if ( !$result ) {
//                   echo "商品图片不存在:" . $product_id . ":" . $orgin_path;echo("<br/>");
//                 }
//             }
//         }
//         // echo($orgin_path);echo("<br/>");
//         // echo($dest_path);echo("<br/>");
//
//         $seriesImgs = Seriesimg::get("product_id=" . $product_id);
//         if ($seriesImgs && count($seriesImgs)>0){
//             foreach ($seriesImgs as $seriesImg) {
//                 if (!empty($seriesImg->image_large)) {
//                     if (endWith($seriesImg->image_large, ".png")) {
//                         $dest_path  = Gc::$upload_path . "images" . DS . $seriesImg->img;
//                         $orgin_path = Gc::$upload_path . "images" . DS . $seriesImg->image_large;
//                         echo($orgin_path);echo("<br/>");
//                         // echo($dest_path);echo("<br/>");
//                         $result = thumbImage($orgin_path, $dest_path);
//                         if ( !$result ) {
//                           echo "商品图片不存在:" . $product_id . ":" . $orgin_path;echo("<br/>");
//                         }
//
//                         $dest_path = Gc::$upload_path . "images" . DS . $seriesImg->ico;
//                         $result = thumbImage1($orgin_path, $dest_path);
//                         if ( !$result ) {
//                           echo "商品图片不存在:" . $product_id . ":" . $orgin_path;echo("<br/>");
//                         }
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
//         $isBuildThumb=UtilImage::thumb($orgin_path,$dest_path,$suffix,500,500,false,false);
//         echo "成功生成新的商品图片:" . $isBuildThumb . "; 后缀名:" . $suffix;echo("<br/>");
//         $result = true;
//     }
//     return $result;
// }
//
//
// function thumbImage1($orgin_path, $dest_path){
//     $result = false;
//     if (file_exists($orgin_path)){
//         UtilFileSystem::deleteFiles(array($dest_path));
//         $suffix = explode('.',$orgin_path);
//         $suffix = end($suffix);
//         $isBuildThumb=UtilImage::thumb($orgin_path,$dest_path,$suffix,80,80,false,false);
//         echo "成功生成新的商品图片:" . $isBuildThumb . "; 后缀名:" . $suffix;echo("<br/>");
//         $result = true;
//     }
//     return $result;
// }




// 批量替换品牌首字母大写
// $brands = Brand::get();
// foreach ($brands as $brand) {
//   $brand_name = trim($brand->brand_name);
//   echo $brand_name;
//   echo ":";
//   $brand_name = UtilPinyin::translate($brand_name);
//   echo $brand_name;
//   $brand_name = ucfirst($brand_name);
//   $brand_name= $brand_name[0];
//   echo ":";
//   echo $brand_name;
//   echo "<br/>";
//   if ($brand_name) Brand::updateProperties($brand->brand_id,"initials='". $brand_name ."'");
//
// }
