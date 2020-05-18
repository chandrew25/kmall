{extends file="$templateDir/layout/stock/layout.tpl"}
{block name=body}
   <div id="app" class="f-content">
        <table>
             <tr>
                  <th class="left">收费项目</th>
                  <th class="right">收费金额</th>
             </tr>
             <tr>
                  <td class="left">证券开户费(美国国泰资本指定的证券公司)</td>
                  <td class="right">100.00</td>
             </tr>
             <tr>
                  <td class="left">律师签证(美国律师法律鉴证)</td>
                  <td class="right">800.00</td>
             </tr>
             <tr>
                  <td class="left">美国SEC登记(美国证券委员会)</td>
                  <td class="right">450.00</td>
             </tr>
             <tr>
                  <td class="left">工本费(人工成本)</td>
                  <td class="right">168.00</td>
             </tr>
             <tr>
                  <td class="left">文件翻译费用、服务费 </td>
                  <td class="right">650.00</td>
             </tr>
             <tr>
                  <td class="left">合计</td>
                  <td class="right">2168.00</td>
             </tr>
        </table>
        <div class="flow-container">
            <img class="flow" src="{$template_url}resources/images/flow.jpg" alt="开户流程" />
        </div>                                                       
                  
        <div class="f-foot">
            <div class="f-foot-btns">
                <i-button id="btn-topay" class="btn-s" @click="toPay">确认开户</i-button>
            </div>
        </div>
   </div>
    <script type="text/javascript">
      Vue.config.debug = true;
      Vue.config.devtools = true;
      var url_base = "{$url_base}index.php?go=stock.stock.";

      // javascript的几种使用多行字符串的方式: http://jser.me/2013/08/20/javascript%E7%9A%84%E5%87%A0%E7%A7%8D%E4%BD%BF%E7%94%A8%E5%A4%9A%E8%A1%8C%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E6%96%B9%E5%BC%8F.html
      function heredoc(fn) {
          return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
      }

      var app = new Vue({
          el: '#app',
          data: {
              "intro": "1"
          },
          mounted() {
              this.baseUrl = window.location.origin;
          },
          methods: {
              openLink: function (relative_uri) {
                  window.open(url_base + relative_uri, '_blank');
              },
              toPay: function() {
                  this.openLink('pay');
              }
          }
      });
    </script>

{/block}