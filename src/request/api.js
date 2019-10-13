/**
 * 请求api列表
 *
 * @author hengyumo
 * @version 0.1.2 2019/7/9
 */

const root = 'http://localhost:10001'
// const root = '/root'

const api = {
  cyszUserRegister: ['post', '/cysz/user/register'],
  cyszUserLogin: ['post', '/cysz/user/login'],
  createCaptcha: ['get', '/system/captcha/create'],
  foodFindAllPagedU: ['get', '/cysz/food/u/page'],
  cyszUserGetSelf: ['get', '/cysz/user/self'],
  cyszUserRecharge: ['get', '/cysz/user/recharge'],
  orderCreateOrder: ['post', '/cysz/order/create'],
  orderFindAllPagedU: ['get', '/cysz/order/u/page'],
  orderRefund: ['get', '/cysz/order/refund'],
  orderArrived: ['get', '/cysz/order/arrived']
}

export { root, api }
