import axios from 'axios'
import { Spin } from 'view-design' // 引入loading

let baseUrl = process.env.NODE_ENV === 'development' ? '/api' : ''

export default class Api {

  /**
   * get请求方法
   * @param {String} url  传入的路径
   * @param {*} params  传入的参数
   */
  static get(url, params) {
    return new Promise((resolve, reject) => {
      axios.get(baseUrl + url, {
        params
      }).then(res => {
        if (Number(res.data.statusCode === 200) || Number(res.data.code === 200)) {
          // 如果code === 200  直接返回结果
          resolve(res.data.data)
        } else {
          console.log(res, "err")
        }

      }).catch(err => {
        reject(err)
      })
    })
  }


  /**
   * post 请求方法
   * @param {String} url  传入的路径
   * @param {Object} params  传入的参数
   */
  static post(url, params) {
    return new Promise((resolve, reject) => {
      axios.post(baseUrl + url, params).then(res => {
        if (Number(res.data.statusCode === 200) || Number(res.data.code === 200)) {
          // 如果code === 200  直接返回结果
          resolve(res.data.data)
        } else {
          console.log(res.data, "err")
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 显示 showLoading
   * @param {Boolean} type 
   */
  static showLoading(type) {
    if (type) {
      Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 18
              }
            }),
            h('div', 'Loading')
          ])
        }
      })
    }
  }

  /**
   * 隐藏 loading
   */
  static hideLoading() {
    Spin.hide()
  }

  /**
   * 时间格式化
   * @param {String} timeData  传入的时间
   * @param {Number} type  1 有时分秒  0 无时分秒
   * @param {String} separator 自定义分隔符
   */
  static timeStamp(timeData, type = 1, separator = '-') {
    let date = new Date(timeData)
    let year = date.getFullYear()
    let mouth = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    let hour = ''
    let min = ''
    let sec = ''
    let hourMinSe = ''
    if (type) {
      hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      sec = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      hourMinSe = ` ${hour}:${min}:${sec}`
    }
    let time = `${year}${separator}${mouth}${separator}${day}${hourMinSe}`

    return time
  }
}