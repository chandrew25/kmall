{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
    <div id="my" class="login_content">
        <div class="int_title"><a href="#" onClick="javascript:history.back(-1);"><span class="int_pic"><img src="{$template_url}resources/images/jifen/left.png"/></span></a>忘记密码</div>

        <div class="forgetPassword" style="float: left;width: 100%;background-color: #ffffff;">
            <form action="" method="post">
                <div class="msg" id="message">
                    {$message}
                </div>
                <p class="login_p">
                    <span class="logo_user">手机号</span>
                    <input type="text" class="txt" name="username" id="username" placeholder="请输入手机号"/>
                </p>
                <p class="login_p">
                    <span class="logo_user">验证码</span>
                    <input type="text" class="txt" name="smsPwd" id="smsPwd" placeholder="请输入验证码" style="width:120px;"/>
                    <button type="button" class="btnSmsSend" name="btnSmsSend" id="btnSmsSend" num="1">发送验证码</button>
                </p>
                <p class="login_p">
                    <span class="logo_user">密&#12288;码</span>
                    <input type="password" class="txt" name="password" id="password" placeholder="请输入密码"/>
                </p>
                <p class="login_p">
                    <span class="logo_user">确认密码</span>
                    <input type="password" class="txt" name="passwordconfirm" id="confirm_password" placeholder="再次输入密码"/>
                </p>
                <p class="login_sub"><input type="button" id="btn_forgetPassword" value="修改密码"/></p>
            </form>
        </div>
    </div>
{/block}
