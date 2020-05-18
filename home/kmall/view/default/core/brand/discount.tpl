{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
	<!--***************content begins***************-->
	<div id="content">        
		<div id="location">            
			<span>您的位置：</span>
			<span><a href="{$url_base}index.php?go=kmall.index.index">首页</a></span>
			<span id="location_arrow"><!--箭头标志--></span>
			<span>品牌特惠</span>            
		</div>
		<div id="brand_wrapper" class="border_color">
			<ul id="brand_cate_wrapper">
				{foreach item=brand_column from=$brand_columns}
                    {if $smarty.get.ptype_id==null && $brand_column@index==0}
                    <li class="brand_cate brand_on theme_bkgcolor_medium">
                        <a href="{$url_base}index.php?go=kmall.brand.discount&ptype_id=1">{$brand_column.ptype_name}</a>
                    </li>
                    {else}
                    <li class="brand_cate {if $brand_column.ptype_id==$smarty.get.ptype_id} brand_on theme_bkgcolor_medium {else} content_title_bkgcolor{/if}">
                        <a href="{$url_base}index.php?go=kmall.brand.discount&ptype_id={$brand_column.ptype_id}">{$brand_column.ptype_name}</a>
                    </li>
                    {/if}
				{/foreach}
			</ul>
			<div class="brand_list_wrapper border_color">
				<ul class="brand_list border_color">
                    {foreach item=brandptype from=$brandptypes}     
                        <li class="brand border_color_dark">
                            <div class="brand_logo border_color_dark"><a href="{$url_base}index.php?go=kmall.brand.lists&brand_id={$brandptype.brand.brand_id}"><img src="{$url_base}/upload/images/{$brandptype.brand.brand_logo}" width="156px" height="66px" alt="{$brandptype.brand.brand_name}" /></a></div>
                            {foreach item=bproduct  from=$brandptype.bproducts name=i}
                                {if $smarty.foreach.i.index < 2}
                                <div class="product">
                                    <div class="product_pic">
                                        <a href="{$url_base}index.php?go=kmall.product.view&product_id={$bproduct.product_id}">
                                            <img src="{$url_base}/upload/images/{$bproduct.ico}" width='58px' height='66px' alt="{$bproduct.product_name}" />
                                        </a>
                                    </div>
                                    <div class="product_name">
                                        <span class="brand_product_name"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$bproduct.product_id}" title="{$bproduct.product_name}">{$bproduct.product_NameShow}</a></span><br />
                                        <span>价格：</span><span style="color:red;">￥{$bproduct.product_price}</span>
                                    </div>
                                </div>
                                {/if}
                            {/foreach}    
                            <div class="top_right_corner"><!--右上角小图标--></div>
                        </li>
                    {/foreach}
				</ul>
				<my:page src="{$url_base}index.php?go=kmall.brand.discount&ptype_id={$smarty.get.ptype_id|default:'1'}" />
			</div>
		</div>
	</div>
	<!--***************content ends***************-->
{/block}
