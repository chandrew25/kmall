{extends file="$templateDir/layout/brand/layout.tpl"}
{block name=body}
<div class="container">
	<!-- <div class="title">
		<div class="title_back">
			<a href="{$url_base}index.php?go=mobile.goods.info&id={$goods.goods_id}">
				<div class="title_back_a">
					<img src="{$template_url}resources/images/public/title_back.png" />
				</div>
			</a>
		</div>
		<div class="title_inner" id="shuaxin">填写收货地址</div>
	</div> -->
	<div class="content">
	<form action="{$url_base}index.php?go=mobile.order.checkOrder" method="post" id="addFrm">
		<div class="address_list">
			<input type="hidden" id="goods_id" name="goods_id" value="{$goods.goods_id}">
			<input type="hidden" id="order_no" name="order_no" value="{$goods.order_no}">
			<input type="hidden" id="cart" name="cart" value="{$cart}">
			<input type="hidden" id="num" name="num" value="{$goods.num}">
			<div class="address_list_s">
				<div class="address_list_sl">
					<div class="address_list_slin">订单号：</div>
				</div>
				<div class="address_list_sr address_list_srn">{$goods.order_no}</div>
			</div>
			<div class="address_line"></div>
			<div class="address_list_s">
				<div class="address_list_sl">
					<div class="address_list_slin">订单金额：</div>
				</div>
				<div class="address_list_sr address_list_srj">￥{$price}</div>
			</div>
			<div class="address_line"></div>
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">收件人：</div>
				</div>
				<div class="address_list_sr">
					<input type="text" name="ship_name" id="ship_name" />
				</div>
			</div>
			<div class="address_line"></div>
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">联系电话：</div>
				</div>
				<div class="address_list_sr">
					<input type="text" name="ship_mobile" id="ship_mobile"/>
				</div>
			</div>
			<!-- <div class="address_line"></div>
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">选择地区：</div>
				</div>
				<div class="address_list_sr">
					<input type="text" name="ship_addr" id="ship_addr"/>
				</div>
			</div> -->
			<div class="address_line"></div>
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">详细地址：</div>
				</div>
				<div class="address_list_sr">
					<input type="text" name="ship_addr" id="ship_addr"/>
				</div>
			</div>
			<!-- <div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">卡密码：</div>
				</div>
				<div class="address_list_sr">
					<input type="password" name="passwd" id="passwd"/>
				</div>
			</div> -->
			<input type="hidden" name="passwd" id="passwd" value="123456">
			<div class="address_line"></div>
		</div>
		<div class="zf_btn_line">
			<div class="zf_btn" status="1">
				<a href="javascript:void(0);">余额支付</a>
			</div>
		</div>
	</form>
	</div>
</div>
{/block}
