
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeUI from 'react-weui';
import UserListItem from './user_list_item'
const {Cells, CellsTitle, CellBody, Cell, Button, CellFooter} = WeUI;

export default class UserList extends React.Component {

    state = {
        list_title: this.props.list_title,
        empty_notice: this.props.empty_notice,
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
                    <p className="desc">{this.state.empty_notice}</p>
                </CellBody>
            </Cell>
        );
        return (<section>
            <Cell className="list_item">
                <CellBody>
                    <h2 className="title"><b>{this.state.list_title}</b></h2>
                </CellBody>
            </Cell>
            {lists}
        </section>);
    }

}
