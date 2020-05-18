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
                      <li class="active">编辑stock</li>
                    </ul>
                  </div>
                </div>
                <!-- /page header end -->

                <!-- content area begin -->
                <div class="container-fluid edit">
                  <div class="row col-xs-12">
                      <form id="editStockForm" class="form-horizontal" action="#" method="post" >
                      {if isset($message)}
                      <div class="form-group">
                        <label class="col-sm-2 control-label error-msg">错误信息</label>
                        <div class="col-sm-9 edit-view error-msg">{$message}</div>
                      </div>
                      {/if}
                      {if $stock}
                      <div class="form-group">
                        <label class="col-sm-2 control-label">标识</label>
                        <div class="col-sm-9 edit-view">{$stock.stock_id}</div>
                      </div>
                      {/if}
                      <div class="form-group">
                          <label for="username" class="col-sm-2 control-label">姓名</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <textarea class="form-control" id="username" name="username" rows="6" cols="60" placeholder="姓名">{$stock.username}</textarea>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="mobile" class="col-sm-2 control-label">手机号码</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <input id="mobile" name="mobile" placeholder="手机号码" class="form-control" type="text" value="{$stock.mobile}"/>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="email" class="col-sm-2 control-label">电子邮箱</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <input id="email" name="email" placeholder="电子邮箱" class="form-control" type="text" value="{$stock.email}"/>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="addr" class="col-sm-2 control-label">收件地址</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <textarea class="form-control" id="addr" name="addr" rows="6" cols="60" placeholder="收件地址">{$stock.addr}</textarea>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="cardNo" class="col-sm-2 control-label">身份证号码</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <input id="cardNo" name="cardNo" placeholder="身份证号码" class="form-control" type="text" value="{$stock.cardNo}"/>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="bname" class="col-sm-2 control-label">收款账户姓名</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <input id="bname" name="bname" placeholder="收款账户姓名" class="form-control" type="text" value="{$stock.bname}"/>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="baccount" class="col-sm-2 control-label">收款账号</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <textarea class="form-control" id="baccount" name="baccount" rows="6" cols="60" placeholder="收款账号">{$stock.baccount}</textarea>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="bstartup" class="col-sm-2 control-label">开户行</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <textarea class="form-control" id="bstartup" name="bstartup" rows="6" cols="60" placeholder="开户行">{$stock.bstartup}</textarea>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="isDelegate" class="col-sm-2 control-label">是否申请委托开户</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <input id="isDelegate" name="isDelegate" placeholder="是否申请委托开户" class="form-control" type="checkbox" {if $stock.isDelegate} checked {/if} data-on-text="是" data-off-text="否" />
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="money" class="col-sm-2 control-label">申请金额</label>
                          <div class="col-sm-9">
                              <div class="clearfix">
                                  <input id="money" name="money" placeholder="申请金额" class="form-control" type="text" value="{$stock.money}"/>
                              </div>
                          </div>
                      </div>
                      <div class="space-4"></div>
                      <input type="hidden" name="stock_id" value="{$stock.stock_id}"/>
                      <div class="form-actions col-md-12">
                          <button type="submit" class="btn btn-success">确认</button>
                          <div class="btn-group" role="group">
                            <button type="reset" class="btn btn-reset"><i class="fa fa-undo bigger-110"></i>重置</button>
                          </div>
                      </div>
                      </form>
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


    <script src="{$template_url}js/normal/edit.js"></script>
    <script src="{$template_url}js/core/stock.js"></script>

    {if ($online_editor == "UEditor")}
        <script>
          $(function(){
            pageInit_ue_username();pageInit_ue_addr();pageInit_ue_baccount();pageInit_ue_bstartup();
          });
        </script>
    {/if}
{/block}