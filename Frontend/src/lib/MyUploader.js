
"use strict";

import React from 'react';
import { render } from 'react-dom';
import Upload from 'rc-upload';
import { Dialog } from 'react-weui';
import jic from './JIC';
import loadImage from './load-image/index';
const { Alert } = Dialog;

export default class MyUploader extends React.Component {

    state = {
        photos: this.props.photos ? this.props.photos.map((photo) => {
            photo.src = window._BASE_ + photo.file_path;
            photo.status = 'done';
            return photo;
        }) : [],
        showAlert: false,
        alertContent: ''
    }

    uploadHandle = (e) => {

        const minSize = 1E6;
        var file = e.target.files[0];
        console.log(file);
        var quality = file.size > minSize ? parseInt((minSize / file.size) * 100) : 100;
        var options = {
            noRevoke: true,
            canvas: false
        }
        loadImage.parseMetaData(file, (data) => {
           if (data.exif) {
               options.orientation = data.exif.get('Orientation');
           }
           loadImage(
               file,
               (img) => {
                    var compressd = jic.compress(img, quality, 'jpg', 800);
                    jic.upload(compressd, window._BASE_+'/api/photo/upload.json', 'file', file.name,
                        (res) => {
                            console.log(res);
                        }
                    );
                   this.state.photos.push({
                       pid: file.lastModified,
                       status: 'uploading',
                       src: compressd
                   });
                   this.setState({photos: this.state.photos});
               },
               options
           );
       });
    }




    errorHandler = (err) => {
        this.setState({
            showAlert: true,
            alertContent: err.error_message || '未知错误'
        })
    }

    opts = {
        action: window._BASE_ + '/api/photo/upload.json',
        beforeUpload: (file) => {
            console.log(file);
            var reader = new FileReader();
            reader.onload = function(event) {
                var i = document.getElementById("source_image");
                i.src = event.target.result;
                i.onload = function() {
                    image_width=$(i).width(),
                    image_height=$(i).height();
                    if (image_width > image_height) {
                        i.style.width="320px";
                    } else {
                        i.style.height="300px";
                    }
                    i.style.display = "block";
                    console.log("Image loaded");
                }
            };
            reader.readAsDataURL(file);
        },
        onSuccess: (res) => {
            if (res.error_code !== 0) {
                this.errorHandler(res);
                return;
            }
            window.pageData.profile.photo.push(res.data);
            this.setState({photos: window.pageData.profile.photo});
        },
        onError: this.errorHandler
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
                                    this.state.photos.map((photo) => {
                                        return <li key={photo.pid} className="weui_uploader_file" style={{backgroundImage: `url(${photo.src})`}}>
                                        </li>
                                    })
                                }
                                </ul>
                                <div className="weui_uploader_input_wrp">
                                    <input onChange={this.uploadHandle} className="weui_uploader_input" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" multiple="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Alert title='上传图片失败' buttons={buttons} show={this.state.showAlert}>
                    {this.state.alertContent}
                </Alert>
            </div>
        );
    }
}
