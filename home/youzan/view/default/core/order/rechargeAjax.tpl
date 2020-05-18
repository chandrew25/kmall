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
{/if}