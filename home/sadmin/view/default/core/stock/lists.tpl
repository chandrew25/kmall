{extends file="$templateDir/layout/normal/layout.tpl"}
{block name=body}

    <div class="page-container">
        <div class="page-content">

            <div class="content-wrapper list-wrapper">
              <div class="main-content">
                <div class="row">
                  <div class="breadcrumb-line">
                    <ul class="breadcrumb">
                      {* <li><a href="{$url_base}index.php?go=admin.index.index"><i class="icon-home2 position-left"></i>首页</a></li> *}
                      <li class="active">美国证券申请列表</li>
                    </ul>
                  </div>
                </div>

                <div class="container-fluid list">
                    <div class="row">
                        <div class="btns-container">
                            <a class="btn btn-default" id="btn-stock-export">导出</a>
                            <input id="upload_file" name="upload_file" type="file" style="display:none;" accept=".xlsx, .xls" />
                        </div>
                    </div><br/>
                    <div class="row up-container">
                        <div class="filter-up">
                            <div class="filter-up-right col-sm-12">
                                <div>
                                    <i aria-label="search-menu" class="glyphicon glyphicon-search" aria-hidden="true"></i>
                                    <input id="input-search" type="search" placeholder="搜索名称" aria-controls="infoTable" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row table-responsive col-xs-12">
                        <table id="infoTable" class="display nowrap dataTable table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>姓名</th>
                                    <th>手机号码</th>
                                    <th>电子邮箱</th>
                                    <th>收件地址</th>
                                    <th>身份证号码</th>
                                    <th>收款账户姓名</th>
                                    <th>收款账号</th>
                                    <th>开户行</th>
                                    <th>是否申请委托开户</th>
                                    <th>申请金额</th>
                                    <th>申请日期</th>

                                    {* <th>操作</th> *}
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
              </div>
            </div>

            <div class="clearfix"></div>
        </div>
    </div>

    {include file="$templateDir/layout/normal/footer.tpl"}

    {literal}
    <script id="actionTmpl" type="text/x-jsrender">
    <a id="info-view{{:id}}" href="#" class="btn-view">查看</a>
    <a id="info-edit{{:id}}" href="#" class="btn-edit">修改</a>
    <a id="info-dele{{:id}}" href="#" class="btn-dele" data-toggle="modal" data-target="#infoModal">删除</a>
    </script>
    {/literal}
    <script src="{$template_url}js/normal/list.js"></script>
    <script src="{$template_url}js/core/stock.js"></script>
{/block}