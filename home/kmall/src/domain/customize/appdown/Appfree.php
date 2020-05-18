<?php
/**
 +---------------------------------------<br/>
 * 免费应用下载<br/>
 +---------------------------------------
 * @category kmall
 * @package appdown
 * @author skygreen skygreen2001@gmail.com
 */
class Appfree extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $appfree_id;
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
     * 文件路径
     * @var string
     * @access public
     */
    public $filepath;
    /**
     * 图片
     * @var string
     * @access public
     */
    public $image;
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
     * 简介
     * @var string
     * @access public
     */
    public $introduction;
    /**
     * 介绍
     * @var string
     * @access public
     */
    public $introduce;
    /**
     * 开发者
     * @var string
     * @access public
     */
    public $developer;
    /**
     * 标签
     * @var string
     * @access public
     */
    public $tag;
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
     * 应用分类<br/>
     * 1：游戏天地-gameworld<br/>
     * 2：影音娱乐-entertainment<br/>
     * 3：教育阅读-eduread<br/>
     * 4：旅行购物-travelshop<br/>
     * 5：生活休闲-Leisure
     * @var enum
     * @access public
     */
    public $type;
    /**
     * 价格
     * @var float
     * @access public
     */
    public $price;
    /**
     * 文件大小
     * @var int
     * @access public
     */
    public $docsize;
    /**
     * 版本
     * @var string
     * @access public
     */
    public $edition;
    /**
     * 发布时间
     * @var int
     * @access public
     */
    public $publishtime;
    /**
     * 下载次数
     * @var int
     * @access public
     */
    public $downloadcount;
    /**
     * 购买次数
     * @var int
     * @access public
     */
    public $buycount;
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
     * 显示应用分类<br/>
     * 1：游戏天地-gameworld<br/>
     * 2：影音娱乐-entertainment<br/>
     * 3：教育阅读-eduread<br/>
     * 4：旅行购物-travelshop<br/>
     * 5：生活休闲-Leisure<br/>
     */
    public function getTypeShow()
    {
        return self::typeShow($this->type);
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

    /** 
     * 显示应用分类<br/>
     * 1：游戏天地-gameworld<br/>
     * 2：影音娱乐-entertainment<br/>
     * 3：教育阅读-eduread<br/>
     * 4：旅行购物-travelshop<br/>
     * 5：生活休闲-Leisure<br/>
     */
    public static function typeShow($type)
    {
        return EnumAppfreeType::typeShow($type);
    }

}
?>
