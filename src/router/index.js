import Vue from 'vue'
import Router from 'vue-router'
import { Indicator } from 'mint-ui'
const LOGIN_PAGE_NAME = 'login'
const REGISTER_PAGE_NAME = 'register'

Vue.use(Router)
// 需要左方向动画的路由用this.$router.to('****')
Router.prototype.togo = function (path) {
  this.isleft = true
  this.isright = false
  this.push(path)
}
// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (path) {
  this.isright = true
  this.isleft = false
  this.push(path)
}
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
  this.isright = true
  this.isleft = false
  this.go(-1)
}
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
  this.isright = true
  this.isleft = false
}
// 点击浏览器前进按钮执行
Router.prototype.togoin = function () {
  this.isright = false
  this.isleft = true
}

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: (resolve) => require(['@/pages/index'], resolve),
      redirect: '/foodList',
      children: [
        {
          path: '/foodList',
          name: 'foodList',
          component: (resolve) => require(['@/pages/index/foodList'], resolve)
        },
        {
          path: '/orderList',
          name: 'orderList',
          component: (resolve) => require(['@/pages/index/orderList'], resolve)
        },
        {
          path: '/user',
          name: 'user',
          component: (resolve) => require(['@/pages/index/user'], resolve)
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['@/pages/login'], resolve)
    },
    {
      path: '/register',
      name: 'register',
      component: (resolve) => require(['@/pages/register'], resolve)
    },
    {
      path: '/foodDetail',
      name: 'foodDetail',
      component: (resolve) => require(['@/pages/index/foodDetail'], resolve)
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: (resolve) => require(['@/pages/index/orderDetail'], resolve)
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: (resolve) => require(['@/pages/index/recharge'], resolve)
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && to.name !== LOGIN_PAGE_NAME && to.name !== REGISTER_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  }
  else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next()
  }
  else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'foodList'
    })
  }
  else {
    next()
  }
})

router.afterEach(to => {
})

export default router
