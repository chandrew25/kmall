{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage container_width">
	<div class="showimg">
		<a href="{$showimg->links}">
			<img src="{$url_base}upload/images/{$showimg->url}" width="1200" height="180"/>
		</a>
	</div>
	<div class="mcon">
		<!-- <div class="mbar"> -->
			<!-- <div class="left_list">
				<div class="list_top"><span>全部分类</span></div>
				{foreach item=p1 from=$ptype1 name=ptype1}
				<dl {if $smarty.foreach.ptype1.index==count($ptype1)-1}class="f"{/if}>
					<dt><a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p1.ptype_id}">{$p1.name}</a></dt>
					<dd>
						<ul>
							{foreach item=p2 from=$ptype2[$p1.ptype_id]}
							<li><a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p2.ptype_id}">{$p2.name}</a></li>
							{/foreach}
						</ul>
					</dd>
				</dl>
				{/foreach}
			</div> -->
			<!-- <div class="left_foot"> -->
				<!-- <div class="m_list">
					<div class="month_list"><span class="span_left_title">本月热销排行</span></div>
					<dl>
						<dt>
							<a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$sortproducts[0].product_id}"><img src="{$url_base}/upload/images/{$sortproducts[0].image}" width="173" height="173" alt="{$sortproducts[0].productShow}" /></a>
						</dt>
						<dd>
							<span class="left_num_1">1</span>
							<span class="left_num_2"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$sortproducts[0].product_id}">{$sortproducts[0].productShow|truncate:12}</a></span>
							<span style=" display:block; width:16px; height:16px; float:left; margin-left:10px;color:#FFFFFF"></span>
							<span class="left_num_3">商城价：</span>
							<span class="left_num_4">￥{$sortproducts[0].price|string_format:'%.2f'}</span>
						</dd>
					</dl>
				  <table class="left_tab" width="180" border="0" cellspacing="0" cellpadding="0">
					{foreach from=$sortproducts item=product name=sortproducts}
					{if $smarty.foreach.sortproducts.index>0}
					<tr height="30px">
					<td width="100" class="yichu">
						<span class="left_num">{$smarty.foreach.sortproducts.index+1}</span>
						<span class="spanbt"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}">{$product.productShow}</a></span>
					</td>
					<td width="80" class="yichu"><span class="left_num_4">￥{$product.price|string_format:'%.2f'}</span></td>
					</tr>
					{/if}
					{/foreach}
				  </table>
				</div> -->
				
				<!-- <div class="h_list">
					<div class="his_list"><span class="span_left_title">您浏览过的产品</span></div>
					<dl>
						<dt><img src="{$template_url}resources/images/temp/left.png" height="173" width="173" alt="1.5米现代时尚架床架床" /></dt>
						<dd><span class="span_height"><a>1.5米现代时尚架床架床</a></span><br /><span class="spancolor1">商城价：</span><span class="spancolor2">￥2225.00</span></dd>
					</dl>
					<dl>
						<dt><img src="{$template_url}resources/images/temp/left.png" height="173" width="173" alt="1.5米现代时尚架床架床" /></dt>
						<dd><span class="span_height"><a>1.5米现代时尚架床架床</a></span><br /><span class="spancolor1">商城价：</span><span class="spancolor2">￥2225.00</span></dd>
					</dl>
					<dl>
						<dt><img src="{$template_url}resources/images/temp/left.png" height="173" width="173" alt="1.5米现代时尚架床架床" /></dt>
						<dd><span class="span_height"><a>1.5米现代时尚架床架床</a></span><br /><span class="spancolor1">商城价：</span><span class="spancolor2">￥2225.00</span></dd>
					</dl>
					<dl>
						<dt><img src="{$template_url}resources/images/temp/left.png" height="173" width="173" alt="1.5米现代时尚架床架床" /></dt>
						<dd><span class="span_height"><a>1.5米现代时尚架床架床</a></span><br /><span class="spancolor1">商城价：</span><span class="spancolor2">￥2225.00</span></dd>
					</dl>
					<dl>
						<dt><img src="{$template_url}resources/images/temp/left.png" height="173" width="173" alt="1.5米现代时尚架床架床" /></dt>
						<dd><span class="span_height"><a>1.5米现代时尚架床架床</a></span><br /><span class="spancolor1">商城价：</span><span class="spancolor2">￥2225.00</span></dd>
					</dl>
				</div> -->
				
			<!-- </div>
		</div> -->
		<div class="mview">
			<div class="spfl">
			    <div class="pingpai">国家：</div>
			    <div class="fl_ul">
				     <ul class="mul">
					    <li class="{if $country_id == 0}libgc{/if}">
						    <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting={$sorting}&orderby={$orderby}&pageNo=1&pricebegin={$pricebegin}&priceend={$priceend}&country_id=0">全部</a>
					    </li>
					    {foreach item=search_country from=$country}
					        <li class="{if $country_id == $search_country.country_id}libgc{/if}">
						        <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting={$sorting}&orderby={$orderby}&pageNo=1&pricebegin={$pricebegin}&priceend={$priceend}&country_id={$search_country.country_id}">{$search_country.name}</a>
					        </li>
					    {/foreach}
				    </ul>
			    </div>
                <div class="clear"></div>
                <div class="show_all"><a>显示全部国家</a></div>
            </div>
			<div class="spfl">
			    <div class="pingpai">品牌：</div>
			    <div class="fl_ul">
				     <ul class="mul">
					    <li class="{if $brand_id == 0}libgc{/if}">
						    <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id=0&sorting={$sorting}&orderby={$orderby}&pageNo=1&pricebegin={$pricebegin}&priceend={$priceend}&country_id={$country_id}">全部</a>
					    </li>
					    {foreach item=search_brand from=$search_brands}
					        <li class="{if $brand_id == $search_brand.brand_id}libgc{/if}">
						        <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$search_brand.brand_id}&sorting={$sorting}&orderby={$orderby}&pageNo=1&pricebegin={$pricebegin}&priceend={$priceend}&country_id={$country_id}">{$search_brand.brand_name}</a>
					        </li>
					    {/foreach}
				    </ul>
			    </div>
                <div class="clear"></div>
                <div class="show_all"><a>显示全部品牌</a></div>
            </div>
			<div class="spfl">
				<div class="pingpai" style="margin-top:10px;">价格：</div>
				<div class="fl_ul" style="margin-top:10px;">
					<ul class="mul">
						<li class="{if $priceend == null and $pricebegin == null}libgc{/if}">
							<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting={$sorting}&orderby={$orderby}&country_id={$country_id}&pageNo=1">全部</a>
						</li>
						<li class="{if $pricebegin==0 and $priceend==200}libgc{/if}">
							<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&pricebegin=0&priceend=200&sorting={$sorting}&orderby={$orderby}&country_id={$country_id}&pageNo=1">0-200元</a>
						</li>
						<li class="{if $pricebegin==200 and $priceend==500}libgc{/if}">
							<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&pricebegin=200&priceend=500&sorting={$sorting}&orderby={$orderby}&country_id={$country_id}&pageNo=1">200-500元</a>
						</li>
						<li class="{if $pricebegin==500 and $priceend==2000}libgc{/if}">
							<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&pricebegin=500&priceend=2000&sorting={$sorting}&orderby={$orderby}&country_id={$country_id}&pageNo=1">500-2000元</a>
						</li>
						<li class="{if $pricebegin==2000 and $priceend==5000}libgc{/if}">
							<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&pricebegin=2000&priceend=5000&sorting={$sorting}&orderby={$orderby}&country_id={$country_id}&pageNo=1">2000-5000元</a>
						</li>
						<li class="{if $pricebegin==5000 and $priceend==20000}libgc{/if}">
							<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&pricebegin=5000&priceend=20000&sorting={$sorting}&orderby={$orderby}&country_id={$country_id}&pageNo=1">5000-20000元</a>
						</li>
						<li class="{if $pricebegin==20000 and ($priceend >= 20000 or $priceend == null)}libgc{/if}">
							<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&pricebegin=20000&sorting={$sorting}&orderby={$orderby}&country_id={$country_id}&pageNo=1">20000元以上</a>
						</li>
					</ul>
				</div>
			</div>
            <!-- <div class="spfl">
                 <div class="pingpai" style="margin-top:10px;"> 颜色:</div>
                 <div class="fl_ul" style="margin-top:10px;">
                     <ul class="mul">
                         <li class="{if $color_id== 0}libgc{/if}">
                             <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting={$sorting}&orderby={$orderby}&pageNo=1&color_id=0&pricebegin={$pricebegin}&priceend={$priceend}">全部</a>
                         </li>
                         {foreach item=a1 from=$attribute1}
                              <li class="{if $color_id == $a1.attribute_id}libgc{/if}">
                                 <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting={$sorting}&orderby={$orderby}&pageNo=1&color_id={$a1.attribute_id}&pricebegin={$pricebegin}&priceend={$priceend}">{$a1.attribute_name}</a>
                              </li>
                         {/foreach}
                     </ul>
                 </div>
             </div> -->
			<div class="manage_top">
				<span class="pl">排列方式：</span>
				<ul>
					<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting=1&{if $sorting==1&&$orderby==0}orderby=1{else}orderby=0{/if}&pageNo=1&pricebegin={$pricebegin}&priceend={$priceend}&country_id={$country_id}"><li><span class="plfs">销量</span><div class="{if $sorting==1}{if $orderby==1}ud_bgred1{else}ud_bgred{/if}{else}ud_bg{/if}"></div></li></a>
					<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting=2&{if $sorting==2&&$orderby==0}orderby=1{else}orderby=0{/if}&pageNo=1&pricebegin={$pricebegin}&priceend={$priceend}&country_id={$country_id}"><li><span class="plfs">最新</span><div class="{if $sorting==2}{if $orderby==1}ud_bgred1{else}ud_bgred{/if}{else}ud_bg{/if}"></div></li></a>
					<a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting=3&{if $sorting==3&&$orderby==0}orderby=1{else}orderby=0{/if}&pageNo=1&pricebegin={$pricebegin}&priceend={$priceend}&country_id={$country_id}"><li><span class="plfs">价格</span><div class="{if $sorting==3}{if $orderby==1}ud_bgred1{else}ud_bgred{/if}{else}ud_bg{/if}"></div></li></a>
				</ul>
				<form method="get" action="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting={$sorting}&orderby={$orderby}&country_id={$country_id}&pageNo=1" id="priceform">
					<input type="hidden" name="go" value="kmall.ptype.lists"/>
					<input type="hidden" name="ptype_id" value="{$ptype_id}"/>
					<input type="hidden" name="brand_id" value="{$brand_id}"/>
                    <input type="hidden" name="sorting" value="{$sorting}"/>
                    <input type="hidden" name="orderby" value="{$orderby}"/>
                    <input type="hidden" name="color_id" value="{$color_id}"/>
                    <input type="hidden" name="style_id" value="{$style_id}"/>
                    <input type="hidden" name="mq_id" value="{$mq_id}"/>
                    <input type="hidden" name="pageNo" value="1"/>
					<input type="text" name="pricebegin" value="{$pricebegin}" style="margin-left:30px;"/><span class="span_form">元--</span>
					<input type="text" name="priceend" value="{$priceend}"/><span class="span_form">元</span>
					<div class="btn" onclick="$('#priceform').submit()">确定</div>
				</form>
				<!--
				<div class="fenye">
					<span class="swy" style="display:none;"><a>首&nbsp;页</a></span>
					<span class="xyy" style="display:none;"><a>下一页</a></span>
					<span class="fy"><a>1</a></span>
					<span class="fy"><a>2</a></span>
					<span class="fy"><a>3</a></span>
					<span class="xyy"><a>上一页</a></span>
					<span class="swy"><a>尾&nbsp;页</a></span>
				</div>
				-->
			</div>
			<div class="manage_list">
				{foreach item=product from=$products}
				<div class="list_img">
					<div class="div_img">
						<a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}"><img src="{$url_base}/upload/images/{$product.image}" alt="{$product.productShow}" class="img_manage_list" width="206" height="206"/></a>
					</div>
					<div class="manage_w">
						<span class="span_title"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}" title="{$product.productShow}">{$product.productShow}</a></span>
						<span class="span1">市场价：<span>￥{$product.market_price|string_format:'%.2f'}</span></span>
						<span class="span3">价格：</span>
						<span class="span2">￥{$product.price|string_format:'%.2f'}+{$product.jifen|string_format:'%d'}积分</span>
					</div>
				</div>
				{/foreach}
			</div>
			<div style="float:left;width:100%;">
				<my:page src="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype_id}&brand_id={$brand_id}&sorting={$sorting}&orderby={$orderby}&pricebegin={$pricebegin}&priceend={$priceend}&country_id={$country_id}"/>
			</div>
			</div>
		</div>
	</div>
</div>
{/block}
