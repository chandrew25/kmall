{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	{php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
	<div id="member_wrapper" class="center_border_color">
		<div id="member">
			<div id="member_info">
				<div id="member_pic_wrapper">
					<p><img src="{$template_url}resources/images/member/nopic.jpg"/></p>
					<!-- <p><a class="hong_color">编辑头像</a></p> -->
				</div>
				<div id="member_details">
					<div id="member_nickname">亲爱的<b class="hun_color">{$member.realname}</b>用户，欢迎来到菲彼生活商城</div>
					<div id="member_check">
						账户安全：{if $member.isActive==1}<img src="{$template_url}resources/images/member/phone.jpg"/>手机已验证
						{else}<img src="{$template_url}resources/images/member/phone1.jpg"/><a class="hong_color">手机未验证</a>
						{/if}
						<!-- {if $member.isValEmail==1}<img src="{$template_url}resources/images/member/email.jpg"/>邮箱已验证
						{else}<img src="{$template_url}resources/images/member/email1.jpg"/><a class="hong_color">邮箱未经验证</a>{/if} -->
					</div>
					<ul id="member_number">
            <li>您的积分：<span class="hong_color">{$member.jifen}</span></li>
						<!--

						<li>会员级别：<span class="hong_color">土星会员</span></li>
						<li>账户余额：<img src="{$template_url}resources/images/member/money.jpg" width="12px" height="13px"/>0</li>
						-->
						<li>等待收货订单：
						{if $ordercount >0}
						<font color="red">{$ordercount}</font> 笔
						{else}
						<font>0 笔</font>
						{/if}
						</li>
					</ul>
				</div>
			</div>
			<div class="tbl_title">
				<span class="tbl_title_name">近期订单</span>
				<a class="tbl_title_see hong_color" href="index.php?go=kmall.member.order">查看所有订单</a>
			</div>
			<table class="tbl">
				<tr class="tbl_head">
					<td width="70">订单编号</td>
					<td width="165">商品图片</td>
					<td width="80">下单日期</td>
					<td width="60">付款方式</td>
					<td width="90">总金额</td>
					<td width="90">总积分</td>
					<td width="60">订单状态</td>
					<td width="120">支付状态</td>
					<td width="60">操作</td>
				</tr>
				{if count($orders)!==0}
				{foreach item=order from=$orders}
				<tr>
					<td>{$order.order_no}</td>
					<td style="padding:0px 3px;text-align:left;">
						{foreach item=ecahgoods from=$order.goods name=i}
							{if $smarty.foreach.i.index < 3}
							<a target="_blank" href="index.php?go=kmall.product.view&product_id={$ecahgoods.goods_id}" alt="{$ecahgoods.goods_name}" title="{$ecahgoods.goods_name}">
								<img src="{$url_base}upload/images/{$ecahgoods.image}" width="43px" height="44px"/>
							</a>
							{/if}
						{/foreach}
					</td>
					<td>{$order.updateTime|truncate:"10":""}</td>
					<td>{$order.paymenttype.name}</td>
					<td>￥{$order.final_amount|string_format:'%.2f'}</td>
					<td>{$order.jifen|string_format:'%d'}</td>
					<td>{$order.ship_statusShow}</td>
					<td>{$order.pay_statusShow}{if $ispay==1}{if $order.pay_status!=1&&$order.pay_status!=10&&$order.pay_status!=5}(<a href="{$url_base}index.php?go=kmall.checkout.show&order_id={$order.order_id}" style="color:red;">去支付</a>){/if}{/if}</td>
					<td><a href="index.php?go=kmall.member.order_detail&order_id={$order.order_id}" style="color:green">详情</a></td>
				</tr>
				{/foreach}
				{else}
					<td colspan="7" height="60" align="center">你在近期没有订单</td>
				{/if}
			</table>
			<!--
			<div class="tbl_title">
				<span class="tbl_title_name">近期收藏</span>
				<a class="tbl_title_see hong_color" href="index.php?go=kmall.member.collect">查看所有收藏</a>
			</div>
			<table class="tbl">
				<tr class="tbl_head">
					<td width="400">商品</td>
					<td width="150">商品单价</td>
					<td width="150">操作</td>
				</tr>
				<tr>
				{if count($collects)!==0}
				{foreach item=collect from=$collects}
				 <tr>
					<td align="left">&nbsp;<a href="index.php?go=kmall.product.view&product_id={$collect.product_id}">{$collect.product_name}/{$collect.unit}</a></td>
					<td>&nbsp;本店：￥{$collect.price}</td>
					<td><a href="javascript:if(confirm('您确认要关注吗？'))location='index.php?go=kmall.member.addAttention&collect_id={$collect.collect_id}&location=mview '">关注
					</a>&nbsp;<a href="index.php?go=kmall.cart.addProduct&product_id={$collect.product_id}&num=1">加入购物车
					</a>&nbsp;<a href="javascript:if(confirm('确认要删除吗？'))location='index.php?go=kmall.member.delCollect&collect_id={$collect.collect_id}&location=mview'">删除</a></td>
				</tr>
				{/foreach}
				{else}
					<td colspan="3" height="60" align="center">你在近期没有收藏</td>
				{/if}
				</tr>
			</table>
			-->
		</div>
	</div>
</div>
{/block}
