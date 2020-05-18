{extends file="$templateDir/layout/cart/layout.tpl"}
{block name=body}
    <div id="my">
        <div class="my_info">
            <img src="{$template_url}resources/images/my/bj.png" />
            <div class="my_mian">
                <p class="my_pic">
                    <img src="{$template_url}resources/images/my/my_03.png" />
                </p>
                <span class="my_number">{$member->mobile}</span>
                <span class="my_txt">余额：{$member->jifen}券</span>
            </div>
        </div>
        <div class="my_content clearfix">
            <ul>
                <a href="{$url_base}index.php?go=mobile.order.lists">
                    <li class="my_border">
                        <span class="my_pic"><img src="{$template_url}resources/images/my/main_04.png" /></span>
                        <span class="my_order">我的订单</span>
                        <span class="my_right"><img src="{$template_url}resources/images/my/right.png"/></span>
                    </li>
                </a>
                <a href="{$url_base}index.php?go=mobile.member.results">
                    <li class="my_border topline">
                        <span class="my_pic"><img src="{$template_url}resources/images/my/main_11.png" /></span>
                        <span class="my_order">收货地址</span>
                        <span class="my_right"><img src="{$template_url}resources/images/my/right.png"/></span>
                    </li>
                </a>
                {*<a href="Account_recharge.html">*}
                    {*<li class="my_border topline">*}
                        {*<span class="my_pic"><img src="{$template_url}resources/images/my/main_13.png" /></span>*}
                        {*<span class="my_order">账户充值</span>*}
                        {*<span class="my_right"><img src="{$template_url}resources/images/my/right.png"/></span>*}
                    {*</li>*}
                {*</a>*}
                {*<a href="Balance_transfer.html">*}
                    {*<li class="topline">*}
                        {*<span class="my_pic"><img src="{$template_url}resources/images/my/main_15.png" /></span>*}
                        {*<span class="my_order">余额转移</span>*}
                        {*<span class="my_right"><img src="{$template_url}resources/images/my/right.png"/></span>*}
                    {*</li>*}
                {*</a>*}
            </ul>
        </div>
        <div id="close">
            <a href="{$url_base}index.php?go=mobile.auth.logout" class="close_con">退出登录</a>
        </div>
        <div class="my_content_box"></div>
    </div>

{/block}
