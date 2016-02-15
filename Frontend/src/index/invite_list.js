
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeUI from 'react-weui';
import Ajax from '../lib/Ajax';
const {Cells, CellsTitle, CellBody, Cell, Button, CellFooter} = WeUI;

export default class InviteList extends React.Component {

    state = {
        invite_list : this.props.user_info.invite_list,
        allow_invite_count: this.props.user_info.allow_invite_count,
        button_enable: this.props.user_info.allow_invite_count - this.props.user_info.invite_list.length > 0
    };

    generateInviteCode(){
        this.setState({
            button_enable: false
        });
        Ajax.get('/api/user/generate_code').end((err, res) => {
            var invite_list = this.state.invite_list;
            var allow_invite_count = this.state.allow_invite_count;
            if(res.body.error_code == 0){
                invite_list.push({
                    'code': res.body.data.code,
                    'truename': '',
                    'invite_id': parseInt(1000+Math.random() * 1000)
                })
            }
            this.setState({
                invite_list: invite_list,
                allow_invite_count: allow_invite_count,
                button_enable: true
            });
        })
    }

    render() {
        class InviteLinkItem extends React.Component{
            handleInviteClick(e){
                console.log(this.state);
                window.location.hash = '#/user/'+this.state.code.to_uid;
            }
            state = {
                code : this.props.code
            };
            render(){
                return this.state.code.to_uid > 0 && this.state.code.is_single == 1?(
                    <p className="desc" onClick={this.handleInviteClick.bind(this)}>{this.state.code.truename} ></p>
                ):(
                    <p className="desc">{this.state.code.truename}</p>
                );
            }
        }
        let lists = this.state.invite_list.length ? this.state.invite_list.map(function(code){
            if(!code.truename) code.truename = '未使用';
            return (
                <Cell className="list_item" key={code.invite_id}>
                    <CellBody>
                        <h2 className="title">{code.code}</h2>
                    </CellBody>
                    <CellFooter>
                        <InviteLinkItem code={code} />
                    </CellFooter>
                </Cell>
            )
        }) : '';
        let generateButton = this.state.button_enable ? (
            <Button type="primary" onClick={this.generateInviteCode.bind(this)}>
                生成邀请码
            </Button>
        ):(
            <Button type="default" disabled={true} >
                生成邀请码
            </Button>
        );
        return (<section>
            <Cell className="list_item">
                <CellBody>
                    <h2 className="title">邀请码列表</h2>
                </CellBody>
                <CellFooter>
                    <p className="desc">您已生成{this.state.invite_list.length}/{this.state.allow_invite_count}个邀请码</p>
                </CellFooter>
            </Cell>
            {lists}
            <Cell className="list_item">
                {generateButton}
            </Cell>
            <Cell className="list_item">
                <p className="desc">目前仅允许一度邀请12个好友。<br/>详情参考<a href={`${window._BASE_}/index/term`} >了解 ThreeDegrees</a></p>
            </Cell>
        </section>);
    }

}
