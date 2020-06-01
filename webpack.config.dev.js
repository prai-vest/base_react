const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.config.common')

// common.plugins.push(new webpack.HotModuleReplacementPlugin())

module.exports = merge(common, {
  mode: 'development',
  entry: {
    polyfill: './src/polyfill.js',
    app: ['./src/index.js'],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    // hot: true,
    port: 8004,
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'prod/dist'),
      publicPath: '/',
  },
})
