<?php
/**
 +---------------------------------------<br/>
 * 服务类:所有ExtService的管理类<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class Manager_ExtService extends Manager
{
    private static $adsService;
    private static $brandService;
    private static $bproductService;
    private static $brandptypeService;
    private static $helpcenterService;
    private static $newsService;
    private static $appdownService;
    private static $appfreeService;
    private static $apphotrecommendService;
    private static $applogService;
    private static $bulkpurchaseService;
    private static $attributeService;
    private static $deliverytypeService;
    private static $departmentService;
    private static $logintypeService;
    private static $paymenttypeService;
    private static $ptypeService;
    private static $quantifierService;
    private static $regionService;
    private static $jifenlogService;
    private static $rankjifenlogService;
    private static $ocouponlogService;
    private static $pcouponlogService;
    private static $couponlogService;
    private static $deliverylogService;
    private static $orderlogService;
    private static $paylogService;
    private static $promotionlogService;
    private static $goodslogService;
    private static $contractlogService;
    private static $voucheritemslogService;
    private static $memberService;
    private static $addressService;
    private static $adminService;
    private static $collectService;
    private static $commentService;
    private static $companyService;
    private static $pwdresetService;
    private static $seeproductService;
    private static $thirdpartyloginService;
    private static $indexpageService;
    private static $couponService;
    private static $couponitemsService;
    private static $preferentialruleService;
    private static $promotionService;
    private static $prefcouponService;
    private static $prefproductService;
    private static $productService;
    private static $goodsService;
    private static $warehousegoodsService;
    private static $ptypeshowService;
    private static $productgiftService;
    private static $productspecService;
    private static $seriesimgService;
    private static $categoryService;
    private static $ptcolumnService;
    private static $ptypeattrService;
    private static $cartService;
    private static $deliveryService;
    private static $deliveryitemService;
    private static $invoiceService;
    private static $orderService;
    private static $consultService;
    private static $ordergoodsService;
    private static $workfloworderService;
    private static $paymentsService;
    private static $warehouseService;
    private static $contractService;
    private static $confilesService;
    private static $contractorderService;
    private static $supplierService;
    private static $voucherService;
    private static $vouchergoodsService;
    private static $voucheritemsService;
    private static $demoService;
    private static $bannerService;
    private static $activityService;
    private static $activityproductService;
    private static $countryService;
    private static $seckillService;
    private static $seckillproductService;

    /**
     * 提供服务:广告
     */
    public static function adsService()
    {
        if (self::$adsService==null) {
            self::$adsService=new ExtServiceAds();
        }
        return self::$adsService;
    }

    /**
     * 提供服务:品牌
     */
    public static function brandService()
    {
        if (self::$brandService==null) {
            self::$brandService=new ExtServiceBrand();
        }
        return self::$brandService;
    }

    /**
     * 提供服务:品牌推荐商品
     */
    public static function bproductService()
    {
        if (self::$bproductService==null) {
            self::$bproductService=new ExtServiceBproduct();
        }
        return self::$bproductService;
    }

    /**
     * 提供服务:品牌商品分类关系
     */
    public static function brandptypeService()
    {
        if (self::$brandptypeService==null) {
            self::$brandptypeService=new ExtServiceBrandptype();
        }
        return self::$brandptypeService;
    }

    /**
     * 提供服务:帮助中心
     */
    public static function helpcenterService()
    {
        if (self::$helpcenterService==null) {
            self::$helpcenterService=new ExtServiceHelpcenter();
        }
        return self::$helpcenterService;
    }

    /**
     * 提供服务:菲生活新闻
     */
    public static function newsService()
    {
        if (self::$newsService==null) {
            self::$newsService=new ExtServiceNews();
        }
        return self::$newsService;
    }

    /**
     * 提供服务:应用下载
     */
    public static function appdownService()
    {
        if (self::$appdownService==null) {
            self::$appdownService=new ExtServiceAppdown();
        }
        return self::$appdownService;
    }

    /**
     * 提供服务:免费应用下载
     */
    public static function appfreeService()
    {
        if (self::$appfreeService==null) {
            self::$appfreeService=new ExtServiceAppfree();
        }
        return self::$appfreeService;
    }

    /**
     * 提供服务:热门推荐应用下载
     */
    public static function apphotrecommendService()
    {
        if (self::$apphotrecommendService==null) {
            self::$apphotrecommendService=new ExtServiceApphotrecommend();
        }
        return self::$apphotrecommendService;
    }

    /**
     * 提供服务:下载记录日志表
     */
    public static function applogService()
    {
        if (self::$applogService==null) {
            self::$applogService=new ExtServiceApplog();
        }
        return self::$applogService;
    }

    /**
     * 提供服务:大宗采购
     */
    public static function bulkpurchaseService()
    {
        if (self::$bulkpurchaseService==null) {
            self::$bulkpurchaseService=new ExtServiceBulkpurchase();
        }
        return self::$bulkpurchaseService;
    }

    /**
     * 提供服务:属性表
     */
    public static function attributeService()
    {
        if (self::$attributeService==null) {
            self::$attributeService=new ExtServiceAttribute();
        }
        return self::$attributeService;
    }

    /**
     * 提供服务:配送方式
     */
    public static function deliverytypeService()
    {
        if (self::$deliverytypeService==null) {
            self::$deliverytypeService=new ExtServiceDeliverytype();
        }
        return self::$deliverytypeService;
    }

    /**
     * 提供服务:部门
     */
    public static function departmentService()
    {
        if (self::$departmentService==null) {
            self::$departmentService=new ExtServiceDepartment();
        }
        return self::$departmentService;
    }

    /**
     * 提供服务:登录类型
     */
    public static function logintypeService()
    {
        if (self::$logintypeService==null) {
            self::$logintypeService=new ExtServiceLogintype();
        }
        return self::$logintypeService;
    }

    /**
     * 提供服务:支付方式
     */
    public static function paymenttypeService()
    {
        if (self::$paymenttypeService==null) {
            self::$paymenttypeService=new ExtServicePaymenttype();
        }
        return self::$paymenttypeService;
    }

    /**
     * 提供服务:商品类型
     */
    public static function ptypeService()
    {
        if (self::$ptypeService==null) {
            self::$ptypeService=new ExtServicePtype();
        }
        return self::$ptypeService;
    }

    /**
     * 提供服务:量词
     */
    public static function quantifierService()
    {
        if (self::$quantifierService==null) {
            self::$quantifierService=new ExtServiceQuantifier();
        }
        return self::$quantifierService;
    }

    /**
     * 提供服务:地区
     */
    public static function regionService()
    {
        if (self::$regionService==null) {
            self::$regionService=new ExtServiceRegion();
        }
        return self::$regionService;
    }

    /**
     * 提供服务:会员积分日志
     */
    public static function jifenlogService()
    {
        if (self::$jifenlogService==null) {
            self::$jifenlogService=new ExtServiceJifenlog();
        }
        return self::$jifenlogService;
    }

    /**
     * 提供服务:会员等级积分日志
     */
    public static function rankjifenlogService()
    {
        if (self::$rankjifenlogService==null) {
            self::$rankjifenlogService=new ExtServiceRankjifenlog();
        }
        return self::$rankjifenlogService;
    }

    /**
     * 提供服务:订单生成优惠券记录表
     */
    public static function ocouponlogService()
    {
        if (self::$ocouponlogService==null) {
            self::$ocouponlogService=new ExtServiceOcouponlog();
        }
        return self::$ocouponlogService;
    }

    /**
     * 提供服务:促销生成优惠券记录表
     */
    public static function pcouponlogService()
    {
        if (self::$pcouponlogService==null) {
            self::$pcouponlogService=new ExtServicePcouponlog();
        }
        return self::$pcouponlogService;
    }

    /**
     * 提供服务:优惠券使用记录表
     */
    public static function couponlogService()
    {
        if (self::$couponlogService==null) {
            self::$couponlogService=new ExtServiceCouponlog();
        }
        return self::$couponlogService;
    }

    /**
     * 提供服务:收发货记录
     */
    public static function deliverylogService()
    {
        if (self::$deliverylogService==null) {
            self::$deliverylogService=new ExtServiceDeliverylog();
        }
        return self::$deliverylogService;
    }

    /**
     * 提供服务:订单日志
     */
    public static function orderlogService()
    {
        if (self::$orderlogService==null) {
            self::$orderlogService=new ExtServiceOrderlog();
        }
        return self::$orderlogService;
    }

    /**
     * 提供服务:收退款记录
     */
    public static function paylogService()
    {
        if (self::$paylogService==null) {
            self::$paylogService=new ExtServicePaylog();
        }
        return self::$paylogService;
    }

    /**
     * 提供服务:订单优惠记录表
     */
    public static function promotionlogService()
    {
        if (self::$promotionlogService==null) {
            self::$promotionlogService=new ExtServicePromotionlog();
        }
        return self::$promotionlogService;
    }

    /**
     * 提供服务:产品出入库日志
     */
    public static function goodslogService()
    {
        if (self::$goodslogService==null) {
            self::$goodslogService=new ExtServiceGoodslog();
        }
        return self::$goodslogService;
    }

    /**
     * 提供服务:合同日志
     */
    public static function contractlogService()
    {
        if (self::$contractlogService==null) {
            self::$contractlogService=new ExtServiceContractlog();
        }
        return self::$contractlogService;
    }

    /**
     * 提供服务:兑换券使用日志表
     */
    public static function voucheritemslogService()
    {
        if (self::$voucheritemslogService==null) {
            self::$voucheritemslogService=new ExtServiceVoucheritemslog();
        }
        return self::$voucheritemslogService;
    }

    /**
     * 提供服务:会员商城平台的用户、会员。
     */
    public static function memberService()
    {
        if (self::$memberService==null) {
            self::$memberService=new ExtServiceMember();
        }
        return self::$memberService;
    }

    /**
     * 提供服务:会员收货人地址信息
     */
    public static function addressService()
    {
        if (self::$addressService==null) {
            self::$addressService=new ExtServiceAddress();
        }
        return self::$addressService;
    }

    /**
     * 提供服务:系统管理人员
     */
    public static function adminService()
    {
        if (self::$adminService==null) {
            self::$adminService=new ExtServiceAdmin();
        }
        return self::$adminService;
    }

    /**
     * 提供服务:会员收藏商品
     */
    public static function collectService()
    {
        if (self::$collectService==null) {
            self::$collectService=new ExtServiceCollect();
        }
        return self::$collectService;
    }

    /**
     * 提供服务:会员评论
     */
    public static function commentService()
    {
        if (self::$commentService==null) {
            self::$commentService=new ExtServiceComment();
        }
        return self::$commentService;
    }

    /**
     * 提供服务:企业信息
     */
    public static function companyService()
    {
        if (self::$companyService==null) {
            self::$companyService=new ExtServiceCompany();
        }
        return self::$companyService;
    }

    /**
     * 提供服务:密码重置
     */
    public static function pwdresetService()
    {
        if (self::$pwdresetService==null) {
            self::$pwdresetService=new ExtServicePwdreset();
        }
        return self::$pwdresetService;
    }

    /**
     * 提供服务:会员最近浏览过的商品
     */
    public static function seeproductService()
    {
        if (self::$seeproductService==null) {
            self::$seeproductService=new ExtServiceSeeproduct();
        }
        return self::$seeproductService;
    }

    /**
     * 提供服务:第三方登录
     */
    public static function thirdpartyloginService()
    {
        if (self::$thirdpartyloginService==null) {
            self::$thirdpartyloginService=new ExtServiceThirdpartylogin();
        }
        return self::$thirdpartyloginService;
    }

    /**
     * 提供服务:动态首页
     */
    public static function indexpageService()
    {
        if (self::$indexpageService==null) {
            self::$indexpageService=new ExtServiceIndexpage();
        }
        return self::$indexpageService;
    }

    /**
     * 提供服务:优惠券表
     */
    public static function couponService()
    {
        if (self::$couponService==null) {
            self::$couponService=new ExtServiceCoupon();
        }
        return self::$couponService;
    }

    /**
     * 提供服务:优惠券实体表
     */
    public static function couponitemsService()
    {
        if (self::$couponitemsService==null) {
            self::$couponitemsService=new ExtServiceCouponitems();
        }
        return self::$couponitemsService;
    }

    /**
     * 提供服务:优惠规则表
     */
    public static function preferentialruleService()
    {
        if (self::$preferentialruleService==null) {
            self::$preferentialruleService=new ExtServicePreferentialrule();
        }
        return self::$preferentialruleService;
    }

    /**
     * 提供服务:促销活动表
     */
    public static function promotionService()
    {
        if (self::$promotionService==null) {
            self::$promotionService=new ExtServicePromotion();
        }
        return self::$promotionService;
    }

    /**
     * 提供服务:优惠规则作用优惠券表
     */
    public static function prefcouponService()
    {
        if (self::$prefcouponService==null) {
            self::$prefcouponService=new ExtServicePrefcoupon();
        }
        return self::$prefcouponService;
    }

    /**
     * 提供服务:优惠规则作用商品表
     */
    public static function prefproductService()
    {
        if (self::$prefproductService==null) {
            self::$prefproductService=new ExtServicePrefproduct();
        }
        return self::$prefproductService;
    }

    /**
     * 提供服务:菲生活官方商城出售的商品
     */
    public static function productService()
    {
        if (self::$productService==null) {
            self::$productService=new ExtServiceProduct();
        }
        return self::$productService;
    }

    /**
     * 提供服务:货品表
     */
    public static function goodsService()
    {
        if (self::$goodsService==null) {
            self::$goodsService=new ExtServiceGoods();
        }
        return self::$goodsService;
    }

    /**
     * 提供服务:仓库货品表
     */
    public static function warehousegoodsService()
    {
        if (self::$warehousegoodsService==null) {
            self::$warehousegoodsService=new ExtServiceWarehouseGoods();
        }
        return self::$warehousegoodsService;
    }
    /**
     * 提供服务:商品显示
     */
    public static function ptypeshowService()
    {
        if (self::$ptypeshowService==null) {
            self::$ptypeshowService=new ExtServicePtypeshow();
        }
        return self::$ptypeshowService;
    }

    /**
     * 提供服务:商品赠品
     */
    public static function productgiftService()
    {
        if (self::$productgiftService==null) {
            self::$productgiftService=new ExtServiceProductgift();
        }
        return self::$productgiftService;
    }

    /**
     * 提供服务:商品规格
     */
    public static function productspecService()
    {
        if (self::$productspecService==null) {
            self::$productspecService=new ExtServiceProductspec();
        }
        return self::$productspecService;
    }

    /**
     * 提供服务:商品图片
     */
    public static function seriesimgService()
    {
        if (self::$seriesimgService==null) {
            self::$seriesimgService=new ExtServiceSeriesimg();
        }
        return self::$seriesimgService;
    }

    /**
     * 提供服务:分类显示
     */
    public static function categoryService()
    {
        if (self::$categoryService==null) {
            self::$categoryService=new ExtServiceCategory();
        }
        return self::$categoryService;
    }

    /**
     * 提供服务:商品分类所属栏目
     */
    public static function ptcolumnService()
    {
        if (self::$ptcolumnService==null) {
            self::$ptcolumnService=new ExtServicePtcolumn();
        }
        return self::$ptcolumnService;
    }

    /**
     * 提供服务:分类属性
     */
    public static function ptypeattrService()
    {
        if (self::$ptypeattrService==null) {
            self::$ptypeattrService=new ExtServicePtypeattr();
        }
        return self::$ptypeattrService;
    }

    /**
     * 提供服务:购物车
     */
    public static function cartService()
    {
        if (self::$cartService==null) {
            self::$cartService=new ExtServiceCart();
        }
        return self::$cartService;
    }

    /**
     * 提供服务:物流
     */
    public static function deliveryService()
    {
        if (self::$deliveryService==null) {
            self::$deliveryService=new ExtServiceDelivery();
        }
        return self::$deliveryService;
    }

    /**
     * 提供服务:运送商品
     */
    public static function deliveryitemService()
    {
        if (self::$deliveryitemService==null) {
            self::$deliveryitemService=new ExtServiceDeliveryitem();
        }
        return self::$deliveryitemService;
    }

    /**
     * 提供服务:订单发票
     */
    public static function invoiceService()
    {
        if (self::$invoiceService==null) {
            self::$invoiceService=new ExtServiceInvoice();
        }
        return self::$invoiceService;
    }

    /**
     * 提供服务:用户的订单
     */
    public static function orderService()
    {
        if (self::$orderService==null) {
            self::$orderService=new ExtServiceOrder();
        }
        return self::$orderService;
    }

    /**
     * 提供服务:顾客留言
     */
    public static function consultService()
    {
        if (self::$consultService==null) {
            self::$consultService=new ExtServiceConsult();
        }
        return self::$consultService;
    }

    /**
     * 提供服务:订购商品
     */
    public static function ordergoodsService()
    {
        if (self::$ordergoodsService==null) {
            self::$ordergoodsService=new ExtServiceOrdergoods();
        }
        return self::$ordergoodsService;
    }

    /**
     * 提供服务:订单操作工作流
     */
    public static function workfloworderService()
    {
        if (self::$workfloworderService==null) {
            self::$workfloworderService=new ExtServiceWorkfloworder();
        }
        return self::$workfloworderService;
    }

    /**
     * 提供服务:支付
     */
    public static function paymentsService()
    {
        if (self::$paymentsService==null) {
            self::$paymentsService=new ExtServicePayments();
        }
        return self::$paymentsService;
    }

    /**
     * 提供服务:仓库
     */
    public static function warehouseService()
    {
        if (self::$warehouseService==null) {
            self::$warehouseService=new ExtServiceWarehouse();
        }
        return self::$warehouseService;
    }

    /**
     * 提供服务:合同
     */
    public static function contractService()
    {
        if (self::$contractService==null) {
            self::$contractService=new ExtServiceContract();
        }
        return self::$contractService;
    }

    /**
     * 提供服务:合同文件
     */
    public static function confilesService()
    {
        if (self::$confilesService==null) {
            self::$confilesService=new ExtServiceConfiles();
        }
        return self::$confilesService;
    }

    /**
     * 提供服务:合同订单
     */
    public static function contractorderService()
    {
        if (self::$contractorderService==null) {
            self::$contractorderService=new ExtServiceContractorder();
        }
        return self::$contractorderService;
    }

    /**
     * 提供服务:供应商
     */
    public static function supplierService()
    {
        if (self::$supplierService==null) {
            self::$supplierService=new ExtServiceSupplier();
        }
        return self::$supplierService;
    }

    /**
     * 提供服务:兑换券
     */
    public static function voucherService()
    {
        if (self::$voucherService==null) {
            self::$voucherService=new ExtServiceVoucher();
        }
        return self::$voucherService;
    }

    /**
     * 提供服务:兑换券规则作用商品表
     */
    public static function vouchergoodsService()
    {
        if (self::$vouchergoodsService==null) {
            self::$vouchergoodsService=new ExtServiceVouchergoods();
        }
        return self::$vouchergoodsService;
    }

    /**
     * 提供服务:兑换券实体表
     */
    public static function voucheritemsService()
    {
        if (self::$voucheritemsService==null) {
            self::$voucheritemsService=new ExtServiceVoucheritems();
        }
        return self::$voucheritemsService;
    }

    /**
     * 提供服务:兑换券实体表
     */
    public static function demoService()
    {
        if (self::$demoService==null) {
            self::$demoService=new ExtServiceDemo();
        }
        return self::$demoService;
    }

    /**
     * 提供服务:广告栏目
     */
    public static function bannerService()
    {
        if (self::$bannerService==null) {
            self::$bannerService=new ExtServiceBanner();
        }
        return self::$bannerService;
    }

    /**
     * 提供服务:活动
     */
    public static function activityService()
    {
        if (self::$activityService==null) {
            self::$activityService=new ExtServiceActivity();
        }
        return self::$activityService;
    }

    /**
     * 提供服务:活动拥有的商品
     */
    public static function activityproductService()
    {
        if (self::$activityproductService==null) {
            self::$activityproductService=new ExtServiceActivityproduct();
        }
        return self::$activityproductService;
    }

    /**
     * 提供服务:国家
     */
    public static function countryService()
    {
        if (self::$countryService==null) {
            self::$countryService=new ExtServiceCountry();
        }
        return self::$countryService;
    }

    /**
     * 提供服务:秒杀商品
     */
    public static function seckillService()
    {
        if (self::$seckillService==null) {
            self::$seckillService=new ExtServiceSeckill();
        }
        return self::$seckillService;
    }
    
    /**
     * 提供服务:秒杀商品
     */
    public static function seckillproductService()
    {
        if (self::$seckillproductService==null) {
            self::$seckillproductService=new ExtServiceSeckillproduct();
        }
        return self::$seckillproductService;
    }
}
?>
