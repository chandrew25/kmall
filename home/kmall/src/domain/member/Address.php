<?php
/**
 +---------------------------------------<br/>
 * 会员收货人地址信息<br/>
 +---------------------------------------
 * @category kmall
 * @package domain.member
 * @author skygreen
 */
class Address extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var string
     * @access public
     */
    public $address_id;

    /**
     * 会员标识
     * @var string
     * @access public
     */
    public $member_id;

    /**
     * 收货人姓名
     * @var string
     * @access public
     */
    public $consignee;

    /**
     * 邮件地址
     * @var string
     * @access public
     */
    public $email;

    /**
     * 国家标识
     * 参考region表的region_id字段
     * @var string
     * @access public
     */
    public $country;

    /**
     * 省标识
     * 参考region表的region_id字段
     * @var string
     * @access public
     */
    public $province;

    /**
     * 市标识
     * 参考region表的region_id字段
     * @var string
     * @access public
     */
    public $city;

    /**
     * 区标识
     * 参考region表的region_id字段
     * @var string
     * @access public
     */
    public $district;

    /**
     * 详细地址
     * @var string
     * @access public
     */
    public $address;

    /**
     * 邮政编码
     * @var string
     * @access public
     */
    public $zipcode;

    /**
     * 电话
     * @var string
     * @access public
     */
    public $tel;

    /**
     * 手机
     * @var string
     * @access public
     */
    public $mobile;

    /**
     * 标志建筑
     * @var string
     * @access public
     */
    public $sign_building;

    /**
     * 最佳送货时间
     * @var string
     * @access public
     */
    public $best_time;
    //</editor-fold>

    /**
     * 归属省份的市列表
     * @var array
     */
    public $citys_by_province;

    /**
     * 归属市的区列表
     * @var array
     */
    public $district_by_city;

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        'country_r'=>"Region",
        'province_r'=>"Region",
        'city_r'=>"Region",
        'district_r'=>"Region"
    );

    /**
     * 规格说明:外键声明
     * @var mixed
     */
    public $field_spec=array(
        EnumDataSpec::FOREIGN_ID=>array(
            'country_r'=>"country",
            "province_r"=>"province",
            "city_r"=>"city",
            'district_r'=>"district"
        )
    );

}
?>