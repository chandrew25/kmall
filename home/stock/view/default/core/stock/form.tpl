{extends file="$templateDir/layout/stock/layout.tpl"}
{block name=body}
   <div id="app" class="f-content">
        <i-form ref="userForm" :model="userForm" :rules="ruleValidate" label-position="left" :label-width="110">
            <div>个人信息:</div>
            <div class="input-contianer">
                <form-item label="姓名" prop="username">
                  <i-input v-model="userForm.username" name="username" placeholder="" clearable  />
                </form-item>
            </div>
            <div class="input-contianer">
                <form-item label="手机号码" prop="mobile">
                  <i-input type="tel" v-model="userForm.mobile" name="mobile" placeholder="" clearable />
                </form-item>
            </div>
            <div class="input-contianer">
                <form-item label="电子邮箱" prop="email">
                  <i-input type="email" v-model="userForm.email" name="email" placeholder="接收办理进度信息" clearable />
                </form-item>
            </div>
            <div class="input-contianer">
                <form-item label="居住地址" prop="addr">
                  <i-input v-model="userForm.addr" name="addr" placeholder="" clearable />
                  {* placeholder="接收股权证收件地址" *}
                </form-item>
            </div>
            <div class="input-contianer">
                <form-item label="身份证号码" prop="cardNo">
                  <i-input v-model="userForm.cardNo" name="cardNo" placeholder="" clearable />
                </form-item>
            </div>
            <div v-if="type==2">
                <div>银行账户:</div>
                <div class="input-contianer">
                    <form-item label="收款账户姓名" prop="bname">
                      <i-input v-model="userForm.bname" name="bname" placeholder="" clearable  />
                    </form-item>
                </div>
                <div class="input-contianer">
                    <form-item label="收款账号" prop="baccount">
                      <i-input v-model="userForm.baccount" name="baccount" placeholder="" clearable />
                    </form-item>
                </div>
                <div class="input-contianer">
                    <form-item label="开户行" prop="bstartup">
                      <i-input v-model="userForm.bstartup" name="bstartup" placeholder="XX银行XX支行(请务必填写正确)" clearable />
                    </form-item>
                </div>
            </div>
        </i-form>

        <div class="f-foot">
            <div class="ptinfo" v-if="type==1">
                * 您的个人信息仅用于股票登记！
            </div>
            <div class="ptinfo" v-if="type==2">
                * 您的个人信息仅用于美国证券开户及股票登记！
            </div>
            <div class="f-foot-btns">
                <i-button :disabled="!isCanClick" id="btn-topay" class="btn-s" @click="toApply">委托开户申请</i-button>
            </div>
        </div>
   </div>
    <script type="text/javascript">
      Vue.config.debug = true;
      Vue.config.devtools = true;
      var url_base = "{$url_base}index.php?go=stock.stock.";
      var ptype = {$smarty.get.type|default:0};

      // javascript的几种使用多行字符串的方式: http://jser.me/2013/08/20/javascript%E7%9A%84%E5%87%A0%E7%A7%8D%E4%BD%BF%E7%94%A8%E5%A4%9A%E8%A1%8C%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E6%96%B9%E5%BC%8F.html
      function heredoc(fn) {
          return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
      }
      const isPhoneRight = (rule, value, callback) => {
          if ( !isMobilePhone(value) ) {
              callback(new Error('请输入正确的手机号!'));
          }
          callback();
      };
      const idCardPass = (rule, value, callback) => {
          if ( !isIdCard(value) ) {
              callback(new Error('请输入正确的身份证号!'));
          }
          callback();
      };
      var userForm = new Vue({
        el: '#app',
        data: {
          type: 2,
          isCanClick: false,
          userForm: {
            username: '',
            mobile  : '',
            email   : '',
            addr    : '',
            cardNo  : '',
            bname   : '',
            baccount: '',
            bstartup: '',
          },
          ruleValidate: {
              username: [
                  { required: true, message: '姓名输入不能为空', trigger: 'blur' }
              ],
              mobile  : [
                  { required: true, message: '手机号码输入不能为空', trigger: 'blur' },
                  { validator: isPhoneRight, trigger: 'blur' }
                  
              ],
              email   : [
                  { required: true, message: '电子邮箱输入不能为空', trigger: 'blur' },
                  { type: 'email', message: '邮箱地址格式错误', trigger: 'blur' }
              ],
              addr    : [
                  { required: true, message: '收件地址输入不能为空', trigger: 'blur' }
              ],
              cardNo  : [
                  { required: true, message: '身份证号输入不能为空', trigger: 'blur' },
                  { validator: idCardPass, trigger: "blur" }
              ]
              {* bname   : [
                  { required: true, message: '收款账户姓名输入不能为空', trigger: 'blur' }
              ],
              baccount: [
                  { required: true, message: '收款账号输入不能为空', trigger: 'blur' }
              ],
              bstartup: [
                  { required: true, message: '开户行输入不能为空', trigger: 'blur' }
              ] *}
          }
        },
        created: function () {
           this.type = ptype;
          // console.log('message is: ' + this.report_cname);
        },
        computed: {
        },
        watch: {
            userForm: {
                handler(val){
                    this.isCanClick = this.judgeCanClick();
                },
                deep: true
            },
            
        },
        methods: {
            judgeCanClick: function() {
                if ( !this.userForm.username || !this.userForm.mobile ||
                     !this.userForm.email || !this.userForm.addr ||
                     !this.userForm.cardNo
                   ) {
                    return false;
                }
                {* if ( this.type == 2 ) {
                    if ( !this.userForm.bname || !this.userForm.baccount ||
                        !this.userForm.bstartup
                    ) {
                        return false;
                    }
                } *}
                return true;
            },
            openLink: function (relative_uri) {
                window.open(url_base + relative_uri, '_blank');
            },
            toApply: function() {
                this.isCanClick = false;
                var toparam = "&type=" + ptype + "&username=" + this.userForm.username + "&mobile=" + this.userForm.mobile + "&email=" + this.userForm.email + "&addr=" + this.userForm.addr + "&cardNo=" + this.userForm.cardNo;
                if ( this.type == 2 ) {
                    toparam += "&bname=" + this.userForm.bname + "&baccount=" + this.userForm.baccount + "&bstartup=" + this.userForm.bstartup;
                }
                this.openLink('apply' + toparam);
            }
        }
      });
    </script>

{/block}