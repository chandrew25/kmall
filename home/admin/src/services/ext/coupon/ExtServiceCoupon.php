<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:优惠券<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceCoupon extends ServiceBasic
{
	/**
	 * 保存数据对象:优惠券
	 * @param array|DataObject $coupon
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($coupon)
	{
		//保存优惠券
		$couponObj=new Coupon();
		$couponObj->coupon_name=$coupon['coupon_name'];
		$couponObj->coupon_key=$coupon['coupon_key'];
		$couponObj->coupon_type=$coupon['coupon_type'];
		if (isset($coupon['begin_time']))$couponObj->begin_time=UtilDateTime::dateToTimestamp($coupon['begin_time']);
		if (isset($coupon['end_time']))$couponObj->end_time=UtilDateTime::dateToTimestamp($coupon['end_time']);
		if (isset($coupon['isValid'])&&($coupon['isValid']=="1"))$couponObj->isValid=true; else $couponObj->isValid=false;
		$couponObj->sort_order=$coupon['sort_order'];
		//保存coupon返回id
		$coupon_id=$couponObj->save();
		//保存优惠券规则
		$preferentialruleObj=new Preferentialrule();
		$preferentialruleObj->classify_type=EnumClassifyType::classify_typeByShow('优惠券');
		$preferentialruleObj->classify_id=$coupon_id;
		if (isset($coupon['begin_time']))$preferentialruleObj->begin_time=UtilDateTime::dateToTimestamp($coupon['begin_time']);
		if (isset($coupon['end_time']))$preferentialruleObj->end_time=UtilDateTime::dateToTimestamp($coupon['end_time']);
		if (isset($coupon['money_lower']))$preferentialruleObj->money_lower=$coupon['money_lower'];
		if (isset($coupon['money_upper']))$preferentialruleObj->money_upper=$coupon['money_upper'];
		$preferentialruleObj->preferential_type=$coupon['preferential_type'];
		if(isset($coupon['limit_reduce']))$preferentialruleObj->limit_reduce=$coupon['limit_reduce'];
		if(isset($coupon['discount']))$preferentialruleObj->discount=$coupon['discount'];
		$preferentialruleObj->prefdescribe=$coupon['prefdescribe'];
		if (isset($coupon['ifEffectall'])&&($coupon['ifEffectall']=="1"))$preferentialruleObj->ifEffectall=true; else $preferentialruleObj->ifEffectall=false;
		//保存preferentialrule返回id
		$preferentialrule_id=$preferentialruleObj->save();
		switch($preferentialruleObj->preferential_type){
			//存储选择商品
			case '1':
				$productids=explode(",",$coupon["selproductitems"]);
				foreach($productids as $product_id){
					if($product_id){
						$prefproduct=new Prefproduct();
						$prefproduct->preferentialrule_id=$preferentialrule_id;
						$prefproduct->product_id=$product_id;
						$prefproduct->save();
					}
				}
			break;
			//存储选择优惠券
			case '2':
				$couponids=explode(",",$coupon["givecouponitems"]);
				foreach($couponids as $coupon_id){
					if($coupon_id){
						$prefcoupon=new Prefcoupon();
						$prefcoupon->preferentialrule_id=$preferentialrule_id;
						$prefcoupon->coupon_id=$coupon_id;
						$prefcoupon->save();
					}
				}
			break;
			//存储选择商品
			case '5':
				$productids=explode(",",$coupon["selproductitems"]);
				foreach($productids as $product_id){
					if($product_id){
						$prefproduct=new Prefproduct();
						$prefproduct->preferentialrule_id=$preferentialrule_id;
						$prefproduct->product_id=$product_id;
						$prefproduct->save();
					}
				}
			break;
			default:
			break;
		}
		return array(
			'success' => true
		);
	}

	/**
	 * 更新数据对象 :优惠券
	 * @param array|DataObject $coupon
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($param)
	{
		//更新优惠券
		$coupon=Coupon::get_by_id($param["coupon_id"]);
		$coupon->coupon_name=$param["coupon_name"];
		if (isset($param['begin_time']))$coupon->begin_time=UtilDateTime::dateToTimestamp($param['begin_time']);
		if (isset($param['end_time']))$coupon->end_time=UtilDateTime::dateToTimestamp($param['end_time']);
		if (isset($param["isValid"])&&($param["isValid"]=='1'))$coupon->isValid=true; else $coupon->isValid=false;
		$coupon->sort_order=$param["sort_order"];
		$coupon->update();
		//更新优惠规则
		$preferentialrule=Preferentialrule::get_one(array("classify_type=".EnumClassifyType::classify_typeByShow('优惠券'),"classify_id=".$coupon->coupon_id));
		if (isset($param['begin_time']))$preferentialrule->begin_time=UtilDateTime::dateToTimestamp($param['begin_time']);
		if (isset($param['end_time']))$preferentialrule->end_time=UtilDateTime::dateToTimestamp($param['end_time']);
		if(isset($param['money_lower']))$preferentialrule->money_lower=$param['money_lower'];
		if(isset($param['money_upper']))$preferentialrule->money_upper=$param['money_upper'];
		if(isset($param['limit_reduce']))$preferentialrule->limit_reduce=$param['limit_reduce'];
		if(isset($param['discount']))$preferentialrule->discount=$param['discount'];
		$preferentialrule->prefdescribe=$param['prefdescribe'];
		if(isset($param['ifEffectall'])&&($param["ifEffectall"]=='1'))$preferentialrule->ifEffectall=true; else $preferentialrule->ifEffectall=false;
		$preferentialrule_id=$preferentialrule->preferentialrule_id;
		//判断优惠规则
		if($preferentialrule->preferential_type!=$param['preferential_type']){
			//删除相关
			switch($preferentialrule->preferential_type){
				//存储选择商品
				case '1':
					Prefproduct::deleteBy("preferentialrule_id=".$preferentialrule_id);
				break;
				//存储选择优惠券
				case '2':
					Prefcoupon::deleteBy("preferentialrule_id=".$preferentialrule_id);
				break;
				//存储选择商品
				case '5':
					Prefproduct::deleteBy("preferentialrule_id=".$preferentialrule_id);
				break;
				default:
				break;
			}
			switch($param['preferential_type']){
				//存储选择商品
				case '1':
					$productids=explode(",",$param["selproductitems"]);
					foreach($productids as $product_id){
						if($product_id){
							$prefproduct=new Prefproduct();
							$prefproduct->preferentialrule_id=$preferentialrule_id;
							$prefproduct->product_id=$product_id;
							$prefproduct->save();
						}
					}
				break;
				//存储选择优惠券
				case '2':
					$couponids=explode(",",$param["givecouponitems"]);
					foreach($couponids as $coupon_id){
						if($coupon_id){
							$prefcoupon=new Prefcoupon();
							$prefcoupon->preferentialrule_id=$preferentialrule_id;
							$prefcoupon->coupon_id=$coupon_id;
							$prefcoupon->save();
						}
					}
				break;
				//存储选择商品
				case '5':
					$productids=explode(",",$coupon["selproductitems"]);
					foreach($productids as $product_id){
						if($product_id){
							$prefproduct=new Prefproduct();
							$prefproduct->preferentialrule_id=$preferentialrule_id;
							$prefproduct->product_id=$product_id;
							$prefproduct->save();
						}
					}
				break;
				default:
				break;
			}
		}else{
			switch($preferentialrule->preferential_type){
				//存储选择商品
				case '1':
					$productids=explode(",",$param["selproductitems"]);
					$hadexist=Prefproduct::get("preferentialrule_id=".$preferentialrule_id);
					foreach($hadexist as $had){
						if(!in_array($had->product_id,$productids)){
							Prefproduct::deleteByID($had->prefproduct_id);
						}else{
							$index=array_keys($productids,$had->product_id);
							unset($productids[$index[0]]);
						}
					}
					foreach($productids as $product_id){
						if($product_id){
							$prefproduct=new Prefproduct();
							$prefproduct->preferentialrule_id=$preferentialrule_id;
							$prefproduct->product_id=$product_id;
							$prefproduct->save();
						}
					}
				break;
				//存储选择优惠券
				case '2':
					$couponids=explode(",",$param["givecouponitems"]);
					$hasexist=Prefcoupon::get("preferentialrule_id=".$preferentialrule_id);
					foreach($hasexist as $had){
						if(!in_array($had->coupon_id,$couponids)){
							Prefcoupon::deleteByID($had->prefcoupon_id);
						}else{
							$index=array_keys($couponids,$had->coupon_id);
							unset($couponids[$index[0]]);
						}
					}
					foreach($couponids as $coupon_id){
						if($coupon_id){
							$prefcoupon=new Prefcoupon();
							$prefcoupon->preferentialrule_id=$preferentialrule_id;
							$prefcoupon->coupon_id=$coupon_id;
							$prefcoupon->save();
						}
					}
				break;
				//存储选择商品
				case '5':
					$productids=explode(",",$param["selproductitems"]);
					$hadexist=Prefproduct::get("preferentialrule_id=".$preferentialrule_id);
					foreach($hadexist as $had){
						if(!in_array($had->product_id,$productids)){
							Prefproduct::deleteByID($had->prefproduct_id);
						}else{
							$index=array_keys($productids,$had->product_id);
							unset($productids[$index[0]]);
						}
					}
					foreach($productids as $product_id){
						if($product_id){
							$prefproduct=new Prefproduct();
							$prefproduct->preferentialrule_id=$preferentialrule_id;
							$prefproduct->product_id=$product_id;
							$prefproduct->save();
						}
					}
				break;
				default:
				break;
			}
		}
		$preferentialrule->preferential_type=$param['preferential_type'];
		$preferentialrule->update();
		return array(
			'success' => true
		);
	}

	/**
	 * 根据主键删除数据对象:优惠券的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$couponids=explode(",",$ids);
		//关联删除
		foreach($couponids as $coupon_id){
			if($coupon_id){
				$preferentialrule=Preferentialrule::get_one((array("classify_type=".EnumClassifyType::classify_typeByShow('优惠券'),"classify_id=".$coupon_id)));
				switch($preferentialrule->preferential_type){
					//删除相关商品
					case '1':
						$flag=Prefproduct::deleteBy("preferentialrule_id=".$preferentialrule->preferentialrule_id);
					break;
					//删除相关优惠券
					case '2':
						$flag=Prefcoupon::deleteBy("preferentialrule_id=".$preferentialrule->preferentialrule_id);
					break;
					default:
					break;
				}
				$flag=Preferentialrule::deleteByID($preferentialrule->preferentialrule_id);
			}
		}
		$data=Coupon::deleteByIds($ids);
		return array(
			'success' => true,
			'data'  => $data
		);
	}

	/**
	 * 判断优惠券号码是否存在 :优惠券号码
	 * @param array|DataObject $coupon
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function check($param)
	{
		$coupon_key=$param["coupon_key"];
		$exist=Coupon::get_one("coupon_key='$coupon_key'");
		if($exist){
			return array(
				'success' => true,
				'exist'  => true
			);
		}else{
			return array(
				'success' => true,
				'exist'  => false
			);
		}
	}

	/**
	 * 数据对象:优惠券表分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *           limit:分页查询数，默认15个。
	 * @return 数据对象:优惠券表分页查询列表
	 */
	public function queryPageCoupon($formPacket=null)
	{
		if ($formPacket->begin_time)$begin_time=UtilDateTime::dateToTimestamp($formPacket->begin_time);
		$formPacket->begin_time=null;
		if ($formPacket->end_time)$end_time=UtilDateTime::dateToTimestamp($formPacket->end_time);
		$formPacket->end_time=null;
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
		if($condition){
			if($begin_time&&$end_time){
				$condition=$condition." and begin_time>=".$begin_time." and end_time<=".$end_time;
			}else if($begin_time){
				$condition=$condition." and begin_time>=".$begin_time;
			}else if($end_time){
				$condition=$condition." and end_time<=".$end_time;
			}
		}else{
			if($begin_time&&$end_time){
				$condition="begin_time>=".$begin_time." and end_time<=".$end_time;
			}else if($begin_time){
				$condition="begin_time>=".$begin_time;
			}else if($end_time){
				$condition="end_time<=".$end_time;
			}
		}
		$count=Coupon::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Coupon::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Coupon::propertyShow($data,array('coupon_type'));
			}
			foreach ($data as $coupon) {
				$coupon->begin_time=UtilDateTime::timestampToDateTime($coupon->begin_time);
				$coupon->end_time=UtilDateTime::timestampToDateTime($coupon->end_time);
				//优惠规则信息
				$preferentialrule=Preferentialrule::get_one(array("classify_type=".EnumClassifyType::classify_typeByShow('优惠券'),"classify_id=".$coupon->coupon_id));
				$coupon->prefdescribe=$preferentialrule->prefdescribe;
				$coupon->money_lower=$preferentialrule->money_lower;
				$coupon->money_upper=$preferentialrule->money_upper;
				$coupon->preferential_type=$preferentialrule->preferential_type;
				$coupon->limit_reduce=$preferentialrule->limit_reduce;
				$coupon->discount=$preferentialrule->discount;
				$coupon->ifEffectall=$preferentialrule->ifEffectall;
				$coupon->preferentialrule_id=$preferentialrule->preferentialrule_id;
				if($preferentialrule->preferential_type==1){
					$prefproduct=Prefproduct::get("preferentialrule_id=".$preferentialrule->preferentialrule_id);
					$productids="";
					$count=0;
					foreach($prefproduct as $selproduct){
						if($selproduct){
							$productids=$productids.$selproduct->product_id.",";
							$count++;
						}
					}
					$coupon->selproductitems=$productids;
					$coupon->selproductitemscount=$count;
				}elseif($preferentialrule->preferential_type==2){
					$prefcoupon=Prefcoupon::get("preferentialrule_id=".$preferentialrule->preferentialrule_id);
					$couponids="";
					$count=0;
					foreach($prefcoupon as $selcoupon){
						if($selcoupon){
							$couponids=$couponids.$selcoupon->coupon_id.",";
							$count++;
						}
					}
					$coupon->givecouponitems=$couponids;
					$coupon->givecouponitemscount=$count;
				}elseif($preferentialrule->preferential_type==5){
					$prefproduct=Prefproduct::get("preferentialrule_id=".$preferentialrule->preferentialrule_id);
					$productids="";
					$count=0;
					foreach($prefproduct as $selproduct){
						if($selproduct){
							$productids=$productids.$selproduct->product_id.",";
							$count++;
						}
					}
					$coupon->selproductitems=$productids;
					$coupon->selproductitemscount=$count;
				}
			}
			if ($data==null)$data=array();
		}else{
			$data=array();
		}
		return array(
			'success' => true,
			'totalCount'=>$count,
			'data'  => $data
		);
	}

	/**
	 * 数据对象:赠送优惠券分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *           limit:分页查询数，默认10个。
	 * @return 数据对象:赠送优惠券分页查询列表
	 */
	public function queryPageSelCoupon($formPacket=null)
	{
		$start=1;
		$limit=15;
		$preferentialrule_id=$formPacket->preferentialrule_id;
		$coupon_id=$formPacket->coupon_id;
		$formPacket->preferentialrule_id=null;
		$formPacket->coupon_id=null;
		$condition=UtilObject::object_to_array($formPacket);
		/**0:全部,1:已选择,2:未选择*/
		if (isset($condition["selectType"]))$selectType=$condition["selectType"];else $selectType=0;
		unset($condition["selectType"]);
		if (isset($condition['start']))$start=$condition['start']+1;
		if (isset($condition['limit']))$limit=$start+$condition['limit']-1;
		unset($condition['start'],$condition['limit']);
		$condition=$this->filtertoCondition($condition);
		switch ($selectType) {
			 case 0:
			if($coupon_id)$remove="coupon_id!=".$coupon_id;
			if($condition&&$remove){
				$condition=$condition." and ".$remove;
			}elseif($remove){
				$condition=$remove;
			}
			 break;
			 case 1:
			if($coupon_id)$remove="a.coupon_id!=".$coupon_id;
			if($condition&&$remove){
				$condition=$condition." and ".$remove;
			}elseif($remove){
				$condition=$remove;
			}
			 break;
			 case 2:
			if($coupon_id)$remove="a.coupon_id!=".$coupon_id;
			if($condition&&$remove){
				$condition=$condition." and ".$remove;
			}elseif($remove){
				$condition=$remove;
			}
			 break;
		}
		switch ($selectType) {
			 case 0:
			 $count=Coupon::count($condition);
			 break;
			 case 1:
			 $sql_child_query="(select coupon_id from ".Prefcoupon::tablename()." where preferentialrule_id=".$preferentialrule_id.")";
			 $sql_count="select count(1) from ".Coupon::tablename()." a,$sql_child_query b where a.coupon_id=b.coupon_id";
			 if (!empty($condition))$sql_count.=" and ".$condition;
			 $count=sqlExecute($sql_count);
			 break;
			 case 2:
			 $sql_child_query=" left join (select coupon_id from ".Prefcoupon::tablename()." where preferentialrule_id=".$preferentialrule_id.")  b on b.coupon_id=a.coupon_id where b.coupon_id is null ";
			 $sql_count="select count(1) from ".Coupon::tablename()." a $sql_child_query ";
			 if (!empty($condition))$sql_count.=" and ".$condition;
			 $count=sqlExecute($sql_count);
			 break;
		}

		if ($count>0){
			if ($limit>$count)$limit=$count;
			switch ($selectType) {
				 case 0:
					 $data =Coupon::queryPage($start,$limit,$condition);
					 break;
				 case 1:
					 $sql_child_query="(select coupon_id from ".Prefcoupon::tablename()." where preferentialrule_id=".$preferentialrule_id.")";
					 $sql_data="select a.* from ".Coupon::tablename()." a,$sql_child_query b where a.coupon_id=b.coupon_id ";
					 if (!empty($condition))$sql_data.=" and ".$condition;
					 if ($start)$start=$start-1;
					 $sql_data.=" limit $start,".($limit-$start+1);
					 $data=sqlExecute($sql_data,"Coupon");
					 break;
				 case 2:
					 $sql_child_query=" left join (select coupon_id from ".Prefcoupon::tablename()." where preferentialrule_id=".$preferentialrule_id.")  b on b.coupon_id=a.coupon_id where b.coupon_id is null ";
					 $sql_data="select a.* from ".Coupon::tablename()." a $sql_child_query ";
					 if (!empty($condition))$sql_data.=" and ".$condition;
					 if ($start)$start=$start-1;
					 $sql_data.=" limit $start,".($limit-$start+1);
					 $data=sqlExecute($sql_data,"Coupon");
					 break;
			}
			Coupon::propertyShow($data,array('coupon_type'));
			foreach ($data as $coupon) {
				if(Prefcoupon::existBy("preferentialrule_id=$preferentialrule_id and coupon_id=".$coupon->coupon_id)){
					 $coupon->isShowCouponCheck=true;
				}
				$preferentialrule=Preferentialrule::get_one(array("classify_type=".EnumClassifyType::classify_typeByShow('优惠券'),"classify_id=".$coupon->coupon_id));
				if ($preferentialrule->begin_time)$coupon->begin_time=UtilDateTime::timestampToDateTime($preferentialrule->begin_time);
				if ($preferentialrule->end_time)$coupon->end_time=UtilDateTime::timestampToDateTime($preferentialrule->end_time);
				$coupon->prefdescribe=$preferentialrule->prefdescribe;
			}
			if ($data==null)$data=array();
		}else{
			$data=array();
		}
		return array(
			'success' => true,
			'totalCount'=>$count,
			'data'  => $data
		);
	}

	/**
	 * 数据对象:作用商品分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *           limit:分页查询数，默认10个。
	 * @return 数据对象:作用商品分页查询列表
	 */
	public function queryPageSelProduct($formPacket=null)
	{
		$start=1;
		$limit=15;
		$preferentialrule_id=$formPacket->preferentialrule_id;
		$formPacket->preferentialrule_id=null;
		$condition=UtilObject::object_to_array($formPacket);
		/**0:全部,1:已选择,2:未选择*/
		if (isset($condition["selectType"]))$selectType=$condition["selectType"];else $selectType=0;
		unset($condition["selectType"]);
		if (isset($condition['start']))$start=$condition['start']+1;
		if (isset($condition['limit']))$limit=$start+$condition['limit']-1;
		unset($condition['start'],$condition['limit']);
		$condition=$this->filtertoCondition($condition);
		switch ($selectType) {
			 case 0:
			 $count=Product::count($condition);
			 break;
			 case 1:
			 $sql_child_query="(select product_id from ".Prefproduct::tablename()." where preferentialrule_id=".$preferentialrule_id.")";
			 $sql_count="select count(1) from ".Product::tablename()." a,$sql_child_query b where a.product_id=b.product_id";
			 if (!empty($condition))$sql_count.=" and ".$condition;
			 $count=sqlExecute($sql_count);
			 break;
			 case 2:
			 $sql_child_query=" left join (select product_id from ".Prefproduct::tablename()." where preferentialrule_id=".$preferentialrule_id.")  b on b.product_id=a.product_id where b.product_id is null ";
			 $sql_count="select count(1) from ".Product::tablename()." a $sql_child_query ";
			 if (!empty($condition))$sql_count.=" and ".$condition;
			 $count=sqlExecute($sql_count);
			 break;
		}

		if ($count>0){
			if ($limit>$count)$limit=$count;
			switch ($selectType) {
				 case 0:
					 $data =Product::queryPage($start,$limit,$condition);
					 break;
				 case 1:
					 $sql_child_query="(select product_id from ".Prefproduct::tablename()." where preferentialrule_id=".$preferentialrule_id.")";
					 $sql_data="select a.* from ".Product::tablename()." a,$sql_child_query b where a.product_id=b.product_id ";
					 if (!empty($condition))$sql_data.=" and ".$condition;
					 if ($start)$start=$start-1;
					 $sql_data.=" limit $start,".($limit-$start+1);
					 $data=sqlExecute($sql_data,"Product");
					 break;
				 case 2:
					 $sql_child_query=" left join (select product_id from ".Prefproduct::tablename()." where preferentialrule_id=".$preferentialrule_id.")  b on b.product_id=a.product_id where b.product_id is null ";
					 $sql_data="select a.* from ".Product::tablename()." a $sql_child_query ";
					 if (!empty($condition))$sql_data.=" and ".$condition;
					 if ($start)$start=$start-1;
					 $sql_data.=" limit $start,".($limit-$start+1);
					 $data=sqlExecute($sql_data,"Product");
					 break;
			}
			foreach ($data as $product) {
				if(Prefproduct::existBy("preferentialrule_id=$preferentialrule_id and product_id=".$product->product_id)){
					 $product->isShowProductCheck=true;
				}
				$ptype=Ptype::get_by_id($product->ptype_id);
				$product['ptype_name']=$ptype->name;
			}
			if ($data==null)$data=array();
		}else{
			$data=array();
		}
		return array(
			'success' => true,
			'totalCount'=>$count,
			'data'  => $data
		);
	}

	/**
	 * 批量上传优惠券表
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."coupon".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."coupon$diffpart.$tmptail";
			$result   =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Coupon::tablename());
					$data        = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $coupon) {
						$coupon=new Coupon($coupon);
						if (!EnumCouponType::isEnumValue($coupon->coupon_type)){
							$coupon->coupon_type=EnumCouponType::coupon_typeByShow($coupon->coupon_type);
						}
						$coupon_id=$coupon->getId();
						if (!empty($coupon_id)){
							$hadCoupon=Coupon::existByID($coupon->getId());
							if ($hadCoupon!=null){
								$result=$coupon->update();
							}else{
								$result=$coupon->save();
							}
						}else{
							$result=$coupon->save();
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
			'data'  => $result
		);
	}

	/**
	 * 导出优惠券表
	 * @param mixed $filter
	 */
	public function exportCoupon($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Coupon::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Coupon::propertyShow($data,array('coupon_type'));
		}
		$arr_output_header= self::fieldsMean(Coupon::tablename());
		foreach ($data as $coupon) {
			if ($coupon->coupon_typeShow){
				$coupon['coupon_type']=$coupon->coupon_typeShow;
			}
		}
		unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."coupon".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."coupon$diffpart.xls";
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."coupon/export/coupon$diffpart.xls";
		return array(
			'success' => true,
			'data'  => $downloadPath
		);
	}

	/**
	 * 发布优惠券(短信)
	 * @param mixed $filter
	 */
	public function publishCoupon($formPacket=null)
	{
		$phonenumber=$formPacket['showphone'];
		$sendcontent=$formPacket['showdescribe'];
		$coupon_id=$formPacket['showcoupon_id'];
		$coupon=Coupon::get_by_id($coupon_id);
		$coupon_key=$coupon->coupon_key;
		$end_time=UtilDateTime::timestampToDateTime($coupon->end_time);
		if(UtilString::contain($sendcontent,"[EXPIRETIME]"))$sendcontent=str_replace("[EXPIRETIME]",$end_time,$sendcontent);
		$now=UtilDateTime::now(EnumDateTimeFormat::TIMESTAMP);
		//错误号码和发送失败号码数组
		$errornumber=array();
		//筛选手机号码
		if($phonenumber){
			$phones=explode(",",$phonenumber);
			foreach($phones as $phone){
				if($phone&&strlen($phone)==11&&UtilNumber::isNum($phone)){
					$confirm[]=$phone;
				}elseif($phone){
					$errornumber[]=$phone;
				}
			}
		}
		$randnumber=UtilString::build_count_rand(count($confirm),10);
		$count=0;
		$index=0;
		//发送短信,生成实体优惠券
		foreach($confirm as $phone){
			$couponitems_key=$coupon_key.($now+$randnumber[$index]);
			$content=$sendcontent;
			if(UtilString::contain($content,"[COUPONKEY]"))$content=str_replace("[COUPONKEY]",$couponitems_key,$sendcontent);
			$suc=UtilSMS::send($phone,$content);
			//清除缓冲区
			ob_clean();
			//判断是否发送成功
			if($suc){
				$couponitems=new Couponitems();
				$couponitems->couponitems_key=$couponitems_key;
				$couponitems->coupon_id=$coupon_id;
				$couponitems->coupon_value=$coupon_value;
				$couponitems->phonenumber=$phone;
				$couponitems->create_from=EnumCreateFrom::PUBLISH;
				$couponitems->save();
				$count++;
			}else{
				$errornumber[]=$phone;
			}
			$index++;
		}
		if($count)Coupon::increment("coupon_id=".$coupon_id,coupon_num,$count);
		if($errornumber){
			$errorphone="";
			for($i=0;$i<count($errornumber);$i++){
				if(count($errornumber)==1){
					$errorphone=$errorphone.$errornumber[$i];
				}elseif($i<count($errornumber)-1){
					$errorphone=$errorphone.$errornumber[$i].",";
				}else{
					$errorphone=$errorphone.$errornumber[$i];
				}
			}
			if($count){
				$data="优惠券发布成功！共生成".$count."张优惠券!<br>以下号码发送失败,请确认!<br>".$errorphone;
			}else{
				$data="优惠券发布失败！<br>请确认以下号码!<br>".$errorphone;
			}
		}else{
			$data="优惠券发布成功！共生成".$count."张优惠券!";
		}
		return array(
			'success' => true,
			'data'  => $data,
		);
	}

	/**
	 * 发布优惠券(邮件)--只适用于指定优惠商品的代金券
	 * @param mixed $filter
	 */
	public function publishemailCoupon($formPacket=null)
	{
		//邮箱地址
		$emailnumber=$formPacket['showemail'];
		//定制邮件内容
		$sendcontent=$formPacket['emailcontent'];
		//优惠券id
		$coupon_id=$formPacket['eshowcoupon_id'];
		//优惠券
		$coupon=Coupon::get_by_id($coupon_id);
		//优惠规则
		$preferentialrule=Preferentialrule::get_one(array("classify_type=1","classify_id=".$coupon_id));
		//优惠商品
		$products=sqlExecute("select a.* from ".Product::tablename()." a,".Prefproduct::tablename()." b where a.product_id=b.product_id and b.preferentialrule_id=".$preferentialrule->preferentialrule_id." and b.isValid=1",Product::classname_static());
		//优惠券前缀
		$coupon_key=$coupon->coupon_key;
		$now=UtilDateTime::now(EnumDateTimeFormat::TIMESTAMP);
		//错误邮箱和发送失败邮箱数组
		$errornumber=array();
		//筛选邮箱
		if($emailnumber){
			$emails=explode(",",$emailnumber);
			foreach($emails as $email){
				$ifemail = ereg("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+",$email);
				if($ifemail){
					$confirm[]=$email;
				}elseif($email){
					$errornumber[]=$email;
				}
			}
		}
		$randnumber=UtilString::build_count_rand(count($confirm),10);
		$count=0;
		$index=0;
		//发送邮件,生成实体优惠券
		foreach($confirm as $email){
			$couponitems_key=$coupon_key.($now+$randnumber[$index]);
			//邮件内容
			$content=$sendcontent;
			$proinfo="";
			foreach($products as $product){
				$proinfo=$proinfo."<div><a href='".Gc::$url_base."index.php?go=kmall.directfav.check&couponitems_key=".$couponitems_key."&product_id=".$product->product_id."'>".$product->product_name."</a></div>";
			}
			$content=$content.$proinfo;
			//邮件标题
			$title="菲生活商城";
			$toname = $email;
			$suc=UtilEmailer::sendEmail("菲生活商城",$email,$toname,$title,$content);
			//清除缓冲区
			ob_clean();
			//判断是否发送成功
			if($suc["success"]){
				$couponitems=new Couponitems();
				$couponitems->couponitems_key=$couponitems_key;
				$couponitems->coupon_id=$coupon_id;
				$couponitems->coupon_value=$coupon_value;
				$couponitems->emailnumber=$email;
				$couponitems->create_from=EnumCreateFrom::PUBLISH;
				$couponitems->save();
				$count++;
			}else{
				$errornumber[]=$email;
			}
			$index++;
		}
		if($count)Coupon::increment("coupon_id=".$coupon_id,coupon_num,$count);
		if($errornumber){
			$erroremail="";
			for($i=0;$i<count($errornumber);$i++){
				if(count($errornumber)==1){
					$errorphone=$erroremail.$errornumber[$i];
				}elseif($i<count($errornumber)-1){
					$errorphone=$erroremail.$errornumber[$i].",";
				}else{
					$errorphone=$erroremail.$errornumber[$i];
				}
			}
			if($count){
				$data="优惠券发布成功！共生成".$count."张优惠券!<br>以下邮箱发送失败,请确认!<br>".$erroremail;
			}else{
				$data="优惠券发布失败！<br>请确认以下邮箱!<br>".$erroremail;
			}
		}else{
			$data="优惠券发布成功！共生成".$count."张优惠券!";
		}
		return array(
			'success' => true,
			'data'  => $data,
		);
	}

	/**
	 * 批量发布优惠券
	 * @param mixed $filter
	 */
	public function publishallCoupon($formPacket=null)
	{
		 //数量
		$num=$formPacket['num'];
		//定制邮件内容
		$sendcontent=$formPacket['emailcontent'];
		//优惠券id
		$coupon_id=$formPacket['eshowcoupon_id'];
		$randnumber=UtilString::build_count_rand($num,10);
		$couponitems=new Couponitems();
		foreach ($randnumber as $key => $value) {
			$couponitems->couponitems_id=null;
			$couponitems->couponitems_key=$randnumber[$key];
			$couponitems->coupon_id=$coupon_id;
			$couponitems->create_from=EnumCreateFrom::PUBLISH;
			if(!$couponitems->save()){
				return false;
			}
		}
		return array(
			'success' => true,
			'data'  => $num,
		);
	}
}
?>
