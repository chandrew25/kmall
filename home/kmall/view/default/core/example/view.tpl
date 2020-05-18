{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
			<div class="left_list">
				<div class="list_title">
					<div class="bor">
						<div class="title"><span>案例展示</span></div>
					</div>
					<div class="list_bor">
						<div class="img_list" id="img_list1">
							<div class="img"><img id="list_img_1" onclick="click_img('1')" src="{$template_url}resources/images/temp/left_pic1.png" alt="" width="100" height="100" class="img_bor" /></div>
							<div class="img"><img id="list_img_2" onclick="click_img('2')" src="{$template_url}resources/images/temp/left_pic1.png" alt="" width="100" height="100" /></a></div>
							<div class="img"><img id="list_img_3" onclick="click_img('3')" src="{$template_url}resources/images/temp/left_pic2.png" alt="" width="100" height="100" /></div>
							<div class="img"><img id="list_img_4" onclick="click_img('4')" src="{$template_url}resources/images/temp/left_pic2.png" alt="" width="100" height="100" /></div>
							<div class="img"><img id="list_img_5" onclick="click_img('5')" src="{$template_url}resources/images/temp/left_pic3.png" alt="" width="100" height="100" /></div>
							<div class="img"><img id="list_img_6" onclick="click_img('6')" src="{$template_url}resources/images/temp/left_pic3.png" alt="" width="100" height="100" /></div>
						</div>
                        <div class="img_list" id="img_list2" style="display:none;">
                            <div class="img"><img id="list_img_1" onclick="click_img('1')" src="{$template_url}resources/images/temp/left_pic1.png" alt="" width="100" height="100" /></div>
                            <div class="img"><img id="list_img_2" onclick="click_img('2')" src="{$template_url}resources/images/temp/left_pic1.png" alt="" width="100" height="100" /></a></div>
                            <div class="img"><img id="list_img_3" onclick="click_img('3')" src="{$template_url}resources/images/temp/left_pic2.png" alt="" width="100" height="100" /></div>
                            <div class="img"><img id="list_img_4" onclick="click_img('4')" src="{$template_url}resources/images/temp/left_pic2.png" alt="" width="100" height="100" /></div>
                            <div class="img"><img id="list_img_5" onclick="click_img('5')" src="{$template_url}resources/images/temp/left_pic3.png" alt="" width="100" height="100" /></div>
                            <div class="img"><img id="list_img_6" onclick="click_img('6')" src="{$template_url}resources/images/temp/left_pic3.png" alt="" width="100" height="100" /></div>
                        </div>
                        <div class="img_list" id="img_list3" style="display:none;">
                            <div class="img"><img id="list_img_1" onclick="click_img('1')" src="{$template_url}resources/images/temp/left_pic1.png" alt="" width="100" height="100" /></div>
                            <div class="img"><img id="list_img_2" onclick="click_img('2')" src="{$template_url}resources/images/temp/left_pic1.png" alt="" width="100" height="100" /></a></div>
                            <div class="img"><img id="list_img_3" onclick="click_img('3')" src="{$template_url}resources/images/temp/left_pic2.png" alt="" width="100" height="100" /></div>
                            <div class="img"><img id="list_img_4" onclick="click_img('4')" src="{$template_url}resources/images/temp/left_pic2.png" alt="" width="100" height="100" /></div>
                            <div class="img"><img id="list_img_5" onclick="click_img('5')" src="{$template_url}resources/images/temp/left_pic3.png" alt="" width="100" height="100" /></div>
                            <div class="img"><img id="list_img_6" onclick="click_img('6')" src="{$template_url}resources/images/temp/left_pic3.png" alt="" width="100" height="100" /></div>
                        </div>
						<div class="fy">
							<div class="left1" id="left_s" onclick="click_sleft();"></div>
							<div class="center"><span id="dangq">1</span> / <span id="zongy">3</span></div>
							<div class="right2" id="right_s" onclick="click_sright();"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="right_show">
				<div class="show_top">
					<span><a>设计中心</a> > <a>杰申装饰</a> > <a>案例展示</a></span>
				</div>
				<div class="lefth" id="left_b" onclick="click_left()"></div>
				<div class="show_img"><img id="show_img" src="{$template_url}resources/images/temp/right_show.png" alt="" width="640" height="340" /></div>
				<div class="rightc" id="right_b" onclick="click_right()"></div>
			</div>
			<div class="clear"></div>
			<div class="border"><div class="bord"></div></div>
		</div>
{/block}