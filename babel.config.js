module.exports = {
  presets: [
    ['@vue/app',
      {
        useBuiltIns: 'entry', // src全局es5编译
        debug: true,
        polyfills: ['es6.promise', 'es6.array.find-index', 'es7.array.includes', 'es6.string.includes']
        //项目中用到的polyfill
      }
    ]
  ]
}