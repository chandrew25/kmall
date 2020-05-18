<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:动态首页<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceIndexpage extends ServiceBasic
{
    /**
     * 保存数据对象:动态首页
     * @param array|DataObject $indexpage
     * @return int 保存对象记录的ID标识号
     */
    public function save($indexpage)
    {
        if (isset($indexpage["isShow"])&&($indexpage["isShow"]=='1'))$indexpage["isShow"]=true; else $indexpage["isShow"]=false;
        if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"imageUpload","image");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){ 
                    $indexpage["image"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($indexpage)){
            $indexpageObj=new Indexpage($indexpage);
        }
        if ($indexpageObj instanceof Indexpage){
            $data=$indexpageObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :动态首页
     * @param array|DataObject $indexpage
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($indexpage)
    {
        if (isset($indexpage["isShow"])&&($indexpage["isShow"]=='1'))$indexpage["isShow"]=true; else $indexpage["isShow"]=false;
        if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"imageUpload","image");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){ 
                    $indexpage["image"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($indexpage)){
            $indexpageObj=new Indexpage($indexpage);
        }
        if ($indexpageObj instanceof Indexpage){
            $data=$indexpageObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }


    /**
     * 上传动态首页图片文件
     */
    public function uploadImg($files,$uploadFlag,$upload_dir)
    {
        $diffpart=date("YmdHis");
        $result="";
        if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
            $tmptail = end(explode('.', $files[$uploadFlag]["name"]));
            $uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."indexpage".DIRECTORY_SEPARATOR.$upload_dir.DIRECTORY_SEPARATOR.$diffpart.".".$tmptail;
            $result     =UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
            if ($result&&($result['success']==true)){
                $result['file_name']="indexpage/$upload_dir/$diffpart.$tmptail";
            }else{
                return $result;
            }
        }
        return $result;
    }
    /**
     * 根据主键删除数据对象:动态首页的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Indexpage::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:动态首页分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:动态首页分页查询列表
     */
    public function queryPageIndexpage($formPacket=null)
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
        $count=Indexpage::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Indexpage::queryPage($start,$limit,$condition);
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
     * 批量上传动态首页
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."indexpage".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."indexpage$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Indexpage::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $indexpage) {
                        $indexpage=new Indexpage($indexpage);
                        $indexpage_id=$indexpage->getId();
                        if (!empty($indexpage_id)){
                            $hadIndexpage=Indexpage::existByID($indexpage->getId());
                            if ($hadIndexpage!=null){
                                $result=$indexpage->update();
                            }else{
                                $result=$indexpage->save();
                            }
                        }else{
                            $result=$indexpage->save();
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
     * 导出动态首页
     * @param mixed $filter
     */
    public function exportIndexpage($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Indexpage::get($filter);
        $arr_output_header= self::fieldsMean(Indexpage::tablename()); 
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."indexpage".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."indexpage$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."indexpage/export/indexpage$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>