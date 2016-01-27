<?php
namespace Api\Controller;

use Api\Exception\CommonException;
use Common\Util\Degree;
use Common\Util\Privilege;

class LikeController extends RestCommonController {

    public function like_get(){
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $uid = I('get.uid', 0, 'intval');
        if(!$uid || $uid == $this->uid) $this->responseError(new CommonException('200201'));

        $user_infos = Privilege::canIntereact($this->uid, $uid);
        //除了权限还要判断是否是介绍人，介绍人身份无法给其他人点赞
        if(!$user_infos || $user_infos[0]['user_info']['is_single'] != 1)
            $this->responseError(new CommonException('200101'));

        $exist = D('Like')->where(array(
            'from_uid'  =>  $this->uid,
            'to_uid'    =>  $uid
        ))->find();

        if($exist){
            D('Like')->where(array(
                'from_uid'  =>  $this->uid,
                'to_uid'    =>  $uid
            ))->save(array(
                'like_status'   =>  1,
                'like_time' => time()
            ));
        }
        else{
            D('Like')->add(array(
                'from_uid'  =>  $this->uid,
                'to_uid'    =>  $uid,
                'like_status'   =>  1,
                'like_time' => time()
            ));
        }

        $this->responseSuccess(array('result'=>1));

    }

    public function dislike_get(){
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $uid = I('get.uid', 0, 'intval');
        if(!$uid || $uid == $this->uid) $this->responseError(new CommonException('200201'));

        $user_infos = Privilege::canIntereact($this->uid, $uid);

        //除了权限还要判断是否是介绍人，介绍人身份无法给其他人点赞
        if(!$user_infos || $user_infos[0]['user_info']['is_single'] != 1)
            $this->responseError(new CommonException('200101'));

        D('Like')->where(array(
            'from_uid'  =>  $this->uid,
            'to_uid'    =>  $uid
        ))->save(array(
            'like_status'   =>  0,
            'like_time' => time()
        ));

        $this->responseSuccess(array('result'=>1));
    }


}
