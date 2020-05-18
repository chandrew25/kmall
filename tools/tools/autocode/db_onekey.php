<?php
require_once ("../../../init.php");

if ( isset($_REQUEST["model_save_dir"]) && !empty($_REQUEST["model_save_dir"]) ) {
    if ( isset($_REQUEST["model_save_dir"])&&!empty($_REQUEST["model_save_dir"]) )
        $model_save_dir=$_REQUEST["model_save_dir"];

    $overwrite  = array();
    $ow_modules = array(
        "domain", "ajax", "front", "model", "admin"
    );
    foreach ($ow_modules as $module) {
        if ( isset($_REQUEST["overwrite$module"] ) && !empty($_REQUEST["overwrite$module"]) )$overwrite = array_merge($overwrite, $_REQUEST["overwrite$module"]);
    }
    if ( count($overwrite)>0 ) AutoCodeModel::overwrite( $overwrite, $model_save_dir );
    $_REQUEST["save_dir"] = $_REQUEST["model_save_dir"];
    AutoCodePreviewReport::$is_first_run = false;
}

AutoCodeModel::UserInput();
if ( isset($_REQUEST["save_dir"]) && !empty($_REQUEST["save_dir"]) )
{
    $save_dir = $_REQUEST["save_dir"];
    AutoCodeModel::$save_dir = $save_dir;

    if ( !array_key_exists("table_names", $_GET) ) {
        if ( !Manager_Db::newInstance()->dao()->isCanConnect() ) {
          die("<br><br><div align='center'><font color='red'>无法连接上数据库，请确认Gc.php文件里数据库配置是否正确！</font></div>");
        }
        die("<br><br><div align='center'><font color='red'>至少选择一张表,请确认！</font></div>");
    } else {
        $table_names = $_GET["table_names"];
        AutoCodeConfig::Decode();
        AutoCodeModel::$showReport = "";
        AutoCodeModel::AutoCode($table_names);
    }

    if ( Config_AutoCode::SHOW_PREVIEW_REPORT ) {
        echo "<div style='width:80%;margin:0 auto;'>";
        echo "  <a href='javascript:' style='cursor:pointer;' onclick=\"(document.getElementById('showPrepareWork').style.display=(document.getElementById('showPrepareWork').style.display=='none')?'':'none')\">预备工作</a>";
        echo "  <div id='showPrepareWork' style='display: none;'>";
        echo AutoCodeModel::$showPreviewReport;
        echo "  </div>";
        echo "  <p style='height:20px;text-align:right;'><span style='float:left'><a href='javascript:' style='cursor:pointer;' onclick=\"(document.getElementById('showReport').style.display=(document.getElementById('showReport').style.display=='none')?'':'none')\">显示报告</a></span></p>";
        echo "  <div id='showReport' style='display: none;margin-left: 2%;'>";
        echo AutoCodeModel::$showReport;
        echo "  </div>";
        echo "</div>";
    }
    AutoCodePreviewReport::init();
    $showReport = AutoCodePreviewReport::showReport( $table_names );
    echo $showReport;
}
