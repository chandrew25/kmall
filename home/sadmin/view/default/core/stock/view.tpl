{extends file="$templateDir/layout/normal/layout.tpl"}
{block name=body}
    <!-- page container begin -->
    <div class="page-container">
        <!-- page content begin -->
        <div class="page-content">
            {include file="$templateDir/layout/normal/sidebar.tpl"}

            <!-- main content begin -->
            <div class="content-wrapper">
              <div class="main-content">
                <!-- page header begin -->
                <div class="row">
                  <div class="breadcrumb-line">
                    <ul class="breadcrumb">
                      <li><a href="{$url_base}index.php?go=admin.index.index"><i class="icon-home2 position-left"></i>首页</a></li>
                      <li><a href="{$url_base}index.php?go=admin.stock.lists">stock</a></li>
                      <li class="active">查看stock</li>
                    </ul>
                  </div>
                </div>
                <!-- /page header end -->

                <!-- content area begin -->
                <div class="container-fluid view">
                  <div class="row col-xs-12">
                    <h2>stock详情</h2><hr>
                    <h4>
                      <span class="glyphicon glyphicon-list-alt"></span>
                      <span>基本信息</span>
                    </h4><hr>
                    <dl>
                      <dt><span>标识</span></dt>
                      <dd><span>{$stock.stock_id}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>姓名</span></dt>
                      <dd><span>{$stock.username}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>手机号码</span></dt>
                      <dd><span>{$stock.mobile}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>电子邮箱</span></dt>
                      <dd><span>{$stock.email}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>收件地址</span></dt>
                      <dd><span>{$stock.addr}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>身份证号码</span></dt>
                      <dd><span>{$stock.cardNo}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>收款账户姓名</span></dt>
                      <dd><span>{$stock.bname}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>收款账号</span></dt>
                      <dd><span>{$stock.baccount}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>开户行</span></dt>
                      <dd><span>{$stock.bstartup}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>是否申请委托开户</span></dt>
                      <dd><span>{$stock.isDelegateShow}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>申请金额</span></dt>
                      <dd><span>{$stock.money}</span></dd>
                    </dl>

                    <h4>
                      <span class="glyphicon glyphicon-list-alt"></span>
                      <span>其他信息</span>
                    </h4><hr>
                    <dl>
                      <dt><span>标识</span></dt>
                      <dd><span>{$stock.stock_id}</span></dd>
                    </dl>
                    <dl>
                      <dt><span>创建时间</span></dt>
                      <dd><span>{$stock.commitTime|date_format:"%Y-%m-%d %H:%M"}</span></dd>
                    </dl><dl>
                      <dt><span>更新时间</span></dt>
                      <dd><span>{$stock.updateTime|date_format:"%Y-%m-%d %H:%M"}</span></dd>
                    </dl>
                    <button type="submit" onclick="location.href='{$url_base}index.php?go=admin.stock.lists'" class="btn btn-info">
                      <span class="glyphicon glyphicon-arrow-left"></span>&nbsp;<span>返回</span>
                    </button>
                    <button type="submit" onclick="location.href='{$url_base}index.php?go=admin.stock.edit&amp;id={$smarty.get.id}'" class="btn btn-info">
                      <span class="glyphicon glyphicon-pencil"></span>&nbsp;<span>编辑</span>
                    </button>
                  </div>
                </div>

                <!-- /content area end -->
              </div>
            </div>
            <!-- /main content end -->

            <div class="clearfix"></div>
        </div>
        <!-- /page content end -->
    </div>
    <!-- /page container end -->

    {include file="$templateDir/layout/normal/footer.tpl"}
{/block}