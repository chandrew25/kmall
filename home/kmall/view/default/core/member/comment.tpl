{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	{php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
	<div id="member_wrapper" class="center_border_color">
		<div id="member">
			<div id="member_title">我的评论</div>
			<div class="tbl_title">
				<form action="index.php" method="get">
					<input type="hidden" id="comment_rank_value" value="{$comment_rank}"/>
					<input type="hidden" id="queryText_value" value="{$queryText}"/>
					<input type="hidden" name="go" value="kmall.member.comment"/>
					<div class="tbl_title_select">
<!--                                <select id="comment_rank" name="comment_rank">
							<option value="0">评价</option>
							<option value="3">好评</option>
							<option value="2">中评</option>
							<option value="1">差评</option>
						</select>-->
					</div>
					<div class="tbl_title_query">
						<input name="queryText" id="queryText" class="inputBg" type="text" size="30"/>
						<input type="image" class="png" src="{$template_url}resources/images/member/query.png" align="absbottom"/>
					</div>
				</form>
			</div>
			<table class="tbl">
				<tr class="tbl_head">
					<!--<td width="80">评价</td>-->
					<td width="300">评论</td>
					<td width="250">产品</td>
					<!--<td width="80">操作</td>-->
				</tr>
				{if count($comments) !=0}
				{foreach item=comment from=$comments}
				<tr>
					<!--<td><img src="{$template_url}resources/images/member/comment_better.jpg" align="absbottom"/>&nbsp;<b>{$comment.comment_rankShow}</b></td>-->
					<td>
						<div class="comment_wrapper">{$comment.content}<br/><span class="hui_color">[{$comment.updateTime|date_format:'%Y-%m-%d %H:%M'}]</span></div>
					</td>
					<td>
						<div class="comment_wrapper">
							<div class="comment_product">{$comment.product.product_name}</div>
							<div><span class="hong_color">{$comment.product.price}</span>元</div>
						</div>
					</td>
<!--                            <td>
						<a href="javascript:;">匿名评价</a>
					</td>-->
				</tr>
				{/foreach}
				{else}
					<td colspan="5" height="60" align="center">没有评价</td>
				{/if}
			</table>
			<div id="orderList_count_wrapper" align="left">
				<my:page src="{$url_base}index.php?go=kmall.member.comment&comment_rank={$comment_rank}&queryText={$queryText}" /></div>
			</div>
			<!--<table class="tbl" style="margin-top:10px;font-weight:bold;">
				<tr class="tbl_head">
					<td></td>
					<td>最近1周</td>
					<td>最近1个月</td>
					<td>最近6个月</td>
					<td>6个月前</td>
					<td>总计</td>
				</tr>
				<tr>
					<td><img src="{$template_url}resources/images/member/comment_better.jpg" align="absbottom"/>&nbsp;<b>好评</b></td>
					<td>{$result[0][0]}</td>
					<td>{$result[0][1]}</td>
					<td>{$result[0][2]}</td>
					<td>{$result[0][3]}</td>
					<td>{$result[0][4]}</td>
				</tr>
				<tr>
					<td><img src="{$template_url}resources/images/member/comment_good.jpg" align="absbottom"/>&nbsp;<b>中评</b></td>
					<td>{$result[1][0]}</td>
					<td>{$result[1][1]}</td>
					<td>{$result[1][2]}</td>
					<td>{$result[1][3]}</td>
					<td>{$result[1][4]}</td>
				</tr>
				<tr>
					<td><img src="{$template_url}resources/images/member/comment_bad.jpg" align="absbottom"/>&nbsp;<b>差评</b></td>
					<td>{$result[2][0]}</td>
					<td>{$result[2][1]}</td>
					<td>{$result[2][2]}</td>
					<td>{$result[2][3]}	</td>
					<td>{$result[2][4]}</td>
				</tr>
				<tr>
					<td><b>总计</b></td>
					<td>{$result[3][0]}</td>
					<td>{$result[3][1]}</td>
					<td>{$result[3][2]}</td>
					<td>{$result[3][3]}</td>
					<td>{$result[3][4]}</td>
				</tr>
			</table>-->
		</div>
	</div>
</div>
{/block}