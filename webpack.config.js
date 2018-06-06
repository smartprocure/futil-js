var path = require('path')
var webpack = require('webpack')
var packageMetadata = require('./package.json')
var libraryName = packageMetadata.name
var libraryVersion = packageMetadata.version
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
    globalObject: 'this',
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
  plugins: [
    new webpack.DefinePlugin({
      'global.__VERSION__': JSON.stringify(libraryVersion),
    }),
  ],
}
