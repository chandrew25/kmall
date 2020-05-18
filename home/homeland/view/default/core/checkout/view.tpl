{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
    <div id="wrapper">
        <div class="int_title"><a href="#" onClick="javascript:history.back(-1);"><span class="int_pic"><img src="{$template_url}resources/images/jifen/left.png"/></span></a>填写订单</div>
        <div class="m_pwd topline" style="height: auto;">
            <form action="{$url_base}index.php?go=mobile.checkout.over" method="post" id="checkoverForm" >
            <div class="fill_order clearfix">
                <ul class="fill_box">
                    <input id="ness_address" type="hidden" name="ness_address" value="{if $address}{$address->address_id}{/if}" />
                    <li class="fill_left fill_list fl">
                        <span class="fill_span">{$address.consignee}  {$address.mobile}</span>
                        <p class="fill_pic clearfix">
                            <span class="span_pic fl"><img src="{$template_url}resources/images/ddxq/icon.png"></span>
                            <span class="span_text fr">{$address.allregion}{$address.address}</span>
                        </p>
                    </li>
                    <li class="fill_right fill_list fr">
                        <a href="{$url_base}index.php?go=mobile.member.selAddress&location=checkout""><img src="{$template_url}resources/images/ddxq/right.png" class="fill_img" /></a>
                    </li>
                </ul>
            </div>
                <div class="paymenttype">
                    <ul class="fill_box">
                        {if $statisticAll.totalPrice > 0}
                        <li class="fill_right fill_list fr">
                            <img src="{$template_url}resources/images/WePayLogo.png">
                            <input type="radio" name="paymenttype" value="wxpay" checked>
                        </li>
                        {else}
                        <li class="fill_right fill_list fr">
                            <img src="{$template_url}resources/images/jifen.png">
                            <input type="radio" name="paymenttype" value="jifen" checked>
                        </li>
                        {/if}

                    </ul>
                </div>
            <div class="fill_main">
                {foreach item=cart from=$carts}
                <dl class="fill_dl clearfix">
                    <input type="hidden" name="sels[{$cart->goods_id}]" value="{$cart->goods_id}" />
                    <dt class="fill_p_pic fl">
                        <img src="{$url_base}upload/images/{$cart->ico}" />
                    </dt>
                    <dd class="fill_p_text fr">
                        <span class="fill_p_con">{$cart->goods_name}</span>
                        <p class="fill_p"><span class="f_right fr">x{$cart->num}</span></p>
                        <span class="fill_int">￥{$cart->sales_price|string_format:'%.2f'}+{$cart->jifen}.0券</span>
                    </dd>
                </dl>
                {/foreach}
            </div>
            <div class="con_sub clearfix">
                <span class="con_color fill_style fl all_style">实付款:{$statisticAll.realFee}{if $statisticAll.totalJifen}+{$statisticAll.totalJifen}券{/if}</span>
                <a href="#" class="con_ti fr" id="order_submit">确认提交</a>
            </div>
            </form>
        </div>
    </div>
    <script>
        var member_jifen={$member_jifen};
        var totalJifen={$statisticAll.totalJifen};
    </script>
{/block}
