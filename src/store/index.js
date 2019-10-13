import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = true
/* eslint-disable */
export default new Vuex.Store({
  state: {
    currentUser: {},
    foodSelected: [

    ]
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user
    },
    currentUserAddMoney(state, num) {
      state.currentUser.balance += Number(num)
    },
    setFoodSelected(state, foods) {
      state.foodSelected = foods
    },
    addFoodToSelected(state, food) {
      state.foodSelected.push(food)
    },
    clearFoodSelected(state) {
      state.foodSelected = []
    },
    foodSelectedAdd(state, id) {
      for (let food of state.foodSelected) {
        if (food.id === id) {
          food.num ++
          food.sumPrice = food.num * food.price
        }
      }
    },
    foodSelectedSub(state, id) {
      for (let food of state.foodSelected) {
        if (food.id === id) {
          if (food.num > 0) {
            food.num --
            food.sumPrice = food.num * food.price
            if (food.num === 0) {
              let foods = []
              for (let f of state.foodSelected) {
                if (f.num !== 0) {
                  foods.push(f)
                }
              }
              state.foodSelected = foods
            }
          }
        }
      }
    },
    recharge(state, newBalance) {
      state.currentUser.balance = newBalance
    }
  },
  getters: {
  },
  actions: {

  },
  modules: {
  },
  plugins: debug ? [createLogger()] : []   // 是否开启vuex的debug模式
})
