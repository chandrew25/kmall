{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div class="main">
        <div class="main_order_search">
            <div class="mos_title">
                <div class="mos_img">
                    <img class="fixpng" src="{$template_url}resources/images/search.png">
                </div>
            </div>
            <div class="mos_lists">
                <div class="mos_content">
                {if $orders}
                    <table class="mos_table" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="mos_t_one mos_first_line">订单号</td>
                            <td class="mos_t_two">商品名称</td>
                            <td class="mos_t_three">下单时间</td>
                            <td class="mos_t_four">订单金额</td>
                            <td class="mos_t_five">订单状态</td>
                        </tr>
                        {foreach item=order from=$orders name=ordersearch}
                        <tr>
                            <td class="mos_t_one mos_first_line">{$order.order_no}</td>
                            <td class="mos_t_two">                                    
                            {foreach item=eachgoods from=$order.goods name=i}
                                {if $smarty.foreach.i.index < 3}
                                <a href="index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" alt="{$eachgoods.goods_name}" title="{$eachgoods.goods_name}">{$eachgoods.goods_name}</a><br />
                                {/if}
                            {/foreach}
                            </td>
                            <td class="mos_t_three">{$order.updateTime}</td>
                            <td class="mos_t_four">{$order.final_amount|string_format:'%.2f'}</td>
                            <td class="mos_t_five">{$order.ship_statusShow}</td>
                        </tr>
                        {/foreach}                                   
                    </table>
                {else}
                    <div class="mos_error">对不起,请先输入您的手机号并获取验证码,然后再查询您的订单！</div>
                {/if}
                </div>
            </div>
        </div>
    </div>
{/block}
