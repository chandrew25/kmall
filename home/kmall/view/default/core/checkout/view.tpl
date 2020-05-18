{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="checkview_main">
	<div class="ch_header">
		<a href="{$url_base}index.php?go=kmall.index.index"><div class="ch_logo png"></div></a>
		<div class="ch_progress"></div>
	</div>
	<div class="ch_confirm">
		<span class="ms_yahei ch_con_font">确认订单信息</span>
	</div>
	<div class="ch_content">
		<div id="checkview_consignee" class="checkview_title">
			<span class="ch_title_font">收货人信息</span>
			<a href="{$url_base}index.php?go=kmall.member.address&location=checkout"><span class="ch_title_revise">[修改]</span></a>
		</div>
		<div class="consignee_info">
			{if !$address}
			<form>
				<table class="cg_info_input" cellpadding="0" cellspacing="0">
					<tr>
						<td width="80px">
							<em>*</em>
							<label for="ship_consignee" class="ship_cg_font">收货人：</label>
						</td>
						<td>
							<input id="ship_consignee" name="consignee" />
						</td>
					</tr>
					<tr>
						<td>
							<em>*</em>
							所在区域：
						</td>
						<td>
							<select name="country" id="country_check"><option value="0">请选择国</option><option value="1">中国</option></select>
							<select name="province" id="province"><option value="0">请选择省</option></select>
							<select name="city" id="city"><option value="0">请选择市</option></select>
							<select name="district" id="district"><option value="0">请选择区</option></select>
						</td>
					</tr>
					<tr>
						<td>
							<em>*</em>
							<label for="ship_address">详细地址：</label>
						</td>
						<td>
							<input id="ship_address" name="address" class="ship_addr_style" />
						</td>
					</tr>
					<tr>
						<td>
							<em>*</em>
							<label for="ship_zipcode">邮政编码：</label>
						</td>
						<td>
							<input id="ship_zipcode" name="zipcode" />
						</td>
					</tr>
					<tr>
						<td>
							<em>*</em>
							<label for="ship_mobile">手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：</label>
						</td>
						<td>
							<input id="ship_mobile" name="mobile" />
						</td>
					</tr>
					<tr>
						<td>
							<em></em>
							<label for="ship_email">电子邮箱：</label>
						</td>
						<td>
							<input id="ship_email" name="email" />
						</td>
					</tr>
					<tr>
						<td></td>
						<td height="46px">
							<div class="cg_info_save">
								<font id="checkaddress" class="cg_btn_font">保存收获地址</font>
							</div>
							<div class="cg_info_cancel">
								<font class="cg_btn_font">取消</font>
							</div>
						</td>
					</tr>
				</table>
			</form>
			{else}
			<table class="cg_info_show" cellpadding="0" cellspacing="0">
				<tr>
					<td width="80px">
						<em></em>
						<label for="ship_consignee" class="ship_cg_font">收货人：</label>
					</td>
					<td>{$address.consignee}</td>
				</tr>
				<tr>
					<td>
						<em></em>
						所在区域：
					</td>
					<td>{$address.allregion}</td>
				</tr>
				<tr>
					<td>
						<em></em>
						<label for="ship_address">详细地址：</label>
					</td>
					<td>{$address.address}</td>
				</tr>
				<tr>
					<td>
						<em></em>
						<label for="ship_zipcode">邮政编码：</label>
					</td>
					<td>{$address.zipcode}</td>
				</tr>
				<tr>
					<td>
						<em></em>
						<label for="ship_mobile">手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：</label>
					</td>
					<td>{$address.mobile}</td>
				</tr>
				<tr>
					<td>
						<em></em>
						<label for="ship_email">电子邮箱：</label>
					</td>
					<td>{$address.email}</td>
				</tr>
				<!--
				<tr>
					<td colspan="2">
						<a href="{$url_base}index.php?go=kmall.member.address" class="cg_info_add">[ +新增收货地址 ]</a>
					</td>
				</tr>
				-->
			</table>
			{/if}
		</div>
		<form action="{$url_base}index.php?go=kmall.checkout.over" method="post" id="checkoverForm" >
			<input id="ness_address" type="hidden" name="ness_address" value="{if $address}{$address->address_id}{/if}" />
			<input id="ness_pay_code" type="hidden" name="bankcode" value="" />

			<div id="checkview_choice_paytype" class="checkview_title">
				<span class="ms_yahei ch_title_font">支付方式</span>
			</div>
			<div class="paytype_info">
				<table class="pay_choice" cellpadding="0" cellspacing="0">
					{foreach item=paymenttype from=$paymenttypes name=foo}
					{if $statisticAll.totalPrice > 0}
					<tr>
						<td width="20px">
              			{if $paymenttype->paymenttype_code!="jifen"}
							<input id="paytype_{$smarty.foreach.foo.iteration}" class="choice_paytype"  type="radio"  name="paymenttype" value="{$paymenttype->paymenttype_code}" checked="checked" />
              			{/if}
						</td>
						<td style="padding-top: 10px;">
							<label for="paytype_{$smarty.foreach.foo.iteration}">
								<p>{$paymenttype->name}</p>
								{if $paymenttype->paymenttype_code=="jifen"}
								<p class="m_jifen" style="float:right;">
									<span>积分余额:</span>
									<span style="color:#f00;">{$member_jifen}</span>
									<span>,本次使用: </span>
									<span style="color:#f00;">{$statisticAll.totalJifen}</span>
									{if $member_jifen<$statisticAll.totalJifen};
									&nbsp;&nbsp;
									<span class="m_jifen_info" style="float:right;color:#f00;">积分不足，无法兑换</span>
									{/if}
								</p>
								{/if}
								{$paymenttype->description}
							</label>
						</td>
						<td>
							{if $paymenttype->paymenttype_code=="bank"}
							<img id="pi_set_paytype" class="pi_selected_paytype" flag="" />
							{else}
							<img style="margin-left:180px;" src="{$template_url}resources/images/{$paymenttype.ico}" index="{$smarty.foreach.foo.index}" />
							{/if}
						</td>
					</tr>
					{else}
						{if $paymenttype->paymenttype_code =="jifen"}
						<tr>
						<td width="20px">
							<input id="paytype_{$smarty.foreach.foo.iteration}" class="choice_paytype"  type="radio"  name="paymenttype" value="{$paymenttype->paymenttype_code}" checked="checked" />
						</td>
						<td style="padding-top: 10px;">
							<label for="paytype_{$smarty.foreach.foo.iteration}">
								<p>{$paymenttype->name}</p>
								<p class="m_jifen" style="float:right;">
									<span>积分余额:</span>
									<span style="color:#f00;">{$member_jifen}</span>
									<span>,本次使用: </span>
									<span style="color:#f00;">{$statisticAll.totalJifen}</span>
									{if $member_jifen<$statisticAll.totalJifen};
									&nbsp;&nbsp;
									<span class="m_jifen_info" style="float:right;color:#f00;">积分不足，无法兑换</span>
									{/if}
								</p>
								{$paymenttype->description}
							</label>
						</td>
						<td>
							{if $paymenttype->paymenttype_code=="bank"}
							<img id="pi_set_paytype" class="pi_selected_paytype" flag="" />
							{else}
							<img style="margin-left:180px;" src="{$template_url}resources/images/{$paymenttype.ico}" index="{$smarty.foreach.foo.index}" />
							{/if}
						</td>
					</tr>
						{/if}
					{/if}
					{/foreach}
				</table>
				<div id="online_payment_handler" class="online_payment">
					<div class="ms_yahei paytype_label">支付平台：</div>
					<table class="platform_choice" cellpadding="0" cellspacing="0">
						<tr>
							{foreach item=paymenttype from=$paymenttypes}
								{if $paymenttype.childscount>0}
									{foreach item=payment from=$paymenttype.childs name=payment}
									<td width="24px">
										<input type="radio" name="platform" class="platform_radio" value="{$payment.paymenttype_code}" index="{$smarty.foreach.payment.index}" />
									</td>
									<td width="153px">
										<img class="platform_img" src="{$template_url}resources/images/{$payment.ico}" index="{$smarty.foreach.payment.index}" />
									</td>
									{/foreach}
								{/if}
							{/foreach}
						</tr>
					</table>
					{foreach item=payment from=$paymenttype.childs name=payment}
					<div class="paylist" style="display:none;">
						{if $payment.childs}
						<div class="ms_yahei paytype_label">国内银行卡或信用卡：</div>
						<table class="bank_choice" cellpadding="0" cellspacing="0">
							{foreach item=pay from=$payment.childs name=payment_c}
							{if $smarty.foreach.payment_c.iteration%5==1}
							<tr>
							{/if}
								<td width="24px">
									<input type="radio"  name="bankcode" class="bank_radio" value="{$pay.paymenttype_code}" />
								</td>
								<td width="153px">
									<img class="bank_img" src="{$template_url}resources/images/{$pay.ico}">
								</td>
							{if $smarty.foreach.payment_c.iteration%5==0}
							</tr>
							{/if}
							{/foreach}
						</table>
						{/if}
					</div>
					{/foreach}
					<div class="paytype_dotted"></div>
					<div id="pay_confirm_handler"  class="paytype_confirm">
						<font class="pay_confirm_font">确认支付方式</font>
					</div>
				</div>
			</div>
			<div class="checkview_title">
				<span class="ch_title_font">商品清单</span>
				<a href="{$url_base}index.php?go=kmall.cart.lists" class="return_cart">[返回购物车修改]</a>
			</div>
			<div class="product_info">
				<table cellpadding="0" cellspacing="0">
					<tr class="pro_info_title">
						<td width="400px" colspan="2">商品</td>
						<td width="80px">单价</td>
            <td width="80px">积分</td>
						<td width="80px">数量</td>
						<td width="120px">折扣</td>
						<td width="120px">现金小计</td>
						<td width="120px">积分小计</td>
					</tr>
					{foreach item=cart from=$carts}
					<tr class="pro_info_con">
						<td width="126px">
							<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$cart->goods_id}" target="_blank" >
								<img src="{$url_base}upload/images/{$cart->ico}" class="pro_info_img" alt="{$cart->goods_name}">
							</a>
						</td>
						<td>
							<input type="hidden" name="sels[{$cart->goods_id}]" value="{$cart->goods_id}" />
							<a href="{$url_base}index.php?go=kmall.product.view&goods_id={$cart->goods_id}" target="_blank" >
								<p class="pro_info_name">{$cart->goods_name}</p>
							</a>
						</td>
						<td>{$cart->sales_price|string_format:'%.2f'}</td>
            <td>{$cart->jifen}</td>
						<td>{$cart->num}</td>
						<td>-</td>
						<td>
							<font class="pro_info_red">{$cart->totalPrice|string_format:'%.2f'}</font>
						</td>
						<td>
							<font class="pro_info_red">{$cart->totalJifen|default:'0'}</font>
						</td>
					</tr>
					{/foreach}
				</table>
			</div>
			<div class="settle_accounts_info">
				<table cellpadding="0" cellspacing="0">
					<tr class="se_acc_tr">
						<td width="80px">商品总价：</td>
						<td class="se_acc_td">
							<font class="ms_yahei">+￥</font>
							<font>{$statisticAll.totalPrice}</font>
						</td>
					</tr>
          {if $statisticAll.totalJifen}
					<tr class="se_acc_tr">
						<td width="60px">积分总价：</td>
						<td class="se_acc_td">
							<font class="ms_yahei"></font>
							<font>{$statisticAll.totalJifen}</font>
						</td>
					</tr>
          {/if}
					<tr class="se_acc_tr">
						<td>综合服务费：</td>
						<td class="se_acc_td">
							<font class="ms_yahei">￥</font>
							<font>{$statisticAll.deliveryFee}</font>
						</td>
					</tr>
					<tr>
						<td height="5px" colspan="2">
							<div class="break_line"></div>
						</td>
					</tr>
					<tr class="se_acc_tra">
						<td>
							<font class="ms_yahei se_acc_font">总计： </font>
						</td>
						<td class="se_acc_td">
							<font class="ms_yahei se_acc_sign">￥</font>
							<font class="se_acc_total">{$statisticAll.realFee}{if $statisticAll.totalJifen}+{$statisticAll.totalJifen}积分{/if}</font>
						</td>
					</tr>
					<tr class="se_acc_trl">
						<td colspan="2">
							<div id="order_submit" class="order_submit png"></div>
						</td>
					</tr>
				</table>
			</div>
		</form>
	</div>
</div>
<script>
	var member_jifen={$member_jifen};
  var totalJifen={$statisticAll.totalJifen};
</script>
{/block}
