<template>
  <div id="foodList" class="foodList">
    <common-header :tittle="title" :showback="false"/>
    <mt-swipe :auto="4000">
      <mt-swipe-item><img alt="滚动图1" src="../../assets/imgs/swipe-1.jpg"></mt-swipe-item>
      <mt-swipe-item><img alt="滚动图2" src="../../assets/imgs/swipe-2.jpg"></mt-swipe-item>
      <mt-swipe-item><img alt="滚动图3" src="../../assets/imgs/swipe-3.jpg"></mt-swipe-item>
    </mt-swipe>
    <ul class="food-list" v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="loading"
        :infinite-scroll-distance="10">
      <li v-for="item in foodList" class="food-item" @click="toDetail(item)">
        <img alt="菜品图片" :src="item.image">
        <div class="food-item-right">
          <h3 class="title">{{item.title}}</h3>
          <p class="detail">{{item.detail}}</p>
          <p class="price">￥{{item.price}}</p>
        </div>
      </li>
    </ul>
    <p v-if="!notMore" class="showLoading">
      <mt-spinner style="width: 35px;height: 35px;" type="fading-circle"></mt-spinner>
      加载中...
    </p>
    <p v-else style="padding: 0.4rem 0 1.8rem 0;background: #f4f6f2;border-top: 1px solid #eee;">没有更多了...</p>
    <mt-badge class="badge" size="small" color="red">{{allNum}}</mt-badge>
    <img @click="showPay" class="cart" src="../../assets/imgs/cart.png">

    <div class="pay-panel" v-if="isShowPay">
      <div class="top">
        <h2>已选商品</h2>
        <img src="../../assets/imgs/clear.png">
        <p @click="clearFoodSelected">清空</p>
        <img class="close" @click="closePay" src="../../assets/imgs/close.png">
      </div>
      <div v-for="item in foodSelected" class="foodSelected">
        <h3 class="title">{{item.title}}</h3>
        <p class="price">￥{{item.sumPrice}}</p>
        <img @click="numSub(item.id)" src="../../assets/imgs/sub.png">
        <p class="num">{{item.num}}</p>
        <img @click="numAdd(item.id)" src="../../assets/imgs/add.png">
      </div>
      <p v-if="foodSelected.length === 0" style="margin: 0.6rem 0;">你还没有选购任何菜品哦~</p>
      <div class="bottom">
        <h2>总计：￥{{allPrice}}</h2>
        <div class="pay-button" @click="payOrder">去结算</div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {MessageBox, Toast} from 'mint-ui'
import {root} from '../../request/api'

export default {
  name: 'foodList',
  components: {
    commonHeader
  },
  data () {
    return {
      title: '串意十足',
      pageNumber: 0,
      pageSize: 10,
      loading: false,
      isShowPay: false,
      notMore: false,
      foodList: [],
      foodSelected: [
      ]
    }
  },
  computed: {
    allPrice() {
      let sum = 0
      for (let food of this.foodSelected) {
        sum += Number(food.sumPrice)
      }
      return sum
    },
    allNum() {
      let allNum = 0
      for (let item of this.foodSelected) {
        allNum += item.num
      }
      return allNum
    }
  },
  methods: {
    numAdd(id) {
      this.$store.commit('foodSelectedAdd', id)
    },
    numSub(id) {
      this.$store.commit('foodSelectedSub', id)
      this.foodSelected = this.$store.state.foodSelected
    },
    payOrder() {
      if (this.foodSelected <= 0) {
        Toast('请选择菜品后再进行支付')
        return
      }
      let balance = this.$store.state.currentUser.balance
      if (balance < this.allPrice) {
        MessageBox.confirm(`您的余额为${balance}，已不足支付，是否前去充值？`).then(action => {
          this.$router.push({name: 'recharge'})
        }).catch(res => Toast('操作取消'))
      }
      else {
        MessageBox.confirm(`您确认支付订单吗，总计价格${this.allPrice}？`).then(action => {
          this.$requests.orderCreateOrder(this.foodSelected)
            .then(res => {
              Toast('支付成功')
              this.foodSelected = []
              this.$store.commit('clearFoodSelected')
              this.$router.push({name: 'orderDetail', params: res})
            })
        }).catch(res => Toast('支付取消'))
      }
    },
    clearFoodSelected() {
      this.foodSelected = []
      this.$store.commit('clearFoodSelected')
    },
    showPay () {
      this.isShowPay = true
    },
    closePay () {
      this.isShowPay = false
    },
    loadMore() {
      this.loading = true
      if (this.notMore) {
        return
      }
      setTimeout(() => {
        this.$requests.foodFindAllPagedU({pageNumber:this.pageNumber, pageSize:this.pageSize})
          .then(res => {
            let foodList = res.content
            if (foodList.length === 0) {
              this.notMore = true
              this.loading = false
              return
            }
            this.pageNumber ++
            for (let food of foodList) {
              food.image = root + food.image
              this.foodList.push(food)
            }
            this.loading = false
            if (res.totalElements === foodList.length) {
              this.notMore = true
            }
          }).catch(res => this.loading = false)
      }, 1000)
    },
    toDetail(item) {
      this.$router.push({
        name: 'foodDetail',
        params: item
      })
    }
  },
  mounted () {
    this.foodList = []
    this.foodSelected = []
    for (let food of this.$store.state.foodSelected) {
      if (food.num !== 0) {
        this.foodSelected.push(food)
      }
    }
    this.$store.commit('setFoodSelected', this.foodSelected)
  }
}
</script>

<style scoped lang="less">
  @import "./foodList";
</style>
