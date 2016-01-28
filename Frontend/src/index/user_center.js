
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeUI from 'react-weui';
import UserList from './user_list'
import InviteList from './invite_list'
const {Cells, CellsTitle, CellBody, Cell, Button, CellFooter, ButtonArea} = WeUI;

export default class UserCenter extends React.Component {

    state = {
        profile : this.props.profile
    };

    render() {
        console.log(this.state.profile);
        return (<section>
            <Cell className="list_item">
                <CellBody>
                    <h2 className="title">欢迎 {this.state.profile.user_info.truename}</h2>
                    <ButtonArea direction="horizontal">
                        <Button>三度列表</Button>
                        <Button type="default">我的资料</Button>
                    </ButtonArea>
                </CellBody>
            </Cell>
            <UserList list_title="我喜欢的" empty_notice="" user_list={this.state.profile.i_like} />
            <UserList list_title="喜欢我的" empty_notice="" user_list={this.state.profile.like_me} />
            <InviteList user_info={this.state.profile} />
        </section>);
    }

}
