<?php
/**
 +---------------------------------------<br/>
 * 会员评论<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Comment extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $comment_id;
    /**
     * 会员标识
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 会员用户名
     * @var string
     * @access public
     */
    public $memberName;
    /**
     * 评论类型<br/>
     * 0:商品评论
     * @var string
     * @access public
     */
    public $comment_type;
    /**
     * 商品编号
     * @var string
     * @access public
     */
    public $product_id;
    /**
     * 邮件地址
     * @var string
     * @access public
     */
    public $email;
    /**
     * 评论内容
     * @var string
     * @access public
     */
    public $content;
    /**
     * 评价等级<br/>
     * 1:差评-bad<br/>
     * 2:中评-medium<br/>
     * 3:好评-good<br/>
     * 4:默认-defaults<br/>
     *
     * @var enum
     * @access public
     */
    public $comment_rank;
    /**
     * 评价的IP地址
     * @var string
     * @access public
     */
    public $ip_address;
    /**
     * 状态<br/>
     * 0:隐藏<br/>
     * 1:显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 父评论
     * @var int
     * @access public
     */
    public $parent_id;
    /**
     * 评价时间
     * @var int
     * @access public
     */
    public $add_time;
    //</editor-fold>

    //评论对应 产品   多对一
    static $belong_has_one=array(
        "product"=>"Product"
    );

    public $field_spec=array(
        EnumDataSpec::REMOVE=>array(
            'commitTime'
        )
    );

    /**
     * 显示评价等级<br/>
     * 1:差评-bad<br/>
     * 2:中评-medium<br/>
     * 3:好评-good<br/>
     * 4:默认-defaults<br/>
     * <br/>
     */
    public function getComment_rankShow()
    {
        return self::comment_rankShow($this->comment_rank);
    }

    /**
     * 显示评价等级<br/>
     * 1:差评-bad<br/>
     * 2:中评-medium<br/>
     * 3:好评-good<br/>
     * 4:默认-defaults<br/>
     * <br/>
     */
    public static function comment_rankShow($comment_rank)
    {
        return EnumCommentRank::comment_rankShow($comment_rank);
    }
}
?>