<?php
/**
 +---------------------------------------<br/>
 * 广告栏目<br/>
 +---------------------------------------
 * @category kmall
 * @package
 * @author skygreen skygreen2001@gmail.com
 */
class Banner extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标识
	 * @var int
	 * @access public
	 */
	public $banner_id;
	/**
	 * 广告栏目类型<br/>
	 * 1:首页banner-indextop<br/>
	 * 2:首页排行-indexboard<br/>
	 * 3:首页精品推荐-indexrecommend<br/>
	 * 4:首页礼包左-indexPackLeft<br/>
	 * 5:首页礼包右-indexPackRight<br/>
	 * 6:首页楼层广告-indexLevelAds<br/>
	 * 7:首页家纺天地-indexTextile<br/>
	 * 8:首页家电世界-indexElectric<br/>
	 * 9:首页家居生活-indexFurnish<br/>
	 * 10:首页食品饮料-indexFood<br/>
	 * 11:首页母婴精品-indexBaby<br/>
	 * 12:首页珠宝配饰-jewelry<br/>
	 * 13:首页衣包鞋帽-indexClothes<br/>
	 * 14:首页轻奢美妆-indexLuxury<br/>
	 * 15:首页旅游户外-indexTravel<br/>
	 * 16:商品列表banner-indexProdList<br/>
	 * 17:大牌馆banner-brandTop<br/>
	 * 18:国家馆banner-countryTop<br/>
	 * 19:国家馆广告-countryLevelAds<br/>
	 * 20:活动馆banner-activeTop<br/>
	 * 21:活动馆排行-activeBoard<br/>
	 * 22:活动馆清单banner-activeBanner<br/>
	 * 23:活动馆清单广告-activeList<br/>
	 * 24:礼包馆banner-giftTop<br/>
	 * 25:礼包馆广告-giftLevelAds<br/>
	 * 26:私宠馆banner-privatepet<br/>
	 * 27:财富-理财banner-financing<br/>
	 * 28:财富-众筹banner-funding<br/>
	 * 29:财富-保险banner-Insurance<br/>
	 * 30:财富-房产banner-property<br/>
	 * 31:财富-汽车banner-car<br/>
	 * 32:拍卖馆banner-auctionTop<br/>
	 * 33:商品详情广告-goodsLevelAds<br/>
	 * 34:秒杀页面banner-limited<br/>
	 * 35:手机端首页banner-mobileIndeBanner<br/>
	 * 36:手机端首页广告-mobileIndexAds
	 * @var enum
	 * @access public
	 */
	public $type;
	/**
	 * 图片地址
	 * @var string
	 * @access public
	 */
	public $url;
	/**
	 * 图片大小
	 * @var string
	 * @access public
	 */
	public $size;
	/**
	 * 排序
	 * @var int
	 * @access public
	 */
	public $sort;
	/**
	 * 链接地址
	 * @var string
	 * @access public
	 */
	public $links;
	/**
	 * 是否显示<br/>
	 * 0:不显示 1: 显示
	 * @var string
	 * @access public
	 */
	public $isShow;
	/**
	 * 说明
	 * @var string
	 * @access public
	 */
	public $description;
	//</editor-fold>
	/**
	 * 规格说明
	 * 表中不存在的默认列定义:commitTime,updateTime
	 * @var mixed
	 */
	public $field_spec=array(
		EnumDataSpec::REMOVE=>array(
			'commitTime',
			'updateTime'
		)
	);

	/**
	 * 显示广告栏目类型<br/>
	 * 1:首页banner-indextop<br/>
	 * 2:首页排行-indexboard<br/>
	 * 3:首页精品推荐-indexrecommend<br/>
	 * 4:首页礼包左-indexPackLeft<br/>
	 * 5:首页礼包右-indexPackRight<br/>
	 * 6:首页楼层广告-indexLevelAds<br/>
	 * 7:首页家纺天地-indexTextile<br/>
	 * 8:首页家电世界-indexElectric<br/>
	 * 9:首页家居生活-indexFurnish<br/>
	 * 10:首页食品饮料-indexFood<br/>
	 * 11:首页母婴精品-indexBaby<br/>
	 * 12:首页珠宝配饰-jewelry<br/>
	 * 13:首页衣包鞋帽-indexClothes<br/>
	 * 14:首页轻奢美妆-indexLuxury<br/>
	 * 15:首页旅游户外-indexTravel<br/>
	 * 16:商品列表banner-indexProdList<br/>
	 * 17:大牌馆banner-brandTop<br/>
	 * 18:国家馆banner-countryTop<br/>
	 * 19:国家馆广告-countryLevelAds<br/>
	 * 20:活动馆banner-activeTop<br/>
	 * 21:活动馆排行-activeBoard<br/>
	 * 22:活动馆清单banner-activeBanner<br/>
	 * 23:活动馆清单广告-activeList<br/>
	 * 24:礼包馆banner-giftTop<br/>
	 * 25:礼包馆广告-giftLevelAds<br/>
	 * 26:私宠馆banner-privatepet<br/>
	 * 27:财富-理财banner-financing<br/>
	 * 28:财富-众筹banner-funding<br/>
	 * 29:财富-保险banner-Insurance<br/>
	 * 30:财富-房产banner-property<br/>
	 * 31:财富-汽车banner-car<br/>
	 * 32:拍卖馆banner-auctionTop<br/>
	 * 33:商品详情广告-goodsLevelAds<br/>
	 * 34:秒杀页面banner-limited<br/>
	 * 35:手机端首页banner-mobileIndeBanner<br/>
	 * 36:手机端首页广告-mobileIndexAds<br/>
	 */
	public function getTypeShow()
	{
		return self::typeShow($this->type);
	}

	/**
	 * 显示广告栏目类型<br/>
	 * 1:首页banner-indextop<br/>
	 * 2:首页排行-indexboard<br/>
	 * 3:首页精品推荐-indexrecommend<br/>
	 * 4:首页礼包左-indexPackLeft<br/>
	 * 5:首页礼包右-indexPackRight<br/>
	 * 6:首页楼层广告-indexLevelAds<br/>
	 * 7:首页家纺天地-indexTextile<br/>
	 * 8:首页家电世界-indexElectric<br/>
	 * 9:首页家居生活-indexFurnish<br/>
	 * 10:首页食品饮料-indexFood<br/>
	 * 11:首页母婴精品-indexBaby<br/>
	 * 12:首页珠宝配饰-jewelry<br/>
	 * 13:首页衣包鞋帽-indexClothes<br/>
	 * 14:首页轻奢美妆-indexLuxury<br/>
	 * 15:首页旅游户外-indexTravel<br/>
	 * 16:商品列表banner-indexProdList<br/>
	 * 17:大牌馆banner-brandTop<br/>
	 * 18:国家馆banner-countryTop<br/>
	 * 19:国家馆广告-countryLevelAds<br/>
	 * 20:活动馆banner-activeTop<br/>
	 * 21:活动馆排行-activeBoard<br/>
	 * 22:活动馆清单banner-activeBanner<br/>
	 * 23:活动馆清单广告-activeList<br/>
	 * 24:礼包馆banner-giftTop<br/>
	 * 25:礼包馆广告-giftLevelAds<br/>
	 * 26:私宠馆banner-privatepet<br/>
	 * 27:财富-理财banner-financing<br/>
	 * 28:财富-众筹banner-funding<br/>
	 * 29:财富-保险banner-Insurance<br/>
	 * 30:财富-房产banner-property<br/>
	 * 31:财富-汽车banner-car<br/>
	 * 32:拍卖馆banner-auctionTop<br/>
	 * 33:商品详情广告-goodsLevelAds<br/>
	 * 34:秒杀页面banner-limited<br/>
	 * 35:手机端首页banner-mobileIndeBanner<br/>
	 * 36:手机端首页广告-mobileIndexAds<br/>
	 */
	public static function typeShow($type)
	{
		return EnumBannerType::typeShow($type);
	}

}
?>
