<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:属性表<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceAttribute extends ServiceBasic
{
    /**
     * 保存数据对象:属性表
     * @param array|DataObject $attribute
     * @return int 保存对象记录的ID标识号
     */
    public function save($attribute)
    {
        if (isset($attribute["isShow"])&&($attribute["isShow"]=='1'))$attribute["isShow"]=true; else $attribute["isShow"]=false;
        if (is_array($attribute)){
            $attributeObj=new Attribute($attribute);
        }
        if ($attributeObj instanceof Attribute){
            $data=$attributeObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :属性表
     * @param array|DataObject $attribute
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($attribute)
    {
        if (isset($attribute["isShow"])&&($attribute["isShow"]=='1'))$attribute["isShow"]=true; else $attribute["isShow"]=false;
        if (is_array($attribute)){
            $attributeObj=new Attribute($attribute);
        }
        if ($attributeObj instanceof Attribute){
            $data=$attributeObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:属性表的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
    	//删除子属性
    	$ar_ids=explode(",",$ids);
    	if(count($ar_ids)>0){
    		$attribute=Attribute::get_by_id($ar_ids[0]);
    		if($attribute){
    			if($attribute->level==1){
    				for($i=0;$i<count($ar_ids);$i++){
    					Attribute::deleteBy("parent_id=".$ar_ids[$i]);
					}
				}
			}
		}
        $data=Attribute::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:属性表分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:属性表分页查询列表
     */
    public function queryPageAttribute($formPacket=null)
    {
        $start=1;
        $limit=15;
        $condition=UtilObject::object_to_array($formPacket);
        $all=$condition['all'];
        $attr=$condition['attr'];
        if (isset($condition['start'])){
            $start=$condition['start']+1;
        }
        if (isset($condition['limit'])){
            $limit=$condition['limit']; 
            $limit=$start+$limit-1; 
        }
        if(isset($condition["selectType"]))$selectType=$condition["selectType"];
        unset($condition['all'],$condition['attr'],$condition['start'],$condition['limit'],$condition["selectType"]);
        if(!$condition["parent_id"]){
        	$condition["parent_id"]=0;
		}
        $condition=$this->filtertoCondition($condition);
        $count=Attribute::count($condition);
        if ($count>0){
            //找出所有规格
        	if($all){
        		$data =Attribute::get($condition);
			}else{
				if ($limit>$count)$limit=$count;
            	$data =Attribute::queryPage($start,$limit,$condition);
			}
            //提供有规格值的规格项
            if($attr){
                $attrdata=array();
                foreach ($data as $attribute) {
                    $cchild=Attribute::count('parent_id='.$attribute->attribute_id);
                    if($cchild){
                       $attrdata[]=$attribute;
                    }
                }
                $count=count($attrdata);
                $data= $attrdata;
                if(!$count)$data=array(); 
            }else{
                foreach ($data as $attribute) {
                    if ($attribute_instance){
                        $level=$attribute_instance->level;
                        $attributeShowAll=$attribute_instance->attribute_name;
                        switch ($level) {
                           case 2:
                             $attribute=Attribute::get_by_id($attribute_instance->parent_id);
                             $attributeShowAll=$attribute->attribute_name."->".$attributeShowAll;
                             break;
                        }
                        $attribute["attributeShowAll"]=$attributeShowAll;
                    }
                }
                if ($data==null)$data=array();  
            }
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
     * 批量上传属性表
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."attribute".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."attribute$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Attribute::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $attribute) {
                        if (!is_numeric($attribute["parent_id"])){
                            $attribute_all=$attribute["上级分类[全]"];
                            if ($attribute_all){
                                $attribute_all_arr=explode("->",$attribute_all);
                                if ($attribute_all_arr){
                                    $level=count($attribute_all_arr);
                                    switch ($level) {
                                        case 1:
                                            $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[0],"level"=>1));
                                            if ($attribute)$attribute["parent_id"]=$attribute->parent_id;
                                            break;
                                        case 2:
                                            $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[0],"level"=>1));
                                            if ($attribute){
                                                $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[1],"level"=>2,"parent_id"=>$attribute->parent_id));
                                                if ($attribute)$attribute["parent_id"]=$attribute->parent_id;
                                            }
                                            break;
                                        case 3:
                                            $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[0],"level"=>1));
                                            if ($attribute){
                                                $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[1],"level"=>2,"parent_id"=>$attribute->parent_id));
                                                if ($attribute){
                                                    $attribute=Attribute::get_one(array("attribute_name"=>$attribute_all_arr[2],"level"=>3,"parent_id"=>$attribute->parent_id));
                                                    if ($attribute)$attribute["parent_id"]=$attribute->parent_id;
                                                }
                                            }
                                            break;
                                       }
                                  }
                            }
                        }
                        $attribute=new Attribute($attribute);
                        $attribute_id=$attribute->getId();
                        if (!empty($attribute_id)){
                            $hadAttribute=Attribute::existByID($attribute->getId());
                            if ($hadAttribute!=null){
                                $result=$attribute->update();
                            }else{
                                $result=$attribute->save();
                            }
                        }else{
                            $result=$attribute->save();
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
     * 导出属性表
     * @param mixed $filter
     */
    public function exportAttribute($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Attribute::get($filter);
        $arr_output_header= self::fieldsMean(Attribute::tablename()); 
        foreach ($data as $attribute) {
            if ($attribute->parent_id){
                $attribute_instance=Attribute::get_by_id($attribute->parent_id);
                $attribute['parent_id']=$attribute_instance->attribute_name;
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
                $attribute["attributeShowAll"]=$attributeShowAll;
                $pos=UtilArray::keyPosition($arr_output_header,"parent_id");
                UtilArray::insert($arr_output_header,$pos+1,array('attributeShowAll'=>"上级分类[全]"));
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."attribute".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."attribute$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."attribute/export/attribute$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>
