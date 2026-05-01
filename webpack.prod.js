const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./src/app.js",
  output: {
    filename: "main-[contentHash].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./public/index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
      },
      {
        test: /rot\.min\.js$/,
        loader: "exports?ROT"
      }
    ]
  }
};
