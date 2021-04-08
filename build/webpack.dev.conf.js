const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    open: true,
    inline:false,
    port: 8080,
    contentBase: baseWebpackConfig.externals.paths.dist,
    overlay: { warnings: true, errors: true }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map"
    })
  ]
});
module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});
