{extends file="$templateDir/layout/stock/layout.tpl"}
{block name=body}
   <div id="app" class="a-content">
        <i-form ref="applyForm" :model="applyForm" :rules="ruleValidate" label-position="left" :label-width="110">
            <div style="margin-top:20px;">股票金额</div>
            <div class="input-contianer">
                <div class="ivu-form-item ivu-form-item-required">
                    <label class="ivu-form-item-label" style="width: 110px;">金额(RMB)</label> 
                    <div class="ivu-form-item-content" style="margin-left: 110px;">
                        <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type-number">
                            <i v-if="applyForm.money" @click="clearMoney" class="ivu-icon ivu-icon-ios-close-circle ivu-input-icon ivu-input-icon-clear ivu-input-icon-normal"></i>
                            <input autocomplete="off" spellcheck="false" type="number" @keydown="limitInput" v-model="applyForm.money" name="money" placeholder="请填写申请股权赠送金额" class="ivu-input ivu-input-default" />
                        </div> 
                    </div>
                </div>
            </div>
        </i-form>
        <div class="warm-info">
            <p>*温馨提示:</p>
            <ul>
                <li>股票申请金额是指经由审核确认权益无误后确认接收股权赠送的金额,由美国国泰资本指定的证券公司开户。</li>
                <li>证券开户后等待由深圳前海世纪保理有限公司指定在美国上市,进行股票赠送。</li>
                <li>赠送面值股票价值每人限额1-15万元人民币。</li>
                <li>此股票是由美国SEC(美国证券委员会)登记、美国律师事务所做签字鉴证的合法股票。
</li>
                <li>股票赠送后可在个人证券账户中查询并交易。</li>
            </ul>
        </div>
        <div class="f-foot">
            <div class="f-foot-btns">
                <i-button :disabled="!isCanClick" id="btn-finish" class="btn-s" @click="toFee">委托开户申请</i-button>
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
              type: 2,
              isCanClick: false,
              applyForm: {
                  money: ''
              },
              ruleValidate: {
                  money: [
                      { required: true, message: '股票金额输入不能为空', trigger: 'blur' }
                  ]
              }
          },
          watch: {
              applyForm: {
                  handler(val){
                      this.isCanClick = this.judgeCanClick();
                  },
                  deep: true
              }  
          },
          mounted() {
              this.baseUrl = window.location.origin;
          },
          methods: {
              limitInput: function(e){
                  // 通过正则过滤小数点后两位
                  e.target.value = numberLimit(e);
              },
              clearMoney: function(e){
                  // 通过正则过滤小数点后两位
                  this.applyForm.money = "";
              },
              judgeCanClick: function() {
                  if ( !this.applyForm.money ) {
                      return false;
                  }
                  return true;
              },
              openLink: function (relative_uri) {
                  window.open(url_base + relative_uri, '_blank');
              },
              toFee: function() {
                  var toparam = "&money=" + this.applyForm.money;
                  this.openLink('fee' + toparam);
              }
          }
      });
    </script>

{/block}