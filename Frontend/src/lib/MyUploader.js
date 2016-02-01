
"use strict";

import React from 'react';
import { render } from 'react-dom';
import Upload from 'rc-upload';

export default class MyUploader extends React.Component {

    state = {
        photos: this.props.photos || []
    }

    opts = {
        action: window._BASE_ + '/api/photo/upload.json',
        onSuccess: (ret) => {
            window.pageData.profile.photo.push(ret.data);
            this.setState({photos: window.pageData.profile.photo});
        },
        onError: (err) => {
            console.log('onError', err);
        }
    }


    render() {
        return (
            <div className="weui_cell bdt0">
                <div className="weui_cell_bd weui_cell_primary">
                    <div className="weui_uploader">
                        <div className="weui_uploader_hd weui_cell">
                            <div className="weui_cell_bd weui_cell_primary">图片上传</div>
                            <div className="weui_cell_ft">{this.state.photos.length}</div>
                        </div>
                        <div className="weui_uploader_bd">
                            <ul className="weui_uploader_files">
                            {
                                this.state.photos.map((photo) => {
                                    return <li key={photo.pid} className="weui_uploader_file" style={{backgroundImage: `url(${window._BASE_}${photo.file_path})`}}></li>
                                })
                            }
                            </ul>
                            <Upload {...this.opts}>
                                <div className="weui_uploader_input_wrp"></div>
                            </Upload>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}