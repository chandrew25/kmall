{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
    <div id="my" class="login_content">
        <div class="my_info">
            <img src="{$template_url}resources/images/login/bj_01.jpg" />
            <div class="my_mian login_pic">
                <a href="#">
                    {*<img src="{$template_url}resources/images/login/logo_03.png" />*}
                </a>
            </div>
        </div>
        <div class="login">
            <form action="" method="post">
                <p class="login_p">
                    <span class="logo_user"><img src="{$template_url}resources/images/login/login_04.png"/></span>
                    <input type="text" name="username" placeholder="请输入用户名" autocomplete="off"/>
                </p>
                <p class="login_p">
                    <span class="logo_pwd"><img src="{$template_url}resources/images/login/login_07.png"/></span>
                    <input type="password" placeholder="请输入密码" name="password"/>
                </p>
                <label style="color: #ff0000;width: 50%;text-align: center;float: left;">{$message}</label>
                <a href="index.php?go=mobile.auth.forgetPassword" style="color: #868484;float: right;width: 100px;">忘记密码？</a>
                <p class="login_sub"><input type="submit" id="sub" value="登录"/></p>
            </form>
        </div>
    </div>
{/block}
