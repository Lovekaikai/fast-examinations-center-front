
const bodyParser = require('body-parser'); //对post请求的请求体进行解析模块
// 引入各个文件
const express = require('express')
const app = express()
const router = express.Router()
app.use(bodyParser.json());//数据JSON类型
app.use('/api', router)



//资源引入
const goodList = require('./goodList.json')
const userAccountList = require('./userAccountList.json')

module.exports = (app)=> {
        app.get('/goodList', (req, res, next) => {
          res.json(goodList)
        })
        //
        app.post('/userAccount/list', (req, res, next) => {
          res.json(userAccountList)
        })
  }