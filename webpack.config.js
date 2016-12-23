var path = require('path')
var webpack = require('webpack')

module.exports = {
    // 入口文件
    entry: {
        main: './src/main.js'
    },
    output: {
        // 打包后输出的目录
        path: path.resolve(__dirname, './dist'),
        // 打包后资源文件的前缀
        publicPath: '/dist/',
        filename: '[name].js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            _: "underscore"
        })
    ],
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        // 别名
        alias: {
            vue: 'vue/dist/vue.js', //webpack打包时，需要设置别名
            components: path.join(__dirname, './src/components'),
            modules: path.join(__dirname, './node_modules'),
            store: path.resolve('src/store/') //常用工具方法
        }
    },
    // 处理不同后缀的文件
    module: {
        loaders: [
            {
                test: /\.js(x)*$/,
                exclude: /^node_modules$/,
                loader: 'babel'
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.css/,
                loader: `style-loader!css-loader!autoprefixer-loader?{ browsers: ['last 100 versions'] }!`
            },
            {
                test: /\.less/,
                exclude: /^node_modules$/,
                loader: `style-loader!css-loader!autoprefixer-loader?{ browsers: ['last 100 versions'] }!less-loader`
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=2000&name=[name].[ext]' //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    // webpack-dev-server配置
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    vue: {
        postcss: [
            require('autoprefixer')({
                browsers: ['last 100 versions']
            })
        ]
    },
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    devtool: '#source-map'
}

// 生产环境，运行npm run build则执行这里
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        // 环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // 压缩代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
}