<?php
namespace Common\Util;
class ImWxTextDispatcher{

    static private $config;
    static public $FUNC_TYPE_FIXED = 1;
    static public $FUNC_TYPE_NO_ARGS = 2;
    static public $FUNC_TYPE_SPLIT_ARGS = 3;
    static public $FUNC_TYPE_REGX = 4;

    //无需修改
    static public $CURRENT_SPLIT_CHAR = ' ';

    static function dispatch($content){
        $config = self::getConfig();
        foreach ($config as $v){
            switch ($v['functionType']){
                case self::$FUNC_TYPE_NO_ARGS:
                    if (in_array(strtolower($content),$v['functionName']))
                        call_user_func(array($v['dispatchTo'][0],$v['dispatchTo'][1]));
                    break;
                case self::$FUNC_TYPE_SPLIT_ARGS:
                    //过滤掉多余的分隔符
                    self::$CURRENT_SPLIT_CHAR = $v['splitChar'];
                    $arrs = array_filter(explode($v['splitChar'], $content),function($arr){
                        return $arr != ImWxTextDispatcher::$CURRENT_SPLIT_CHAR;
                    });
                    if (in_array(strtolower(array_shift($arrs)), $v['functionName']))
                        call_user_func_array(array($v['dispatchTo'][0],$v['dispatchTo'][1]), $arrs);
                    break;
                case self::$FUNC_TYPE_FIXED:
                    if (in_array(strtolower($content), $v['functionName'])) {
                        switch ($v['replyType']){
                            case 'text' :
                                ImWx::fetchTextResult($v['replyContent']['content']);
                                break;
                            case 'news':
                                ImWx::fetchNewsResult($v['replyContent']['newsArr']);
                                break;
                            case 'music':
                                ImWx::fetchMusicResult($v['replyContent']['title'],
                                    $v['replyContent']['description'],
                                    $v['replyContent']['musicUrl'],
                                    $v['replyContent']['HQMusicUrl']);
                                break;
                            default: return false;
                        }
                    }
                    break;
                case self::$FUNC_TYPE_REGX:
                    if(preg_match($v['pattern'],$content)){
                        call_user_func(array($v['dispatchTo'][0],$v['dispatchTo'][1]), $content);
                    }
                    break;
                //其他类型可以在这里指定，并配合TextDespatcherConfig.php
                default:
                    break;
            }
        }
        //不匹配时返回的内容
        return false;
    }

    static function setConfig($configArray = array()){
        if (!$configArray)
            $configArray = require_once dirname(__FILE__) .'/../Conf/TextDispatcherConfig.php';
        self::$config = $configArray;
    }

    static function getConfig(){
        if (!self::$config) self::setConfig();
        return self::$config;
    }

}