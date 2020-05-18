<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:商品类型<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServicePtype extends ServiceBasic
{
  /**
   * 保存数据对象:商品类型
   * @param array|DataObject $ptype
   * @return int 保存对象记录的ID标识号
   */
  public function save($ptype)
  {
    if (isset($ptype["show_in_nav"])&&($ptype["show_in_nav"]=='1'))$ptype["show_in_nav"]=true; else $ptype["show_in_nav"]=false;
    if (isset($ptype["isShow"])&&($ptype["isShow"]=='1'))$ptype["isShow"]=true; else $ptype["isShow"]=false;
    if (!empty($_FILES)&&!empty($_FILES["icoUpload"]["name"])){
      $result=$this->uploadImg($_FILES,"icoUpload","ico");
      if ($result&&($result['success']==true)){
        if (array_key_exists('file_name',$result)){
          $ptype["ico"]= $result['file_name'];
        }
      }else{
        return $result;
      }
    }
    if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
        $result=$this->uploadImage($_FILES,"imageUpload","image","ptype");
        if ($result&&($result['success']==true)){
            if (array_key_exists('file_name',$result)){
                $ptype["image"]= $result['file_name'];
            }
        }else{
            return $result;
        }
    }
    if (is_array($ptype)){
      $parent_id= $ptype['parent_id'];
      //自动计算出level
      $parent=Ptype::get_one("ptype_id=".$parent_id);
      $parent_level=$parent->level;
      $ptype['level']=$parent_level+1;
      $ptype["countChild"]=0;
      $ptypeObj=new Ptype($ptype);
    }
    if ($ptypeObj instanceof Ptype){
      //自动更新上一级的子数量
      $countChild=Ptype::select("count(*)","parent_id=".$parent_id);
      if(!$countChild){
        $countChild=0;
      }
      Ptype::updateBy("ptype_id=".$parent_id,"countChild=".$countChild);
      $data=$ptypeObj->save();
    }else{
      $data=false;
    }
    return array(
      'success' => true,
      'data'  => $data
    );
  }

  /**
   * 更新数据对象 :商品类型
   * @param array|DataObject $ptype
   * @return boolen 是否更新成功；true为操作正常
   */
  public function update($ptype)
  {
    if (isset($ptype["show_in_nav"])&&($ptype["show_in_nav"]=='1'))$ptype["show_in_nav"]=true; else $ptype["show_in_nav"]=false;
    if (isset($ptype["isShow"])&&($ptype["isShow"]=='1'))$ptype["isShow"]=true; else $ptype["isShow"]=false;
    if (!empty($_FILES)&&!empty($_FILES["icoUpload"]["name"])){
      $result=$this->uploadImg($_FILES,"icoUpload","ico");
      if ($result&&($result['success']==true)){
        if (array_key_exists('file_name',$result)){
          $ptype["ico"]= $result['file_name'];
        }
      }else{
        return $result;
      }
    }
    if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
        $result=$this->uploadImage($_FILES,"imageUpload","image","ptype");
        if ($result&&($result['success']==true)){
            if (array_key_exists('file_name',$result)){
                $ptype["image"]= $result['file_name'];
            }
        }else{
            return $result;
        }
    }
    if (is_array($ptype)){
      $parent_id= $ptype['parent_id'];
      //自动计算出level
      $parent=Ptype::get_one("ptype_id=".$parent_id);
      $parent_level=$parent->level;
      $ptype['level']=$parent_level+1;

      $ptypeObj=new Ptype($ptype);
    }
    if ($ptypeObj instanceof Ptype){
      $data=$ptypeObj->update();

      //自动更新上一级的子数量
      $countChild=Ptype::select("count(*)","parent_id=".$parent_id);
      Ptype::updateBy("ptype_id=".$parent_id,"countChild=".$countChild);
    }else{
      $data=false;
    }
    return array(
      'success' => true,
      'data'  => $data
    );
  }

  /**
   * 更新数据对象:商品类型包括属性表
   * @param array|DataObject $conditions
   * @return boolen 是否更新成功；true为操作正常
   */
  public function updatePtypeAttribute($conditions)
  {
    $ptype_id=$conditions->ptype_id;
    $attributes=$conditions->attributes;
    $success=true;
    try{
      foreach($attributes as $attribute){
        $ptypeattr=Ptypeattr::get_one(array("ptype_id"=>$ptype_id,"attribute_id"=>$attribute->attribute_id));
        if($ptypeattr){
          if(!$attribute->isShowAttributeCheck){
            $attribute1_id=$ptypeattr->attribute1_id;
            if ($attribute1_id) {
               $ptypeattr1=Ptypeattr::get_one(array("ptype_id"=>$ptype_id,"attribute_id"=>$attribute1_id));
               if ($ptypeattr1) {
                 $ptypeattr1->delete();
               }
            }
            $ptypeattr->delete();
          }
        }else{
          if($attribute->isShowAttributeCheck){
          	$attribute=Attribute::get_by_id($attribute->attribute_id);
            $ptypeattr=new Ptypeattr(array("ptype_id"=>$ptype_id,"attribute_id"=>$attribute->attribute_id,"attribute1_id"=>$attribute->parent_id));
						$ptype=Ptype::get_by_id($ptype_id);
            switch ($ptype->level) {
			         case 2:
			         $ptypeattr->ptype2_id=$ptype->ptype_id;
			         $ptypeattr->ptype1_id=$ptype->parent_id;
			         break;
			         case 3:
			         $ptypeattr->ptype3_id=$ptype->ptype_id;
			         $ptypeattr->ptype2_id=$ptype->parent_id;
			         $ptype=Ptype::get_by_id($ptype->parent_id);
			         $ptypeattr->ptype1_id=$ptype->parent_id;
			         break;
			      }
			      $ptypeattr->save();
			      //添加父类属性
            if($attribute->level==2&&!Ptypeattr::get_one("ptype_id=".$ptype_id." and attribute_id=".$attribute->parent_id)){
      				$pattr=new Ptypeattr();
      				$pattr->attribute_id=$attribute->parent_id;
      				$pattr->ptype_id=$ptypeattr->ptype_id;
      				$pattr->ptype1_id=$ptypeattr->ptype1_id;
      				$pattr->ptype2_id=$ptypeattr->ptype2_id;
      				$pattr->save();
						}
          }
        }
      }
    }catch(Exception $e){
      $success=false;
    }
    return array('success' =>$success);
  }

  /**
   * 上传商品类型图片文件
   */
  public function uploadImg($files,$uploadFlag,$upload_dir)
  {
    $diffpart=date("YmdHis");
    $result="";
    if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
      $tmptail = end(explode('.', $files[$uploadFlag]["name"]));
      $uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."ptype".DIRECTORY_SEPARATOR.$upload_dir.DIRECTORY_SEPARATOR.$diffpart.".".$tmptail;
      $result   =UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
      if ($result&&($result['success']==true)){
        $result['file_name']="ptype/$upload_dir/$diffpart.$tmptail";
      }else{
        return array(
          'success' => true,
          'data'  => false
        );
      }
    }
    return $result;
  }
  /**
   * 根据主键删除数据对象:商品类型的多条数据记录
   * @param array|string $ids 数据对象编号
   * 形式如下:
   * 1.array:array(1,2,3,4,5)
   * 2.字符串:1,2,3,4
   * @return boolen 是否删除成功；true为操作正常
   */
  public function deleteByIds($ids)
  {
    $data=Ptype::deleteByIds($ids);
    return array(
      'success' => true,
      'data'  => $data
    );
  }

  /**
   * 数据对象:商品类型分页查询
   * @param stdclass $formPacket  查询条件对象
   * 必须传递分页参数：start:分页开始数，默认从0开始
   *           limit:分页查询数，默认15个。
   * @return 数据对象:商品类型分页查询列表
   */
  public function queryPagePtype($formPacket=null)
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
    $count=Ptype::count($condition);
    if ($count>0){
      if ($limit>$count)$limit=$count;
      $data =Ptype::queryPage($start,$limit,$condition);
      foreach ($data as $ptype) {
        $level=$ptype->level;
        if (empty($ptype->countChild))$ptype->countChild=0;
        $ptypeShowAll="";
        switch ($level) {
           case 1:
           $ptypeShowAll="无";
           break;
           case 2:
           $ptype_parent=Ptype::get_by_id($ptype->parent_id);
           $ptypeShowAll=$ptype_parent->name;
           break;
           case 3:
           $ptype_parent=Ptype::get_by_id($ptype->parent_id);
           $ptypeShowAll=$ptype_parent->name;
           $ptype_parent=Ptype::get_by_id($ptype_parent->parent_id);
           $ptypeShowAll=$ptype_parent->name."->".$ptypeShowAll;
           break;
        }
        $ptype["ptypeShowAll"]=$ptypeShowAll;
      }
      if ($data==null)$data=array();
    }else{
      $data=array();
    }
    return array(
      'success' => true,
      'totalCount'=>$count,
      'data'  => $data
    );
  }

  /**
   * 数据对象:商品类型包括属性表分页查询
   * @param stdclass $formPacket  查询条件对象
   * 必须传递分页参数：start:分页开始数，默认从0开始
   *           limit:分页查询数，默认10个。
   * @return 数据对象:主题包括课程分页查询列表
   */
  public function queryPagePtypeAttribute($formPacket=null)
  {
    $start=1;
    $limit=15;
    //取出ptype_id
    $ptype_id=$formPacket->ptype_id;
    $formPacket->ptype_id=null;
    //是否查看所有
    if($formPacket->all){
    	$all=true;
    	$formPacket->all=null;
		}
    $condition=UtilObject::object_to_array($formPacket);
    if(!$condition["parent_id"]){
    	$condition["parent_id"]=0;
		}
    /**0:全部,1:已选择,2:未选择*/
    if(isset($condition["selectType"])){
    	$selectType=$condition["selectType"];
		}else{
			$selectType=0;
		}
    if (isset($condition['start']))$start=$condition['start']+1;
    if (isset($condition['limit']))$limit=$start+$condition['limit']-1;
    unset($condition["selectType"],$condition['start'],$condition['limit']);
    $condition=$this->filtertoCondition($condition);
    switch ($selectType) {
       case 0:
       $count=Attribute::count($condition);
       break;
       case 1:
       $sql_child_query="(select attribute_id from ".Ptypeattr::tablename()." where ptype_id=".$ptype_id.")";
       $sql_count="select count(1) from ".Attribute::tablename()." a,$sql_child_query b where a.attribute_id=b.attribute_id ";
       if (!empty($condition))$sql_count.=" and ".$condition;
       $count=sqlExecute($sql_count);
       break;
       case 2:
       $sql_child_query=" left join (select attribute_id from ".Ptypeattr::tablename()." where ptype_id=".$ptype_id.")  b on b.attribute_id=a.attribute_id where b.attribute_id is null ";
       $sql_count="select count(1) from ".Attribute::tablename()." a $sql_child_query ";
       if (!empty($condition))$sql_count.=" and ".$condition;
       $count=sqlExecute($sql_count);
       break;
    }
    if ($count>0){
      if ($limit>$count)$limit=$count;
      switch ($selectType) {
         case 0:
           if($all){
           	   $data =Attribute::get($condition);
				   }else{
				   	   $data =Attribute::queryPage($start,$limit,$condition);
				   }
           break;
         case 1:
           $sql_child_query="(select attribute_id from ".Ptypeattr::tablename()." where ptype_id=".$ptype_id.")";
           $sql_data="select a.* from ".Attribute::tablename()." a,$sql_child_query b where a.attribute_id=b.attribute_id ";
           if (!empty($condition))$sql_data.=" and ".$condition;
           if(!$all){
				   	   if ($start)$start=$start-1;
           	   $sql_data.=" limit $start,".($limit-$start+1);
				   }
           $data=sqlExecute($sql_data,"Attribute");
           break;
         case 2:
           $sql_child_query=" left join (select attribute_id from ".Ptypeattr::tablename()." where ptype_id=".$ptype_id.")  b on b.attribute_id=a.attribute_id where b.attribute_id is null ";
           $sql_data="select a.* from ".Attribute::tablename()." a $sql_child_query ";
           if (!empty($condition))$sql_data.=" and ".$condition;
           if(!$all){
				   	   if ($start)$start=$start-1;
           	   $sql_data.=" limit $start,".($limit-$start+1);
				   }
           $data=sqlExecute($sql_data,"Attribute");
           break;
      }
      foreach ($data as $attribute){
        if ($attribute_instance){
          $level=$attribute->level;
          $attributeShowAll=$attribute->attribute_name;
          switch ($level) {
             case 2:
             $pattr=Attribute::get_by_id($attribute->parent_id);
             $attributeShowAll=$pattr->attribute_name."->".$attributeShowAll;
             break;
          }
          $attribute["attributeShowAll"]=$attributeShowAll;
        }
        if(Ptypeattr::existBy("ptype_id=$ptype_id and attribute_id=".$attribute->attribute_id)){
           $attribute->isShowAttributeCheck=true;
        }
      }
    }
    if($data==null)$data=array();
    return array(
      'success' => true,
      'totalCount'=>$count,
      'data'  => $data
    );
  }

  /**
   * 批量上传商品类型
   * @param mixed $upload_file <input name="upload_file" type="file">
   */
  public function import($files)
  {
    $diffpart=date("YmdHis");
    if (!empty($files["upload_file"])){
      $tmptail = end(explode('.', $files["upload_file"]["name"]));
      $uploadPath =GC::$attachment_path."ptype".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."ptype$diffpart.$tmptail";
      $result   =UtilFileSystem::uploadFile($files,$uploadPath);
      if ($result&&($result['success']==true)){
        if (array_key_exists('file_name',$result)){
          $arr_import_header = self::fieldsMean(Ptype::tablename());
          $data        = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
          $result=false;
          foreach ($data as $ptype) {
            $ptype=new Ptype($ptype);
            $ptype_id=$ptype->getId();
            if (!empty($ptype_id)){
              $hadPtype=Ptype::existByID($ptype->getId());
              if ($hadPtype!=null){
                $result=$ptype->update();
              }else{
                $result=$ptype->save();
              }
            }else{
              $result=$ptype->save();
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
      'data'  => $result
    );
  }

  /**
   * 导出商品类型
   * @param mixed $filter
   */
  public function exportPtype($filter=null)
  {
    if ($filter)$filter=$this->filtertoCondition($filter);
    $data=Ptype::get($filter);
    $arr_output_header= self::fieldsMean(Ptype::tablename());
    unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
    $diffpart=date("YmdHis");
    $outputFileName=Gc::$attachment_path."ptype".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."ptype$diffpart.xls";
    UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
    $downloadPath  =Gc::$attachment_url."ptype/export/ptype$diffpart.xls";
    return array(
      'success' => true,
      'data'  => $downloadPath
    );
  }

  //根据中文 根据key得到id
  public function PkeyToPid($key){
    $key_arr = explode("-",$key);
    $ptype = new Ptype();
    $ptype_parent_id = "";
    for($i=0;$i<count($key_arr);$i++){
      //当前Gtype
      if($ptype_parent_id){
        $ptype_temp = Ptype::get_one(array("parent_id"=>$ptype_parent_id));
      }else{
        $ptype_temp = Ptype::get_one(array("name"=>$key_arr[$i]),"level asc");
      }
      if($ptype_temp){
        $ptype_parent_id = $ptype_temp->ptype_id;
        $ptype = $ptype_temp;
      }else{
        $ptype = "";
        $ptype_parent_id = "";
      }
    }
    if($ptype){
      $id = $ptype->ptype_id;
    }else{
      $id = -1;
    }
    return $id;
  }

  //根据中文 根据key得到对应的id显示的key
  public function PkeyStrToPkeyInt($key){
    $key_arr = explode("-",$key);
    $result = "-";
    $ptype_parent_id = "";
    $ptype = new Ptype();
    for($i=0;$i<count($key_arr);$i++){
      //当前Ptype
      if($ptype_parent_id){
        $ptype_temp = Ptype::get_one(array("parent_id"=>$ptype_parent_id));
      }else{
        $ptype_temp = Ptype::get_one(array("name"=>$key_arr[$i]));
      }
      if($ptype_temp){
        $ptype_parent_id = $ptype_temp->ptype_id;
        $ptype = $ptype_temp;
        $result .= $ptype_temp->ptype_id."-";
      }else{
        $ptype = "";
        $ptype_parent_id = "";
        return $result;
      }
    }
    return $result;
  }

  /**
   * 添加产品分类类型
   */
  public function addPtype($formPacket = array())
  {
    $msg = "抱歉，该名称已存在！";
    $ptype=new Ptype($formPacket);
    if ($ptype->name){
      //查询是否有重命名的情况
      $hadgtype_name = Ptype::get_one(array("name"=>$ptype->name,"parent_id"=>$ptype->parent_id));
      if(empty($hadgtype_name)){
        if (isset($formPacket['level'])&&($formPacket['level']>=0)){
          $ptype->level=$ptype->level+1;
          }
        $data=$ptype->save();
        PType::increment("ptype_id=$ptype->parent_id","countChild",1);
        $msg = "保存成功";
      }else{
        return array('success' => false, 'msg' => $msg);
      }
    }
    return array('success' => true, 'msg' => $msg);
  }

}
?>
