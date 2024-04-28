const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");


module.exports = (env) => merge(common(env), {
    mode: "production",
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ]
});