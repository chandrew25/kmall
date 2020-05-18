<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:货品表<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceGoods extends ServiceBasic
{
    /**
     * 保存数据对象:货品表
     * @param array|DataObject $goods
     * @return int 保存对象记录的ID标识号
     */
    public function save($goods)
    {
        if (isset($goods["isUp"])&&($goods["isUp"]=='1'))$goods["isUp"]=true; else $goods["isUp"]=false;
        if (isset($goods["isGiveaway"])&&($goods["isGiveaway"]=='1'))$goods["isGiveaway"]=true; else $goods["isGiveaway"]=false;
        if (isset($goods["isShow"])&&($goods["isShow"]=='1'))$goods["isShow"]=true; else $goods["isShow"]=false;
        if (isset($goods["uptime"]))$goods["uptime"]=UtilDateTime::dateToTimestamp($goods["uptime"]);
        if (isset($goods["downtime"]))$goods["downtime"]=UtilDateTime::dateToTimestamp($goods["downtime"]);
        if (is_array($goods)){
            $goodsObj=new Goods($goods);
        }
        if ($goodsObj instanceof Goods){
            $data=$goodsObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :货品表
     * @param array|DataObject $goods
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($goods)
    {
        if (isset($goods["isUp"])&&($goods["isUp"]=='1'))$goods["isUp"]=true; else $goods["isUp"]=false;
        if (isset($goods["isGiveaway"])&&($goods["isGiveaway"]=='1'))$goods["isGiveaway"]=true; else $goods["isGiveaway"]=false;
        if (isset($goods["isShow"])&&($goods["isShow"]=='1'))$goods["isShow"]=true; else $goods["isShow"]=false;
        if (isset($goods["uptime"]))$goods["uptime"]=UtilDateTime::dateToTimestamp($goods["uptime"]);
        if (isset($goods["downtime"]))$goods["downtime"]=UtilDateTime::dateToTimestamp($goods["downtime"]);
        if (is_array($goods)){
            $goodsObj=new Goods($goods);
        }
        if ($goodsObj instanceof Goods){
            $data=$goodsObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:货品表的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Goods::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:货品表分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:货品表分页查询列表
     */
    public function queryPageGoods($formPacket=null)
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
        $count=Goods::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Goods::queryPage($start,$limit,$condition);
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
     * 批量上传货品表
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."goods".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."goods$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Goods::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $goods) {
                        $goods=new Goods($goods);
                        if (isset($goods->uptime))$goods->uptime=UtilDateTime::dateToTimestamp(UtilExcel::exceltimtetophp($goods->uptime));
                        if (isset($goods->downtime))$goods->downtime=UtilDateTime::dateToTimestamp(UtilExcel::exceltimtetophp($goods->downtime));
                        $goods_id=$goods->getId();
                        if (!empty($goods_id)){
                            $hadGoods=Goods::existByID($goods->getId());
                            if ($hadGoods!=null){
                                $result=$goods->update();
                            }else{
                                $result=$goods->save();
                            }
                        }else{
                            $result=$goods->save();
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
     * 导出货品表
     * @param mixed $filter
     */
    public function exportGoods($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Goods::get($filter);
        $arr_output_header= self::fieldsMean(Goods::tablename()); 
        foreach ($data as $goods) {
            if ($goods->uptime)$goods["uptime"]=UtilDateTime::timestampToDateTime($goods->uptime);
            if ($goods->downtime)$goods["downtime"]=UtilDateTime::timestampToDateTime($goods->downtime);
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."goods".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."goods$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."goods/export/goods$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>