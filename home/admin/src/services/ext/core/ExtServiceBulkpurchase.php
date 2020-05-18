<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:大宗采购<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceBulkpurchase extends ServiceBasic
{
    /**
     * 保存数据对象:大宗采购
     * @param array|DataObject $bulkpurchase
     * @return int 保存对象记录的ID标识号
     */
    public function save($bulkpurchase)
    {
        if (isset($bulkpurchase["isolve"])&&($bulkpurchase["isolve"]=='1'))$bulkpurchase["isolve"]=true; else $bulkpurchase["isolve"]=false;
        if (is_array($bulkpurchase)){
            $bulkpurchaseObj=new Bulkpurchase($bulkpurchase);
        }
        if ($bulkpurchaseObj instanceof Bulkpurchase){
            $data=$bulkpurchaseObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :大宗采购
     * @param array|DataObject $bulkpurchase
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($bulkpurchase)
    {
        if (isset($bulkpurchase["isolve"])&&($bulkpurchase["isolve"]=='1'))$bulkpurchase["isolve"]=true; else $bulkpurchase["isolve"]=false;
        if (is_array($bulkpurchase)){
            $bulkpurchaseObj=new Bulkpurchase($bulkpurchase);
        }
        if ($bulkpurchaseObj instanceof Bulkpurchase){
            $data=$bulkpurchaseObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:大宗采购的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Bulkpurchase::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:大宗采购分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:大宗采购分页查询列表
     */
    public function queryPageBulkpurchase($formPacket=null)
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
        $count=Bulkpurchase::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Bulkpurchase::queryPage($start,$limit,$condition);
            foreach ($data as $bulkpurchase) {
                if ($bulkpurchase->product_id){
                    $product_instance=Product::get_by_id($bulkpurchase->product_id);
                    $bulkpurchase['product_name']=$product_instance->product_name;
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
     * 批量上传大宗采购
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."bulkpurchase".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."bulkpurchase$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Bulkpurchase::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $bulkpurchase) {
                        if (!is_numeric($bulkpurchase["product_id"])){
                            $product=Product::get_one("product_name='".$bulkpurchase["product_id"]."'");
                            if ($product) $bulkpurchase["product_id"]=$product->product_id;
                        }
                        $bulkpurchase=new Bulkpurchase($bulkpurchase);
                        $bulkpurchase_id=$bulkpurchase->getId();
                        if (!empty($bulkpurchase_id)){
                            $hadBulkpurchase=Bulkpurchase::existByID($bulkpurchase->getId());
                            if ($hadBulkpurchase!=null){
                                $result=$bulkpurchase->update();
                            }else{
                                $result=$bulkpurchase->save();
                            }
                        }else{
                            $result=$bulkpurchase->save();
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
     * 导出大宗采购
     * @param mixed $filter
     */
    public function exportBulkpurchase($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Bulkpurchase::get($filter);
        $arr_output_header= self::fieldsMean(Bulkpurchase::tablename()); 
        foreach ($data as $bulkpurchase) {
            if ($bulkpurchase->product_id){
                $product_instance=Product::get_by_id($bulkpurchase->product_id);
                $bulkpurchase['product_id']=$product_instance->product_name;
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."bulkpurchase".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."bulkpurchase$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."bulkpurchase/export/bulkpurchase$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>