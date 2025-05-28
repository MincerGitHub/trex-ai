const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

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
    random: ['./apps/random.js']
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
              limit: 8192,
              mimetype: 'image/png',
              name: 'images/[name].[ext]'
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
    })
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
  }
};