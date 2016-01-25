
"use strict";

import React from 'react';
import { render } from 'react-dom';
import Choose from './choose';
import Doge from './doge';

export default class Join extends React.Component {

    state = {
        is_single: this.props.user_info.is_single,
        user_info: this.props.user_info
    }

    chooseHandle(is_single) {
        console.log(is_single);
        this.setState({is_single: is_single});
    }


    render() {
        if (this.state.is_single == 1)
            return (<Doge user_info={this.state.user_info} />);
        // if (this.state.is_single == 0)
        //     return (<Matchmaker user_info={this.user_info} />);
        return (<Choose handle={this.chooseHandle} />);
    }

}
