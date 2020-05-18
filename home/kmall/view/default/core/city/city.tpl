{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
    <div class="left"><img src="{$template_url}resources/images/city/pic1.png" alt="" width="735" height="485" /></div>
    <div class="right">
        <div class="find">
            <span>城市运营商</span>
            <form method="get" action="{$url_base}index.php?go=kmall.member.addAddress">
                <select name="province" id="province">
                    <option value="0">-选择需要查询的省会-</option>
                    {foreach item=region from=$regions}
                                <option value="{$region->region_id}" {if ($region->region_id==$address.province)}selected{/if}>{$region->region_name}</option>
                    {/foreach}
                </select>
                <select name="city" id="city"><option value="0">-选择需要查询的市区-</option></select>
                <div class="btnbyadd">搜索结果</div>
                <div class="bor">
                    <input type="text" value="-输入您需要查询的店铺-" name="order_id" id="queryText"/>
                    <div class="btnbyname">搜 索</div>
                </div>
            </form>
        </div>
      <div class="big"></div>
    </div>
    <div class="clear"></div>
</div>
{/block}
