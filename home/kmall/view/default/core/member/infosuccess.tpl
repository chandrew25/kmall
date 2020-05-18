{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <meta http-equiv="refresh" content="3;URL={$url_base}index.php?go=kmall.index.index" />
    <div align="center" class="loginregister">
        <div class="blank"></div>
        <div class="block">
            <div class="box">
                <div class="box_1">
                	<!--
                    <h3><span>系统信息</span></h3>
                    -->
                    <div class="boxCenterList RelaArticle" align="center">
                        <div style="margin:0px auto;">
                            <p style="font-size: 14px; font-weight:bold; color: red;">修改成功</p>
                            <p><span id="time"></span>秒后自动跳转到会员中心</p>
                            <p><a href="{$url_base}index.php?go=kmall.index.index">返回首页</a></p>
                            <p><a href="{$url_base}index.php?go=kmall.member.view">查看我的会员中心</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        var countDown=3;//倒计时秒数
        var toUrl="{$url_base}index.php?go=kmall.member.view";//最终要跳转的页面路径
        function redirect(){
            $("#time").html(countDown--);
            if(countDown>=0){
                setTimeout("redirect()",1000);
                return;
            }
            location=toUrl;
        };
        redirect();
    </script>
{/block}