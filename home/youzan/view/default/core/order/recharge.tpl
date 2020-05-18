{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div id="trans_wrapper" class="wrapper container" data-role="content">
	<div id="scroller">
		<div id="pullDown" style="display:none;">
			<span class="pullDownIcon"></span>
			<span class="pullDownLabel">准备刷新...</span>
		</div>
		<div class="content">
		{if count($orders)>0}
		{foreach from=$orders item=item key=index}
			<div class="list">
				<div class="left"></div>
			    <div class="top">
			        <div class="time color1">{$item->time}</div>
			        <div class="add">
			            <div class=" color2">{$item->store_name}</div>
			        </div>
			    </div>
			    <div class="bott">
			        <div class="time color1">充值金额：<span class="color3">￥{$item->total}</span></div>
			    </div>
			</div>
		{/foreach}
		{else}
			<div class="content_no">
				<img src="{$template_url}resources/images/public/order_no.png">
			</div>
		{/if}
		</div>
		<div id="trans_pullUp" class="pullUp">
			<span class="pullUpIcon"></span>
			<span class="pullUpLabel">显示更多...</span>
		</div>
	</div>
</div>
<script type="text/javascript">
var trans_myScroll;
var trans_page = 1;
var trans_totalPage = {$count} / 10;

function trans_build(){
	$.ajax({
        url: "index.php?go=youzan.order.rechargeAjax",
        type: 'get',
        dataType: 'json',
        data:"page="+trans_page,
        contentType: "application/x-www-form-urlencoded; charset=utf-8", 
        success: function(response) {
            $(".content").append(response);
            trans_myScroll.refresh();
        }
    });
}

function trans_pullUpAction() {
	setTimeout(function() {
		if (trans_page <= trans_totalPage) {
			trans_page++;
			trans_build();
		} else {
			$("#trans_pullUp").css("display", "none");
		}
	}, 1000);
}

$(document).ready(function(){
	trans_myScroll = loaded("trans_wrapper", "trans_pullUp");
	if(trans_page >= trans_totalPage){
		$("#trans_pullUp").css("display", "none");
	}
	trans_myScroll.refresh();
});
</script>
{/block}
