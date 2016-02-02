<?php

namespace Common\Util;

class Degree{

    private static $MAX_DEGREE = 5;

    public static function getDegreeByUid($uid){
        $zero_degree_uid = self::getZeroDegreeUser();
        if($uid == $zero_degree_uid) return 0;
        $degree = 0;
        while($degree ++ < self::$MAX_DEGREE){
            $uid = D('InviteCode')->where(array('to_uid'=>$uid))->getField('from_uid');
            if($uid == $zero_degree_uid) break;
        }
        return $degree;
    }

    public static function getZeroDegreeUser(){
        return C('ZERO_DEGREE_UID');
    }

    //获得关系线
    public static function getRelationText($from, $to){
        $zero_degree_uid = self::getZeroDegreeUser();
        $from_relation_list = array($from);
        $to_relation_list = array($to);
        $degree = 0;
        while($from_relation_list[0] != $zero_degree_uid && $degree++ < self::$MAX_DEGREE){
            $uid = D('InviteCode')->where(array('to_uid'=>$from_relation_list[0]))->getField('from_uid');
            array_unshift($from_relation_list, $uid);
        }
        $degree = 0;
        while($to_relation_list[0] != $zero_degree_uid && $degree++ < self::$MAX_DEGREE){
            $uid = D('InviteCode')->where(array('to_uid'=>$to_relation_list[0]))->getField('from_uid');
            array_unshift($to_relation_list, $uid);
        }
        array_shift($from_relation_list);
        array_shift($to_relation_list);
        $user_info_result = D('UserInfo')->where(array(
            'uid'=>array('in',array_merge($from_relation_list, $to_relation_list))
        ))->field('uid,truename,relation')->select();
        $user_info = array();
        foreach ($user_info_result as $user)
            $user_info[$user['uid']] = $user;

        $result = array();
        foreach($from_relation_list as $uid) $result[] = $user_info[$uid]['truename'] . '('
            . $user_info[$uid]['relation'] . ')';
        $result[] = '小温';
        foreach($to_relation_list as $uid) $result[] = $user_info[$uid]['truename'] . '('
            . $user_info[$uid]['relation'] . ')';
        return $result;

//        $result = array();
//        foreach($from_relation_list as $uid) $result[0][] = $user_info[$uid]['truename'] . '('
//            . $user_info[$uid]['relation'] . ')';
//        foreach($to_relation_list as $uid) $result[1][] = $user_info[$uid]['truename'] . '('
//            . $user_info[$uid]['relation'] . ')';
//
//        return $result;

//        $text = '小温';
//        foreach($from_relation_list as $uid) $text = $user_info[$uid]['truename'] . '('
//            . $user_info[$uid]['relation'] . ')=>' . $text;
//        foreach($to_relation_list as $uid) $text = $text . '<=(' . $user_info[$uid]['relation'] . ')'
//            . $user_info[$uid]['truename'];

//        return $text;
    }

}