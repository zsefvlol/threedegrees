<?php

namespace Common\Util;

class Privilege{

    public static function canIntereact($fromUid, $toUid){
        $fromUser = self::isValidUser($fromUid);
        if(!$fromUser) return false;
        //介绍人身份
        if($fromUser['user_info']['is_single'] == 0){
            //只能访问自己邀请的人的信息
            $invites = D('InviteCode')->where(array('from_uid'=>$fromUid))->select();
            $inviteUids = array();
            foreach ($invites as $value)
                if($value['to_uid'])
                    $inviteUids[] = $value['to_uid'];
            if(!in_array($toUid, $inviteUids))
                return false;
        }

        $toUser = D('User')->where(array('verified'=>1))->find($toUid);
        //不允许访问错误的uid，或者未认证的uid
        if(!$toUser) return false;
        $toUser['user_info'] = D('UserInfo')->where(array('uid'=>$toUid))->find();
        if(!$toUser['user_info']){
            D('User')->createUserInfoItem($toUid);
            $toUser['user_info'] = D('UserInfo')->where(array('uid'=>$toUid))->find();
        }
        //不允许访问介绍人或未选身份人的信息
        if($toUser['user_info']['is_single'] != 1) return false;
        return array($fromUser, $toUser);
    }

    public static function isValidUser($uid){
        $fromUser = D('User')->find($uid);
        //非验证用户无法访问
        if($fromUser['verified'] != 1) return false;
        $fromUserInfo = D('UserInfo')->find($uid);
        //未选择身份无法访问
        if($fromUserInfo['is_single'] == -1) return false;
        $fromUser['user_info'] = $fromUserInfo;
        return $fromUser;
    }

}