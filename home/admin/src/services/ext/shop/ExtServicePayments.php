<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:支付<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServicePayments extends ServiceBasic
{
	/**
	 * 保存数据对象:支付
	 * @param array|DataObject $payments
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($payments)
	{
		if (is_array($payments)){
			$paymentsObj=new Payments($payments);
		}
		if ($paymentsObj instanceof Payments){
			$data=$paymentsObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :支付
	 * @param array|DataObject $payments
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($payments)
	{
		if (!EnumPaymentsStatus::isEnumValue($payments["status"])){
			$payments["status"]=EnumPaymentsStatus::statusByShow($payments["status"]);
		}
		if (is_array($payments)){
			$paymentsObj=new Payments($payments);
		}
		if ($paymentsObj instanceof Payments){
			$data=$paymentsObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:支付的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Payments::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:支付分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:支付分页查询列表
	 */
	public function queryPagePayments($formPacket=null)
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
		$count=Payments::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Payments::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Payments::propertyShow($data,array('status'));
			}
			foreach ($data as $payments) {
				$order=Order::get_by_id($payments->order_id);
				$payments['order_no']=$order->order_no;
				$member=Member::get_by_id($payments->member_id);
				$payments['username']=$member->username;
				$paymenttype=Paymenttype::get_by_id($payments->pay_type);
				$payments['name']=$paymenttype->name;
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
	 * 批量上传支付
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."payments" . DS . "import" . DS . "payments$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Payments::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $payments) {
						$payments=new Payments($payments);
						if (!EnumPaymentsStatus::isEnumValue($payments["status"])){
							$payments["status"]=EnumPaymentsStatus::statusByShow($payments["status"]);
						}
						$payments_id=$payments->getId();
						if (!empty($payments_id)){
							$hadPayments=Payments::get_by_id($payments->getId());
							if ($hadPayments!=null){
								$result=$payments->update();
							}else{
								$result=$payments->save();
							}
						}else{
							$result=$payments->save();
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
	 * 导出支付
	 * @param mixed $filter
	 */
	public function exportPayments($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Payments::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Payments::propertyShow($data,array('status'));
		}
		$arr_output_header= self::fieldsMean(Payments::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."payments" . DS . "export" . DS . "payments$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."payments/export/payments$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
