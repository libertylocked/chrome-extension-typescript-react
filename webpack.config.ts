import * as path from "path";
import * as webpack from "webpack";

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const buildConfig: webpack.Configuration = {
  entry: {
    background_script: path.join(__dirname, "src/background_script/index.ts"),
    content_script: path.join(__dirname, "src/content_script/index.ts"),
    options: path.join(__dirname, "src/options/index.tsx"),
    popup: path.join(__dirname, "src/popup/index.tsx"),
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
    // pack common chunks
    new webpack.optimize.CommonsChunkPlugin({
      chunks: ["background_script", "content_script"],
      minChunks: 2,
      name: "common_for_scripts",
    }),
    new webpack.optimize.CommonsChunkPlugin({
      chunks: ["popup", "options"],
      minChunks: 2,
      name: "common_for_ui",
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
      exclude: /^vendor.*.\.js$/,
      filename: "[file].map",
    }),
  ]);
}

module.exports = buildConfig;
