{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">                                       
	<div id="member">
        <div class="title_card">首页 > 票卡券 > 票卡券兑换</div>
        <div class="cue">请选择您需要兑换的礼品<span><!--(*温馨提示：您一共可以选择3样礼品)--></span></div>
        <form action="{$url_base}index.php?go=kmall.voucher.checkoutview" method="post" id="selGoodsForm">
        <table>
            <tr class="bg_tr">
                <td height="30" width="80">选择</td>
                <td width="340">商品</td>
                <td>商品规格</td>
            </tr>
            {foreach item=goods from=$exchangegoods name=foo}
            <tr class="bor_tr">
                <td height="85">
                    <input name="goods_id" type="radio" value="{$goods->goods_id}" {if $goods->isUp}checked="checked"{/if} {if !$goods->isUp}disabled="disabled"{/if} />
                </td>
                <td>
                    <div class="pro_img">
                        <img src="{$url_base}upload/images/{$goods->image}" alt="Image" />
                    </div>
                    <a class="pro_txt" title='{$goods->goods_name}' href="{$url_base}index.php?go=kmall.product.view&goods_id={$goods->goods_id}" target="_blank">{$goods->goods_name}</a>
                </td>
                <td>{$goods->info}{if !$goods->isUp}<span style="color:red">(此商品暂时缺货)</span>{/if}</td>
            </tr>
            {/foreach}
            <tr>
                <!--<td height="60"><input type="checkbox"><span class="all">全选</span></td>
                <td><span class="reset">重新选择</span></td>-->
                <td colspan="3" height="60">
                    <input type="hidden" name="paytype" value="{$paytype}">
                    <div class="btn_submit" id="vi_btn_submit">
                        <img src="{$template_url}resources/images/member/btn_submit.jpg" alt="Image" >
                    </div>
                </td>
            </tr>
        </table>
        </form>
	</div>	  
</div>
{/block}