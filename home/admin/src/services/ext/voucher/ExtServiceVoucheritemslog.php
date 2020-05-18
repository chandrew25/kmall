<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:卡券兑换日志表<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceVoucheritemslog extends ServiceBasic
{
    /**
     * 保存数据对象:卡券兑换日志表
     * @param array|DataObject $voucheritemslog
     * @return int 保存对象记录的ID标识号
     */
    public function save($voucheritemslog)
    {
        if (is_array($voucheritemslog)){
            $voucheritemslogObj=new Voucheritemslog($voucheritemslog);
        }
        if ($voucheritemslogObj instanceof Voucheritemslog){
            $data=$voucheritemslogObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :卡券兑换日志表
     * @param array|DataObject $voucheritemslog
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($voucheritemslog)
    {
        if (is_array($voucheritemslog)){
            $voucheritemslogObj=new Voucheritemslog($voucheritemslog);
        }
        if ($voucheritemslogObj instanceof Voucheritemslog){
            $data=$voucheritemslogObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:卡券兑换日志表的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Voucheritemslog::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:卡券兑换日志表分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:卡券兑换日志表分页查询列表
     */
    public function queryPageVoucheritemslog($formPacket=null)
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
        $count=Voucheritemslog::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Voucheritemslog::queryPage($start,$limit,$condition);
            foreach ($data as $voucheritemslog) {
                if ($voucheritemslog->voucher_id){
                    $voucher_instance=Voucher::get_by_id($voucheritemslog->voucher_id);
                    $voucheritemslog['voucher_name']=$voucher_instance->voucher_name;
                }
                if ($voucheritemslog->voucheritems_id){
                    $voucheritems_instance=Voucheritems::get_by_id($voucheritemslog->voucheritems_id);
                    $voucheritemslog['vi_key']=$voucheritems_instance->vi_key;
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
     * 批量上传卡券兑换日志表
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."voucheritemslog".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."voucheritemslog$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Voucheritemslog::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $voucheritemslog) {
                        if (!is_numeric($voucheritemslog["voucher_id"])){
                            $voucher=Voucher::get_one("voucher_name='".$voucheritemslog["voucher_id"]."'");
                            if ($voucher) $voucheritemslog["voucher_id"]=$voucher->voucher_id;
                        }
                        if (!is_numeric($voucheritemslog["voucheritems_id"])){
                            $voucheritems=Voucheritems::get_one("name='".$voucheritemslog["voucheritems_id"]."'");
                            if ($voucheritems) $voucheritemslog["voucheritems_id"]=$voucheritems->voucheritems_id;
                        }
                        $voucheritemslog=new Voucheritemslog($voucheritemslog);
                        $voucheritemslog_id=$voucheritemslog->getId();
                        if (!empty($voucheritemslog_id)){
                            $hadVoucheritemslog=Voucheritemslog::existByID($voucheritemslog->getId());
                            if ($hadVoucheritemslog){
                                $result=$voucheritemslog->update();
                            }else{
                                $result=$voucheritemslog->save();
                            }
                        }else{
                            $result=$voucheritemslog->save();
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
     * 导出卡券兑换日志表
     * @param mixed $filter
     */
    public function exportVoucheritemslog($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Voucheritemslog::get($filter);
        $arr_output_header= self::fieldsMean(Voucheritemslog::tablename()); 
        foreach ($data as $voucheritemslog) {
            if ($voucheritemslog->voucher_id){
                $voucher_instance=Voucher::get_by_id($voucheritemslog->voucher_id);
                $voucheritemslog['voucher_id']=$voucher_instance->voucher_name;
            }
            if ($voucheritemslog->voucheritems_id){
                $voucheritems_instance=Voucheritems::get_by_id($voucheritemslog->voucheritems_id);
                $voucheritemslog['voucheritems_id']=$voucheritems_instance->vi_key;
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."voucheritemslog".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."voucheritemslog$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."voucheritemslog/export/voucheritemslog$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>