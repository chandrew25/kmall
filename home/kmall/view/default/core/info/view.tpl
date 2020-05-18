{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<!--<div class="ch_header">
	<a href="{$url_base}index.php?go=kmall.index.index">
		<div class="ch_logo png"></div>
	</a>
	<div class="ch_progress"></div>
</div>-->
<div class="info_content">
	{if $smarty.get.type==3}
	<div class="inc_main">
		<div class="inc_m_info">
			<div class="incmi_top">
				<div class="incmit_img">
					<img class="png" src="{$template_url}resources/images/checkout/success.png" alt="支付成功" />
				</div>
				<div class="incmit_con">
					<div class="incmitc_tip">
						<span>您的订单已经提交成功，请尽快付款</span>
					</div>
					<div class="incmitc_det">
						<span class="in_order_name">订单编号：</span><span class="in_order_num">{$order_no}</span>
						<span class="in_order_name in_order_name_left">应付金额：</span><span class="in_order_num in_order_sign">￥</span><span class="in_order_num">{$amount|string_format:'%.2f'}</span>
					</div>    
				</div>
			</div>
			<div class="incmi_bot">
				<span class="incmib_con incmib_conr">温馨提示：</span><span class="incmib_con">请在24小时内完成支付，否则订单将自动取消</span>
			</div>   
		</div>
	</div>
	<div class="inc_oper">
		<table>
			<tr>
				<td height="66px">
					<span>您选择的支付方式：</span>
				</td>
				<td>
					<img class="in_pay_img" src="{$template_url}resources/images/{$pico}" alt="网上支付方式图标">
				</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td height="62px">
					<a href="{$url}" target="_blank">
						<img width="137px" height="42px" class="png" src="{$template_url}resources/images/checkout/go_to.png" alt="前往支付">
					</a>
				</td>
				<td>
					<span class="in_service_tip">如有任何疑问请拨打我们的客服热线：</span>
					<span class="in_service_tel">400-888-8888</span> 
				</td>
			</tr>
		</table>
	</div>
	{else}
		<div class="con_lists box_title">{$title}</div>
		<div class="con_lists">{$content}</div>
		
	{/if} 
</div>
 
<!--  
<div id="content">
	<div class="boxCenterList RelaArticle">
	{if $smarty.get.type==3}
		<div class="con_lists box_title">{$title}</div>
		<div class="con_lists">订单编号:{$order_no}</div>
		<div class="con_lists">应付金额:<span style="color:red;">￥{$amount}</span>（{$delivery_name}&nbsp;{$paytype_name}）</div>
		{if $url}
		<div class="con_lists to_pay">
			<a href="{$url}" target="_blank">去支付</a>
		</div>
		{/if}
		{if $deatil_url}
		<div class="con_lists to_detail">
			<a href="{$deatil_url}" target="_blank">订单详情</a>
		</div>            
		{/if}
	{else}
		<div class="con_lists box_title">{$title}</div>
		<div class="con_lists">{$content}</div>
		
	{/if} 
	</div>
	<div class="clear_both"></div>
	<div class="other_choice">
		您还可以&nbsp;<span><a style="text-decoration:underline" href="{$url_base}index.php?go=kmall.index.index">返回首页</a></span>&nbsp;或去&nbsp;<span><a style="text-decoration:underline" href="{$url_base}index.php?go=kmall.member.view">会员中心</a></span> 
	</div>
</div>
-->
{/block}
