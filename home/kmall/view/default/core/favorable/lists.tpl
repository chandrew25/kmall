{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="main" class="outermost_width">
        <div class="banner"><img src="{$template_url}resources/images/upload/banner3.jpg"/></div>
        <div class="head">
    	    <div class="t">优惠专区</div>
            <div class="con">
                <ul class="list">
            	    <li {if !$ptype_id}class="f"{/if}><a href="{$url_base}index.php?go=kmall.favorable.lists">全部</a></li>
            	    <li class="sp">|</li>
            	    {foreach from=$ptypes item=ptype name=ptypes}
                    <li {if $ptype_id==$ptype.ptype_id}class="f"{/if}><a href="{$url_base}index.php?go=kmall.favorable.lists&ptype_id={$ptype.ptype_id}">{$ptype.name}</a></li>
                    {if $smarty.foreach.ptypes.index!=$smarty.foreach.ptypes.total-1}
                    <li class="sp">|</li>
                    {/if}
                    {/foreach}
                </ul>
            </div>
        </div>
        <div class="content">
	        <ul class="list">
    		    {foreach from=$products key=kid item=product name=products}
		        <li {if $smarty.foreach.products.iteration % 2 ==0}class="mar_cut"{/if}>
		            <div class="number"><img src="{$template_url}resources/images/number{$kid+1}.png" class="png"/></div>
		            <div class="pic">
		                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}" title="{$product.product_name}" target="_blank"><img src="{$url_base}upload/images/{$product.image}" alt="{$product.product_name}" class="png"/></a>
		            </div>
		            <div class="intro">
		                <div class="words1"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}" title="{$product.product_name}" target="_blank">{$product.product_name}</a></div>
		                <div class="words2">{$product.msgleft}</div>
                        <div class="words3">{$product.msgright}</div>
                        <div class="market_prise">
                            <!--<div class="market_prise_info">原价:</div>
                            <div class="market_prise_price">￥{$product.market_price|string_format:"%d"}</div>-->
                        </div>
                        <div class="prise">
                            <div class="prise_info">优惠价:</div>
                            <div class="big">￥<span class="big_show">{$product.price|string_format:"%.2f"}</span></div>
                        </div>
		                <div class="buy">
                            <a href="{$url_base}index.php?go=kmall.product.addProduct&product_id={$product.product_id}&num=1"><div class="buy_img add_cart"></div></a>
                            <a href="{$url_base}index.php?go=kmall.product.addProduct&product_id={$product.product_id}&num=1&addtype=1" target="_blank"><div class="buy_img imm_buy"></div></a>
		                </div>
		            </div>
		            <div class="bm png">
		        	    <div class="bml">{$product.msgleft}</div>
		        	    <div class="bmr">{$product.msgright}</div>
		            </div>
		        </li>
		        {/foreach}
		    </ul>
	    </div>
    </div>
{/block}