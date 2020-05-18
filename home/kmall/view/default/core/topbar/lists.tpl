{extends file="$templateDir/layout/home/layout.tpl"}

{block name=body}
	<div id="location_wrapper">        
		<div id="location">            
			<span>您的位置：</span>
			<span><a href="index.php?go=kmall.index.index" target="_blank">首页</a></span>
			<span id="location_arrow"><!--箭头标志--></span>
			<span><a href="index.php?go=kmall.topbar.lists" target="_blank">销售排行</a></span>            
		</div>            
	</div>

	<div id="top_sale_content">
		<a href="#" target="_blank"><img id="top_main_ad" src="{$template_url}/resources/images/top_sale/top_main_ad.jpg" alt="ad" /></a>
		<div id="ranking_order">
			<ul id="order_list" class="theme_color_dark">
				<li class="order {if ( $smarty.get.sorting == 1 || $smarty.get.sorting == null )}order_selected theme_color_dark{/if}" id="order_by_sales_count">
					<a href="{$url_base}index.php?go=kmall.topbar.lists&{$smarty.get.ptype_id}&sorting=1">按销售量排行</a>
				</li>
				<li class="order {if $smarty.get.sorting == 2}order_selected theme_color_dark{/if}" id="order_by_sales_money">
					<a href="{$url_base}index.php?go=kmall.topbar.lists&{$smarty.get.ptype_id}&sorting=2">按销售额排行</a>
				</li>
			</ul>
			<ul class="cate_list border_bkgcolor_light border_color {if ( $smarty.get.sorting == 1 || $smarty.get.sorting == null )}cate_list_selected{/if}" id="cate_list_by_sales_count">                
				<li class="cate {if ( $smarty.get.ptype_id == 0 || $smarty.get.ptype_id == null )}cate_selected{/if}">
					<a href="{$url_base}index.php?go=kmall.topbar.lists&ptype_id=0&sorting=1">全部</a>
				</li>
				{foreach item=ptype from=$ptypes}

				<li class="cate {if $smarty.get.ptype_id == $ptype.ptype_id}cate_selected{/if} {if ($ptype@index+1)%11 == 0}end_of_line{/if}">
					<a href="{$url_base}index.php?go=kmall.topbar.lists&ptype_id={$ptype.ptype_id}&sorting=1">{$ptype.name}</a>
				</li>
				{/foreach}

			</ul>
			<ul class="cate_list border_bkgcolor_light border_color {if $smarty.get.sorting == 2}cate_list_selected{/if}" id="cate_list_by_sales_money">                
				<li class="cate {if ( $smarty.get.ptype_id == 0 || $smarty.get.ptype_id == null )}cate_selected{/if}">
					<a href="{$url_base}index.php?go=kmall.topbar.lists&ptype_id=0&sorting=2">全部</a>
				</li>
				{foreach item=ptype from=$ptypes}

				<li class="cate {if $smarty.get.ptype_id == $ptype.ptype_id}cate_selected{/if} {if ($ptype@index+1)%11 == 0}end_of_line{/if}">
					<a href="{$url_base}index.php?go=kmall.topbar.lists&ptype_id={$ptype.ptype_id}&sorting=2">{$ptype.name}</a>
				</li>
				{/foreach}

			</ul>
		</div>
		<ul id="product_list">
			{foreach item=product from=$products}  

			<li class="product">
				<div class="ranking theme_color_dark">{$product@index+1}</div>
				<div class="product_pic border_color"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}"><img src="{$url_base}/upload/images/{$product.image}" width='200px' height='200px' alt="{$product.name}" /></a></div>
				<div class="product_name"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}">{$product.name}</a></div>
				<div class="product_price">
					<span class="original">￥{$product.market_price}</span>
					<span class="current">￥{$product.price}/{$product.unit}</span>
				</div>
			</li>
			{/foreach}                

		</ul>
	</div>
{/block}