{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	{php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
	<div class="right_list">
		<div class="title"><span>积分查询</span></div>
		<div class="find">
			<form method="post">
				<div style="width:50px;float:left;background-color:#fff;color:#333;">时间：</div>
				<input type="date" value="{$start}" name="start" id="start" style="width:110px;float:left;outline: none;border-radius:2px;"/>
				<div style="width:10px;float:left;background-color:#fff;color:#333;">-</div>
				<input type="date" value="{$end}" name="end" id="end" style="width:110px;float:left;margin-left:10px;outline: none;border-radius:2px;"/>
				<div onclick="$(this).parents('form:first').submit();">查 询</div>
			</form>
		</div>
		<div class="div_tab">
			<table width="785" border="0" cellspacing="0" cellpadding="0" align="center">
				<tr class="tbl_head">
					<td width="200">积分变动描述</td>
					<td width="200">获得积分</td>
					<td width="200">消费积分</td>
					<td width="200">时间</td>
				</tr>
				{if count($points) !=0}
				{foreach item=point from=$points}
				<tr>
					<td align="center">{$point.discribe}</td>                                                                                                                                             
					<td align="center" style="color:#f30000f0;">&nbsp;+{$point.jifenraise|string_format:'%d'}</td>
					<td align="center" style="color:#f30000f0;">&nbsp;-{$point.jifenreduce|string_format:'%d'}</td>
					<td align="center">
						{$point.commitTime|date_format:'%Y-%m-%d %H:%M:%S'}
					</td>
				</tr>
				{/foreach}
				{else}
					<td colspan="3" height="60" align="center">你在近期没有消费积分</td>
				{/if}
			</table>
		</div>
		<div class="fenye">
			<my:page src="{$url_base}index.php?go=kmall.member.points?start={$start}&end={$end}" /></div>
		</div>
	</div>
</div>
{/block}