
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeForm from 'react-weui-form';
import { schemas } from '../lib/Const';
import Ajax from '../lib/Ajax';

import UserCenter from './user_center';


export default class Doge extends React.Component {

    clickHandle = (data) => {
        data.is_single = 0;
        Ajax.post('/api/user/profile').send(data).type('form').end((err, res) => {
            window.pageData.profile.user_info = data;
            window.location.hash = '';
        });
    }

    getSchema() {
        let schema = [schemas[0][0]];
        console.log(schema);
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
                    label:'完成',
                    type:'primary',
                    onClick: this.clickHandle
                }
            ]
        }
    };

    render() {
        return (
            <div>
                <div className="hd">
                    <h1 className="title">介绍人信息</h1>
                    <p className="sub_title">请如实填写您的基本资料</p>
                </div>
                <WeForm schema={this.getSchema()} form={this.getForm()} />
            </div>
        );
    }

}
