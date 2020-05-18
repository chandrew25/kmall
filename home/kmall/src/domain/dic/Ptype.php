<?php
/**
 +---------------------------------------<br/>
 * 商品类型
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Ptype extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $ptype_id;
    /**
     * 名称
     *
     * @var string
     * @access public
     */
    public $name;
    /**
     * 缩略图
     * @var string
     * @access public
     */
    public $ico;
    /**
     * 一级分类展示图片
     * @var string
     * @access public
     */
    public $image;
    /**
     * 是否显示在导航栏
     * @var string
     * @access public
     */
    public $show_in_nav;
    /**
     * 子数量
     * 该目录下子元素数量
     * @var string
     * @access public
     */
    public $countChild;
    /**
     * 目录层级
     * @var string
     * @access public
     */
    public $level;
    /**
     * 上级分类
     * 所属父产品类型唯一标识
     * @var int
     * @access public
     */
    public $parent_id;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 排序
     * 权重越大，越靠前
     * @var int
     * @access public
     */
    public $sort_order;
    //</editor-fold>

    static $many_many=array(
      "attributes"=>"Attribute"
    );
    static $has_many=array(
      "ptypeattrs"=>"Ptypeattr"
    );
    /**
     * 处理菜单名称的长度
     * 超过指定长度截取
     * @var int
     * @access public
     */
    public function getNameShow(){
      $new_name = $this->name;
      if( UtilString::strlenChinaese($this->name) > 6 ){
        //若标题名称字数超过6个，获取前5个，并在后面加上省略号
        $new_name = UtilString::word_trim( $this->name , 5 , TRUE );
      }
        return $new_name;
    }

    /**
     * 最高的层次，默认为3
     */
    public static function maxlevel()
    {
        return 3;//return Ptype::select("max(level)");
    }

    /**
     * 计算所有的子元素数量并存储
     */
    public function sCountChild() {
        $countChild = $this->countChild;
        if ($this->level <= 2 && $this->countChild == 0) {
            $countChild = Ptype::select("count(*)","parent_id=" . $this->ptype_id);
            if ($countChild > 0) {
                $this->countChild = $countChild;
                $this->update();
            }
        }
        return $countChild;
    }

    /**
     * 计算所有的子元素数量并存储
     */
    public static function allCountChild()
    {
        $max_id=Ptype::max();
        for($i=1;$i<=$max_id;$i++){
            $countChild=Ptype::select("count(*)","parent_id=".$i);
            Ptype::updateBy("ptype_id=".$i,"countChild=".$countChild);
        }
    }
}
?>
