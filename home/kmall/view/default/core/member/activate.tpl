{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
	<div id="content">
		<div id="center_down">
			{php}                   
			include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php"); 
			{/php}
			<div id="member_wrapper" class="center_border_color">
				<div class="item_title activate_title">激活会员卡</div>
				 <form id="activate_form" method="post">
					<table id="activate_tbl">
						<tr>
							<td class="td_r">姓名：</td>
							<td>
								<div style="color:gray;font-weight: bold;">{$member.realname}</div>                       
							</td>
						</tr>
						<tr>
							<td class="td_r">手机：</td>
							<td>
								<div style="color:gray;font-weight: bold;">{$member.mobile}</div>               
							</td>
						</tr>
						<tr>
							<td class="td_r">邮箱：</td>
							<td>
								<div style="color:gray;font-weight: bold;">{$member.email}</div>               
							</td>
						</tr>
						<tr>
							<td class="td_r">卡号：</td>
							<td>
								{if $cardflag}
								<div style="color:gray;font-weight: bold;">{$member.cardno}</div>
								{else}
								<input id="activate_cardno" type="text" name="cardno" class="inputBg" size="20" maxlength="16"/><font id="activate_cardno_notice"></font><br />
								<span>请输入会员卡背面16位字符</span>
								{/if}
							</td>
						</tr>
						{if $cardflag}
						{else}
						<tr>
							<td class="td_r">验证码：</td>
							<td>
								<input id="validate_code" type="text" name="validate_code" class="inputBg" size="5" maxlength="4"/>
								<img src="{$url_base}home/kmall/src/httpdata/validate.php" id="validate_img" onclick="changeCode();"/>
								<a onclick="changeCode();">看不清楚？换张图片</a><font id="validate_code_note">{$message}</font><br />
								<span>请输入图片中的字符</span>
							</td>
						</tr>
						<tr>
							<td></td>
							<td><input type="submit" value="" id="activate_submit"/></td>
						</tr>
						{/if}
					</table>
				</form>
			</div>
		</div>
	</div>
	<script>
		function changeCode(){
			document.getElementById('validate_img').src="{$url_base}home/kmall/src/httpdata/validate.php?"+Math.random();
		}
	</script> 
{/block}