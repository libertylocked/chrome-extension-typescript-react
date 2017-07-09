import * as path from "path";
import * as webpack from "webpack";

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const buildConfig: webpack.Configuration = {
  entry: {
    background: path.join(__dirname, "src/background/index.ts"),
    content_script: path.join(__dirname, "src/content_script/index.ts"),
    options: path.join(__dirname, "src/options/index.tsx"),
    popup: path.join(__dirname, "src/popup/index.tsx"),
    vendor_common: ["jquery", "moment"],
    vendor_react: ["react", "react-dom"],
  },
  module: {
    rules: [
      // compile ts
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        query: {
          compilerOptions: {
            noEmit: false,
          },
        },
        test: /\.tsx?$/,
      },
      // css loader
      {
        loader: "style-loader!css-loader",
        test: /\.css$/,
      },
      // image file loader
      {
        loader: "file-loader",
        query: {
          name: "[hash].[ext]",
          outputPath: "assets/",
          publicPath: "build/",
        },
        test: /\.(jpg|png|svg|gif)$/,
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/build"),
  },
  plugins: [
    // pack vendor files and common chunks
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: Infinity,
      names: ["vendor_react", "vendor_common"],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      chunks: ["popup", "options", "content_script", "background"],
      minChunks: 2,
      name: "common",
    }),
    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // copy files in public to dist
    new CopyWebpackPlugin([{
      context: "public",
      from: {
        dot: false,
        glob: "**/*",
      },
      to: path.join(__dirname, "dist/"),
    },
    ]),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};

if (process.env.NODE_ENV === "production") {
  buildConfig.devtool = false;
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    // clean output files
    new CleanWebpackPlugin([
      "dist",
    ]),
    // minify
    new webpack.optimize.UglifyJsPlugin(),
  ]);
} else {
  const buildConfigModule = buildConfig.module as webpack.NewModule;
  buildConfigModule.rules = (buildConfigModule.rules || []).concat([
    // tslint
    {
      enforce: "pre",
      exclude: /node_modules/,
      loader: "tslint-loader",
      test: /\.tsx?$/,
    },
  ]);
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    // exclude source mapping for vendor libs
    new webpack.SourceMapDevToolPlugin({
      exclude: ["vendor_react.js", "vendor_common.js"],
      filename: "[file].map",
    }),
  ]);
}

module.exports = buildConfig;
