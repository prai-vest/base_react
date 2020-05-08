const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', {
            loader: 'sass-loader',
            options: { implementation: require('sass') }, // eslint-disable-line global-require
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
          ],
      },
      {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
      },
      {
          test: /\.(png|jpg|gif)$/,
          use: [
            'file-loader',
          ],
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@': path.resolve(__dirname, 'src'),
      Components: path.resolve(__dirname, 'src/components'),
      // Contexts: path.resolve(__dirname, 'src/components/contexts'),
      // Core: path.resolve(__dirname, 'src/components/core'),
      // Pages: path.resolve(__dirname, 'src/components/Pages'),
      Utils: path.resolve(__dirname, 'src/utils'),
      // Root: path.resolve(__dirname),
      // scss: path.resolve(__dirname, 'src/scss'),
      // Api: path.resolve(__dirname, 'src/api'),
      // Images: path.resolve(__dirname, 'src/images'),
    },
    plugins: [
      new DirectoryNamedWebpackPlugin(),
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/debug/, `${process.cwd()}/support/noop.js`),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
  },
}
