{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	{php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
	<div id="member_wrapper" class="center_border_color">
	<form method="post" id="re_form">
		<table border="0" cellSpacing="3" cellPadding="3" width="100%" align="left" class="rp_con">
			<tr>
				<td align="right">您的密码:</td>          
				<td>
					<input id="rp_old_pwd" class="inputBg" type="password" name="oldpwd" size="25" />
				</td>
			</tr>
			<tr>
				<td class="rp_info" colspan="2" id="pwd_tip">{if $error}<font color="red">原始密码错误,请重新输入!</font>{/if}</td>          
			</tr>
			<tr>
				<td align="right">新的密码:</td>          
				<td>
					<input id="new_pwd" class="inputBg" type="password" name="newpwd" size="25" />
				</td>
			</tr>
			<tr>
				<td class="rp_info" colspan="2" id="new_pwd_tip"></td>          
			</tr>               
			<tr>
				<td align="right">密码确认:</td>          
				<td>
					<input id="confirm_pwd" class="inputBg" type="password" name="confirm" size="25" />
				</td>
			</tr>
			<tr>
				<td class="rp_info" colspan="2" id="confirm_tip"></td>          
			</tr>
			<tr>
				<td colspan="2">
					<div class="rp_submit_style fixpng" id="rp_submit" >提交</div>
				</td>
			</tr>          
		</table>
	</form>                
	</div>
</div>
{/block}