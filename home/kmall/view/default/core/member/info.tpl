{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	{php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
	<div id="member_wrapper" class="center_border_color">
		<form method="post" id="infoForm">
			<table border="0" cellSpacing="3" cellPadding="3" width="100%" align="left">
				<tr class="user_info">
					<td colspan="2" class="info_title">个人信息&nbsp;<span class="theme_font_color_medium">&#40;*为必填项&#41;</span></td>
				</tr>
				<tr><td colspan="2"><div class="user_info_border content_title_bkgcolor"></div></td></tr>
				<tr>
					<td id="extend_field4i" align="right">您的姓名</td>          
					<td>
						<input class="inputBg" name="realname" size="25" type="text" value="{$member.realname}" id="realname"/><span class="notice" id="realname_notice">*</span>
					</td>
				</tr>
				<tr>
					<td id="extend_field1i" align="right">姓别</td>
					<td>
						<input type="radio" name="sex" value="1" id="male" {if $member.sex=='1'}checked="checked" {/if}/><label for="male">男</label>
						<input type="radio" name="sex" value="-1" id="female" {if $member.sex=='-1'}checked="checked" {/if}/><label for="female">女</label>
					</td>
				</tr>
				<tr>
					<td id="extend_field4i" align="right">家庭地址</td>          
					<td>
						<input class="inputBg" name="address" size="25" type="text" value="{$member.address}" id="address"/>
					</td>
				</tr>
				<tr>
					<td id="extend_field5i" align="right">手机</td>          
					<td>
						<input class="inputBg" name="mobile" size="25" type="text" value="{$member.mobile}" id="mobile"/><span class="notice" id="mobile_notice">*</span>
					</td>
				</tr>
				<tr>
					<td id="extend_field5i" align="right">Email</td>          
					<td>
						<input class="inputBg" name="email" size="25" type="text" value="{$member.email}" id="email"/><span class="notice" id="email_notice"></span>
					</td>
				</tr>
				<tr>
					<td id="extend_field5i" align="right">生日</td>          
					<td>
						<input class="inputBg" name="birthday" id="birthday" size="25" type="text" value="{$member.birthday}" id="birthday" readonly="readonly"/>
					</td>
				</tr>
				<tr>
					<td id="extend_field5i" align="right">是否愿意接受邮件</td>          
					<td>
						<input type="checkbox" name="isCanEmail" id="isCanEmail" {if $member.isCanEmail}checked="checked"{/if}/><label for="isCanEmail">&#40;便于将限量优惠的信息第一时间通知您&#41;</label>
					</td>
				</tr>
				<tr>
					<td id="extend_field5i" align="right">是否愿意接收短信</td>          
					<td>
						<input type="checkbox" name="isCanSms" id="isCanSms" {if $member.isCanSms}checked="checked"{/if}/><label for="isCanSms">&#40;便于将限量优惠的信息第一时间通知您&#41;</label>
					</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td><input name="submit" type="submit" value="" id="register_submit" class="png" /></td>
				</tr>
			</table>
		</form>                
	</div>
</div>
{/block}