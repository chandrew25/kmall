<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:会员评论<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceComment extends ServiceBasic
{
	/**
	 * 保存数据对象:会员评论
	 * @param array|DataObject $comment
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($comment)
	{
		if (isset($comment["isShow"])&&($comment["isShow"]=='1'))$comment["isShow"]=true; else $comment["isShow"]=false;
		if (is_array($comment)){
			$commentObj=new Comment($comment);
		}
		if ($commentObj instanceof Comment){
			$data=$commentObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 更新数据对象 :会员评论
	 * @param array|DataObject $comment
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($comment)
	{
		if (isset($comment["isShow"])&&($comment["isShow"]=='1'))$comment["isShow"]=true; else $comment["isShow"]=false;
		if (is_array($comment)){
			$commentObj=new Comment($comment);
		}
		if ($commentObj instanceof Comment){
			$data=$commentObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 根据主键删除数据对象:会员评论的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4 
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Comment::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		); 
	}
    
    /**
     * 根据主键显示数据对象:课程的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否显示成功；true为操作正常
     */
    public function showByIds($ids)
    {
        foreach($ids as $id){
            $data=Comment::get_by_id($id);
            $data->isShow=true;
            $data->update();
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }
    /**
     * 根据主键隐藏数据对象:课程的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否隐藏成功；true为操作正常
     */
    public function hideByIds($ids)
    {
        foreach($ids as $id){
            $data=Comment::get_by_id($id);
            $data->isShow=false;
            $data->update();
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }
    

	/**
	 * 数据对象:会员评论分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:会员评论分页查询列表
	 */
	public function queryPageComment($formPacket=null)
	{
		$start=1;
		$limit=10;
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
		$count=Comment::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Comment::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Comment::propertyShow($data,array('comment_rank'));
			}
			foreach ($data as $comment) {
				$member=Member::get_by_id($comment->member_id);
				$comment['username']=$member->username;
			}
			foreach ($data as $comment) {
				$product=Product::get_by_id($comment->product_id);
				$comment['product_name']=$product->product_name;
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
	 * 批量上传会员评论
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."comment".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."comment$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Comment::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $comment) {
						$comment=new Comment($comment);
						if (!EnumCommentRank::isEnumValue($comment["comment_rank"])){
							$comment["comment_rank"]=EnumCommentRank::comment_rankByShow($comment["comment_rank"]);
						}
						$comment_id=$comment->getId();
						if (!empty($comment_id)){
							$hadComment=Comment::get_by_id($comment->getId());
							if ($hadComment!=null){
								$result=$comment->update();
							}else{
								$result=$comment->save();
							}
						}else{
							$result=$comment->save();
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
	 * 导出会员评论
	 * @param mixed $filter
	 */
	public function exportComment($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Comment::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Comment::propertyShow($data,array('comment_rank'));
		}
		$arr_output_header= self::fieldsMean(Comment::tablename()); 
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."comment".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."comment$diffpart.xls"; 
		UtilFileSystem::createDir(dirname($outputFileName)); 
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
		$downloadPath  =Gc::$attachment_url."comment/export/comment$diffpart.xls"; 
		return array(
			'success' => true,
			'data'    => $downloadPath
		); 
	}
}
?>