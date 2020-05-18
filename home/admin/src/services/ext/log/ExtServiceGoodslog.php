<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:产品出入库日志<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceGoodslog extends ServiceBasic
{
    /**
     * 保存数据对象:产品出入库日志
     * @param array|DataObject $goodslog
     * @return int 保存对象记录的ID标识号
     */
    public function save($goodslog)
    {
        if (is_array($goodslog)){
            $goodslogObj=new Goodslog($goodslog);
        }
        if ($goodslogObj instanceof Goodslog){
            $data=$goodslogObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :产品出入库日志
     * @param array|DataObject $goodslog
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($goodslog)
    {
        if (is_array($goodslog)){
            $goodslogObj=new Goodslog($goodslog);
        }
        if ($goodslogObj instanceof Goodslog){
            $data=$goodslogObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:产品出入库日志的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Goodslog::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:产品出入库日志分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:产品出入库日志分页查询列表
     */
    public function queryPageGoodslog($formPacket=null)
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
        
        $count=Goodslog::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Goodslog::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Goodslog::propertyShow($data,array('goodsActionType'));
            }
            foreach ($data as $goodslog) {
                $goodslog->goods_name=Goods::select_one('goods_name',"goods_id=".$goodslog->goods_id);
                if($goodslog['commitTime'])$goodslog->cmTime=UtilDateTime::timestampToDateTime($goodslog['commitTime']);
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
     * 批量上传产品出入库日志
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."goodslog".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."goodslog$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Goodslog::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $goodslog) {
                        $goodslog=new Goodslog($goodslog);
                        if (!EnumGoodsActionType::isEnumValue($goodslog->goodsActionType)){
                            $goodslog->goodsActionType=EnumGoodsActionType::goodsActionTypeByShow($goodslog->goodsActionType);
                        }
                        $goodslog_id=$goodslog->getId();
                        if (!empty($goodslog_id)){
                            $hadGoodslog=Goodslog::existByID($goodslog->getId());
                            if ($hadGoodslog!=null){
                                $result=$goodslog->update();
                            }else{
                                $result=$goodslog->save();
                            }
                        }else{
                            $result=$goodslog->save();
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
     * 导出产品出入库日志
     * @param mixed $filter
     */
    public function exportGoodslog($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Goodslog::get($filter);
        if ((!empty($data))&&(count($data)>0))
        {
            Goodslog::propertyShow($data,array('goodsActionType'));
        }
        $arr_output_header= self::fieldsMean(Goodslog::tablename()); 
        foreach ($data as $goodslog) {
            if ($goodslog->goodsActionTypeShow){
                $goodslog['goodsActionType']=$goodslog->goodsActionTypeShow;
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."goodslog".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."goodslog$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."goodslog/export/goodslog$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>