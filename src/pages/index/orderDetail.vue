<style scoped lang="less">
  .top {
    background: #ffcc00;
    padding-top: 1rem;
    padding-bottom: 0.2rem;
    h1 {
      text-align: left;
      margin-left: 1rem;
      color: #343131;
    }
  }
  .food-list {
    margin: 0.25rem;
    margin-top: 0.5rem;
    padding-bottom: 0.5rem;
    background: #fefefe;

    .food {
      display: flex;
      flex-direction: row;
      justify-content: left;

      img {
        width: 1.1rem;
        height: 1.1rem;
        margin: 0.3rem;
      }

      .num {
        line-height: 1.2rem;
        font-size: 10px;
        margin-right: 1rem;
      }
      .price {
        line-height: 1rem;
        font-weight: bold;
        font-size: 16px;
      }
    }
    .line {
      display: flex;
      flex-direction: row;
      justify-content: left;
      border-top: 1px solid #eee;

      img {
        width: 1rem;
        height: 1rem;
        margin: 0.3rem;
      }
      .all-price {
        margin-left: 1.2rem;
        color: #cc352f;
        font-weight: bold;
        font-size: 16px;
      }
    }
    .option {
      display: flex;
      flex-direction: row;
      justify-content: left;
    }
  }

  .title {
    color: #000;
    line-height: 1rem;
    font-size: 14px;
    text-align: left;
    width: 4.7rem;
    margin-left: 0.3rem;
  }
</style>
<template>
  <div id="orderDetail" class="orderDetail">
    <common-header :tittle="title" :showback="true"/>
    <div class="top">
      <h1>{{order.status}}</h1>
    </div>
    <div class="food-list">
      <div class="food" v-for="item in order.orderItems">
        <img alt :src="root + item.food.image">
        <p class="title">{{item.food.title}}</p>
        <p class="num">x{{item.food.num}}</p>
        <p class="price">￥{{item.price}}</p>
      </div>
      <div class="line">
        <img alt src="../../assets/imgs/all-price.png">
        <p class="title">总价</p>
        <p class="all-price">￥{{order.allPrice}}</p>
      </div>
      <div class="option">

        <mt-button @click="refund(order.id)" :disabled="order.status !== '订单配送中'"
                   style="background:#fefefe;box-shadow: 2px 2px 3px #eee;border: 1px solid #eee;margin-left: 5.3rem;"
                   size="small">退款</mt-button>

        <mt-button @click="delivery(order.id)" :disabled="order.status !== '订单配送中'"
                   style="background:#fefefe;box-shadow: 2px 2px 3px #eee;border: 1px solid #eee;margin-left: 0.3rem;"
                   size="small">确认送达</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {MessageBox, Toast} from 'mint-ui'
import {root} from '../../request/api'

export default {
  name: 'orderDetail',
  components: {
    commonHeader
  },
  data () {
    return {
      title: '订单详情',
      order: {},
      root
    }
  },
  computed: {},
  methods: {
    refund(id) {
      MessageBox.confirm(`您确认退款吗，退款之后金额会返回到您的账户。`).then(action => {
        this.$requests.orderRefund({id}).then(res => {
          this.order = res
          this.$store.commit('currentUserAddMoney', this.order.allPrice)
          Toast('退款成功')
        })
      }).catch(res => Toast('取消退款'))
    },
    delivery(id) {
      MessageBox.confirm(`您确认已经送达吗，确认送达之后不可以退款。`).then(action => {
        this.$requests.orderArrived({id}).then(res => {
          this.order = res
          Toast('订单已送达')
        })
      }).catch(res => Toast('取消退款'))
    }
  },
  created () {
    this.order = this.$route.params
  }
}
</script>
