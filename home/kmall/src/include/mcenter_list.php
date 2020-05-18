<?php
$template_url=Gc::$url_base."home/kmall/view/default/";
$url_base=Gc::$url_base;
$querystring=$_SERVER["QUERY_STRING"];
$str="
<div class='left_list'>                
	<div class='title'><span>我的个人中心</span></div>
	<div class='list'>
		<dl>
			<dt class='dt_bg1'><span>订单中心</span></dt>
			<dd>
				<ul>
					<li ".(strpos($querystring,".member.order")!==false?"class='click_li'":"")."><a href='".$url_base."index.php?go=kmall.member.order'>订单查询</a></li>
					<li ".(strpos($querystring,".member.points")!==false?"class='click_li'":"")."><a href='".$url_base."index.php?go=kmall.member.points'>积分查询</a></li>
					<li ".(strpos($querystring,".member.collect")!==false?"class='click_li b_none'":"class='b_none'")."><a href='".$url_base."index.php?go=kmall.member.collect'>我的收藏</a></li>
				</ul>
			</dd>
		</dl>
		<dl>
			<dt class='dt_bg2'><span>账户管理</span></dt>
			<dd>
				<ul>
					<li ".(strpos($querystring,".member.info")!==false?"class='click_li'":"")."><a href='".$url_base."index.php?go=kmall.member.info'>修改信息</a></li>
					<li ".(strpos($querystring,".member.results")!==false?"class='click_li'":"")."><a href='".$url_base."index.php?go=kmall.member.results'>收货地址</a></li>
					<li ".(strpos($querystring,".member.resetpwd")!==false?"class='click_li b_none'":"class='b_none'")."><a href='".$url_base."index.php?go=kmall.member.resetpwd'>修改密码</a></li>
				</ul>
			</dd>
		</dl>
		<dl>
			<dt class='dt_bg3'><span>我参与的</span></dt>
			<dd>
				<ul>
					<li ".(strpos($querystring,".member.comment")!==false?"class='click_li b_none'":"class='b_none'")."><a href='".$url_base."index.php?go=kmall.member.comment'>我的评论</a></li>
				</ul>
			</dd>
		</dl>
	</div>
</div>
";
echo $str;
?>