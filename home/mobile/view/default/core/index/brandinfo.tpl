{extends file="$templateDir/layout/brand/layout.tpl"}
{block name=body}
<div class="container">
	<div class="list_outer">
		<div id="wrapper">
		    <div id="scroller">
		        <div id="pullDown" style="display:none;">
		            <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
		        </div>
				<img src="{$template_url}resources/images/brand/1.jpg" class="brand1">
				<img src="{$template_url}resources/images/brand/2.jpg" class="brand2">
				<img src="{$template_url}resources/images/brand/3.jpg" class="brand3">
				<img src="{$template_url}resources/images/brand/4.jpg" class="brand4">
				<div id="pullUp" style="display:none;">
                    <span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多...</span>
                </div>
                <div class="list_blank"></div>
            </div>
        </div>
	</div>
</div>
{/block}
