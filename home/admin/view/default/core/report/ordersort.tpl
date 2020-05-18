{extends file="$templateDir/layout/normal/layout.tpl"}
{block name=body}
{literal}
<style type="text/css">
*{margin:0px;padding:0px;}
body     {margin:10px auto;font-size:12px;}
#header {margin:0 auto;width:1204px;height:32px;background-color:#efefef;margin-bottom:10px;border:1px solid #cccccc;line-height:32px;font-size:13px;font-family:"新宋体";padding:auto;}
#search {_padding:4px;margin-left:10px;}
.input    {width:100px;margin:0 -4px;background:url(home/admin/view/default/resources/images/icon.gif) no-repeat #e2e8eb;padding-left:16px;}
.input2    {width:48px;}
.input3    {width:74px;margin-left:-5px;}
#main    {margin:0 auto;width:1194px;background-color:#efefef;border:1px solid #cccccc;bordercolor:#cccccc;padding:5px 0px 15px 0px;overflow:hidden;}
.table     {float:left;width:597px;margin-top:10px;}
.frame     {position:relative;top:1px;left:1px;width:556px;height:65px;+height:63px;background-color:#fff;border:1px solid #cccccc;border-right:2px solid #cccccc;border-bottom:2px solid #cccccc;margin-left:10px;margin-top:10px;}
.title    {font-weight:bold;font-size:14px;margin:0px 0px 0px 13px;}
.tb     {position:relative;top:3px;left:3px;width:550px;padding-top:1px;padding-left:1px;font-size:13px;}
.col     {width:227px;height:26px;+height:24px;background:url(home/admin/view/default/resources/images/bg.gif) repeat-x;border-bottom:1px solid #cccccc;text-align:center;}
.col2     {width:227px;height:27px;+height:24px;text-align:center;border:1px solid #cccccc;border-top:0;border-left:0;}
.col3     {width:227px;height:27px;+height:24px;text-align:center;background-color:#efefef;border-right:1px solid #cccccc;}
</style>
{/literal}
<!--
<div id="header">
    <form id="search" method="post" action="{$url_base}index.php?go=admin.report.ordersort">
        <span>&nbsp;从</span>
        <input type="text" name="begintime" class="input" id="begintime" val="{$begintime}"/>
        <span>至</span>
        <input type="text" name="endtime" class="input" id="endtime" val="{$endtime}"/>
        <input type="submit"  class="input2" value="查找" />
        <input type="reset"  class="input2" value="重置" />
    </form>
</div>
-->
<div id="main">
    <div class="table">
        <span class="title">客户平均订单金额</span>
        <div class="frame">
            <table class="tb">
                <tr>
                    <th class="col"><span>总订单金额</span></th>
                    <th class="col"><span>总订单数</span></th>
                    <th class="col"><span>平均订单金额</span></th>
                </tr>
                {foreach from=$list1 item=data}
                <tr>
                    <td class="col2"><span>{$data->money}</span></td>
                    <td class="col2"><span>{$data->count}</span></td>
                    <td class="col2"><span>{$data->avg}</span></td>
                </tr>
                {/foreach}
            </table>
        </div>
    </div>
    <!--
    <div class="table">
        <span class="title">每次访问平均订单金额</span>
        <div class="frame">
            <table class="tb">
                <tr>
                    <th class="col"><span>总订单金额</span></th>
                    <th class="col"><span>总订单数</span></th>
                    <th class="col"><span>平均订单金额</span></th>
                </tr>
                <tr>
                    <td class="col2"><span>-</span></td>
                    <td class="col2"><span>1</span></td>
                    <td class="col2"><span>206.850</span></td>
                </tr>
            </table>
        </div>
    </div>
    -->
    <div class="table">
        <span class="title">订单转化率</span>
        <div class="frame">
            <table class="tb">
                <tr>
                    <th class="col"><span>总订单数量</span></th>
                    <th class="col"><span>总访问次数</span></th>
                    <th class="col"><span>订单转化率</span></th>
                </tr>
                {foreach from=$list2 item=data}
                <tr>
                    <td class="col2"><span>{$data->ordercount}</span></td>
                    <td class="col2"><span>{$data->clickcount}</span></td>
                    <td class="col2"><span>{$data->scale}%</span></td>
                </tr>
                {/foreach}
            </table>
        </div>
    </div>
    <div class="table">
        <span class="title">注册会员购买率</span>
        <div class="frame">
            <table class="tb">
                <tr>
                    <th class="col"><span>有过订单的会员数</span></th>
                    <th class="col"><span>总会员数</span></th>
                    <th class="col"><span>注册会员购买率</span></th>
                </tr>
                {foreach from=$list4 item=data}
                <tr>
                    <td class="col2"><span>{$data->ordercount}</span></td>
                    <td class="col2"><span>{$data->membercount}</span></td>
                    <td class="col2"><span>{$data->scale}%</span></td>
                </tr>
                {/foreach}
            </table>
        </div>
    </div>
    <div class="table">
        <span class="title">平均会员订单量</span>
        <div class="frame">
            <table class="tb">
                <tr>
                    <th class="col"><span>总订单数量</span></th>
                    <th class="col"><span>总会员数量</span></th>
                    <th class="col"><span>平均会员订单量</span></th>
                </tr>
                {foreach from=$list3 item=data}
                <tr>
                    <td class="col2"><span>{$data->ordercount}</span></td>
                    <td class="col2"><span>{$data->membercount}</span></td>
                    <td class="col2"><span>{$data->avgorder}%</span></td>
                </tr>
                {/foreach}
            </table>
        </div>
    </div>
</div>
{/block}