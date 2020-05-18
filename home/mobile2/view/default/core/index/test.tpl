{extends file="$templateDir/layout/brand/layout.tpl"}
{block name=body}
<div class="container">
	<div class="title">
		<div class="title_back">
			<a href="{$url_base}index.php?go=mobile2.goods.info&id={$goods.goods_id}">
				<div class="title_back_a">
					<img src="{$template_url}resources/images/public/title_back.png" />
				</div>
			</a>
		</div>
		<div class="title_inner" id="shuaxin">填写收货地址</div>
	</div>
	<div class="content">
	<form action="" method="post" id="addFrm">
		<div class="address_list">
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">选择地区：</div>
				</div>
				<div class="address_list_sr">
					<input type="text" name="ship_addr" id="ship_addr"/>
				</div>
			</div>
			<div class="address_line"></div>
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">详细地址：</div>
				</div>
				<div class="address_list_sr">
					<input type="text" name="ship_addr" id="ship_addr"/>
				</div>
			</div>
			<div class="address_line"></div>
		</div>
	</form>
	</div>
</div>
{/block}
