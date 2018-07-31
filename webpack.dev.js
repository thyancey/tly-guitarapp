const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  entry: [
    'react-hot-loader/patch'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options:{
              limit:8192
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ["react-svg-loader"]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.less'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias:{
      src: path.resolve(__dirname, 'src/')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
});