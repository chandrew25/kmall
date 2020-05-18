<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:国家<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceCountry extends ServiceBasic
{
    /**
     * 保存数据对象:国家
     * @param array|DataObject $country
     * @return int 保存对象记录的ID标识号
     */
    public function save($country)
    {
        if (isset($country["isShow"])&&($country["isShow"]=='1'))$country["isShow"]=1; else $country["isShow"]=0;
        if (!empty($_FILES)&&!empty($_FILES["thumbnailUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"thumbnailUpload","thumbnail","country");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $country["thumbnail"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (!empty($_FILES)&&!empty($_FILES["flagimageUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"flagimageUpload","flagimage","country");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $country["flagimage"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (!empty($_FILES)&&!empty($_FILES["imagesUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"imagesUpload","images","country");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $country["images"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($country)){
            $countryObj=new Country($country);
        }
        if ($countryObj instanceof Country){
            $data=$countryObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 更新数据对象 :国家
     * @param array|DataObject $country
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($country)
    {
        if (isset($country["isShow"])&&($country["isShow"]=='1'))$country["isShow"]=1; else $country["isShow"]=0;
        if (!empty($_FILES)&&!empty($_FILES["thumbnailUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"thumbnailUpload","thumbnail","country");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $country["thumbnail"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (!empty($_FILES)&&!empty($_FILES["flagimageUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"flagimageUpload","flagimage","country");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $country["flagimage"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (!empty($_FILES)&&!empty($_FILES["imagesUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"imagesUpload","images","country");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $country["images"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($country)){
            $countryObj=new Country($country);
        }
        if ($countryObj instanceof Country){
            $data=$countryObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 根据主键删除数据对象:国家的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Country::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 数据对象:国家分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:国家分页查询列表
     */
    public function queryPageCountry($formPacket=null)
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
        $count=Country::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Country::queryPage($start,$limit,$condition);
            foreach ($data as $country) {
                $country->introductionShow=preg_replace("/<\s*img\s+[^>]*?src\s*=\s*(\'|\")(.*?)\\1[^>]*?\/?\s*>/i","<a href='\${2}' target='_blank'>\${0}</a>",$country->introduction);
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
     * 批量上传国家
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."country".DS."import".DS."country$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Country::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $country) {
                        $country=new Country($country);
                        $country_id=$country->getId();
                        if (!empty($country_id)){
                            $hadCountry=Country::existByID($country->getId());
                            if ($hadCountry){
                                $result=$country->update();
                            }else{
                                $result=$country->save();
                            }
                        }else{
                            $result=$country->save();
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
     * 导出国家
     * @param mixed $filter
     */
    public function exportCountry($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Country::get($filter);
        $arr_output_header= self::fieldsMean(Country::tablename());
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."country".DS."export".DS."country$diffpart.xls";
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."country/export/country$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }
}
?>
