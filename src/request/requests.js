import router from './router'
import axios from 'axios'
import { Toast } from 'mint-ui'
import {vm} from '../main'

/**
 * 按照路由接口生成对应的请求函数
 *
 * @author hengyumo
 * @version 1.0.0 2019/9/21
 */
let ajax = axios.create({
  timeout: 10000
})

ajax.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

ajax.interceptors.response.use(
  function (res) {
    return res
  },
  function (error) {
    return Promise.reject(error)
  }
)

function doRequest (method, url, params, data) {
  let header = {
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/json',
    charset: 'UTF-8',
    token: localStorage['token']
  }
  return new Promise((resolve, reject) => {
    ajax({
      method: method,
      url: url,
      params: params,
      data: data,
      headers: header
    }).then(
      res => {
        const resData = res.data.data
        if (res.data.code !== 200) {
          Toast(res.data.message)
          console.log(`${method} ${url} fail!`, res.data)
          if (res.data.code === 1004) {
            localStorage.setItem('token', '')
            vm.$router.push({name: 'login'})
          }
          reject(res.data)
        } else {
          console.log(`${method} ${url} success!`, res.data)
          resolve(resData)
        }
      }
    ).catch(
      err => {
        console.log(`${method} ${url} fail!`, err)
        reject(err)
      }
    )
  })
}

function Request (route) {
  this.route = route
  return (params, data) => {
    const [method, url] = this.route
    return new Promise((resolve, reject) => {
      if (!data) {
        if (method === 'post' || method === 'put') {
          data = params
          params = {}
        } else {
          data = {}
        }
      }
      doRequest(method, url, params, data)
        .then(resData => resolve(resData))
        .catch(err => reject(err))
    })
  }
}

function createRequests () {
  const requests = {}
  Object.keys(router).forEach((key) => {
    requests[key] = new Request(router[key])
  })
  return requests
}

const requests = createRequests()

export { requests }
