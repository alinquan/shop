/*
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    productionSourceMap: false,
    devServer: {
        open: true
    },
    configureWebpack: config => {
        if(process.env.NODE_ENV === 'production'){
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|\.css$/,
                        threshold: 10240,
                        deleteOriginalAssets: false
                    })
                ]
            }
        }
    }
}

// nginx*/

const ENV = process.env.NODE_ENV;
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/**
 * npm run xxx --mode <模式> ，可选模式只有以下三种，否则会默认 development:
 * development 模式用于 vue-cli-service serve
 * production 模式用于 vue-cli-service build 和 vue-cli-service test:e2e
 * test 模式用于 vue-cli-service test:unit
 */
const publicPaths = {
    development: '/',
    test: './',
    production: './'
};

// function addStyleResource (rule) {
//     rule.use('style-resource')
//         .loader('style-resources-loader')
//         .options({
//             patterns: [ // 需要全局导入的less数组
//                 // path.resolve(__dirname, './src/assets/css/style.less'),
//                 // path.resolve(__dirname, './src/assets/css/vantExpand.less'),
//             ]
//         });
// }

module.exports = {
    outputDir: './dist/', // 配置输入文件夹
    assetsDir: 'static', // 放静态资源的文件夹
    publicPath: publicPaths[ENV],
    devServer: {
        port: 5000,
        // host: '0.0.0.0',
        open: false
    },
    pages: {
        index: {
            entry: './src/main.js',
            template: './public/index.html', // 模板来源
            filename: 'index.html' // 在 dist/index.html 的输出
        }
    },
    lintOnSave: false, //关闭eslint规则
    chainWebpack: config => { // 直接在app.vue引入文件
        // const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        // types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 15, // 换算的基数(375的设计稿，25rem全屏，技术就是375 / 25 = 15)
                        // selectorBlackList  : ['vant','mu'], // 忽略转换正则匹配项
                        propList: ['*']
                    })
                ]
            },
            less: {
                modifyVars: {
                    // less vars，customize ant design theme
                    // 'primary-color': '#F5222D',
                    // 'link-color': '#F5222D',
                    // 'border-radius-base': '4px'
                },
                // DO NOT REMOVE THIS LINE
                javascriptEnabled: true
            }
        }
    },
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, './static'),
                    to: './static/',
                    ignore: ['.*']
                }
            ]),
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        // warnings: false,
                        drop_console: true,//console
                        drop_debugger: false,
                        pure_funcs: ['console.log']//移除console
                    }
                }
            })
        ]
    }
};
