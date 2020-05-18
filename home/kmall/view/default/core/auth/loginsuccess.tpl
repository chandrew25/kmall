{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
	<!--
    <meta http-equiv="refresh" content="3;URL={$url_base}index.php?go=kmall.index.index" />
    -->

    <div align="center" class="loginregister">
        <div class="blank"></div>
        <div class="block">
            <div class="box">
                <div class="box_1">
                    <div class="boxCenterList RelaArticle" align="center">
                        <div>
                            <p style="font-size: 14px; font-weight:bold; color: red;">登录成功</p>
                            <p><span id="time"></span>秒后自动跳转到首页</p>
                            <p><a href="{$url_base}index.php?go=kmall.index.index">返回首页</a></p>
                            <p><a href="{$url_base}index.php?go=kmall.member.view&i=1">查看我的会员中心</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
		var countDown=3;//倒计时秒数
		var toUrl="{$url_base}index.php?go=kmall.member.view&i=1";//最终要跳转的页面路径
		function redirect(){
			$("#time").html(countDown--);
			if(countDown>=1){
				setTimeout("redirect()",1000);
				return;
			}
			location=toUrl;
		};
		redirect();
	</script>
{/block}