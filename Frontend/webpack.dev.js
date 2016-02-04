/**
 * Created by jf on 15/10/27.
 */
var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var srcPath = path.join(__dirname, 'src');

module.exports = {
    entry: fs.readdirSync(srcPath).reduce(function (entries, dir) {
    if (dir !== 'lib' && fs.statSync(path.join(srcPath, dir)).isDirectory())
        entries[dir] = [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/dev-server',
            path.join(srcPath, dir, 'app.js')
    ]
    return entries
    }, {}),
    output: {
        path: path.resolve(__dirname, '../Public/static/js'),
        publicPath: 'http://localhost:8080/static/js/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        loaders:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'react-hot!babel'
            }, {
                test: /\.less$/,
                loader: 'style!css!autoprefixer!less'
            }, {
                test: /\.css/,
                loader: 'style!css'
            }, {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url?limit=25000'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('shared.js'),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false
        })
    ]
};
