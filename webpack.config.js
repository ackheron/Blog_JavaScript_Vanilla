const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        main: path.resolve(__dirname, "src/index.js"),
        form: path.resolve(__dirname, "src/form/form.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.scss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "src/index.html"),
            chunks: ["main"],
        }),
        new HtmlWebpackPlugin({
            filename: "form.html",
            template: path.resolve(__dirname, "src/index.html"),
            chunks: ["form"],
        }),
    ],
    devtool: "source-map",
    mode: "development",
    devServer: {
        static: path.resolve(__dirname, "./dist"),
        open: true,
        port: 4000,
        watchFiles: ["./src/**"],
        hot: true,
    },
};
