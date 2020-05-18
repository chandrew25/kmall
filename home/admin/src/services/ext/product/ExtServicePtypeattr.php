<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:分类属性<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServicePtypeattr extends ServiceBasic
{
    /**
     * 保存数据对象:分类属性
     * @param array|DataObject $ptypeattr
     * @return int 保存对象记录的ID标识号
     */
    public function save($ptypeattr)
    {
        if (is_array($ptypeattr)){
            $ptypeattrObj=new Ptypeattr($ptypeattr);
        }
        if ($ptypeattrObj instanceof Ptypeattr){
        	$ptype=Ptype::get_by_id($ptypeattrObj->ptype_id);
        	switch ($ptype->level) {
               case 2:
                 $ptypeattrObj->ptype2_id=$ptypeattrObj->ptype_id;
                 $ptypeattrObj->ptype1_id=$ptype->parent_id;
                 break;
               case 3:
                 $ptypeattrObj->ptype3_id=$ptypeattrObj->ptype_id;
                 $ptypeattrObj->ptype2_id=$ptype->parent_id;
                 $ptype=Ptype::get_by_id($ptype->parent_id);
                 $ptypeattrObj->ptype1_id=$ptype->parent_id;
                 break;
            }
            $attribute=Attribute::get_by_id($ptypeattrObj->attribute_id);
        	$ptypeattrObj->attribute1_id=$attribute->parent_id;
            $data=$ptypeattrObj->save();
            if($attribute->level==2&&!Ptypeattr::get_one("ptype_id=".$ptypeattrObj->ptype_id." and attribute_id=".$ptypeattrObj->attribute1_id)){
            	$pattr=new Ptypeattr();
            	$pattr->attribute_id=$ptypeattrObj->attribute1_id;
            	$pattr->ptype_id=$ptypeattrObj->ptype_id;
            	$pattr->ptype1_id=$ptypeattrObj->ptype1_id;
            	$pattr->ptype2_id=$ptypeattrObj->ptype2_id;
            	$pattr->save();
			}
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 更新数据对象 :分类属性
     * @param array|DataObject $ptypeattr
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($ptypeattr)
    {
        if (is_array($ptypeattr)){
            $ptypeattrObj=new Ptypeattr($ptypeattr);
        }
        if ($ptypeattrObj instanceof Ptypeattr){
        	$attribute=Attribute::get_by_id($ptypeattrObj->attribute_id);
        	$ptypeattrObj->attribute1_id=$attribute->parent_id;
        	/*
        	$ptype=Ptype::get_by_id($ptypeattrObj->ptype_id);
        	switch ($ptype->level) {
               case 2:
                 $ptypeattrObj->ptype2_id=$ptypeattrObj->ptype_id;
                 $ptypeattrObj->ptype1_id=$ptype->parent_id;
                 break;
               case 3:
                 $ptypeattrObj->ptype3_id=$ptypeattrObj->ptype_id;
                 $ptypeattrObj->ptype2_id=$ptype->parent_id;
                 $ptype=Ptype::get_by_id($ptype->parent_id);
                 $ptypeattrObj->ptype1_id=$ptype->parent_id;
                 break;
            }
            */
            $data=$ptypeattrObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:分类属性的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Ptypeattr::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:分类属性分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:分类属性分页查询列表
     */
    public function queryPagePtypeattr($formPacket=null)
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
        $count=Ptypeattr::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Ptypeattr::queryPage($start,$limit,$condition);
            foreach ($data as $ptypeattr) {
                if ($ptypeattr->attribute_id){
                    $attribute_instance=Attribute::get_by_id($ptypeattr->attribute_id);
                    $ptypeattr['attribute_name']=$attribute_instance->attribute_name;
                }
                if ($attribute_instance){
                    $level=$attribute_instance->level;
                    $attributeShowAll=$attribute_instance->attribute_name;
                    switch ($level) {
                       case 2:
                         $attribute=Attribute::get_by_id($attribute_instance->parent_id);
                         $attributeShowAll=$attribute->attribute_name."->".$attributeShowAll;
                         break;
                       case 3:
                         $attribute=Attribute::get_by_id($attribute_instance->parent_id);
                         $attributeShowAll=$attribute->attribute_name."->".$attributeShowAll;
                         $attribute=Attribute::get_by_id($attribute->parent_id);
                         $attributeShowAll=$attribute->attribute_name."->".$attributeShowAll;
                         break;
                    }
                    $ptypeattr["attributeShowAll"]=$attributeShowAll;
                }
                if ($ptypeattr->ptype_id){
                    $ptype_instance=Ptype::get_by_id($ptypeattr->ptype_id);
                    $ptypeattr['ptype_name']=$ptype_instance->name;
                }
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
     * 批量上传分类属性
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."ptypeattr".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."ptypeattr$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Ptypeattr::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $ptypeattr) {
                        if (!is_numeric($ptypeattr["attribute_id"])){
                            $attribute_all=$ptypeattr["属性[全]"];
                            if ($attribute_all){
                                $attribute_all_arr=explode("->",$attribute_all);
                                if ($attribute_all_arr){
                                    $level=count($attribute_all_arr);
                                    switch ($level) {
                                        case 1:
                                            $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[0],"level"=>1));
                                            if ($attribute)$ptypeattr["attribute_id"]=$attribute->attribute_id;
                                            break;
                                        case 2:
                                            $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[0],"level"=>1));
                                            if ($attribute){
                                                $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[1],"level"=>2,"parent_id"=>$attribute->attribute_id));
                                                if ($attribute)$ptypeattr["attribute_id"]=$attribute->attribute_id;
                                            }
                                            break;
                                        case 3:
                                            $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[0],"level"=>1));
                                            if ($attribute){
                                                $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[1],"level"=>2,"parent_id"=>$attribute->attribute_id));
                                                if ($attribute){
                                                    $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[2],"level"=>3,"parent_id"=>$attribute->attribute_id));
                                                    if ($attribute)$ptypeattr["attribute_id"]=$attribute->attribute_id;
                                                }
                                            }
                                            break;
                                       }
                                  }
                            }
                        }
                        $ptypeattr=new Ptypeattr($ptypeattr);
                        $ptypeattr_id=$ptypeattr->getId();
                        if (!empty($ptypeattr_id)){
                            $hadPtypeattr=Ptypeattr::existByID($ptypeattr->getId());
                            if ($hadPtypeattr!=null){
                                $result=$ptypeattr->update();
                            }else{
                                $result=$ptypeattr->save();
                            }
                        }else{
                            $result=$ptypeattr->save();
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
     * 导出分类属性
     * @param mixed $filter
     */
    public function exportPtypeattr($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Ptypeattr::get($filter);
        $arr_output_header= self::fieldsMean(Ptypeattr::tablename()); 
        foreach ($data as $ptypeattr) {
            if ($ptypeattr->attribute_id){
                $attribute_instance=Attribute::get_by_id($ptypeattr->attribute_id);
                $ptypeattr['attribute_id']=$attribute_instance->attribute_name;
            }
            if ($attribute_instance){
                $level=$attribute_instance->level;
                $attributeShowAll=$attribute_instance->attribute_name;
                switch ($level) {
                   case 2:
                     $attribute=Attribute::get_by_id($attribute_instance->parent_id);
                     $attributeShowAll=$attribute->attribute_name."->".$attributeShowAll;
                     break;
                   case 3:
                     $attribute=Attribute::get_by_id($attribute_instance->parent_id);
                     $attributeShowAll=$attribute->attribute_name."->".$attributeShowAll;
                     $attribute=Attribute::get_by_id($attribute->parent_id);
                     $attributeShowAll=$attribute->attribute_name."->".$attributeShowAll;
                     break;
                }
                $ptypeattr["attributeShowAll"]=$attributeShowAll;
                $pos=UtilArray::keyPosition($arr_output_header,"attribute_id");
                UtilArray::insert($arr_output_header,$pos+1,array('attributeShowAll'=>"属性[全]"));
            }
            if ($ptypeattr->ptype_id){
                $ptype_instance=Ptype::get_by_id($ptypeattr->ptype_id);
                $ptypeattr['ptype_id']=$ptype_instance->name;
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."ptypeattr".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."ptypeattr$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."ptypeattr/export/ptypeattr$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>