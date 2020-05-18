{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="container_width main">
	<div class="mshow">
		<img src="{$template_url}resources/images/auth/register.png" width="640"/>
	</div>
	<div class="mcon">
		<div class="box">
			<div class="title">
				<a href="{$url_base}index.php?go=kmall.auth.login"><div class="t">会员登陆</div></a>
				<div class="l"></div>
				<div class="t f">忘记密码</div>
			</div>
			<form method="post">
				<table class="con">
					<tr>
						<td width="130"></td>
						<td><div class="msg" id="message">{$message}</div></td>
					</tr>
					<tr>
						<td><div class="name">帐&#12288;号：</div></td>
						<td><input type="text" class="txt" name="username" id="username"/></td>
					</tr>
					<tr>
						<td><div class="name">手机验证码：</div></td>
						<td>
							<input type="text" class="txt" name="smsPwd" id="smsPwd" style="width:120px;"/>
							<button type="button" class="btnSmsSend" name="btnSmsSend" id="btnSmsSend" num="1">发送验证码</button>
						</td>
					</tr>
					<tr>
						<td><div class="name">密&#12288;码：</div></td>
						<td><input type="password" class="txt" name="password" id="password"/></td>
					</tr>
					<tr>
						<td></td>
						<td>
							<table border="0" cellSpacing="0" cellPadding="1" width="145">
								<tr align="center">
									<td id="pwd_lower" width="33%">弱</td>
									<td id="pwd_middle" width="33%">中</td>
									<td id="pwd_high" width="33%">强</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td><div class="name">确认密码：</div></td>
						<td><input type="password" class="txt" name="passwordconfirm" id="confirm_password"/></td>
					</tr>
					
					<tr>
						<td></td>
						<td><div class="btn_forgetPassword" id="btn_forgetPassword">修改密码</div></td>
					</tr>
				</table>
			</form>
		</div>
	</div>
</div>
<script>
	function changeValidatecode(){
		document.getElementById("validateCode").src="{$url_base}home/kmall/src/httpdata/validate.php?"+Math.random();
	}
  function sendMsg(){
    var smsSendUrl="{$url_base}home/kmall/src/httpdata/smsSend.php";
  }
</script>
{/block}
