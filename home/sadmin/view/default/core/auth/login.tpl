{extends file="$templateDir/layout/layout_login.tpl"}
{block name=body}
<body class="login">
    <!--content begin-->
    <div class="page-container login-container">
      <main>
        <div class="content-wrapper">
          <div class="content">
            <form method="POST">
              <div class="panel panel-body login-form">
                <div class="bb-icon">证券</div>

                <div class="text-center">
                  <div class="icon-object border-warning-400 text-warning-400"><i class="icon-people"></i></div>
                  <h5 class="content-group-lg">登录您的账号</h5>
                </div>

                <div class="form-group has-feedback has-feedback-left">
                  <input name="username" type="text" class="form-control" placeholder="用户名">
                  <div class="form-control-feedback">
                    <i class="fa fa-user text-muted"></i>
                  </div>
                </div>

                <div class="form-group has-feedback has-feedback-left">
                  <input name="password" type="password" class="form-control" placeholder="密码">
                  <div class="form-control-feedback">
                    <i class="fa fa-lock text-muted"></i>
                  </div>
                  <p class="message">{$message}</p>
                </div>

                <div class="form-group">
                  <button type="submit" class="btn bg-blue btn-block">登录 <i class="fa fa-chevron-circle-right"></i></button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </main>

      <!--footer begin-->
      {include file="$templateDir/layout/normal/footer.tpl"}
      <!--footer end-->
    </div>
    <!--content end-->


    <script src="{$template_url}js/common/bower/bower.min.js"></script>

    <script type="text/javascript">
      $(function(){
        $(".bb-icon").click(function(){
          window.location = "{$url_base}index.php?go={$appName}.index.index";
        });

        $(".checker").click(function(){
          if ($(this).find("span").hasClass("checked")){
            $(this).find("span").removeClass("checked");
            $(this).find("input").removeAttr("checked");
          }else{
            $(this).find("span").addClass("checked");
            $(this).find("input").attr("checked","checked");
          }
        });

        $(".login-container").css("min-height",$(window).height());

        $(window).resize(function(){
          $(".login-container").css("min-height",$(window).height());
        });
      });
      var login = "一张网页，要经历怎样的过程，才能抵达用户面前？\n一位新人，要经历怎样的成长，才能站在技术之巅？\n探寻这里的秘密，体验这里的挑战，成为这里的主人！\n欢迎来到Betterlife世界，你，可以影响世界。\n"
      console.log(login);
      var theUA = window.navigator.userAgent.toLowerCase();
      if ((theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0]) || (theUA.match(/trident\s?\d+/) && theUA.match(/trident\s?\d+/)[0])) {
          var ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] || theUA.match(/trident\s?\d+/)[0];
          if (ieVersion < 9) {
              var str = "本网站仅支持 IE9 以上版本的浏览器，您的浏览器版本过低 :(";
              var str2 = "<br>推荐升级或下载其他浏览器:"
                  + "<a href='https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads' target='_blank' style='color:#464646;'>点我升级</a>,"
                  + "<a href='https://www.google.cn/chrome/' target='_blank' style='color:#464646;'>谷歌</a>,"
                  + "<a href='https://www.mozilla.org' target='_blank' style='color:#464646;'>火狐</a>";
              document.writeln("<pre style='text-align:center;color:#fff;background-color:#77cc6d; height:100%;border:0;position:fixed;top:0;left:0;width:100%;z-index:1234'>" +
                  "<h2 style='padding-top:200px;margin:0'><strong>" + str + "<br/></strong></h2><h2>" +
                  str2 + "</h2><h2 style='margin:0'><strong><br>如果你使用的是双核浏览器,请切换到极速模式访问<br/></strong></h2></pre>");
              document.execCommand("Stop");
              document.getElementsByTagName('nav')[0].style.display = "none";
          }
      }
    </script>
</body>
{/block}
