{extends file="$templateDir/layout/main/layout.tpl"}
{block name=body}
    <div class="f_nav">
      <div class="f_nav_title">楼层导航</div>
      <div class="f_nav_item">
        <a href="#to_f1">
          <span>1F</span><br>
          <span>热销排行</span>
        </a></div>
      <div class="f_nav_item">
        <a href="#to_f2">
          <span>2F</span><br>
          <span>精品推荐</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f3">
          <span>3F</span><br>
          <span>礼包专区</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f4">
          <span>4F</span><br>
          <span>家纺天地</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f5">
          <span>5F</span><br>
          <span>家电世界</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f6">
          <span>6F</span><br>
          <span>家居生活</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f7">
          <span>7F</span><br>
          <span>食品饮料</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f8">
          <span>8F</span><br>
          <span>母婴精品</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f9">
          <span>9F</span><br>
          <span>珠宝配饰</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f10">
          <span>10F</span><br>
          <span>衣包鞋帽</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f11">
          <span>11F</span><br>
          <span>轻奢美妆</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f12">
          <span>12F</span><br>
          <span>旅游户外</span>
        </a>
      </div>
      <div class="f_nav_item">
        <a href="#to_f13">
          <span>13F</span><br>
          <span>财富频道</span>
        </a>
      </div>
    </div>
    <!--#include virtual="header.shtml"-->
    <div class="banner">
      <ul class="banner_list">
        {foreach item=b from=$banner}
        <li class="banner_item">
          <a href="{$b->links}" target="_blank">
            <img src="{$url_base}upload/images/{$b->url}">
          </a>
        </li>
        {/foreach}
      </ul>
      <div class="b_btn_box">
        {foreach item=b from=$banner key=index}
        <div class="btn_item {if index==0}on_btn_item{/if}"></div>
        {/foreach}
      </div>
    </div>
    <!-- 春节放假公告 -->
    <!-- <div class="notice_body"></div>
    <div class="notice_msg">
        <img src="{$template_url}resources/images/index/notice.jpg" class="notice_img">
        <img src="{$template_url}resources/images/index/colse.png" class="colse">
    </div> -->
    <!-- 锚点f1 -->
    <a name="to_f1" id="to_f1"></a>
    <div class="f1 center">
      <div class="f_title_1">
        <img src="{$template_url}resources/images/main/f_title_1.png">
      </div>
      <div class="f1_list">
        {foreach item=p from=$hotSaleProducts}
        <div class="f1_item">
          <div class="f1_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank"><img src="{$url_base}upload/images/{$p->image}"></a>
          </div>
          <div class="f1_name">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">{$p->productShow|truncate:45}</a>
          </div>
          <div class="f1_price">¥{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}积分</div>
        </div>
        {/foreach}
        <div class="f1_item f1_last_item">
          <div class="f1_img">
            <a href="{$f1_last_item->links}" target="_blank">
              <img src="{$url_base}upload/images/{$f1_last_item->url}">
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- 锚点f2 -->
    <a name="to_f2" id="to_f2"></a>
    <div class="f2 center">
      <div class="f_title_1">
        <img src="{$template_url}resources/images/main/f_title_2.png">
      </div>
      <div class="f2_imgs">
        {foreach item=p from=$f2_imgs_item}
        <div class="f2_imgs_item">
          <a href="{$p->links}" target="_blank">
            <img src="{$url_base}upload/images/{$p->url}">
          </a>
        </div>
        {/foreach}
      </div>
      <div class="f2_list">
        {foreach $recommend_products as $p}
        {if $p@last}
        <div class="f2_list_item f2_last_item">
        {else}
        <div class="f2_list_item">
        {/if}
          <div class="f2_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank"><img src="{$url_base}upload/images/{$p->image}"></a>
          </div>
          <div class="f2_name">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">{$p->productShow|truncate:45}</a>
          </div>
          <div class="f2_price">
            <!-- <span>¥{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}积分</span> -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f3 -->
    <a name="to_f3" id="to_f3"></a>
    <div class="f3 center">
      <div class="f_title_1">
        <img src="{$template_url}resources/images/main/f_title_3.png">
      </div>
      <div class="f3_imgs">
        <div class="f3_imgs_item f3_img1">
          <a href="{$f3_img1->links}" target="_blank">
            <img src="{$url_base}upload/images/{$f3_img1->url}">
          </a>
        </div>
        <div class="f3_imgs_item f3_img2">
          <a href="{$f3_img2->links}" target="_blank">
            <img src="{$url_base}upload/images/{$f3_img2->url}">
          </a>
        </div>
      </div>
      <div class="f3_list">
        {foreach item=p from=$fitProducts1 key=index}
        <div class="f3_item {if count($fitProducts1)-$index==1}f3_last_item{/if}">
          <div class="f3_item_left"></div>
          <div class="f3_item_box f3_banner_{$index}">
            {foreach item=img from=$p->getProductImg}
            <div class="f3_item_li">
              <div class="f3_name">
                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">{$p->productShow|truncate:45}</a>
              </div>
              <div class="f3_img">
                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank"><img src="{$url_base}upload/images/{$img->img}"></a>
              </div>
              <div class="f3_price">礼包价:<span>¥{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分</div>
              <div class="f3_btn"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">立即兑换</a></div>
            </div>
            {/foreach}
          </div>
          <div class="f3_item_right"></div>
        </div>
        {/foreach}
      </div>
    </div>
    <div class="ad_line">
      <a href="{$ad_line->links}" target="_blank">
        <img src="{$url_base}upload/images/{$ad_line->url}">
      </a>
    </div>
    <!-- 锚点f4 -->
    <a name="to_f4" id="to_f4"></a>
    <div class="f4 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_4.png">
        <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=1000" target="_blank" class="more" style="color:#ca365a;">更多产品 > </a>
        {foreach item=p from=$f0_ptype key=i}
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item1->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item1->url}">
          </a>
        </div>
        {foreach $f0_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f5 -->
    <a name="to_f5" id="to_f5"></a>
    <div class="f5 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_5.png">
        <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=1500" target="_blank" class="more" style="color:#2c98f0;">更多产品 > </a>
        {foreach item=p from=$f1_ptype key=i}
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item2->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item2->url}">
          </a>
        </div>
        {foreach $f1_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f6 -->
    <a name="to_f6" id="to_f6"></a>
    <div class="f6 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_6.png">
        <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=2000" target="_blank" class="more" style="color:#85c255;">更多产品 > </a>
        {foreach item=p from=$f2_ptype key=i}
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item3->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item3->url}">
          </a>
        </div>
        {foreach $f2_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f7 -->
    <a name="to_f7" id="to_f7"></a>
    <div class="f7 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_7.png">
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=2500" target="_blank" class="more" style="color:#ec8422;">更多产品 > </a>
        {foreach item=p from=$f3_ptype key=i}

          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item4->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item4->url}">
          </a>
        </div>
        {foreach $f3_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f8 -->
    <a name="to_f8" id="to_f8"></a>
    <div class="f8 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_8.png">
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=3000" target="_blank" class="more" style="color:#f8548f;">更多产品 > </a>
        {foreach item=p from=$f4_ptype key=i}

          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item5->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item5->url}">
          </a>
        </div>
        {foreach $f4_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f19 -->
    <a name="to_f9" id="to_f9"></a>
    <div class="f9 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_9.png">
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=3500" target="_blank" class="more" style="color:#7a4de2;">更多产品 > </a>
        {foreach item=p from=$f5_ptype key=i}

          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item6->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item6->url}">
          </a>
        </div>
        {foreach $f5_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f10 -->
    <a name="to_f10" id="to_f10"></a>
    <div class="f10 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_10.png">
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=4000" target="_blank" class="more" style="color:#fdab30;">更多产品 > </a>
        {foreach item=p from=$f6_ptype key=i}

          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item7->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item7->url}">
          </a>
        </div>
        {foreach $f6_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f11 -->
    <a name="to_f11" id="to_f11"></a>
    <div class="f11 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_11.png">
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=4500" target="_blank" class="more" style="color:#e23b3b;">更多产品 > </a>
        {foreach item=p from=$f7_ptype key=i}

          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item8->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item8->url}">
          </a>
        </div>
        {foreach $f7_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f12 -->
    <a name="to_f12" id="to_f12"></a>
    <div class="f12 center">
      <div class="f_title_2">
        <img src="{$template_url}resources/images/main/f_title_12.png">
          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=5000" target="_blank" class="more" style="color:#21cba8;">更多产品 > </a>
        {foreach item=p from=$f8_ptype key=i}

          <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$p->ptype_id}" target="_blank">{$p->name}</a>
        {/foreach}
      </div>
      <div class="pro_list">
        <div class="pro_item pro_item1 pro_item_first">
          <a href="{$pro_item9->links}" target="_blank">
            <img src="{$url_base}upload/images/{$pro_item9->url}">
          </a>
        </div>
        {foreach $f8_arr as $p}
        <div class="pro_item pro_item2">
          <div class="pro_img">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
              <img src="{$url_base}upload/images/{$p->image}">
            </a>
          </div>
          <div class="pro_name">{$p->productShow|truncate:45}</div>
          <div class="pro_price">
            <!-- ¥<span>{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}</span>积分 -->
            <span class="lable">市场价：</span>
            <span class="market_price">￥{$p.market_price|string_format:'%.2f'}</span>
            <span class="lable">价格：</span>
            <span class="price">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
          </div>
        </div>
        {/foreach}
      </div>
    </div>
    <!-- 锚点f13 -->
    <a name="to_f13" id="to_f13"></a>
    <div class="f13 center">
      <div class="f_title_1">
        <img src="{$template_url}resources/images/main/f_title_13.png">
      </div>
      <div class="f13_list">
        <div class="f13_item f13_item1">
          <a href="{$url_base}index.php?go=kmall.index.wealth&t=27" target="_blank">
            <img src="{$template_url}resources/images/main/img/f13_img_1.jpg">
          </a>
        </div>
        <div class="f13_item f13_item2">
          <a href="{$url_base}index.php?go=kmall.index.wealth&t=28" target="_blank">
            <img src="{$template_url}resources/images/main/img/f13_img_2.jpg">
          </a>
        </div>
        <div class="f13_item f13_item3">
          <a href="{$url_base}index.php?go=kmall.index.wealth&t=29" target="_blank">
            <img src="{$template_url}resources/images/main/img/f13_img_3.jpg">
          </a>
        </div>
        <div class="f13_item f13_item4">
          <a href="{$url_base}index.php?go=kmall.index.wealth&t=30" target="_blank">
            <img src="{$template_url}resources/images/main/img/f13_img_4.jpg">
          </a>
        </div>
        <div class="f13_item f13_item5">
          <a href="{$url_base}index.php?go=kmall.index.wealth&t=31" target="_blank">
            <img src="{$template_url}resources/images/main/img/f13_img_5.jpg">
          </a>
        </div>
      </div>
    </div>
{/block}
