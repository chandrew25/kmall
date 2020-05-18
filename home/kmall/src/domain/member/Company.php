<?php
/**
 +---------------------------------------<br/>
 * 企业信息<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Company extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     *
     * @var int
     * @access public
     */
    public $company_id;
    /**
     * 成员id<br/>
     * 外键关联到member
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 公司名称
     * @var string
     * @access public
     */
    public $com_name;
    /**
     * 公司性质<br/>
     * 1:政府机关/事业单-govcareer<br/>
     * 2:国营-staterun<br/>
     * 3:私营-private<br/>
     * 4:中外合资-jointventure<br/>
     * 5:外资-foreignventure<br/>
     * 6:其他-others<br/>
     *
     * @var enum
     * @access public
     */
    public $com_kind;
    /**
     * 公司地址
     * @var string
     * @access public
     */
    public $com_address;
    /**
     * 邮编
     * @var string
     * @access public
     */
    public $com_mcode;
    /**
     * 员工数量
     * @var int
     * @access public
     */
    public $com_membernum;
    /**
     * 联系人<br/>
     * 1:HR部门联系人-hrdpt<br/>
     * 2:工会联系人-trade<br/>
     * <br/>
     *
     * @var enum
     * @access public
     */
    public $com_contractor;
    /**
     * 职务<br/>
     * 1:专员-commissioner<br/>
     * 2:经理-manager<br/>
     * 3:总监-master<br/>
     * 4:工会主席-chairman<br/>
     * 5:办公主任-director<br/>
     * 100:其他-other
     * @var enum
     * @access public
     */
    public $com_position;
    /**
     * 联系电话
     * @var string
     * @access public
     */
    public $com_tel;
    /**
     * 传真
     * @var string
     * @access public
     */
    public $com_fax;
    /**
     * 福利<br/>
     * 多选项，不同福利以‘；’隔开<br/>
     * 春节福利<br/>
     * 中秋节福利<br/>
     * 妇女节福利<br/>
     * 端午节福利<br/>
     * 防暑降温<br/>
     * 员工体检<br/>
     * 员工生日<br/>
     * 员工娱乐<br/>
     *
     * @var string
     * @access public
     */
    public $com_welfare;
    //</editor-fold>

    /**
     * 显示公司性质<br/>
     * 1:政府机关/事业单-govcareer<br/>
     * 2:国营-staterun<br/>
     * 3:私营-private<br/>
     * 4:中外合资-jointventure<br/>
     * 5:外资-foreignventure<br/>
     * 6:其他-others<br/>
     * <br/>
     */
    public static function com_kindShow($com_kind)
    {
        return EnumComKind::com_kindShow($com_kind);
    }

    /**
     * 显示联系人<br/>
     * 1:HR部门联系人-hrdpt<br/>
     * 2:工会联系人-trade<br/>
     * <br/>
     * <br/>
     */
    public static function com_contractorShow($com_contractor)
    {
        return EnumComContractor::com_contractorShow($com_contractor);
    }

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
        return EnumComPosition::com_positionShow($com_position);
    }
}
?>
