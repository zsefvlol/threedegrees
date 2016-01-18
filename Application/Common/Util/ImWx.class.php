<?php
namespace Common\Util;
/**
 * 微信API类
 * @author 梦恬
 */
class ImWx{

    private static $rawRequest;
    private static $requestArray;
    private static $requestType;
    private static $accessToken;
    private static $jsApiTicket;

    /**
     * 验证是否在微信开发模式后台环境中
     * @return bool
     */
    public static function isInWx(){
        $req = empty($GLOBALS['HTTP_RAW_POST_DATA']) ? file_get_contents('php://input') : $GLOBALS['HTTP_RAW_POST_DATA'];
        if( $_GET['signature'] && $_GET['timestamp'] && $_GET['nonce'] && $req ) return true;
        return false;
    }

    /**
     * 验证token
     * @return bool
     */
    private static function _verifyToken() {
        $signature = addslashes(htmlspecialchars($_GET['signature']));
        $timestamp = addslashes(htmlspecialchars($_GET['timestamp']));
        $nonce = addslashes(htmlspecialchars($_GET['nonce']));
        //if(strlen($nonce)<10) return true;
        $tmpArr = array(C('WX_TOKEN'), $timestamp, $nonce);
        sort($tmpArr,SORT_STRING);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);
        if ($tmpStr == $signature) return true;
        return false;
    }

    /**
     * 获取用户发送的信息
     */
    private static function _getRequest(){
        if (self::$requestArray) return;
        //验证Token
        if(!self::_verifyToken()) return;;
        //网站接入验证
        if(isset($_GET['echostr'])) exit($_GET['echostr']);
        self::$rawRequest = empty($GLOBALS['HTTP_RAW_POST_DATA']) ? file_get_contents('php://input') : $GLOBALS['HTTP_RAW_POST_DATA'];
        if (!empty(self::$rawRequest)) {
            self::$requestArray = ImUtil::obj2array(simplexml_load_string(self::$rawRequest, 'SimpleXMLElement', LIBXML_NOCDATA));
            self::$requestType = self::$requestArray['MsgType'];
        }
    }

    /**
     * 获取格式化为数组的用户发送的信息
     * @return array
     */
    public static function getRequest(){
        self::_getRequest();
        return self::$requestArray;
    }

    /**
     * 更改信息内容，用于hack
     * @param $key
     * @param $value
     */
    public static function setRequest($key,$value){
        self::_getRequest();
        if ($key == 'MsgType') self::$requestType = $value;
        self::$requestArray[$key] = $value;
    }

    /**
     * 获取原始信息，XML格式
     * @return string as xml
     */
    public static function getRawRequest(){
        self::_getRequest();
        return self::$rawRequest;
    }

    /**
     * 自动回复
     * @param array $config
     * $config =
     * array(
     * array(
     * 'keyWords'        =>    array('1','wz','文字'),
     * 'replyType'        =>    'text',//text,news,music
     * 'replyContent'    =>    array('content'    =>    '回复文字信息'),
     * ),
     * array(
     * 'keyWords'        =>    array('2','yy','音乐'),
     * 'replyType'        =>    'music',//text,news,music
     * 'replyContent'    =>    array(
     * 'title'    =>    '音乐标题',
     * 'description'    =>    '音乐介绍',
     * 'musicUrl'    =>    'http://music.baidu.com',
     * 'HQMusicUrl'    =>    'http://music.baidu.com'),
     * ),
     * array(
     * 'keyWords'        =>    array('3','xw','新闻'),
     * 'replyType'        =>    'news',//text,news,music
     * 'replyContent'    =>    array(
     * 'newsArr'    =>    array(
     * array('title'    =>    '单条新闻')
     * ))
     * )
     * );
     * @return bool
     */
    public static function autoReply($config){
        $request = self::getRequest();
        if ($request['MsgType'] != 'text') return false;
        $keyWord = strtolower(trim($request['Content']));
        foreach ($config as $k=>$v){
            if (in_array($keyWord, $v['keyWords'])) {
                switch ($v['replyType']){
                    case 'text' :
                        self::fetchTextResult($v['replyContent']['content']);
                        break;
                    case 'news':
                        self::fetchNewsResult($v['replyContent']['newsArr']);
                        break;
                    case 'music':
                        self::fetchMusicResult($v['replyContent']['title'],
                            $v['replyContent']['description'],
                            $v['replyContent']['musicUrl'],
                            $v['replyContent']['HQMusicUrl']);
                        break;
                    case 'function' :
                        call_user_func_array($v['replyContent']['function'], $v['replyContent']['para']);
                        break;
                    case 'method' :
                        call_user_func_array(array($v['replyContent']['object'],$v['replyContent']['function']),  $v['replyContent']['para']);
                        break;
                    default: return false;
                }
            }
        }
        return false;
    }

    /**
     * 获取用户发送信息的类型
     * @return string "news","text","link","image","location","event"
     */
    public static function getRequestType(){
        self::_getRequest();
        return self::$requestArray["MsgType"];
    }


    /**
     * 获取用户微信ID（非用户注册ID）
     * @return string
     */
    public static function getRequestUserId(){
        self::_getRequest();
        return self::$requestArray["FromUserName"];
    }

    /**
     * 返回纯文字消息
     * @param string $content 文本内容
     * @param bool $fetch 是否直接输出
     * @param int $flag 是否星标（1是0否）
     * @return string
     */
    public static function fetchTextResult($content,$fetch=true,$flag=0){
        $xmlResult = '<Content><![CDATA[' . $content . ']]></Content>';
        return self::_getXmlResult('text', $xmlResult, $fetch, $flag);
    }

    /**
     * 返回图文混排消息
     * @param array $newsArr 图文混排消息内容，，至少一条，如：
     * array(
     * 	  array(
     *      'title'			=> '标题',
     *      'description'	=> '详细信息',//只有单条的混排消息才会显示
     *      'picUrl'		=> '图片URL'，支持JPG、PNG格式，较好的效果为大图640*320，小图80*80
     *      'url'			=> '链接地址'
     *    )
     *    ...
     * )
     * @param bool $fetch 是否直接输出
     * @param int $flag 是否星标（1是0否）
     * @return string
     */
    public static function fetchNewsResult($newsArr,$fetch=true,$flag=0){
        $xmlResult = '<ArticleCount>' . count($newsArr) . '</ArticleCount>
<Articles>';
        foreach ($newsArr as $key=>$value) {
            $xmlResult .= '
<item>
<Title><![CDATA[' . ($value['title'] ? $value['title'] : '') . ']]></Title>
<Description><![CDATA[' . ($value['description'] ? $value['description'] : '') . ']]></Description>
<PicUrl><![CDATA[' . ($value['picUrl'] ? $value['picUrl'] : '') . ']]></PicUrl>
<Url><![CDATA[' . ($value['url'] ? $value['url'] : '') . ']]></Url>
</item>';
        }

        $xmlResult .= '
</Articles>';
        return self::_getXmlResult('news', $xmlResult, $fetch, $flag);
    }

    /**
     * 返回音乐消息
     * @param string $title 标题
     * @param string $description 介绍
     * @param string $musicUrl 音乐链接
     * @param string $HQMusicUrl 高品质音乐链接（wifi默认播放这个）
     * @param bool $fetch 是否直接输出
     * @param int $flag 是否星标（1是0否）
     * @return string
     */
    public static function fetchMusicResult($title,$description,$musicUrl,$HQMusicUrl,$fetch=true,$flag=0){
        $xmlResult = '<Music>
<Title><![CDATA[' . $title . ']]></Title>
<Description><![CDATA[' . $description . ']]></Description>
<MusicUrl><![CDATA[' . $musicUrl . ']]></MusicUrl>
<HQMusicUrl><![CDATA[' . $HQMusicUrl . ']]></HQMusicUrl>
</Music>';
        return self::_getXmlResult('music', $xmlResult, $fetch, $flag);
    }

    /**
     * 输出xml结果
     * @param $msgType
     * @param $content
     * @param bool $fetch
     * @param int $flag
     * @return String - $xmlResult
     */
    private static function _getXmlResult($msgType,$content,$fetch=true,$flag=0) {
        $request = self::getRequest();
        $xmlResult = '<xml>
<ToUserName><![CDATA[' . $request["FromUserName"] . ']]></ToUserName>
<FromUserName><![CDATA[' . $request["ToUserName"] . ']]></FromUserName>
<CreateTime>' . time() . '</CreateTime>
<MsgType><![CDATA[' . $msgType . ']]></MsgType>
'.$content.'
<FuncFlag>'.$flag.'</FuncFlag>
</xml>';
        if ($fetch) exit($xmlResult);
        return $xmlResult;
    }

    private static $baseUrl = 'https://api.weixin.qq.com/cgi-bin/';

    /**
     * @param bool $forceRefresh
     * @return bool
     */
    public static function getAccessToken($forceRefresh = false){
        if(self::$accessToken) return self::$accessToken;

        $savedToken = ImSetting::get('WX_API_ACCESSTOKEN');
        if($savedToken['token'] && time() < ($savedToken['expire'] - 60) && !$forceRefresh){
            return $savedToken['token'];
        }

        $appid = C('WX_APP_ID');
        $appSecret = C('WX_APP_SECRET');
        if(!$appid || !$appSecret) return false;
        $result = json_decode(file_get_contents(self::$baseUrl . 'token?grant_type=client_credential&appid='.$appid.'&secret=' . $appSecret),true);

        if($result['errcode']){
            $_SESSION['SNS_API_ERROR'] = json_encode($result);
            return false;
        }

        ImSetting::set('WX_API_ACCESSTOKEN','token',$result['access_token']);
        ImSetting::set('WX_API_ACCESSTOKEN','expire',$result['expires_in'] + time());

        self::$accessToken = $result['access_token'];
        return self::$accessToken;
    }

    public static function getWechatIpList(){
        return array("101.226.62.77","101.226.62.78","101.226.62.79","101.226.62.80","101.226.62.81","101.226.62.82","101.226.62.83","101.226.62.84","101.226.62.85","101.226.62.86","101.226.103.59","101.226.103.60","101.226.103.61","101.226.103.62","101.226.103.63","101.226.103.69","101.226.103.70","101.226.103.71","101.226.103.72","101.226.103.73","140.207.54.73","140.207.54.74","140.207.54.75","140.207.54.76","140.207.54.77","140.207.54.78","140.207.54.79","140.207.54.80","182.254.11.203","182.254.11.202","182.254.11.201","182.254.11.200","182.254.11.199","182.254.11.198");
    }


    /**
     * 发送文字服务信息
     * @param $wxId
     * @param $content
     * @return string
     */
    public static function pushTextMessage($wxId,$content){
        return self::_pushMessage(array(
            "touser"    =>  $wxId,
            "msgtype"   => "text",
            "text"      =>  array(
                'content'   =>  $content
            )
        ));
    }

    /**
     * 发送图片消息
     * @param $wxId
     * @param $mediaId
     * @return string
     */
    public static function pushImageMessage($wxId,$mediaId){
        return self::_pushMessage(array(
            "touser"    =>  $wxId,
            "msgtype"   => "image",
            "image"      =>  array(
                'media_id'   =>  $mediaId
            )
        ));
    }

    /**
     * 发送语音消息
     * @param $wxId
     * @param $mediaId
     * @return string
     */
    public static function pushVoiceMessage($wxId,$mediaId){
        return self::_pushMessage(array(
            "touser"    =>  $wxId,
            "msgtype"   => "voice",
            "voice"      =>  array(
                'media_id'   =>  $mediaId
            )
        ));
    }

    /**
     * 发送视频消息
     * @param $wxId
     * @param $mediaId
     * @param $thumbMediaId
     * @return string
     */
    public static function pushVideoMessage($wxId,$mediaId,$thumbMediaId){
        return self::_pushMessage(array(
            "touser"    =>  $wxId,
            "msgtype"   => "video",
            "video"      =>  array(
                'media_id'          =>  $mediaId,
                'thumb_media_id'    =>  $thumbMediaId
            )
        ));
    }

    /**
     * 发送音乐消息
     * @param $wxId
     * @param $title
     * @param $description
     * @param $musicurl
     * @param $hqmusicurl
     * @param $thumb_media_id
     * @return string
     */
    public static function pushMusicMessage($wxId,$title,$description,$musicurl,$hqmusicurl,$thumb_media_id){
        return self::_pushMessage(array(
            "touser"    =>  $wxId,
            "msgtype"   => "music",
            "music"      =>  array(
                'title'          =>  $title,
                'description'    =>  $description,
                'musicurl'       =>  $musicurl,
                'hqmusicurl'     =>  $hqmusicurl,
                'thumb_media_id' =>  $thumb_media_id
            )
        ));
    }

    /**
     * 发送新闻消息
     * @param $wxId
     * @param $newsArr
     * array(
     *      array(
     *      'title'            => '标题',
     *      'description'    => '详细信息',//只有单条的混排消息才会显示
     *      'picurl'        => '图片URL'，支持JPG、PNG格式，较好的效果为大图640*320，小图80*80
     *      'url'            => '链接地址'
     *    )
     *    ...
     * )
     * @return string
     */
    public static function pushNewsMessage($wxId,$newsArr){
        return self::_pushMessage(array(
            "touser"    =>  $wxId,
            "msgtype"   => "news",
            "news"      =>  array(
                'articles'          =>  $newsArr
            )));
    }

    private static function _pushMessage($rawContent){
        return ImUtil::doPost( self::$baseUrl . 'message/custom/send?access_token=' . self::getAccessToken() , json_encode($rawContent,JSON_UNESCAPED_UNICODE));

    }

    /**
     * 获取用户信息
     * @param $wxId
     * @return mixed
     */
    public static function getUserInfo($wxId){
        if(!self::getAccessToken()) return array();
        return json_decode(file_get_contents(self::$baseUrl . 'user/info?access_token=' . self::getAccessToken() . '&openid=' . $wxId),true);
    }

    /**
     * 获取关注者列表
     * @param string $nextWxId
     * @return mixed
     */
    public static function getFollower($nextWxId = ''){
        $nextQuery = $nextWxId ?  '&next_openid=' . $nextWxId : '';
        return json_decode(file_get_contents(self::$baseUrl . 'user/get?access_token=' . self::getAccessToken() .$nextQuery),true);
    }

    public static function getTempQRcode($sceneId, $expire = 604800){
        if($expire > 604800) $expire = 604800;
        return self::_getQRCode('{"expire_seconds": '. $expire .', "action_name": "QR_SCENE", "action_info": {"scene": {"scene_id": '.$sceneId.'}}}');
    }

    public static function getPermernentQRCode($sceneId){
        if($sceneId > 100000) $sceneId = 100000;
        return self::_getQRCode('{"action_name": "QR_LIMIT_SCENE", "action_info": {"scene": {"scene_id": '.$sceneId.'}}}');
    }

    public static function getPermernentQRCodeByString($sceneId_string){
        return self::_getQRCode('{"action_name": "QR_LIMIT_SCENE", "action_info": {"scene": {"scene_id": '.$sceneId_string.'}}}');
    }

    private static function _getQRCode($query){
        $result = json_decode(ImUtil::doPost( self::$baseUrl . 'qrcode/create?access_token=' . self::getAccessToken() , $query),true);
        if($result['errcode']){
            $_SESSION['SNS_API_ERROR'] = json_encode($result);
            return false;
        }

        return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' . $result['ticket'];

    }

    public static function downloadMedia($mediaId,$urlOnly = false){
        $url = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token='.self::getAccessToken().'&media_id=' . $mediaId;
        if($urlOnly) return $url;
        return file_get_contents($url);
    }

    public static function getJsApiTicket($forceRefresh = false) {
        if(self::$jsApiTicket) return self::$jsApiTicket;

        $savedToken = ImSetting::get('WX_JS_API_TICKET');
        if($savedToken['token'] && time() < ($savedToken['expire'] - 60) && !$forceRefresh){
            return $savedToken['token'];
        }

        $result = json_decode(file_get_contents(self::$baseUrl . 'ticket/getticket?type=jsapi&access_token=' . self::getAccessToken()),true);

        if($result['errcode']){
            $_SESSION['SNS_API_ERROR'] = json_encode($result);
            return false;
        }

        ImSetting::set('WX_JS_API_TICKET','token',$result['ticket']);
        ImSetting::set('WX_JS_API_TICKET','expire',$result['expires_in'] + time());

        self::$jsApiTicket = $result['ticket'];
        return self::$jsApiTicket;
    }

    public static function getSignPackage($url) {
        $url = $url ? $url : $_SERVER["HTTP_REFERER"];
        $jsapiTicket = self::getJsApiTicket();
        $timestamp = time();
        $nonceStr = self::createNonceStr();

        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

        $signature = sha1($string);

        $signPackage = array(
            "appId"     => C('WX_APP_ID'),
            "nonceStr"  => $nonceStr,
            "timestamp" => $timestamp,
            "url"       => $url,
            "signature" => $signature,
            "rawString" => $string
        );
        return $signPackage;
    }

    private static function createNonceStr($length = 16) {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }

}