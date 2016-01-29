
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeForm from 'react-weui-form';
import { dogeSchema } from '../lib/Const';
import Ajax from '../lib/Ajax';

import UserCenter from './user_center';


export default class Doge extends React.Component {

    state = {
        step: 0  // 目前分两步，0是从头开始，2是全部完成
    }

    clickHandle = (data) => {
        if (this.state.step < 1) {
            this.setState({
                step: this.state.step + 1
            });
            return;
        }
        // 多选数据格式化
        for (var k in data) {
            var matches = k.match(/(\w+)\[(\S+)\]/);
            if (matches) {
                let field = matches[1];
                data[field] = data[field] ? data[field] + ',' + matches[2] : matches[2];
                delete data[k];
            }
        }
        Ajax.post('/api/user/profile').send(data).type('form').end((err, res) => {
            window.pageData.profile.user_info = data;
            this.setState({
                step: this.state.step + 1
            });
        });
    }

    getSchema() {
        let schema = dogeSchema[this.state.step];
        schema.forEach((item) => {
            item.properties.forEach((control) => {
                let id = control.id;
                control.default = window.pageData.profile.user_info[id] || control.default || 'demo';
                if (id === 'current_location' && !control.default) {
                    let loc_str = window.pageData.profile.user_info.loc.join(' ');
                    control.default = loc_str;
                }
            })
        })
        return schema;
    }

    getForm() {
        return {
            actions:[
                {
                    label:this.state.step ? '完成' : '下一步',
                    type:'primary',
                    onClick: this.clickHandle
                }
            ]
        }
    };

    render() {
        console.log(this.state.step);
        return this.state.step < 2 ? (
            <div>
                <div className="hd">
                    <h1 className="title">{this.state.step ? '择偶要求' : '个人信息'}</h1>
                    <p className="sub_title">请如实填写您的{this.state.step ? '要求' : '信息'}</p>
                </div>
                <WeForm schema={this.getSchema()} form={this.getForm()} />
            </div>
        ) : <UserCenter />;
    }

}
