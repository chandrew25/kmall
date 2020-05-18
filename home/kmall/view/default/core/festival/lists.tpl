{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body} 
<div id="main" class="main_container">
	<div class="banner_container">
		<div class="festival_banner"></div>
	</div>
	<div id="content" class="container_width content_style">
		<div class="special_column">
			<div class="column_top position_relative column_newyear">
				<div class="position_absolute png weili_creed"></div>
				<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$nptype}" target="_blank">
					<div class="position_absolute png see_more"></div>
				</a>
			</div>
			{foreach item=nygoods from=$newyear name=nyfoo}
			{if $smarty.foreach.nyfoo.iteration%3==1}
			<div class="goods_lists">
			{/if}
				<div class="float_left goods_outer">
					<div class="goods_inner">
						<div class="goods_con">
							<div class="position_relative goods_img">
								<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$nygoods->goods_id}" target="_blank" title="{$nygoods->goods_name}">
									<img class="goods_img" src="{$url_base}upload/images/{$nygoods->img}">
								</a>
								<div class="position_absolute png red_triangle"></div>
							</div>
							<div class="font_size_12 color_white font_family_simsun font_weight_bold goods_name" title="{$nygoods->goods_name}">
								<a  href="{$url_base}index.php?go=kmall.product.view&goods_id={$nygoods->goods_id}" target="_blank" title="{$nygoods->goods_name}">
									{$nygoods->goods_name}
								</a>
							</div>
							<div class="goods_oper">
								<div class="float_left font-size_24 font_family_yahei font_weight_bold goods_price">￥{$nygoods->sales_price|string_format:"%d"}</div>
								<div class="float_left buy_voucher">
									<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$nygoods->goods_id}" target="_blank">
										<img class="png margin_top_8 operate_img" src="{$template_url}resources/images/festival/buy_voucher.png">
									</a>
								</div>
								<div class="float_left display_inlineblock margin_left_2 buy_gift">
									<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$nygoods->goods_id}" target="_blank">
										<img class="png margin_top_8 operate_img" src="{$template_url}resources/images/festival/buy_gift.png">
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				{if $smarty.foreach.nyfoo.iteration%3!=0}
				<div class="float_left center_gap"></div>
				{/if}				
			{if $smarty.foreach.nyfoo.iteration%3==0||$smarty.foreach.nyfoo.last}
			</div>
			{/if}
			{if $smarty.foreach.nyfoo.iteration%3==0&&!$smarty.foreach.nyfoo.last}
			<div class="bottom_gap"></div>
			{/if}
			{/foreach}
		</div>
		<div class="bottom_gap"></div>
		<div class="bottom_gap"></div>
		<div class="special_column">
			<div class="column_top position_relative column_universal">
				<div class="position_absolute png weili_creed"></div>
				<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$uptype}" target="_blank">
					<div class="position_absolute png cursor_pointer see_more"></div>
				</a>
			</div>
			{foreach item=ugoods from=$universal name=ufoo}
			{if $smarty.foreach.ufoo.iteration%3==1}
			<div class="goods_lists">
			{/if}
				<div class="float_left goods_outer">
					<div class="goods_inner">
						<div class="goods_con">
							<div class="position_relative goods_img">
							<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$ugoods->goods_id}" target="_blank" title="{$ugoods->goods_name}">
								<img class="goods_img" src="{$url_base}upload/images/{$ugoods->img}">
							</a>
								<div class="position_absolute png red_triangle"></div>
							</div>
							<div class="font_size_12 color_white font_family_simsun font_weight_bold goods_name">
								<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$ugoods->goods_id}" target="_blank" title="{$ugoods->goods_name}">
									{$ugoods->goods_name}
								</a>
							</div>
							<div class="goods_oper">
								<div class="float_left font-size_24 font_family_yahei font_weight_bold goods_price">￥{$ugoods->sales_price|string_format:"%d"}</div>
								<div class="float_left buy_voucher">
									<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$ugoods->goods_id}" target="_blank">
										<img class="png margin_top_8 operate_img" src="{$template_url}resources/images/festival/buy_voucher.png">
									</a>
								</div>
								<div class="float_left display_inlineblock margin_left_2 buy_gift">
									<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$ugoods->goods_id}" target="_blank">
										<img class="png margin_top_8 operate_img" src="{$template_url}resources/images/festival/buy_gift.png">
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				{if $smarty.foreach.ufoo.iteration%3!=0}
				<div class="float_left center_gap"></div>
				{/if}				
			{if $smarty.foreach.ufoo.iteration%3==0||$smarty.foreach.ufoo.last}
			</div>
			{/if}
			{if $smarty.foreach.ufoo.iteration%3==0&&!$smarty.foreach.ufoo.last}
			<div class="bottom_gap"></div>
			{/if}
			{/foreach}
		</div>
		<div class="bottom_gap"></div>
		<div class="bottom_gap"></div>
		<div class="special_column">
			<div class="column_top position_relative column_voucher">
				<div class="position_absolute png weili_creed"></div>
				<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$vptype}" target="_blank">
					<div class="position_absolute png cursor_pointer see_more"></div>
				</a>
			</div>
			{foreach item=vgoods from=$voucher name=vfoo}
			{if $smarty.foreach.vfoo.iteration%3==1}
			<div class="goods_lists">
			{/if}
				<div class="float_left goods_outer">
					<div class="goods_inner">
						<div class="goods_con">
							<div class="position_relative goods_img">
								<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$vgoods->goods_id}" target="_blank" title="{$vgoods->goods_name}">
									<img class="goods_img" src="{$url_base}upload/images/{$vgoods->img}">
								</a>
								<div class="position_absolute png red_triangle"></div>
							</div>
							<div class="font_size_12 color_white font_family_simsun font_weight_bold goods_name">
								<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$vgoods->goods_id}" target="_blank" title="{$vgoods->goods_name}">
									{$vgoods->goods_name}
								</a>
							</div>
							<div class="goods_oper">
								<div class="float_left font-size_24 font_family_yahei font_weight_bold goods_price">￥{$vgoods->sales_price|string_format:"%d"}</div>
								<div class="float_left buy_voucher display_inlineblock margin_left_60">
									<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$vgoods->goods_id}" target="_blank">
										<img class="png margin_top_8 operate_img" src="{$template_url}resources/images/festival/buy_voucher.png">
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				{if $smarty.foreach.vfoo.iteration%3!=0}
				<div class="float_left center_gap"></div>
				{/if}				
			{if $smarty.foreach.vfoo.iteration%3==0||$smarty.foreach.vfoo.last}
			</div>
			{/if}
			{if $smarty.foreach.vfoo.iteration%3==0&&!$smarty.foreach.vfoo.last}
			<div class="bottom_gap"></div>
			{/if}
			{/foreach}
		</div>
		<div class="bottom_gap"></div>
		<div class="bottom_gap"></div>
	</div>
	<div class="bottom_gap"></div>
	<div class="bottom_gap"></div>
</div>
{/block}