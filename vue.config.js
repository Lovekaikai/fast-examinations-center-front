const path = require("path");
require('babel-polyfill');

let index = require('./mock/index')

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://fdp.cntracechain.com', //对应自己的接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },

  lintOnSave: false,
  // 配置全局less文件
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "./src/assets/style/style.less")]
    }
  },


  // 配置路径别名
  configureWebpack: {
    resolve: {
      alias: {
        'api': '@/api',
        'assets': '@/assets',
        'components': '@/components',
        'layout': '@/layout',
        'router': '@/router',
        'store': '@/store',
        'utils': '@/utils',
        'views': '@/views',
      }
    }
  },
  // 配置babel-polyfill
  transpileDependencies: [
    'iview',
    'axios'
  ],

  // chainWebpack(config) {
  //   // 在chainWebpack中添加下面的代码
  //   config.entry('main').add('babel-polyfill') // main是入口js文件
  // },
  // configureWebpack(config) {
  //    //入口文件
  //    config.entry.app = ['babel-polyfill', './src/main.js'];
  // },
  css: {
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
        importLoaders: 1,
      },
      less: {
        // 这里的选项会传递给 postcss-loader
        importLoaders: 1,
      }
    }
  }
}