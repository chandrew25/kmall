<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:产品<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceWarehouseGoods extends ServiceBasic
{
    /**
     * 产品入库
     * 规则描述如下
     * 1.渠道商产品入库:
     *   -记录入库日志，
     *    如果是自己的产品，不记录源供应商，记录目的供应商。
     *    如果是其他供应商的产品，记录源供应商，记录目的供应商。
     *   -记录仓库存储产品数量，如果是其他供应商的产品，新增渠道商关于该产品的数量，已有产品入库时，修改入库产品数量。
     *     如果是自己的产品，已有产品入库，修改入库产品数量
     * 2.其他角色不能产品入库
     * @param mixed $goods
     */
    public function goodsInWarehouse($goods)
    {
        HttpSession::init();
        $user=Admin::get_by_id(HttpSession::get("admin_id"));
        if (is_array($goods)){
            $goodsObj   = new Goods($goods);
            $productObj = new Product();
            $productObj->product_code=$goods["goods_code"];
            $productObj->product_name=$goods["goods_name"];
            $productObj->price=$goods["in_price"];
            $productObj->supplier_id=$goods["supplier_id"];
        }
        if ($goodsObj instanceof Goods){
            //如果是新商品入库
            if ($goods["operate_type"]=="new"){
//--------------------to do ---------------------------//
        //多规格商品入库
//--------------------to do end -----------------------//
                if ($goodsObj->goods_code){
                    $goodsObj->goods_code=trim($goodsObj->goods_code);
                    //该编号的商品是否存在
                    $phad=Product::get_one("product_code='".$goodsObj->goods_code."'");
                    //该编号的货品是否存在
                    $had=Goods::get_one("goods_code='".$goodsObj->goods_code."'");
                    if ($had||$had){
                        return array(
                            'success' => false,
                            'msg'    => '商品标识:'.$goodsObj->goods_code."的商品已存在<br/>商品名称为：".$had->goods_name
                        );
                    }
                }
                if (isset($goods["level"]))$level= $goods["level"]; else $level=Ptype::select_one('level',array("ptype_id"=>$goods['ptype_id']));
                //新建商品
                $productObj->ptype_key=$this->getPtypeKey($goods['ptype_id'],$level);
                $product_id=$productObj->save();
                //新建货品
                $goodsObj->product_id=$product_id;
                $goodsObj->ptype_key=$this->getPtypeKey($goods['ptype_id'],$level);
                $data=$goodsObj->save();

                //保存新产品库存记录
                $warehousegoods=new Warehousegoods();
                $warehousegoods->goods_id=$data;
                $warehousegoods->goods_code=$goodsObj->goods_code;
                $warehousegoods->supplier_id=supplier_id;
                $warehousegoods->warehouse_id=$warehouse_id;
                $warehousegoods->num=$goods['num'];
                $warehousegoods->save();

                //更新goods 库存 stock
                Goods::updateProperties($data,"stock=".$warehousegoods->num);

                //保存新产品入库日志
                $goodslogArr=array(
                    'fsp_id'=>"",
                    'fsp_warehouse'=>"",
                    'tsp_id'=>$goods["supplier_id"],
                    'tsp_warehouse'=>$warehouse_id,
                    'goodsActionType'=>EnumGoodsActionType::NEWIN,
                    'goods_id'=>$data,
                    'price'=>$goods['sales_price'],
                    'num'=>$goods['num'],
                    'admin_id'=>HttpSession::get("admin_id"),
                    'operator'=>$goods['operator']
                );
                $goodslog=new Goodslog($goodslogArr);
                $goodslog->save();
            }else{
                //更新产品库存记录
                $warehouseGoods=Warehousegoods::get_one("goods_id=".$goods["goods_id"]);
                if ($warehouseGoods){
                    $warehouseGoods->supplier_id=$goods["supplier_id"];
                    $warehouseGoods->warehouse_id=$warehouse_id;
                    $warehouseGoods->num=$warehouseGoods->num+$goods['num'];
                    $warehouseGoods->update();
                }else{
                    $warehouseGoods=new $warehouseGoods();
                    $warehouseGoods->supplier_id=$goods["supplier_id"];
                    $warehouseGoods->product_id=$goods["goods_id"];
                    $warehouseGoods->warehouse_id=$warehouse_id;
                    $warehouseGoods->num=$goods['num'];
                    $warehouseGoods->save();
                }
                //更新goods 库存 stock
                Goods::updateProperties($goods["goods_id"],"stock=".$warehouseGoods->num);

                //更新产品单价
                $goods_db=Goods::get_by_id($goods["goods_id"]);
                //如果原价格与新入库产品价格不等，则更新价格
                if($goods_db->sales_price != $goodsObj->price){
                    $goods_db->sales_price=$goodsObj->price;
                    $goods_db->update();
                }
/*                if ($goods_db){
                    $supplier_id=$goods_db->supplier_id;
                }*/

                $warehouse=Warehouse::get_one(array("supplier_id"=>$supplier_id,"isDefault"=>1));
                $warehouse_id_from=$warehouse->warehouse_id;
                //保存已有产品入库日志
                $goodslogArr=array(
                    'fsp_id'=>$supplier_id,
                    'fsp_warehouse'=>$warehouse_id_from,
                    'tsp_id'=>Supplier::channel_id(),
                    'tsp_warehouse'=>Warehouse::channel_id(),
                    'goodsActionType'=>EnumGoodsActionType::HAVEIN,
                    'goods_id'=>$goods["goods_id"],
                    'price'=>$goods['sales_price'],
                    'num'=>$goods['num'],
                    'admin_id'=>HttpSession::get("admin_id"),
                    'operator'=>$goods['operator'],
                );
                $goodslog=new Goodslog($goodslogArr);
                $goodslog->save();
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
     * 产品出库
     * @param mixed $goodslog
     */
    public function outGoodsFromWarehouse($goodslog)
    {
        HttpSession::init();
        $user=Admin::get_by_id(HttpSession::get("admin_id"));
        $goods_id=$goodslog['goods_id'];
        if ($goods_id)
        {
            //渠道商出库
            $goods=Goods::get_by_id($goods_id);
            $supplier_id=$goods->product->supplier_id;
            //获取渠道商的库存
            $warehouseGoods=Warehousegoods::get_one(array("goods_id"=>$goods_id,"supplier_id"=>$supplier_id));
            if ($warehouseGoods){
                if ($warehouseGoods->num<$goodslog["num"]){
                    return array(
                        'success' => false,
                        'msg'    => "商品出库的数量超过了库存的数量！<br/>现在该商品库存只有:".$warehouseGoods->num.$goods->unit
                    );
                }
                $warehouseGoods->num=$warehouseGoods->num-$goodslog["num"];
                $warehouseGoods->update();
                $goodslog_i=new Goodslog($goodslog);
                $goodslog_i->fsp_id=Supplier::channel_id();
                $goodslog_i->fsp_warehouse=Warehouse::channel_id();
                $goodslog_i->tsp_id="";
                $goodslog_i->tsp_warehouse="";
                $goodslog_i->goodsActionType=EnumGoodsActionType::OUT;
                $goodslog_i->admin_id=HttpSession::get("admin_id");
                $goodslog_i->save();
            }else{
                LogMe::log("商品编号:".$goods_id.",供应商编号:".$goods->supplier_id."出库时无法找到库存记录，属于异常情况！请核查。");
                return array(
                    'success' => false,
                    'msg'    => "无法在供应商的仓库记录里找到该商品！"
                );
            }
        }
        return array(
            'success' => true,
            'data'    => true
        );
    }

    /**
     * 获取产品分类查询字<br/>
     * 产品类型分类多级，方便上一级也能查找到下一级的产品<br/>
     * 如二级分类也能找到所属三级分类下的产品<br/>
     * 形式如：-1-2-3-
     * @var string
     * @access public
     */
    private function getPtypeKey($gtype_id,$gtype_level)
    {
        switch ($gtype_level) {
           case 1:
             return "-".$gtype_id."-";
           case 2:
             $result=$gtype_id."-";
             $gtype1_id = Ptype::select_one( "parent_id" , array("ptype_id"=>$gtype_id));
             return "-".$gtype1_id."-".$result;
           case 3:
             $result=$gtype_id."-";
             $gtype2_id = Ptype::select_one( "parent_id" , array("ptype_id"=>$gtype_id));
             $result=$gtype2_id."-".$result;
             $gtype1_id = Ptype::select_one( "parent_id" , array("ptype_id"=>$gtype2_id));
             return "-".$gtype1_id."-".$result;
        }
    }

    /**
     * 保存数据对象:产品
     * @param array|DataObject $goods
     * @return int 保存对象记录的ID标识号
     */
    public function save($goods)
    {
        HttpSession::init();
        $user=Admin::get_by_id(HttpSession::get("admin_id"));
        if ($user&&(($user->roletype==EnumRoletype::CHANNEL)||($user->roletype==EnumRoletype::SUPPLIER)))
        {
            $warehouse=Warehouse::get_one(array("supplier_id"=>$user->roleid,"isDefault"=>1));
            $warehouse_id=$warehouse->warehouse_id;
        }
        else
        {
            return array(
                'success' => false,
                'msg'    => "只有供应商和渠道商才能操作商品入库！"
            );
        }

        if (isset($goods["level"]))$level= $goods["level"]; else $level=Ptype::select_one('level',array("gtype_id"=>$goods['gtype_id']));
        if (is_array($goods)){
            $goodsObj=new Product($goods);
        }
        if ($goodsObj->goods_no)
        {
            $goodsObj->goods_no=trim($goodsObj->goods_no);
            $had=Product::get_one("goods_no='".$goodsObj->goods_no);
            if ($had){
                return array(
                    'success' => false,
                    'msg'    => '商品标识:'.$goodsObj->goods_no."的商品已存在<br/>商品名称为：".$had->gname
                );
            }
        }
        if ($goodsObj instanceof Product){
            $goodsObj->supplier_id=$user->roleid;
            if($user->roletype==EnumRoletype::SUPPLIER){
                $goodsObj->sptype=0;
            }else{
                $goodsObj->sptype=1;
            }
            $goodsObj->gtype_key=$this->getPtypeKey($goods['gtype_id'],$level);
            $data=$goodsObj->save();

            //保存新产品库存记录
            $warehouseProduct=new Warehouseproduct();
            $warehouseProduct->product_id=$data;
            $warehouseProduct->supplier_id=$user->roleid;
            $warehouseProduct->warehouse_id=$warehouse_id;
            $warehouseProduct->num=$goods['num'];
            $warehouseProduct->save();

            //保存新产品入库日志
            $goodslogArr=array(
                'fsp_id'=>"",
                'fsp_warehouse'=>"",
                'tsp_id'=>$user->roleid,
                'tsp_warehouse'=>$warehouse_id,
                'goodsActionType'=>EnumGoodsActionType::NEWIN,
                'product_id'=>$data,
                'price'=>$goods['in_price'],
                'num'=>$goods['num'],
                'admin_id'=>HttpSession::get("admin_id"),
                'operator'=>$user->username
            );
            $goodslog=new Productlog($goodslogArr);
            $goodslog->save();

        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 更新数据对象 :产品
     * @param array|DataObject $goods
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($goods)
    {
        if (isset($goods["level"]))$level= $goods["level"]; else $level=Ptype::select_one('level',array("gtype_id"=>$goods['gtype_id']));
        if (is_array($goods)){
            $goodsObj=new Product($goods);
        }
        $goodsObj->gtype_key=$this->getPtypeKey($goods['gtype_id'],$level);
        if ($goodsObj instanceof Product){
            $data=$goodsObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 根据主键删除数据对象:产品的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Product::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 数据对象:产品分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认10个。
     * @return 数据对象:产品分页查询列表
     */
    public function queryPageGoods($formPacket=null)
    {
        $start=1;$limit=9;
        $condition=UtilObject::object_to_array($formPacket);

        if (isset($condition['start'])){
            $start=$condition['start']+1;
          }
        if (isset($condition['limit'])){
            $limit=$condition['limit'];
            $limit=$start+$limit-1;
        }
        unset($condition['start'],$condition['limit']);
        //条件数组
        $conditionArr=array();
        //如果有分类条件
        if (isset($condition['ptype_id'])){
            $level=Ptype::select_one('level',array("ptype_id"=>$condition['ptype_id']));
            $condition['ptype_key']=$this->getPtypeKey($condition['ptype_id'],$level);
            if  (empty($condition['ptype_key'])) $condition['ptype_key']='---';
            unset($condition['ptype_id']);
        }
        //时间区间查询处理
        if(!empty($condition['commitFrom'])){
            $commitFrom = UtilDateTime::dateToTimestamp($condition['commitFrom']);
            $conditionArr[] = " a.commitTime >= '".$commitFrom."' ";
            unset($condition['commitFrom']);
        }
        if(!empty($condition['commitTo'])){
            $commitTo = UtilDateTime::dateToTimestamp($condition['commitTo']);
            $conditionArr[] = " a.commitTime <= '".$commitTo."' ";
            unset($condition['commitTo']);
        }
        //如果有库存警报
        if(is_numeric($condition['alarm'])){
            $alarm = true;
            unset($condition['alarm']);
        }
        //where_clause处理
        if (!empty($condition)&&(count($condition)>0)){
            foreach ($condition as $key=>$value) {
                if (empty($value)&&$value!==0&&$value!=='0')continue;
                if (!UtilString::is_utf8($value)){
                    $value=UtilString::gbk2utf8($value);
                }
                if (is_numeric($value)){
                    $conditionArr[]="a.".$key."=".$value;
                }else{
                    $conditionArr[]="a.".$key." like '%".$value."%'";
                }
            }
            $condition=implode(" and ",$conditionArr);
        }else{
            $condition="";
        }

        //如果为库存警报
        if($alarm){
            if($condition){
                $alarm_clause = " from ".Goods::tablename()." a,".Warehousegoods::tablename()." b where b.num<=b.low_alarm and a.goods_id=b.goods_id and ".$condition;
            }else{
                $alarm_clause = " from ".Goods::tablename()." a,".Warehousegoods::tablename()." b where b.num<=b.low_alarm and a.goods_id=b.goods_id";
            }
            $count=sqlExecute("select count(distinct a.goods_id)".$alarm_clause);
            if($count>0){
                if ($limit>$count)$limit=$count;
                $start=$start-1;
                $data = sqlExecute("select distinct a.*".$alarm_clause." limit ".$start.",".$limit,Goods::classname_static());
            }
        }else{
            $where_clause = " from ".Goods::tablename()." a ";
            if($condition){
                $condition=" where ".$condition;
            }
            $count=sqlExecute("select count(*)".$where_clause.$condition);
            if($count>0){
                if ($limit>$count)$limit=$count;
                $start=$start-1;
                $data =sqlExecute("select a.* ".$where_clause.$condition,Goods::classname_static());
            }
        }

        if ($data){
            foreach($data as $goods){
                //货品所在仓库
                $warehousegoods=Warehousegoods::get_one("goods_id=".$goods->goods_id);
                //货品单位
                $goods["unit"]=$warehousegoods->unit;
                //货品库存
                $goods["num"]=$warehousegoods->num;
                //低库存警报值
                $goods['low_alarm']=$warehousegoods->low_alarm;
                //供应商
                $supplier=Supplier::get_by_id($warehousegoods->supplier_id);
                $goods['sp_name']=$supplier->sp_name;
                //供应商标志
                $goods["supplier_id"]=$warehousegoods->supplier_id;
                //获取goodsinfo
                $goodslogSql = self::dao()->sqlExecute("select
                    goods_id,
                    cast(sum(price * num)/sum(num) as decimal(15,2)) as avgprice,
                    sum(case goodsActionType  when  '0' then num end) as ins,
                    sum(case goodsActionType  when  '1' then num end) as ins2,
                    sum(case goodsActionType  when  '2' then num end) as outs
                    from ".Goodslog::tablename()." where goods_id = '".$goods->goods_id."'");

                //如果日志表数据为0
                if(count($goodslogSql) ==0){
                    $goods['storeinfo']="现库存:0".$goods->unit.",已进库:0"
                        .$goods->unit.",已出库:0".$goods->unit;
                    $goods['in_price'] = "0";
                }
                if(count($goodslogSql) ==1){
                    if (!empty($goodslogSql[0]->goods_id)){
                        $goodslogSql[0]->ins = $goodslogSql[0]->ins==""?0:$goodslogSql[0]->ins;
                        $goodslogSql[0]->ins2 = $goodslogSql[0]->ins2==""?0:$goodslogSql[0]->ins2;
                        $goodslogSql[0]->outs = $goodslogSql[0]->outs==""?0:$goodslogSql[0]->outs;
                        $goodsin = $goodslogSql[0]->ins+$goodslogSql[0]->ins2;
                        $goodsouts = $goodslogSql[0]->outs;
                        $goodshas = $goodsin - $goodsouts;
                        if($goodsouts > $goodsin){
                            LogMe::log("商品".$goods->goods_id.":".$goods->goods_name."出入库错误，出库数量大于入库数量");
                        }else{
                            $goods['storeinfo']="现库存".$goodshas.$goods->unit.",已进库".$goodsin
                            .$goods->unit.",已出库".$goodsouts.$goods->unit;
                        }
                        if (!empty($goodslogSql[0]->avgprice)){
                            $goods['in_price'] = $goodslogSql[0]->avgprice;
                        }
                    }
                }
                //货品的分类
                $ptype=Ptype::get_by_id($goods->ptype_id);
                $goods['ptype_name']=$ptype->name;
                $ptype_key=$goods['ptype_key'];
                if (!empty($ptype_key)){
                    $ptype_fullname=array();
                    $ptype_key=explode("-",$ptype_key);
                    foreach ($ptype_key as $ptype_id) {
                        if (!empty($ptype_id)){
                            $ptype=Ptype::get_by_id($ptype_id);
                            $ptype_fullname[]=$ptype->name;
                        }
                    }
                    $goods['ptype_name'] = $ptype->name;
                    $goods['ptype_fullname']=implode("-",$ptype_fullname);
                }
            }
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
     * 批量上传产品
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        //获取身份 ，只允许供应商 与 渠道商 导入
        HttpSession::init();
        $user=Admin::get_by_id(HttpSession::get("admin_id"));
        if ($user&&(($user->roletype==EnumRoletype::CHANNEL)||($user->roletype==EnumRoletype::SUPPLIER)))
        {
            $diffpart=date("YmdHis");
            if (!empty($files["upload_file"])){
                $tmptail = end(explode('.', $files["upload_file"]["name"]));
                $uploadPath =GC::$attachment_path."goods" . DS . "import" . DS . "goods$diffpart.$tmptail";
                $result     =UtilFileSystem::uploadFile($files,$uploadPath);
                if ($result&&($result['success']==true)){
                    if (array_key_exists('file_name',$result)){
                        $arr_import_header = self::fieldsMean(Goods::tablename());
                        $arr_import_header2 = self::fieldsMean(Goodslog::tablename());
                        //为$arr_import_header 增加一些Product不含有的字段
                        foreach ($arr_import_header2 as $key => $value) {
                            $arr_import_header[$key] = $value;
                        }
                        $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                        $result=false;
                        foreach ($data as $goods) {
                            $goods_num = $goods['num'];
                            $goods=new Goods($goods);
                            $goods_code=$goods->goods_code;

                            //根据信息获取供应商ID
                            $supplier = Supplier::get_one(array("sp_name"=>$goods->supplier_id));
                            if($supplier){
                                $supplier_id = $supplier->supplier_id;
                                $goods->supplier_id = $supplier_id;
                                $goods->sptype=$supplier->stype;
                                $fwarehouse=Warehouse::get_one(array("supplier_id"=>$supplier_id,"isDefault"=>1));
                                $fwarehouse_id=$fwarehouse->warehouse_id;
                            }
                            //计算出gtype_id
                            $ptype_key = $goods->ptype_key;
                            $goods->ptype_id = ExtServicePtype::PkeyToPid($ptype_key);
                            $goods->ptype_key= ExtServicePtype::PkeyStrToPkeyInt($ptype_key);

                            if (!empty($goods_code)){
                                $hadGoods=Goods::get_one(array("goods_code"=>$goods_code));
                                if ($hadGoods!=null){
                                    $goods->goods_id = $hadGoods->goods_id;
                                    $result=$goods->update();
                                    //用于记录是否需要存入GoodsLog
                                    $isSaveGoodsLog = $result;
                                    $filterSql = EnumGoodsActionType::HAVEIN;

                                }else{
                                    $result=$goods->save();
                                    $isSaveGoodsLog = $result;
                                    $filterSql = "save";
                                    $filterSql = EnumGoodsActionType::NEWIN;
                                }
                            }else{
                                $result=$goods->save();
                                $isSaveGoodsLog = $result;
                                $filterSql = EnumGoodsActionType::NEWIN;
                            }

                            //product_id
                            if($isSaveGoodsLog == true){
                                $goods_id =$goods->goods_id;
                            }else if(is_numeric($isSaveGoodsLog)){
                                $goods_id = $isSaveGoodsLog;
                            }

                            //获取tsp仓库信息
                            $warehouse=Warehouse::get_one(array("supplier_id"=>$user->roleid,"isDefault"=>1));
                            $warehouse_id=$warehouse->warehouse_id;


                            //如果成功存取了商品，则对ProductLog 进行操作
                            if($isSaveGoodsLog != false || $isSaveGoodsLog != ""){
                                $fsp_id = "" ;
                                $fsp_warehouse = "" ;


                                //当更新新的产品时，判断角色是否为渠道商，并且 供应商的ID 不为自己本身
                                $isHaveinSelforSupplier = $supplier_id == $user->roleid;
                                if(($user->roletype==EnumRoletype::CHANNEL)&&$filterSql == EnumGoodsActionType::HAVEIN && $isHaveinSelforSupplier ==false){
                                    $fsp_id = $supplier_id;
                                    $fsp_warehouse = $fwarehouse_id ;
                                }


                                $goodslog = new Goodslog();
                                $goodslogArr=array(
                                    'fsp_id'=>$fsp_id,
                                    'fsp_warehouse'=>$fsp_warehouse,
                                    'tsp_id'=>$user->roleid,
                                    'tsp_warehouse'=>$warehouse_id,
                                    'goodsActionType'=>$filterSql,
                                    'product_id'=>$goods_id,
                                    'price'=>$goods['in_price'],
                                    'num'=>$goods_num,
                                    'admin_id'=>HttpSession::get("admin_id"),
                                    'operator'=>$user->username
                                );
                                $goodslog=new Goodslog($goodslogArr);
                                $goodslog->save();
                            }
                            //对仓库进行操作
                            if($isSaveGoodsLog != false || $isSaveGoodsLog != ""){
                                $warehouseGoods=new Warehousegoods();
                                $warehouseGoods->goods_id=$goods_id;
                                $warehouseGoods->supplier_id=$user->roleid;
                                $warehouseGoods->warehouse_id=$warehouse_id;

                                $hadwarehousegoods = Warehousegoods::get_one(array("goods_id"=>$goods_id));
                                if($hadwarehousegoods){
                                    $hadwarehousegoods->warehousegoods_id=$hadwarehousegoods->warehousegoods_id;
                                    $hadwarehousegoods->num=$goods_num+$hadwarehousegoods['num'];
                                    $hadwarehousegoods->update();
                                }else{
                                    $hadwarehousegoods->num=$goods_num;
                                    $hadwarehousegoods->save();
                                }
                            }
                        }
                    }else{
                        return array(
                            'success' => false,
                            'msg'    => "excel读取错误"
                        );
                    }
                }else{
                    return $result;
                }
            }
            return array(
                'success' => true,
                'data'    => $result
            );
        }else{
            return array(
                'success' => false,
                'msg'    => "当前角色无权限上传"
            );
        }
    }

    /**
     * 导出产品
     * @param mixed $filter
     */
    public function exportGoods($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Product::get($filter);
        if ((!empty($data))&&(count($data)>0))
        {
            Product::propertyShow($data,array('markettable'));
            foreach($data as $key=>$value){
                if ($value->uptime)$value->uptime=UtilDateTime::timestampToDateTime($value->uptime);
                if ($value->downtime)$value->downtime=UtilDateTime::timestampToDateTime($value->downtime);
            }
        }
        $arr_output_header= self::fieldsMean(Product::tablename());
        unset($arr_output_header['updateTime']);
        unset($arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."goods" . DS . "export" . DS . "goods$diffpart.xls"; 
        UtilFileSystem::createDir(dirname($outputFileName));
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."goods/export/goods$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }
}
?>
