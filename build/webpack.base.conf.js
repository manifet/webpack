const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
  assets: "assets/"
};
const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter(fileName => fileName.endsWith(".pug")); // for pug ext

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
    publicPath: "/"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/"
      },
      {
        test: /\.pug$/,
        loader: "pug-loader"
      },
      {
        test: /\.(woff(2)?|ttg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: `[name].[ext]`
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          {
            loader: "css-loader",
            options: { sourceMap: true }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: "./postcss.config.js"
              },
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      "~": "src"
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[hash].css`
    }),
    ...PAGES.map(
      page =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`, // .pug
          filename: `./${page.replace(/\.pug/, ".html")}` // .html
        })
    ),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.src}/images`,
          to: `${PATHS.assets}images`
        },
        {
          from: `${PATHS.src}/fonts`,
          to: `${PATHS.assets}fonts`
        },
        {
          from: `${PATHS.src}/static`,
          to: ""
        }
      ]
    })
  ]
};
