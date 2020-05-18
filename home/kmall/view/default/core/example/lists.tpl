{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	<div class="show_img">
        <img id="top_img1" src="{$template_url}resources/images/temp/show_top.jpg" width="1000" height="460" alt="欧式风装修公司案例" />
        <img id="top_img2" style="display:none;" src="{$template_url}resources/images/temp/pic1.jpg" width="1000" height="460" alt="欧式风装修公司案例" />
        <img id="top_img3" style="display:none;" src="{$template_url}resources/images/temp/pic2.jpg" width="1000" height="460" alt="欧式风装修公司案例" />
        <img id="top_img4" style="display:none;" src="{$template_url}resources/images/temp/pic3.jpg" width="1000" height="460" alt="欧式风装修公司案例" />
        <img id="top_img5" style="display:none;" src="{$template_url}resources/images/temp/pic1.jpg" width="1000" height="460" alt="欧式风装修公司案例" />
		<div class="show_list"></div>
		<div class="show_ul">
			<ul id="fg_list">
				<li id="fg_1" onclick="click_fg('1')" class="li_click1"></li>
				<li id="fg_2" onclick="click_fg('2')" class="bg_img2"></li>
				<li id="fg_3" onclick="click_fg('3')" class="bg_img3"></li>
				<li id="fg_4" onclick="click_fg('4')" class="bg_img4"></li>
				<li id="fg_5" onclick="click_fg('5')" class="bg_img5"></li>
			</ul>
		</div>
	</div>
	<!--1.div-->
	<div class="center_top" id="center_top1">
		<div class="bor">
			<div class="title"><span>欧式风装修公司案例</span></div>
			<div class="fg">
				<span><a>查看更多 >></a></span>
				   <ul>
					<li><a href="#">旺赢装饰</a></li>
					<li><a>杰申装饰</a></li>
					<li><a>申存装潢</a></li>
					<li class="del_bor"><a>名室装潢</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="mcon" id="center_mcon1">
		<div class="left_list">
			<div class="list" id="list1" onclick="click_left('1','1')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic1.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list2" onclick="click_left('2','1')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic2.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>清新迷人小户型餐厅风格</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list3" onclick="click_left('3','1')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic3.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
		</div>
		<div class="right_all">
			<div class="right_img">
				<div class="img_d"><a href="{$url_base}index.php?go=kmall.example.view"><img id="right_img_show" src="{$template_url}resources/images/temp/right_pic1.png" alt="高贵中透着典雅；独特中又尽显品味" width="640" height="320" /></a></div>
				<div class="dtm"></div>
				<div class="right_title"><span>高贵中透着典雅；独特中又尽显品味</span></div>
			 </div>
			<div class="right_j">
				<span>
					高贵中透露着典雅；卧室里透明的环形浴室，客厅餐厅的家具摆设，独特中又尽显品味。在闲暇时刻，品品美酒看看电视
，似乎这才是生活。让原本面积有限的72平二居室，变成精致简练的小三居户型：二室二厅外加一个工作区。户型上的合
理布局，甜美地中海风格，让这个幸福的小家华丽变身。
				</span>
			</div>
		  </div>
		<div class="foot" id="foot1">
			<div class="lists">
                <div class="list">
                    <div class="list_img" onclick="right_img('1','1','1')"><img src="{$template_url}resources/images/temp/foot_pic1.png" id="img1" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
                    <div class="tm"></div>
                    <div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
                </div>
                <div class="list">
                    <div class="list_img" onclick="right_img('2','1','1')"><img src="{$template_url}resources/images/temp/foot_pic2.png" id="img2" alt="花样背景墙 大气客厅创意设计" width="225" height="150" /></div>
                    <div class="tm"></div>
                    <div class="list_title"><span>花样背景墙 大气客厅创意设计</span></div>
                </div>
                <div class="list">
                    <div class="list_img" onclick="right_img('3','1','1')"><img src="{$template_url}resources/images/temp/foot_pic3.png" id="img3" alt="简约纯白 简欧舒适家" width="225" height="150" /></div>
                    <div class="tm"></div>
                    <div class="list_title"><span>简约纯白 简欧舒适家</span></div>
                </div>
                <div class="list">
                    <div class="list_img" onclick="right_img('4','1','1')"><img src="{$template_url}resources/images/temp/foot_pic4.png" id="img4" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
                    <div class="tm"></div>
                    <div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
                </div>
                <div class="list">
                    <div class="list_img" onclick="right_img('2','1','1')"><img src="{$template_url}resources/images/temp/foot_pic2.png" id="img2" alt="花样背景墙 大气客厅创意设计" width="225" height="150" /></div>
                    <div class="tm"></div>
                    <div class="list_title"><span>花样背景墙 大气客厅创意设计</span></div>
                </div>
                <div class="list">
                    <div class="list_img" onclick="right_img('3','1','1')"><img src="{$template_url}resources/images/temp/foot_pic3.png" id="img3" alt="简约纯白 简欧舒适家" width="225" height="150" /></div>
                    <div class="tm"></div>
                    <div class="list_title"><span>简约纯白 简欧舒适家</span></div>
                </div>
                <div class="list">
                    <div class="list_img" onclick="right_img('4','1','1')"><img src="{$template_url}resources/images/temp/foot_pic4.png" id="img4" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
                    <div class="tm"></div>
                    <div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
                </div>
            </div>
            <div class="left_btn" style="display: none;"></div>
            <div class="right_btn" style="display: none;"></div>
		</div>
		<div class="clear"></div>
	</div>
	<!--
	<div class="center_top" id="center_top2" style="display:none">
		<div class="bor">
			<div class="title"><span>现代风装修公司案例</span></div>
			<div class="fg">
				<span><a>查看更多 >></a></span>
				   <ul>
					<li><a href="#">旺赢装饰</a></li>
					<li><a>杰申装饰</a></li>
					<li><a>申存装潢</a></li>
					<li class="del_bor"><a>名室装潢</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="mcon" id="center_mcon2" style="display:none">
		<div class="left_list">
			<div class="list" id="list1" onclick="click_left('1','2')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic1.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list2" onclick="click_left('2','2')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic2.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>清新迷人小户型餐厅风格</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list3" onclick="click_left('3','2')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic3.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
		</div>
		<div class="right_all">
			<div class="right_img">
				<div class="img_d"><a href="{$url_base}index.php?go=kmall.example.view"><img id="right_img_show" src="{$template_url}resources/images/temp/right_pic1.png" alt="高贵中透着典雅；独特中又尽显品味" width="640" height="320" /></a></div>
				<div class="dtm"></div>
				<div class="right_title"><span>高贵中透着典雅；独特中又尽显品味</span></div>
			 </div>
			<div class="right_j">
				<span>
					高贵中透露着典雅；卧室里透明的环形浴室，客厅餐厅的家具摆设，独特中又尽显品味。在闲暇时刻，品品美酒看看电视
，似乎这才是生活。让原本面积有限的72平二居室，变成精致简练的小三居户型：二室二厅外加一个工作区。户型上的合
理布局，甜美地中海风格，让这个幸福的小家华丽变身。
				</span>
			</div>
		  </div>
		<div class="foot" id="foot1">
			<div class="list">
				<div class="list_img" onclick="right_img('1','2','1')"><img src="{$template_url}resources/images/temp/foot_pic1.png" id="img1" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('2','2','1')"><img src="{$template_url}resources/images/temp/foot_pic2.png" id="img2" alt="花样背景墙 大气客厅创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 大气客厅创意设计</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('3','2','1')"><img src="{$template_url}resources/images/temp/foot_pic3.png" id="img3" alt="简约纯白 简欧舒适家" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>简约纯白 简欧舒适家</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('4','2','1')"><img src="{$template_url}resources/images/temp/foot_pic4.png" id="img4" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
			</div>
		</div>
		<div class="clear"></div>
	</div>
	
	<div class="center_top" id="center_top3" style="display:none">
		<div class="bor">
			<div class="title"><span>美式风装修公司案例</span></div>
			<div class="fg">
				<span><a>查看更多 >></a></span>
				   <ul>
					<li><a href="#">旺赢装饰</a></li>
					<li><a>杰申装饰</a></li>
					<li><a>申存装潢</a></li>
					<li class="del_bor"><a>名室装潢</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="mcon" id="center_mcon3" style="display:none">
		<div class="left_list">
			<div class="list" id="list1" onclick="click_left('1','3')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic1.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list2" onclick="click_left('2','3')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic2.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>清新迷人小户型餐厅风格</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list3" onclick="click_left('3','3')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic3.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
		</div>
		<div class="right_all">
			<div class="right_img">
				<div class="img_d"><a href="{$url_base}index.php?go=kmall.example.view"><img id="right_img_show" src="{$template_url}resources/images/temp/right_pic1.png" alt="高贵中透着典雅；独特中又尽显品味" width="640" height="320" /></a></div>
				<div class="dtm"></div>
				<div class="right_title"><span>高贵中透着典雅；独特中又尽显品味</span></div>
			 </div>
			<div class="right_j">
				<span>
					高贵中透露着典雅；卧室里透明的环形浴室，客厅餐厅的家具摆设，独特中又尽显品味。在闲暇时刻，品品美酒看看电视
，似乎这才是生活。让原本面积有限的72平二居室，变成精致简练的小三居户型：二室二厅外加一个工作区。户型上的合
理布局，甜美地中海风格，让这个幸福的小家华丽变身。
				</span>
			</div>
		  </div>
		<div class="foot" id="foot1">
			<div class="list">
				<div class="list_img" onclick="right_img('1','3','1')"><img src="{$template_url}resources/images/temp/foot_pic1.png" id="img1" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('2','3','1')"><img src="{$template_url}resources/images/temp/foot_pic2.png" id="img2" alt="花样背景墙 大气客厅创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 大气客厅创意设计</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('3','3','1')"><img src="{$template_url}resources/images/temp/foot_pic3.png" id="img3" alt="简约纯白 简欧舒适家" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>简约纯白 简欧舒适家</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('4','3','1')"><img src="{$template_url}resources/images/temp/foot_pic4.png" id="img4" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
			</div>
		</div>
		<div class="clear"></div>
	</div>
	
	<div class="center_top" id="center_top4" style="display:none">
		<div class="bor">
			<div class="title"><span>韩式风装修公司案例</span></div>
			<div class="fg">
				<span><a>查看更多 >></a></span>
				   <ul>
					<li><a href="#">旺赢装饰</a></li>
					<li><a>杰申装饰</a></li>
					<li><a>申存装潢</a></li>
					<li class="del_bor"><a>名室装潢</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="mcon" id="center_mcon4" style="display:none">
		<div class="left_list">
			<div class="list" id="list1" onclick="click_left('1','4')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic1.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list2" onclick="click_left('2','4')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic2.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>清新迷人小户型餐厅风格</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list3" onclick="click_left('3','4')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic3.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
		</div>
		<div class="right_all">
			<div class="right_img">
				<div class="img_d"><a href="{$url_base}index.php?go=kmall.example.view"><img id="right_img_show" src="{$template_url}resources/images/temp/right_pic1.png" alt="高贵中透着典雅；独特中又尽显品味" width="640" height="320" /></a></div>
				<div class="dtm"></div>
				<div class="right_title"><span>高贵中透着典雅；独特中又尽显品味</span></div>
			 </div>
			<div class="right_j">
				<span>
					高贵中透露着典雅；卧室里透明的环形浴室，客厅餐厅的家具摆设，独特中又尽显品味。在闲暇时刻，品品美酒看看电视
，似乎这才是生活。让原本面积有限的72平二居室，变成精致简练的小三居户型：二室二厅外加一个工作区。户型上的合
理布局，甜美地中海风格，让这个幸福的小家华丽变身。
				</span>
			</div>
		  </div>
		<div class="foot" id="foot1">
			<div class="list">
				<div class="list_img" onclick="right_img('1','4','1')"><img src="{$template_url}resources/images/temp/foot_pic1.png" id="img1" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('2','4','1')"><img src="{$template_url}resources/images/temp/foot_pic2.png" id="img2" alt="花样背景墙 大气客厅创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 大气客厅创意设计</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('3','4','1')"><img src="{$template_url}resources/images/temp/foot_pic3.png" id="img3" alt="简约纯白 简欧舒适家" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>简约纯白 简欧舒适家</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('4','4','1')"><img src="{$template_url}resources/images/temp/foot_pic4.png" id="img4" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
			</div>
		</div>
		<div class="clear"></div>
	</div>
	
	<div class="center_top" id="center_top5" style="display:none">
		<div class="bor">
			<div class="title"><span>其它风装修公司案例</span></div>
			<div class="fg">
				<span><a>查看更多 >></a></span>
				   <ul>
					<li><a href="#">旺赢装饰</a></li>
					<li><a>杰申装饰</a></li>
					<li><a>申存装潢</a></li>
					<li class="del_bor"><a>名室装潢</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="mcon" id="center_mcon5" style="display:none">
		<div class="left_list">
			<div class="list" id="list1" onclick="click_left('1','5')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic1.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list2" onclick="click_left('2','5')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic2.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>清新迷人小户型餐厅风格</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
			<div class="list" id="list3" onclick="click_left('3','5')">
				<div class="img"><img src="{$template_url}resources/images/temp/left_pic3.png" alt="巧设客厅背景墙 自然温馨" width="100" height="100" /></div>
				  <div class="js">
					<span class="span_title"><a>巧设客厅背景墙 自然温馨</a></span>
					<span class="span_j"><a>时尚温馨 简欧风三居 高贵中透露着典雅</a></span>
					<span><a>来自杰申装饰</a></span>
				</div>
			  </div>
		</div>
		<div class="right_all">
			<div class="right_img">
				<div class="img_d"><a href="{$url_base}index.php?go=kmall.example.view"><img id="right_img_show" src="{$template_url}resources/images/temp/right_pic1.png" alt="高贵中透着典雅；独特中又尽显品味" width="640" height="320" /></a></div>
				<div class="dtm"></div>
				<div class="right_title"><span>高贵中透着典雅；独特中又尽显品味</span></div>
			 </div>
			<div class="right_j">
				<span>
					高贵中透露着典雅；卧室里透明的环形浴室，客厅餐厅的家具摆设，独特中又尽显品味。在闲暇时刻，品品美酒看看电视
，似乎这才是生活。让原本面积有限的72平二居室，变成精致简练的小三居户型：二室二厅外加一个工作区。户型上的合
理布局，甜美地中海风格，让这个幸福的小家华丽变身。
				</span>
			</div>
		  </div>
		<div class="foot" id="foot1">
			<div class="list">
				<div class="list_img" onclick="right_img('1','5','1')"><img src="{$template_url}resources/images/temp/foot_pic1.png" id="img1" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('2','5','1')"><img src="{$template_url}resources/images/temp/foot_pic2.png" id="img2" alt="花样背景墙 大气客厅创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 大气客厅创意设计</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('3','5','1')"><img src="{$template_url}resources/images/temp/foot_pic3.png" id="img3" alt="简约纯白 简欧舒适家" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>简约纯白 简欧舒适家</span></div>
			</div>
			<div class="list">
				<div class="list_img" onclick="right_img('4','5','1')"><img src="{$template_url}resources/images/temp/foot_pic4.png" id="img4" alt="花样背景墙 紫色创意设计" width="225" height="150" /></div>
				<div class="tm"></div>
				<div class="list_title"><span>花样背景墙 紫色创意设计</span></div>
			</div>
		</div>
		<div class="clear"></div>
	</div>-->
</div>
{/block}