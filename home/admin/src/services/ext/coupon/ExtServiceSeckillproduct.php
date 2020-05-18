<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:秒杀商品<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceSeckillproduct extends ServiceBasic
{
    /**
     * 保存数据对象:秒杀商品
     * @param array|DataObject $seckillproduct
     * @return int 保存对象记录的ID标识号
     */
    public function save($seckillproduct)
    {
        if (is_array($seckillproduct)){
            $seckillproductObj=new Seckillproduct($seckillproduct);
        }
        if ($seckillproductObj instanceof Seckillproduct){
            $data=$seckillproductObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 更新数据对象 :秒杀商品
     * @param array|DataObject $seckillproduct
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($seckillproduct)
    {
        if (is_array($seckillproduct)){
            $seckillproductObj=new Seckillproduct($seckillproduct);
        }
        if ($seckillproductObj instanceof Seckillproduct){
            $data=$seckillproductObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 根据主键删除数据对象:秒杀商品的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Seckillproduct::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 数据对象:秒杀商品分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:秒杀商品分页查询列表
     */
    public function queryPageSeckillproduct($formPacket=null)
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
        $count=Seckillproduct::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Seckillproduct::queryPage($start,$limit,$condition);
            foreach ($data as $seckillproduct) {
                if (!empty($seckillproduct->seckill_id)) {
                  $seckill = Seckill::get_by_id($seckillproduct->seckill_id);
                  $seckillproduct->seckill_name = $seckill->seckill_name;
                }
                if (!empty($seckillproduct->product_id)) {
                  $product = Product::get_by_id($seckillproduct->product_id);
                  foreach ($product as $key => $value) {
                      if ($key!='jifen' && $key!="price"){
                          $seckillproduct->{$key}=$value;
                      }
                  }

                  $brand_instance=null;
                  if ($product->brand_id){
                      $brand_instance=Brand::get_by_id($product->brand_id);
                      $seckillproduct['brand_name']=$brand_instance->brand_name;
                  }
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
     * 批量上传秒杀商品
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."seckillproduct".DS."import".DS."seckillproduct$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Seckillproduct::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $seckillproduct) {
                        $seckillproduct=new Seckillproduct($seckillproduct);
                        $seckillproduct_id=$seckillproduct->getId();
                        if (!empty($seckillproduct_id)){
                            $hadSeckillproduct=Seckillproduct::existByID($seckillproduct->getId());
                            if ($hadSeckillproduct){
                                $result=$seckillproduct->update();
                            }else{
                                $result=$seckillproduct->save();
                            }
                        }else{
                            $result=$seckillproduct->save();
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
     * 导出秒杀商品
     * @param mixed $filter
     */
    public function exportSeckillproduct($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Seckillproduct::get($filter);
        $arr_output_header= self::fieldsMean(Seckillproduct::tablename());
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."seckillproduct".DS."export".DS."seckillproduct$diffpart.xls";
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."seckillproduct/export/seckillproduct$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }
}
?>
