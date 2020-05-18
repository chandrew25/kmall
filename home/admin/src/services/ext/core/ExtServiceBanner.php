<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:广告栏目<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceBanner extends ServiceBasic
{
    /**
     * 保存数据对象:广告栏目
     * @param array|DataObject $banner
     * @return int 保存对象记录的ID标识号
     */
    public function save($banner)
    {
        if (isset($banner["isShow"])&&($banner["isShow"]=='1'))$banner["isShow"]=1; else $banner["isShow"]=0;
        if (!empty($_FILES)&&!empty($_FILES["urlUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"urlUpload","url","banner");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){ 
                    $banner["url"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($banner)){
            $bannerObj=new Banner($banner);
        }
        if ($bannerObj instanceof Banner){
            $data=$bannerObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :广告栏目
     * @param array|DataObject $banner
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($banner)
    {
        if (isset($banner["isShow"])&&($banner["isShow"]=='1'))$banner["isShow"]=1; else $banner["isShow"]=0;
        if (!empty($_FILES)&&!empty($_FILES["urlUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"urlUpload","url","banner");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){ 
                    $banner["url"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($banner)){
            $bannerObj=new Banner($banner);
        }
        if ($bannerObj instanceof Banner){
            $data=$bannerObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:广告栏目的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Banner::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:广告栏目分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:广告栏目分页查询列表
     */
    public function queryPageBanner($formPacket=null)
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
        $count=Banner::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Banner::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Banner::propertyShow($data,array('type'));
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
     * 批量上传广告栏目
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."banner".DS."import".DS."banner$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Banner::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $banner) {
                        $banner=new Banner($banner);
                        if (!EnumBannerType::isEnumValue($banner->type)){
                            $banner->type=EnumBannerType::typeByShow($banner->type);
                        }
                        $banner_id=$banner->getId();
                        if (!empty($banner_id)){
                            $hadBanner=Banner::existByID($banner->getId());
                            if ($hadBanner){
                                $result=$banner->update();
                            }else{
                                $result=$banner->save();
                            }
                        }else{
                            $result=$banner->save();
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
     * 导出广告栏目
     * @param mixed $filter
     */
    public function exportBanner($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Banner::get($filter);
        if ((!empty($data))&&(count($data)>0))
        {
            Banner::propertyShow($data,array('type'));
        }
        $arr_output_header= self::fieldsMean(Banner::tablename()); 
        foreach ($data as $banner) {
            if ($banner->typeShow){
                $banner['type']=$banner->typeShow;
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."banner".DS."export".DS."banner$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."banner/export/banner$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>