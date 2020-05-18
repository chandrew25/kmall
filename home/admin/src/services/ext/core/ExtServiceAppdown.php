<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:应用下载<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceAppdown extends ServiceBasic
{
    /**
     * 保存数据对象:应用下载
     * @param array|DataObject $appdown
     * @return int 保存对象记录的ID标识号
     */
    public function save($appdown)
    {
         if (isset($appdown["isFree"])&&($appdown["isFree"]=='1'))$appdown["isFree"]=true; else $appdown["isFree"]=false;
        if (isset($appdown["isShow"])&&($appdown["isShow"]=='1'))$appdown["isShow"]=true; else $appdown["isShow"]=false;
        if (isset($appdown["isHotrecommend"])&&($appdown["isHotrecommend"]=='1'))$appdown["isHotrecommend"]=true; else $appdown["isHotrecommend"]=false;
        if (isset($appdown["publishtime"]))$appdown["publishtime"]=UtilDateTime::dateToTimestamp($appdown["publishtime"]);
        if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"imageUpload","image");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){ 
                    $appdown["image"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (!empty($_FILES)&&!empty($_FILES["icoUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"icoUpload","ico");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){ 
                    $appdown["ico"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($appdown)){
            $appdownObj=new Appdown($appdown);
        }
        if ($appdownObj instanceof Appdown){
            $data=$appdownObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :应用下载
     * @param array|DataObject $appdown
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($appdown)
    {
        if (isset($appdown["isFree"])&&($appdown["isFree"]=='1'))$appdown["isFree"]=true; else $appdown["isFree"]=false;
        if (isset($appdown["isShow"])&&($appdown["isShow"]=='1'))$appdown["isShow"]=true; else $appdown["isShow"]=false;
        if (isset($appdown["isHotrecommend"])&&($appdown["isHotrecommend"]=='1'))$appdown["isHotrecommend"]=true; else $appdown["isHotrecommend"]=false;
        if (isset($appdown["publishtime"]))$appdown["publishtime"]=UtilDateTime::dateToTimestamp($appdown["publishtime"]);
        if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"imageUpload","image");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){ 
                    $appdown["image"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (!empty($_FILES)&&!empty($_FILES["icoUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"icoUpload","ico");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){ 
                    $appdown["ico"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($appdown)){
            $appdownObj=new Appdown($appdown);
        }
        if ($appdownObj instanceof Appdown){
            $data=$appdownObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:应用下载的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Appdown::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:应用下载分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:应用下载分页查询列表
     */
    public function queryPageAppdown($formPacket=null)
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
        $count=Appdown::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Appdown::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Appdown::propertyShow($data,array('recommendlevel','type'));
            }
            foreach ($data as $appdown) {
                if ($appdown->publishtime)$appdown["publishtime"]=UtilDateTime::timestampToDateTime($appdown->publishtime);
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
     * 上传应用下载图片文件
     */
    public function uploadImg($files,$uploadFlag,$upload_dir)
    {
        $diffpart=date("YmdHis");
        $result="";
        if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
            $tmptail = end(explode('.', $files[$uploadFlag]["name"]));
            $uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."appdown".DIRECTORY_SEPARATOR.$upload_dir.DIRECTORY_SEPARATOR.$diffpart.".".$tmptail;
            $result     =UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
            if ($result&&($result['success']==true)){
                $result['file_name']="appdown/$upload_dir/$diffpart.$tmptail";
            }else{
                return $result;
            }
        }
        return $result;
    }
    
    /**
     * 上传应用文件
     */
    public function uploadAppfile($files,$appdown_id)
    {
        $diffpart=date("YmdHis");
        $success=false;
        if (!empty($files["upload_file"])){
            $tmptail=end(explode('.', $files["upload_file"]["name"]));
            $filepath="app".DIRECTORY_SEPARATOR."app$diffpart.$tmptail";
            $uploadPath=GC::$upload_path.$filepath;
            $result=UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                	$success=true;
                	//修改应用文件路径
                	$app=Appdown::get_by_id($appdown_id);
                	if($app){
                		//删除旧文件
                		$old_file=GC::$upload_path.str_replace("/",DIRECTORY_SEPARATOR,$app->filepath);
                		if(file_exists($old_file)){
                			@unlink($old_file);
						}
                		$app->filepath=str_replace(DIRECTORY_SEPARATOR,"/",$filepath);
                		$app->docsize=$files["upload_file"]["size"];
                		$app->update();
					}
                }
            }else{
                return $result;
            }
        }else{
        	$msg="无上传文件";
		}
        return array(
            'success' => $success,
            'msg'    => $msg
        );
    }
    
    /**
     * 批量上传应用下载
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."appdown".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."appdown$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Appdown::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $appdown) {
                        $appdown=new Appdown($appdown);
                        if (!EnumRecommendlevel::isEnumValue($appdown->recommendlevel)){
                            $appdown->recommendlevel=EnumRecommendlevel::recommendlevelByShow($appdown->recommendlevel);
                        }
                        if (!EnumAppdownType::isEnumValue($appdown->type)){
                            $appdown->type=EnumAppdownType::typeByShow($appdown->type);
                        }
                        if (isset($appdown->publishtime))$appdown->publishtime=UtilDateTime::dateToTimestamp(UtilExcel::exceltimtetophp($appdown->publishtime));
                        $appdown_id=$appdown->getId();
                        if (!empty($appdown_id)){
                            $hadAppdown=Appdown::existByID($appdown->getId());
                            if ($hadAppdown!=null){
                                $result=$appdown->update();
                            }else{
                                $result=$appdown->save();
                            }
                        }else{
                            $result=$appdown->save();
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
     * 导出应用下载
     * @param mixed $filter
     */
    public function exportAppdown($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Appdown::get($filter);
        if ((!empty($data))&&(count($data)>0))
        {
            Appdown::propertyShow($data,array('recommendlevel','type'));
        }
        $arr_output_header= self::fieldsMean(Appdown::tablename()); 
        foreach ($data as $appdown) {
            if ($appdown->recommendlevelShow){
                $appdown['recommendlevel']=$appdown->recommendlevelShow;
            }
            if ($appdown->typeShow){
                $appdown['type']=$appdown->typeShow;
            }
            if ($appdown->publishtime)$appdown["publishtime"]=UtilDateTime::timestampToDateTime($appdown->publishtime);
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."appdown".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."appdown$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."appdown/export/appdown$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>