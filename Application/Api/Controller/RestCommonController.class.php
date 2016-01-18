<?php

namespace Api\Controller;
use Api\Exception\CommonException;

class RestCommonController extends RestController {

    public $uid = false;

    public function _empty(){
        $this->responseError(new CommonException('200202'));
    }
    protected function responseError(CommonException $exception){
        $this->response(array(
            'error_code'      =>  $exception->getCode(),
            'error_message'   =>  $exception->getMessage(),
            'extra'    =>  $exception->extra
        ), 'json', 200);
    }

    protected function responseSuccess($data){
        $this->response($data, 'json', 200);
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
        }elseif('php'==$type){
            $data = serialize($data);
        }// 默认直接输出
        $this->setContentType($type);
        //header('Content-Length: ' . strlen($data));
        return $data;
    }


}
