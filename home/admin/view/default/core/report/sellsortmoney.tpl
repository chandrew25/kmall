{extends file="$templateDir/layout/normal/layout.tpl"}
{block name=body}
{literal}
<style type="text/css">
*{margin:0px;padding:0px;}
body {margin:10px auto;font-size:12px;}
#header {margin:0 auto;width:1184px;height:32px;background-color:#efefef;margin-bottom:10px;border:1px solid #cccccc;line-height:32px;font-size:13px;font-family:"新宋体";}
#search {_padding:4px;margin-left:16px;}
.input{width:120px;height:20px;margin:0 -4px;}
#month {width:44px;}
.input2    {width:100px;margin:0 -4px;background-color:#e2e8eb;background:url(home/admin/view/default/resources/images/icon.gif) no-repeat;padding-left:16px;}
.font1     {font-size:12px;}
.font2     {font-size:13px;}
#main     {margin:0 auto;width:1174px;overflow:visible;background-color:#efefef;border:1px solid #cccccc;bordercolor:#cccccc;padding:4px;}
#frame {position:relative;width:1152px;overflow:visible;background-color:#fff;border:1px solid #cccccc;border-right:2px solid #cccccc;border-bottom:2px solid #cccccc;margin:10px;+margin-top:14px;}
#tb     {position:relative;width:1147px;padding-top:1px;padding-left:1px;background-color:#FFF;font-size:13px;margin:3px;}
.col     {width:283px;height:24px;background:url(home/admin/view/default/resources/images/bg.gif) repeat-x;border-bottom:1px solid #cccccc;border-left:1px solid #cccccc;text-align:center;}
.col2     {width:283px;height:29px;text-align:center;border:1px solid #cccccc;border-top:0;border-left:0;background-color:#f8fafc;}
.col3     {width:283px;height:29px;text-align:center;border:1px solid #cccccc;border-top:0;}
</style>
{/literal}
<div id="header">
    <form id="search" method="post" action="{$url_base}index.php?go=admin.report.sellsortmoney">
        <span>关键字</span>
        <input type="text" name="keyword" class="input" val="{$keyword}"/>
        <!--
        <select  type="text" name="data" id="month" >
            <option selected="selected">订单号</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
        </select>
        -->
        <span>&nbsp;从</span>
        <input type="text" name="begintime" class="input2" id="begintime" val="{$begintime}"/>
        <span>至</span>
        <input type="text" name="endtime" class="input2" id="endtime" val="{$endtime}"/>
        <input type="submit"  class="input3" value="查找" name="submit"/>
        <input type="reset"  class="input3" value="重置" />
        <input type="submit"  class="input4" value="生成报表" name="submit"/>
    </form>
</div>
<div id="main">
    <div id="frame">
        <table id="tb">
            <tr>
                <th class="col"><span>排名</span></th>
                <th class="col"><span>商品名称</span></th>
                <th class="col"><span>销售量</span></th>
                <th class="col"><span>销售额</span></th>
            </tr>
            {foreach from=$list item=data name=list}
            <tr>
                <td class="col3"><span>{$smarty.foreach.list.index+1}</span></td>
                <td class="col2"><span>{$data->name}</span></td>
                <td class="col2"><span>{$data->sell_count}</span></td>
                <td class="col2"><span>{$data->sell_money}</span></td>
            </tr>
            {/foreach}
        </table>
    </div>
</div>
{/block}