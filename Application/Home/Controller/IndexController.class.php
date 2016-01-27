<?php
namespace Home\Controller;

use Think\Controller;

class IndexController extends Controller {

    public function _empty(){
        exit();
    }

    public function error(){
        $this->display();
    }

    public function term(){
        $this->display();
    }

    public function index(){
        cookie('wechat_id', 'o0-6is-a4s2ASj6xz25z7BPdxONY');
        // if(!$this->_is_wechat() || !cookie('wechat_id')){
        //     $this->redirect('index/error');
        //     exit();
        // }
        $this->display();
    }

    private function _is_wechat(){
        $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
        if(strpos($ua, 'micromessenger') !== false) return true;
        return false;
    }

    public function wechat_entrance(){
        cookie('wechat_id', $_GET['wechat_id']);
        $this->redirect('index/index');
    }

}
