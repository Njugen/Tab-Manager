const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
    entry: {
        options: path.resolve(__dirname, "src/index.tsx"), // Top react component for option's page.
        sidepanel: path.resolve(__dirname, "src/sidepanel.tsx"), // Top react component for sidepanel
        background: path.resolve(__dirname, "src/webextension/background/background.ts"), // Script running in the browser's internal environment
        contentScript: path.resolve(__dirname, "src/webextension/contentScript/contentScript.ts"), // Script running in the plugin's UI (option's page, sidepanels, controller)
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
                    from: path.resolve(__dirname, "src/webextension/manifest.json"), 
                    to: path.resolve("dist")
                },
                { 
                    from: path.resolve(__dirname, "brand"), 
                    to: path.resolve(__dirname, "dist/brand")
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