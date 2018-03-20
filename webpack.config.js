var path = require('path')
var libraryName = require('./package.json').name
var outputFile = libraryName + '.js'

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'lib'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  externals: {
    'lodash/fp': 'lodash/fp',
  },
}
