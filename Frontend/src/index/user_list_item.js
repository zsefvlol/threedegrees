
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeUI from 'react-weui';
const {Cell, CellHeader, CellBody} = WeUI;

export default class UserListItem extends React.Component {

    state = {
        user: this.props.user
    };

    handleClick(e){
        //@TODO 跳转到详情页
        //location.href = window._BASE_ + '/?uid=' + this.state.user.uid;
    }

    render() {
        let height = this.state.user.height == -1 ? '不告诉你' : this.state.user.height + 'cm';
        let weight = this.state.user.weight == -1 ? '不告诉你' : this.state.user.weight + 'kg';
        return (
            <Cell className="list_item" onClick={this.handleClick.bind(this)}>
                {/**<CellHeader>
                    <img className="cover" src={this.state.user.pic} alt=""/>
                </CellHeader>*/}
                <CellBody>
                    <h2 className="title">{this.state.user.truename} - {this.state.user.age}岁</h2>
                    <p className="desc">{height} {weight} {this.state.user.current_location}</p>
                </CellBody>
            </Cell>
        );
    }

}
