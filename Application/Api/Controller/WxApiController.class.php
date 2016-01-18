<?php
namespace Api\Controller;
use Api\Exception\CommonException;
use Common\Util\ImWx;
use Common\Util\ImWxTextDispatcher;

class WxApiController extends RestCommonController
{

    /**
     * api入口
     */
    public function api(){
        D('User')->getUserFromOpenId(ImWx::getRequestUserId());
        switch (ImWx::getRequestType()){
            case 'text':
                $this->_handleTextMessage();
                break;
            case 'event':
                $this->_handleEventMessage();
                break;
            case 'image':
            case 'link':
            case 'location':
            case 'voice':
                ImWx::fetchTextResult('……');
                break;
        }
        $this->responseError(new CommonException('200202'));
    }


    //处理文字信息
    private function _handleTextMessage(){
        $message = ImWx::getRequest();
        ImWxTextDispatcher::dispatch(trim($message['Content']));
    }

    //处理事件消息
    private function _handleEventMessage(){
        $message = ImWx::getRequest();
        switch(strtoupper($message['Event'])){
            case 'CLICK':
                //菜单消息的EventKey当做TextDispatcherConfig中的文字内容，通过TextDispatcher转发
                ImWx::setRequest('MsgType', 'text');
                ImWx::setRequest('Content', $message['EventKey']);
                ImWxTextDispatcher::dispatch($message['EventKey']);
                ImWx::fetchTextResult($this->_getTestText());
                break;
            case 'SUBSCRIBE':
                if($message['EventKey']){
                    //处理未关注时扫描的带参数二维码
                }
                //处理订阅事件
                ImWx::fetchTextResult('欢迎关注，请输入您的邀请码');
                break;
            case 'UNSUBSCRIBE':
                //处理取消订阅事件
                break;
            case 'SCAN':
                //处理已关注时扫描的带参数二维码
                break;
            case 'LOCATION':
                //处理上报的地理位置信息
                break;
        }
        //全部不匹配的时候返回的内容
        ImWx::fetchTextResult('……');
    }

    public function get_sign_package(){
        $this->responseSuccess(ImWx::getSignPackage($_REQUEST['url']));
    }

}
?>