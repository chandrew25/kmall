<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:秒杀商品<br/>
 +---------------------------------------
 * @category bonli
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceSeckill extends ServiceBasic
{
    /**
     * 保存数据对象:秒杀商品
     * @param array|DataObject $seckill
     * @return int 保存对象记录的ID标识号
     */
    public function save($seckill)
    {
        if (is_array($seckill)){
            $seckillObj=new Seckill($seckill);
            $seckillproductObj=new Seckillproduct($seckill);
            $seckillproductObj->seckillproduct_id=null;
        }
        if ($seckillObj instanceof Seckill){
            //在存储数据前对数据做判断
            $begin = $seckillObj->begin_datetime;
            $end = $seckillObj->end_datetime;
            $flag = true;

            if($begin>=$end){
                $flag = false;
                $msg = '结束时间必须大于开始时间';
            }

            // //检查商品是否参与了团购活动
            // $groupbuys = Groupbuy::get("goods_id = $seckillObj->goods_id");
            // if(isset($groupbuys)){
            //     foreach ($groupbuys as $v){
            //         if($this->isMix($v->begin_datetime,$v->end_datetime,$begin,$end)){
            //             $flag = false;
            //             $msg = '所选商品正参与同时期的团购活动，请重新选择商品或活动起始时间';
            //         }
            //     }
            // }
            //检查同时期是否还有其他正在进行的秒杀
            // $seckills = Seckill::get();
            // foreach ($seckills as $v){
            //     if($this->isMix($v->begin_datetime,$v->end_datetime,$begin,$end)){
            //         $flag = false;
            //         $msg = '同时间段已有正在进行的秒杀，请重新选择开始和结束时间';
            //     }
            // }
            if($flag){
                $seckillObj->commitTime = time();
                $data=$seckillObj->save();

                $seckillproductObj->seckill_id = $seckillObj->seckill_id;
                $seckillproductObj->bought_num = 0;
                $data=$seckillproductObj->save();
            }else{
                return array(
                        'failure' => true,
                        'msg'     =>$msg
                );
            }
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
     * @param array|DataObject $seckill
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($seckill)
    {
        if (is_array($seckill)){
            $seckillObj=new Seckill($seckill);
            $seckillproductObj=new Seckillproduct($seckill);
        }
        if ($seckillObj instanceof Seckill){
        //在存储数据前对数据做判断
            $begin = $seckillObj->begin_datetime;
            $end = $seckillObj->end_datetime;
            $flag = true;
            //检查商品是否参与了团购活动

            if($begin>=$end){
                $flag = false;
                $msg = '结束时间必须大于开始时间';
            }

            // $groupbuys = Groupbuy::get("goods_id = $seckillObj->goods_id");
            // if(isset($groupbuys)){
            //     foreach ($groupbuys as $v){
            //         if($this->isMix($v->begin_datetime,$v->end_datetime,$begin,$end)){
            //             $flag = false;
            //             $msg = '所选商品正参与同时期的团购活动，请重新选择商品或活动起始时间';
            //         }
            //     }
            // }
            //检查同时期是否还有其他正在进行的秒杀
            // $seckills = Seckill::get("seckill_id != $seckillObj->seckill_id");
            // foreach ($seckills as $v){
            // if($this->isMix($v->begin_datetime,$v->end_datetime,$begin,$end)){
            //         $flag = false;
            //         $msg = '同时间段已有正在进行的秒杀，请重新选择开始和结束时间';
            //     }
            // }
            if($flag){
                // $product = Product::get_one("product_id = $seckillObj->product_id");
                // $seckillObj->product_id = $product->product_id;
                $seckillObj->commitTime = time();
                $data=$seckillObj->update();
                $data=$seckillproductObj->update();
            }else{
                return array(
                        'failure' => true,
                        'msg'     =>$msg
                );
            }
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 根据传递的两组时间段判断这两者之间是否有交集
     * @param
     * @return boolen 是否有交集；true代表有交集
     */
    private function isMix($b1,$e1,$b2,$e2){
        $b1 = strtotime($b1);
        $e1 = strtotime($e1);
        $b2 = strtotime($b2);
        $e2 = strtotime($e2);
        $s = $b2 - $b1;
        if($s > 0){
            $s2 = $b2 - $e1;
            if($s2 >0){
                return false;
            }else{
                return true;
            }
        }else{
            $s2 = $b1 - $e2;
            if($s2 >0){
                return false;
            }else{
                return true;
            }
        }
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
        $data=Seckill::deleteByIds($ids);
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
    public function queryPageSeckill($formPacket=null)
    {
        // var_dump($formPacket);
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
        $count=Seckill::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Seckill::queryPage($start,$limit,$condition);
            foreach ($data as $seckill) {
                $seckillproduct = Seckillproduct::get_one("seckill_id=" . $seckill->seckill_id);
                if ($seckillproduct){
                    if ($seckillproduct->product_id){
                        $product_instance=Product::get_by_id($seckillproduct->product_id);
                        $seckill['product_id']=$product_instance->product_id;
                        $seckill['product_name']=$product_instance->product_name;
                        $seckill['product_code']=$product_instance->product_code;
                        $seckill['goods_no']=$product_instance->goods_no;
                    }
                    if ($seckillproduct->goods_id){
                        $goods_instance=Goods::get_by_id($seckillproduct->goods_id);
                        $seckill['goods_name']=$goods_instance->goods_name;
                        $seckill['goods_code']=$goods_instance->goods_code;

                    }
                    $seckill['seckillproduct_id']=$seckillproduct->seckillproduct_id;
                    $seckill['price']=$seckillproduct->price;
                    $seckill['jifen']=$seckillproduct->jifen;
                    $seckill['sec_num']=$seckillproduct->sec_num;
                    $seckill['limit_num']=$seckillproduct->limit_num;
                }
            }
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        if(!empty($data)){
           foreach ($data as $v) {
                $product = $v->product;
                if($product->isUp){
                    $v->isUp = "是";
                }else{
                    $v->isUp = "否";
                }
            }
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
            $uploadPath =GC::$attachment_path."seckill".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."seckill$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Seckill::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $seckill) {
                        if (!is_numeric($seckill["product_id"])){
                            $product=Product::get_one("product_name='".$seckill["product_id"]."'");
                            if ($product) $seckill["product_id"]=$product->product_id;
                        }
                        if (!is_numeric($seckill["goods_id"])){
                            $goods=Goods::get_one("goods_code='".$seckill["goods_id"]."'");
                            if ($goods) $seckill["goods_id"]=$goods->goods_id;
                        }
                        $seckill=new Seckill($seckill);
                        $seckill_id=$seckill->getId();
                        if (!empty($seckill_id)){
                            $hadSeckill=Seckill::existByID($seckill->getId());
                            if ($hadSeckill){
                                $result=$seckill->update();
                            }else{
                                $result=$seckill->save();
                            }
                        }else{
                            $result=$seckill->save();
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
    public function exportSeckill($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Seckill::get($filter);
        $arr_output_header= self::fieldsMean(Seckill::tablename());
        foreach ($data as $seckill) {
            if ($seckill->product_id){
                $product_instance=Product::get_by_id($seckill->product_id);
                $seckill['product_id']=$product_instance->product_name;
            }
            if ($seckill->goods_id){
                $goods_instance=Goods::get_by_id($seckill->goods_id);
                $seckill['goods_id']=$goods_instance->goods_name;
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."seckill".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."seckill$diffpart.xls";
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."seckill/export/seckill$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }
}
?>
