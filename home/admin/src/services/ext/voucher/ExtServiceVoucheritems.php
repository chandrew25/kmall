<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:兑换券实体表<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceVoucheritems extends ServiceBasic
{
    /**
     * 保存数据对象:兑换券实体表
     * @param array|DataObject $voucheritems
     * @return int 保存对象记录的ID标识号
     */
    public function save($voucheritems)
    {
        if (isset($voucheritems["isExchange"])&&($voucheritems["isExchange"]=='1'))$voucheritems["isExchange"]=true; else $voucheritems["isExchange"]=false;
        if (is_array($voucheritems)){
            $voucheritemsObj=new Voucheritems($voucheritems);
        }
        if ($voucheritemsObj instanceof Voucheritems){
            $data=$voucheritemsObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :兑换券实体表
     * @param array|DataObject $voucheritems
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($voucheritems)
    {
        if (isset($voucheritems["isExchange"])&&($voucheritems["isExchange"]=='1'))$voucheritems["isExchange"]=true; else $voucheritems["isExchange"]=false;
        if (is_array($voucheritems)){
            $voucheritemsObj=new Voucheritems($voucheritems);
        }
        if ($voucheritemsObj instanceof Voucheritems){
            $data=$voucheritemsObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:兑换券实体表的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Voucheritems::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:兑换券实体表分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:兑换券实体表分页查询列表
     */
    public function queryPageVoucheritems($formPacket=null)
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
        $count=Voucheritems::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Voucheritems::queryPage($start,$limit,$condition);
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
     * 批量上传兑换券实体表
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {          
        $voucher_id  = $_POST["voucher_id"];
        $diffpart    = date("YmdHis");
        $success     = false;
        $succcount   = 0;//上传计数
        $repeatcount = 0;//卡券key值重名计数
        $emptycount  = 0;//卡号或者密码为空
        $duplicate   = array();
        $repeatstr   = "";
        if (!empty($files["upload_file"])&&$voucher_id){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."voucheritems".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."voucheritems$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Voucheritems::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);     
                    $vocher=Voucher::get_by_id($voucher_id);
                    if($vocher){
                        foreach ($data as $item) {
		                    $increment = false;
                            $vi_key    = $item["vi_key"];
                            $vi_cipher = $item["vi_cipher"];
                            if($vi_key && $vi_cipher){
                                $isExist = Voucheritems::existBy("vi_key='$vi_key'");
                                if(!$isExist){
                                    $voucheritems=new Voucheritems($item);
                                    $voucheritems_id=$voucheritems->getId();
                                    $voucheritems->voucher_id=$voucher_id;
                                    $voucheritems->isExchange=false;
                                    $voucheritems_id=$voucheritems->save();
                                    if($voucheritems_id){
                                        $succcount ++;
										$increment = true;
                                    }   
                                }else{
                                    $repeatcount++;
                                    $duplicate[] = $vi_key;
                                }
                                if($increment){
                                    Voucher::increment("voucher_id=".$voucher_id,"voucher_num",1);    
                                }
                                if($repeatcount){
                                    $repeatstr = implode(",",$duplicate);
                                }   
                            }else{
                                $emptycount++; 
                            }
                        }
                        $success = true;
                    }
                }
            }
        }
        $info["succcount"]   = $succcount;
        $info["repeatcount"] = $repeatcount;
        $info["repeatstr"]   = $repeatstr;
        $info["emptycount"]  = $emptycount;
        return array(
            'success' => $success,
            'data'    => $info
        );
    }

    /**
     * 导出兑换券实体表
     * @param mixed $filter
     */
    public function exportVoucheritems($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Voucheritems::get($filter);
        $arr_output_header= self::fieldsMean(Voucheritems::tablename()); 
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."voucheritems".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."voucheritems$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."voucheritems/export/voucheritems$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
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
}
?>
