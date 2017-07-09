const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const buildConfig = {
  entry: {
    popup: path.join(__dirname, 'src/popup.tsx'),
    options: path.join(__dirname, 'src/options.tsx'),
    content_script: path.join(__dirname, 'src/content_script.ts'),
    background: path.join(__dirname, 'src/background.ts'),
    vendor_react: ['react', 'react-dom'],
    vendor_common: ['jquery', 'moment'],
  },
  output: {
    path: path.join(__dirname, 'dist/build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      // compile ts
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        query: {
          compilerOptions: {
            noEmit: false
          }
        }
      },

      // css loader
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },

      // image file loader
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]',
          publicPath: 'build/',
          outputPath: 'assets/'
        }
      }

    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    // pack vendor files and common chunks
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor_react', 'vendor_common'],
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['popup', 'options', 'content_script', 'background'],
      minChunks: 2
    }),

    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // copy files in public to dist
    new CopyWebpackPlugin([
      {
        context: 'public',
        from: {
          glob: '**/*',
          dot: false,
        },
        to: path.join(__dirname, 'dist/')
      }
    ])

  ]
};

if (process.env.NODE_ENV === 'production') {
  buildConfig.devtool = false;
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // clean output files
    new CleanWebpackPlugin([
      'dist'
    ]),
    // minify
    new webpack.optimize.UglifyJsPlugin(),
  ]);
} else {
  buildConfig.module.loaders = (buildConfig.module.loaders || []).concat([
    // tslint
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'tslint-loader',
      enforce: 'pre'
    }
  ]);

  buildConfig.plugins = (buildConfig.plugins || []).concat([
    // exclude source mapping for vendor libs
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      exclude: ['vendor_react.js', 'vendor_common.js']
    }),
  ]);
}

module.exports = buildConfig
