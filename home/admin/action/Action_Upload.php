<?php
/**
 * 控制器:上传文件
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Upload extends ActionExt
{
    /**
     * 上传数据对象:应用文件
     */
    public function uploadAppfile()
    {
        $appdown_id=$_POST["appdown_id"];
        return self::ExtResponse(Manager_ExtService::appdownService()->uploadAppfile($_FILES,$appdown_id));
    }

    /**
     * 上传数据对象:分类属性数据文件
     */
    public function uploadPtypeattr()
    {
        return self::ExtResponse(Manager_ExtService::ptypeattrService()->import($_FILES));
    }

    /**
     * 上传数据对象:广告数据文件
     */
    public function uploadAds()
    {
        return self::ExtResponse(Manager_ExtService::adsService()->import($_FILES));
    }

    /**
     * 上传数据对象:配送方式数据文件
     */
    public function uploadDeliverytype()
    {
return self::ExtResponse(Manager_ExtService::deliverytypeService()->import($_FILES));
    }

    /**
     * 上传数据对象:支付方式数据文件
     */
    public function uploadPaymenttype()
    {
        return self::ExtResponse(Manager_ExtService::paymenttypeService()->import($_FILES));
    }

    /**
     * 上传数据对象:购物车数据文件
     */
    public function uploadCart()
    {
        return self::ExtResponse(Manager_ExtService::cartService()->import($_FILES));
    }

    /**
     * 上传数据对象:易乐会员的订单数据文件
     */
    public function uploadOrder()
    {
        return self::ExtResponse(Manager_ExtService::orderService()->import($_FILES));
    }

    /**
     * 上传数据对象:品牌数据文件
     */
    public function uploadBrand()
    {
        return self::ExtResponse(Manager_ExtService::brandService()->import($_FILES));
    }

    /**
     * 上传数据对象:套餐类型数据文件
     */
    public function uploadBatchtype()
    {
        return self::ExtResponse(Manager_ExtService::batchtypeService()->import($_FILES));
    }

    /**
     * 上传数据对象:品牌显示数据文件
     */
    public function uploadBtypeshow()
    {
        return self::ExtResponse(Manager_ExtService::btypeshowService()->import($_FILES));
    }

    /**
     * 上传数据对象:业务类型数据文件
     */
    public function uploadBtype()
    {
        return self::ExtResponse(Manager_ExtService::btypeService()->import($_FILES));
    }

    /**
     * 上传数据对象:业务分类推荐品牌数据文件
     */
    public function uploadBtbrand()
    {
        return self::ExtResponse(Manager_ExtService::btbrandService()->import($_FILES));
    }

    /**
     * 上传数据对象:商品类型数据文件
     */
    public function uploadPtype()
    {
        return self::ExtResponse(Manager_ExtService::ptypeService()->import($_FILES));
    }

    /**
     * 上传数据对象:地区数据文件
     */
    public function uploadRegion()
    {
        return self::ExtResponse(Manager_ExtService::regionService()->import($_FILES));
    }

    /**
     * 上传数据对象:易乐杂志数据文件
     */
    public function uploadMagazine()
    {
        return self::ExtResponse(Manager_ExtService::magazineService()->import($_FILES));
    }

    /**
     * 上传数据对象:会员数据文件
     */
    public function uploadMember()
    {
        return self::ExtResponse(Manager_ExtService::memberService()->import($_FILES));
    }

    /**
     * 上传数据对象:会员收货人地址信息数据文件
     */
    public function uploadAddress()
    {
        return self::ExtResponse(Manager_ExtService::addressService()->import($_FILES));
    }

    /**
     * 上传数据对象:会员评论数据文件
     */
    public function uploadComment()
    {
        return self::ExtResponse(Manager_ExtService::commentService()->import($_FILES));
    }

    /**
     * 上传数据对象:商品套餐数据文件
     */
    public function uploadPbatch()
    {
        return self::ExtResponse(Manager_ExtService::pbatchService()->import($_FILES));
    }

    /**
     * 上传数据对象:商品显示数据文件
     */
    public function uploadPtypeshow()
    {
        return self::ExtResponse(Manager_ExtService::ptypeshowService()->import($_FILES));
    }

    /**
     * 上传数据对象:套餐商品数据文件
     */
    public function uploadPbatchproduct()
    {
        return self::ExtResponse(Manager_ExtService::pbatchproductService()->import($_FILES));
    }

    /**
     * 上传数据对象:品牌推荐商品数据文件
     */
    public function uploadBproduct()
    {
        return self::ExtResponse(Manager_ExtService::bproductService()->import($_FILES));
    }

    /**
     * 上传数据对象:商品分类所属栏目数据文件
     */
    public function uploadPtcolumn()
    {
        return self::ExtResponse(Manager_ExtService::ptcolumnService()->import($_FILES));
    }

    /**
     * 上传数据对象:产品归属业务分类关系数据文件
     */
    public function uploadPbtype()
    {
        return self::ExtResponse(Manager_ExtService::pbtypeService()->import($_FILES));
    }

    /**
     * 上传数据对象:会员最近浏览过的商品数据文件
     */
    public function uploadSeeproduct()
    {
        return self::ExtResponse(Manager_ExtService::seeproductService()->import($_FILES));
    }

    /**
     * 上传数据对象:订购商品数据文件
     */
    public function uploadOrderproducts()
    {
        return self::ExtResponse(Manager_ExtService::orderproductsService()->import($_FILES));
    }

    /**
     * 上传数据对象:经典案例表数据文件
     */
    public function uploadClassicase()
    {
        return self::ExtResponse(Manager_ExtService::classicaseService()->import($_FILES));
    }
    /**
     * 上传数据对象:商务定制套餐数据文件
     */
    public function uploadCustomize()
    {
        return self::ExtResponse(Manager_ExtService::customizeService()->import($_FILES));
    }

    /**
     * 上传数据对象:客户商务定制数据文件
     */
    public function uploadAnswer()
    {
        return self::ExtResponse(Manager_ExtService::answerService()->import($_FILES));
    }

    /**
     * 上传数据对象:易乐新闻数据文件
     */
    public function uploadNews()
    {
        return self::ExtResponse(Manager_ExtService::newsService()->import($_FILES));
    }

    /**
     * 上传数据对象:企业信息数据文件
     */
    public function uploadCompany()
    {
        return self::ExtResponse(Manager_ExtService::companyService()->import($_FILES));
    }

    /**
     * 上传数据对象:商品图片数据文件
     */
    public function uploadSeriesimg()
    {
        return self::ExtResponse(Manager_ExtService::seriesimgService()->import($_FILES));
    }

    /**
     * 上传数据对象:帮助中心数据文件
     */
    public function uploadHelpcenter()
    {
        return self::ExtResponse(Manager_ExtService::helpcenterService()->import($_FILES));
    }

    /**
     * 上传数据对象:量词数据文件
     */
    public function uploadQuantifier()
    {
        return self::ExtResponse(Manager_ExtService::quantifierService()->import($_FILES));
    }

    /**
     * 上传数据对象:会员收藏商品数据文件
     */
    public function uploadCollect()
    {
        return self::ExtResponse(Manager_ExtService::collectService()->import($_FILES));
    }

  /**
   * 上传数据对象:品牌商品分类关系数据文件
   */
  public function uploadBrandptype()
  {
        return self::ExtResponse(Manager_ExtService::brandptypeService()->import($_FILES));
  }

    /**
     * 上传数据对象:会员发票数据文件
     */
    public function uploadInvoice()
    {
        return self::ExtResponse(Manager_ExtService::invoiceService()->import($_FILES));
    }

    /**
     * 上传数据对象:退款评论数据文件
     */
    public function uploadRefundcomment()
    {
        return self::ExtResponse(Manager_ExtService::refundcommentService()->import($_FILES));
    }

    /**
     * 上传数据对象:退款商品数据文件
     */
    public function uploadRefundproducts()
    {
        return self::ExtResponse(Manager_ExtService::refundproductsService()->import($_FILES));
    }
    /**
     * 上传数据对象:品牌数据文件
     */
    public function uploadCbrand()
    {
        return self::ExtResponse(Manager_ExtService::cbrandService()->import($_FILES));
    }

    /**
     * 上传数据对象:兑换商品数据文件
     */
    public function uploadCardproduct()
    {
        return self::ExtResponse(Manager_ExtService::cardproductService()->import($_FILES));
    }

    /**
     * 上传数据对象:票券商品数据文件
     */
    public function uploadCouponproduct()
    {
        return self::ExtResponse(Manager_ExtService::couponproductService()->import($_FILES));
    }

    /**
     * 上传数据对象:商品显示数据文件
     */
    public function uploadCptypeshow()
    {
        return self::ExtResponse(Manager_ExtService::cptypeshowService()->import($_FILES));
    }

    /**
     * 上传数据对象:票券数据文件
     */
    public function uploadCoupon()
    {
        return self::ExtResponse(Manager_ExtService::couponService()->import($_FILES));
    }

    /**
     * 上传数据对象:票券类型数据文件
     */
    public function uploadCoupontype()
    {
        return self::ExtResponse(Manager_ExtService::coupontypeService()->import($_FILES));
    }

    /**
     * 上传数据对象:快速提货数据文件
     */
    public function uploadFastpick()
    {
        return self::ExtResponse(Manager_ExtService::fastpickService()->import($_FILES));
    }

    /**
     * 上传商品数据
     */
    public function uploadProduct()
    {
        return self::ExtResponse(Manager_ExtService::productService()->import($_FILES));
    }

    /**
     * 上传商品数据
     */
    public function uploadProductIntro()
    {
        return self::ExtResponse(Manager_ExtService::productService()->importintro($_FILES));
    }

    /**
     * 批量上传商品图片:image
     */
    public function uploadProductImages()
    {
        return self::ExtResponse(Manager_ExtService::productService()->batchUploadImages($_FILES,"upload_image_files","Product","商品","image"));
    }

    /**
     * 上传数据对象:应用下载数据文件
     */
    public function uploadAppdown()
    {
        return self::ExtResponse(Manager_ExtService::appdownService()->import($_FILES));
    }

    /**
     * 上传数据对象:属性表数据文件
     */
    public function uploadAttribute()
    {
        return self::ExtResponse(Manager_ExtService::attributeService()->import($_FILES));
    }

    /**
     * 上传数据对象:大宗采购数据文件
     */
    public function uploadBulkpurchase()
    {
        return self::ExtResponse(Manager_ExtService::bulkpurchaseService()->import($_FILES));
    }

    /**
     * 上传数据对象:商品属性数据文件
     */
    public function uploadProductattr()
    {
        return self::ExtResponse(Manager_ExtService::productattrService()->import($_FILES));
    }

    /**
     * 上传数据对象:商品属性值表数据文件
     */
    public function uploadProductattrval()
    {
        return self::ExtResponse(Manager_ExtService::productattrvalService()->import($_FILES));
    }

    /**
     * 上传合同附件
     */
    public function uploadContractFiles() {
        $data=false;
        if(!empty ($_POST['contract_id'])) {
            $contract_id = $_POST['contract_id'];
            //调用合同service中的上传附件方法
            return self::ExtResponse(Manager_ExtService::confilesService()->uploadContract($contract_id,$_FILES),false);
        }else{
            return self::ExtResponse(array(
            'success'=>false,
            'msg' => '无合同编号！'
            ),false);
        }
    }

    /**
     * 上传数据对象:供应商数据文件
     */
    public function uploadSupplier()
    {
        return self::ExtResponse(Manager_ExtService::supplierService()->import($_FILES));
    }

    /**
     * 上传数据对象:合同数据文件
     */
    public function uploadContract()
    {
        return self::ExtResponse(Manager_ExtService::contractService()->import($_FILES));
    }

    /**
     * 上传数据对象:会员等级表数据文件
     */
    public function uploadRank()
    {
        return self::ExtResponse(Manager_ExtService::rankService()->import($_FILES));
    }

    /**
     * 上传库存商品数据
     */
    public function uploadGoods()
    {
        return self::ExtResponse(Manager_ExtService::goodsService()->import($_FILES));
    }

    /**
     * 上传数据对象:部门数据文件
     */
    public function uploadDepartment()
    {
        return self::ExtResponse(Manager_ExtService::departmentService()->import($_FILES));
    }

    /**
     * 上传数据对象:手机号码
     */
    public function uploadPhone()
    {
        return self::ExtResponse(Manager_ExtService::departmentService()->import($_FILES));
    }
    /**
     * 上传数据对象:兑换券数据文件
     */
    public function uploadVoucher()
    {
        return self::ExtResponse(Manager_ExtService::voucherService()->import($_FILES));
    }

    /**
     * 上传数据对象:兑换券规则作用商品表数据文件
     */
    public function uploadVouchergoods()
    {
        return self::ExtResponse(Manager_ExtService::vouchergoodsService()->import($_FILES));
    }

    /**
     * 上传数据对象:兑换券实体表数据文件
     */
    public function uploadVoucheritems()
    {
        return self::ExtResponse(Manager_ExtService::voucheritemsService()->import($_FILES));
    }

    /**
     * 上传数据对象:兑换券使用日志表数据文件
     */
    public function uploadVoucheritemslog()
    {
        return self::ExtResponse(Manager_ExtService::voucheritemslogService()->import($_FILES));
    }

    /**
     * 上传数据对象:广告栏目数据文件
     */
    public function uploadBanner()
    {
        return self::ExtResponse(Manager_ExtService::bannerService()->import($_FILES));
    }

    /**
     * 批量上传广告栏目图片:url
     */
    public function uploadBannerUrls()
    {
        return self::ExtResponse(Manager_ExtService::bannerService()->batchUploadImages($_FILES,"upload_url_files","Banner","广告栏目","url"));
    }

    /**
     * 上传数据对象:活动数据文件
     */
    public function uploadActivity()
    {
        return self::ExtResponse(Manager_ExtService::activityService()->import($_FILES));
    }

    /**
     * 批量上传活动图片:images
     */
    public function uploadActivityImagess()
    {
        return self::ExtResponse(Manager_ExtService::activityService()->batchUploadImages($_FILES,"upload_images_files","Activity","活动","images"));
    }

    /**
     * 上传数据对象:活动拥有的商品数据文件
     */
    public function uploadActivityproduct()
    {
        return self::ExtResponse(Manager_ExtService::activityproductService()->import($_FILES));
    }

    /**
     * 上传数据对象:国家数据文件
     */
    public function uploadCountry()
    {
        return self::ExtResponse(Manager_ExtService::countryService()->import($_FILES));
    }

    /**
     * 批量上传国家图片:thumbnail
     */
    public function uploadCountryThumbnails()
    {
        return self::ExtResponse(Manager_ExtService::countryService()->batchUploadImages($_FILES,"upload_thumbnail_files","Country","国家","thumbnail"));
    }

    /**
     * 批量上传国家图片:flagimage
     */
    public function uploadCountryFlagimages()
    {
        return self::ExtResponse(Manager_ExtService::countryService()->batchUploadImages($_FILES,"upload_flagimage_files","Country","国家","flagimage"));
    }

    /**
     * 批量上传国家图片:images
     */
    public function uploadCountryImagess()
    {
        return self::ExtResponse(Manager_ExtService::countryService()->batchUploadImages($_FILES,"upload_images_files","Country","国家","images"));
    }

    /**
     * 上传数据对象:秒杀商品数据文件
     */
    public function uploadSeckill()
    {
        return self::ExtResponse(Manager_ExtService::seckillService()->import($_FILES));
    }
}
?>
