<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:活动<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceActivity extends ServiceBasic
{
    /**
     * 保存数据对象:活动
     * @param array|DataObject $activity
     * @return int 保存对象记录的ID标识号
     */
    public function save($activity)
    {
        if (isset($activity["start_time"]))$activity["start_time"]=UtilDateTime::dateToTimestamp($activity["start_time"]);
        if (isset($activity["end_time"]))$activity["end_time"]=UtilDateTime::dateToTimestamp($activity["end_time"]);
        if (!empty($_FILES)&&!empty($_FILES["imagesUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"imagesUpload","images","activity");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $activity["images"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($activity)){
            $activityObj=new Activity($activity);
        }
        if ($activityObj instanceof Activity){
            $data=$activityObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 更新数据对象 :活动
     * @param array|DataObject $activity
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($activity)
    {
        if (isset($activity["start_time"]))$activity["start_time"]=UtilDateTime::dateToTimestamp($activity["start_time"]);
        if (isset($activity["end_time"]))$activity["end_time"]=UtilDateTime::dateToTimestamp($activity["end_time"]);
        if (!empty($_FILES)&&!empty($_FILES["imagesUpload"]["name"])){
            $result=$this->uploadImage($_FILES,"imagesUpload","images","activity");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $activity["images"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($activity)){
            $activityObj=new Activity($activity);
        }
        if ($activityObj instanceof Activity){
            $data=$activityObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 根据主键删除数据对象:活动的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Activity::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 数据对象:活动分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:活动分页查询列表
     */
    public function queryPageActivity($formPacket=null)
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
        $count=Activity::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Activity::queryPage($start,$limit,$condition);
            foreach ($data as $activity) {
                if ($activity->start_time)$activity["start_time"]=UtilDateTime::timestampToDateTime($activity->start_time);
                if ($activity->end_time)$activity["end_time"]=UtilDateTime::timestampToDateTime($activity->end_time);
                $activity->introShow=preg_replace("/<\s*img\s+[^>]*?src\s*=\s*(\'|\")(.*?)\\1[^>]*?\/?\s*>/i","<a href='\${2}' target='_blank'>\${0}</a>",$activity->intro);
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
     * 批量上传活动
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."activity".DS."import".DS."activity$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Activity::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $activity) {
                        $activity=new Activity($activity);
                        if (isset($activity->start_time))$activity->start_time=UtilDateTime::dateToTimestamp(UtilExcel::exceltimtetophp($activity->start_time));
                        if (isset($activity->end_time))$activity->end_time=UtilDateTime::dateToTimestamp(UtilExcel::exceltimtetophp($activity->end_time));
                        $activity_id=$activity->getId();
                        if (!empty($activity_id)){
                            $hadActivity=Activity::existByID($activity->getId());
                            if ($hadActivity){
                                $result=$activity->update();
                            }else{
                                $result=$activity->save();
                            }
                        }else{
                            $result=$activity->save();
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
     * 导出活动
     * @param mixed $filter
     */
    public function exportActivity($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Activity::get($filter);
        $arr_output_header= self::fieldsMean(Activity::tablename());
        foreach ($data as $activity) {
            if ($activity->start_time)$activity["start_time"]=UtilDateTime::timestampToDateTime($activity->start_time);
            if ($activity->end_time)$activity["end_time"]=UtilDateTime::timestampToDateTime($activity->end_time);
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."activity".DS."export".DS."activity$diffpart.xls";
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."activity/export/activity$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }
}
?>
