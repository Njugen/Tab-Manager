const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = (env) => {
    const distFolder = () => {
        // Return name of the dist folders depending on what browser the plugin is being built for
        let name = "dist-chrome";

        if(env.browser === "firefox"){
            name = "dist-firefox";
        }

        return name;
    }

    const originManifest = () => {
        // Return path to manifest.
        // Different browsers might use different manifest formats.
        // Return path to chromium manifest per default.

        let path = "src/webextension";

        if(env.browser === "firefox"){
            return `${path}/manifest_firefox.json`;
        }

        return `${path}/manifest_chrome.json`;
    }

    return {
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
                        from: path.resolve(__dirname, originManifest()), 
                        to: path.resolve(`${distFolder()}/manifest.json`)
                    },
                    { 
                        from: path.resolve(__dirname, "brand"), 
                        to: path.resolve(__dirname, `${distFolder()}/brand`)
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
            filename: "[name].js",  // in /dist
            path: path.join(__dirname, distFolder())
        }
    }
    
}; 