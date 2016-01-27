
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
                if (id === 'current_location' && !control.default) {
                    let loc_str = this.state.user_info.loc.join(' ');
                    control.default = loc_str;
                }
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
                label:'当前所在地',
                type:'text',
                rule:'required'
            }, {
                id:'future_location',
                label:'未来居住地',
                type:'text',
                rule:'string'
            }, {
                id:'job',
                label:'职业',
                type:'text',
                rule:'required'
            }, {
                id:'month_income',
                label:'收入',
                type:'select',
                options:FormUtils.combine(['2000以下','2000-5000','5000-10000','10000-20000','20000以上']).prefix({label: '以后告诉你', value: '-1'}),
                rule:'required'
            }, {
                id:'homeland',
                label:'家乡',
                type:'text',
                rule:'required'
            }, {
                id:'people',
                label:'民族',
                type:'text',
                rule:'required'
            }, {
                id:'animal',
                label:'属相',
                type:'text',
                rule:'required'
            }, {
                id:'parent',
                label:'父母情况',
                type:'text',
                placeholder: '请填写父母身体状况，家庭状况',
                rule:'required'
            }, {
                id:'siblings',
                label:'兄弟姐妹',
                type:'text',
                placeholder: '请填写是否独生或兄弟姐妹情况',
                rule:'required'
            }, {
                id:'smoking',
                label:'吸烟',
                type:'select',
                options:FormUtils.combine(['经常','一般','很少','从不']).get(),
                rule:'required'
            }, {
                id:'drinking',
                label:'喝酒',
                type:'select',
                options:FormUtils.combine(['经常','一般','很少','从不']).get(),
                rule:'required'
            }, {
                id:'yidilian',
                label:'接受异地恋',
                type:'select',
                options:FormUtils.combine(['否','1年内','2年内','5年内']).prefix(),
                rule:'required'
            }, {
                id:'year_before_marriage',
                label:'几年内结婚',
                type:'select',
                options:FormUtils.range(1, 5, 1, '年').prefix(),
                rule:'required'
            }, {
                id:'child_count',
                label:'要几个小孩',
                type:'select',
                options:FormUtils.range(0, 3, 1, '个').prefix(),
                rule:'required'
            }, {
                id:'hobby',
                label:'兴趣爱好',
                type:'text',
                rule:'required'
            }
            ]
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
