{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
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
    <div class="timeOver">
      <div class="timeOverBox clearfix">
        <div class="leftTime">
          <div class="shizhong">
            <img src="{$template_url}resources/images/main/shizhong_03.jpg" /> <span>距离秒杀结束还剩</span> <span class="overDay">{$seckill->getBeginTime}</span>
          </div>
          <div class="LASTTIME"> 
            <table>
                <td class="colspan-a">
                <div class="data-show-box" id="dateShow1">
                  <span class="date-tiem-span d">00</span>天
                  <span class="date-tiem-span h">00</span>时
                  <span class="date-tiem-span m">00</span>分
                  <span class="date-s-span s">00</span>秒
                </div>
              </td>
              <td class="colspan-b"></td>
              <td class="colspan-c">
              </td>
            </table>
            <a href="#overGoods">立即抢购</a>
          </div>
        </div>
        <div class="rightTel" id="demo">
           <div id="demo1">
            {if $seckill->isRob && $data}
                  <ul class="prizelist">
                    {foreach from=$data item=product key=index}
                      <li>
                        <span>{$product.commitTime|date_format:'%Y-%m-%d %H:%M:%S'}</span>
                        <span>{substr($product.ship_mobile, 0, 3)}****{substr($product.ship_mobile,7,4)}</span>
                        <span> ¥{$product.price|string_format:'%.2f'}+{$product.jifen|string_format:'%d'}积分</span>
                      </li>
                    {/foreach}
                  </ul>
            {else}
                <img src="{$template_url}resources/images/limited.jpg">
            {/if}
             </div>
        </div>
      </div>
    </div>
    <div class="overGoods" id="overGoods">
        <h2>今日秒杀</h2>
        <div class="good">
           <ul class="clearfix">
					 {foreach from=$seckill->getProduct item=product key=index}
            <li>
              <a href="{$url_base}index.php?go=kmall.product.view&product_id={$product->product_id}" target="_blank">
                <img src="{$url_base}upload/images/{$product->getProduct->image}" />
              </a>
                <p class="title">{$product->getProduct->productShow}</p>
                <p class="ney">
									<span>{if $product->pric >0}￥{$product->price|string_format:'%.2f'}+{/if}{$product->jifen}积分</span>
                  <span class="sec_num" product="{$product->product_id}">剩余：{if $product->sec_num>$product->bought_num}{$product->sec_num - $product->bought_num}{else}0{/if}</span>
									{if $seckill->isRob}
										{if $product->sec_num > $product->bought_num}
										<span class="isOk" product="{$product->product_id}">立即抢购</span>
										{else}
										<span class="isNo">已售馨</span>
										{/if}
									{else}
									<span class="isNo">未开始</span>
									{/if}
								</p>
              
            </li>
            {/foreach}
           </ul>
        </div>
    </div>
  <script language="JavaScript">
    function myrefresh()
    {
      window.location.reload();
    }
    setTimeout('myrefresh()',10000); //指定1秒刷新一次
  </script>
  <script type="text/javascript">
      $(function(){
        //日期倒计时
        $.leftTime("{$seckill->end_datetime}",function(d){
          if(d.status){
            var $dateShow1=$("#dateShow1");
            $dateShow1.find(".d").html(d.d);
            $dateShow1.find(".h").html(d.h);
            $dateShow1.find(".m").html(d.m);
            $dateShow1.find(".s").html(d.s);
          }
        });
          //加入购物车
        $('.isOk').click(function(){
            var num = 1;
            var product_id=$(this).attr("product");
            var url="index.php?go=kmall.product.isLimited";
            var comdata="product_id="+product_id+"&num="+num;
            $.post(url,comdata,function(result){
              if(result.code==1){
                window.location.href="index.php?go=kmall.product.addProduct2&"+comdata;
              }else{
                alert(result.msg);
                window.location.reload();
              }
            },"json");
        });
        
    });
      $(document).ready(function(){
            function beginroll(){
            var speed = 40
            var demoScrollTop = $("#demo").scrollTop();
            var demo1OffsetHeight = $("#demo1").height();
                var demohtml= $("#demo1").html();
            $("#demo2").html(demohtml);
            function Marquee() {
                 if (demoScrollTop >= demo1OffsetHeight) {
                    demoScrollTop = 0;
                } else {
                   demoScrollTop = demoScrollTop + 1;  
                }
                $("#demo").scrollTop(demoScrollTop);
            }
            var MyMar = setInterval(Marquee, speed);
            $("#demo").mouseover(function(){
                clearInterval(MyMar);
            })
            $("#demo").mouseout(function(){
                MyMar = setInterval(Marquee, speed);
            })
             
            }
            beginroll();
        })
  </script>
{/block}