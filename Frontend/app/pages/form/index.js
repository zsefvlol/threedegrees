/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import WeForm from 'react-weui-form';
import Page from '../../component/page';

export default class FormDemo extends React.Component {
    //定义架构
    schema = [
      //一个新的列表组
      {
        label:'基本资料',
        properties:[
        //表单单位定义
        //创建一个文本输入，验证为2到15为字符
          {
            id:'username',
            label:'用户名',
            default:'',
            type:'text',
            placeholder:'2到15位字符',
            rule:'required|between:2,15|string'
          },
          {
            id:'password',
            label:'密码',
            type:'password',
            placeholder:'输入您的密码',
            rule:'required'
          }
        ]
      }
    ];
    //定义设置
    form = {
      //定义按钮
      actions:[
        {
          label:'登陆',
          type:'primary',
          onClick :(data)=>alert(JSON.stringify(data,null,2)),
        }
      ]
    };

    render() {
        return (
            <Page className="form" title="Form" spacing>
                <WeForm schema={this.schema} form={this.form}/>
            </Page>
        );
    }
};
