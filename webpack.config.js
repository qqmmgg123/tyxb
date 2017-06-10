var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var argv = require('yargs').argv;

var file = argv.file,
    src  = argv.src || 'pc',
    out  = 'public/js';

if (src === 'mobile') {
    src = 'mobilesrc';
    out = 'public/mobilejs';
} else {
    src = 'src';
}

var build_list = [
    'index_unlogged',
    'index_logged',
    'tags',
    'tag',
    'dream',
    'search',
    'user',
    'forgot',
    'account',
    'reset',
    'emails',
    'message',
    'default',
];

var file = 'all';

var entry_opts = {};

if (file === 'all') {
    build_list.forEach(function(app) {
        entry_opts[app] = './' + src + '/' + app + '.js';
    });
} else {
    entry_opts[file] = './' + src + '/' + file + '.js';
}

var config =  {
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(), 
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
        //supresses warnings, usually from module minification
                warnings: false
            }
        })*/
    ],
    //入口文件输出配置
    entry: entry_opts,
    output: {
        path: path.resolve(__dirname, out),
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            { 
                test: /\.js[x]?$/, 
                loaders: ['babel'],
                include: path.join(__dirname, src)
            }
        ]
    },
    //其它解决方案配置
    resolve: {
        root: [
            path.resolve('./' + src)
        ], //绝对路径
        extensions: ['', '.js', '.jsx']
    },

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};

module.exports = config;
