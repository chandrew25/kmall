{extends file="$templateDir/layout/stock/layout.tpl"}
{block name=body}
   <div id="app" class="f-content">
        <div class="succss-title">恭喜您，提交成功！</div>

        <div class="warm-info" style="margin:20px 20px;">
            <ul>
                <li>经工作人员审核无误后会为您安排开户,请您耐心等待。</li>
                <li>证券开户完毕后,将有工作人员打电话通知您(证券开户时间在提交申请后的1个月内)。</li>
                <li>开户成功后,具体信息亦会发送至您的邮箱,并尽快为您安排美国上市公司赠送的股票。</li>
                {* <li>SEC制定好股票后将快递至您填写的指定收件地址。</li> *}
                <li>有任何问题,欢迎联系客服人员咨询。好友申请请填写:证券、姓名、项目、手机号。</li>
            </ul>
        </div>
        <div>
            <div style="width:80%; margin: 0 auto; text-align:center;">
                <img width="60%" height="60%" src="{$template_url}resources/images/kefu.jpg" alt="股票样本" />
            </div>    
        </div>
        <div class="flow-container" style="margin-top: -40px;">
            <img class="flow" src="{$template_url}resources/images/flow.jpg" alt="开户流程" />
        </div>    
        <div class="f-foot" style="margin-top: -60px;">
            <div class="f-foot-btns">
                <i-button id="btn-index" class="btn-s" @click="toIndex">返回首页</i-button>
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
              "intro": "1",
              "baseUrl": ""
          },
          mounted() {
              this.baseUrl = window.location.origin;
          },
          methods: {
              openLink: function (relative_uri) {
                  window.open(url_base + relative_uri, '_blank');
              },
              toIndex: function() {
                  this.openLink('index');
              }
          }
      });
    </script>

{/block}