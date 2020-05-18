<?php
/**
 +---------------------------------------<br/>
 * 商品<br/>
 * 菲彼生活官方商城出售的商品<br/>
 +---------------------------------------
 * @category kmall
 * @package shop
 * @author skygreen skygreen2001@gmail.com
 */
class Product extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var string
     * @access public
     */
    public $product_id;
    /**
     * 商品货号<br/>
     * 商品唯一标识
     * @var string
     * @access public
     */
    public $product_code;
    /**
     * 货品内部编号
     * @var string
     * @access public
     */
    public $goods_no;
    /**
     * 是否大礼包
     * @var string
     * @access public
     */
    public $isPackage;
    /**
     * 供货商<br/>
     * 供货商的唯一标识
     * @var int
     * @access public
     */
    public $supplier_id;
    /**
     * 供应商类型<br/>
     * 1:渠道商-channel<br/>
     * 0:普通供应商-normal
     * @var enum
     * @access public
     */
    public $sptype;
    /**
     * 商品类型
     * @var int
     * @access public
     */
    public $ptype_id;
    /**
     * 商品分类查询字<br/>
     * 商品类型分类多级，方便上一级也能查找到下一级的商品<br/>
     * 如二级分类也能找到所属三级分类下的商品<br/>
     * 形式如：-1-2-3-
     * @var string
     * @access public
     */
    public $ptype_key;
    /**
     * 商品名称
     * @var string
     * @access public
     */
    public $product_name;
    /**
     * 商品品牌标识
     * @var int
     * @access public
     */
    public $brand_id;
    /**
     * 销售价
     * @var float
     * @access public
     */
    public $price;
    /**
     * 商品价格标签(如商城价、预售价等）
     * @var string
     * @access public
     */
    public $price_tag;
    /**
     * 市场价<br/>
     * 活动优惠打折后最终销售的价格
     * @var float
     * @access public
     */
    public $market_price;
    /**
     * 成本价<br/>
     * 对应商品中的平台价
     * @var float
     * @access public
     */
    public $cost;
    /**
     * 折扣
     * @var string
     * @access public
     */
    public $discount;
    /**
     * 商品规格
     * @var string
     * @access public
     */
    public $specification;
    /**
     * 商品属性
     * @var string
     * @access public
     */
    public $attr_key;
    /**
     * 商品图片
     * @var string
     * @access public
     */
    public $image;
    /**
     * 商品超大图片
     * @var string
     * @access public
     */
    public $image_large;
    /**
     * 商品量词
     * @var string
     * @access public
     */
    public $unit;
    /**
     * 标签标识。<br/>
     * 如热卖标签，标签名之间以-隔开。
     * @var string
     * @access public
     */
    public $tag_types;
    /**
     * 积分<br/>
     * 活动优惠后的积分
     * @var int
     * @access public
     */
    public $market_jifen;
    /**
     * 原积分
     * @var int
     * @access public
     */
    public $jifen;
    /**
     * 规格
     * @var string
     * @access public
     */
    public $scale;
    /**
     * 库存:数量
     * @var int
     * @access public
     */
    public $num;
    /**
     * 重量<br/>
     * 以公斤度量单位
     * @var float
     * @access public
     */
    public $weight;
    /**
     * 最低库存警报
     * @var int
     * @access public
     */
    public $low_alarm;
    /**
     * 单价<br/>
     * 进货价格
     * @var float
     * @access public
     */
    public $in_price;
    /**
     * 平台价<br/>
     * 销售价，推荐价格
     * @var float
     * @access public
     */
    public $recommend_price;
    /**
     * 批发价格
     * @var float
     * @access public
     */
    public $good_price;
    /**
     * 商品介绍
     * @var string
     * @access public
     */
    public $intro;
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
     * 广告词
     * @var string
     * @access public
     */
    public $message;
    /**
     * 销售量
     * @var int
     * @access public
     */
    public $sales_count;
    /**
     * 热度<br/>
     * 用户点击次数<br/>
     *
     * @var int
     * @access public
     */
    public $click_count;
    /**
     * 排序<br/>
     * 权重越大，越靠前
     * @var int
     * @access public
     */
    public $sort_order;
    /**
     * 是否上架
     * @var int
     * @access public
     */
    public $isUp;
    /**
     * 上架时间
     * @var int
     * @access public
     */
    public $uptime;
    /**
     * 下架时间
     * @var int
     * @access public
     */
    public $downtime;
    /**
     * 是否推荐
     * @var string
     * @access public
     */
    public $isRecommend;
    /**
     * 是否多规格<br/>
     * (默认为否)
     * @var string
     * @access public
     */
    public $isMultiplespec;
    /**
     * 是否为赠品
     * @var string
     * @access public
     */
    public $isGiveaway;
    /**
     * 配送时间-至少几天到货
     * @var string
     * @access public
     */
    public $delytime;
    /**
     * 质材
     * @var string
     * @access public
     */
    public $material_id;
    /**
     * 格风
     * @var string
     * @access public
     */
    public $style_id;
  	/**
  	 * 所属国家<br/>
  	 * 所属国家馆
  	 * @var int
  	 * @access public
  	 */
  	public $country_id;
  	/**
  	 * 销售渠道<br/>
  	 * 1: 菲商城-local<br/>
  	 * 分销平台: distribution
  	 * @var int
  	 * @access public
  	 */
  	public $sale_channel;
    //</editor-fold>

    // protected $price;
    // public static $rate=1;
    // public function __get($property){
    //   if($property=='price'){
    //     $rate=self::$rate;
    //     if ($rate==-1) {
    //       return $this->market_price;
    //     }
    //     return $this->price*$rate;
    //   }
    //   return parent::__get($property);
    // }

    // public function setPrice($value='')
    // {
    //   $this->price=$value;
    // }



    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "supplier"=>"Supplier",
        "ptype"=>"Ptype",
        "brand"=>"Brand",
    		"country"=>"Country"
    );

    /**
     * 一对多关系
     */
    static $has_many=array(
        "bproduct"=>"Bproduct",
        "bulkpurchase"=>"Bulkpurchase",
        "productlog"=>"Productlog",
        "collect"=>"Collect",
        "comment"=>"Comment",
        "seeproduct"=>"Seeproduct",
        "ptypeshow"=>"Ptypeshow",
        "productattr"=>"Productattr",
        "productattrval"=>"Productattrval",
        "seriesimg"=>"Seriesimg",
        "cart"=>"Cart",
        "coupon"=>"Coupon",
        "deliveryitem"=>"Deliveryitem",
        "orderproducts"=>"Orderproducts",
        "pseriesimg"=>"Pseriesimg",
        "warehouseproduct"=>"Warehouseproduct"
    );

    /**
     * 从属于多对多关系
     */
    static $belongs_many_many=array(
    	"activitys"=>"Activity"
    );

    /**
     * 显示供应商类型<br/>
     * 1:渠道商-channel<br/>
     *  0:普通供应商-normal<br/>
     */
    public function getSptypeShow()
    {
        return self::sptypeShow($this->sptype);
    }

    /**
     * 显示供应商类型<br/>
     * 1:渠道商-channel<br/>
     *  0:普通供应商-normal<br/>
     */
    public static function sptypeShow($sptype)
    {
        return EnumSptype::sptypeShow($sptype);
    }

    /**
     * 显示: 品牌 + 空格 + 商品名称
     */
    public function getProductShow() {
        $result = $this->product_name;
        if ($this->brand_id) {
            $brand = @Brand::get_by_id($this->brand_id);
            if ($brand) {
                $brand_name = $brand->brand_name;
                if ( !contain($result, $brand_name) ) $result = $brand_name . " " . $result;
            }
        }
        return $result;
    }
    public function getProductImg(){
        $image = Seriesimg::get("isShow=1 and product_id=".$this->product_id,"sort_order desc");
        return $image;
    }
    /**
     * 商品所在供应商默认的仓库
     * @return Warehouse 默认的仓库
     */
    public function defaultWarehouse()
    {
        return Warehouse::get_one(array("supplier_id"=>$this->supplier_id,"isDefault"=>"1"));
    }

    public function getPtype(){
        $result = array();
        if ($this->ptype_key) {
            $ptype = array_filter(explode("-", $this->ptype_key));
            $result = Ptype::get("ptype_id in(".implode(",", $ptype).")","level asc");
        }
        return $result;
    }

    public function getSeckill(){
        $seckill = array();
        if ($this->product_id) {
            $sql = "SELECT * FROM km_product_seckill as s left join km_product_seckill_re_seckillproduct as sp on s.seckill_id=sp.seckill_id where sp.sec_num>sp.bought_num and sp.product_id=".$this->product_id." and s.begin_datetime<='".date("Y-m-d H:i:s")."' and s.end_datetime >='".date("Y-m-d H:i:s")."'";
          $data = sqlExecute($sql);
          if (!empty($data)) {
              $seckill = $data[0];
          }
        }
        return $seckill;
    }

    public function getSeckillProduct(){
        $seckill = array();
        if ($this->product_id) {
            $sql = "SELECT * FROM km_product_seckill as s left join km_product_seckill_re_seckillproduct as sp on s.seckill_id=sp.seckill_id where sp.product_id=".$this->product_id." and s.begin_datetime<='".date("Y-m-d H:i:s")."' and s.end_datetime >='".date("Y-m-d H:i:s")."'";
          $data = sqlExecute($sql);
          if (!empty($data)) {
              $seckill = $data[0];
          }
        }
        return $seckill;
    }
}
?>
