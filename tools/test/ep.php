<?php
require_once ("../../init.php");
set_time_limit(0);
$dest_dir = Gc::$upload_path . "bak". DS . "images" . DS . "product" . DS;
UtilFileSystem::createDir($dest_dir);
$sql = "select 品名,品牌,商品编号,货品编号,规格参数,一级分类,二级分类,三级分类,市场价,销售价,积分,成本价,供应商";
$sql = "select pc.product_id,品名,商品编号,pc.intro";
$sql .= " from
(
  select a.*,s.sp_name as '供应商' from (select p.product_id,p.intro,p.product_name as 品名,b.brand_name as '品牌',p.product_code as '商品编号',p.goods_no as '货品编号',p.scale as '规格参数',ptype_key as '分类',p.market_price as '市场价',p.price as '销售价',p.jifen as '积分',p.cost as '成本价',p.supplier_id from km_product p left join km_brand b on p.brand_id=b.brand_id where p.isUp=1) a left join km_supplier_supplier s on a.supplier_id= s.supplier_id
) pc left join
(
    select po12.product_id,一级分类,二级分类,三级分类 from
    (
      select po1.*,二级分类 from
        (select pt1.*,t.name as '一级分类' from (select product_id,SUBSTR(SUBSTRING_INDEX(ptype_key, '-', 2), 2) as ptype1 from km_product) pt1,km_dic_ptype t where pt1.ptype1 = t.ptype_id)
        po1 left join
        (select pt2.*,t.name as '二级分类' from (select product_id,SUBSTRING_INDEX(SUBSTRING_INDEX(ptype_key, '-', 3), '-', -1) as ptype2 from km_product) pt2,km_dic_ptype t where pt2.ptype2 = t.ptype_id)
        po2 on po1.product_id = po2.product_id
    ) po12 left join
    (select pt3.*,t.name as '三级分类' from (select product_id,SUBSTRING_INDEX(SUBSTRING_INDEX(ptype_key, '-', 4), '-', -1) as ptype3 from km_product) pt3,km_dic_ptype t where pt3.ptype3 = t.ptype_id)
    po3
    on po12.product_id = po3.product_id
) pt on pc.product_id=pt.product_id order by pc.product_id desc;

";
// echo $sql;
$data = sqlExecute($sql);
// print_r($data);

// $data = array_slice($data, 0, 10);
// print_r($data);
foreach ($data as $product) {
    $pid = $product["product_id"];
    $simgs = Seriesimg::get("product_id=" . $pid);
    $pcode = $product["商品编号"];
    $dest_p_dir = $dest_dir . $pcode . DS;
    UtilFileSystem::createDir($dest_p_dir);
    echo $pid . "-"  . $pcode .  "\r\n<br/>";
    foreach ($simgs as $simg) {
      $img = $simg->image_large;
      $src_img_path = Gc::$upload_path . "images" . DS . $img;
      // $src_img_url  = Gc::$upload_url . "images/" . $img;
      echo $src_img_path . "<br/>";
      // echo $src_img_url . "<br/>";
      $dst_imgname = basename($img);
      $dst_img_path = $dest_p_dir . $dst_imgname;
      echo $dst_img_path .  "<br/>";
      if (file_exists($src_img_path)&&!file_exists($dst_img_path)) {
        copy($src_img_path, $dst_img_path);
      }
    }
    $intro = $product["intro"];
    if ($intro) {
        $preg = '/<img.*?src=[\"|\']?(.*?)[\"|\']?\s.*?>/i';
        preg_match_all($preg, $intro, $imgArr);
        if ($imgArr) {
            $imgArr = $imgArr[1];
            // print_r($imgArr);
            if ($imgArr && count($imgArr)>0) {
              $url_base = "http://www.phoebelife.com/";
              UtilFileSystem::createDir($dest_p_dir . "intro" . DS );
              foreach ($imgArr as $img_url) {
                  $img_path = str_replace($url_base, "", $img_url);
                  $src_img_path = Gc::$nav_root_path . $img_path;
                  $dst_imgname = basename($img_path);
                  $dst_img_path = $dest_p_dir . "intro" . DS . $dst_imgname;
                  // echo $src_img_path .  "<br/>";
                  // echo $dst_img_path .  "<br/>";
                  if (file_exists($src_img_path)&&!file_exists($dst_img_path)) {
                    copy($src_img_path, $dst_img_path);
                  }
              }
            }
        }
    }
}
