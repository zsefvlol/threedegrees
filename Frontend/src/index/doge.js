
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeForm from 'react-weui-form';
import Const from '../lib/Const';
import Ajax from '../lib/Ajax';
import FormUtils from '../lib/FormUtils';
import UserCenter from './user_center';

export default class Doge extends React.Component {

    state = {
        step: 0, // 目前分两步，0是从头开始，2是全部完成
        profile: this.props.profile
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
            this.state.profile.user_info = data;
            this.setState({
                step: this.state.step + 1,
                user_info: this.state.profile,
            });
        });
    }

    getSchema() {
        let schema = this.schemaList[this.state.step];
        schema.forEach((item) => {
            item.properties.forEach((control) => {
                let id = control.id;
                control.default = this.state.profile.user_info[id] || control.default || 'demo';
                if (id === 'current_location' && !control.default) {
                    let loc_str = this.state.profile.user_info.loc.join(' ');
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
                id:'distance_love',
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
            }]
        }, {
            label:'自我评价',
            properties:[{
                id:'self_comment',
                label:'',
                type:'textarea',
                rule:'required'
            }]
        }],
        [{
            label:'年龄',
            checkbox:true,
            properties:[{
                id:'r_age[不限]',
                label:'不限',
                type:'checkbox',
                value:'不限'
            }, {
                id:'r_age[22-25岁]',
                label:'22-25岁',
                type:'checkbox',
                value:'22-25岁'
            }, {
                id:'r_age[25-30岁]',
                label:'25-30岁',
                type:'checkbox',
                value:'25-30岁'
            }, {
                id:'r_age[30-35岁]',
                label:'30-35岁',
                type:'checkbox',
                value:'30-35岁'
            }, {
                id:'r_age[35岁以上]',
                label:'35岁以上',
                type:'checkbox',
                value:'35岁以上'
            }]
        }, {
            label:'身高',
            checkbox:true,
            properties:[{
                id:'r_height[不限]',
                label:'不限',
                type:'checkbox',
                value:'不限'
            }, {
                id:'r_height[150-160]',
                label:'150-160',
                type:'checkbox',
                value:'150-160'
            }, {
                id:'r_height[160-170]',
                label:'160-170',
                type:'checkbox',
                value:'160-170'
            }, {
                id:'r_height[170-180]',
                label:'170-180',
                type:'checkbox',
                value:'170-180'
            }, {
                id:'r_height[180以上]',
                label:'180以上',
                type:'checkbox',
                value:'180以上'
            }]
        }, {
            label:'学历',
            checkbox:true,
            properties:[{
                id:'r_education[不限]',
                label:'不限',
                type:'checkbox',
                value:'不限'
            }, {
                id:'r_education[本科]',
                label:'本科',
                type:'checkbox',
                value:'本科'
            }, {
                id:'r_education[研究生]',
                label:'研究生',
                type:'checkbox',
                value:'研究生'
            }, {
                id:'r_education[博士及以上]',
                label:'博士及以上',
                type:'checkbox',
                value:'博士及以上'
            }]
        }, {
            label:'收入',
            checkbox:true,
            properties:[{
                id:'r_income[不限]',
                label:'不限',
                type:'checkbox',
                value:'不限'
            }, {
                id:'r_income[2000-5000]',
                label:'2000-5000',
                type:'checkbox',
                value:'2000-5000'
            }, {
                id:'r_income[5000-10000]',
                label:'5000-10000',
                type:'checkbox',
                value:'5000-10000'
            }, {
                id:'r_income[10000-20000]',
                label:'10000-20000',
                type:'checkbox',
                value:'10000-20000'
            }, {
                id:'r_income[20000以上]',
                label:'20000以上',
                type:'checkbox',
                value:'20000以上'
            }]
        }, {
            label:'工作或居住地',
            properties:[{
                id:'r_location',
                label:'',
                type:'textarea',
                rule:'required'
            }]
        }, {
            label:'其它要求',
            properties:[{
                id:'r_comment',
                label:'',
                type:'textarea',
                rule:'required'
            }]
        }]
    ]


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
        ) : <UserCenter profile={this.state.profile} />;
    }

}
