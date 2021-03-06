<?php
/**
 * 直接执行SQL语句
 * @param mixed $sql SQL查询语句
 * @param string|class|bool $object 需要生成注入的对象实体|类名称
 * @return array 默认返回数组,如果$object指定数据对象，返回指定数据对象列表，$object=true，返回stdClass列表。
 */
function sqlExecute($sqlstring,$object=null)
{
    if (empty($sqlstring)) {
        return null;
    }
    if ($object){
        if (is_bool($object))$object=null;
        return Manager_Db::newInstance()->currentdao()->sqlExecute($sqlstring,$object);
    }else{
        $lists=Manager_Db::newInstance()->currentdao()->sqlExecute($sqlstring,$object);
        if ($lists){
            if (is_array($lists)){
                if (count($lists)>0){
                    foreach ($lists as $key=>$data) {
                        if (is_object($data)){
                            $lists[$key]=(array) $data;
                        }
                    }
                }
            }
        }
        return $lists;
    }
}

/**
 * 设置处理所有未捕获异常的用户定义函数
 */
function e_me($exception)
{
    ExceptionMe::recordUncatchedException($exception);
    e_view();
}

/**
 * 显示异常处理缩写表示
 */
function e_view()
{
    if (Gc::$dev_debug_on) {
        echo ExceptionMe::showMessage(ExceptionMe::VIEW_TYPE_HTML_TABLE);
    }
}

/**
 * 查看字符串里是否包含指定字符串
 * @param mixed $subject
 * @param mixed $needle
 */
function contain($subject,$needle)
{
    if (empty($subject))return false;
    if (strpos(strtolower($subject),strtolower($needle))!== false) {
        return true;
    }else {
        return false;
    }
}

/**
 * 查看字符串里是否包含数组中任意一个指定字符串
 * @param mixed $subject
 * @param mixed $array
 */
function contains($subject,$array)
{
    $result=false;
    if (!empty($array)&&is_array($array)){
        foreach ($array as $element){
          if (contain($subject,$element)){
              return true;
          }
        }
    }
    return $result;
}

/**
 * 需要的字符是否在目标字符串的开始
 * @param string $haystack 目标字符串
 * @param string $needle 需要的字符
 * @param bool $strict 是否严格区分字母大小写
 * @return bool true:是，false:否。
 */
function startWith($haystack, $needle,$strict=true)
{
    if (!$strict){
        $haystack=strtoupper($haystack);
        $needle=strtoupper($needle);
    }
    return strpos($haystack, $needle) === 0;
}

/**
 * 需要的字符是否在目标字符串的结尾
 * @param string $haystack 目标字符串
 * @param string $needle 需要的字符
 * @param bool $strict 是否严格区分字母大小写
 * @return bool true:是，false:否。
 */
function endWith($haystack, $needle,$strict=true)
{
    if (!$strict){
        $haystack=strtoupper($haystack);
        $needle=strtoupper($needle);
    }
    return (strpos(strrev($haystack), strrev($needle)) === 0);
}

/**
 * 将Url param字符串转换成Json字符串
 * @link http://php.net/manual/en/function.parse-str.php
 * @example
 *  示例如下：<br/>
 *  $url_parms = 'title=hello&custLength=200&custWidth=300'
 * @return Json字符串 
 */
function urlparamToJsonString($url_parms)
{
    parse_str($url_parms, $parsed);
    $result = json_encode($parsed);
    return $result;
}


/**
* 专供Flex调试使用的Debug工具
* @link http://www.adobe.com/cn/devnet/flex/articles/flex_php_05.html
* @param mixed $var
*/
function logMe($var)
{
    $filename = dirname(__FILE__) . '/__log.txt';
    if (!$handle = fopen($filename, 'a')) {
        echo "Cannot open file ($filename)";
        return;
    }

    $toSave = var_export($var, true);
    fwrite($handle, "[" . date("y-m-d H:i:s") . "]");
    fwrite($handle, "\n");
    fwrite($handle, $toSave);
    fwrite($handle, "\n");
    fclose($handle);
}

/**
 * 是否直接显示出来
 * @param type $s
 * @param type $isEcho
 */
function print_pre($s,$isEcho=false)
{
    if ($isEcho){
        print "<pre>";print_r($s);print "</pre>";
    }else{
        return var_export($s,true);
    }
}

?>
