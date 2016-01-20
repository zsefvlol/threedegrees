<?php

namespace Api\Controller;
use Api\Exception\CommonException;

class RestCommonController extends RestController {

    // REST允许请求的资源类型列表
    protected   $allowType      =   array('xml','json');
    // 默认的资源类型
    protected   $defaultType    =   'json';
    // REST允许输出的资源类型列表
    protected   $allowOutputType=   array(
        'xml' => 'application/xml',
        'json' => 'application/json',
    );

    public $uid = false;

    public function _empty(){
        $this->responseError(new CommonException('200202'));
    }
    protected function responseError(CommonException $exception){
        $this->response(array(
            'error_code'      =>  $exception->getCode(),
            'error_message'   =>  $exception->getMessage(),
            'extra'    =>  $exception->extra,
            'data'    =>  ''
        ), $this->_type, 200);
    }

    protected function responseSuccess($data){
        $this->response(array(
            'error_code'      =>  0,
            'error_message'   =>  '',
            'extra'    =>  '',
            'data'  =>  $data
        ), $this->_type, 200);
    }

    public function _initialize(){
        $this->uid = D('User')->where(array('openid'=>cookie('wechat_id')))->getField('uid');
    }


    /**
     * 编码数据
     * @access protected
     * @param mixed $data 要返回的数据
     * @param String $type 返回类型 JSON XML
     * @return string
     */
    protected function encodeData($data,$type='') {
        if('json' == $type) {
            // 返回JSON数据格式到客户端 包含状态信息
            $data = json_encode($data);
            if(I('get.jsonpcallback'))
                $data = I('get.jsonpcallback').'('.$data . ')';
            if(I('get.fileiframetransport',''))
                $data = I('get.jsonpcallback').'<textarea data-type="application/json">'."\n".$data ."\n". '</textarea>';
        }elseif('xml' == $type){
            // 返回xml格式数据
            $data = xml_encode($data);
//        }elseif('php'==$type){
//            $data = serialize($data);
        }// 默认直接输出
        $this->setContentType($type);
        //header('Content-Length: ' . strlen($data));
        return $data;
    }

    /**
     * 魔术方法 有不存在的操作的时候执行
     * @access public
     * @param string $method 方法名
     * @param array $args 参数
     * @return mixed
     */
    public function __call($method,$args) {
        // fix xxx.json can not get right function. by mengtian
        if(strpos($method, '.') !== false){
            $method = substr($method, 0, strpos($method, '.'));
            $ACTION_NAME_FIX = substr(ACTION_NAME, 0, strpos(ACTION_NAME, '.'));
        }else{
            $ACTION_NAME_FIX = ACTION_NAME;
        }
        if( 0 === strcasecmp($method,$ACTION_NAME_FIX.C('ACTION_SUFFIX'))) {
            if(method_exists($this,$method.'_'.$this->_method.'_'.$this->_type)) { // RESTFul方法支持
                $fun  =  $method.'_'.$this->_method.'_'.$this->_type;
                $this->$fun();
            }elseif(method_exists($this,$method.'_'.$this->_type) ){
                $fun  =  $method.'_'.$this->_type;
                $this->$fun();
            }elseif(method_exists($this,$method.'_'.$this->_method) ){
                $fun  =  $method.'_'.$this->_method;
                $this->$fun();
            }elseif(method_exists($this,'_empty')) {
                // 如果定义了_empty操作 则调用
                $this->_empty($method,$args);
            }elseif(file_exists_case($this->view->parseTemplate())){
                // 检查是否存在默认模版 如果有直接输出模版
                $this->display();
            }else{
                E(L('_ERROR_ACTION_').':'.ACTION_NAME);
            }
        }
    }

}
