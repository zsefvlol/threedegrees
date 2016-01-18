<?php
namespace Api\Exception;

class CommonException extends \Exception{

    public $extra;

    private $_errorCodes = array(

        //200000 Applications level error.

        //200100 Access error.
        '200101'    =>  '您被禁止访问这个资源',
        '200102'    =>  '您尚未登录',
        '200103'    =>  '用户不存在',

        //200200 Request error.
        '200201'    =>  '缺少字段或字段格式错误',
        '200202'    =>  '请求的方法不存在',

        //200300 File error.
        '200301'    =>  '文件上传失败',

    );

    public function __construct($code, $extra = array()){
        $this->extra = $extra;
        parent::__construct($this->_errorCodes[$code], $code);
    }

}