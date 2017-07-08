const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    popup: path.join(__dirname, 'src/popup.tsx'),
    options: path.join(__dirname, 'src/options.tsx'),
    content_script: path.join(__dirname, 'src/content_script.ts'),
    background: path.join(__dirname, 'src/background.ts'),
    vendor_common: ['moment', 'jquery'],
    vendor_react: ['react', 'react-dom'],
  },
  output: {
    path: path.join(__dirname, 'dist/build'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },

      // CSS loader
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },

      // Image file loader
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]',
          publicPath: 'build/',
          outputPath: 'assets/'
        }
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // clean output dir
    new CleanWebpackPlugin([
      'dist/build'
    ]),

    // pack common vender files
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor_react', 'vendor_common'],
      minChunks: Infinity
    }),

    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // minify
    new webpack.optimize.UglifyJsPlugin()
  ]
};
