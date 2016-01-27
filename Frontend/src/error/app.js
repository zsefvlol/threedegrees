
"use strict";

import React from 'react';
import { render } from 'react-dom';
import ErrorArticle from './error_article';

class App extends React.Component {
    render() {
        return <ErrorArticle />
    }
}

console.log('Started');
render(<App />, document.getElementById('container'))
