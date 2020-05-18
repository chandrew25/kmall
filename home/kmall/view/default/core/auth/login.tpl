{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="container_width main">
	<div class="mshow">
		<img src="{$template_url}resources/images/auth/login.png" width="640" />
	</div>
	<div class="mcon">
		<div class="box">
			<div class="title">
				<div class="t f">会员登陆</div>
				<div class="l"></div>
				<a href="{$url_base}index.php?go=kmall.auth.register"><div class="t">免费注册</div></a>
			</div>
			<form method="post">
				<table class="con">
					<tr>
						<td width="130"></td>
						<td><div class="msg" id="message">{$message}</div></td>
					</tr>
					<tr>
						<td><div class="name">帐&#12288;号：</div></td>
						<td><input type="text" class="txt" name="username"/></td>
					</tr>
					<tr>
						<td><div class="name">密&#12288;码：</div></td>
						<td><input type="password" class="txt" name="password"/></td>
					</tr>
					<tr>
						<td><div class="name">验证码：</div></td>
						<td>
							<input type="text" class="txt v" maxlength="4" name="validate"/>
							<img class="vimg" src="{$url_base}home/kmall/src/httpdata/validate.php" id="validateCode"/>
							<span class="vmsg" onclick="changeValidatecode()">看不清？换张图</span>
						</td>
					</tr>
					<tr>
						<td></td>
						<td><input type="checkbox" class="chk" name="remember" value="1" checked="checked" id="remember"/><label class="cht" for="remember">记住密码</label></td>
					</tr>
					<tr>
						<td></td>
						<td><div class="btn_login" id="btn_login"></div></td>
					</tr>
				</table>
			</form>
		</div>
		<ul class="link">
			<li><a href="{$url_base}index.php?go=kmall.auth.forgetPassword">忘记密码？</a></li>
			<li>|</li>
			<li><a>意见反馈</a></li>
		</ul>
	</div>
</div>
<script>
	function changeValidatecode(){
		document.getElementById("validateCode").src="{$url_base}home/kmall/src/httpdata/validate.php?"+Math.random();
	}
</script>
{/block}
