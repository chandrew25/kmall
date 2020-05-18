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
      <!-- <div class="b_btn_box">
        {foreach item=b from=$banner key=index}
        <div class="btn_item {if index==0}on_btn_item{/if}"></div>
        {/foreach}
      </div> -->
    </div>

    <div class="centerBox">
    	<!--精品推荐-->
    	<div class="indexBoxTitle">
			<img src="{$template_url}resources/images/bran/f_title_2.png" />
		</div>
		<div class="centerBoxOneGoods clearfix">
			<div class="goodLeft">
				<a href="{$url_base}index.php?go=kmall.ptype.lists&brand_id={$brand.0->brand_id}" target="_blank">
					<img src="{$url_base}upload/images/{$brand.0->images}" />
					<div class="shadow"></div>
				</a>
			</div>
			<div class="goodRight">
				<a href="{$url_base}index.php?go=kmall.ptype.lists&brand_id={$brand.1->brand_id}" target="_blank">
					<img src="{$url_base}upload/images/{$brand.1->images}" />
					<div class="shadow"></div>
				</a>
			</div>
		</div>
		<!--热销排行-->
		<div class="indexBoxTitle">
				<img src="{$template_url}resources/images/bran/f_title_1.png" />
			</div>
			<div class="centerBoxOneGoods">
				<ul class="clearfix">
					<!-- {foreach item=btp from=$brandtop key=index}
					<li>
						<a href="{$url_base}index.php?go=kmall.ptype.lists&brand_id={$btp.brand_id}" target="_blank">
							<img src="{$url_base}upload/images/{$btp.images}" />
						</a>
					</li>
					{/foreach} -->
					{foreach item=btp from=$brand key=index}
					{if $index >1}
					<li>
						<a href="{$url_base}index.php?go=kmall.ptype.lists&brand_id={$btp->brand_id}" target="_blank" title="{$btp->brand_name}">
							<img src="{$url_base}upload/images/{$btp->images}" />
						</a>
					</li>
					{/if}
					{/foreach}
				</ul>
			</div>
			<div class="allBrand_logo indexBoxTitle">
				<img src="{$template_url}resources/images/bran/supergo_ab.png">
			</div>
			<h1 class="allBrand_filter_letters" style="position: static; top: 0px; z-index: 300;">
				<strong>按字母筛选：</strong>
				<a href="#letter_A">A</a><a href="#letter_B">B</a><a href="#letter_C">C</a><a href="#letter_D">D</a><a href="#letter_E">E</a><a href="#letter_F">F</a><a href="#letter_G">G</a><a href="#letter_H">H</a><a href="#jletter_I">I</a><a href=" #letter_J">J</a><a href="#letter_K">K</a><a href="#letter_L">L</a><a href="#letter_M">M</a><a href="#letter_N">N</a><a href="#letter_O">O</a><a href="#letter_P">P</a><a href="#letter_Q">Q</a><a href="#letter_R">R</a><a href="#letter_S">S</a><a href="#letter_T">T</a><a href="#letter_V">V</a><a href="#letter_W">W</a><a href="#letter_X">X</a><a href="#letter_Y">Y</a><a href="#letter_Z">Z</a>
			</h1>
			<div class="allBrand_filter_cont">
				{foreach item=b from=$branZm key=index}
				<dl id="letter_{$b->initials}"><dt>{$b->initials}</dt>
					<dd>
						<ul>
							{foreach item=bd from=$b->brand key=indx}
							<li>
								<a href="{$url_base}index.php?go=kmall.ptype.lists&brand_id={$bd->brand_id}" target="_blank">{$bd->brand_name}</a>
							</li>
							{/foreach}
						</ul>
					</dd>
				</dl>
				{/foreach}
			</div>
    </div>
{/block}
