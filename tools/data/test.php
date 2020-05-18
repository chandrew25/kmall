<?php
require_once ("../../init.php");

/**
* 用于完成 商品- 品牌推荐 表数据的导入
* 
* @var 对象列表数组
*/
/*
//取出所有 品牌  的种类
$products=Product::get(" 1=1 group by brand_id ","  brand_id  asc");                
$bproduct=new Bproduct();

foreach($products as $product){
    //取出所有品牌下的 商品分类 的种类
    $products_byptype=Product::get("brand_id= '".$product->brand_id."' group by ptype_id "," brand_id");
    
    foreach ($products_byptype as $product_byptype) {
        //为每个 品牌 的 商品分类 取出2条随机数据
        $products_new=Product::get(array("brand_id"=>$product_byptype->brand_id,"ptype_id"=>$product_byptype->ptype_id),"","0,2");                                                                                                                     
        foreach($products_new as $product_new){
            //根据  品牌  和 商品分类  得到 ele_brand_re_brandptypes 表中的  主键       
            $brandptypes=Brandptype::get(array("brand_id"=>$product->brand_id,"ptype_id"=>$product_new->ptype_id,"ptype1_id"=>$product_new->ptype1_id,"ptype2_id"=>$product_new->ptype2_id),"");

            //将所有数据  存入    ele_brand_bproduct 表中
            $bproduct=new Bproduct();        
            $bproduct->brandptype_id=$brandptypes[0]->brandptype_id;
            $bproduct->product_id=$product_new->product_id;
            $bproduct->ico=$product_new->image;
            $bproduct->product_name=$product_new->name;  
            $bproduct->product_price=$product_new->price;
            
            $bproduct->save();      
        }
                      
    }   
}

*/

 //,"ptype1_id"=>$product_new->ptype1_id,"ptype2_id"=>$product_new->ptype2_id


?>
