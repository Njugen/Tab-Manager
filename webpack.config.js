module.exports = {
      mode: "development",
  
      entry: [ "./src/test.tsx"/*main*/ ], 
      output: {
          filename: "index.js"  // in /dist
      },
      resolve: {
          // Add `.ts` and `.tsx` as a resolvable extension.
          extensions: [".ts", ".tsx", ".js", ".css", ".scss"]
      },
      module: {
          rules: [
              { use: "ts-loader", test: /\.tsx?$/, exclude: /node_modules/ }, 

              { test: /\.scss$/, use: [ 
                  { loader: "style-loader" },  // to inject the result into the DOM as a style block
                  { loader: "css-modules-typescript-loader"},  // to generate a .d.ts module next to the .scss file (also requires a declaration.d.ts with "declare modules '*.scss';" in it to tell TypeScript that "import styles from './styles.scss';" means to load the module "./styles.scss.d.td")
                  { loader: "css-loader", options: { modules: true } },  // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
                  { loader: "sass-loader" },  // to convert SASS to CSS
                  { loader: "sass" }, 
                  { loader: "scss" },
                  { loader: "css" }, 
                  { loader: "style" },  
                  // NOTE: The first build after adding/removing/renaming CSS classes fails, since the newly generated .d.ts typescript module is picked up only later
              ] }, 
  
          ]
      }
  }; 