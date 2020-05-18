<?php
/**
 +---------------------------------------<br/>
 * 控制器:品牌<br/>
 +---------------------------------------
 * @category bonli
 * @package web.front.action
 * @author jakeon jakeon@126.com
 */
class Action_Brand extends Action
{
	/**
	 * 品牌列表页面
	 */
	public function lists()
	{
		$this->loadCss("resources/css/brand.css");
		$this->loadJs("js/brand.js");
		//首页banner
        $banner = Banner::get("isShow=1 and type=17",'sort desc');
        $this->view->set("banner", $banner);
        //精品推荐
		$brand=Brand::get("isShow=1",'seq_no desc','0,10');
        $this->view->set("brand",$brand);
        //热销排行
        // $brandtop = sqlExecute("SELECT b.*,SUM(p.sales_count) as num from km_product as p left join km_brand as b on p.brand_id=b.brand_id GROUP BY p.brand_id ORDER BY num DESC limit 0,8");
        // $this->view->set("brandtop",$brandtop);

        $branZm = Brand::get("isShow=1 GROUP BY initials",'initials ASC');
        if (!empty($branZm)) {
            foreach ($branZm as $key => $value) {
                $value->brand = Brand::get("isShow=1 and initials='".$value->initials."'",'sort_order desc');
            }
        }
        $this->view->set("branZm",$branZm);
	}
 
}
?>