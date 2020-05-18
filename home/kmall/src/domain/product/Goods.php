<?php
/**
 +---------------------------------------<br/>
 * 货品表<br/>
 +---------------------------------------
 * @category kmall
 * @package product
 * @author skygreen skygreen2001@gmail.com
 */
class Goods extends DataObject
{
  //<editor-fold defaultstate="collapsed" desc="定义部分">
  /**
   * 标识
   * @var int
   * @access public
   */
  public $goods_id;
  /**
   * 货号
   * @var string
   * @access public
   */
  public $goods_code;
  /**
   * 货品名称
   * @var string
   * @access public
   */
  public $goods_name;
  /**
   * 商品标识
   * @var int
   * @access public
   */
  public $product_id;
  /**
   * 货品规格值<br/>
   * (eg:如两种规格 -1-2- )
   * @var string
   * @access public
   */
  public $pspec_key;
  /**
   * 商品属性
   * @var string
   * @access public
   */
  public $attr_key;
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
   * 商品品牌标识
   * @var int
   * @access public
   */
  public $brand_id;
  /**
   * 成本价
   * @var float
   * @access public
   */
  public $cost_price;
  /**
   * 市场价
   * @var float
   * @access public
   */
  public $market_price;
  /**
   * 积分
   * @var float
   * @access public
   */
  public $jifen;
  /**
   * 是否上架
   * @var string
   * @access public
   */
  public $isUp;
  /**
   * 库存
   * @var int
   * @access public
   */
  public $stock;
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
  /**
   * 是否为赠品
   * @var string
   * @access public
   */
  public $isGiveaway;
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
   * 销售价
   * @var float
   * @access public
   */
  public $sales_price;
  // public $sales_price;

  //</editor-fold>
  //货品对应商品   多对一
  static $belong_has_one=array(
    "product"=>"Product",
    "supplier"=>"Supplier",
    "mealgoods"=>"Mealgoods"
  );

/*  public static $rate=1;
  public function __get($property){
    if($property=='sales_price'){
      $rate=self::$rate;
      if ($rate==-1) {
        return $this->market_price;
      }
      $this->market_price=$this->sales_price*$rate;
      return $this->sales_price*$rate;
    }
    return parent::__get($property);
  }

  public function setSales_price($value='')
  {
    $this->sales_price=$value;
  }*/
  /**
   * 货品所在供应商默认的仓库
   * @return Warehouse 默认的仓库
   */
  public function defaultWarehouse()
  {
    return Warehouse::get_one(array("supplier_id"=>$this->supplier_id,"isDefault"=>"1"));
  }

  public function toJson($isAll = false){
    return json_encode($this);
  }

  /**
   * 显示: 品牌 + 空格 + 商品名称
   */
  public function getProductShow() {
      $result = $this->goods_name;
      if ($this->brand_id) {
          $brand = @Brand::get_by_id($this->brand_id);
          if ($brand) {
              $brand_name = $brand->brand_name;
              if ( !contain($result, $brand_name) ) $result = $brand_name . " " . $result;
          }
      }
      return $result;
  }

}
?>
