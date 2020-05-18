<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:系统管理员扮演角色  <br/> 
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumRoletype extends Enum
{
    /**
     * 系统管理员扮演角色:超级管理员
     */
    const SUPERADMIN='0';
    /**
     * 系统管理员扮演角色:管理员
     */
    const MANAGER='1';
    /**
     * 系统管理员扮演角色:客服
     */
    const NORMAL='2';
    /**
     * 系统管理员扮演角色:采购人员
     */
    const BUYER='3';
    /**
     * 系统管理员扮演角色:财务
     */
    const FINANCE='4';
    /**
     * 系统管理员扮演角色:库管
     */
    const WAREHOUSEKEEPER='5';
    /**
     * 系统管理员扮演角色:供应商
     */
    const SUPPLIER='6';

    /** 
     * 显示系统管理员扮演角色<br/>
     * 0:超级管理员-superadmin<br/>
     * 1:管理员-manager<br/>
     * 2:客服-normal<br/>
     * 3:采购人员-buyer<br/>
     * 4:财务-finance<br/>
     * 5:库管-warehousekeeper<br/>
     */
    public static function roletypeShow($roletype)
    {
       switch($roletype){ 
            case self::SUPERADMIN:
                return "超级管理员"; 
            case self::MANAGER:
                return "管理员"; 
            case self::NORMAL:
                return "客服"; 
            case self::BUYER:
                return "采购"; 
            case self::FINANCE:
                return "财务"; 
            case self::WAREHOUSEKEEPER:
                return "库管"; 
       }
       return "未知";
    }

    /** 
     * 根据系统管理员扮演角色显示文字获取系统管理员扮演角色<br/>
     * @param mixed $roletypeShow 系统管理员扮演角色显示文字
     */
    public static function roletypeByShow($roletypeShow)
    {
       switch($roletypeShow){ 
            case "超级管理员":
                return self::SUPERADMIN; 
            case "管理员":
                return self::MANAGER; 
            case "客服":
                return self::NORMAL; 
            case "采购":
                return self::BUYER; 
            case "财务":
                return self::FINANCE; 
            case "库管":
                return self::WAREHOUSEKEEPER; 
       }
       return self::SUPERADMIN;
    }

}
?>
