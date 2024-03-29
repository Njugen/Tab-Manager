const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
    
    entry: {
        sidepanel: path.resolve("./src/sidepanel.tsx"),
        background: path.resolve("./src/webextension/background/background.ts"),
        contentScript: path.resolve("./src/webextension/contentScript/contentScript.ts"),
        options: path.resolve("./src/index.tsx"),
    },
    module: {
        rules: [
            { use: "ts-loader", test: /\.tsx?$/, exclude: /node_modules/ }, 
            { test: /\.scss$|css$/, use: [ 
               "style-loader", "css-loader",
                { 
                    loader: "postcss-loader", 
                    options: {
                        postcssOptions: {
                            ident: "postcss",
                            plugins: [tailwindcss, autoprefixer]
                        }
                    }
                }, 
            ]}, 

        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { 
                    from: path.resolve("src/webextension/manifest.json"), 
                    to: path.resolve("dist")
                },
                { 
                    from: path.resolve("brand"), 
                    to: path.resolve("dist/brand")
                }
            ]
        }),
        new HtmlPlugin({
            title: "Sidepanel",
            filename: "sidepanel.html",
            chunks: ["sidepanel"]
        }), 
        new HtmlPlugin({
            title: "Tab Manager",
            filename: "options.html",
            chunks: ["options"]
        }),
        
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js", ".css", ".scss"]
    },
    output: {
        filename: "[name].js"  // in /dist
    }
}; 