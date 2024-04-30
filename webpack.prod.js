const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => merge(common(env), {
    mode: "production",
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            })
        ]
    }
});