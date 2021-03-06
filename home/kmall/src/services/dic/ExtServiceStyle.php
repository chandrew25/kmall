<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:风格<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceStyle extends ServiceBasic
{
    /**
     * 保存数据对象:风格
     * @param array|DataObject $style
     * @return int 保存对象记录的ID标识号
     */
    public function save($style)
    {
        if (isset($style["isShow"])&&($style["isShow"]=='1'))$style["isShow"]=true; else $style["isShow"]=false;
        if (is_array($style)){
            $styleObj=new Style($style);
        }
        if ($styleObj instanceof Style){
            $data=$styleObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :风格
     * @param array|DataObject $style
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($style)
    {
        if (isset($style["isShow"])&&($style["isShow"]=='1'))$style["isShow"]=true; else $style["isShow"]=false;
        if (is_array($style)){
            $styleObj=new Style($style);
        }
        if ($styleObj instanceof Style){
            $data=$styleObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:风格的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Style::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:风格分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:风格分页查询列表
     */
    public function queryPageStyle($formPacket=null)
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
        $count=Style::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Style::queryPage($start,$limit,$condition);
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
     * 批量上传风格
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."style".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."style$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Style::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $style) {
                        $style=new Style($style);
                        $style_id=$style->getId();
                        if (!empty($style_id)){
                            $hadStyle=Style::existByID($style->getId());
                            if ($hadStyle!=null){
                                $result=$style->update();
                            }else{
                                $result=$style->save();
                            }
                        }else{
                            $result=$style->save();
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
     * 导出风格
     * @param mixed $filter
     */
    public function exportStyle($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Style::get($filter);
        $arr_output_header= self::fieldsMean(Style::tablename()); 
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."style".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."style$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."style/export/style$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>