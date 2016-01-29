
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeUI from 'react-weui';
import UserListItem from './user_list_item';
import Ajax from '../lib/Ajax';
import {dogeSchema} from '../lib/Const';
const {Cells, CellsTitle, CellBody, Cell, Button, CellFooter} = WeUI;

export default class UserList extends React.Component {

    state = {
        profile: this.props.profile || this.getProfile()
    };

    getProfile() {
        const {params} = this.props;
        Ajax.get(`/api/user/profile/uid/${params.id}`).end((err, res) => {
            this.setState({profile: res.body.data})
        })
        return {};
    }

    render() {
        if (!this.state.profile.user_info)
            return null;
        const user_info = this.state.profile.user_info;
        function pageData(cate) {
            let info = [];
            cate.forEach((item) => {
                if (item.checkbox) {
                    let id = item.properties[0].id.replace(/\[\S+\]/, '');
                    let label = item.label;
                    let value = user_info[id] || '';
                    info.push({id, label, value});
                    return true;
                }
                let props = item.properties;
                props.forEach((cell) => {
                    let id    = cell.id;
                    let label = cell.label || item.label;
                    let value = user_info[id] || '';
                    if (value && cell.type === 'select' && cell.options) {
                        cell.options.forEach((option) => {
                            if (option.value === value) {
                                value = option.label;
                            }
                        })
                    }
                    info.push({id, label, value});
                })
            })
            return info;
        }
        let result = {
            info : pageData(dogeSchema[0]),
            standard: pageData(dogeSchema[1])
        }
        return (
            <div>
                <CellsTitle>个人信息</CellsTitle>
                <Cells>
                    {result.info.map((cell) => {
                        return <Cell key={cell.id}> <CellBody>{cell.label}</CellBody> <CellFooter>{cell.value}</CellFooter> </Cell>
                    })}
                </Cells>
                <CellsTitle>择偶要求</CellsTitle>
                <Cells>
                    {result.standard.map((cell) => {
                        return <Cell key={cell.id}> <CellBody>{cell.label}</CellBody> <CellFooter>{cell.value}</CellFooter> </Cell>
                    })}
                </Cells>
            </div>
        )
    }

}
