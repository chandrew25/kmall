{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="container">
	<!-- <div class="title">
		<div class="title_back">
			<a href="{$url_base}index.php?go=mobile2.goods.info&id={$goods->goods_id}">
				<div class="title_back_a">
					<img src="{$template_url}resources/images/public/title_back.png" />
				</div>
			</a>
		</div>
		<div class="title_inner" id="shuaxin">商品详情</div>
	</div> -->
	<div class="content">
		{$goods->intro}
	</div>
</div>
{/block}
