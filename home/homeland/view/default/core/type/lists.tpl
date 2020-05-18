{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
	<div class="Integral_mall clearfix">
		<div class="integ_box topline clearfix">
			<div class="integ_left fl">
				<ul class="integ_ul">
					{foreach from=$ptype_arr item=top_ptype key=index}
					<li class="integ_li {if $index==0}integ_back{else}topline{/if}">
						{$top_ptype->name}
						<p class="integ_border"></p>
					</li>
					{/foreach}
					<p class="integ_top topline"></p>
				</ul>
			</div>
			<div class="integ_right clearfix fr">
				{foreach from=$ptype_arr item=top_ptype key=index}
				<ul class="integ_main clearfix" {if $index==0}style="display: block;"{/if}>
					{foreach from=$sub_ptype_arr[$top_ptype->ptype_id] item=sub_ptype}
					<a href="{$url_base}index.php?go=mobile.type.lists_info&ptype_id={$sub_ptype->ptype_id}">
						<li class="integ_con fl">
							<img src="{$url_base}upload/images/{$sub_ptype->ico}">
							<span class="integ_text">{$sub_ptype->name}</span>
						</li>
					</a>
					{/foreach}
				</ul>
				{/foreach}
			</div>
		</div>
	</div>
{/block}
