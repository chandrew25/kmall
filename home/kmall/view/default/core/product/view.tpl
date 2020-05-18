{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="main container_width">
    <div class="navv">
        <ul class="nl">

            <li><a href="{$url_base}index.php?go=kmall.index.index">首页</a></li>
            {foreach item=ptype from=$product.getPtype name=ptype}
            <li>&#8250;</li>
            <li><a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$ptype.ptype_id}">{$ptype.name}</a></li>
            {/foreach}
        </ul>
    </div>
    <div class="mcon">
        <div class="item">
            <div class="img">
                <div class="show">
                    <a class="jqzoom" rel="gal1" title="{$product.productShow}" href="{$url_base}upload/images/{$product.image_large}">
                        <img src="{$url_base}upload/images/{$product.image}" width="450" height="450"/>
                    </a>
                </div>
                <div class="list">
                    <div class="left" id="seriesImgleft"></div>
                    <div class="right" id="seriesImgright"></div>
                    <div class="c">
                        <ul id="seriesImgs">
                            {foreach item=seriesImg from=$seriesImgs name=seriesImgs}
                            <li {if $smarty.foreach.seriesImgs.index==0}class="f"{/if}>
                                <a rel='{literal}{{/literal}gallery:"gal1",smallimage:"{$url_base}upload/images/{$seriesImg.img}",largeimage:"{$url_base}upload/images/{$seriesImg.image_large}"{literal}}{/literal}'>
                                    <!-- <img src="{$url_base}upload/images/{$seriesImg.ico}" width="65" height="65"/> -->
                                    <img src="{$url_base}upload/images/{$seriesImg.image_large}" width="65" height="65"/>
                                </a>
                            </li>
                            {/foreach}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="info">
                <div class="title">
                    <div class="c" id="goods_name_show" val="{$product.productShow}">{$product.productShow}</div>
                </div>
                {if $product.getSeckill.seckill_id}
                <div class="data-show-box" id="dateShow1">
                    <div class="data-show-box-title">秒杀</div>
                    <div class="data-show-box-time">
                        距离结束
                        <span class="date-tiem-span d">00</span>天
                        <span class="date-tiem-span h">00</span>时
                        <span class="date-tiem-span m">00</span>分
                        <span class="date-s-span s">00</span>秒
                    </div>
                </div>
                <script type="text/javascript">
                      $(function(){
                        //日期倒计时
                        $.leftTime("{$product.getSeckill.end_datetime}",function(d){
                          if(d.status){
                            var $dateShow1=$("#dateShow1");
                            $dateShow1.find(".d").html(d.d);
                            $dateShow1.find(".h").html(d.h);
                            $dateShow1.find(".m").html(d.m);
                            $dateShow1.find(".s").html(d.s);
                          }
                        });
                    });
                </script>
                {/if}
                <div class="xhao">
                    <div class="type">货号：{$product.product_code}</div>
                    <div class="type_s">商品型号：{$product.goods_no}</div>
                </div>
                <ul class="c pi">
                   <li>
                        <div class="dt">用户评分：</div>
                        <div class="dd">
                            <div class="star s5"></div>
                            <span style="float:left;" >(<span id="rate_num"></span>人已评论)</span>
                        </div>
                    </li>
                    {if $product.getSeckill.seckill_id}
                    <li>
                        <div class="dt pt">秒杀价：</div>
                        <div class="dd">
                            <div id="goods_price" class="price color_red" val="￥{$maxprice} - ￥{$minprice}">￥{$product.getSeckill.price|string_format:'%.2f'} {if $product.getSeckill.jifen} + {$product.getSeckill.jifen}积分 {/if}</div>
                        </div>
                    </li>
                    {else}
                    <li>
                        <div class="dt pt">商城价：</div>
                        <div class="dd">
                            {if $product.isMultiplespec}
                                <div id="goods_price" class="price color_red" val="￥{$maxprice} - ￥{$minprice}">￥{$maxprice} - ￥{$minprice|string_format:'%.2f'} {if $product.jifen} + {$product.jifen}积分 {/if}</div>
                            {else}
                                <div id="goods_price" class="price color_red" val="￥{$maxprice} - ￥{$minprice}">￥{$product.price|string_format:'%.2f'} {if $product.jifen} + {$product.jifen}积分 {/if}</div>
                            {/if}
                        </div>
                    </li>
                    {/if}
                    <li>
                        <div class="dt">市场价：</div>
                        <div class="dd">
                            <span class="mprice">￥{$product.market_price}</span>
                        </div>
                    </li>

                    <!-- <li>
                        <div class="dt">促销信息：</div>
                        <div class="dd">
                            <span class="zj">直降</span><span class="color_red">每单满3000优惠300元</span>
                        </div>
                    </li> -->

                </ul>

                <div class="attr">
                    <div class="spec">
                        {if $product->isMultiplespec}
                        <input type="hidden" id="goodslist" value="{$json_goodslist}"/>
                        <input type="hidden" id="goods" value="{$json_goods}"/>
                        <ul class="bs">
                            {foreach from=$bslist item=bs}
                            <li class="bsi c">
                                <div class="bst">{$bs.attribute_name}：</div>
                                <ul class="ls">
                                    {foreach from=$lslist[$bs.attribute_id] item=ls}
                                    <li class="lsi" val="{$ls.attribute_id}" title="{$ls.attr_name}">
                                        {if $ls.attr_ico}
                                        <a class="img_color" val="{$ls.re_imgpath}"><img src="{$url_base}upload/images/{$ls.attr_ico}" width="30" height="30"/></a>
                                        {else}
                                        <a class="txt">{$ls.attr_name}</a>
                                        {/if}
                                    </li>
                                    {/foreach}
                                </ul>
                            </li>
                            {/foreach}
                        </ul>
                        {/if}
                    </div>
                    <ul class="c pi">
                        <li class="l">
                            <div class="dt">规格简述：</div>
                            <div class="dd">
                                <span class="i">{$product.scale|truncate:24}</span>
                            </div>
                        </li>
                        <!-- <li class="l">
                            <div class="dt">定制周期：</div>
                            <div class="dd">
                                <span class="i">30天左右（视配送距离而定）</span>
                            </div>
                        </li> -->
                        <li>
                            <div class="dt">购买数量：</div>
                            <div class="dd">
                                <div class="minus"></div>
                                <form id="buy_product_form" action="{$url_base}index.php" method="get">
                                    <input type="hidden" name="go" value="kmall.product.addProduct"/>
                                    <input class="num" type="text" value="1" name="num" id="num"/>
                                    <input type="hidden" name="goods_id" id="goods_id" value="{$goods.goods_id}" />
                                    <input type="hidden" name="goods_ids" id="goods_ids" value="" />
                                    <input type="hidden" name="product_id" id="product_id" value="{$product.product_id}" />
                                </form>
                                <div class="plus"></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="add">
                    {if $product.getSeckill.seckill_id}
                    <a><div class="cart" id="addcart" num="{$product.getSeckill.limit_num}"></div></a>
                    <a><div class="cart2" id="addcart2" num="{$product.getSeckill.limit_num}">立即购买</div></a>
                    {else}
                    <a><div class="cart" id="addcart" num=""></div></a>
                    <a><div class="cart2" id="addcart2" num="">立即购买</div></a>
                    {/if}
                    <!-- <div class="fav"></div> -->
                </div>
            </div>
        </div>
        {if count($meals)>0}
        <div class="box setmeal">
            <div class="title">
                {section name=loop loop=count($meals)}
                {assign var=index value=$smarty.section.loop.index}
                <div class="i h {if $smarty.section.loop.index==0}f{/if}" val="{$meals[$index].meal_id}">优惠套餐{$index+1}</div>
                {/section}
            </div>
            {foreach item=m from=$meals name=meals}
            <div class="con group" {if $smarty.foreach.meals.index gt 0}style="display:none;"{/if} val="{$m.meal_id}">
                <div class="p">
                    <div class="img"><img src="{$url_base}upload/images/{$product.image}" width="140" height="140"/></div>
                    <div class="name">{$meal_master_goodses[$m.meal_id].goods_name|truncate:24}</div>
                </div>
                <div class="add"></div>
                <div class="list">
                    <ul>
                        {foreach item=g from=$mealgoodss[$m.meal_id]}
                        <li>
                            <div class="img"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&goods_id={$g.goods_id}"><img src="{$url_base}upload/images/{$g.image}" width="140" height="140"/></a></div>
                            <div class="txt">
                                <p><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&goods_id={$g.goods_id}">{$g.goods_name|truncate:13}</a></p>
                                <p>优惠价：<span class="color_red">￥{$g->sales_price}</span></p>
                            </div>
                        </li>
                        {/foreach}
                    </ul>
                </div>
                <div class="line"></div>
                <div class="total">
                    <div>{$m.name}</div>
                    <div>套餐价：<span class="color_red">￥{$m.total}</span></div>
                    <div class="btn"></div>
                </div>
            </div>
            {/foreach}
        </div>
        {/if}
        <div class="view">
            <div class="vbar">
                <div class="pic">
                    <a href="{$banner->links}">
                        <img src="{$url_base}upload/images/{$banner->url}" width="270" height="270"/>
                    </a>
                </div>
                <div class="sort">
                    <div class="title">
                        <div class="t">同类商品人气排行</div>
                    </div>
                    <ul class="list">
                        {foreach item=p from=$hotproducts name=hotproducts}
                        {if $smarty.foreach.hotproducts.index==0}
                        <li>
                            <div class="i f">1</div>
                            <div class="n1"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" title="{$p->product_name}">{$p->product_name|truncate:15}</a></div>
                            <div class="img"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}"><img src="{$url_base}upload/images/{$p->image}" width="80" height="80"/></a></div>
                            <div class="txt">
                                <p>市场价：<span class="mprice">￥{$p->market_price|string_format:'%d'}</span></p>
                                <p><span class="color_red">￥{$p->price|string_format:'%d'}+{$p->jifen|string_format:'%d'}积分</span></p>
                            </div>
                        </li>
                        {else}
                        <li>
                            <div class="i">{$smarty.foreach.hotproducts.index+1}</div>
                            <div class="n2"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" title="{$p->product_name}">{$p->product_name|truncate:10}</a></div>
                            <div class="price"><span class="color_red">￥{$p->price|string_format:'%d'}+{$p->jifen|string_format:'%d'}积分</span></div>
                        </li>
                        {/if}
                        {/foreach}
                    </ul>
                </div>
                <div class="sort">
                    <div class="title">
                        <div class="t">看过此商品的顾客还看过</div>
                    </div>
                    <ul class="list">
                        {foreach item=p from=$seeproducts name=seeproducts}
                        <li>
                            <div class="n"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" title="{$p->product_name}">{$p->product_name|truncate:15}</a></div>
                            <div class="img"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}"><img src="{$url_base}upload/images/{$p->image}" width="80" height="80"/></a></div>
                            <div class="txt">
                                <p>市场价：<span class="mprice">￥{$p->market_price|string_format:'%d'}</span></p>
                                <p><span class="color_red">￥{$p->price|string_format:'%d'}+{$p->jifen|string_format:'%d'}积分</span></p>
                            </div>
                        </li>
                        {/foreach}
                    </ul>
                </div>
            </div>
            <div class="vgroup">
                {if count($allgroups)>0}
                <div class="box">
                    <div class="title">
                        <div class="i f">推荐购买</div>
                    </div>
                    {foreach from=$allgroups item=groups key=gid}
                    {if count($groups)>0}
                    {assign var=product_g value=$goodses[$gid]}
                    <div class="con group" val="{$gid}">
                        <div class="p">
                            <div class="img"><img src="{$url_base}upload/images/{$product_g.product.image}" width="140" height="140"/></div>
                            <div class="name" val="{$product_g->sales_price}">{$product_g.goods_name|truncate:24}</div>
                        </div>
                        <div class="add"></div>
                        <div class="list">
                            <ul>
                                {foreach item=g from=$groups}
                                <li>
                                    <input class="i" type="checkbox" name="union" val="{$g.goods_id}"/>
                                    <div class="img"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$g.product_id}"><img src="{$url_base}upload/images/{$g.product.image}" width="140" height="140"/></a></div>
                                    <div class="txt">
                                        <p><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$g.product_id}">{$g.goods_name|truncate:13}</a></p>
                                        <p><span class="color_red">￥<span>{$p->price|string_format:'%d'}+{$p->jifen|string_format:'%d'}积分</span></span></p>
                                    </div>
                                </li>
                                {/foreach}
                            </ul>
                        </div>
                        <div class="line"></div>
                        <div class="total">
                            <div>已选择了<span class="group_nums">0</span>件商品</div>
                            <div>搭配价：<span class="color_red">￥<span class="groups_prices">{$product_g->sales_price|string_format:'%d'}</span></span></div>
                            <div class="btn"></div>
                        </div>
                    </div>
                    {/if}
                    {/foreach}
                </div>
                {/if}
                <div class="box">
                    <div class="title">
                        <div class="i h f" to="intro">商品详情</div>
                        <div class="i h" to="scale">规格参数</div>
                        <div class="i h" to="consult">商品评价</div>
                    </div>
                    <div class="con param">
                        <div to="intro">{$product.intro}</div>
                        <div to="scale" style="display:none;">{$product.specification}</div>
                        <div class="consult" to="consult" style="display:none;">
                            <div class="msg">
                                <div class="i"></div>
                                <span class="t">商品评价</span>（共<span class="color_red" id="comment_num">4</span>条）
                            </div>
                            <div class="tip">
                                <div id="msg" class="border_color">
                                    <form action="{$url_base}index.php" method="get" onsubmit="return false" id="msg_form">
                                        <div id="msg_comment_wrapper" class="msg_wrapper">
                                            <div class="msg_title">
                                                <span class="bold">购物心得：</span>
                                                <span class="star_co">*</span>
                                                <span class="normal" id="msg_comment_input_notice">内容不超过200个字</span>
                                            </div>
                                            <textarea name="user_comment" id="msg_comment_input" class="border_color" rows="3" ></textarea>
                                        </div>
                                        <input type="hidden" name="product_id" value="{$product.product_id}" id="product_id"/><!--商品编号-->
                                        <input type="hidden" name="is_new_comment" value="1" id="is_new_comment"/><!--是否是新评论-->
                                        <input type="hidden" id="member_id" value="{$smarty.session.member_id|default:0}"/><!--记录当前会员-->
                                        <input type="hidden" id="template_url" value="{$template_url}"/><!--文件目录-->
                                        <input type="hidden" id="comment_show_num" value=""/><!--当前显示评论个数，添加新评论-->
                                        <input type="hidden" id="comment_min_id" value="{$comment_min_id}"/><!--商品评论最小ID，更多操作-->
                                        <input type="hidden" name="go" value="kmall.product.add_comment"/>
                                        <input id="msg_submit" class="msg_submit_style" type="image" name="submit_comment" value="" src="{$template_url}resources/images/submit_comment.jpg" />
                                    </form>
                                </div>
                            </div>
                            <ul class="list" id="other_comments"></ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{/block}
