<?php
//todo:尚未测试调通
//参考：http://www.juyimeng.com/2-ways-of-php-simulator-post-request.html
$post_data = array();
$post_data['submit'] = "submit";
$url='http://api.huitouke.cn/trade';

$sbs_id="103288888888888";
$card_no="1086103200010020";//"1086103200010020";

$key = "9B52F2FA6E02E8EA";//0123456789ABCDEF
$password="111111";//"123456";
$password=RC4::encrypt($key,$password);
$length=strlen($password);
//echo $length;
$cipher='';
for ($i = 0; $i<$length; $i++){
    $cipher.=sprintf('%02s',dechex(ord($password[$i])));
}
$password=$cipher;
//echo $password;
//die();
$tm = time();//"1362646179";
$saving_sub = "0";
$cash = "1";
$bank_amount = "0";
$point_sub = "0";
$order_number = "000100020003";
$store_id = "10321001";

$sign=md5($sbs_id.$card_no.$password.$saving_sub.$cash.$bank_amount.$point_sub.$order_number.$store_id.$tm."69f92d81117dc6b7ef52981a96367297");

$post_fields=array(
    "sbs_id"=>urlencode($sbs_id),
    "card_no"=>urlencode($card_no),
    "password"=>urlencode($password),
    "saving_sub"=>urlencode($saving_sub),
    "cash"=>urlencode($cash),
    "bank_amount"=>urlencode($bank_amount),
    "point_sub"=>urlencode($point_sub),
    "order_number"=>urlencode($order_number),
    "store_id"=>urlencode($store_id),
    "t"=>urlencode($tm),
    "sign"=>urlencode($sign)
);

$post_data="";
foreach ($post_fields as $name=>$value) {
    $post_data.=$name."=".$value."&";
}
$post_data=rtrim($post_data ,'&');
// $post_data="?sbs_id=$sbs_id&card_no=$card_no&password=$password&saving_sub＝$saving_sub&cash＝$cash&bank_amount＝$bank_amount
// &point_sub＝$point_sub&order_number＝$order_number&store_id=$store_id&t=$tm&sign=$sign";
echo $post_data;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_POST, count($post_fields));
//为了支持cookie
// curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookie.txt');
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
$result = curl_exec($ch);
echo "<br/>";
echo $result;

/**
 * Class RC4
 *
 * Implements the encrypt algorithm RC4.
 *
 * @category Crypt
 * @author   Rafael M. Salvioni
 * @see      http://pt.wikipedia.org/wiki/RC4
 */
class RC4
{
    /**
     * Store the permutation vectors
     *
     * @var array
     */
    private static $S = array();

    /**
     * Swaps values on the permutation vector.
     *
     * @param int $v1 Value 1
     * @param int $v2 Value 2
     */
    private static function swap(&$v1, &$v2)
    {
        $v1 = $v1 ^ $v2;
        $v2 = $v1 ^ $v2;
        $v1 = $v1 ^ $v2;
    }

    /**
     * Make, store and returns the permutation vector about the key.
     *
     * @param string $key Key
     * @return array
     */
    private static function KSA($key)
    {
        $idx = crc32($key);
        if (!isset(self::$S[$idx])) {
            $S   = range(0, 255);
            $j   = 0;
            $n   = strlen($key);
            for ($i = 0; $i < 255; $i++) {
                $char  = ord($key{$i % $n});
                $j     = ($j + $S[$i] + $char) % 256;
                self::swap($S[$i], $S[$j]);
            }
            self::$S[$idx] = $S;
        }
        return self::$S[$idx];
    }

    /**
     * Encrypt the data.
     *
     * @param string $key Key
     * @param string $data Data string
     * @return string
     */
    public static function encrypt($key, $data)
    {
        $S    = self::KSA($key);
        $n    = strlen($data);
        $i    = $j = 0;
        $data = str_split($data, 1);
        for ($m = 0; $m < $n; $m++) {
            $i        = ($i + 1) % 256;
            $j        = ($j + $S[$i]) % 256;
            self::swap($S[$i], $S[$j]);
            $char     = ord($data{$m});
            $char     = $S[($S[$i] + $S[$j]) % 256] ^ $char;
            $data[$m] = chr($char);
        }
        $data = implode('', $data);
        return $data;
    }

    /**
     * Decrypts the data.
     *
     * @param string $key Key
     * @param string $data Encripted data
     * @return string
     */
    public static function decrypt($key, $data)
    {
        return self::encrypt($key, $data);
    }
}
?>