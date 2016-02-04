
"use strict";

import React from 'react';
import { render } from 'react-dom';
import Upload from 'rc-upload';
import { Dialog, Toast } from 'react-weui';
import jic from './JIC';
import loadImage from './load-image/index';
import Ajax from '../lib/Ajax';
const { Alert } = Dialog;

export default class MyUploader extends React.Component {

    state = {
        photos: this.props.photos ? this.props.photos.map((photo) => {
            photo.src = window._BASE_ + photo.file_path;
            photo.status = 'done';
            return photo;
        }) : [],
        showAlert: false,
        alertContent: '',
        showToast: false,
        toastTimer: null
    }

    componentWillUnmount() {
        this.state.toastTimer && clearTimeout(this.state.toastTimer);
    }


    startUpload = (e) => {
        const minSize = 1E6;
        var file = e.target.files[0];
        var quality = file.size > minSize ? parseInt((minSize / file.size) * 100) : 100;
        var options = {noRevoke: true, canvas: false};
        loadImage.parseMetaData(file, (data) => {
           if (data.exif) {
               options.orientation = data.exif.get('Orientation');
           }
           loadImage(
               file,
               (img) => {
                    var compressd = jic.compress(img, quality, 'jpg', 800);
                    var pid = +new Date();
                    var photo = {
                        pid: pid,
                        status: 'uploading',
                        percent: 0,
                        src: compressd
                    };
                    this.state.photos.push(photo);
                    this.setState({photos: this.state.photos});
                    var duringCallback = (e) => {
                        photo.percent = e.percent;
                        this.setState({photos: this.state.photos});
                    }
                    var errorCallback = (err) => {
                        photo.status = 'error';
                        this.setState({
                            photos: this.state.photos,
                            showAlert: true,
                            alertContent: err.error_message || '未知错误'
                        })
                    }
                    var successCallback = (res) => {
                        if (res.error_code !== 0) {
                            errorCallback(res);
                            return;
                        }
                        photo.pid = res.data.pid;
                        photo.status = 'done';
                        this.setState({photos: this.state.photos});
                    }
                    jic.upload(
                        compressd,
                        window._BASE_+'/api/photo/upload.json',
                        'file',
                        file.name,
                        successCallback,
                        errorCallback,
                        duringCallback
                    );
                    
               },
               options
           );
       });
    }

    removeImg(photo, index) {
        Ajax.get('/api/photo/remove/pid/'+photo.pid).end((err, res) => {
            this.state.photos.splice(index, 1);
            this.setState({
                showToast: true,
                photos: this.state.photos
            })
            this.state.toastTimer = setTimeout(()=> {
                this.setState({showToast: false});
            }, 1000);
        })
    }

    hideAlert() {
        this.setState({showAlert: false});
    }

    render() {
        let buttons = [{
            label: '稍后再试',
            onClick: this.hideAlert.bind(this)
        }];
        return (
            <div>
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
                                    this.state.photos.map((photo, i) => {
                                        let content = null;
                                        
                                        if (photo.status === 'done') {
                                            content = (<i onClick={this.removeImg.bind(this, photo, i)} className="weui_icon_cancel remove_img_btn"></i>);
                                        }
                                        else if (photo.status === 'error') {
                                            content = (<i className="weui_icon_warn"></i>);
                                        } else if (photo.percent && photo.percent < 100) {
                                            content = photo.percent + '%';
                                        }
                                        let className = photo.status === 'done' ? 'weui_uploader_file' : 'weui_uploader_file weui_uploader_status';
                                        return <li key={photo.pid} className={className} style={{backgroundImage: `url(${photo.src})`}}>
                                                <div className="weui_uploader_status_content">
                                                    {content}
                                                </div>
                                            </li>
                                    })
                                }
                                </ul>
                                <div className="weui_uploader_input_wrp">
                                    <input onChange={this.startUpload} className="weui_uploader_input" type="file" accept="image/*" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Alert title='上传图片失败' buttons={buttons} show={this.state.showAlert}>
                    {this.state.alertContent}
                </Alert>
                <Toast show={this.state.showToast}>已删除</Toast>
            </div>
        );
    }
}
