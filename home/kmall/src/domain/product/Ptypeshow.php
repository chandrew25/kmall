<?php
/**
 +---------------------------------------<br/>
 * 商品显示
基于类型显示的产品<br/>
 +---------------------------------------
 * @category kmall
 * @package domain.product
 * @author skygreen
 */
class Ptypeshow extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $ptypeshow_id;

	/**
	 * 商品编号
	 * @var int
	 * @access public
	 */
	public $product_id;
    /**
     * 分类编号
     * @var int
     * @access public
     */
    public $ptype_id;
    /**
     * 广告词
     * @var string
     * @access public
     */
    public $message;
    /**
     * 左侧广告词
     * @var string
     * @access public
     */
    public $msgleft;
    /**
     * 右侧广告词
     * @var string
     * @access public
     */
    public $msgright;
    /**
     * 链接
     * @var string
     * @access public
     */
    public $link_url;

	/**
	 * 商品名称
	 * @var string
	 * @access public
	 */
	public $product_name;

	/**
	 * 商品缩略图
	 * @var string
	 * @access public
	 */
	public $ico;
    /**
     * 上级分类<br/>
     * 所属父产品类型唯一标识
     * @var int
     * @access public
     */
    public $parent_id;

    /**
     * 显示类型<br/>
     * 1.新品推荐<br/>
     * 2.打折优惠<br/>
     * 3.热销排行<br/>
     * @var string
     * @access public
     */
    public $showtype;

	/**
	 * 商品量词
	 *
	 * @var string
	 * @access public
	 */
	public $unit;

	/**
	 * 市场价
	 * @var string
	 * @access public
	 */
	public $market_price;

	/**
	 * 销售价
	 * @var string
	 * @access public
	 */
	public $price;

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

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "product"=>"Product",
        "ptype"=>"Ptype"
    );

	/**
	 * 处理商品名称的长度
	 * 超过指定长度截取
	 * @var int
	 * @access public
	 */
	public function getNameShow(){
		$new_name = $this->name;
		if( UtilString::strlenChinaese($this->name) > 14 ){
			//若标题名称字数超过14个，获取前12个，并在后面加上省略号
			$new_name = UtilString::word_trim( $this->name , 12 , TRUE );
		}
		return $new_name;
	}
	public function getLongNameShow(){
		$new_name = $this->name;
		if( UtilString::strlenChinaese($this->name) > 26 ){
			//若标题名称字数超过26个，获取前24个，并在后面加上省略号
			$new_name = UtilString::word_trim( $this->name , 24 , TRUE );
		}
		return $new_name;
	}

	/**
	 * 显示给用户查看的显示类型
	 */
	public static function showtypeShow($showtype){
		switch ($showtype) {
		   case 1:
				return "新品推介";
		   case 2:
				return "打折优惠";
		   case 3:
				return "热销排行";
           case 4:
                return "智能电视";
           case 5:
                return "绿色照明";
           case 6:
                return "健康电器";
           case 7:
                return "OEM产品";
           case 8:
                return "配件专区";
		}
		return "";
	}
}
?>