{if count($orders)>0}
	{foreach from=$orders item=item key=index}
		<div class="list">
			<div class="left"></div>
		    <div class="top">
		        <div class="time color1">{$item->time}</div>
		        <div class="add">
		            <div class=" color2">{$item->store_name}</div>
		            <div class="map"><img src="{$url_base}home/youzan/view/default/resources/images/add.png"></div>
		        </div>
		    </div>
		    <div class="bott">
		        <div class="time color1">消费金额：
		        	<span class="color3">￥{$item->total}</span>
		        </div>
		        <div class="add color1">
		        {if $item->coupon_amount=="0"}未使用优惠券
		        {else}使用{$item->coupon_amount}元优惠券{/if}
		        </div>
		    </div>
		</div>
	{/foreach}
{/if}