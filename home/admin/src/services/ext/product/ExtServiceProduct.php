<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:商品<br/>
 +---------------------------------------
 * @category kmall
 * @package web.back.admin.services
 * @author skygreen
 */
class ExtServiceProduct extends ServiceBasic  implements IServiceBasic
{
    /**
     * 更新数据对象:商品类型包括属性表
     * @param array|DataObject $conditions
     * @return boolen 是否更新成功；true为操作正常
     */
    public function updateProductAttribute($conditions)
    {
        $product_id=$conditions->product_id;
        $attributes=$conditions->attributes;
        $success=true;
        $product=Product::get_by_id($product_id);
        try{
            foreach($attributes as $attribute){
                //是否已经有该属性
                if(strpos($product->attr_key,"-".$attribute->attribute_id."-")!==false){
                    if(!$attribute->isShowAttributeCheck){
                        $product->attr_key=str_replace("-".$attribute->attribute_id."-","-",$product->attr_key);
                    }
                }else{
                    if($attribute->isShowAttributeCheck){
                        //是否已经有属性
                        if(strpos($product->attr_key,"-")!==false){
                            $product->attr_key.=$attribute->attribute_id."-";
                        }else{
                            $product->attr_key="-".$attribute->attribute_id."-";
                        }
                        //如果父类型没有选择，则添加进去
                        $attr=Attribute::get_by_id($attribute->attribute_id);
                        if($attr->level>1&&strpos($product->attr_key,"-".$attr->parent_id."-")===false){
                            $product->attr_key.=$attr->parent_id."-";
                        }
                    }
                }
            }
            $product->update();
        }catch(Exception $e){
            $success=false;
        }
        return array('success' =>$success);
    }

    /**
     * 数据对象:商品类型包括属性表分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认10个。
     * @return 数据对象:主题包括课程分页查询列表
     */
    public function queryPageProductAttribute($formPacket=null)
    {
        $start=0;
        $limit=15;
        //取出product_id
        $product_id=$formPacket->product_id;
        $product=Product::get_by_id($product_id);
        $ptype_id=$product->ptype_id;
        $attr_key=$product->attr_key;
        $formPacket->product_id=null;
        //是否查看所有
        if($formPacket->all){
            $all=true;
            $formPacket->all=null;
        }
        $condition=UtilObject::object_to_array($formPacket);
        if(!$condition["parent_id"])$condition["parent_id"]=0;
        /**0:全部,1:已选择,2:未选择*/
        if(isset($condition["selectType"]))$selectType=$condition["selectType"];
        if(isset($condition['start']))$start=$condition['start']-1;
        if(isset($condition['limit']))$limit=$condition['limit'];
        unset($condition["selectType"],$condition['start'],$condition['limit']);
        $condition=$this->filtertoCondition($condition);
        if(!$condition)$condition="1=1";
        $fkey=str_replace("-",",",$attr_key);
        switch($selectType){
            case 1:
                if(preg_match("/^,(.+),$/",$fkey,$match)){
                    $condition.=" and a.attribute_id in(".$match[1].")";
                }else{
                    $condition.=" and a.attribute_id in(-1)";
                }
                break;
            case 2:
                if(preg_match("/^,(.+),$/",$fkey,$match)){
                    $condition.=" and a.attribute_id not in(".$match[1].")";
                }
                break;
        }
        $sql_child_query="(select attribute_id from ".Ptypeattr::tablename()." where ptype_id=".$ptype_id.")";
        $sql_count="select count(1) from ".Attribute::tablename()." a,$sql_child_query b where a.attribute_id=b.attribute_id ";
        if (!empty($condition))$sql_count.=" and ".$condition;
        $count=sqlExecute($sql_count);
        if($count>0){
            $sql_data="select a.* from ".Attribute::tablename()." a,$sql_child_query b where a.attribute_id=b.attribute_id ";
            if (!empty($condition))$sql_data.=" and ".$condition;
            if(!$all){
                $sql_data.=" limit $start,$limit";
            }
            $data=sqlExecute($sql_data,"Attribute");
            foreach ($data as $attribute) {
                $level=$attribute->level;
                $attributeShowAll=$attribute->attribute_name;
                switch ($level) {
                   case 2:
                     if ($attribute && $attribute->parent_id>0){
                       $attribute_instance=Attribute::get_by_id($attribute->parent_id);
                       $attributeShowAll=$attribute_instance->attribute_name."->".$attributeShowAll;
                     }
                     break;
                }
                $attribute["attributeShowAll"]=$attributeShowAll;
                if($attr_key&&strpos($attr_key,"-".$attribute->attribute_id."-")!==false){
                    $attribute->isShowAttributeCheck=true;
                }
            }
        }
        if($data==null)$data=array();
        return array(
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }

    /**
    * 商品下架
    */
    public function productDown($product_ids){
        Product::updateProperties($product_ids,"isUp=0,downTime=".UtilDateTime::dateToTimestamp(UtilDateTime::now()));
        Goods::updateBy('product_id in ('.$product_ids.'0)',"isUp=0,downTime=".UtilDateTime::dateToTimestamp(UtilDateTime::now()));
    }

    /**
    * 商品上架
    */
    public function productUp($product_ids){
        Product::updateProperties($product_ids,"isUp=1,upTime=".UtilDateTime::dateToTimestamp(UtilDateTime::now()));
        Goods::updateBy('product_id in ('.$product_ids.'0)',"isUp=1,upTime=".UtilDateTime::dateToTimestamp(UtilDateTime::now()));
    }

    /**
     * 保存数据对象:商品
     * @param array|DataObject $product
     * @return int 保存对象记录的ID标识号
     */
    public function save($product)
    {
        if (isset($product["isRecommend"])&&($product["isRecommend"]=='1'))$product["isRecommend"]=true; else $product["isRecommend"]=false;
        if (isset($product["isPackage"])&&($product["isPackage"]=='1'))$product["isPackage"]=1; else $product["isPackage"]=0;
        if(!$product["price_tag"]||$product["price_tag"]=="默认标签为商城价")$product["price_tag"]="商城价";
        $thumb_filename="";
        if (!empty($_FILES)&&!empty($_FILES["image_largeUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"image_largeUpload","large");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $product["image_large"]= $result['file_name'];
                }
                $result['file_name']=str_replace("/",DIRECTORY_SEPARATOR,$result['file_name']);
                $file_name=basename($result['file_name']);
                $tmptail = end(explode('.',  $result['file_name']));
                $filename="product".DIRECTORY_SEPARATOR."m_".$file_name;
                $imagePath=Gc::$upload_path."images".DIRECTORY_SEPARATOR;
                $isBuildNormal=UtilImage::thumb($imagePath.$result['file_name'],$imagePath.$filename,$tmptail,358,358,true,true);
                if ($isBuildNormal){
                    $filename=str_replace(DIRECTORY_SEPARATOR,"/",$filename);
                    $product["image"]= $filename;
                }

                $filename="product".DIRECTORY_SEPARATOR."thumb".DIRECTORY_SEPARATOR."s_".$file_name;
                $isBuildThumb=UtilImage::thumb($imagePath.$result['file_name'],$imagePath.$filename,$tmptail,80,80,true,true);
                if ($isBuildThumb){
                    $filename=str_replace(DIRECTORY_SEPARATOR,"/",$filename);
                    $thumb_filename= $filename;
                }
            }else{
                return $result;
            }
        }
        //get ptype_key
        $ptype_level=Ptype::select_one("level","ptype_id=".$product["ptype_id"]);
        if (!empty($ptype_level)&& $ptype_level>0){
          switch ($ptype_level) {
             case 1:
               $product["ptype_key"]="-".$product["ptype_id"]."-";;
               break;
             case 2:
               $result=$product["ptype_id"]."-";
               $ptype2=Ptype::select_one("parent_id",array("ptype_id"=>$product["ptype_id"]));
               $product["ptype_key"]="-".$ptype2."-".$result;
               break;
             case 3:
               $result=$ptype_id."-";
               $ptype2 = Ptype::select_one("parent_id", array("ptype_id"=>$product["ptype_id"]));
               $result=$gtype2_id."-".$result;
               $ptype1_id = Ptype::select_one("parent_id",array("ptype_id"=>$ptype2));
               $product["ptype_key"]="-".$ptype1_id."-".$result;
               break;
          }
        }
        $product["uptime"]=UtilDateTime::dateToTimestamp(UtilDateTime::now());
        $product["isUp"]=1;
        $data=parent::save($product);
        //临时性修改,product表到goods的映射****************************************************
        $product["product_id"]=$data;
        $this->addGoods($product);
        //$this->saveorUpdateCouponProduct($data,$product["product_code"],$product["cardproduct_code"]);
        if (!empty($thumb_filename)){
            $seriesImg=new Seriesimg();
            $seriesImg->product_id=$data;
            $seriesImg->ico=$thumb_filename;
            $seriesImg->img=$product["image"];
            $seriesImg->image_large=$product["image_large"];
            $seriesImg->isShow=true;
            $seriesImg->sort_order=50;
            $seriesImg->save();
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    // /**
    //  * 添加或更新票券商品
    //  * @param mixed $product_id 票券编号
    //  * @param mixed $product_code 票券代码
    //  * @param mixed $cardproduct_code 兑换商品编号
    // public function saveorUpdateCouponProduct($product_id,$product_code,$cardproduct_code)
    // {
    //     $cardproduct_codes=preg_split('[,， ]', $cardproduct_code);
    //     foreach ($cardproduct_codes as $code) {
    //         if (!empty($code)){
    //             $couponproduct=Couponproduct::get_one(array("product_code"=>$product_code,"cardproduct_code"=>$code));
    //             if (!$couponproduct){
    //                 $couponproduct=new Couponproduct();
    //                 $couponproduct->product_code=$product_code;
    //                 $couponproduct->product_id=$product_id;
    //                 $couponproduct->cardproduct_code=$code;
    //                 $cardproduct=Cardproduct::get_one("progid='".$code."'");
    //                 if($cardproduct){
    //                     $couponproduct->cardproduct_name=$cardproduct->progname;
    //                 }
    //                 $couponproduct->save();
    //             }
    //         }
    //     }
    // }
    // */

    /**
     * 更新数据对象 :商品
     * @param array|DataObject $product
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($product)
    {
        if (isset($product["isRecommend"])&&($product["isRecommend"]=='1'))$product["isRecommend"]=true; else $product["isRecommend"]=false;
        if (isset($product["isPackage"])&&($product["isPackage"]=='1'))$product["isPackage"]=1; else $product["isPackage"]=0;
        if(!$product["price_tag"]||$product["price_tag"]=="默认标签为商城价")$product["price_tag"]="商城价";
        $thumb_filename="";
        if (!empty($_FILES)&&!empty($_FILES["image_largeUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"image_largeUpload","large");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $product["image_large"]= $result['file_name'];
                }
                $result['file_name']=str_replace("/",DIRECTORY_SEPARATOR,$result['file_name']);
                $file_name=basename($result['file_name']);
                $tmptail = end(explode('.',  $result['file_name']));
                $filename="product".DIRECTORY_SEPARATOR."m_".$file_name;
                $imagePath=Gc::$upload_path."images".DIRECTORY_SEPARATOR;
                $isBuildNormal=UtilImage::thumb($imagePath.$result['file_name'],$imagePath.$filename,$tmptail,500,500,true,true);
                if ($isBuildNormal){
                    $filename=str_replace(DIRECTORY_SEPARATOR,"/",$filename);
                    $product["image"]= $filename;
                }
                $filename="product".DIRECTORY_SEPARATOR."thumb".DIRECTORY_SEPARATOR."s_".$file_name;
                $isBuildThumb=UtilImage::thumb($imagePath.$result['file_name'],$imagePath.$filename,$tmptail,80,80,true,true);
                if ($isBuildThumb){
                    $filename=str_replace(DIRECTORY_SEPARATOR,"/",$filename);
                    $thumb_filename= $filename;
                }
            }else{
                return $result;
            }
        }
        if ($product["ptype_oid"]!=$product["ptype_id"]){
            $ptype_level=Ptype::select_one("level","ptype_id=".$product["ptype_id"]);
            if (!empty($ptype_level)&& $ptype_level>0){
              switch ($ptype_level) {
                 case 1:
                   $product["ptype_key"]="-".$product["ptype_id"]."-";;
                   break;
                 case 2:
                   $result=$product["ptype_id"]."-";
                   $ptype2=Ptype::select_one("parent_id",array("ptype_id"=>$product["ptype_id"]));
                   $product["ptype_key"]="-".$ptype2."-".$result;
                   break;
                 case 3:
                   $result=$ptype_id."-";
                   $ptype2=Ptype::select_one("parent_id", array("ptype_id"=>$product["ptype_id"]));
                   $result=$gtype2_id."-".$result;
                   $ptype1_id = Ptype::select_one("parent_id", array("ptype_id"=>$ptype2));
                   $product["ptype_key"]="-".$ptype1_id."-".$result;
                   break;
              }
            }
        }
        if (!empty($thumb_filename)){
            $product_old=Product::get_by_id($product["product_id"]);
            $seriesImg=Seriesimg::get_one(array("product_id"=>$product["product_id"],"image_large"=>$product_old->image_large));
            $is_new=false;
            if (!$seriesImg){
                $seriesImg=new Seriesimg();
                $is_new=true;
            }
            if (!empty($product["image"])&&!empty($product["image_large"])&&!empty($thumb_filename)){
                $seriesImg->product_id=$product["product_id"];
                $seriesImg->ico=$thumb_filename;
                $seriesImg->img=$product["image"];
                $seriesImg->image_large=$product["image_large"];
                $seriesImg->isShow=true;
                $seriesImg->sort_order=50;
                if ($is_new){
                    $seriesImg->save();
                }else{
                    $seriesImg->update();
                }
            }
        }
        $p=Product::get_by_id($product["product_id"]);
        if($p->isUp==null){
            $product["isUp"]=1;
            $product["uptime"]=UtilDateTime::dateToTimestamp(UtilDateTime::now());
        }else{
            $product["isUp"]=$p->isUp;
        }
        $data=parent::update($product);
        //临时性修改,修改相应货品****************************************************
        $this->updateGoods($product);
        //$this->saveorUpdateCouponProduct($data,$product["product_code"],$product["cardproduct_code"]);
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 上传商品图片图片文件
     */
    public function uploadImg($files,$uploadFlag,$upload_dir)
    {
        $diffpart=date("YmdHis");
        $result="";
        if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
            $tmptail = end(explode('.', $files[$uploadFlag]["name"]));
            $uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."product".DIRECTORY_SEPARATOR.$upload_dir.DIRECTORY_SEPARATOR.$diffpart.".".$tmptail;
            $result     =UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
            if ($result&&($result['success']==true)){
                $result['file_name']="product/$upload_dir/$diffpart.$tmptail";
            }else{
                return array(
                    'success' => true,
                    'data'    => false
                );
            }
        }
        return $result;
    }

    /**
     * 根据主键删除数据对象:商品
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $ids=explode(',', $ids);
        $data=parent::deleteByIds($ids);
        //删除相应的货品
        foreach($ids as $product_id){
            Goods::deleteBy("product_id=".$product_id);
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 数据对象:商品分页后获取指定ID的商品
     * @param stdclass $formPacket  查询条件对象
     *  必须传递分页参数：start:分页开始数，默认从0开始
     *                    limit:分页查询数，默认10个。
     * @return mixed 数据对象分页查询列表
     */
    public function queryPageProductById($formPacket=null)
    {
        $start=1;
        $limit=10;
        $condition=UtilObject::object_to_array($formPacket);
        if (isset($condition['start'])){
            $start=$condition['start']+1;
        }
        if (isset($condition['limit'])){
            $limit=$condition['limit'];
            $limit= $start+$limit-1;
        }
        unset($condition['start'],$condition['limit']);
        $condition = " product_id = " . $condition["product_id"] . " ";
        $count = parent::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =parent::queryPage($start, $limit, $condition);
            foreach ($data as $product) {
                $brand_instance=null;
                if ($product->brand_id){
                    $brand_instance=Brand::get_by_id($product->brand_id);
                    $product['brand_name']=$brand_instance->brand_name;
                }
                $country_instance=null;
                if ($product->country_id){
                    $country_instance=Country::get_by_id($product->country_id);
                    $product['country_name']=$country_instance->name;
                }
                $ptype=Ptype::get_by_id($product->ptype_id);
                $product['ptype_name']=$ptype->name;
                $product['ptype_level']=$ptype->level;
                $product['changeTime']=$product->updateTime;
                $level=$ptype->level;
                $ptypeShowAll=$ptype->name;
                if ($product->supplier_id) {
                    $supplier=Supplier::get_by_id($product->supplier_id);
                    if ($supplier) $product['sp_name']=$supplier->sp_name;
                }
                if (!empty($ptype->parent_id) && $level && $level>0) {
                  switch ($level) {
                     case 2:
                       $ptype=Ptype::get_by_id($ptype->parent_id);
                       $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                       break;
                     case 3:
                       $ptype=Ptype::get_by_id($ptype->parent_id);
                       $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                       $ptype=Ptype::get_by_id($ptype->parent_id);
                       $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                       break;
                  }
                }
                $product["ptypeShowAll"]=$ptypeShowAll;
                $product->introShow=preg_replace("/<\s*img\s+[^>]*?src\s*=\s*(\'|\")(.*?)\\1[^>]*?\/?\s*>/i","<a href='\${2}' target='_blank'>\${0}</a>",$product->intro);
                if ($product->uptime)$product["uptime"]=UtilDateTime::timestampToDateTime($product->uptime);
                if ($product->downtime)$product["downtime"]=UtilDateTime::timestampToDateTime($product->downtime);
            }
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        return array(
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }
    /**
     * 数据对象:商品分页
     * @param stdclass $formPacket  查询条件对象
     *  必须传递分页参数：start:分页开始数，默认从0开始
     *                    limit:分页查询数，默认10个。
     * @return mixed 数据对象分页查询列表
     */
    public function queryPageProduct($formPacket=null)
    {
        $start=1;
        $limit=10;
        $condition=UtilObject::object_to_array($formPacket);
        if (isset($condition['start'])){
            $start=$condition['start']+1;
        }
        if (isset($condition['limit'])){
            $limit=$condition['limit'];
            $limit= $start+$limit-1;
        }
        unset($condition['start'],$condition['limit']);
        $condition=$this->filtertoCondition($condition);
        if(!$condition)$condition="1=1";
        $condition.=" and isUp=1";
        $count=parent::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =parent::queryPage($start,$limit,$condition);
            foreach ($data as $product) {
                $brand_instance=null;
                if ($product->brand_id){
                    $brand_instance=Brand::get_by_id($product->brand_id);
                    $product['brand_name']=$brand_instance->brand_name;
                }
                $country_instance=null;
                if ($product->country_id){
                    $country_instance=Country::get_by_id($product->country_id);
                    $product['country_name']=$country_instance->name;
                }
                $ptype=Ptype::get_by_id($product->ptype_id);
                $product['ptype_name']=$ptype->name;
                $product['ptype_level']=$ptype->level;
                $product['changeTime']=$product->updateTime;
                $level=$ptype->level;
                $ptypeShowAll=$ptype->name;
                if ($product->supplier_id) {
                    $supplier=Supplier::get_by_id($product->supplier_id);
                    if ($supplier) $product['sp_name']=$supplier->sp_name;
                }
                if (!empty($ptype->parent_id) && $level && $level>0) {
                  switch ($level) {
                     case 2:
                       $ptype=Ptype::get_by_id($ptype->parent_id);
                       $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                       break;
                     case 3:
                       $ptype=Ptype::get_by_id($ptype->parent_id);
                       $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                       $ptype=Ptype::get_by_id($ptype->parent_id);
                       $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                       break;
                  }
                }
                $product["ptypeShowAll"]=$ptypeShowAll;
                $product->introShow=preg_replace("/<\s*img\s+[^>]*?src\s*=\s*(\'|\")(.*?)\\1[^>]*?\/?\s*>/i","<a href='\${2}' target='_blank'>\${0}</a>",$product->intro);
                if ($product->uptime)$product["uptime"]=UtilDateTime::timestampToDateTime($product->uptime);
                if ($product->downtime)$product["downtime"]=UtilDateTime::timestampToDateTime($product->downtime);
            }
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        return array(
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }

    /**
     * 数据对象:商品分页未上架
     * @param stdclass $formPacket  查询条件对象
     *  必须传递分页参数：start:分页开始数，默认从0开始
     *                    limit:分页查询数，默认10个。
     * @return mixed 数据对象分页查询列表
     */
    public function queryPageProductNup($formPacket=null)
    {
        $start=1;
        $limit=15;
        $condition=UtilObject::object_to_array($formPacket);
        if (isset($condition['start'])){
            $start=$condition['start']+1;
          }
        if (isset($condition['limit'])){
            $limit=$condition['limit'];
            $limit=$start+$limit-1;
        }
        unset($condition['start'],$condition['limit']);
        $condition=$this->filtertoCondition($condition);
        if(!$condition)$condition="1=1";
        $condition.=" and isUp is null";
        $count=Product::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Product::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Product::propertyShow($data,array('sptype'));
            }
            foreach ($data as $product) {
                if ($product->supplier_id){
                    $supplier_instance=Supplier::get_by_id($product->supplier_id);
                    $product['sp_name']=$supplier_instance->sp_name;
                }
                $ptype=Ptype::get_by_id($product->ptype_id);
                $product['ptype_name']=$ptype->name;
                $product['ptype_level']=$ptype->level;
                $product['changeTime']=$product->updateTime;
                $level=$ptype->level;
                $ptypeShowAll=$ptype->name;
                $brand=Brand::get_by_id($product->brand_id);
                $product['brand_name']=$brand->brand_name;
                switch ($level) {
                   case 2:
                     $ptype=Ptype::get_by_id($ptype->parent_id);
                     $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                     break;
                   case 3:
                     $ptype=Ptype::get_by_id($ptype->parent_id);
                     $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                     $ptype=Ptype::get_by_id($ptype->parent_id);
                     $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                     break;
                }
                $product["ptypeShowAll"]=$ptypeShowAll;
                if ($product->uptime)$product["uptime"]=UtilDateTime::timestampToDateTime($product->uptime);
                if ($product->downtime)$product["downtime"]=UtilDateTime::timestampToDateTime($product->downtime);
            }
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        return array(
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }

    /**
     * 数据对象:商品分页已下架
     * @param stdclass $formPacket  查询条件对象
     *  必须传递分页参数：start:分页开始数，默认从0开始
     *                    limit:分页查询数，默认10个。
     * @return mixed 数据对象分页查询列表
     */
    public function queryPageProductYdown($formPacket=null)
    {
        $start=1;
        $limit=15;
        $condition=UtilObject::object_to_array($formPacket);
        if (isset($condition['start'])){
            $start=$condition['start']+1;
          }
        if (isset($condition['limit'])){
            $limit=$condition['limit'];
            $limit=$start+$limit-1;
        }
        unset($condition['start'],$condition['limit']);
        $condition=$this->filtertoCondition($condition);
        if(!$condition)$condition="1=1";
        $condition.=" and isUp=0";
        $count=Product::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Product::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Product::propertyShow($data,array('sptype'));
            }
            foreach ($data as $product) {
                if ($product->supplier_id){
                    $supplier_instance=Supplier::get_by_id($product->supplier_id);
                    $product['sp_name']=$supplier_instance->sp_name;
                }
                $ptype=Ptype::get_by_id($product->ptype_id);
                $product['ptype_name']=$ptype->name;
                $product['ptype_level']=$ptype->level;
                $product['changeTime']=$product->updateTime;
                $level=$ptype->level;
                $ptypeShowAll=$ptype->name;
                $brand=Brand::get_by_id($product->brand_id);
                $product['brand_name']=$brand->brand_name;
                switch ($level) {
                   case 2:
                     $ptype=Ptype::get_by_id($ptype->parent_id);
                     $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                     break;
                   case 3:
                     $ptype=Ptype::get_by_id($ptype->parent_id);
                     $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                     $ptype=Ptype::get_by_id($ptype->parent_id);
                     $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                     break;
                }
                $product["ptypeShowAll"]=$ptypeShowAll;
                if ($product->uptime)$product["uptime"]=UtilDateTime::timestampToDateTime($product->uptime);
                if ($product->downtime)$product["downtime"]=UtilDateTime::timestampToDateTime($product->downtime);
            }
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        return array(
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }

    /**
    * 导入商品介绍EXCEL
    */
    public function importintro($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."product" . DS . "import" . DS . "product$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);

            $arr_import_header = array(
                'product_code'=>'商品货号',
                'product_name'=>'产品名称',
                'p_show'=>'商品展示',
                'p_intro'=>'品牌介绍',
                'p_special'=>'商品特色',
                'p_desc'=>'商品详情',
                'p_activity'=>'本期活动',
                'p_specification'=>'规格'
            );
            $data = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
            foreach ($data as $product) {
                extract($product);
                $hadProduct=Product::get_one(array("product_code"=>$product_code));
                if(!empty($p_show)||!empty($p_intro)){
                    $p_desc=str_replace("\n","<br />",$p_desc);
                    $p_show_images="";
                    $p_show=explode("\n",$p_show);
                    foreach ($p_show as $image_name) {
                        if (!empty($image_name)){
                            $info   = UtilImage::getImageInfo(Gc::$upload_path . "userfiles" . DS . "images" . DS . "product" . DS . $image_name);
                            $width  = $info['width'];
                            $height = $info['height'];
                            if($width > '600' || $height> '600'){
                                LogMe::log("商品货号:".$product['product_code']."- 图片名称".$image_name." 的尺寸长或宽大于600!");
                                $p_show_images.="<p><span style=\"font-family: 宋体\"><span style=\"font-size: 14px\"><img alt=\"$product_name\" src=\"".Gc::$upload_url."userfiles/images/product/$image_name\" style=\"width: 566px; height: 560px\" /></span></span></p>";
                            }else{
                                $p_show_images.="<p><span style=\"font-family: 宋体\"><span style=\"font-size: 14px\"><img alt=\"$product_name\" src=\"".Gc::$upload_url."userfiles/images/product/$image_name\" /></span></span></p>";
                            }
                        }
                    }

$product_model_intro=<<<INTRO
<p>
    <span style="font-family: 宋体"><span style="font-size: 14px"><span style="color: rgb(51,51,51)"><span style="background-color: rgb(211,211,211)">【品牌介绍】</span><span style="background-color: rgb(211,211,211)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span></span></p>
<p>
    <span style="font-family: 宋体"><span style="font-size: 14px">$p_intro</span></span></p>
<p>
    <span style="font-family: 宋体"><span style="font-size: 14px"><span style="color: rgb(51,51,51)"><span style="background-color: rgb(211,211,211)">【商品特色】</span><span style="background-color: rgb(211,211,211)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span></span></p>
<p>
    <span style="font-family: 宋体"><span style="font-size: 14px">$p_special</span></span></p>
<p>
    <span style="font-family: 宋体"><span style="font-size: 14px"><span style="color: rgb(51,51,51)"><span style="background-color: rgb(211,211,211)">【商品详情】</span><span style="background-color: rgb(211,211,211)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span></span></p>
<p>
    <span style="font-family: 宋体"><span style="font-size: 14px">$p_desc</span></span></p>
<p>
    <span style="font-family: 宋体"><span style="font-size: 14px"><span style="color: rgb(51,51,51)"><span style="background-color: rgb(211,211,211)">【商品展示】</span><span style="background-color: rgb(211,211,211)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span></span></p>
$p_show_images
<p>
    <span style="font-family: 宋体"><span style="font-size: 14px"><span style="color: rgb(51,51,51)"><span style="background-color: rgb(211,211,211)">【本期活动】</span><span style="background-color: rgb(211,211,211)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span></span></p>
<p>$p_activity
    &nbsp;</p>
INTRO;

                if ($hadProduct!=null){
                        //echo  $product_id.":<br/>".$product_model_intro."<br/>";
                        //更新数据
                        $result=Product::updateBy("product_code= '".$product_code."' ",array('intro'=>$product_model_intro));
                }else{
                        LogMe::log($product_id.":不存在！");
                }
            }
                //规格字符串拼接
                if(!empty($p_specification)){
                    $p_specification=str_replace("\n","<br />",$p_specification);
                    $p_specification=str_replace(":","：",$p_specification);
                    $arr=explode("<br />",$p_specification);

                     $product_model_scale=
                                '<table style="width:350px;font-size:13px;line-height:20px;border-collapse:collapse;border:1px solid #aaa;">'.
                                '    <tr style="background-color:#ddd;">'.
                                '       <td colspan="2" style="padding-left:20px;"><b>规格参数</b></td>'.
                                '   </tr>';

                    for($i=0;$i<count($arr);$i++){
                        $arr_2=explode('：',$arr[$i]);
                        if($i%2==0){
                            $product_model_scale.=
                                '   <tr>'.
                                '       <td style="padding-left:20px;" width="100">'.$arr_2[0].'</td>'.
                                '       <td style="padding-left:10px;border-left:1px solid #aaa;">'.$arr_2[1].'</td>'.
                                '   </tr>';
                        }else{
                            $product_model_scale.=
                                '   <tr style="background-color:#ddd;">'.
                                '       <td style="padding-left:20px;" width="100">'.$arr_2[0].'</td>'.
                                '       <td style="padding-left:10px;border-left:1px solid #aaa;">'.$arr_2[1].'</td>'.
                                '   </tr>';
                        }
                    }
                    $product_model_scale.=
                            '</table>';
                    //echo $product_model_intro;
                    if ($hadProduct!=null){
                        //echo  $product_id.":<br/>".$product_model_intro."<br/>";
                        //存入数据
                        $result=Product::updateBy("product_code= '".$product_code."' ",array('intro'=>$product_model_intro,"specification"=>$product_model_scale));
                    }else{
                        LogMe::log($product_code.":不存在！");
                    }
                }

            }
        }
        return array(
            'success' => true,
            'data'    => $result
        );
    }

    /**
    * 导出模板
    * $filename = model文件夹中的文件名
    *  ex：productintro.xls
    */
    public function exportEx($filename)
    {
        $downloadPath=Gc::$attachment_url."model/".$filename;
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }

    /**
     * 批量上传商品
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."product".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."product$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = array(
                        'product_code'=>'商品货号',
                        'product_name'=>'商品名称',
                        'goods_no'    =>'货品内部编号',
                        'isPackage'   =>'是否大礼包',
                        'brand_id'    =>'商品品牌',
                        'ptype_id'    =>'商品分类',
                        // 'ptype_id'    =>'商品类型',
                        // 'ptype_key'   =>'商品分类查询字',
                        'isRecommend' =>'是否推荐',
                        'sort_order'  =>'排序',
                        'image_large' =>'商品图片',
                        'supplier_id' =>'供应商',
                        'cost' =>'成本价',
                        'market_price'=>'市场价',
                        'price'       =>'销售价',
                        'unit'        =>'商品量词',
                        'market_jifen'=>'原价券',
                        'jifen'       =>'券',
                        'scale'       =>'规格',
                        'num'         =>'数量',
                        'num'         =>'最少购买数量',
                        'weight'      =>'重量',
                        'sales_count' =>'销售量',
                        'click_count' =>'点击数',
                        // 'click_count' =>'热度',
                        'isUp'        =>'是否上架',
                        'uptime'      =>'上架时间',
                        'downtime'    =>'下架时间'
                    );
                    $data = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    $index=0;
                    foreach ($data as $product) {
                        extract($product);
                        // LogMe::log($product);
                        $index++;
                        $product= new Product();

                        if (!empty($product_code)){
                            $product_code = trim($product_code);
                            $hadProduct = Product::get_one(array("product_code"=>$product_code));
                            if ( isset($brand_id) ) {
                                //将品牌转换为数字
                                $brand_sql  = Brand::get_one(array("brand_name"=>$brand_id));
                                if ( !empty($brand_sql) ) {
                                    $brand_id = $brand_sql->brand_id;
                                } else {
                                    $brand_id = "";
                                }
                            }

                            //将供应商转换成标识
                            if ( isset($supplier_id) ) {
                              $supplier_sql = Supplier::get_one(array("sp_name"=>$supplier_id));
                              if ( !empty($supplier_sql) ) {
                                  $supplier_id=$supplier_sql->supplier_id;
                              }else{
                                  if (!empty($supplier_id)) {
                                    $supplier = new Supplier();
                                    $supplier->sp_name = $supplier_id;
                                    $supplier->isOk = 0;
                                    $supplier_id = $supplier->save();
                                  } else {
                                      $supplier_id="";
                                  }
                              }
                            }


                            //计算ptype_id , ptype1_id , ptype2_id
                            if ( isset($ptype_id) ) {
                                $flag=false;
                                $flag=strpos($ptype_id,"/");
                                if ($flag) {
                                    $arr_name=explode("/",$ptype_id);
                                    $ptype_name0=Ptype::get_one(array("name"=>$arr_name[0]));
                                    $ptype_sql = Ptype::get_one(array("parent_id"=>$ptype_name0->ptype_id,"name"=>$arr_name[1]));
                                    if ($ptype_sql && $ptype_sql->ptype_id) {
                                      $ptype1_sql = Ptype::get_one(array("parent_id"=>$ptype_sql->ptype_id,"name"=>$arr_name[2]));
                                      if ($ptype1_sql && $ptype1_sql->ptype_id) {
                                        $ptype_sql = $ptype1_sql;
                                      }
                                    }
                                } else {
                                    $ptype_sql=Ptype::get_one(array("name"=>$ptype_id));
                                }
                                if(!empty($ptype_sql)){
                                    $ptype_id_name=$ptype_id;
                                    $ptype_id=$ptype_sql->ptype_id;
                                    //定义ptype2_id
                                    if($ptype_id_name=='提货券'||$ptype_id_name=='现金券'||$ptype_id_name=='易乐特色多选礼券'||$ptype_id_name=='票卡礼券/其他'){
                                        $ptype2_sql=Ptype::get_by_id($ptype_sql->ptype_id);
                                        $ptype2_id=$ptype2_sql->ptype_id;
                                    }else{
                                        $ptype2_sql=Ptype::get_by_id($ptype_sql->parent_id);
                                        $ptype2_id=$ptype2_sql->ptype_id;
                                    }
                                    //定义ptype1_id
                                    $ptype1_id=$ptype2_sql->parent_id;
                                }else{
                                    $ptype_id="";
                                    $ptype1_id="";
                                    $ptype2_id="";
                                }
                            }
                            if ( isset($product_code) ) $product->product_code = $product_code;
                            if ( isset($product_name) ) $product->product_name = $product_name;
                            if ( isset($goods_no) ) $product->goods_no     = $goods_no;
                            if ( isset($isPackage) ) {
                              $product->isPackage = $isPackage;
                              if ( $isPackage && $isPackage=="是" ) $product->isPackage = true; else $product->isPackage = false;
                            }

                            if ( isset($brand_id) ) $product->brand_id=$brand_id;
                            if ( isset($ptype_id) ) $product->ptype_id=$ptype_id;
                            if ( isset($supplier_id) ) $product->supplier_id=$supplier_id;
                            if ( isset($ptype_key) ) $product->ptype_key=$ptype_key;
                            //$product->ptype1_id=$ptype1_id;
                            //$product->ptype2_id=$ptype2_id;
                            if ( isset($isRecommend) ) $product->isRecommend=$isRecommend;
                            if ( isset($sort_order) ) $product->sort_order=$sort_order;
                            if ( !empty($image_large) ) {
                                $product->image="product/m_".$image_large;
                                $product->image_large="product/large/".$image_large;
                            }
                            if ( isset($cost) ) $product->cost=$cost;
                            if ( isset($market_price) ) $product->market_price=round($market_price);
                            if ( isset($price) ) $product->price=round($price);
                            if ( isset($unit) ) $product->unit=$unit;
                            if ( isset($market_jifen) ) $product->market_jifen=round($market_jifen);
                            if ( isset($jifen) ) $product->jifen=round($jifen);
                            if ( isset($scale) ) $product->scale=$scale;
                            if ( isset($num) ) $product->num=$num;
                            if ( isset($mustBuyNum) ) $product->mustBuyNum=$mustBuyNum;
                            if ( isset($weight) ) $product->weight=$weight;
                            if ( isset($sales_count) ) $product->sales_count=$sales_count;
                            if ( isset($click_count) ) $product->click_count=$click_count;
                            if ( isset($isUp) ) $product->isUp=$isUp;
                            if ( isset($upTime) ) $product->upTime=$upTime;
                            if ( isset($downTime) ) $product->downTime=$downTime;

                            if ($hadProduct!=null){
                                $product->product_id=$hadProduct->product_id;
                                $result=$product->update();
                            }else{
                                $result=$product->save();
                            }
                        } else {
                            LogMe::log("第".$index."条，产品：".$product->name);
                        }
                    }
                }else{
                    $result=false;
                }
            }else{
                return $result;
            }
        }
        return array(
            'success' => true,
            'data'    => $result
        );
    }

    /**
     * 导出商品
     * @param mixed $filter
     */
    public function exportProduct($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=$this->get($filter);
        foreach ($data as $product) {
            $product->brand_id    = $product->brand->brand_name;
            if ( $product->supplier_id >0 ) {
              $supplier = $product->supplier;
              if ($supplier) $product->supplier_id = $supplier->sp_name;
            }
            if (!$product->supplier_id)  $product->supplier_id = "";
            if ($product->isPackage && $product->isPackage==1) $product["isPackage"]="是"; else $product["isPackage"]="否";
            if ($product->uptime)$product->uptime=UtilDateTime::timestampToDateTime($product->uptime);
            if ($product->downtime)$product->downtime=UtilDateTime::timestampToDateTime($product->downtime);

            $ptype = Ptype::get_by_id($product->ptype_id);
            $ptypeShowAll = "";
            if ($ptype) {
                $level=$ptype->level;
                $ptypeShowAll=$ptype->name;
                if (!empty($ptype->parent_id) && $level && $level>0) {
                  switch ($level) {
                     case 2:
                       if ($ptype->parent_id) {
                         $ptype=Ptype::get_by_id($ptype->parent_id);
                         if ($ptype) $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                       }
                       break;
                     case 3:
                       if ($ptype->parent_id) {
                         $ptype=Ptype::get_by_id($ptype->parent_id);
                         if ($ptype) {
                           $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                           if ($ptype->parent_id) {
                             $ptype=Ptype::get_by_id($ptype->parent_id);
                             if ($ptype) $ptypeShowAll=$ptype->name."->".$ptypeShowAll;
                           }
                         }
                       }
                       break;
                  }
                }
            }
            $product->ptype_id = $ptypeShowAll;
        }
        LogMe::log("。。。。。。。。计数。。。。。。。。：" . count($data));
        //$arr_output_header= self::fieldsMean(Product::tablename());
        //限制导出字段
        $arr_output_header = array(
                        'product_id'  =>'标识',
                        'product_code'=>'商品货号',
                        'product_name'=>'商品名称',
                        'goods_no'    =>'货品内部编号',
                        'isPackage'   =>'是否大礼包',
                        'brand_id'    =>'商品品牌',
                        'ptype_id'    =>'商品分类',
                        'ptype_key'   =>'商品分类查询字',
                        'isRecommend' =>'是否推荐',
                        'sort_order'  =>'排序',
                        'image_large' =>'商品图片',
                        'market_price'=>'市场价',
                        'price'       =>'销售价',
                        'price'       =>'销售价',
                        'unit'        =>'商品量词',
                        // 'market_jifen'=>'积分',
                        'cost'        =>'成本价',
                        'supplier_id' =>'供应商',
                        'jifen'       =>'券',
                        'scale'       =>'规格',
                        'num'         =>'数量',
                        'weight'      =>'重量',
                        'sales_count' =>'销售量',
                        'click_count' =>'热度',
                        'isUp'        =>'是否上架',
                        'uptime'      =>'上架时间',
                        'downtime'    =>'下架时间'
                    );
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."product".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."product$diffpart.xls";

        LogMe::log("。。。。。。。。导出开始。。。。。。。。：" . $outputFileName);
        UtilFileSystem::createDir(dirname($outputFileName));
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."product/export/product$diffpart.xls";
        LogMe::log("。。。。。。。。导出结束。。。。。。。。：" . $downloadPath);
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }

    /**
     * 导出票券类商品
     * @param mixed $filter
     */
    public function exportCardProduct($filter=null)
    {
        if ($filter){
            $filter=$this->filtertoCondition($filter);
            if ($filter){
                $filter.=" and ";
            }
            $filter.=" ptype1_id=221";
        }else{
            $filter=array("ptype1_id"=>221);
        }
        $data=$this->get($filter);
        foreach ($data as $product) {
            $product->brand_id=$product->brand->brand_name;
            $product->ptype_id=$product->ptype->name;
        }
        $arr_output_header= self::fieldsMean(Product::tablename());
        unset($arr_output_header['updateTime']);
        unset($arr_output_header['commitTime']);
        unset($arr_output_header['ptype1_id']);
        unset($arr_output_header['ptype2_id']);
        //unset($arr_output_header['product_id']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."product".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."product$diffpart.xls";
        UtilFileSystem::createDir(dirname($outputFileName));
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."product/export/product$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }

    /**
     * 读取数据对象:产品信息(无分页)
     * @param array|DataObject $product
     *
     */
    public function selectProduct()
    {
        $data=Product::select("product_id,name","","product_id asc");
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 新增数据对象:product or product&&goods
     * @param DataObject $obj
     *
     */
    public function addProduct($obj)
    {
        //商品基本信息,规格信息,货品信息,图片信息
        $pobj = $obj->product;
        $spec = $obj->spec;
        $gobj = $obj->goods;
        $images = $obj->images;

        //默认返回信息
        $success=true;
        $msg='';

        /*---- pobj处理----*/
        if (isset($pobj->isPackage)&&($pobj->isPackage=='1'))$pobj->isPackage=true; else $pobj->isPackage=false;
        if (isset($pobj->isRecommend)&&($pobj->isRecommend=='1'))$pobj->isRecommend=true; else $pobj->isRecommend=false;
        if (isset($pobj->isMultiplespec)&&($pobj->isMultiplespec=='1'))$pobj->isMultiplespec=true; else $pobj->isMultiplespec=false;
        $ptype_level=Ptype::select_one("level","ptype_id=".$pobj->ptype_id);
        $pobj->ptype_key=$this->getPtypeKey($pobj->ptype_id,$ptype_level);

        /*---- 保存数据对象----*/
        $product = new Product($pobj);
        $product->isUp=true;
        if($product instanceof Product){
            //返回product_id
            $product_id=parent::save($product);
        }
        //判断商品是否保存成功
        if($product_id){
            $product->product_id=$product_id;
            /*---- 上传图片处理----*/
            if($images){
                //处理上传图片
                $this->genProimages($product_id,$images);
            }
            /*---- 多规格处理----*/
            if($gobj&&$spec){
                //遍历规格信息
                foreach($spec as $key=>$value){
                    //新建商品规格对象
                    $pspecObj=new Productspec();
                    $pspecObj->product_id=$product_id;
                    $pspecObj->attribute_id=$key;
                    $pspecObj->attr_p_id=$value->pid;
                    $pspecObj->attr_name=$value->name;
                    $pspecObj->attr_p_name=$value->pname;
                    //保存对象
                    $pspecObj->save();
                }
                //货品信息
                foreach($gobj as $goods){
                    //新建goods对象
                    $goodsObject=$this->addGoods($product);
                    //遍历$goods属性
                    foreach($goods as $key=>$value){
                        //覆盖默认值
                        if($value){
                            if($value=='是'){
                                $goodsObject->$key=true;
                            }elseif($value=='否'){
                                $goodsObject->$key=false;
                            }else{
                                $goodsObject->$key=$value;
                            }
                        }
                    }
                    //保存goods对象
                    $goodsObject->save();
                }
            }else{
                $goodsObject=$this->addGoods($product);
                //保存goods对象
                $goodsObject->save();
            }
        }else{
            $success=false;
            $msg='新增商品失败,请重试!';
        }
        return array('success'=>$success,'msg'=>$msg);
    }

    /**
     * 更新数据对象:product or product&&goods
     * @param DataObject $obj
     *
     */
    public function updateProduct($obj)
    {
        //商品基本信息,规格初始化标识,规格信息,货品信息,需删除货品的信息,需添加的图片,需删除的图片,商品标识
        $pobj       = $obj->product;
        $isInit     = $obj->isInit;
        $spec       = $obj->spec;
        $gobj       = $obj->goods;
        $delgoods   = $obj->delgoods;
        $addimages  = $obj->images;
        $delimages  = $obj->delimage;
        $product_id = $pobj->product_id;
        /*----商品基本信息处理----*/
        if($pobj){
            $product = new Product($pobj);
            $old_product = Product::get_by_id($product_id);
            if (isset($product->isPackage)&&($product->isPackage=='1')) $product->isPackage=1; else $product->isPackage=0;
            if (isset($product->isRecommend)&&($product->isRecommend=='1'))$product->isRecommend=1; else $product->isRecommend=0;
            if (isset($product->isMultiplespec)&&($product->isMultiplespec=='1'))$product->isMultiplespec=1; else $product->isMultiplespec=0;
            if ($product->ptype_oid!=$product->ptype_id){
                //生成商品分类序列
                $ptype_level=Ptype::select_one("level","ptype_id=".$product->ptype_id);
                $product->ptype_key=$this->getPtypeKey($product->ptype_id,$ptype_level);
            }
            if ($product->image){
                $product->image = str_replace(Gc::$upload_url."images/", "", $product->image);
            }
            if ($product->image_large){
                $product->image_large = str_replace(Gc::$upload_url."images/", "", $product->image_large);
            }
            //unset 多余的属性
            unset($product->ptype_oid,$product->ptype_level,$product->ptype1_id,$product->ptype2_id);
            //更新商品信息
            $product->update();
            //更新货品信息(这些属性多规格以及单品都同步更新)
            Goods::updateBy("product_id=".$product_id,array("ptype_id"=>$product->ptype_id,"ptype_key"=>$product->ptype_key,"attr_key"=>$product->attr_key,"brand_id"=>$product->brand_id,"isUp"=>true,"isShow "=>true));
        }

        //如果多规格开启状态
        if($product->isMultiplespec){
            if (!$old_product->isMultiplespec) {
                Goods::deleteBy("product_id=".$product_id);
            }
            if($isInit){
                //删除该商品原有规格信息以及货品信息
                Productspec::deleteBy("product_id=".$product_id);
                Goods::deleteBy("product_id=".$product_id);
            }
            //如果货品信息需要更新(需要存储pspec_key,填写的货品信息等)
            if($gobj){
                foreach($gobj as $upgoods){
                    if($upgoods->goods_id){
                        $goodsObject=new Goods($upgoods);
                        $goodsObject->update();
                    }else{
                        $goodsObject=$this->addGoods($product);
                        foreach($upgoods as $key=>$value){
                            if(!Empty($upgoods->$key)){
                                $goodsObject->$key = $value;
                            }
                        }
                        $goodsObject->save();
                    }
                }
            }
            //如果有货品需要删除
            if($delgoods){
                foreach($delgoods as $id=>$value){
                    Goods::deleteByID($id);
                }
            }
            //处理商品规格信息
            if($spec){
                foreach($spec as $key=>$value){
                    //判断该规格是否存在(需优化)
                    if ($key && $value && $value->pid && $value->pid>0){
                      $exist = Productspec::existBy(array("attribute_id"=>$key,"attr_p_id"=>$value->pid,"product_id"=>$product_id));
                      if(!$exist){
                          //新建商品规格对象
                          $pspecObj=new Productspec();
                          $pspecObj->product_id=$product_id;
                          $pspecObj->attribute_id=$key;
                          $pspecObj->attr_p_id=$value->pid;
                          $pspecObj->attr_name=$value->name;
                          $pspecObj->attr_p_name=$value->pname;
                          //保存对象
                          $pspecObj->save();
                      }
                    }
                }
            }
        }else{
            if($old_product->isMultiplespec){
                //删除该商品原有规格信息以及货品信息
                Productspec::deleteBy("product_id=".$product_id);
                Goods::deleteBy("product_id=".$product_id);
                $goodsObject=$this->addGoods($product);
                $goodsObject->save();
            }else{
                //如果是单品,更新商品信息时,同步更新货品信息
                Goods::updateBy("product_id=".$product_id,array("goods_name"=>$product->product_name,"goods_code"=>$product->product_code,"sales_price"=>$product->price,"market_price"=>$product->market_price,"stock"=>$product->num,"sort_order"=>$product->sort_order,"isUp"=>true,"isShow "=>true));
            }
        }

        /*----商品图片处理----*/
        if($addimages){
            $upimages=array();
            foreach($addimages as $image){
                if($image->id){
                    $isShow=$image->isShow==1?true:false;
                    //更新商品图片
                    Seriesimg::updateProperties($image->id,array("sort_order"=>$image->sort_order,"isShow"=>$isShow));
                    if ($image->ismain && !empty($image->norpath)){
                        $plargeimg=$image->path;
                        $pnormalimg=str_replace(Gc::$upload_url."images/", "", $image->norpath);
                        //更新商品图片(main image)
                        Product::updateProperties($product_id,array("image"=>$pnormalimg,"image_large"=>$plargeimg));
                    }
                }else{
                    $upimages[]=$image;
                }
            }
            //如果有上传图片
            if ($upimages && is_array($upimages) && count($upimages)>0){
                //处理上传图片
                $this->genProimages($product_id,$upimages);
            }
        }
        if ($delimages){
            $this->delProimages($product_id,$delimages);
        }

        $success=true;
        $msg='';
        $result=array('success'=>$success,'msg'=>$msg);

        if(1){

        }else{
            $success=false;
            $msg='更新商品失败,请重试!';
        }
        return $result;
    }

    /**
     * 更新数据对象:货品
     * @param array|DataObject $product
     *
     */
    public function updateGoods($product){
        $goodsObject=new Goods();
        $goodsObject->goods_code=$product['product_code'];
        $goodsObject->goods_name=$product['product_name'];
        $goodsObject->product_id=$product['product_id'];
        $goodsObject->ptype_id=$product['ptype_id'];
        $goodsObject->ptype_key=$product['ptype_key'];
        $goodsObject->brand_id=$product['brand_id'];
        $goodsObject->sales_price=$product['price'];
        $goodsObject->market_price=$product['market_price'];
        $goodsObject->isUp=$product['isUp'];
        $goodsObject->stock=$product['num'];
        $goods=Goods::get_one('product_id='.$product['product_id']);
        if($goods){
            $goodsObject->goods_id=$goods->goods_id;
            $goodsObject->update();
        }else{
            $goodsObject->save();
        }
    }

    /**
     * 生成数据对象:货品
     * @param array|DataObject $product
     *
     */
    public function addGoods($product){
        $goodsObject=new Goods();
        $goodsObject->product_id=$product->product_id;
        $goodsObject->goods_code=$product->product_code;
        $goodsObject->goods_name=$product->product_name;
        $goodsObject->ptype_id=$product->ptype_id;
        $goodsObject->ptype_key=$product->ptype_key;
        $goodsObject->brand_id=$product->brand_id;
        $goodsObject->sales_price=$product->price;
        $goodsObject->market_price=$product->market_price;
        $goodsObject->isUp=$product->isUp;
        $goodsObject->stock=$product->num;
        return $goodsObject;
    }

    /**
     * 数据对象:作用赠品商品分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认10个。
     * @return 数据对象:作用商品分页查询列表
     */
    public function queryPageSelProduct($formPacket=null){
        $start=1;
        $limit=15;
        $product_id=$formPacket->product_id;

        $formPacket->product_id=null;
        $condition=UtilObject::object_to_array($formPacket);
        /**0:全部,1:已选择,2:未选择*/
        if (isset($condition["selectType"]))$selectType=$condition["selectType"];else $selectType=0;
        unset($condition["selectType"]);
        if (isset($condition['start']))$start=$condition['start']+1;
        if (isset($condition['limit']))$limit=$start+$condition['limit']-1;
        unset($condition['start'],$condition['limit']);
        $condition=$this->filtertoCondition($condition);

        //不在赠品列表中显示自己的goods
        $self_goods_ids=Goods::select('goods_id','product_id='.$product_id);
        $and_mark=$condition ? " and " : " ";
        $condition.=$and_mark." goods_id not in (".implode(",", $self_goods_ids).")";

        switch ($selectType) {
           case 0:
             $count=Goods::count($condition);
             break;
           case 1:
             $sql_child_query="(select gift_id from ".Productgift::tablename()." where product_id=".$product_id.")";
             $sql_count="select count(1) from ".Goods::tablename()." a,$sql_child_query b where a.goods_id=b.gift_id";
             if (!empty($condition))$sql_count.=" and ".$condition;
             $count=sqlExecute($sql_count);
             break;
           case 2:
               $sql_child_query=" left join (select gift_id from ".Productgift::tablename()." where product_id=".$product_id.") b on b.gift_id=a.goods_id where b.gift_id is null";
             $sql_count="select count(1) from ".Goods::tablename()." a $sql_child_query ";
             if (!empty($condition))$sql_count.=" and ".$condition;
             $count=sqlExecute($sql_count);
             break;
        }

        if ($count>0){
            if ($limit>$count)$limit=$count;
            switch ($selectType) {
               case 0:
                   $data =Goods::queryPage($start,$limit,$condition);
                   break;
               case 1:
                   $sql_child_query="(select gift_id from ".Productgift::tablename()." where product_id=".$product_id.")";
                   $sql_data="select a.* from ".Goods::tablename()." a,$sql_child_query b where a.goods_id=b.gift_id";
                   if (!empty($condition))$sql_data.=" and ".$condition;
                   if ($start)$start=$start-1;
                   $sql_data.=" limit $start,".($limit-$start+1);
                   $data=sqlExecute($sql_data,"Goods");
                   break;
               case 2:
                   $sql_child_query=" left join (select gift_id from ".Productgift::tablename()." where product_id=".$product_id.") b on b.gift_id=a.goods_id where b.gift_id is null";
                   $sql_data="select a.* from ".Goods::tablename()." a $sql_child_query";

                   if (!empty($condition))$sql_data.=" and ".$condition;
                   if ($start)$start=$start-1;
                   $sql_data.=" limit $start,".($limit-$start+1);
                   $data=sqlExecute($sql_data,"Goods");
                   break;
            }
            foreach ($data as $product) {
                if(Productgift::existBy("product_id=$product_id and gift_id=".$product->goods_id)){
                   $product->isShowProductCheck=true;
                }
                $ptype=Ptype::get_by_id($product->ptype_id);
                $product['ptype_name']=$ptype->name;
            }
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        return array(
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }

    /**
     * 数据对象:作用 更新赠品商品
     * @param stdclass $formPacket  查询条件对象
     * @return 数据对象:作用商品分页查询列表
     */
    public function updateProductGift($conditions){
        $success=true;
        $product_id=$conditions->product_id;
        $gift_ids=explode(",", $conditions->gift_ids);
        $old_gift_ids=explode(",", $conditions->old_gift_ids);
        $add_arr=array_diff($gift_ids, $old_gift_ids);
        $del_arr=array_diff($old_gift_ids,$gift_ids);
        try{
            foreach ($add_arr as $key => $gift_id) {
                $productGift=new Productgift();
                $productGift->product_id=$product_id;
                $productGift->gift_id=$gift_id;
                $productGift->save();
            }

            foreach ($del_arr as $key => $gift_id) {
                Productgift::deleteBy(array('product_id'=>$product_id,'gift_id'=>$gift_id));
            }

        }catch(Exception $e){
            $success=false;
        }
        return array('success' =>$success,'add'=>count($add_arr),'del'=>count($del_arr));
    }

    /**
     * 获取产品分类查询字<br/>
     * 产品类型分类多级，方便上一级也能查找到下一级的产品<br/>
     * 如二级分类也能找到所属三级分类下的产品<br/>
     * 形式如：-1-2-3-
     * @var string
     * @access public
     */
    private function getPtypeKey($gtype_id,$gtype_level){
        if (!empty($gtype_id)&&!empty($gtype_level)&&$gtype_level>0) {
          switch ($gtype_level) {
             case 1:
               return "-".$gtype_id."-";
             case 2:
               $result=$gtype_id."-";
               $gtype1_id = Ptype::select_one( "parent_id" , array("ptype_id"=>$gtype_id));
               return "-".$gtype1_id."-".$result;
             case 3:
               $result=$gtype_id."-";
               $gtype2_id = Ptype::select_one( "parent_id" , array("ptype_id"=>$gtype_id));
               $result=$gtype2_id."-".$result;
               $gtype1_id = Ptype::select_one( "parent_id" , array("ptype_id"=>$gtype2_id));
               return "-".$gtype1_id."-".$result;
          }
        }
    }

    /**
     * 商品相关图片生成
     * @param int $product_id 商品标识
     * @param array $images 图片名称数组
     * @access public
     */
    private function genProimages($product_id,$images)
    {
        //上传图片路径
        $imgdir=Gc::$upload_path.'tempimages'.DIRECTORY_SEPARATOR;
        $count=0;
        /*----图片处理----*/
        foreach($images as $image){
            //临时图片文件物理路径
            $temppath=$imgdir.$image->path;
            //商品图片根路径
            $imagePath=Gc::$upload_path."images".DIRECTORY_SEPARATOR;
            //文件后缀
            $suffix = explode('.',$image->path);
            $suffix = end($suffix);
            //随机生成文件名
            $diffpart = date("YmdHis").UtilNumber::randNumber(1000,9999);
            //文件名(带后缀)
            $file_name =  $diffpart.".".$suffix;

            //80*80图片相对路径
            $smallPath ="product".DIRECTORY_SEPARATOR."thumb".DIRECTORY_SEPARATOR."s_".$file_name;
            //生成80*80缩略图
            $isBuildThumb=UtilImage::thumb($temppath,$imagePath.$smallPath,$suffix,80,80,true,true);
            //如果成功生成缩略图
            if($isBuildThumb){
                //缩略图url
                $ico=str_replace(DIRECTORY_SEPARATOR,"/",$smallPath);
            }

            //500*500图片相对路径
            $normalPath ="product".DIRECTORY_SEPARATOR."m_".$file_name;
            //生成500*500图片
            $isBuildNormal=UtilImage::thumb($temppath,$imagePath.$normalPath,$suffix,500,500,true,true);
            if ($isBuildThumb){
                //正常图片url
                $img=str_replace(DIRECTORY_SEPARATOR,"/",$normalPath);
            }

            //600*600图片相对路径
            $largePath ="product".DIRECTORY_SEPARATOR."large".DIRECTORY_SEPARATOR.$file_name;
            LogMe::log("---------genImage:".$temppath."---------".$imagePath.$largePath);
            UtilFileSystem::createDir($imagePath."product".DIRECTORY_SEPARATOR."large".DIRECTORY_SEPARATOR);
            // $isRemoved=rename($temppath,$imagePath.$largePath);
            // if (@move_uploaded_file($temppath, $imagePath.$largePath)) {
            if (@copy($temppath, $imagePath.$largePath)) {
            //如果文件移动成功
            // if($isRemoved){
                //大图url
                $image_large=str_replace(DIRECTORY_SEPARATOR,"/",$largePath);
                UtilFileSystem::deleteFiles($temppath);
            }

            //保存商品系列图信息
            if (!empty($img)){
                $seriesImg=new Seriesimg();
                $seriesImg->product_id=$product_id;
                $seriesImg->ico=$ico;
                $seriesImg->img=$img;
                $seriesImg->image_large=$image_large;
                $seriesImg->isShow=$image->isShow==1?true:false;
                $seriesImg->sort_order=$image->sort_order;
                $seriesImg->save();
                //选择第一张图片做为商品主图
                if ($image->ismain){
                // if ($count++==0){
                    $plargeimg=$image_large;
                    $pnormalimg=$img;
                    //更新商品图片(main image)
                    Product::updateProperties($product_id,array("image"=>$pnormalimg,"image_large"=>$plargeimg));
                }
            }
        }
    }

    /**
     * 删除商品图片
     * @param int $product_id 商品标识
     * @param array $ids 商品系列图标识
     * @access public
     */
    private function delProimages($product_id,$ids)
    {
        //遍历删除,同时删除数据和图片
        foreach($ids as $id=>$bool){
            //删除图片信息
            $seriesimg = Seriesimg::get_by_id($id);
            //根据id删除商品图片数据
            Seriesimg::deleteByID($id);
            $imgfiles=Array();
            //根路径
            $path=Gc::$upload_path."images".DIRECTORY_SEPARATOR;
            //商品系列图图片路径
            $icopath=str_replace("/",DIRECTORY_SEPARATOR,$seriesimg->ico);
            $imgpath=str_replace("/",DIRECTORY_SEPARATOR,$seriesimg->img);
            $limgpath=str_replace("/",DIRECTORY_SEPARATOR,$seriesimg->image_large);
            //组合成全路径
            $imgfiles[]=$path.$icopath;
            $imgfiles[]=$path.$imgpath;
            $imgfiles[]=$path.$limgpath;
            //删除图片文件
            UtilFileSystem::deleteFiles($imgfiles);
        }
        // //重新筛选图片
        // $seriseimg = Seriesimg::get_one("product_id=".$product_id);
        // //如果存在商品图片
        // if($seriseimg){
        //     //更新商品图片(main image)
        //     Product::updateProperties($product_id,array("image"=>$seriseimg->img,"image_large"=>$seriseimg->image_large));
        // }
    }

}
?>
