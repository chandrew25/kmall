<?php

//取得客户端IP地址
function getip() {
    $ip = false;
    if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
        $ip = $_SERVER["HTTP_CLIENT_IP"];
    }

    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(", ", $_SERVER['HTTP_X_FORWARDED_FOR']);
        if ($ip) {
            array_unshift($ips, $ip);
            $ip = FALSE;
        }

        for ($i = 0; $i < count($ips); $i++) {
            if (!eregi("^(10|172|192)\.", $ips[$i])) {
                $ip = $ips[$i];
                break;
            }
        }
    }

    $ip_n = ($ip ? $ip : $_SERVER['REMOTE_ADDR']);
    $intip = bindec(decbin(ip2long($ip_n)));
    return $intip;
    //return ($ip ? $ip : $_SERVER['REMOTE_ADDR']);
}

function redirect($url = null) {
    ob_start();
    header("Location: {$url}");
    exit;
}

function ActionApp($file) {
    if ($file == EXT)
        exit('Access Denied.. !');
    include($file);
}

function GetFile($Rewrite) {
    $cuturl = explode('/', $_SERVER["REQUEST_URI"]);
    $i = 1;
    $j = 2;
    if (AppName) {
        $i = 2;
        $j = 3;
    }
    if ($Rewrite) {
        return $cuturl[$i];
    } else {
        return $cuturl[$j];
    }
}

function weburl($url) {
    $base_url = 'http://' . $_SERVER['SERVER_NAME'] . '/';
    if (AppName) {
        $base_url.=AppName . "/";
    }
    if (Rewrite) {
        return $base_url . $url;
    } else {
        return $base_url . index_page . '/' . $url;
    }
}

function GET_Api($url, $PostData) {
    $o = "";
    foreach ($PostData as $k => $v) {
        $o .= "$k=" . urlencode($v) . "&";
    }
    $post_data = substr($o, 0, - 1);

    return file_get_contents($url . $post_data);
}

function POST_Api($url, $PostData) {
    $o = "";
    foreach ($PostData as $k => $v) {
        $o .= "$k=" . urlencode($v) . "&";
    }
    $post_data = substr($o, 0, - 1);

    //echo $url.$post_data;die();
    //请求参数为get方式
    $curl = curl_init();
    // 设置你需要抓取的URL
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
    // 设置cURL 参数，要求结果保存到字符串中还是输出到屏幕上。
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);

    // 运行cURL，请求网页
    $rdata = curl_exec($curl);

    // 关闭URL请求
    curl_close($curl);
    return $rdata;
}

/*
 * rc4加密算法
 * $pwd 密钥
 * $data 要加密的数据
 */

function RC4($pt, $key = H_PASS) {
    $s = array();
    for ($i = 0; $i < 256; $i++) {
        $s[$i] = $i;
    }
    $j = 0;
    $x;
    for ($i = 0; $i < 256; $i++) {
        $j = ($j + $s[$i] + ord($key[$i % strlen($key)])) % 256;
        $x = $s[$i];
        $s[$i] = $s[$j];
        $s[$j] = $x;
    }
    $i = 0;
    $j = 0;
    $ct = '';
    $y;
    for ($y = 0; $y < strlen($pt); $y++) {
        $i = ($i + 1) % 256;
        $j = ($j + $s[$i]) % 256;
        $x = $s[$i];
        $s[$i] = $s[$j];
        $s[$j] = $x;
        $ct .= $pt[$y] ^ chr($s[($s[$i] + $s[$j]) % 256]);
    }

    $length = strlen($ct);
    $cipher = '';
    for ($i = 0; $i < $length; $i++) {
        $cipher .= sprintf('%02s', dechex(ord($ct[$i])));
    }

    $ct = $cipher;

    return $ct;
}

/* 解密 
 *  
 * @param string $encryptedText 已加密字符串 
 * @param string $key  密钥 
 * @return string 
 */

function _decrypt($encryptedText, $key) {
    $key = $key === null ? Config::get('secret_key') : $key;
    $cryptText = base64_decode($encryptedText);
    $ivSize = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
    $iv = mcrypt_create_iv($ivSize, MCRYPT_RAND);
    $decryptText = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, $cryptText, MCRYPT_MODE_ECB, $iv);
    return trim($decryptText);
}

/**
 * 加密 
 * 
 * @param string $plainText 未加密字符串  
 * @param string $key        密钥 
 */
function _encrypt($plainText, $ekey = null) {
    $key = 'ApiWebLoginPwd66062286';
    $key = $key === null ? Config::get('secret_key') : $key;
    $ivSize = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
    $iv = mcrypt_create_iv($ivSize, MCRYPT_RAND);
    $encryptText = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $plainText, MCRYPT_MODE_ECB, $iv);
    //return trim(base64_encode($encryptText));
    //防止URL冲突，把=删除（由于"="在base64中是用于填充的,所以直接替换成删除了）
    //return str_replace('=', '', base64_encode($encryptText));
    //url中 "+" 会自动变成空格，所有这里我用！替换+
    return str_replace(array('=', '+'), array('', '!'), base64_encode($encryptText));
}
