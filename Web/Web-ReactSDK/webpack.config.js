const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = "style-loader";

const config = {
  entry: "./src/apiServices.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "meethour-apis.min.js",
    clean: true,
    libraryTarget: "umd",
    library: "ApiServices",
    umdNamedDefine: true,
    libraryExport: "default",
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    console.log("development");
    config.mode = "development";
  }
  return config;
};
