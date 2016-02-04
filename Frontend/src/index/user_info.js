
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
                w: photo.w,
                h: photo.h
            });
        });

        let getThumbnailContent = (item) => {
            let thumbW = item.w / 20 * 3 ;
            let thumbH = item.h / 20 * 3;
            return (
                <img src={item.thumbnail} width={thumbW} height={thumbH}/>
            );
        };

        //let relation_text = this.state.profile.relation_text;
        //let relation = [(<Cell><CellBody>小温</CellBody></Cell>)];
        //for(let i=0;i<Math.max(relation_text[0].length,relation_text[1].length);i++){
        //    relation.push((
        //        <Cell>
        //            <CellBody>{relation_text[0][i]}</CellBody>
        //            <CellBody>{relation_text[1][i]}</CellBody>
        //        </Cell>
        //    ))
        //}
        let svg_down_arrow = (
            <svg width="12" height="12" viewBox="0 0 256 256">
                <path fill="#C33" d="M219.314 155.314l-80 80c-6.248 6.249-16.379 6.249-22.627 0l-80-80c-6.248-6.249-6.248-16.379 0-22.627s16.379-6.249 22.627 0l52.686 52.686v-153.373c0-8.837 7.163-16 16-16s16 7.163 16 16v153.373l52.686-52.686c3.124-3.124 7.219-4.686 11.314-4.686s8.19 1.562 11.314 4.686c6.249 6.249 6.249 16.379 0 22.627z" />
            </svg>
        );
        let relation = this.state.profile.relation_text.map(function(r,i){
            return i<this.state.profile.relation_text.length-1? (<section key={i}>
               <Cell className="relation_list"><CellBody>{r}</CellBody></Cell>
               <Cell className="relation_list"><CellBody>{svg_down_arrow}</CellBody></Cell>
           </section>) : (<section key={i}>
                <Cell className="relation_list"><CellBody>{r}</CellBody></Cell>
            </section>)
        }.bind(this));

        let like_btn = window.pageData.profile.user_info.is_single == 1 ? (
            <Like className="fl" target={this.state.profile} />
        ) : '';

        return (
            <div className="barWrapper">
                <div>
                    <CellsTitle>三度关系</CellsTitle>
                    <Cells className="center">
                        {relation}
                    </Cells>
                    <CellsTitle>个人信息</CellsTitle>
                    <Cells>
                        {result.info.map((cell) => {
                            return <Cell key={cell.id}> <CellBody className="cell-body-min-width">{cell.label}</CellBody> <CellFooter className="cell-footer-fix-width">{cell.value}</CellFooter> </Cell>
                        })}
                    </Cells>
                    <CellsTitle>择偶要求</CellsTitle>
                    <Cells>
                        {result.standard.map((cell) => {
                            return <Cell key={cell.id}> <CellBody className="cell-body-min-width">{cell.label}</CellBody> <CellFooter className="cell-footer-fix-width">{cell.value}</CellFooter> </Cell>
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
                        {like_btn}
                        <Goback className="fr" target={this.state.profile} />
                    </div>
                </div>
            </div>
        )
    }

}
