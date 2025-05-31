const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ASSETS_SOURCE_PATH = path.resolve('./src');
const ASSETS_BUILD_PATH = path.resolve('./assets');
const ASSETS_PUBLIC_PATH = '/trex-ai/assets';

module.exports = {
  context: ASSETS_SOURCE_PATH,
  entry: {
    'genetic': ['./apps/genetic.js'],
    'genetic-nn': ['./apps/genetic-nn.js'],
    nn: ['./apps/nn.js'],
    nnm: ['./apps/nnm.js'],
    random: ['./apps/random.js'],
    dqn: ['./apps/random.js']
  },
  output: {
    path: ASSETS_BUILD_PATH,
    publicPath: ASSETS_PUBLIC_PATH,
    filename: './[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 0, // 禁用 Base64 转换，所有图片都输出为文件
              mimetype: 'image/png',
              name: 'images/[name].[ext]',
              publicPath: '/trex-ai/assets', // 设置图片的公共路径
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [ASSETS_BUILD_PATH],
      verbose: false
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      exclude: ['node_modules', 'screen-capture']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      filename: "index.html",
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './genetic.html'),
      filename: "genetic.html",
      chunks: ['vendor', 'genetic'],
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './neural-network.html'),
      filename: "neural-network.html",
      chunks: ['vendor', 'nn'],
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './random.html'),
      filename: "random.html",
      chunks: ['vendor', 'random'],
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './genetic-neural-network.html'),
      filename: "genetic-neural-network.html",
      chunks: ['vendor', 'genetic-nn'],
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './neural-network-multiplayer.html'),
      filename: "neural-network-multiplayer.html",
      chunks: ['vendor', 'nnm'],
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './deep-q-network.html'),
      filename: "deep-q-network.html",
      chunks: ['vendor', 'dqn'],
      inject: false
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    }
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'assets'), // 指定静态文件目录
    },
    compress: true, // 启用 gzip 压缩
    port: 8080,
    historyApiFallback: false, // ？？？
    open: true,
  },
  performance: {
    hints: false, // 禁用性能提示
    maxAssetSize: 4096000, // 设置单个资源的最大大小（单位：字节）例如4Mb
    maxEntrypointSize: 4096000, // 设置入口点的最大大小（单位：字节）
  },
};