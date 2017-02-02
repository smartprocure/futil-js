var path = require('path');

var libraryName = 'futil';
var outputFile = libraryName + '.js';

module.exports = {
    devtool: 'source-map',
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [{
            test: /(\.jsx|\.js)$/,
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/
        // }, {
        //     test: /(\.jsx|\.js)$/,
        //     loader: "eslint-loader",
        //     exclude: /node_modules/
        }]
    },
    externals: {
        'lodash/fp': 'lodash/fp'
    }
};