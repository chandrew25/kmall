{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
        <div class="left_list">                
            <div class="title"><span>我的个人中心</span></div>
            <div class="list">
                <dl>
                    <dt class="dt_bg1"><span>订单中心</span></dt>
                    <dd>
                        <ul>
                            <li class="click_li"><a>订单查询</a></li>
                            <li><a>我的购物车</a></li>
                            <li><a>我的收藏</a></li>
                        </ul>
                    </dd>
                </dl>
                <dl>
                    <dt class="dt_bg2"><span>账户管理</span></dt>
                    <dd>
                        <ul>
                            <li><a>修改信息</a></li>
                            <li><a>收货地址</a></li>
                            <li><a>修改密码</a></li>
                        </ul>
                    </dd>
                </dl>
                <dl>
                    <dt class="dt_bg3"><span>我参与的</span></dt>
                    <dd>
                        <ul>
                            <li><a>我的评论</a></li>
                            <li><a>浏览历史</a></li>
                        </ul>
                    </dd>
                </dl>
            </div>
        </div>
        <div class="right_list">
            <div class="title"><span>订单查询</span></div>
            <div class="find">
                <select>
                    <option>最近一个月订单</option>
                </select>
                <input type="text" value="订单编号、商品名称、商品编号" />
                <div>查 询</div>
            </div>
            <div class="div_tab">
                <table width="785" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <th width="120">订单编号</th>
                    <th width="305">订单商品</th>
                    <th width="120">订单状态</th>
                    <th width="120">订单金额</th>
                    <th width="120">操作</th>
                  </tr>
                  <tr>
                    <td><span><a>313134564564</a><br />2013-08-16</span></td>
                    <td><div><a><img src="{$template_url}resources/images/temp/tab_pic1.jpg" alt="1.8米头层皮铁制排骨架床" width="66" height="66" /></a></div><p><a>1.8米头层皮铁制排骨架床</a></p></td>
                    <td><span style="line-height:40px;">订单已完成</span></td>
                    <td><span class="span_color" style="line-height:40px;">￥2870.00</span></td>
                    <td><span class="span_color">订单详情<br /><a class="span_color">重新加入购物车</a></span></td>
                  </tr>
                </table>
            </div>
            <div class="fenye">总计 <span class="num">1</span> 条记录  共 <span>1</span> 页  <span class="fy"><< <a>第一页</a>  < <a>上一页</a>  <a>下一页</a> >  <a>最末页</a> >></span></div>
        </div>
        <div class="clear"></div>
    </div>
</div>
{/block}
