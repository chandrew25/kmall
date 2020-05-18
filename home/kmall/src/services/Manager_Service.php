<?php
/**
 +---------------------------------------<br/>
 * 服务类:所有Service的管理类<br/>
 +---------------------------------------
 * @category kmall
 * @package services
 * @author skygreen skygreen2001@gmail.com
 */
class Manager_Service extends Manager
{
	private static $deliverytypeService;
	private static $appService;
    private static $appdownService;
    private static $attributeService;
    private static $cardproductService;
    private static $productimportService;
    private static $couponimportService;
    private static $couponService;
    private static $couponproductService;
    private static $cptypeshowService;
    private static $fastpickService;
    private static $userService;
    private static $adsService;
    private static $brandService;
    private static $btypeshowService;
    private static $bulkpurchaseService;
    private static $commentService;
    private static $btypeService;
    private static $ptypeService;
    private static $regionService;
    private static $magazineService;
    private static $memberService;
    private static $addressService;
    private static $productService;
    private static $productattrService;
    private static $productattrvalService;
    private static $pbatchService;
    private static $pbtypeService;
    private static $ptypeattrService;
    private static $ptypeshowService;
    private static $btbrandService;
    private static $paymenttypeService;
    private static $cartService;
    private static $orderService;
    private static $orderproductsService;
    private static $seeproductService;
    private static $classicaseService;
    private static $customizeService;
    private static $answerService;
    private static $newsService;
    private static $companyService;
    private static $seriesimgService;
    private static $helpcenterService;
    private static $collectService;
    private static $brandptypeService;
    private static $invoiceService;
    private static $refundcommentService;
    private static $refundproductsService;
    private static $cbrandService;
    private static $indexpageService;

    /**
     * 提供服务:首页设置
     */
    public static function rateruleService()
    {
        if (self::$indexpageService==null) {
            self::$indexpageService=new ExtServiceIndexpage();
        }
        return self::$indexpageService;
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
     * 提供服务:应用平台
     */
    public static function appService()
    {
        if (self::$appService==null) {
            self::$appService=new ExtServiceApp();
        }
        return self::$appService;
    }

    /**
     * 提供服务:应用下载
     */
    public static function appdownService()
    {
        if (self::$appdownService==null) {
            self::$appdownService=new ServiceAppdown();
        }
        return self::$appdownService;
    }

    /**
     * 提供服务:属性表
     */
    public static function attributeService()
    {
        if (self::$attributeService==null) {
            self::$attributeService=new ServiceAttribute();
        }
        return self::$attributeService;
    }

    /**
     * 提供服务:兑换商品
     */
    public static function cardproductService()
    {
        if (self::$cardproductService==null) {
            self::$cardproductService=new ServiceCardproduct();
        }
        return self::$cardproductService;
    }

    /**
     * 提供服务:商品导入
     */
    public static function productimportService()
    {
        if (self::$productimportService==null) {
            self::$productimportService=new ServiceProductimport();
        }
        return self::$productimportService;
    }

    /**
     * 提供服务:票券导入
     */
    public static function couponimportService()
    {
        if (self::$couponimportService==null) {
            self::$couponimportService=new ServiceCouponimport();
        }
        return self::$couponimportService;
    }

    /**
     * 提供服务:票券
     */
    public static function couponService()
    {
        if (self::$couponService==null) {
            self::$couponService=new ServiceCoupon();
        }
        return self::$couponService;
    }

    /**
     * 提供服务:票券商品
     */
    public static function couponproductService()
    {
        if (self::$couponproductService==null) {
            self::$couponproductService=new ServiceCouponproduct();
        }
        return self::$couponproductService;
    }

    /**
     * 提供服务:商品显示
     */
    public static function cptypeshowService()
    {
        if (self::$cptypeshowService==null) {
            self::$cptypeshowService=new ServiceCptypeshow();
        }
        return self::$cptypeshowService;
    }

    /**
     * 提供服务:快速提货
     */
    public static function fastpickService()
    {
        if (self::$fastpickService==null) {
            self::$fastpickService=new ServiceFastpick();
        }
        return self::$fastpickService;
    }

    /**
     * 提供服务:会员最近浏览过的商品
     */
    public static function seeproductService()
    {
        if (self::$seeproductService==null) {
            self::$seeproductService=new ServiceSeeproduct();
        }
        return self::$seeproductService;
    }

    /**
     * 提供服务:广告
     */
    public static function adsService() {
        if (self::$adsService==null) {
            self::$adsService=new ServiceAds();
        }
        return self::$adsService;
    }
    /**
     * 提供服务:品牌
     */
    public static function brandService() {
        if (self::$brandService==null) {
            self::$brandService=new ServiceBrand();
        }
        return self::$brandService;
    }
    /**
     * 提供服务:品牌显示基于类型显示品牌
     */
    public static function btypeshowService() {
        if (self::$btypeshowService==null) {
            self::$btypeshowService=new ServiceBtypeshow();
        }
        return self::$btypeshowService;
    }
    /**
     * 提供服务:业务分类推荐品牌
     */
    public static function btbrandService()
    {
        if (self::$btbrandService==null) {
            self::$btbrandService=new ServiceBtbrand();
        }
        return self::$btbrandService;
    }

    /**
     * 提供服务:大宗采购
     */
    public static function bulkpurchaseService()
    {
        if (self::$bulkpurchaseService==null) {
            self::$bulkpurchaseService=new ServiceBulkpurchase();
        }
        return self::$bulkpurchaseService;
    }

    /**
     * 提供服务:评论
     */
    public static function commentService() {
        if (self::$commentService==null) {
            self::$commentService=new ServiceComment();
        }
        return self::$commentService;
    }
    /**
     * 提供服务:业务类型
     */
    public static function btypeService() {
        if (self::$btypeService==null) {
            self::$btypeService=new ServiceBtype();
        }
        return self::$btypeService;
    }
    /**
     * 提供服务:商品类型
     */
    public static function ptypeService() {
        if (self::$ptypeService==null) {
            self::$ptypeService=new ServicePtype();
        }
        return self::$ptypeService;
    }
    /**
     * 提供服务:地区
     */
    public static function regionService() {
        if (self::$regionService==null) {
            self::$regionService=new ServiceRegion();
        }
        return self::$regionService;
    }

    /**
     * 提供服务:易乐杂志
     */
    public static function magazineService() {
        if (self::$magazineService==null) {
            self::$magazineService=new ServiceMagazine();
        }
        return self::$magazineService;
    }
    /**
     * 提供服务:会员易乐商城平台的用户、会员。
     */
    public static function memberService() {
        if (self::$memberService==null) {
            self::$memberService=new ServiceMember();
        }
        return self::$memberService;
    }
    /**
     * 提供服务:会员收货人地址信息
     */
    public static function addressService() {
        if (self::$addressService==null) {
            self::$addressService=new ServiceAddress();
        }
        return self::$addressService;
    }
    /**
     * 提供服务:商品
     */
    public static function productService() {
        if (self::$productService==null) {
            self::$productService=new ServiceProduct();
        }
        return self::$productService;
    }

    /**
     * 提供服务:商品属性
     */
    public static function productattrService()
    {
        if (self::$productattrService==null) {
            self::$productattrService=new ServiceProductattr();
        }
        return self::$productattrService;
    }

    /**
     * 提供服务:分类属性
     */
    public static function ptypeattrService()
    {
        if (self::$ptypeattrService==null) {
            self::$ptypeattrService=new ServicePtypeattr();
        }
        return self::$ptypeattrService;
    }

    /**
     * 提供服务:商品套餐
     */
    public static function pbatchService() {
        if (self::$pbatchService==null) {
            self::$pbatchService=new ServicePbatch();
        }
        return self::$pbatchService;
    }

    /**
     * 提供服务:支付方式
     */
    public static function paymenttypeService()
    {
        if (self::$paymenttypeService==null) {
            self::$paymenttypeService=new ServicePaymenttype();
        }
        return self::$paymenttypeService;
    }
    /**
     * 提供服务:产品归属业务分类关系
     */
    public static function pbtypeService() {
        if (self::$pbtypeService==null) {
            self::$pbtypeService=new ServicePbtype();
        }
        return self::$pbtypeService;
    }
    /**
     * 提供服务:商品显示基于类型显示的产品
     */
    public static function ptypeshowService() {
        if (self::$ptypeshowService==null) {
            self::$ptypeshowService=new ServicePtypeshow();
        }
        return self::$ptypeshowService;
    }

    /**
     * 提供服务:购物车
     */
    public static function cartService()
    {
        if (self::$cartService==null) {
            self::$cartService=new ServiceCart();
        }
        return self::$cartService;
    }

    /**
     * 提供服务:易乐会员的订单
     */
    public static function orderService()
    {
        if (self::$orderService==null) {
            self::$orderService=new ServiceOrder();
        }
        return self::$orderService;
    }

    /**
     * 提供服务:订购商品
     */
    public static function orderproductsService()
    {
        if (self::$orderproductsService==null) {
            self::$orderproductsService=new ServiceOrderproducts();
        }
        return self::$orderproductsService;
    }

    /**
     * 提供服务:经典案例表
     */
    public static function classicaseService()
    {
        if (self::$classicaseService==null) {
            self::$classicaseService=new ServiceClassicase();
        }
        return self::$classicaseService;
    }
    /**
     * 提供服务:商务定制套餐
     */
    public static function customizeService()
    {
        if (self::$customizeService==null) {
            self::$customizeService=new ServiceCustomize();
        }
        return self::$customizeService;
    }

    /**
     * 提供服务:客户商务定制
     */
    public static function answerService()
    {
        if (self::$answerService==null) {
            self::$answerService=new ServiceAnswer();
        }
        return self::$answerService;
    }

    /**
     * 提供服务:易乐新闻
     */
    public static function newsService()
    {
        if (self::$newsService==null) {
            self::$newsService=new ServiceNews();
        }
        return self::$newsService;
    }

    /**
     * 提供服务:企业信息
     */
    public static function companyService()
    {
        if (self::$companyService==null) {
            self::$companyService=new ServiceCompany();
        }
        return self::$companyService;
    }

    /**
     * 提供服务:商品图片
     */
    public static function seriesimgService()
    {
        if (self::$seriesimgService==null) {
            self::$seriesimgService=new ServiceSeriesimg();
        }
        return self::$seriesimgService;
    }

    /**
     * 提供服务:帮助中心
     */
    public static function helpcenterService()
    {
        if (self::$helpcenterService==null) {
            self::$helpcenterService=new ServiceHelpcenter();
        }
        return self::$helpcenterService;
    }

    /**
     * 提供服务:会员收藏商品
     */
    public static function collectService()
    {
        if (self::$collectService==null) {
            self::$collectService=new ServiceCollect();
        }
        return self::$collectService;
    }

    /**
     * 提供服务:品牌商品分类关系
     */
    public static function brandptypeService()
    {
        if (self::$brandptypeService==null) {
            self::$brandptypeService=new ServiceBrandptype();
        }
        return self::$brandptypeService;
    }

    /**
     * 提供服务:会员发票
     */
    public static function invoiceService()
    {
        if (self::$invoiceService==null) {
            self::$invoiceService=new ServiceInvoice();
        }
        return self::$invoiceService;
    }

    /**
     * 提供服务:退款评论
     */
    public static function refundcommentService()
    {
        if (self::$refundcommentService==null) {
            self::$refundcommentService=new ServiceRefundcomment();
        }
        return self::$refundcommentService;
    }

    /**
     * 提供服务:退款商品
     */
    public static function refundproductsService()
    {
        if (self::$refundproductsService==null) {
            self::$refundproductsService=new ServiceRefundproducts();
        }
        return self::$refundproductsService;
    }
    /**
     * 提供服务:品牌
     */
    public static function cbrandService()
    {
        if (self::$cbrandService==null) {
            self::$cbrandService=new ServiceCbrand();
        }
        return self::$cbrandService;
    }

    /**
     * 提供服务:商品属性值表
     */
    public static function productattrvalService()
    {
        if (self::$productattrvalService==null) {
            self::$productattrvalService=new ServiceProductattrval();
        }
        return self::$productattrvalService;
    }

}
?>
