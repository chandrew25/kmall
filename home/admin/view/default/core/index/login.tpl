{extends file="$templateDir/layout/normal/layout.tpl"}
{block name=body}
<div class="show png" id="show">
    <div class="st png">菲彼家园后台管理系统</div>
    <div class="scon">
        <div class="scl">
            <div class="lt" id="message">{$message|default:""}</div>
            <form method="post" id="loginform">
            <ul class="linfo">
                <li>
                    <div class="il">用户名：</div>
                    <div class="ir">
                        <div class="inputbg1 png"><input type="text" name="username" maxlength="50" id="loginform_username"/></div>
                    </div>
                </li>
                <li>
                    <div class="il">密&#12288;码：</div>
                    <div class="ir">
                        <div class="inputbg1 png"><input type="password" name="password" maxlength="50" id="loginform_password"/></div>
                    </div>
                </li>
                <li>
                    <div class="il">验证码：</div>
                    <div class="ir">
                        <div class="inputbg2 png"><input type="text" name="validate" maxlength="4" id="loginform_vcode"/></div>
                        <img class="vcode" src="{$url_base}home/kmall/src/httpdata/validate.php" id="info_vimg"/>
                        <div class="vchange"><a onclick="changeVcode('info_vimg')">换一张</a></div>
                    </div>
                </li>
                <li>
                    <div class="ir">
                        <div class="btnlogin png" id="btnlogin"></div>
                    </div>
                </li>
            </ul>
            </form>
        </div>
    </div>
</div>
<input type="hidden" id="url_base" value="{$url_base}"/>
<script>
    function changeVcode(id){
        $("#"+id).attr("src","{$url_base}home/kmall/src/httpdata/validate.php?"+Math.random());
    }
</script>
{*
<div id="main">
    <form method="post">
    <div id="content">
        <table class="content">
            <tr class="left">
                <td class="leftContent" align="center"><img src="{$url_base}home/kmall/view/default/resources/images/logo.jpg" class="logoLeft" alt="{$site_name} -- 后台管理" /></td>
                <td class="right">
                    <table class="right">
                        <tr><td class="title" align="center"><b>{$site_name}后台管理</b></td></tr>
                        <tr align="center"><td><font color="#ff0000">{$message|default:''}</font></td></tr>
                        <tr align="center"><td><label>用户名&nbsp;&nbsp;&nbsp;</label><input class="inputNormal" type="text" name="username" /><br/></td></tr>
                        <tr align="center"><td><label>密&nbsp;&nbsp;码&nbsp;&nbsp;&nbsp;</label><input class="inputNormal" type="password" name="password" /><br/></td></tr>
                        <tr align="center"><td><label>图形验证码</label><input class="inputVerify" name="validate" id="validate" size="15" type="text" /><img src="{$url_base}home/admin/src/httpdata/validate.php" name="validateCode" id="validateCode" onclick="changeCode();" style="cursor: pointer;vertical-align:top;"/></td></tr>
                        <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="cursor: pointer;" onclick="changeCode();">看不清楚？换张图片</a></td></tr>
                        <tr><td align="center"><input type="submit" name="Submit" value="登录" class="btnSubmit" /></td></tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    </form>
</div>
<script>
    function changeCode(){
        document.getElementById('validateCode').src="{$url_base}home/admin/src/httpdata/validate.php?"+Math.random();
    }
</script>
*}
{/block}
