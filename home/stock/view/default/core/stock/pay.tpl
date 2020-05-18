{extends file="$templateDir/layout/stock/layout.tpl"}
{block name=body}
   <div id="app" class="f-content">
        
        <div>请扫码支付</div>
        <div class="pay-container">
            <div class="paytype-content">
                <div class="paytype pay-wechat" @click="wechatModel=true">
                    <img class="pay-img" width="80" height="80" src="{$template_url}resources/images/w1n.jpg" alt="wechat" />
                </div>
                <div class="paytype pay-alipay" @click="alipayModel=true">
                    <img class="pay-img" width="80" height="80" src="{$template_url}resources/images/w2n.jpg" alt="alipay" />
                </div>
            </div>
        </div>

        <div class="warm-info" style="margin-bottom:60px;">
            <p>*温馨提示:</p>
            <ul>
                <li>付款后,我们将会第一时间为您进行在美国开户(证券开户时间在提交申请后的1个月内)。</li>
                <li>开户成功后,具体信息将会发送至您的邮箱,并尽快为您安排美国上市公司赠送的股票。</li>
                <li>付款成功后请截图保存，发送给客服人员。</li>
            </ul>
        </div>
        <div class="f-foot">
            <div class="f-foot-btns">
                <i-button id="btn-finish" class="btn-s" @click="toFinish">支付完毕</i-button><br/><br/>
                <i-button id="btn-had" class="btn-s" @click="goback">返回上一页</i-button>
            </div>
        </div>
        <Modal v-model="wechatModel" title="微信支付" width="800" class-name="vertical-center-modal" footer-hide="true">
            <div class="setting_content">
                <img width="100%" class="flow" src="{$template_url}resources/images/wechat.jpg" alt="微信二维码" />
            </div>
        </Modal>
        <Modal v-model="alipayModel" title="支付宝支付" width="800" class-name="vertical-center-modal" footer-hide="true">
            <div class="setting_content">
                <img width="100%" class="flow" src="{$template_url}resources/images/alipay.jpg" alt="支付宝二维码" />
            </div>
        </Modal>

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
              "intro": "1",
              wechatModel: false,
              alipayModel: false,
              "baseUrl": ""
          },
          mounted() {
              this.baseUrl = window.location.origin;
          },
          methods: {
              openLink: function (relative_uri) {
                  window.open(url_base + relative_uri, '_blank');
              },
              goback: function() {
                  this.openLink('fee');
              },
              toFinish: function() {
                  this.openLink('success');
              }
          }
      });
    </script>

{/block}