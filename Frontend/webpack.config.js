/**
 * Created by jf on 15/10/27.
 */
var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var srcPath = path.join(__dirname, 'src');

module.exports = {
    entry: fs.readdirSync(srcPath).reduce(function (entries, dir) {
    if (fs.statSync(path.join(srcPath, dir)).isDirectory())
      entries[dir] = path.join(srcPath, dir, 'app.js')

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
                loader: 'babel'
            }, {
                test: /\.less$/,
                loader: 'style!css!autoprefixer!less'
            }, {
                test: /\.css/,
                loader: 'style!css'
            }, {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=25000'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('shared.js'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false
        })
    ]
};
