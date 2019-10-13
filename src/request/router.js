/**
 * 根据api生成请求路由
 *
 * @author hengyumo
 * @version 0.1.2 2019/7/9
 */
import { root, api } from './api'

const routes = api

function createRouter () {
  Object.keys(routes).forEach(key => {
    routes[key][1] = root + routes[key][1]
  })
  return routes
}

export default createRouter()
