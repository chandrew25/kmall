<?php
/**
 +---------------------------------<br/>
 * 功能:处理文件目录相关的事宜方法。<br/>
 +---------------------------------
 * @category betterlife
 * @package util.common
 * @author skygreen
 */
class UtilExcelOrder extends UtilExcel
{
    /**
    * 将数组转换成Excel文件
    * 示例:
    *     1.直接下载:UtilExcel::arraytoExcel($arr_output_header,$regions,"regions.xlsx",true);
    *     2.保存到本地指定路径:
    * @param array $arr_output_header 头信息数组
    * @param array $excelarr 需要导出的数据的数组
    * @param string $outputFileName 输出文件路径
    * @param bool $isDirectDownload 是否直接下载。默认是否，保存到本地文件路径
    */
    public static function arraytoExcel($arr_output_header, $arr_output_header_ext, $excelarr, $outputFileName = null, $isDirectDownload = false, $isExcel2007 = false)
    {
        UtilFileSystem::createDir( dirname($outputFileName) );
        $objActSheet = array ();
        $objExcel    = new PHPExcel();
        if ( $isExcel2007 ) {
            if ( !function_exists("zip_open") ) { LogMe::log( "后台下载功能需要Zip模块支持,名称:php_zip<br/>", EnumLogLevel::ALERT ); die(); }
            $objWriter = new PHPExcel_Writer_Excel2007($objExcel);
        }else{
            $objWriter = new PHPExcel_Writer_Excel5($objExcel);
        }
        $objExcel->setActiveSheetIndex(0);
        $objExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $objExcel->getDefaultStyle()->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
        $objActsheet = $objExcel->getActiveSheet();
        //获取表头
        $i = 1;
        if ( $arr_output_header ) {
            $column = 'A';
            foreach ($arr_output_header as $key => $value)
            {
                if ( $column >= "R" || $column <= "K" ) {
                    $objActsheet->mergeCells($column . '1:' . $column . '2');//纵向合并
                    $objActsheet->setCellValue($column . $i, $value);
                    // echo $column . $i . $value;echo "<br>";
                } else {
                  $objActsheet->setCellValue($column . "2", $value);
                  // echo $column . "2";echo "<br>";
                }
                $column++;
            }
            $column = "L";
            foreach ($arr_output_header_ext as $key => $value) {
              $column_next = $column;
              $column_next++;
              // echo $column . "----" . $column_next;echo "<br>";
              $objActsheet->mergeCells($column . '1:' . $column_next . '1');//横向合并
              $objActsheet->setCellValue($column . '1', $value);
              $column = $column_next;
              $column++;
            }
            $i++;
        }
        $i++;
        //获取表内容
        if ( !empty($excelarr) ) {
            if ( is_object($excelarr) ) $excelarr = array($excelarr);
            foreach ($excelarr as $record)
            {
                $column = 'A';
                foreach ($arr_output_header as $key => $value)
                {
                    $objActsheet->setCellValue($column . $i, $record->$key);
                    $column++;
                }
                $i++;
            }
        }

        if ( empty($outputFileName) ) {
            if ( $isExcel2007 ) $outputFileName = date("YmdHis") . ".xlsx"; else $outputFileName = date("YmdHis") . ".xls";
        } else {
            if ( $isExcel2007 ) {
                if ( endWith($outputFileName, ".xls") ) $outputFileName  = str_replace(".xls", ".xlsx", $outputFileName);
            } else {
                if ( endWith($outputFileName, ".xlsx") ) $outputFileName = str_replace(".xlsx", ".xls", $outputFileName);
            }
        }

        if ( $isDirectDownload ) {
            $outputFileName = basename($outputFileName);
            ob_end_clean();
            header("Content-Type: application/force-download");
            header("Content-Type: application/octet-stream");
            header("Content-Type: application/download");
            Header("Content-Disposition:attachment;filename=" . $outputFileName);
            //header('Content-Disposition:inline;filename="'.$outputFileName.'"');
            header("Content-Transfer-Encoding: binary");
            header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
            header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Pragma: no-cache");
            $objWriter->save('php://output');
        } else {
            //导出到服务器
            //$outputFileName=UtilString::utf82gbk($outputFileName);
            $objWriter->save($outputFileName);
        }
    }



}
