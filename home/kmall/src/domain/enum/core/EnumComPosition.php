<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:职务  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumComPosition extends Enum
{
    /**
     * 职务:专员
     */
    const COMMISSIONER='1';
    /**
     * 职务:经理
     */
    const MANAGER='2';
    /**
     * 职务:总监
     */
    const MASTER='3';
    /**
     * 职务:工会主席
     */
    const CHAIRMAN='4';
    /**
     * 职务:办公主任
     */
    const DIRECTOR='5';
    /**
     * 职务:其他
     */
    const OTHER='100';

    /**
     * 显示职务<br/>
     * 1:专员-commissioner<br/>
     * 2:经理-manager<br/>
     * 3:总监-master<br/>
     * 4:工会主席-chairman<br/>
     * 5:办公主任-director<br/>
     * 100:其他-other<br/>
     */
    public static function com_positionShow($com_position)
    {
       switch($com_position){
            case self::COMMISSIONER:
                return "专员";
            case self::MANAGER:
                return "经理";
            case self::MASTER:
                return "总监";
            case self::CHAIRMAN:
                return "工会主席";
            case self::DIRECTOR:
                return "办公主任";
            case self::OTHER:
                return "其他";
       }
       return "未知";
    }

    /**
     * 根据职务显示文字获取职务<br/>
     * @param mixed $com_positionShow 职务显示文字
     */
    public static function com_positionByShow($com_positionShow)
    {
       switch($com_positionShow){
            case "专员":
                return self::COMMISSIONER;
            case "经理":
                return self::MANAGER;
            case "总监":
                return self::MASTER;
            case "工会主席":
                return self::CHAIRMAN;
            case "办公主任":
                return self::DIRECTOR;
            case "其他":
                return self::OTHER;
       }
       return self::COMMISSIONER;
    }

}
?>
