<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:地区<br/>
 +---------------------------------------
 * @category kmall
 * @package services
 * @author skygreen skygreen2001@gmail.com
 */
class ServiceRegion extends Service implements IServiceBasic
{
	/**
	 * 保存数据对象:地区
	 * @param array|DataObject $region
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($region)
	{
		if (is_array($region)){
			$region=new Region($region);
		}
		if ($region instanceof Region){
			return $region->save();
		}else{
			return false;
		}
	}

	/**
	 * 更新数据对象 :地区
	 * @param array|DataObject $region
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($region)
	{
		if (is_array($region)){
			$region=new Region($region);
		}
		if ($region instanceof Region){
			return $region->update();
		}else{
			return false;
		}
	}

	/**
	 * 由标识删除指定ID数据对象 :地区
	 * @param int $id 数据对象:地区标识
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByID($id)
	{
		return Region::deleteByID($id);
	}

	/**
	 * 根据主键删除数据对象:地区的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		return Region::deleteByIds($ids);
	}

	/**
	 * 对数据对象:地区的属性进行递增
	 * @param string $filter 查询条件，在where后的条件<br/>
	 * 示例如下：<br/>
	 * 0."id=1,name='sky'"<br/>
	 * 1.array("id=1","name='sky'")<br/>
	 * 2.array("id"=>"1","name"=>"sky")<br/>
	 * 3.允许对象如new User(id="1",name="green");<br/>
	 * @param string $property_name 属性名称
	 * @param int $incre_value 递增数
	 * @return boolen 是否操作成功；true为操作正常
	 */
	public function increment($filter=null,$property_name,$incre_value)
	{
		return Region::increment($filter,$property_name,$incre_value);
	}

	/**
	 * 对数据对象:地区的属性进行递减
	 * @param string $filter 查询条件，在where后的条件<br/>
	 * 示例如下：<br/>
	 * 0."id=1,name='sky'"<br/>
	 * 1.array("id=1","name='sky'")<br/>
	 * 2.array("id"=>"1","name"=>"sky")<br/>
	 * 3.允许对象如new User(id="1",name="green");<br/>
	 * @param string $property_name 属性名称
	 * @param int $decre_value 递减数
	 * @return boolen 是否操作成功；true为操作正常
	 */
	public function decrement($filter=null,$property_name,$decre_value)
	{
		return Region::decrement($filter,$property_name,$decre_value);
	}

	/**
	 * 查询数据对象:地区需显示属性的列表
	 * @param string $columns 指定的显示属性，同SQL语句中的Select部分。
	 * 示例如下：<br/>
	 *    id,name,commitTime
	 * @param string $filter 查询条件，在where后的条件<br/>
	 * 示例如下：<br/>
	 * 0."id=1,name='sky'"<br/>
	 * 1.array("id=1","name='sky'")<br/>
	 * 2.array("id"=>"1","name"=>"sky")<br/>
	 * 3.允许对象如new User(id="1",name="green");<br/>
	 * 默认:SQL Where条件子语句。如："(id=1 and name='sky') or (name like 'sky')"<br/>
	 * @param string $sort 排序条件<br/>
	 * 示例如下：<br/>
	 *      1.id asc;<br/>
	 *      2.name desc;<br/>
	 * @param string $limit 分页数目:同Mysql limit语法
	 * 示例如下：<br/>
	 *      0,10<br/>
	 * @return 数据对象:地区列表数组
	 */
	public function select($columns,$filter=null,$sort=Crud_SQL::SQL_ORDER_DEFAULT_ID,$limit=null)
	{
		return Region::select($columns,$filter,$sort,$limit);
	}

	/**
	 * 查询数据对象:地区的列表
	 * @param string $filter 查询条件，在where后的条件<br/>
	 * 示例如下：<br/>
	 * 0."id=1,name='sky'"<br/>
	 * 1.array("id=1","name='sky'")<br/>
	 * 2.array("id"=>"1","name"=>"sky")<br/>
	 * 3.允许对象如new User(id="1",name="green");<br/>
	 * 默认:SQL Where条件子语句。如："(id=1 and name='sky') or (name like 'sky')"<br/>
	 * @param string $sort 排序条件<br/>
	 * 示例如下：<br/>
	 *      1.id asc;<br/>
	 *      2.name desc;<br/>
	 * @param string $limit 分页数目:同Mysql limit语法
	 * 示例如下：<br/>
	 *      0,10<br/>
	 * @return 数据对象:{object_desc}列表数组
	 */
	public function get($filter=null,$sort=Crud_SQL::SQL_ORDER_DEFAULT_ID,$limit=null)
	{
		return Region::get($filter,$sort,$limit);
	}

	/**
	 * 查询得到单个数据对象:地区实体
	 * @param string $filter 查询条件，在where后的条件<br/>
	 * 示例如下：<br/>
	 * 0."id=1,name='sky'"<br/>
	 * 1.array("id=1","name='sky'")<br/>
	 * 2.array("id"=>"1","name"=>"sky")<br/>
	 * 3.允许对象如new User(id="1",name="green");<br/>
	 * 默认:SQL Where条件子语句。如："(id=1 and name='sky') or (name like 'sky')"<br/>
	 * @return 单个数据对象:地区实体
	 */
	public function get_one($filter=null)
	{
		return Region::get_one($filter);
	}

	/**
	 * 根据表ID主键获取指定的对象[ID对应的表列]
	 * @param string $id
	 * @return 单个数据对象:地区实体
	 */
	public function get_by_id($id)
	{
		return Region::get_by_id($id);
	}

	/**
	 * 数据对象:地区总计数
	 * @param string $filter 查询条件，在where后的条件<br/>
	 * 示例如下：<br/>
	 * 0."id=1,name='sky'"<br/>
	 * 1.array("id=1","name='sky'")<br/>
	 * 2.array("id"=>"1","name"=>"sky")<br/>
	 * 3.允许对象如new User(id="1",name="green");<br/>
	 * 默认:SQL Where条件子语句。如："(id=1 and name='sky') or (name like 'sky')"<br/>
	 * @return 数据对象:地区总计数
	 */
	public function count($filter=null)
	{
		return Region::count($filter);
	}

	/**
	 * 数据对象:地区分页查询
	 * @param int $startPoint  分页开始记录数
	 * @param int $endPoint    分页结束记录数
	 * @param string $filter 查询条件，在where后的条件<br/>
	 * 示例如下：<br/>
	 * 0."id=1,name='sky'"<br/>
	 * 1.array("id=1","name='sky'")<br/>
	 * 2.array("id"=>"1","name"=>"sky")<br/>
	 * 3.允许对象如new User(id="1",name="green");<br/>
	 * 默认:SQL Where条件子语句。如："(id=1 and name='sky') or (name like 'sky')"<br/>
	 * @param string $sort 排序条件<br/>
	 * 默认为 id desc<br/>
	 * 示例如下：<br/>
	 *      1.id asc;<br/>
	 *      2.name desc;<br/>
	 * @return 数据对象:地区分页查询列表
	 */
	public function queryPage($startPoint,$endPoint,$filter=null,$sort=Crud_SQL::SQL_ORDER_DEFAULT_ID)
	{
		return Region::queryPage($startPoint,$endPoint,$filter,$sort);
	}
	/**
	 * 直接执行SQL语句
	 * @return array
	 *  1.执行查询语句返回对象数组
	 *  2.执行更新和删除SQL语句返回执行成功与否的true|null
	 */
	public function sqlExecute()
	{
		return self::dao()->sqlExecute("select * from ".Region::tablename(),Region::classname_static());
	}

	/**
	 * 最高等级
	 */
	public function maxlevelInRegion()
	{
		$result=self::dao()->sqlExecute("select max(region_type) from ".Region::tablename());
		return $result;
	}
}
?>