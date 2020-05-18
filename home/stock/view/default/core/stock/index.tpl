{extends file="$templateDir/layout/stock/layout.tpl"}
{block name=body}
   <div id="app" class="v-content">
        <div class="v-head">赠送已在美国纳斯达克上市的OTC股票，按股票当下市值赠送(对应市值限额1-15万人名币), 仅限500人</div>
        <template>
            <Collapse v-model="intro" accordion>
                <Panel name="1">
                    美国股票的好处
                    <p slot="content" class="intro-content">
                        美国股票市场的基本特点为：规模大、市场成熟、运作规范、股价稳定。经过数百年的市场规范运作，呈现出一种成熟市场的特征。<br/>
                        美国股票市场是世界上最发达的股票市场，无论是股票发行市场还是流通市场，无论是股票发行及交易品种的数量、股票市场容量还是市场发育程度，在世界上均首屈一指。<br/>
                    </p>
                </Panel>
                <Panel name="2">
                    自行开户
                    <p slot="content" class="intro-content">
                        投资人自行准备资料联系美国本地的证券公司（首次证券开户需柜面签）及SEC登记（证券交易所委员会）及找美国的律师、找翻译社文件翻译。<br/>
                    </p>
                </Panel>
                <Panel name="3">
                    委托开户
                    <p slot="content" class="intro-content">
                        世纪保理与美国国泰资本指定的证券公司联合全权代理为投资人提供美国证券开户服务，投资人只需提供个人资料。（服务内容：证券开户 文件翻译 SEC登记 律师鉴证 股票赠送转让等）<br/>
                    </p>
                </Panel>
                {* <Panel name="4">
                    股票样本
                    <p slot="content" class="intro-content">
                        <img src="{$template_url}resources/images/b.jpg" alt="股票样本" /><br/>
                        开户成功后，信息将会发送到您的电子邮箱，并尽快为您安排美国上市公司赠送股票，SEC制定好股票后将快递给您接收快递的指定地址，请注意查收。<br/>
                    </p>
                </Panel> *}
            </Collapse>
        </template>
        <div class="v-foot">
            <div class="v-foot-btns">
                <i-button id="btn-had" class="btn-s" @click="hadForm">已开户或自行开户</i-button><br/><br/>
                <i-button id="btn-unhad" class="btn-s" @click="unHadForm">委托开户</i-button>
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
          },
          methods: {
              openLink: function (relative_uri) {
                  window.open(url_base + relative_uri, '_blank');
              },
              hadForm: function() {
                  this.openLink('form&type=1');
              },
              unHadForm: function() {
                  this.openLink('form&type=2');
              }

          }
      });

    </script>
{/block}
