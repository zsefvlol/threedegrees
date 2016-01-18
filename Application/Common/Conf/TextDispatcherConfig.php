<?php
use Common\Util\ImWxTextDispatcher;

return array(

    array(
        'functionType'	=>	ImWxTextDispatcher::$FUNC_TYPE_REGX,
        //指定正则表达式，使用preg_match()检测。匹配成功后直接将文字全部内容转发到对应静态方法
        'pattern'     =>  '/\d{8}/',
        'dispatchTo'	=>	array('Api\Util\WxHandler','handleCode')
    ),

);