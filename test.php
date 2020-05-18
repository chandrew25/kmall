<?php
require_once ("init.php");

// $uploadPath = Gc::$upload_path . "np.xls";
// $arr_import_header = array(
//     "product_code" => "商品编号",
//     "product_name" => "品名",
//     "specification" => "规格参数"
// );
// $dataPt = UtilExcel::exceltoArray($uploadPath, $arr_import_header);
// $count  = 0;
// $content = "";
// foreach ($dataPt as $pt) {
//     if ( !empty($pt["product_code"]) && !empty($pt["specification"]) ) {
//         // echo $count . ":" . $pt["product_code"] . "<br/>";
//         $content .= "update km_product set specification='" .  $pt["specification"] . "' where product_code='" . $pt["product_code"] . "';\r\n"; 
//         $count++;
//         echo $count . ":" . $pt["product_code"] . "<br/>";
//     }  
// }
// file_put_contents(Gc::$upload_path . "np.txt", $content);
// print_pre($content, true);
// print_pre($dataPt, true);

// $uploadPath = Gc::$upload_path;
// $data = sqlExecute("select a.product_id,a.product_code,a.goods_no,a.product_name,a.image,a.image_large,a.intro from km_product_check a", "Product");
// // print_pre($data, true);
// $p_imgs = array();
// $contents = "";
// foreach ($data as $product) {
//     $image = $uploadPath . "images/" . $product->image;
//     $image_large = $uploadPath . "images/" . $product->image_large;
//     if ( !file_exists($image) || !file_exists($image_large) ) {
//         $product ->link = "http://www.phoebelife.com/index.php?go=mobile.goods.info&id=" . $product->product_id;
//         $p_imgs[] = $product;
//         $contents .= $product->product_code . " " . $product->image . "\r\n";
//         $product->isUp = false;
//         sqlExecute("update km_product set isUp=0 where product_id=" . $product->product_id);
//     }
// }
// $arr_import_header = array(
//     "product_id" => "商品编号",
//     "product_code" => "商品编码",
//     "product_name" => "商品名称",
//     "goods_no" => "SKU",
//     "image" => "商品主图[小]",
//     "image_large" => "商品主图[大]",
//     "link" => "访问地址",
// );
// UtilExcel::arraytoExcel( $arr_import_header, $p_imgs, $uploadPath . "up.xls" );
// file_put_contents( $uploadPath . "up.txt", $contents );
// 缺商品主图



// // 批量修改商品价格和品牌
// $uploadPath = Gc::$upload_path . "product.xls";
// $arr_import_header = ServiceBasic::fieldsMean(Product::tablename());
// $dataPt = UtilExcel::exceltoArray($uploadPath, $arr_import_header);
//
// foreach ($dataPt as $key => $data) {
//     $dataPt[$key]["jifen"] = round($data["jifen"]);
//     $dataPt[$key]["price"] = round($data["price"]);
// }
// // print_pre($dataPt, true);die();
// // $contents = "";
// foreach ($dataPt as $key => $data) {
//     $product = Product::get_one("product_code='" . $data["product_code"] . "'");
//     if ($product) {
//         $brand = Brand::get_one('brand_name="' . $data["brand_name"] . '"');
//         if ($brand) {
//            if ($brand->brand_id!=$product->brand_id) {
//              // $product->brand_id = $brand->brand_id;
//              sqlExecute("update km_product set brand_id=" . $brand->brand_id .' where product_code="' . $data["product_code"] . '"');
//            }
//         }
//     }
//     // $contents .= "update km_product set jifen=" . $data["jifen"] . ",cost=" . $data["cost"] . ",price=" . $data["price"] . ",market_price=" . $data["market_price"]. " where product_code='" . $data["product_code"] . "';\r\n";
// }
// // $destPath = Gc::$upload_path . "p.txt";
// // file_put_contents($destPath, $contents);



// 批量新增品牌
// $uploadPath = Gc::$upload_path . "brand.xls";
// $arr_import_header = ServiceBasic::fieldsMean(Brand::tablename());
// $dataPt = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
// // print_pre($dataPt, true);die();
// foreach ($dataPt as $key => $data) {
//     $brand_id   = $data["brand_id"];
//     $sort_order = $data["sort_order"];
//     if ($brand_id<=2032) {
//         $brand = Brand::get_by_id($brand_id);
//         if ( $brand->sort_order != $sort_order ) {
//             $brand->sort_order = $sort_order;
//             $brand->update();
//         }
//     } else {
//         $brand = new Brand();
//         $brand->brand_id = $data["brand_id"];
//         $brand_name = trim($data["brand_name"]);
//         $brand->brand_logo = '';
//         $brand->site_url= '';
//         $brand->brand_name = $brand_name;
//         $brand->brand_desc = $brand_name;
//         if (!empty($sort_order)) {
//             $brand->sort_order = $sort_order;
//         } else {
//             $brand->sort_order = 50;
//         }
//         $brand->isShow = false;
//         $brand_name = UtilPinyin::translate($brand_name);
//         $brand_name = ucfirst($brand_name);
//         $brand->initials = $brand_name[0];
//         $brand->seq_no = 50;
//         $brand->save();
//     }
// }
// $uploadPath = Gc::$upload_path . "m.xls";
// $arr_import_header = array(
//     "code" => "商品编号",
//     "p1" => "一级分类",
//     "p2" => "二级分类",
//     "p3" => "三级分类"
// );
// $dataPt = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
// $c = 0;
// $i = 0;
// $ptResult = array();
// $errorPts = array();
// $noPts = array();
// $hadPts = array();
// foreach ($dataPt as $p) {
//     $code = trim($p["code"]);
//     $p1   = trim($p["p1"]);
//     $p2   = trim($p["p2"]);
//     $p3   = trim($p["p3"]);

//     $product = Product::get_one("product_code = '$code'");
//     if ($product) {
//         if ($product->ptype_id<=0 || $product->ptype_key == '----') {
//             $types = getTypeId($p1, $p2, $p3);
//             $i += 1;
//             // if ($i>=10) {
//             //     print_pre($ptResult, true);
//             //     echo "共计" . $c . "个未找到" . "<br/>";
//             //     print_pre($errorPts, true);
//             // die();
//             // }
//             if ($types && count($types)==3) {
//                 $p["t1"] = $types["p1"];
//                 $p["t2"] = $types["p2"];
//                 $p["t3"] = $types["p3"];
//                 $ptResult[] = $p;
//             } else {
//                 $c += 1;
//                 $errorPts[] = $p;
//             }

//         // $test["id"] = $product["product_id"];
//         // $test["product_code"] = $product["product_code"];
//         // $test["ptype_id"] = $product["ptype_id"];
//         // $test["ptype_key"] = $product["ptype_key"];
//         // print_pre($test, true);
//             $product->ptype_id = $p["t3"];
//             $product->ptype_key = "-" . $p["t1"] . "-" . $p["t2"] . "-" . $p["t3"] . "-";
//             $product->update();
//         } else {
//             $hadPts[] = $product->product_id . "[" . $code . "]";
//         }
//     } else {
//         $noPts[] = $code;
//     }

// }
// echo "共计" . $c . "个未找到" . "<br/>";
// print_pre($ptResult, true);
// echo "未找到分类列表:" . "<br/>";
// print_pre($errorPts, true);
// echo "未找到商品列表:" . "<br/>";
// print_pre($noPts, true);
// echo "已经有商品分类列表:" . "<br/>";
// print_pre($hadPts, true);



// function getTypeId($p1, $p2, $p3) {
//     $sql = "
//     select * from
//     (
//             select distinct 一级分类 as pt1,二级分类 as pt2, p1, p2
//             from
//             (
//                     select po12.product_id,一级分类,二级分类,三级分类,p1,p2,p3 from
//                     (
//                         select po1.*,二级分类, p2 from
//                             (select pt1.*,t.name as '一级分类', t.ptype_id as p1 from (select product_id,SUBSTR(SUBSTRING_INDEX(ptype_key, '-', 2), 2) as ptype1 from km_product) pt1,km_dic_ptype t where pt1.ptype1 = t.ptype_id)
//                             po1 left join
//                             (select pt2.*,t.name as '二级分类', t.ptype_id as p2 from (select product_id,SUBSTRING_INDEX(SUBSTRING_INDEX(ptype_key, '-', 3), '-', -1) as ptype2 from km_product) pt2,km_dic_ptype t where pt2.ptype2 = t.ptype_id)
//                             po2 on po1.product_id = po2.product_id
//                     ) po12 left join
//                     (select pt3.*,t.name as '三级分类', t.ptype_id as p3 from (select product_id,SUBSTRING_INDEX(SUBSTRING_INDEX(ptype_key, '-', 4), '-', -1) as ptype3 from km_product) pt3,km_dic_ptype t where pt3.ptype3 = t.ptype_id)
//                     po3
//                     on po12.product_id = po3.product_id

//             ) pt
//     ) r where pt1='$p1' and pt2='$p2'
//     ";
//     //  and pt3='$p3'
//     // echo $sql;
//     $data = sqlExecute($sql);
//     $result = array();
//     // print_pre($data, true);
//     if ($data && count($data)>=1) {
//         $data = $data[0];
//         $result["p1"] = $data["p1"];
//         $result["p2"] = $data["p2"];
//         $sql = "select * from km_dic_ptype where name='$p3' and parent_id=" . $result["p2"];
//         $data = sqlExecute($sql);

//         if ($data && count($data)>=1) {
//             $data = $data[0];
//             $result["p3"] = $data["ptype_id"];
//         }
//     }
//     // print_pre($data, true);
//     // print_pre($result, true);
//     return $result;
// }






// $pimgs = sqlExecute("select a.product_id,a.image as 'nimage',b.image,a.product_name as 'nname',b.product_name as 'oname',a.product_code as 'ncode', b.product_code as 'ocode' from km_product a,km_product1 b where a.product_code =b. product_code and b.isup = 1 and b.isShow =1");
// $count = 0;
// $result = array();
// foreach ($pimgs as $pimg) {
//     $product_id = $pimg["product_id"];
//     $ncode      = $pimg["ncode"];
//     $nimage     = $pimg["nimage"];
//     $nfimage     = Gc::$upload_path . "images" . DS . $nimage;
//     if ( !file_exists($nfimage) ) {
//         $count += 1;
//         $result[$product_id]["id"] = $product_id;
//         $result[$product_id]["ncode"] = $ncode;
//         $result[$product_id]["nimage"] = $nimage;
//     }
// }
// echo "共计:" . $count . "个<br/><br/><br/>";
// foreach ($result as $pimg) {
//     echo "[id: " . $product_id . "]-[编码: " . $ncode . "]<br/>";
//     echo Gc::$upload_url . "images/" . $nimage . "<br/>";
//     echo $ncode . "<br/>";
// }
// set_time_limit(0);
// $dest_dir = Gc::$upload_path . "bak". DS . "images" . DS . "product" . DS;
// UtilFileSystem::createDir($dest_dir);
// // $sql = "select 品名,品牌,商品编号,货品编号,规格参数,一级分类,二级分类,三级分类,市场价,销售价,积分,成本价,供应商";
// $sql = "select pc.product_id,品名,商品编号,pc.intro";
// $sql .= " from
// (
//   select a.*,s.sp_name as '供应商' from (select p.product_id,p.intro,p.product_name as 品名,b.brand_name as '品牌',p.product_code as '商品编号',p.goods_no as '货品编号',p.scale as '规格参数',ptype_key as '分类',p.market_price as '市场价',p.price as '销售价',p.jifen as '积分',p.cost as '成本价',p.supplier_id from km_product p left join km_brand b on p.brand_id=b.brand_id where p.isUp=1) a left join km_supplier_supplier s on a.supplier_id= s.supplier_id
// ) pc left join
// (
//     select po12.product_id,一级分类,二级分类,三级分类 from
//     (
//       select po1.*,二级分类 from
//         (select pt1.*,t.name as '一级分类' from (select product_id,SUBSTR(SUBSTRING_INDEX(ptype_key, '-', 2), 2) as ptype1 from km_product) pt1,km_dic_ptype t where pt1.ptype1 = t.ptype_id)
//         po1 left join
//         (select pt2.*,t.name as '二级分类' from (select product_id,SUBSTRING_INDEX(SUBSTRING_INDEX(ptype_key, '-', 3), '-', -1) as ptype2 from km_product) pt2,km_dic_ptype t where pt2.ptype2 = t.ptype_id)
//         po2 on po1.product_id = po2.product_id
//     ) po12 left join
//     (select pt3.*,t.name as '三级分类' from (select product_id,SUBSTRING_INDEX(SUBSTRING_INDEX(ptype_key, '-', 4), '-', -1) as ptype3 from km_product) pt3,km_dic_ptype t where pt3.ptype3 = t.ptype_id)
//     po3
//     on po12.product_id = po3.product_id
// ) pt on pc.product_id=pt.product_id order by pc.product_id desc;
//
// ";
// // echo $sql;
// $data = sqlExecute($sql);
// // print_r($data);

// $data = array_slice($data, 0, 10);
// print_r($data);
// foreach ($data as $product) {
//     $pid = $product["product_id"];
//     $simgs = Seriesimg::get("product_id=" . $pid);
//     $pcode = $product["商品编号"];
//     $dest_p_dir = $dest_dir . $pcode . DS;
//     UtilFileSystem::createDir($dest_p_dir);
//     echo $pid . "-"  . $pcode .  "\r\n<br/>";
//     foreach ($simgs as $simg) {
//       $img = $simg->image_large;
//       $src_img_path = Gc::$upload_path . "images" . DS . $img;
//       // $src_img_url  = Gc::$upload_url . "images/" . $img;
//       echo $src_img_path . "<br/>";
//       // echo $src_img_url . "<br/>";
//       $dst_imgname = basename($img);
//       $dst_img_path = $dest_p_dir . $dst_imgname;
//       echo $dst_img_path .  "<br/>";
//       if (file_exists($src_img_path)&&!file_exists($dst_img_path)) {
//         copy($src_img_path, $dst_img_path);
//       }
//     }

    // $intro = $product["intro"];
    // if ($intro) {
    /**     $preg = '/<img.*?src=[\"|\']?(.*?)[\"|\']?\s.*?>/i'; */
    //     preg_match_all($preg, $intro, $imgArr);
    //     if ($imgArr) {
    //         $imgArr = $imgArr[1];
    //         // print_r($imgArr);
    //         if ($imgArr && count($imgArr)>0) {
    //           $url_base = "http://www.phoebelife.com/";
    //           UtilFileSystem::createDir($dest_p_dir . "intro" . DS );
    //           $i = 0;
    //           foreach ($imgArr as $img_url) {
    //               $img_path = str_replace($url_base, "", $img_url);
    //               $src_img_path = Gc::$nav_root_path . $img_path;
    //               $dst_imgname = basename($img_path);
    //               $i += 1;
    //               // $dst_img_path = $dest_p_dir . "intro" . DS . $i . "_" . $dst_imgname;
    //               $dst_img_path = $dest_p_dir . "intro" . DS . $i . "." . pathinfo($dst_imgname)['extension'];
    //               // echo $src_img_path .  "<br/>";
    //               echo $dst_img_path .  "<br/>";
    //               if (file_exists($src_img_path)&&!file_exists($dst_img_path)) {
    //                 copy($src_img_path, $dst_img_path);
    //               }
    //           }
    //         }
    //     }
    // }
// }

echo "这里没有宝藏！";

// phpinfo();
// header("location:".Gc::$url_base."tools/test/ep.php");
