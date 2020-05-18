{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
	<div id="wrapper">
		<div class="int_title"><a href="#" onClick="javascript:history.back(-1);"><span class="int_pic"><img src="{$template_url}resources/images/jifen/left.png"/></span></a>商品详情</div>
		<div class="video details_back">
			<div class="deta_pic topline">
				<p class="deta_box"><img src="{$url_base}upload/images/{$product.image}" /></p>
				<p class="deta_con">{$product.productShow}</p>
				<p class="deta_con deta_line">￥{$product.price|string_format:'%.2f'}+{$product.jifen|string_format:'%d'}券</p>
				{*<div class="deta_con topline deta_height clearfix">*}
					{*<span class="deta_display fl">数量：</span>*}
					{*<div class="deta_padding">*}
						{*<p class="supp_c_inpt perfor_input deta_top fl"><input type="button" value="-" id="plus"/><input type="text" id="txt" value="1"><input type="button" value="+" id="reduce"/></p>*}
					{*</div>*}
				{*</div>*}
			</div>
			<div class="perform topline">
				<div class="fill_name clearfix topline">
					<ul>
						<li class="fill fl name_color">详情</li>
						<li class="addr_name fill fr">规格</li>
					</ul>
				</div>
				<div class="name_perf details_padding">
					<div class="name_box " style="display: block;">
						{$product.intro}
					</div>
					<div class="name_box detail_width_con">
						{$product.specification}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="menu" class="detail_nav_main topline">
		<ul class="m_nav clearfix">
			<a href="/mobile"><li class="m_nav_1">
				<span class="m_nav_pic_main">
					<img src="{$template_url}resources/images/xqq/nav_icon.png" />
				</span>
				</li></a>
			<a href="javascript::void();"><li class="m_nav_2" id="addcart" goods_id="{$product.product_id}">加入购物车</li></a>
			<a href="index.php?go=mobile.checkout.view&id={$product.product_id}"><li class="m_nav_2 m_nav_fr ">立即购买</li></a>
		</ul>
	</div>
	<div id="back_top">
		<a href="#"><img src="{$template_url}resources/images/xqq/the_top.png" /></a>
	</div>
{/block}
