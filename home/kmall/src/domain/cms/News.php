<?php
/**
 +---------------------------------------<br/>
 * 易乐新闻<br/>
 +---------------------------------------
 * @category kmall
 * @package cms
 * @author skygreen skygreen2001@gmail.com
 */
class News extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $news_id;
    /**
     * 标题
     * @var string
     * @access public
     */
    public $news_title;
    /**
     * 内容
     * @var string
     * @access public
     */
    public $news_content;
    /**
     * 图片路径
     * @var string
     * @access public
     */
    public $news_image;
    /**
     * 新闻种类<br/>
     * 1:商城公告-notice<br/>
     * 2:关于我们-aboutus<br/>
     * 3:导购信息-guide
     * @var enum
     * @access public
     */
    public $news_type;
    /**
     * 发布时间
     * @var date
     * @access public
     */
    public $sendTime;
    /**
     * 排序<br/>
     * 越大越靠前
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
     * 显示新闻种类<br/>
     * 1:商城公告-notice<br/>
     * 2:关于我们-aboutus<br/>
     * 3:导购信息-guide<br/>
     */
    public function getNews_typeShow()
    {
        return self::news_typeShow($this->news_type);
    }

    /** 
     * 显示新闻种类<br/>
     * 1:商城公告-notice<br/>
     * 2:关于我们-aboutus<br/>
     * 3:导购信息-guide<br/>
     */
    public static function news_typeShow($news_type)
    {
        return EnumNewsType::news_typeShow($news_type);
    }

}
?>