
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeForm from 'react-weui-form';
import Const from '../lib/Const';
import FormUtils from '../lib/FormUtils';

export default class Doge extends React.Component {

    state = {
        step: 0, // 目前分两步，0是从头开始，2是全部完成
        user_info: this.props.user_info
    }

    clickHandle(step, data) {
        if (step === 2) {
            console.log('done');
            return;
        }
        this.setState({
            step: step,
            user_info: data
        })
    }

    getSchema() {
        let schema = this.schemaList[this.state.step];
        schema.forEach((item) => {
            item.properties.forEach((control) => {
                let id = control.id;
                control.default = this.state.user_info[id] || control.default;
            })
        })
        return schema;
    }
    schemaList = [
        [{
            label:'基本资料',
            properties:[{
                id:'truename',
                label:'姓名',
                type:'text',
                rule:'required|between:2,15|string'
            }, {
                id:'gender',
                label:'性别',
                type:'select',
                rule:'required',
                options:[{
                    label:'请选择',
                    value:''
                }, {
                    label:'男',
                    value:'男'
                }, {
                    label:'女',
                    value:'女'
                }]
            }, {
                id:'relation',
                label:'关系',
                type:'text',
                placeholder:'请填写和邀请人的关系',
                rule:'required|between:2,15|string'
            }, {
                id:'wechat_id',
                label:'微信ID',
                type:'text',
                placeholder:'',
                rule:'required|between:2,15|string'
            }]
        }, {
            label:'详细信息',
            properties:[{
                id:'birthday',
                label:'生日',
                type:'date',
                rule:'required'
            }, {
                id:'constellation',
                label:'星座',
                type:'select',
                rule:'required',
                options:FormUtils.combine(Const.constellations).prefix()
            }, {
                id:'height',
                label:'身高',
                type:'select',
                rule:'required',
                options:FormUtils.range(150, 190, 5, 'cm').prefix({label: '以后告诉你', value: '-1'})
            }, {
                id:'weight',
                label:'体重',
                type:'select',
                rule:'required',
                options:FormUtils.range(40, 100, 10, 'kg').prefix({label: '以后告诉你', value: '-1'})
            }, {
                id:'current_location',
                label:'所在地',
                type:'text',
                rule:'required'
            }]
        }]
    ]


    form = {
        actions:[
            {
                label:'下一步',
                type:'primary',
                onClick: this.clickHandle
            }
        ]
    };

    render() {
        return (<WeForm schema={this.getSchema()} form={this.form}/>);
    }

}
