<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:系统管理人员<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceAdmin extends ServiceBasic
{
	/**
	 * 保存数据对象:系统管理人员
	 * @param array|DataObject $admin
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($params)
	{
        $username=$params["username"];
        $hasone=Admin::get_one("username='$username'");
        if($hasone){
            return array(
                'success' => false,
                'msg'    => '用户名已经存在,请重新输入！'
            );
        }
        //获取管理员信息(PS:只有super管理员和管理员拥有权限)
        $admininfo=HttpSession::get("admin");
        //菜单配置信息
        $xml=MenuGroup::allforjson();
        //操作配置信息
        $authorityxml=OperationGroup::allforjson();
        $authoritystring="-";
        $operationstring="-";
        foreach($xml as $mainmenu){
            foreach($mainmenu->menus as $menu){
                $menu_id = $menu->id;
                if($params[$menu_id]=="on"){
                    $authoritystring=$authoritystring.$menu_id."-";
                }
            }
        }
        foreach($authorityxml as $authority){
            foreach($authority->operations as $operation){
                $operation_name = $operation->gridname."_".$operation->id;
                if($params[$operation_name]=="on"){
                    $operationstring=$operationstring.$operation_name."-";
                }
            }
        }
        $admin=new Admin();
        $admin->username=$params["username"];
        $admin->realname=$params["realname"];
        $admin->password=$params["password"];
        $admin->department_id=$params["department_id"];
        $admin->authority=$authoritystring;
        $admin->operation=$operationstring;
        $admin->roletype=$params["roletype"];
        $admin->roleid=$params["roleid"];
        $admin->seescope=$params["seescope"];
        $admin->operator_id=$admininfo->admin_id;
        $data=$admin->save();
		return array(
			'success' => true,
			'data'    => $data
		);
	}
	/**
	 * 更新数据对象 :系统管理人员
	 * @param array|DataObject $admin
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($admin)
	{
        //获取管理员信息(PS:只有super管理员和管理员拥有权限)
        $admininfo=HttpSession::get("admin");
        //菜单配置信息
        $xml=MenuGroup::allforjson();
        //操作配置信息
        $authorityxml=OperationGroup::allforjson();
        $authoritystring="-";
        $operationstring="-";
        foreach($xml as $mainmenu){
            foreach($mainmenu->menus as $menu){
                $menu_id = $menu->id;
                if($admin[$menu_id]=="on"){
                    $authoritystring=$authoritystring.$menu_id."-";
                }
            }
        }
        foreach($authorityxml as $authority){
            foreach($authority->operations as $operation){
                $operation_name = $operation->gridname."_".$operation->id;
                if($admin[$operation_name]=="on"){
                    $operationstring=$operationstring.$operation_name."-";
                }
            }
        }
        $admin["authority"]=$authoritystring;
        $admin["operation"]=$operationstring;
        $admin["operator_id"]=$admininfo->admin_id;
		if (!EnumRoletype::isEnumValue($admin["roletype"])){
			$admin["roletype"]=EnumRoletype::roletypeByShow($admin["roletype"]);
		}
		if (!EnumSeescope::isEnumValue($admin["seescope"])){
			$admin["seescope"]=EnumSeescope::seescopeByShow($admin["seescope"]);
		}
		if (is_array($admin)){
			$adminObj=new Admin($admin);
		}
		if ($adminObj instanceof Admin){
            if(!empty($adminObj->password))
            {
                $adminObj->password=$adminObj->password;
            }else{
                $adminObj->password= $admin["password_old"];
            }
			$data=$adminObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:系统管理人员的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Admin::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:系统管理人员分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:系统管理人员分页查询列表
	 */
	public function queryPageAdmin($formPacket=null)
	{
        //获取管理员信息(PS:只有super管理员和管理员拥有权限)
        $admin=HttpSession::get("admin");
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
        if($condition){
            //根据管理员权限筛选数据
            if($admin->roletype==1){
                if($admin->seescope==1){
                    $condition=$condition." and roletype>'1'";
                }else{
                    $condition=$condition." and roletype>'1' and operator_id=".$admin->admin_id;
                }
            }
        }else{
            //根据管理员权限筛选数据
            if($admin->roletype){
                if($admin->seescope==1){
                    $condition="roletype>'1'";
                }else{
                    $condition="roletype>'1' and operator_id=".$admin->admin_id;
                }
            }
        }
		$count=Admin::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Admin::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Admin::propertyShow($data,array('roletype','seescope'));
			}
			foreach ($data as $admins) {
				if ($admins->roleid){
					$supplier=Supplier::get_by_id($admins->roleid);
					$admins['sp_name']=$supplier->sp_name;
				}
                if ($admins->operator_id){
                    $name=Admin::select("username","admin_id=".$admins->operator_id);
                    $admins['operator_name']=$name;
                }
                $admins["nowroleplayer"]=$admin->roletype;
                $admins["department_name"]=$admins->department->department_name;
			}
			if ($data==null)$data=array();
		}else{
			$data=array();
		}
        //菜单配置信息
        $xml=MenuGroup::allforjson();
        //角色菜单配置信息
        $rolexml=MenuGroup::allrole();
        //操作配置信息
        $authorityxml=OperationGroup::allforjson();
        //角色操作配置信息
        $roleauthorityxml=OperationGroup::allrole();
		return array(
            'xml' => $xml,
            'rolexml' => $rolexml,
            'authorityxml' => $authorityxml,
            'roleauthorityxml' =>$roleauthorityxml,
			'success' => true,
			'totalCount'=>$count,
			'data'    => $data
		);
	}

	/**
	 * 根据管理员标识显示管理员信息
	 * @param mixed $viewId
	 */
	public function viewAdmin($viewId)
	{
		if (!empty($viewId)){
			$admin=Admin::get_by_id($viewId);
			if (!empty($admin))
			{
				$admin->roletypeShow=$admin->getRoletypeShow();
				$admin->seescope=$admin->getSeescopeShow();
			}
			return array(
				'success' => true,
				'data'    => $admin
			);
		}
		return array(
			'success' => false,
			'msg'     => "无法查找到需查看的管理员信息！"
		);
	}

    /**
     * 修改密码
     * @param mixed $viewId
     */
    public function revisePwd($admin)
    {
        //获取管理员信息(PS:只有super管理员和管理员拥有权限)
        if (is_array($admin)){
            $adminObj=new Admin($admin);
        }
        if ($adminObj instanceof Admin){
            $data=$adminObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

	/**
	 * 批量上传系统管理人员
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."admin" . DS . "import" . DS . "admin$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Admin::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $admin) {
						$admin=new Admin($admin);
						if (!EnumRoletype::isEnumValue($admin["roletype"])){
							$admin["roletype"]=EnumRoletype::roletypeByShow($admin["roletype"]);
						}
						if (!EnumSeescope::isEnumValue($admin["seescope"])){
							$admin["seescope"]=EnumSeescope::seescopeByShow($admin["seescope"]);
						}
						$admin_id=$admin->getId();
						if (!empty($admin_id)){
							$hadAdmin=Admin::get_by_id($admin->getId());
							if ($hadAdmin!=null){
								$result=$admin->update();
							}else{
								$result=$admin->save();
							}
						}else{
							$result=$admin->save();
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
	 * 导出系统管理人员
	 * @param mixed $filter
	 */
	public function exportAdmin($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Admin::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Admin::propertyShow($data,array('roletype','seescope'));
		}
		$arr_output_header= self::fieldsMean(Admin::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."admin" . DS . "export" . DS . "admin$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."admin/export/admin$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
