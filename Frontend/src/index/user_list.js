
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeUI from 'react-weui';
import UserListItem from './user_list_item'
const {Cells, CellsTitle, CellBody, Cell, Button, CellFooter} = WeUI;

export default class UserList extends React.Component {

    state = {
        user_list: this.props.user_list
    };

    render() {
        let lists = this.state.user_list.length ? this.state.user_list.map(function(user){
            return (
                <UserListItem user={user} key={user.uid} />
            )
        }) : (
            <Cell className="list_item">
                <CellBody>
                    <h2 className="title">当前列表为空</h2>
                    <p className="desc">如果您是介绍人身份，您只能看到您邀请的好友的信息</p>
                </CellBody>
            </Cell>
        );
        return (<section>
            <Cell className="list_item">
                <CellBody>
                    <h2 className="title">ThreeDegree Lists</h2>
                </CellBody>
                <CellFooter>
                    <Button type="default" size="small" plain="true">
                        个人中心
                    </Button>
                </CellFooter>
            </Cell>
            <Cells access>
                {lists}
            </Cells>
        </section>);
    }

}
