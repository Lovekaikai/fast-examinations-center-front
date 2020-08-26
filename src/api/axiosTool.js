import Vue from 'vue'
import axios from 'axios'
// import api from './api'
import api from './api'
import { Message } from 'view-design'
import VueCookies from 'vue-cookies'
let baseUrl = process.env.NODE_ENV === 'development' ? '/api' : ''
import { resetTokenAndClearUser } from '../utils'

import router from './../router/index';
// let baseUrl = ''

// 取消请求
let CancelToken = axios.CancelToken;
let source = CancelToken.source()
// 设置默认请求头, 如果每次请求都携带token 建议写在这里 如果不需要可以取消这一步
// axios.defaults.headers = {
//     'X-Requested-With': 'XMLHttpRequest'
// }

// 请求超时间限制
axios.defaults.timeout = 20000

// 开始设置请求  发起的拦截处理
// config 代表发起请求的参数的实体
// 请求拦截
axios.interceptors.request.use(config => {
    config.headers['token'] = VueCookies.get('fdp-token') //增加请求头
    // 得到参数中的requestName字段, 用于决定下次发起请求, 取消对应的相同字段的请求
    // 如果没有requestName就默认添加一个不同的时间戳
    // let requestName
    // if (config.method === 'post') {
    //     if (config.data && config.data.requestName) {
    //         requestName = config.data.requestName
    //     } else {
    //         requestName = new Date().getTime()
    //     }
    // } else {
    //     if (config.params && config.params.requestName) {
    //         requestName = config.params.requestName
    //     } else {
    //         requestName = new Date().getTime()
    //     }
    // }

    // // 判断 如果这里拿到的参数中的requestName在上一次请求中已经存在, 就取消上一次的请求
    // if (requestName) {
    //     if (axios[requestName] && axios[requestName].cancel) {
    //         axios[requestName].cancel()
    //     }
    //     config.cancelToken = new CancelToken(c => {
    //         axios[requestName] = {}
    //         axios[requestName].cancel = c
    //     })
    // }
    return config
}, error => {
    return Promise.reject(error)
})

// 响应的拦截处理
axios.interceptors.response.use(config => {
        api.hideLoading() // 隐藏loading
        // 返回请求正确的结果
        const { data } = config
        switch (data.code) {
            case 400:
                Message.error({background: true,content: '错误请求'});
                break
            case 401:
               
                resetTokenAndClearUser()
               
                // alert('未授权,请重新登录')
                //阻止之后的请求
                source.cancel('不想请求了');
                router.replace({name: 'login'})
                break
            case 403:
                Message.error({background: true,content: '拒绝访问'});
                break
            case 405:
                Message.error({background: true,content: '请求方法未允许'});
                break
            case 408:
                Message.error({background: true,content: '请求超时'});
                break
            case 500:
                Message.error({background: true,content: data.message});
                break
            default:
                break
        }

    return config
}, error => {
    api.hideLoading() // 隐藏loading
    // 错误的请求结果处理,这里的代码根据后台的状态码来决定错误的输出信息
    if (error && error.response) {
        switch (error.response.status) {
            case 404:
                Message.error({background: true,content: '请求错误,未找到该资源'});
                error.message = '请求错误,未找到该资源'
                break
            case 501:
                Message.error({background: true,content: '网络未实现'});
                error.message = '网络未实现'
                break
            case 502:
                Message.error({background: true,content: '网络错误'});
                error.message = '网络错误'
                break
            case 503:
                Message.error({background: true,content: '服务不可用'});
                error.message = '服务不可用'
                break
            case 504:
                Message.error({background: true,content: '网络超时'});
                error.message = '网络超时'
                break
            case 505:
                Message.error({background: true,content: 'http版本不支持该请求'});
                error.message = 'http版本不支持该请求'
                break
            default:
                error.message = `连接错误${error.response.status}`
                break
        }
} else {
    error.message = '连接到服务器失败'
    Message.error({background: true,content: '连接到服务器失败'});
}
    return Promise.reject(error.message)
})

// 将axios的 get 方法, 绑定到vue上面 $get
/**
 * get 请求方法
 * @param {String} url 传入的路径
 * @param {*} params  传入的参数
 */
Vue.prototype.$get = (url, params, loading = false) => {
    api.showLoading(loading) // 显示loading
    return new Promise((resolve, reject) => {
        // console.log("213333333333",Object.assign(params,{ cancelToken: source.token}))


        // if (params) {
        //     params.cancelToken = source.token
        // } else {
        //     params = {
        //         cancelToken: source.token
        //     }
        // }
        axios.get(baseUrl + url, {params,cancelToken: source.token}).then(res => {
            // api.showLoading(loading)  // 显示loading
            console.log(res)
            if (res.data.code && Number(res.data.code) === 200) {
                // 如果code === 200 直接返回结果
                resolve(res.data.data)
            } else {
                reject(res)
                console.log(res, "err")
            }

        }).catch(err => {
            api.hideLoading() // 隐藏loading
            reject(err)
        })
    })
}

// 将axios的 post 方法, 绑定到vue实例上 $post
/**
 * post 请求方法
 * @param {String} url  传入的路径
 * @param {Object} params  传入的参数
 */
Vue.prototype.$post = (url, params, loading = false) => {
    api.showLoading(loading) // 显示loading
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + url, params, {
            cancelToken: source.token
        }).then(res => {
            if (Number(res.data.code) === 200) {
                // 如果code === 200  直接返回结果
                resolve(res.data.data)
            } else {
                console.log(res.data, "err")
                reject(res.data)
                // Message.error({ background: true, content: res.data.message });
            }
        }).catch(err => {
            // api.hideLoading()  // 隐藏loading
            reject(err)
        })
    })
}


// 请求示例
// requestName 为多余的参数 作为请求的标识，下次发起相同的请求，就会自动取消上一次还没有结束的请求
// 比如正常的请求参数只有一个 name: '123'，但是这里我们需要额外再加上一个 requestName
/**
    this.$post(url, { name: '123', requestName: 'post_1' })
        .then(res => {
            console.log(`请求成功：${res}`)
        })
 */


//  导出axios
export default axios