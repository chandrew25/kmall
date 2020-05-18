<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:广告栏目类型  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumBannerType extends Enum
{
	/**
	 * 广告栏目类型:首页banner
	 */
	const INDEXTOP='1';
	/**
	 * 广告栏目类型:首页排行
	 */
	const INDEXBOARD='2';
	/**
	 * 广告栏目类型:首页精品推荐
	 */
	const INDEXRECOMMEND='3';
	/**
	 * 广告栏目类型:首页礼包左
	 */
	const INDEXPACKLEFT='4';
	/**
	 * 广告栏目类型:首页礼包右
	 */
	const INDEXPACKRIGHT='5';
	/**
	 * 广告栏目类型:首页楼层广告
	 */
	const INDEXLEVELADS='6';
	/**
	 * 广告栏目类型:首页家纺天地
	 */
	const INDEXTEXTILE='7';
	/**
	 * 广告栏目类型:首页家电世界
	 */
	const INDEXELECTRIC='8';
	/**
	 * 广告栏目类型:首页家居生活
	 */
	const INDEXFURNISH='9';
	/**
	 * 广告栏目类型:首页食品饮料
	 */
	const INDEXFOOD='10';
	/**
	 * 广告栏目类型:首页母婴精品
	 */
	const INDEXBABY='11';
	/**
	 * 广告栏目类型:首页珠宝配饰
	 */
	const JEWELRY='12';
	/**
	 * 广告栏目类型:首页衣包鞋帽
	 */
	const INDEXCLOTHES='13';
	/**
	 * 广告栏目类型:首页轻奢美妆
	 */
	const INDEXLUXURY='14';
	/**
	 * 广告栏目类型:首页旅游户外
	 */
	const INDEXTRAVEL='15';
	/**
	 * 广告栏目类型:商品列表banner
	 */
	const INDEXPRODLIST='16';
	/**
	 * 广告栏目类型:大牌馆banner
	 */
	const BRANDTOP='17';
	/**
	 * 广告栏目类型:国家馆banner
	 */
	const COUNTRYTOP='18';
	/**
	 * 广告栏目类型:国家馆广告
	 */
	const COUNTRYLEVELADS='19';
	/**
	 * 广告栏目类型:活动馆banner
	 */
	const ACTIVETOP='20';
	/**
	 * 广告栏目类型:活动馆排行
	 */
	const ACTIVEBOARD='21';
	/**
	 * 广告栏目类型:活动馆清单banner
	 */
	const ACTIVEBANNER='22';
	/**
	 * 广告栏目类型:活动馆清单广告
	 */
	const ACTIVELIST='23';
	/**
	 * 广告栏目类型:礼包馆banner
	 */
	const GIFTTOP='24';
	/**
	 * 广告栏目类型:礼包馆广告
	 */
	const GIFTLEVELADS='25';
	/**
	 * 广告栏目类型:私宠馆banner
	 */
	const PRIVATEPET='26';
	/**
	 * 广告栏目类型:财富-理财banner
	 */
	const FINANCING='27';
	/**
	 * 广告栏目类型:财富-众筹banner
	 */
	const FUNDING='28';
	/**
	 * 广告栏目类型:财富-保险banner
	 */
	const INSURANCE='29';
	/**
	 * 广告栏目类型:财富-房产banner
	 */
	const PROPERTY='30';
	/**
	 * 广告栏目类型:财富-汽车banner
	 */
	const CAR='31';
	/**
	 * 广告栏目类型:拍卖馆banner
	 */
	const AUCTIONTOP='32';
	/**
	 * 广告栏目类型:商品详情广告
	 */
	const GOODSLEVELADS='33';
	/**
	 * 广告栏目类型:秒杀页面banner
	 */
	const LIMITED='34';
	/**
	 * 广告栏目类型:手机端首页banner
	 */
	const MOBILEINDEBANNER='35';
	/**
	 * 广告栏目类型:手机端首页广告
	 */
	const MOBILEINDEXADS='36';

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
		switch($type){
			case self::INDEXTOP:
				return "首页banner";
			case self::INDEXBOARD:
				return "首页排行";
			case self::INDEXRECOMMEND:
				return "首页精品推荐";
			case self::INDEXPACKLEFT:
				return "首页礼包左";
			case self::INDEXPACKRIGHT:
				return "首页礼包右";
			case self::INDEXLEVELADS:
				return "首页楼层广告";
			case self::INDEXTEXTILE:
				return "首页家纺天地";
			case self::INDEXELECTRIC:
				return "首页家电世界";
			case self::INDEXFURNISH:
				return "首页家居生活";
			case self::INDEXFOOD:
				return "首页食品饮料";
			case self::INDEXBABY:
				return "首页母婴精品";
			case self::JEWELRY:
				return "首页珠宝配饰";
			case self::INDEXCLOTHES:
				return "首页衣包鞋帽";
			case self::INDEXLUXURY:
				return "首页轻奢美妆";
			case self::INDEXTRAVEL:
				return "首页旅游户外";
			case self::INDEXPRODLIST:
				return "商品列表banner";
			case self::BRANDTOP:
				return "大牌馆banner";
			case self::COUNTRYTOP:
				return "国家馆banner";
			case self::COUNTRYLEVELADS:
				return "国家馆广告";
			case self::ACTIVETOP:
				return "活动馆banner";
			case self::ACTIVEBOARD:
				return "活动馆排行";
			case self::ACTIVEBANNER:
				return "活动馆清单banner";
			case self::ACTIVELIST:
				return "活动馆清单广告";
			case self::GIFTTOP:
				return "礼包馆banner";
			case self::GIFTLEVELADS:
				return "礼包馆广告";
			case self::PRIVATEPET:
				return "私宠馆banner";
			case self::FINANCING:
				return "财富-理财banner";
			case self::FUNDING:
				return "财富-众筹banner";
			case self::INSURANCE:
				return "财富-保险banner";
			case self::PROPERTY:
				return "财富-房产banner";
			case self::CAR:
				return "财富-汽车banner";
			case self::AUCTIONTOP:
				return "拍卖馆banner";
			case self::GOODSLEVELADS:
				return "商品详情广告";
			case self::LIMITED:
				return "秒杀页面banner";
			case self::MOBILEINDEBANNER:
				return "手机端首页banner";
			case self::MOBILEINDEXADS:
				return "手机端首页广告";
		}
		return "未知";
	}

	/**
	 * 根据广告栏目类型显示文字获取广告栏目类型<br/>
	 * @param mixed $typeShow 广告栏目类型显示文字
	 */
	public static function typeByShow($typeShow)
	{
		switch($typeShow){
			case "首页banner":
				return self::INDEXTOP;
			case "首页排行":
				return self::INDEXBOARD;
			case "首页精品推荐":
				return self::INDEXRECOMMEND;
			case "首页礼包左":
				return self::INDEXPACKLEFT;
			case "首页礼包右":
				return self::INDEXPACKRIGHT;
			case "首页楼层广告":
				return self::INDEXLEVELADS;
			case "首页家纺天地":
				return self::INDEXTEXTILE;
			case "首页家电世界":
				return self::INDEXELECTRIC;
			case "首页家居生活":
				return self::INDEXFURNISH;
			case "首页食品饮料":
				return self::INDEXFOOD;
			case "首页母婴精品":
				return self::INDEXBABY;
			case "首页珠宝配饰":
				return self::JEWELRY;
			case "首页衣包鞋帽":
				return self::INDEXCLOTHES;
			case "首页轻奢美妆":
				return self::INDEXLUXURY;
			case "首页旅游户外":
				return self::INDEXTRAVEL;
			case "商品列表banner":
				return self::INDEXPRODLIST;
			case "大牌馆banner":
				return self::BRANDTOP;
			case "国家馆banner":
				return self::COUNTRYTOP;
			case "国家馆广告":
				return self::COUNTRYLEVELADS;
			case "活动馆banner":
				return self::ACTIVETOP;
			case "活动馆排行":
				return self::ACTIVEBOARD;
			case "活动馆清单banner":
				return self::ACTIVEBANNER;
			case "活动馆清单广告":
				return self::ACTIVELIST;
			case "礼包馆banner":
				return self::GIFTTOP;
			case "礼包馆广告":
				return self::GIFTLEVELADS;
			case "私宠馆banner":
				return self::PRIVATEPET;
			case "财富-理财banner":
				return self::FINANCING;
			case "财富-众筹banner":
				return self::FUNDING;
			case "财富-保险banner":
				return self::INSURANCE;
			case "财富-房产banner":
				return self::PROPERTY;
			case "财富-汽车banner":
				return self::CAR;
			case "拍卖馆banner":
				return self::AUCTIONTOP;
			case "商品详情广告":
				return self::GOODSLEVELADS;
			case "秒杀页面banner":
				return self::LIMITED;
			case "手机端首页banner":
				return self::MOBILEINDEBANNER;
			case "手机端首页广告":
				return self::MOBILEINDEXADS;
		}
		return self::INDEXTOP;
	}

	/**
	 * 通过枚举值获取枚举键定义<br/>
	 */
	public static function typeEnumKey($type)
	{
		switch($type){
			case '1':
				return "INDEXTOP";
			case '2':
				return "INDEXBOARD";
			case '3':
				return "INDEXRECOMMEND";
			case '4':
				return "INDEXPACKLEFT";
			case '5':
				return "INDEXPACKRIGHT";
			case '6':
				return "INDEXLEVELADS";
			case '7':
				return "INDEXTEXTILE";
			case '8':
				return "INDEXELECTRIC";
			case '9':
				return "INDEXFURNISH";
			case '10':
				return "INDEXFOOD";
			case '11':
				return "INDEXBABY";
			case '12':
				return "JEWELRY";
			case '13':
				return "INDEXCLOTHES";
			case '14':
				return "INDEXLUXURY";
			case '15':
				return "INDEXTRAVEL";
			case '16':
				return "INDEXPRODLIST";
			case '17':
				return "BRANDTOP";
			case '18':
				return "COUNTRYTOP";
			case '19':
				return "COUNTRYLEVELADS";
			case '20':
				return "ACTIVETOP";
			case '21':
				return "ACTIVEBOARD";
			case '22':
				return "ACTIVEBANNER";
			case '23':
				return "ACTIVELIST";
			case '24':
				return "GIFTTOP";
			case '25':
				return "GIFTLEVELADS";
			case '26':
				return "PRIVATEPET";
			case '27':
				return "FINANCING";
			case '28':
				return "FUNDING";
			case '29':
				return "INSURANCE";
			case '30':
				return "PROPERTY";
			case '31':
				return "CAR";
			case '32':
				return "AUCTIONTOP";
			case '33':
				return "GOODSLEVELADS";
			case '34':
				return "LIMITED";
			case '35':
				return "MOBILEINDEBANNER";
			case '36':
				return "MOBILEINDEXADS";
		}
		return "INDEXTOP";
	}

}
?>
