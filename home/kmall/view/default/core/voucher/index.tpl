{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="center">
    <div class="brand">
        <img src="{$template_url}resources/images/voucher/brand.jpg">
    </div>
    <div class="lists">
        <div class="li">
            <img src="{$template_url}resources/images/voucher/li1.jpg">
        </div>
        <div class="li">
            <img src="{$template_url}resources/images/voucher/li2.jpg">
        </div>
        <div class="li li3">
            <a href="{$url_base}index.php?go=kmall.voucher.login" class="li3_ck"></a>
        </div>
    </div>
</div>
{/block}