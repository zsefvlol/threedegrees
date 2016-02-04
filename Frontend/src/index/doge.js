
"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import MyForm from '../lib/MyForm';
import MyUploder from '../lib/MyUploader';
import { schemas } from '../lib/Const';
import Ajax from '../lib/Ajax';


import UserCenter from './user_center';


export default class Doge extends React.Component {

    state = {
        step: 0,  // 目前分两步，0是从头开始，2是全部完成
        holding: false
    }

    clickHandle = (data) => {
        if (this.state.holding) {
            return;
        }
        if (this.state.step < 1) {
            this.setState({
                step: this.state.step + 1
            });
            return;
        }
        // 多选数据格式化
        for (var k in data) {
            if (data[k] === false) {
                delete data[k];
                continue;
            }
            var matches = k.match(/(\w+)\[(\S+)\]/);
            if (matches) {
                let field = matches[1];
                data[field] = data[field] ? data[field] + ',' + matches[2] : matches[2];
                delete data[k];
            }
        }
        data.is_single = 1;
        Ajax.post('/api/user/profile').send(data).type('form').end((err, res) => {
            window.pageData.profile.user_info = data;
            window.location.hash = '';
        });
    }

    componentDidUpdate() {
        ReactDOM.findDOMNode(this).scrollIntoView();
        ReactDOM.findDOMNode(this).scrollTop = 0;
    }

    getSchema() {
        let schema = schemas[this.state.step];
        schema.forEach((item) => {
            item.properties.forEach((control) => {
                if (item.checkbox) {
                    let id = control.id.replace(/\[\S+\]/, '');
                    let info = window.pageData.profile.user_info[id]
                    if (info && info.indexOf(control.value) >= 0) {
                        control.default = true;
                    } else {
                        control.default = undefined;
                    }
                } else {
                    let id = control.id;
                    let info = window.pageData.profile.user_info[id];
                    control.default = info || control.default;
                    if (id === 'current_location' && window.pageData.profile.user_info.loc && !control.default) {
                        let loc_str = window.pageData.profile.user_info.loc.join(' ');
                        control.default = loc_str;
                    }
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
                    disabled: this.state.holding,
                    onClick: this.clickHandle
                }
            ]
        }
    };


    getAppend() {
        return this.state.step === 0 ? (<MyUploder parent={this} photos={window.pageData.profile.photo} />) : null;
    }

    render() {
        return (
            <div>
                <div className="hd">
                    <h1 className="title">{this.state.step ? '择偶要求' : '个人信息'}</h1>
                    <p className="sub_title">请如实填写您的{this.state.step ? '要求(可多选)' : '信息'}</p>
                </div>
                <MyForm schema={this.getSchema()} form={this.getForm()} append={this.getAppend()} />
            </div>
        );
    }

}
