{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
	<div id="content">
        <div class="ch_header">
            <!--<a href="{$url_base}index.php?go=kmall.index.index">
                <div class="ch_logo png"></div>
            </a> -->
            <div class="ch_progress"></div>
        </div>
			<div class="flowBox">
			  <!-- <h6><span>商品列表</span></h6> -->
				  <form id="formCart" name="formCart" method="post" action="index.php?go=kmall.cart.refresh">

					<input type="hidden" id="member_id" value="{$smarty.session.member_id}" />
					<input type="hidden" id="checkcoupon" value="{$checkcoupon}"/>
					<div class="cart_title">购物车中的商品</div>
					<table class="cartlists" id="cartlists">
					  <tr>
							<th width="50"><input type="checkbox" name="" id="selall" checked="true"></th>
							<th width="300">商品</th>
							<th width="100">单价</th>
              				<th width="100">积分</th>
							<th width="100">数量</th>
							<th width="100">折扣</th>
							<th width="100">现金小计</th>
							<th width="60">积分小计</th>
							<th width="80">操作</th>
					  </tr>
					  {if !$carts}
					  <tr>
					  	<td colspan="9">您还未添加任何商品到购物车！</td>
					  </tr>
					  {/if}
					  {foreach item=cart from=$carts name=cartindex}
					  <tr>
					  	<td><input type="checkbox" class="sel" name="sels[{$cart->goods_id}]" checked="true"/></td>
					  	<td>
					  		<div class="item">
					  				<img src="{$url_base}upload/images/{$cart->ico}" alt="{$cart->goods_name}" title="{$cart->goods_name}"/>{$cart->goods_name|truncate:20}
					  		</div>
					  	</td>
					  	<td>￥<span class="price">{$cart->sales_price|string_format:'%.2f'}</span></td>
              			<td><span class="price">{$cart->jifen|default:'0'}</span></td>
					  	<td>
					  		<div class="nums">
						  		<div class="minus"></div>
						  		<input type="text" name="buy_num[{$cart->goods_id}]" value="{$cart->num}" isLimited="{$cart->isLimited}" goods_id="{$cart->goods_id}">
						  		<div class="plus"></div>
					  		</div>
					  	</td>
					  	<td>-</td>
					  	<td class="red2">￥<span class="prices">{$cart->sales_price*$cart->num|string_format:'%.2f'}</span></td>
					  	<td><span class="jifen">{$cart->jifen*$cart->num|default:'0'}</span></td>
					  	<td><span><a href="{$url_base}index.php?go=kmall.cart.delProduct&cart_id={$cart->goods_id}" class="red2">删除</a> </span></td>
					  </tr>
					  {/foreach}
					</table>
					<div class="total">
						{if $carts}
						<img class="delsel" id="delsel" src="{$template_url}resources/images/cart/delall.png" />
						{/if}
						<div class="count">
							 {if $carts}
							<div class="price">
								 <table>
								 	<tr>
								 		<td>商品总价：</td>
								 		<td>￥<span id="prices_all">{$statistic.totalPrice}</span></td>
								 	</tr>
								 	<tr>
								 		<td>综合服务费：</td>
								 		<td>￥<span id="foo">{$foo}</span></td>
								 	</tr>
								 	<tr class="all_price">
								 		<td>总　　计：</td>
								 		<td><span>￥</span><span id="total_all">{$statistic.totalPrice+$foo}{if $statistic.totalJifen>0} + {$statistic.totalJifen} 积分{/if}</span></td>
								 	</tr>
								 </table>
							</div>
							{/if}
							<div class="chekcout">
								<a href="{$url_base}index.php?go=kmall.index.index"><img src="{$template_url}resources/images/cart/buy.png" /></a>
								 {if $carts}
								<!-- <a href="{$url_base}index.php?go=kmall.checkout.view&location=cart" id="isbmit"><img src="{$template_url}resources/images/cart/checkout.png" /></a> -->
								<span style="cursor: pointer;" id="isbmit"><img src="{$template_url}resources/images/cart/checkout.png" /></span>
								{/if}
							</div>
						</div>

					</div>
			</div>
	 </div>
{/block}
