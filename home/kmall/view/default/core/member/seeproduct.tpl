{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="content">
        <div id="center_down">
            {php}                   
            include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php"); 
            {/php}
            <div id="member_wrapper" class="center_border_color">
                <div id="member">
                    <div id="member_title">浏览历史</div>
                    <table class="tbl">
                        <tr class="tbl_head">
                            <td width="300">商品名称</td>
                            <td width="150">价格</td>
                            <td width="200">操作</td>
                        </tr>
                        {if count($seeproducts) !==0}
                        {foreach item=seeproduct from=$seeproducts}
                        <tr>
                            <td align="left">&nbsp;<a href="index.php?go=kmall.product.view&product_id={$seeproduct.product_id}">{$seeproduct.product_name}/{$seeproduct.unit}</a></td>                                                                                                                                             
                            <td>&nbsp;本店：￥{$seeproduct.price}</td>
                            <td><a href="index.php?go=kmall.member.addAttentionBySeeproduct&seeproduct_id={$seeproduct.seeproduct_id}">关注</a>&nbsp;<a href="index.php?go=kmall.cart.addProduct&product_id={$seeproduct.product_id}&num=1">加入购物车</a>&nbsp;<a href="index.php?go=kmall.member.delSeeproduct&seeproduct_id={$seeproduct.seeproduct_id}">删除</a></td>
                        </tr>
                        {/foreach}
                        {else}
                            <td colspan="3" height="60" align="center">你在近期没有收藏</td>
                        {/if}
                    </table>
                    <div id="orderList_count_wrapper" align="left">
                        <my:page src="{$url_base}index.php?go=kmall.member.seeproduct" /> 
                    </div>
                </div>
            </div>
        </div>
    </div>   
{/block}