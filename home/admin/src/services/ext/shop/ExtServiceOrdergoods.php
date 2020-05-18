<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:订购商品<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceOrdergoods extends ServiceBasic
{
    /**
     * 保存数据对象:订购商品
     * @param array|DataObject $ordergoods
     * @return int 保存对象记录的ID标识号
     */
    public function save($ordergoods)
    {
        if (is_array($ordergoods)){
            $ordergoodsObj=new Ordergoods($ordergoods);
        }
        if ($ordergoodsObj instanceof Ordergoods){
            $data=$ordergoodsObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :订购商品
     * @param array|DataObject $ordergoods
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($ordergoods)
    {
        if (is_array($ordergoods)){
            $ordergoodsObj=new Ordergoods($ordergoods);
        }
        if ($ordergoodsObj instanceof Ordergoods){
            $data=$ordergoodsObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:订购商品的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Ordergoods::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:订购商品分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:订购商品分页查询列表
     */
    public function queryPageOrdergoods($formPacket=null)
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
        $count=Ordergoods::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Ordergoods::queryPage($start,$limit,$condition);
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
     * 批量上传订购商品
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."ordergoods".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."ordergoods$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Ordergoods::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $ordergoods) {
                        $ordergoods=new Ordergoods($ordergoods);
                        $ordergoods_id=$ordergoods->getId();
                        if (!empty($ordergoods_id)){
                            $hadOrdergoods=Ordergoods::existByID($ordergoods->getId());
                            if ($hadOrdergoods!=null){
                                $result=$ordergoods->update();
                            }else{
                                $result=$ordergoods->save();
                            }
                        }else{
                            $result=$ordergoods->save();
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
     * 导出订购商品
     * @param mixed $filter
     */
    public function exportOrdergoods($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Ordergoods::get($filter);
        $arr_output_header= self::fieldsMean(Ordergoods::tablename()); 
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."ordergoods".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."ordergoods$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."ordergoods/export/ordergoods$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>