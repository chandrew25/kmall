{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="main container_width">
	<div class="mcon">
		{if $success}
		<div class="msuccess">
			<div class="mst">密码重置成功。<span class="showsclogin a">现在登录</span></div>
		</div>
		{/if}
		{if $error}
		<div class="merror">
			<div class="met">您的找回密码链接无效，请尝试下面的操作提示：</div>
			<ul class="mec">
				<li>请到您的邮箱中完整复制找回密码邮件中的重置密码链接后，拷贝至浏览器的地址栏中重试一次。</li>
				<li>找回密码邮件的有效期为30分钟，如果您没能在有效期内完成密码重置，请<span class="showscpwd a">重新找回密码</span>。</li>
			</ul>
			<div class="meb"><span id="pwdfindclose" class="a">关闭</span></div>
		</div>
		{/if}
		{if $form}
		<form action="{$url_base}index.php">
			<input type="hidden" name="go" value="kmall.member.pwdreset"/>
			<input type="hidden" name="code" value="{$code}"/>
			<ul class="mform">
				<li>
					<div class="fname">重置密码：</div>
					<div class="ftext"><input type="password" name="password" maxlength="25"/></div>
					<div class="fnotice"></div>
				</li>
				<li>
					<div class="fname">确认密码：</div>
					<div class="ftext"><input type="password" name="pwdconfirm" maxlength="25"/></div>
					<div class="fnotice"></div>
				</li>
				<li>
					<div class="fsubmit"><input type="button" value="提 交" id="mformbtn"/></div>
				</li>
			</ul>
		</form>
		{/if}
	</div>
</div>
{/block}
