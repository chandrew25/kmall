 <div class="actfooter url_path" item="{$url_base}" id="footer">
	<div class="copyright">
		<p>&copy;&nbsp;2013-2022&nbsp;菲彼生活官方网站&nbsp;菲彼生活官方商城版权所有 All Rights Reserved</p>
		<p>ICP备案证书号：沪ICP备16023409号</p>


	</div>
</div>
<input type="hidden" id="url_base" value="{$url_base}"/>
<!--弹出层-->
<div class="showboxbg" id="showboxbg"></div>
<div class="showbox" id="showbox">
	<div class="st png"></div>
	<div class="sc png">
		<div class="close png"></div>
		<!--登录-->
		<div class="sccon c1" id="sclogin">
			<div class="sctitle">
				<div class="the png"></div>
				<div class="txt"><img class="png" src="{$template_url}resources/images/public/showbox/showbox_txt_yonghudenglu.png"/></div>
			</div>
			<div class="scline"></div>
			<ul class="scinfo">
				<li>
					<div class="il">用户名：</div>
					<div class="ir">
						<div class="inputw w1">
							<input type="text" id="sclogin_username"/>
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="warn" id="sclogin_username_warn"></div>
					</div>
				</li>
				<li>
					<div class="il">密&#12288;码：</div>
					<div class="ir">
						<div class="inputw w1">
							<input type="password" id="sclogin_password"/>
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="tip"><a class="showscpwd">忘记密码</a></div>
						<div class="warn" id="sclogin_password_warn"></div>
						<div class="ckw"><input class="ck" type="checkbox"/><font class="ckt">记住密码</font></div>
					</div>
				</li>
				<li>
					<div class="ir">
						<div class="btnw" id="sclogin_submit">
							<div class="bg b png"></div>
							<div class="bg f png"></div>
							<div class="imgw"><img class="png" src="{$template_url}resources/images/public/showbox/showbox_txt_denglu.png"/></div>
						</div>
						<div class="btnw b showscreg">
							<div class="bg b png"></div>
							<div class="bg f png"></div>
							<div class="imgw"><img class="png" src="{$template_url}resources/images/public/showbox/showbox_txt_mianfeizhuce.png"/></div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<!--找回密码-->
		<div class="sccon c1" id="scpwd">
			<div class="sctitle">
				<div class="the png"></div>
				<div class="txt"><img class="png" src="{$template_url}resources/images/public/showbox/showbox_txt_zhaohuimima.png"/></div>
			</div>
			<div class="scline"></div>
			<ul class="scinfo">
				<li>
					<div class="il">用户名：</div>
					<div class="ir">
						<div class="inputw w1">
							<input type="text" id="scpwd_username"/>
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="warn" id="scpwd_username_warn"></div>
					</div>
				</li>
				<li>
					<div class="il">验证码：</div>
					<div class="ir">
						<div class="inputw w2">
							<input type="text" maxlength="4" id="scpwd_vcode"/>
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="tip"><img class="img" id="scpwd_vimg" width="55" height="22"/>看不清？<a class="changecode" to="scpwd_vimg">换一张</a></div>
						<div class="warn" id="scpwd_vcode_warn"></div>
					</div>
				</li>
				<li>
					<div class="ir">
						<div class="btnw" id="scpwd_submit">
							<div class="bg b png"></div>
							<div class="bg f png"></div>
							<div class="imgw"><img class="png" src="{$template_url}resources/images/public/showbox/showbox_txt_queding.png"/></div>
						</div>
						<div class="tip r">我已经找回密码，<a class="showsclogin">重新登录</a></div>
					</div>
				</li>
			</ul>
		</div>
		<!--注册-->
		<div class="sccon c2" id="screg">
			<div class="sctitle">
				<div class="the png"></div>
				<div class="txt"><img class="png" src="{$template_url}resources/images/public/showbox/showbox_txt_yonghuzhuce.png"/></div>
			</div>
			<div class="scline"></div>
			<ul class="scinfo">
				<li>
					<div class="il">邮&#12288;箱：</div>
					<div class="ir">
						<div class="inputw w1">
							<input type="text" id="screg_email" ok="">
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="tip" id="screg_email_tip"></div>
						<div class="warn" id="screg_email_warn"></div>
					</div>
				</li>
				<li>
					<div class="il">用户名：</div>
					<div class="ir">
						<div class="inputw w1">
							<input type="text" id="screg_username" ok="">
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="tip" id="screg_username_tip"></div>
						<div class="warn" id="screg_username_warn"></div>
					</div>
				</li>
				<li>
					<div class="il">密&#12288;码：</div>
					<div class="ir">
						<div class="inputw w1">
							<input type="password" id="screg_password"/>
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="warn" id="screg_password_warn"></div>
					</div>
				</li>
				<li>
					<div class="il">确认密码：</div>
					<div class="ir">
						<div class="inputw w1">
							<input type="password" id="screg_cpassword"/>
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="warn" id="screg_cpassword_warn"></div>
					</div>
				</li>
				<li>
					<div class="il">验证码：</div>
					<div class="ir">
						<div class="inputw w2">
							<input type="text" maxlength="4" id="screg_vcode"/>
							<div class="b png"></div>
							<div class="f png"></div>
						</div>
						<div class="tip"><img class="img" id="screg_vimg" width="55" height="22"/>看不清？<a class="changecode" to="screg_vimg">换一张</a></div>
						<div class="ckw"><input class="ck" type="checkbox"/><font class="ckt">我已经看过并接受《<a target="_blank" href="#">服务条款</a>》</font></div>
						<div class="warn" id="screg_vcode_warn"></div>
					</div>
				</li>
				<li>
					<div class="ir">
						<div class="btnw" id="screg_submit">
							<div class="bg b png"></div>
							<div class="bg f png"></div>
							<div class="imgw"><img class="png" src="{$template_url}resources/images/public/showbox/showbox_txt_lijizhuce.png"/></div>
						</div>
						<div class="tip r">我已经注册，<a class="showsclogin">立即登录</a></div>
					</div>
				</li>
			</ul>
		</div>
	</div>
	<div class="sb png"></div>
</div>
<!--客服-->
<div class="kefushow" id="kefushow"><div class="png"></div></div>
<div class="kefu" id="kefu">
	<div class="t png"></div>
	<ul class="c">
		<li>
			<div class="pic"><img src="{$template_url}resources/images/public/kefu/kefu_mm.jpg"/></div>
			<a href="tencent://message/?Menu=yes&uin=99622693&Service=300&sigT=45a1e5847943b64c6ff3990f8a9e644d2b31356cb0b4ac6b24663a3c8dd0f8aa12a595b1714f9d45"><div class="btn png"></div></a>
		</li>
	</ul>
	<div class="b png"></div>
</div>
