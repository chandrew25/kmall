<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:企业信息<br/>
 +---------------------------------------
 * @category kmall
 * @package services
 * @author skygreen skygreen2001@gmail.com
 */
class ServiceCompany extends Service implements IServiceBasic
{
    /**
     * 保存数据对象:企业信息
     * @param array|DataObject $company
     * @return int 保存对象记录的ID标识号
     */
    public function save($company)
    {
        if (is_array($company)){
            $company=new Company($company);
        }
        if ($company instanceof Company){
            return $company->save();
        }else{
            return false;
        }
    }

    /**
     * 更新数据对象 :企业信息
     * @param array|DataObject $company
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($company)
    {
        if (is_array($company)){
            $company=new Company($company);
        }
        if ($company instanceof Company){
            return $company->update();
        }else{
            return false;
        }
    }

    /**
     * 由标识删除指定ID数据对象 :企业信息
     * @param int $id 数据对象:企业信息标识
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByID($id)
    {
        return Company::deleteByID($id);
    }

    /**
     * 根据主键删除数据对象:企业信息的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        return Company::deleteByIds($ids);
    }

    /**
     * 对数据对象:企业信息的属性进行递增
     * @param object|string|array $filter 查询条件，在where后的条件<br/>
     * 示例如下：<br/>
     * 0."id=1,name='sky'"<br/>
     * 1.array("id=1","name='sky'")<br/>
     * 2.array("id"=>"1","name"=>"sky")<br/>
     * 3.允许对象如new User(id="1",name="green");<br/>
     * 默认:SQL Where条件子语句。如："(id=1 and name='sky') or (name like 'sky')"<br/>
     * @param string $property_name 属性名称
     * @param int $incre_value 递增数
     * @return boolen 是否操作成功；true为操作正常
     */
    public function increment($filter=null,$property_name,$incre_value)
    {
        return Company::increment($filter,$property_name,$incre_value);
    }

    /**
     * 对数据对象:企业信息的属性进行递减
     * @param object|string|array $filter 查询条件，在where后的条件<br/>
     * 示例如下：<br/>
     * 0."id=1,name='sky'"<br/>
     * 1.array("id=1","name='sky'")<br/>
     * 2.array("id"=>"1","name"=>"sky")<br/>
     * 3.允许对象如new User(id="1",name="green");<br/>
     * 默认:SQL Where条件子语句。如："(id=1 and name='sky') or (name like 'sky')"<br/>
     * @param string $property_name 属性名称
     * @param int $decre_value 递减数
     * @return boolen 是否操作成功；true为操作正常
     */
    public function decrement($filter=null,$property_name,$decre_value)
    {
        return Company::decrement($filter,$property_name,$decre_value);
    }

    /**
     * 查询数据对象:企业信息需显示属性的列表
     * @param string $columns 指定的显示属性，同SQL语句中的Select部分。
     * 示例如下：<br/>
     *    id,name,commitTime
     * @param object|string|array $filter 查询条件，在where后的条件<br/>
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
     * @return 数据对象:企业信息列表数组
     */
    public function select($columns,$filter=null,$sort=Crud_SQL::SQL_ORDER_DEFAULT_ID,$limit=null)
    {
        return Company::select($columns,$filter,$sort,$limit);
    }

    /**
     * 查询数据对象:企业信息的列表
     * @param object|string|array $filter 查询条件，在where后的条件<br/>
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
        return Company::get($filter,$sort,$limit);
    }

    /**
     * 查询得到单个数据对象:企业信息实体
     * @param object|string|array $filter 查询条件，在where后的条件<br/>
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
     * @return 单个数据对象:企业信息实体
     */
    public function get_one($filter=null, $sort=Crud_SQL::SQL_ORDER_DEFAULT_ID)
    {
        return Company::get_one($filter,$sort);
    }

    /**
     * 根据表ID主键获取指定的对象[ID对应的表列]
     * @param string $id
     * @return 单个数据对象:企业信息实体
     */
    public function get_by_id($id)
    {
        return Company::get_by_id($id);
    }

    /**
     * 数据对象:企业信息总计数
     * @param object|string|array $filter 查询条件，在where后的条件<br/>
     * 示例如下：<br/>
     * 0."id=1,name='sky'"<br/>
     * 1.array("id=1","name='sky'")<br/>
     * 2.array("id"=>"1","name"=>"sky")<br/>
     * 3.允许对象如new User(id="1",name="green");<br/>
     * 默认:SQL Where条件子语句。如："(id=1 and name='sky') or (name like 'sky')"<br/>
     * @return 数据对象:企业信息总计数
     */
    public function count($filter=null)
    {
        return Company::count($filter);
    }

    /**
     * 数据对象:企业信息分页查询
     * @param int $startPoint  分页开始记录数
     * @param int $endPoint    分页结束记录数
     * @param object|string|array $filter 查询条件，在where后的条件<br/>
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
     * @return 数据对象:企业信息分页查询列表
     */
    public function queryPage($startPoint,$endPoint,$filter=null,$sort=Crud_SQL::SQL_ORDER_DEFAULT_ID)
    {
        return Company::queryPage($startPoint,$endPoint,$filter,$sort);
    }
    /**
     * 直接执行SQL语句
     * @return array
     *  1.执行查询语句返回对象数组
     *  2.执行更新和删除SQL语句返回执行成功与否的true|null
     */
    public function sqlExecute()
    {
        return self::dao()->sqlExecute("select * from ".Company::tablename(),Company::classname_static());
    }
}
?>