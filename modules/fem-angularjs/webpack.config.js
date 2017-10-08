const path = require('path');

module.exports = {
    entry: {
        app: './example/app.js'
    },
    output: {
        filename: '[name].example.js',
        path: path.resolve(__dirname, 'umd')
    },
    resolve: {
        extensions: ['', '.js', '.json'],
        root: './example',
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    }

};