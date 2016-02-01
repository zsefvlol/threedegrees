
"use strict";

import React, { Component } from 'react';
import WeUI from 'react-weui';
import 'weui';
import WeForm from 'react-weui-form';
const {ButtonArea, Button, Cells, CellsTitle, CellsTips, Cell, CellHeader, CellBody, CellFooter} = WeUI;


export default class MyForm extends WeForm {

    render() {
        let append = this.props.append;
        return (
            <section>
                {this.renderForm()}
                {this.props.append}
                <ButtonArea>
                    {this.renderActions()}
                </ButtonArea>
            </section>
        )
    }

}
