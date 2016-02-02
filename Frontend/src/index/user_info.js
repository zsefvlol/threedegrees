
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeUI from 'react-weui';
import UserListItem from './user_list_item';
import Ajax from '../lib/Ajax';
import { schemas } from '../lib/Const';
import Like from './like';
import { Goback } from './icon_btns';
import '../lib/react-photoswipe/photoswipe.css';
import { PhotoSwipeGallery } from 'react-photoswipe';
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
            info : pageData(schemas[0]),
            standard: pageData(schemas[1])
        }

        let items = [];
        this.state.profile.photo.forEach((photo) => {
            let url = window._BASE_ + photo.file_path;
            items.push({
                src: url,
                thumbnail: url,
                w: 1200,
                h: 900
            });
        })
        let getThumbnailContent = (item) => {
            return (
                <img src={item.thumbnail} width={120} height={90}/>
            );
        }

        return (
            <div className="barWrapper">
                <div>
                    <CellsTitle>个人信息</CellsTitle>
                    <Cells>
                        {result.info.map((cell) => {
                            return <Cell key={cell.id}> <CellBody>{cell.label}</CellBody> <CellFooter>{cell.value}</CellFooter> </Cell>
                        })}
                    </Cells>
                    <CellsTitle>·(可多选)</CellsTitle>
                    <Cells>
                        {result.standard.map((cell) => {
                            return <Cell key={cell.id}> <CellBody>{cell.label}</CellBody> <CellFooter>{cell.value}</CellFooter> </Cell>
                        })}
                    </Cells>
                    <CellsTitle>个人照片</CellsTitle>
                    <Cells>
                        <PhotoSwipeGallery items={items}
                            thumbnailContent={getThumbnailContent}/>
                    </Cells>
                </div>
                <div className="bottomBar">
                    <div className="clearfix bottomBtns">
                        <Like className="fl" target={this.state.profile} />
                        <Goback className="fr" target={this.state.profile} />
                    </div>
                </div>
            </div>
        )
    }

}
