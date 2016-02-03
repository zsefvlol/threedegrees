
"use strict";

import React from 'react';
import { render } from 'react-dom';
import Ajax from '../lib/Ajax';
import {Button, Dialog} from 'react-weui';
const {Alert} = Dialog;

export default class Like extends React.Component {

    getIsLike = () => {
        let i_like = window.pageData.profile.i_like;
        if (!i_like) {
            return false;
        }
        for (var i in i_like) {
            let item = i_like[i];
            if (item.uid == this.props.target.uid) {
                return true;
            }
        }
        return false;
    }

    state = {
        color: '#e64340',
        liked: this.getIsLike(),
        size: 32,
        showAlert: false
    }

    setLikeData = () => {
        if (this.state.liked) {
            window.pageData.profile.i_like.push(this.props.target.user_info);
            return;
        }
        let i_like = window.pageData.profile.i_like;
        if (!i_like) {
            return false;
        }
        for (var i in i_like) {
            let item = i_like[i];
            if (item.uid == this.props.target.uid) {
                i_like.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    clickHandle = () => {
        let action = this.state.liked ? 'dislike' : 'like';
        this.setState({liked: !this.state.liked});
        Ajax.get(`/api/like/${action}/uid/${this.props.target.uid}`).end((err, res) => {
            this.setLikeData();
            this.setState({showAlert: true});
        })
    }

    hideAlert() {
        this.setState({showAlert: false});
    }

    render() {
        let path = this.state.liked ? 'M23 2c-2.404 0-4.331 0.863-6.030 2.563-0.001 0.001-0.002 0.002-0.003 0.003h-0.001l-0.966 1.217-0.966-1.143c-0.001-0.001-0.002-0.002-0.003-0.003h-0.001c-1.7-1.701-3.626-2.637-6.030-2.637s-4.664 0.936-6.364 2.636c-1.699 1.7-2.636 3.96-2.636 6.364 0 2.402 0.935 4.662 2.633 6.361l11.947 12.047c0.375 0.379 0.887 0.592 1.42 0.592s1.045-0.213 1.42-0.592l11.946-12.047c1.698-1.699 2.634-3.958 2.634-6.361s-0.937-4.664-2.636-6.364c-1.7-1.7-3.96-2.636-6.364-2.636v0z' :
                                      'M29.193 5.265c-3.629-3.596-9.432-3.671-13.191-0.288-3.76-3.383-9.561-3.308-13.192 0.288-3.741 3.704-3.741 9.709 0 13.415 1.069 1.059 11.053 10.941 11.053 10.941 1.183 1.172 3.096 1.172 4.278 0 0 0 10.932-10.822 11.053-10.941 3.742-3.706 3.742-9.711-0.001-13.415zM27.768 17.268l-11.053 10.941c-0.393 0.391-1.034 0.391-1.425 0l-11.053-10.941c-2.95-2.92-2.95-7.671 0-10.591 2.844-2.815 7.416-2.914 10.409-0.222l1.356 1.22 1.355-1.22c2.994-2.692 7.566-2.594 10.41 0.222 2.95 2.919 2.95 7.67 0.001 10.591zM9.253 7.501c0.277 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-0.001c-1.794 0-3.249 1.455-3.249 3.249v0.001c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5v0c0-2.346 1.901-4.247 4.246-4.249 0.002 0 0.002-0.001 0.004-0.001z';
        let title = this.state.liked ? '好棒' : '取消啦';
        let buttons = [{
            label: '好的',
            onClick: this.hideAlert.bind(this)
        }];
        let content = !this.state.liked ? (<p>再看看别人吧</p>) :
             (<p>和Ta聊聊吧 <br /> 微信号：{this.props.target.user_info.wechat_id}</p>);
        return (
            <div {...this.props}>
                <svg onClick={this.clickHandle} width={this.state.size} height={this.state.size} viewBox={`0 0 ${this.state.size} ${this.state.size}`}>
                    <path fill={this.state.color} d={path}></path>
                </svg>
                <Alert title={title} buttons={buttons} show={this.state.showAlert}>
                    {content}
                </Alert>
            </div>
        );
    }

}
