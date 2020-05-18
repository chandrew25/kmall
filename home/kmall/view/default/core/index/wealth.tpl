{extends file="$templateDir/layout/main/layout.tpl"}
{block name=body}
    <a href="{$banner->links}" target="_blank">
      <img src="{$url_base}upload/images/{$banner->url}" width="100%">
    </a>
{/block}
