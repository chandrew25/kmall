{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="content">
        <div id="center_down">
            {php}                   
            include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php"); 
            {/php}
            <div id="member_wrapper" class="center_border_color">
                <div id="member">
                    <div id="member_title">我的定制</div>
                    <table class="tbl">
                        <tr class="tbl_head">
                            <td width="60">姓名</td>
                            <td width="180">单位名称</td>
                            <td width="60">电话</td>
                            <td width="80">备注</td>
                        </tr>
                       	{if count($answers) !=0}
                        {foreach item=answer from=$answers}
                        <tr>
                        	<td>{$answer.name}</td>
                            <td>{$answer.company}</td>
                            <td>{$answer.tel}</td>
                            <td>{$answer.note}</td>
                        </tr>
                        {/foreach}
                        {else}
                            <td colspan="4" height="60" align="center">你还没有定制</td>
                        {/if}
                    </table>
                    <div id="orderList_count_wrapper" align="left">
                        <my:page src="{$url_base}index.php?go=kmall.member.customize" /> 
                    </div>
                </div>
            </div>
        </div>
    </div>
{/block}