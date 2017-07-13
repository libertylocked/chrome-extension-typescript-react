import * as path from "path";
import * as webpack from "webpack";

// webpack plugins
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// postcss plugins
const autoprefixer = require("autoprefixer");

const isProd = (): boolean => {
  return process.env.NODE_ENV === "production";
};

const buildConfig: webpack.Configuration = {
  entry: {
    background_script: path.join(__dirname, "src/background_script/index.ts"),
    content_script: path.join(__dirname, "src/content_script/index.ts"),
    options: path.join(__dirname, "src/options/index.tsx"),
    popup: path.join(__dirname, "src/popup/index.tsx"),
  },
  // tslint:disable-next-line:no-object-literal-type-assertion
  module: {
    rules: [
      // compile ts
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        test: /\.tsx?$/,
      },
      // css loader
      // source maps are generated only for dev builds
      // css compression is only used for prod builds
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader", options: { sourceMap: !isProd() } },
          {
            loader: "css-loader", options: {
              localIdentName: isProd() ? "[hash:base64]" : "[path][name]__[local]__[hash:base64:6]",
              minimize: isProd(),
              modules: true,
              sourceMap: !isProd(),
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer({
                browsers: [
                  ">1%",
                  "last 4 versions",
                  "Firefox ESR",
                  "not ie < 9",
                ],
              })],
              sourceMap: !isProd(),
            },
          },
        ],
      },
      // file loader for media assets
      {
        exclude: [
          /\.(html?)$/,
          /\.(ts|tsx|js|jsx)$/,
          /\.css$/,
          /\.json$/,
        ],
        loader: "file-loader",
        query: {
          name: "[hash].[ext]",
          outputPath: "media/",
          publicPath: "build/",
        },
      },
    ],
  } as webpack.NewModule,
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
    }]),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};

if (isProd()) {
  // Production build tweaks
  buildConfig.devtool = false;
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify("production") },
    }),
    // clean output files
    new CleanWebpackPlugin(["dist"]),
    // minify
    new webpack.optimize.UglifyJsPlugin(),
  ]);
} else {
  // Development build tweaks
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

export default buildConfig;
