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
		<div class="title"><span>订单详情</span></div>
		<div class="detail">
			<table width="785" border="0" cellspacing="0" cellpadding="0">
				<tr>
					<td width="68" class="tdw">订单编号:</td>
					<td><span>313134564564</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">订单状态：</td>
					<td><span>已发货</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">订单总计：</td>
					<td><span class="span_color">¥88888.00</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">订单时间：</td>
					<td><span>2013-08-16</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">收 货 人：</td>
					<td><span>张山</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">支付方式：</td>
					<td><span>货到付款</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">配送方式：</td>
					<td><span>XX快递</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">收货地址：</td>
					<td><span>上海市上海市徐汇区(外环以外)红林路88弄88栋208室</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">电话号码：</td>
					<td class="tdw"><span>15000008888</span></td>
				</tr>
				<tr>
					<td width="68" class="tdw">发票信息：</td>
					<td><span>商业零售发票(个人)</span></td>
				</tr>
			</table>
		</div>    
		<div class="follow_up">
			<div class="titles"><span>订单跟踪</span></div>
			<div class="bor_c"><span class="m">提交订单</span><span>2013-07-06</span><span>21:45:47</span></div>
			<div class="bg_c"></div>
			<div class="bor_c"><span class="m">商品出库</span><span>2013-07-06</span><span>21:45:47</span></div>
			<div class="bg_c"></div>
			<div class="bor_c"><span class="m">等待收货</span><span>2013-07-06</span><span>21:45:47</span></div>
			<div class="bg_h"></div>
			<div class="bor_h"><span class="m">完成</span></div>
		</div> 
		<div class="bill">
			<div class="titles" style="clear:both;"><span>商品清单</span></div>
			<table width="785" border="0" cellspacing="0" cellpadding="0">
			  <tr class="tr_bg">
				<td class="td_left" width="200">商品名称</td>
				<td width="130">单价</td>
				<td width="180">购买数量</td>
				<td width="200">金额小计</td>
				<td width="75">其他</td>
			  </tr>
			  <tr class="tr_bor">
				<td class="td_left"><span style="width:170px;">某某某某欧式家具套件</span></td>
				<td><span>￥88888.00</span></td>
				<td><span>1</span></td>
				<td><span class="span_color">¥88888.00</span></td>
				<td><span>-</span></td>
			  </tr>
			</table>
		</div>   
		<div class="total">
			<span class="span_s">商品金额：¥88888.00</span><span class="span_s">运费金额：¥0.00</span>
			<span><span class="span_b">应付款总计：</span><span class="span_color">¥88888.00</span></span>
		</div>
	</div>
	<div class="clear"></div>
</div>
{/block}
