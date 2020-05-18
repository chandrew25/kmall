<?php
/**
 +---------------------------------------<br/>
 * 下载记录日志表<br/>
 +---------------------------------------
 * @category kmall
 * @package appdown
 * @author skygreen skygreen2001@gmail.com
 */
class Applog extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $applog_id;
    /**
     * 应用下载标识
     * @var int
     * @access public
     */
    public $appdown_id;
    /**
     * 应用名称
     * @var string
     * @access public
     */
    public $appdown_name;
    /**
     * 标签
     * @var string
     * @access public
     */
    public $tag;
    /**
     * 缩略图
     * @var string
     * @access public
     */
    public $ico;
    /**
     * 小图标
     * @var string
     * @access public
     */
    public $smallicon;
    /**
     * 推荐等级<br/>
     * 1:等级1-level1<br/>
     * 2:等级2-level2<br/>
     * 3:等级3-level3<br/>
     * 4:等级4-level4<br/>
     * 5:等级5-level5<br/>
     * 6:等级6-level6<br/>
     * 7:等级7-level7<br/>
     * 8:等级8-level8<br/>
     * 9:等级9-level9<br/>
     * 10:等级10-level10
     * @var enum
     * @access public
     */
    public $recommendlevel;
    /**
     * 排序<br/>
     * 权重越大，越靠前
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
     * 显示推荐等级<br/>
     * 1:等级1-level1<br/>
     * 2:等级2-level2<br/>
     * 3:等级3-level3<br/>
     * 4:等级4-level4<br/>
     * 5:等级5-level5<br/>
     * 6:等级6-level6<br/>
     * 7:等级7-level7<br/>
     * 8:等级8-level8<br/>
     * 9:等级9-level9<br/>
     * 10:等级10-level10<br/>
     */
    public function getRecommendlevelShow()
    {
        return self::recommendlevelShow($this->recommendlevel);
    }

    /** 
     * 显示推荐等级<br/>
     * 1:等级1-level1<br/>
     * 2:等级2-level2<br/>
     * 3:等级3-level3<br/>
     * 4:等级4-level4<br/>
     * 5:等级5-level5<br/>
     * 6:等级6-level6<br/>
     * 7:等级7-level7<br/>
     * 8:等级8-level8<br/>
     * 9:等级9-level9<br/>
     * 10:等级10-level10<br/>
     */
    public static function recommendlevelShow($recommendlevel)
    {
        return EnumRecommendlevel::recommendlevelShow($recommendlevel);
    }

}
?>