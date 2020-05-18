<?php
/**
 +---------------------------------------<br/>
 * 动态首页<br/>
 +---------------------------------------
 * @category kmall
 * @package page
 * @author skygreen skygreen2001@gmail.com
 */
class Indexpage extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $indexpage_id;
    /**
     * 标题
     * @var string
     * @access public
     */
    public $title;
    /**
     * 楼层<br/>
     * 0:今日热销-f0<br/>
     * 1:推荐产品-f11<br/>
     * 2:欧式家具-f12<br/>
     * 3:现代家具-f13<br/>
     * 4:建材城-f3<br/>
     * 5:家纺家饰-f3
     * @var enum
     * @access public
     */
    public $floor;
    /**
     * 位置<br/>
     * 0:下方-side_down<br/>
     * 1:左上方-side_left<br/>
     * 2:右上方-side_right
     * @var enum
     * @access public
     */
    public $side;
    /**
     * 商品标识
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 产品图片
     * @var string
     * @access public
     */
    public $image;
    /**
     * 焦点图
     * @var string
     * @access public
     */
    public $fimage;
    /**
     * 焦点图片宽度
     * @var int
     * @access public
     */
    public $width;
    /**
     * 焦点图片高度
     * @var int
     * @access public
     */
    public $height;
    /**
     * 排序
     * @var int
     * @access public
     */
    public $sort_order;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
    //</editor-fold>

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "product"=>"Product"
    );
    /** 
     * 显示楼层<br/>
     * 0:今日热销-f0<br/>
     * 1:推荐产品-f11<br/>
     * 2:欧式家具-f12<br/>
     * 3:现代家具-f13<br/>
     * 4:建材城-f3<br/>
     * 5:家纺家饰-f3<br/>
     */
    public function getFloorShow()
    {
        return self::floorShow($this->floor);
    }

    /** 
     * 显示位置<br/>
     * 0:下方-side_down<br/>
     * 1:左上方-side_left<br/>
     * 2:右上方-side_right<br/>
     */
    public function getSideShow()
    {
        return self::sideShow($this->side);
    }

    /** 
     * 显示楼层<br/>
     * 0:今日热销-f0<br/>
     * 1:推荐产品-f11<br/>
     * 2:欧式家具-f12<br/>
     * 3:现代家具-f13<br/>
     * 4:建材城-f3<br/>
     * 5:家纺家饰-f3<br/>
     */
    public static function floorShow($floor)
    {
        $e=array(
           0=>"今日热销",
            1=>"推荐产品",
            2=>"欧式家具",
            3=>"现代家具",
            4=>"建材城",
            5=>"家纺家饰"
            );
        return $e[$floor];//EnumFloor::floorShow($floor);
    }

    /** 
     * 显示位置<br/>
     * 0:下方-side_down<br/>
     * 1:左上方-side_left<br/>
     * 2:右上方-side_right<br/>
     */
    public static function sideShow($side)
    {   
        $e=array(
            0=>"下方",
           1=>"左上方",
            2=>"右上方"
            );
        return $e[$side];//EnumSide::sideShow($side);
    }

}
?>