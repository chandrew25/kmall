<?php

/**
 +---------------------------------<br/>
 * 操作分组<br/>
 +---------------------------------
 * @category kmall
 * @package web.back
 * @subpackage menu
 * @author skygreen
 */
class OperationGroup extends Viewable
{
    /**
     * 菜单配置文件
     */
    const CONFIG_OPERATION_FILE="operation.config.xml";
    /**
     * 角色菜单配置文件
     */
    const CONFIG_ROLE_OPERATION_FILE="operation_role_play.xml";
    /**
     * 标识
     * @var string
     */
    public $id;
    /**
     * 操作分组名称
     * @var string
     */
    private $name;
    /**
     * 分组拥有的操作列表
     * $key:操作分组ID,$value:所有的操作项。
     * @var array 操作列表
     */
    private $operations;
    /**
     * 所有的操作配置信息
     */
    private $operationConfigs;

    /**
     * 构造器
     * @param string $id
     * @param string $name
     */
    public function __construct($id)
    {
        $this->setId($id);
    }

    private function setId($id)
    {
        $this->id=$id;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name=$name;
    }

    public function getName()
    {
        return $this->name;
    }

    /**
     * Xml格式存储的文件路径地址
     */
    public static function address()
    {
        return dirname(__FILE__).DIRECTORY_SEPARATOR.self::CONFIG_OPERATION_FILE;
    }


    private function getOperationConfigs()
    {
        if ($this->operationConfigs==null){
            $uri= self::address();
            $this->operationConfigs=UtilXmlSimple::fileXmlToObject($uri);
        }
        return $this->operationConfigs;
    }

    /**
     * 根据操作分组获取下属所有操作信息
     * @param string $name 操作分组ID
     */
    public function getOperations()
    {
        if (empty($this->operations)||(!is_array($this->operations)))
        {
            $this->getByID();
        }
        return $this->operations;
    }

    /**
     * 根据操作分组获取操作分组信息
     */
    public function getByID()
    {
       $operationConfigs = $this->getOperationConfigs();
       if ($operationConfigs!=null)
       {
           $operationGroup = $operationConfigs->xpath("//operationGroup[@id='$this->id']");
           if (is_array($operationGroup)&&count($operationGroup)>0)
           {
               $operationGroup=$operationGroup[0];
               $attributes=$operationGroup->attributes();
               $this->id= $attributes->id."";
               if (empty($this->name))
               {
                    $this->name= $attributes->name."";
               }
               $this->lang= $attributes->lang."";
               $this->iconCls= $attributes->iconCls."";
               if (empty($this->operations)||(!is_array($this->operations))){
                   $this->operations=array();
                   foreach ($operationGroup->operation as $operationItem)
                   {
                       $attributes=$operationItem->attributes();
                       $operation=new Operation();
                       $operation->setName($attributes->name."");
                       $address=$attributes->address;
                       if (!startWith($address, "http")){
                           $address=Gc::$url_base.$address;
                       }
                       $operation->setId($attributes->id."");
                       $operation->setAddress($address."");
                       $operation->setTitle($attributes->title."");
                       $operation->setname($attributes->gridname."");
                       $operation->setFor($attributes->for."");
                       $this->operations[]=$operation;
                   }
               }
           }
        }
        unset($this->operationConfigs);
        return $this;
    }

    /**
     * 获取所有的OperationGroup
     */
    public static function all()
    {
        $uri=dirname(__FILE__).DIRECTORY_SEPARATOR.self::CONFIG_OPERATION_FILE;
        $operationConfigs=UtilXmlSimple::fileXmlToObject($uri);
        $result=array();
        if ($operationConfigs!=null)
        {
            foreach ($operationConfigs as $operationGroup)
            {
                $attributes=$operationGroup->attributes();
                $id= $attributes->id."";
                $operationG=new OperationGroup($id);
                $operationG->getOperations();
                $result[]=$operationG;
            }
        }
        return $result;
    }

    /**
     * 获取所有的OperationGroup for json
     */
    public static function allforjson()
    {
        $uri=dirname(__FILE__).DIRECTORY_SEPARATOR.self::CONFIG_OPERATION_FILE;
        $operationConfigs=UtilXmlSimple::fileXmlToObject($uri);
        $result=array();
        if ($operationConfigs!=null)
        {
            foreach ($operationConfigs as $operationGroup)
            {
                $operationG="";
                $attributes=$operationGroup->attributes();
                $operationG->name=$attributes->name."";
                $address=$attributes->address;
                if (!startWith($address, "http")){
                   $address=Gc::$url_base.$address;
                }
                $operationG->id=$attributes->id."";
                $operationG->address=$address."";
                $operationG->gridname=$attributes->gridname."";
                foreach($operationGroup->operation as $operations){
                    $operation="";
                    $attributes=$operations->attributes();
                    $operation->name=$attributes->name."";
                    $address=$attributes->address;
                    if (!startWith($address, "http")){
                       $address=Gc::$url_base.$address;
                    }
                    $operation->id=$attributes->id."";
                    $operation->address=$address."";
                    $operation->gridname=$attributes->gridname."";
                    $operation->title=$attributes->title."";
                    $operation->for=$attributes->for."";
                    $operationG->operations[]=$operation;
                }
                $result[]=$operationG;
            }
        }
        return $result;
    }

    /**
     * 获取所有角色的OperationGroup
     */
    public static function allrole()
    {
        $uri=dirname(__FILE__).DIRECTORY_SEPARATOR.self::CONFIG_ROLE_OPERATION_FILE;
        $roleoperationConfigs=UtilXmlSimple::fileXmlToObject($uri);
        $role=array();
        if ($roleoperationConfigs!=null)
        {
            foreach ($roleoperationConfigs as $roleoperationGroup)
            {
                $result=array();
                $roleattributes=$roleoperationGroup->attributes();
                $roleid= $roleattributes->id."";
                $operationConfigs=$roleoperationGroup->operationGroups;
                $operationGroups=$operationConfigs->operationGroup;
                foreach($operationGroups as $operationGroup){
                    $operationG="";
                    $attributes=$operationGroup->attributes();
                    $operationG->name=$attributes->name."";
                    $address=$attributes->address;
                    if (!startWith($address, "http")){
                       $address=Gc::$url_base.$address;
                    }
                    $operationG->id=$attributes->id."";
                    $operationG->address=$address."";
                    $operationG->gridname=$attributes->gridname."";
                    foreach($operationGroup->operation as $operations){
                        $operation="";
                        $attributes=$operations->attributes();
                        $operation->name=$attributes->name."";
                        $address=$attributes->address;
                        if (!startWith($address, "http")){
                           $address=Gc::$url_base.$address;
                        }
                        $operation->id=$attributes->id."";
                        $operation->address=$address."";
                        $operation->gridname=$attributes->gridname."";
                        $operation->title=$attributes->title."";
                        $operation->for=$attributes->for."";
                        $operationG->operations[]=$operation;
                    }
                    $result[]=$operationG;
                }
                $role[$roleid]=$result;
            }
        }
        return $role;
    }
}
?>