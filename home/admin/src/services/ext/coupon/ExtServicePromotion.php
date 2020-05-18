<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:促销活动表<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServicePromotion extends ServiceBasic
{
    /**
     * 保存数据对象:促销活动表
     * @param array|DataObject $promotion
     * @return int 保存对象记录的ID标识号
     */
    public function save($promotion)
    {
        if (isset($promotion["isValid"])&&($promotion["isValid"]=='1'))$promotion["isValid"]=true; else $promotion["isValid"]=false;
        if (isset($promotion["begin_time"]))$promotion["begin_time"]=UtilDateTime::dateToTimestamp($promotion["begin_time"]);
        if (isset($promotion["end_time"]))$promotion["end_time"]=UtilDateTime::dateToTimestamp($promotion["end_time"]);
        if (is_array($promotion)){
            $promotionObj=new Promotion($promotion);
        }
        if ($promotionObj instanceof Promotion){
            $data=$promotionObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :促销活动表
     * @param array|DataObject $promotion
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($promotion)
    {
        if (isset($promotion["isValid"])&&($promotion["isValid"]=='1'))$promotion["isValid"]=true; else $promotion["isValid"]=false;
        if (isset($promotion["begin_time"]))$promotion["begin_time"]=UtilDateTime::dateToTimestamp($promotion["begin_time"]);
        if (isset($promotion["end_time"]))$promotion["end_time"]=UtilDateTime::dateToTimestamp($promotion["end_time"]);
        if (is_array($promotion)){
            $promotionObj=new Promotion($promotion);
        }
        if ($promotionObj instanceof Promotion){
            $data=$promotionObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:促销活动表的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Promotion::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:促销活动表分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:促销活动表分页查询列表
     */
    public function queryPagePromotion($formPacket=null)
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
        $count=Promotion::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Promotion::queryPage($start,$limit,$condition);
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
     * 批量上传促销活动表
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."promotion".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."promotion$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Promotion::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $promotion) {
                        $promotion=new Promotion($promotion);
                        if (isset($promotion->begin_time))$promotion->begin_time=UtilDateTime::dateToTimestamp(UtilExcel::exceltimtetophp($promotion->begin_time));
                        if (isset($promotion->end_time))$promotion->end_time=UtilDateTime::dateToTimestamp(UtilExcel::exceltimtetophp($promotion->end_time));
                        $promotion_id=$promotion->getId();
                        if (!empty($promotion_id)){
                            $hadPromotion=Promotion::existByID($promotion->getId());
                            if ($hadPromotion!=null){
                                $result=$promotion->update();
                            }else{
                                $result=$promotion->save();
                            }
                        }else{
                            $result=$promotion->save();
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
     * 导出促销活动表
     * @param mixed $filter
     */
    public function exportPromotion($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Promotion::get($filter);
        $arr_output_header= self::fieldsMean(Promotion::tablename()); 
        foreach ($data as $promotion) {
            if ($promotion->begin_time)$promotion["begin_time"]=UtilDateTime::timestampToDateTime($promotion->begin_time);
            if ($promotion->end_time)$promotion["end_time"]=UtilDateTime::timestampToDateTime($promotion->end_time);
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."promotion".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."promotion$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."promotion/export/promotion$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>