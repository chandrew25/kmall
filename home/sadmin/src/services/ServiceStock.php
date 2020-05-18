<?php
/**
 +---------------------------------------<br/>
 * 服务类: stock<br/>
 +---------------------------------------
 * @category betterlife
 * @package services
 * @author skygreen skygreen2001@gmail.com
 */
class ServiceStock extends Service implements IServiceBasic 
{
    /**
     * 保存数据对象: stock
     * @param array|DataObject $stock
     * @return int 保存对象记录的ID标识号
     */
    public function save($stock)
    {
        if ( is_array($stock) ) {
            $stock = new Stock($stock);
        }
        if ( $stock instanceof Stock ) {
            return $stock->save();
        } else {
            return false;
        }
    }

    /**
     * 更新数据对象 :stock
     * @param array|DataObject $stock
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($stock)
    {
        if ( is_array($stock) ) {
            $stock = new Stock($stock);
        }
        if ( $stock instanceof Stock ) {
            return $stock->update();
        } else {
            return false;
        }
    }

    /**
     * 由标识删除指定ID数据对象 :stock
     * @param int $id 数据对象: stock标识
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByID($id)
    {
        return Stock::deleteByID( $id );
    }

    /**
     * 根据主键删除数据对象: stock的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1. array:array(1, 2, 3, 4, 5)
     * 2. 字符串:1, 2, 3, 4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        return Stock::deleteByIds( $ids );
    }

    /**
     * 对数据对象: stock的属性进行递增
     * @param object|string|array $filter 查询条件，在where后的条件<br/> 
     * 示例如下: <br/>
     * 0. "id = 1, name = 'sky'"<br/>
     * 1. array("id = 1", "name = 'sky'")<br/> 
     * 2. array("id" => "1", "name" => "sky")<br/>
     * 3. 允许对象如new User(id = "1", name = "green");<br/>
     * 默认:SQL Where条件子语句。如: "( id = 1 and name = 'sky' ) or ( name like '%sky%' )"<br/>
     * @param string $property_name 属性名称 
     * @param int $incre_value 递增数 
     * @return boolen 是否操作成功；true为操作正常
     */
    public function increment($filter = null, $property_name, $incre_value)
    {
        return Stock::increment( $filter, $property_name, $incre_value );
    }

    /**
     * 对数据对象: stock的属性进行递减
     * @param object|string|array $filter 查询条件，在where后的条件<br/> 
     * 示例如下: <br/>
     * 0. "id = 1, name = 'sky'"<br/>
     * 1. array("id = 1", "name = 'sky'")<br/> 
     * 2. array("id" => "1", "name" => "sky")<br/>
     * 3. 允许对象如new User(id = "1", name = "green");<br/>
     * 默认:SQL Where条件子语句。如: "( id = 1 and name = 'sky' ) or ( name like '%sky%' )"<br/>
     * @param string $property_name 属性名称 
     * @param int $decre_value 递减数 
     * @return boolen 是否操作成功；true为操作正常
     */
    public function decrement($filter = null, $property_name, $decre_value)
    {
        return Stock::decrement( $filter, $property_name, $decre_value );
    }

    /**
     * 查询数据对象: stock需显示属性的列表
     * @param string $columns 指定的显示属性，同SQL语句中的Select部分。 
     * 示例如下: <br/>
     *    id, name, commitTime
     * @param object|string|array $filter 查询条件，在where后的条件<br/> 
     * 示例如下: <br/>
     * 0. "id = 1, name = 'sky'"<br/>
     * 1. array("id = 1", "name = 'sky'")<br/> 
     * 2. array("id" => "1", "name" => "sky")<br/>
     * 3. 允许对象如new User(id = "1", name = "green");<br/>
     * 默认:SQL Where条件子语句。如: "( id = 1 and name = 'sky' ) or ( name like '%sky%' )"<br/> 
     * @param string $sort 排序条件<br/>
     * 示例如下: <br/>
     *      1. id asc;<br/>
     *      2. name desc;<br/>
     * @param string $limit 分页数目:同Mysql limit语法
     * 示例如下: <br/>
     *      0, 10<br/>
     * @return 数据对象: stock列表数组
     */
    public function select($columns, $filter = null, $sort = Crud_SQL::SQL_ORDER_DEFAULT_ID, $limit = null)
    {
        return Stock::select( $columns, $filter, $sort, $limit );
    }

    /**
     * 查询数据对象: stock的列表
     * @param object|string|array $filter 查询条件，在where后的条件<br/> 
     * 示例如下: <br/>
     * 0. "id = 1, name = 'sky'"<br/>
     * 1. array("id = 1", "name = 'sky'")<br/> 
     * 2. array("id" => "1", "name" => "sky")<br/>
     * 3. 允许对象如new User(id = "1", name = "green");<br/>
     * 默认:SQL Where条件子语句。如: "( id = 1 and name = 'sky' ) or ( name like '%sky%' )"<br/> 
     * @param string $sort 排序条件<br/>
     * 示例如下: <br/>
     *      1. id asc;<br/>
     *      2. name desc;<br/>
     * @param string $limit 分页数目:同Mysql limit语法
     * 示例如下: <br/>
     *      0, 10<br/>
     * @return 数据对象:{object_desc}列表数组
     */
    public function get($filter = null, $sort = Crud_SQL::SQL_ORDER_DEFAULT_ID, $limit = null)
    {
        return Stock::get( $filter, $sort, $limit );
    }

    /**
     * 查询得到单个数据对象: stock实体
     * @param object|string|array $filter 查询条件，在where后的条件<br/> 
     * 示例如下: <br/>
     * 0. "id = 1, name = 'sky'"<br/>
     * 1. array("id = 1","name = 'sky'")<br/> 
     * 2. array("id" => "1", "name" => "sky")<br/>
     * 3. 允许对象如new User(id = "1", name = "green");<br/>
     * 默认:SQL Where条件子语句。如: "( id = 1 and name = 'sky' ) or ( name like '%sky%' )"<br/> 
     * @param string $sort 排序条件<br/>
     * 示例如下: <br/>
     *      1. id asc;<br/>
     *      2. name desc;<br/>
     * @return 单个数据对象: stock实体
     */
    public function get_one($filter = null, $sort = Crud_SQL::SQL_ORDER_DEFAULT_ID)
    {
        return Stock::get_one( $filter, $sort );
    }

    /**
     * 根据表ID主键获取指定的对象[ID对应的表列] 
     * @param string $id  
     * @return 单个数据对象: stock实体
     */
    public function get_by_id($id)
    {
        return Stock::get_by_id( $id );
    }

    /**
     * 数据对象: stock总计数
     * @param object|string|array $filter 查询条件，在where后的条件<br/> 
     * 示例如下: <br/>
     * 0. "id = 1, name = 'sky'"<br/>
     * 1. array("id = 1", "name = 'sky'")<br/> 
     * 2. array("id" => "1", "name" => "sky")<br/>
     * 3. 允许对象如new User(id = "1", name = "green");<br/>
     * 默认:SQL Where条件子语句。如: "( id = 1 and name = 'sky' ) or ( name like '%sky%' )"<br/> 
     * @return 数据对象: stock总计数
     */
    public function count($filter = null)
    {
        return Stock::count( $filter );
    }

    /**
     * 数据对象: stock分页查询
     * @param int $startPoint  分页开始记录数
     * @param int $endPoint    分页结束记录数
     * @param object|string|array $filter 查询条件，在where后的条件<br/> 
     * 示例如下: <br/>
     * 0. "id = 1, name = 'sky'"<br/>
     * 1. array("id = 1", "name = 'sky'")<br/> 
     * 2. array("id" => "1", "name" => "sky")<br/>
     * 3. 允许对象如new User(id = "1", name = "green");<br/>
     * 默认:SQL Where条件子语句。如: "( id = 1 and name = 'sky' ) or ( name like '%sky%' )"<br/> 
     * @param string $sort 排序条件<br/>
     * 默认为 id desc<br/>
     * 示例如下: <br/>
     *      1. id asc;<br/>
     *      2. name desc;<br/>
     * @return 数据对象: stock分页查询列表
     */

    public function queryPage($startPoint, $endPoint, $filter = null, $sort = Crud_SQL::SQL_ORDER_DEFAULT_ID)
    {
        return Stock::queryPage( $startPoint, $endPoint, $filter, $sort );
    }

    /**
     * 直接执行SQL语句
     * @return array
     *  1. 执行查询语句返回对象数组
     *  2. 执行更新和删除SQL语句返回执行成功与否的true|null
     */
    public function sqlExecute()
    {
        return self::dao()->sqlExecute( "select * from " . Stock::tablename(), Stock::classname_static() );
    }

    /**
     * 批量上传stock
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart = date("YmdHis");
        if ( !empty($files["upload_file"]) ) {
            $tmptail = explode('.', $files["upload_file"]["name"]);
            $tmptail = end($tmptail);
            $uploadPath = GC::$attachment_path . "stock" . DS . "import" . DS . "stock$diffpart . $tmptail";
            $result = UtilFileSystem::uploadFile( $files, $uploadPath );
            if ( $result && ($result['success'] == true) ) {
                if ( array_key_exists('file_name', $result) ) {
                    $arr_import_header = self::fieldsMean( Stock::tablename() );
                    $data = UtilExcel::exceltoArray( $uploadPath, $arr_import_header );
                    $result = false;
                    if ( $data ) {
                        foreach ($data as $stock) {
                            $stock = new Stock($stock);
                            if ( $stock->isDelegate == "是" ) $stock->isDelegate = true; else $stock->isDelegate = false;
                            $stock_id = $stock->getId();
                            if ( !empty($stock_id) ) {
                                $hadStock = Stock::existByID($stock->getId());
                                if ( $hadStock ) {
                                    $result = $stock->update();
                                } else {
                                    $result=$stock->save();
                                }
                            } else {
                                $result = $stock->save();
                            }
                        }
                    }
                } else {
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
     * 导出stock
     * @param mixed $filter
     */
    public function exportStock($filter = null)
    {
        if ( $filter ) $filter = $this->filtertoCondition( $filter );
        $data = Stock::get( $filter );

        if ($data){
            foreach ($data as $key => $stock) {
                $stock->isDelegate = $stock->isDelegateShow();
                $stock->commitTime = UtilDateTime::timestampToDateTime($stock->commitTime, UtilDateTime::TIMEFORMAT_YMD);
            }
        }
        $arr_output_header = self::fieldsMean( Stock::tablename() ); 
        unset($arr_output_header['stock_id'], $arr_output_header['updateTime']);
        $diffpart = date("YmdHis");
        $outputFileName = Gc::$attachment_path . "export" . DS . "stock" . DS . "$diffpart.xls";
        UtilExcel::arraytoExcel( $arr_output_header, $data, $outputFileName, false ); 
        $downloadPath   = Gc::$attachment_url . "export/stock/$diffpart.xls"; 
        $result = array(
            'success' => true,
            'data'    => $downloadPath
        ); 
        echo json_encode($result);
        die();
        return $result;
    }

}

