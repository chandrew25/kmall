<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:会员等级积分日志<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceRankjifenlog extends ServiceBasic
{
    /**
     * 保存数据对象:会员等级积分日志
     * @param array|DataObject $rankjifenlog
     * @return int 保存对象记录的ID标识号
     */
    public function save($rankjifenlog)
    {
        if (is_array($rankjifenlog)){
            $rankjifenlogObj=new Rankjifenlog($rankjifenlog);
        }
        if ($rankjifenlogObj instanceof Rankjifenlog){
            $data=$rankjifenlogObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :会员等级积分日志
     * @param array|DataObject $rankjifenlog
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($rankjifenlog)
    {
        if (is_array($rankjifenlog)){
            $rankjifenlogObj=new Rankjifenlog($rankjifenlog);
        }
        if ($rankjifenlogObj instanceof Rankjifenlog){
            $data=$rankjifenlogObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:会员等级积分日志的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Rankjifenlog::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:会员等级积分日志分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:会员等级积分日志分页查询列表
     */
    public function queryPageRankjifenlog($formPacket=null)
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
        $count=Rankjifenlog::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Rankjifenlog::queryPage($start,$limit,$condition);
            if ($data==null){
                $data=array();
            }else{
                foreach($data as $key=>$value){
                    $value->commitTime = UtilDateTime::timestampToDateTime($value->commitTime);
                }
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
     * 批量上传会员等级积分日志
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."rankjifenlog".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."rankjifenlog$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Rankjifenlog::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $rankjifenlog) {
                        $rankjifenlog=new Rankjifenlog($rankjifenlog);
                        $rankjifenlog_id=$rankjifenlog->getId();
                        if (!empty($rankjifenlog_id)){
                            $hadRankjifenlog=Rankjifenlog::existByID($rankjifenlog->getId());
                            if ($hadRankjifenlog!=null){
                                $result=$rankjifenlog->update();
                            }else{
                                $result=$rankjifenlog->save();
                            }
                        }else{
                            $result=$rankjifenlog->save();
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
     * 导出会员等级积分日志
     * @param mixed $filter
     */
    public function exportRankjifenlog($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Rankjifenlog::get($filter);
        $arr_output_header= self::fieldsMean(Rankjifenlog::tablename()); 
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."rankjifenlog".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."rankjifenlog$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."rankjifenlog/export/rankjifenlog$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>