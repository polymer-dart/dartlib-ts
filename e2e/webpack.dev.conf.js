const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:9090',
            './src/index'
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        hot: true,
        port: 9090
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '..', 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(html|md)$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
/*            {
                test: require.resolve('marked'),
                use: [{
                    loader: 'expose-loader',
                    options: 'marked'
                }]
            }*/
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {verbose: true, root: path.resolve(__dirname)}),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './static'),
                to: 'static',
                ignore: ['.*']
            },
            {
                from: path.join(
                    path.resolve(__dirname, './node_modules/@webcomponents/webcomponentsjs/'),
                    '*.js'
                ),
                to: './webcomponentjs',
                flatten: true
            },
/*            {
                from: path.resolve(__dirname, './node_modules/@polymer/font-roboto-local/'),
                to: './font-roboto-local'
            }*/
        ]),
        new webpack.IgnorePlugin(/vertx/),
        new webpack.HotModuleReplacementPlugin(),
    ]
};
