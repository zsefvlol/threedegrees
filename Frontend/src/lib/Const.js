
"use strict";

import FormUtils from '../lib/FormUtils';

const constellations = ['双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座'];

const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const schemas = [
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
            label:'介绍关系',
            type:'text',
            placeholder:'请填写和介绍人的关系',
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
            options:FormUtils.combine(constellations).prefix()
        }, {
            id:'height',
            label:'身高(cm)',
            type:'number',
            //default: -1,
            //type:'select',
            rule:'required'
            //options:FormUtils.range(150, 190, 5, 'cm').prefix({label: '以后告诉你', value: '-1'})
        }, {
            id:'weight',
            label:'体重(kg)',
            type:'number',
            //default: -1,
            //type:'select',
            rule:'required'
            //options:FormUtils.range(40, 100, 10, 'kg').prefix({label: '以后告诉你', value: '-1'})
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
            default: -1,
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
            type:'select',
            rule:'required',
            options:FormUtils.combine(animals).prefix()
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
            default: '从不',
            options:FormUtils.combine(['从不', '很少', '一般', '经常']).get(),
            rule:'required'
        }, {
            id:'drinking',
            label:'喝酒',
            type:'select',
            default: '从不',
            options:FormUtils.combine(['从不', '很少', '一般', '经常']).get(),
            rule:'required'
        }, {
            id:'long_distance',
            label:'接受异地恋',
            type:'select',
            options:FormUtils.combine(['否','1年内','2年内','5年内']).prefix(),
            rule:'required'
        }, {
            id:'year_before_marriage',
            label:'几年内结婚',
            type:'select',
            default: -1,
            options:FormUtils.range(1, 5, 1, '年').prefix({label: '以后告诉你', value: '-1'}),
            rule:'required'
        }, {
            id:'child_count',
            label:'要几个小孩',
            type:'select',
            default: '无所谓',
            options:FormUtils.range(0, 3, 1, '个').prefix({label: '无所谓', value: '无所谓'}),
            rule:'required'
        }, {
            id:'hobby',
            label:'兴趣爱好',
            type:'text',
            placeholder: '请用分号隔开',
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
            id:'r_education[本科以上]',
            label:'本科以上',
            type:'checkbox',
            value:'本科以上'
        }, {
            id:'r_education[研究生以上]',
            label:'研究生以上',
            type:'checkbox',
            value:'研究生以上'
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

exports.constellations = constellations;
exports.schemas = schemas;
