const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: `index.js`,
        library: { type: 'module' },
    },
    experiments: { outputModule: true },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
            },
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            }
        ],
    },
    performance: {
        hints: false,
    },
    stats: 'minimal',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
};
