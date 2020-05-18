<input type="hidden" value="1" id="stopper">
<input type="hidden" id="url_base" value="{$url_base}"/>
<input type="hidden" id="container_width" value="1180"/>
<div class="topbar">
	<div class="center">
		<div class="welcome_area">
			{if $smarty.session.member_id}
				您好 <span class="color_red">{$smarty.session.member_name} </span> 欢迎来到菲彼生活商城
				[<a href="{$url_base}index.php?go=kmall.auth.logout">注销 </a>]
			{else if}
				<a class="login_reg" href="{$url_base}index.php?go=kmall.auth.login">登录</a>
				<a class="login_reg" href="{$url_base}index.php?go=kmall.auth.register">注册</a>
			{/if}
		</div>
		<div class="login_area">
			<a href="{$url_base}index.php?go=kmall.member.view">账户中心</a>
			<a target="_blank" href="{$url_base}index.php?go=kmall.cart.lists"><img src="{$template_url}resources/images/publics/header/cart.png"/>购物车 <span class="color_red" id="cartpcount">{$memberInfo.count|default:"0"}</span></a>
	 </div>
	</div>
</div>

<div class="logo_sreach">
	<div class="center">
		<div class="logo">
			<a href="{$url_base}"><img src="{$template_url}resources/images/publics/header/logo.png"/></a>
		</div>
		<div class="sreach">
			<form id="keyword_to_search" action="{$url_base}index.php" method="get" target="_blank" _lpchecked="1">
			<input type="hidden" name="go" value="kmall.search.lists">
				<p style="margin-top: 20px;"><img src="{$template_url}resources/images/publics/header/sreach_left.png"><input type="text" name="search_keyword" id=""><input type="submit" value=""></p>
				<!--<p class="sreach_tag">热卖搜索: <a href="{$url_base}index.php?go=kmall.search.lists&search_keyword=智能手机">智能手机</a><a href="{$url_base}index.php?go=kmall.search.lists&search_keyword=热门女装">热门女装</a><a href="{$url_base}index.php?go=kmall.search.lists&search_keyword=品牌男装">品牌男装</a><a href="{$url_base}index.php?go=kmall.search.lists&search_keyword=热销化妆品">热销化妆品</a><a href="{$url_base}index.php?go=kmall.search.lists&search_keyword=鞋子">鞋子</a></p>-->
			 </form>
		</div>
		<div class=" hotline">
			<img src="{$template_url}resources/images/publics/header/hotline.png"/>
		</div>
	</div>
</div>
<div class="menubar">
	<div class="center">
		<ul>
			<li class="catalog" id="catalog"><a>全部商品<img class="catalog_mark" src="{$template_url}resources/images/public/header/catalog_mark.png"/></a></li>
			<li><a target="_blank" href="{$url_base}index.php?go=kmall.ptype.sp">首页</a></li>
			<li><a>最新商品</a></li>
			<li><a>团购商品</a></li>
			<li><a>品牌专区</a></li>
			<li><a>企业定制</a></li>
			<li><a>会员中心</a></li>
			<li><a>服务中心</a></li>
		</ul>
	</div>
</div>

<script>
	function changeCode(id){
		document.getElementById(id).src="{$url_base}home/foru/src/httpdata/validate.php?"+Math.random();
	}
</script>
