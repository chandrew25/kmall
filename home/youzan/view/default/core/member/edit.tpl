{extends file="$templateDir/layout/brand/layout.tpl"}
{block name=body}
<div class="container">
	<!-- <div class="title">
		<div class="title_back">
			<a href="{$gourl}">
				<div class="title_back_a">
					<img src="{$template_url}resources/images/public/title_back.png" />
				</div>
			</a>
		</div>
		<div class="title_inner" id="shuaxin">绑定会员卡</div>
	</div> -->
	<div class="list_outer">
		<div id="wrapper">
		    <div id="scroller">
		        <div id="pullDown" style="display:none;">
		            <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
		        </div>
	<div class="content">
	<form action="" method="post" id="memberFrm">
		<div class="address_list">
			<input type="hidden" name="usersinfo_id" value="{$member->usersinfo_id}">
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">姓名</div>
				</div>
				<div class="address_list_sr">
			  		<input type="text" name="name" id="name" value="{$member->name}">
				</div>
			</div>
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">手机</div>
				</div>
				<div class="address_list_sr">
			  		<input type="text" name="mobile" id="mobile" value="{$member->mobile}" readonly="true">
				</div>
			</div>
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">生日</div>
				</div>
				<div class="address_list_sr">
					<input type="date" name="birthday" id="birthday" value="{$member->birthday}" >
				</div>
			</div>
			<div class="address_list_s address_list_sinput">
				<div class="address_list_sl">
					<div class="address_list_slin">性别</div>
				</div>
				<div class="address_list_sr">
					<input type="hidden" name="gender" id="gender" value="{$member->gender}">
					{if $member->gender==1}
					<div class="sex">
						<div class="gender ok" gender="1"></div>男
					</div>
					<div class="sex">
						<div class="gender on" gender="2"></div>女
					</div>
					{else}
					<div class="sex">
						<div class="gender on" gender="1"></div>男
					</div>
					<div class="sex">
						<div class="gender ok" gender="2"></div>女
					</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="bnt">
			<input type="button" class="commerce_commit_btn" str="ajaxEdit" value="确认提交" />
		</div>
	</form>
	</div>
	<div id="pullUp" style="display:none;">
                    <span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多...</span>
                </div>
                <div class="list_blank"></div>
            </div>
        </div>
	</div>
</div>

{/block}
