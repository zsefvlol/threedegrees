<?php
namespace Common\Util;
/**
 *
 * 工具类
 * @author lol
 *
 */
class ImUtil {

    /**
     * 将object递归转换为数组
     *
     * @param object $obj
     * @return array
     */
    public static function obj2array($obj) {
        $_array = is_object ( $obj ) ? get_object_vars ( $obj ) : $obj;
        foreach ( $_array as $key => $value ) {
            $value = (is_array ( $value ) || is_object ( $value )) ? self::obj2array ( $value ) : $value;
            $array [$key] = $value;
        }
        return $array;
    }
    public static function json2array($json) {
        return ImUtil::obj2array ( json_decode ( $json, true ) );
    }
    public static function utfSubstr($str, $len, $more = false) {
        if (function_exists ( 'mb_substr' )) {
            $ret = mb_substr ( $str, 0, $len, 'UTF-8' );
            if (mb_strlen ( $str ) > mb_strlen ( $ret ) && $more)
                $ret .= '...';
            return $ret;
        }

        $org = $str;
        for($i = 0; $i < $len; $i ++) {
            $temp_str = substr ( $str, 0, 1 );
            if (ord ( $temp_str ) > 127) {
                $i ++;
                if ($i < $len) {
                    $new_str [] = substr ( $str, 0, 3 );
                    $str = substr ( $str, 3 );
                }
            } else {
                $new_str [] = substr ( $str, 0, 1 );
                $str = substr ( $str, 1 );
            }
        }
        $ret = join ( $new_str );
        if (strlen ( $org ) > strlen ( $ret ) && $more)
            $ret .= '...';
        return $ret;
    }

    /**
     * 获取流逝时间字符串
     *
     * @param int $timestamp
     *            要计算的时间的时间戳
     * @param int|string $timestampNow
     *            参考时间，不传则为现在，时间戳
     * @return string
     */
    public static function getPastTimeString($timestamp, $timestampNow = '') {
        $timestampNow = $timestampNow ? $timestampNow : time ();
        $lastTime = $timestampNow - $timestamp;
        if ($lastTime < 60)
            return $lastTime . '秒前';
        $lastTime = floor ( $lastTime / 60 );
        if ($lastTime < 60)
            return $lastTime . '分钟前';
        $lastTime = floor ( $lastTime / 60 );
        if ($lastTime < 24)
            return $lastTime . '小时前';
        $lastTime = floor ( $lastTime / 24 );
        if ($lastTime < 30)
            return $lastTime . '天前';
        $lastTime = floor ( $lastTime / 30 );
        if ($lastTime < 12)
            return $lastTime . '个月前';
        $lastTime = floor ( $lastTime / 12 );
        return $lastTime . '年前';
    }

    /**
     * 快速完成一个Curl请求
     *
     * @param string $url
     * @param array $fields
     *            POST字段，传入数组
     * @param string $method
     *            = 'post'
     * @param bool $debug
     * @return string 结果
     */
    public static function curl($url, $fields = array(), $method = 'post',$debug = false) {
        $curl = curl_init ();
        curl_setopt ( $curl, CURLOPT_URL, $url );
        curl_setopt ( $curl, CURLOPT_HTTPHEADER, array (
            'Expect:'
        ) );
        curl_setopt ( $curl, CURLOPT_TIMEOUT, 60 );
        curl_setopt ( $curl, CURLOPT_MAXREDIRS, 6 );
        curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
        curl_setopt ( $curl, CURLOPT_FOLLOWLOCATION, true );
        curl_setopt ( $curl, CURLOPT_COOKIEJAR, "/tmp/curl_cookie_file" );
        curl_setopt ( $curl, CURLOPT_COOKIEFILE, "/tmp/curl_cookie_file" );
        if (strtolower ( $method ) == 'post') {
            curl_setopt ( $curl, CURLOPT_POST, true );
            curl_setopt ( $curl, CURLOPT_POSTFIELDS, http_build_query ( $fields ) );
        }
        curl_setopt ( $curl, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)' );

        $result = curl_exec ( $curl );
        if($debug){
            echo "=====post data======\r\n";
            var_dump($fields);
            echo '=====info====='."\r\n";
            print_r( curl_getinfo($curl) );
            echo '=====$response====='."\r\n";
            print_r( $result );
            echo '=====error====='."\r\n";
            echo  curl_error($curl) ;
        }
        return $result;
    }

    /**
     * 执行POST操作
     *
     * @param string $url
     * @param mix $data
     * @param mix $cookie
     * @return string
     */
    public static function doPost($url, $data, $cookie = null) {
        if (is_array ( $data )) {
            ksort ( $data );
            $data = http_build_query ( $data );
        }
        if (is_array ( $cookie )) {
            $cookie = http_build_query ( $cookie );
        }
        $opts = array (
            'http' => array (
                'method' => "POST",
                'header' => "Content-type: text/html\r\n" .
                    // "Content-length:" . strlen($data) . "\r\n" .
                    "Cookie: {$cookie}\r\n" . "\r\n",
                'content' => $data
            )
        );
        // print_r($opts);
        $cxContext = stream_context_create ( $opts );
        $sFile = file_get_contents ( $url, false, $cxContext );
        return $sFile;
    }

    /**
     * 生成随机字符串
     *
     * @param int $len
     *        	生成长度
     * @param string $type
     *        	生成类型，包括num(0-9)、char(a-z)、charnum(0-9+a-z)、all(0-9+a-z+符号)。默认为num
     * @param string $model
     *        	自定义生成字符的范围
     * @return string
     */
    public static function generateString($len, $type = 'num', $model = '') {
        $models = array (
            'num' => '0123456789',
            'char' => 'abcdefghijklmnopqrstuvwxyz',
            'all' => 'abcdefghijklmnopqrstuvwxyz0123456789_=%&*<>|',
            'char&num' => 'abcdefghijklmnopqrstuvwxyz0123456789'
        );
        if (! $model)
            $model = $models [$type];
        if (! $model || ! len)
            return false;

        $ret = '';
        for($i = 0; $i < $len; $i ++) {
            $n = mt_rand ( 0, strlen ( $model ) - 1 );
            $ret .= $model {$n};
        }
        return $ret;
    }

    /**
     * 模拟js的unescape函数
     *
     * @param unknown_type $str
     * @return Ambigous <string, unknown>
     */
    public static function unescape($str) {
        $ret = '';
        $len = strlen ( $str );

        for($i = 0; $i < $len; $i ++) {
            if ($str [$i] == '%' && $str [$i + 1] == 'u') {
                $val = hexdec ( substr ( $str, $i + 2, 4 ) );

                if ($val < 0x7f)
                    $ret .= chr ( $val );
                else if ($val < 0x800)
                    $ret .= chr ( 0xc0 | ($val >> 6) ) . chr ( 0x80 | ($val & 0x3f) );
                else
                    $ret .= chr ( 0xe0 | ($val >> 12) ) . chr ( 0x80 | (($val >> 6) & 0x3f) ) . chr ( 0x80 | ($val & 0x3f) );

                $i += 5;
            } else if ($str [$i] == '%') {
                $ret .= urldecode ( substr ( $str, $i, 3 ) );
                $i += 2;
            } else
                $ret .= $str [$i];
        }
        return $ret;
    }


}

?>