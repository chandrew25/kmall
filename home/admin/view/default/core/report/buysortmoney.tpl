{extends file="$templateDir/layout/normal/layout.tpl"}
{block name=body}
{literal}
<style type="text/css">
*{margin:0px;padding:0px;}
body     {margin:10px auto;font-size:12px;}
#header    {margin:0 auto;width:1184px;height:32px;background-color:#efefef;margin-bottom:10px;border:1px solid #cccccc;line-height:32px;font-size:13px;font-family:"新宋体";}
#search {_padding:4px;margin-left:10px;}
#icon    {position:absolute;width:20px;height:20px;left:120px;top:15px;}
#icon2     {position:absolute;width:20px;height:20px;left: 247px;top:15px;}
.input    {background-color:#e2e8eb;width:100px;background:url(home/admin/view/default/resources/images/icon.gif) no-repeat;padding-left:16px;}
.input2    {wdith:48px;}
.input3    {wdith:74px;margin-left:-5px;}
#main     {margin:0 auto;width:1174px;overflow: visible;background-color:#efefef;border:1px solid #cccccc;bordercolor:#cccccc;padding:4px;}
#frame     {position:relative;width:1152px;overflow: visible;background-color:#fff;border:1px solid #cccccc;border-right:2px solid #cccccc;border-bottom:2px solid #cccccc;margin:10px;+margin-top:14px;}
#tb        {position:relative;width:1147px;padding-top:1px;padding-left:1px;margin:3px;}
.font1     {font-size:12px;}
.font2     {font-size:13px;}
.col    {width:227px;height:26px;background:url(home/admin/view/default/resources/images/bg.gif) repeat-x;border-bottom:1px solid #cccccc;border-left: 1px solid #CCCCCC;text-align:center;}
.col2    {width:227px;height:27px;text-align:center;border:1px solid #cccccc;border-top:0;border-left:0;}
.col3     {width:227px;height:25px;text-align:center;background-color:#efefef;border-right:1px solid #cccccc;}
</style>
{/literal}
<div id="header">
    <form id="search" method="post" action="{$url_base}index.php?go=admin.report.buysortmoney">
        <span>&nbsp;从</span>
        <input type="text" name="begintime" class="input" id="begintime" val="{$begintime}"/>
        <span>至</span>
        <input type="text" name="endtime" class="input" id="endtime" val="{$endtime}"/>
        <input type="submit"  class="input2" value="查找" name="submit" />
        <input type="reset"  class="input3" value="重置" />
        <input type="submit"  class="input3" value="生成报表" name="submit"/>
    </form>
</div>
<div id="main">
    <div id="frame">
        <table id="tb">
            <tr class="font1">
                <th class="col"><span>排名</span></th>
                <th class="col"><span>用户名</span></th>
                <th class="col"><span>姓名</span></th>
                <th class="col"><span>购物量</span></th>
                <th class="col"><span>购物额</span></th>
            </tr>
            {foreach from=$list item=data name=list}
            <tr class="font1">
                <td class="col3"><span>{$smarty.foreach.list.index+1}</span></td>
                <td class="col2"><span>{$data->username}</span></td>
                <td class="col2"><span>{$data->realname|default:"-"}</span></td>
                <td class="col2"><span>{$data->nums}</span></td>
                <td class="col2"><span>{$data->amount}</span></td>
            </tr>
            {/foreach}
          </table>
    </div>
</div>
{/block}
