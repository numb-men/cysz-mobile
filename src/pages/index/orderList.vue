<style scoped lang="less">
  .showOrderList {

    p {
      margin: 0;
      padding: 0;
      line-height: 1rem;
      text-align: left;
    }
    .order {
      display: flex;
      flex-direction: row;
      justify-content: left;
      background: #fefefe;
      margin-bottom: 0.1rem;

      img {
        width: 1.6rem;
        height: 1.6rem;
        margin: 0.5rem 0.3rem;
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: start;

        .title {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          margin-top: 0.3rem;

          .shop-name {
            font-size: 14px;
            font-weight: bold;
            width: 5.5rem;
            margin-left: 0.3rem;
          }
          .status {

          }
        }

        .menu {
          display: flex;
          flex-direction: row;
          justify-content: left;

          .content {
            width: 3rem;
            height: 1rem;
            margin-left: 0.3rem;
            font-size: 11px;
            overflow: hidden;
          }
          .price {
            width: 2rem;
            height: 1rem;
            font-size: 13px;
            color: #cc352f;
            text-align: left;
            margin-right: 0.7rem;
          }
        }
      }
    }
  }

  .showLoading {
    padding-top: 0.5rem;
    background: #f4f6f2;
    padding-bottom: 1.3rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    line-height: 35px;
  }
</style>
<template>
  <div id="orderList" class="orderList">
    <common-header :tittle="title" :showback="false"/>
    <div class="showOrderList" v-infinite-scroll="loadMore"
         :infinite-scroll-disabled="loading"
         :infinite-scroll-distance="10">
      <div class="order" v-for="item in orderList" @click="toDetail(item.id)">
          <img alt :src="root + item.orderItems[0].food.image">
          <div class="right">
            <div class="title">
              <p class="shop-name">串意十足</p>
              <p class="status">{{item.status}}</p>
            </div>

            <div class="menu">
              <p class="content">{{item.content}}</p>
              <p class="price">￥{{item.allPrice}}</p>

              <mt-button :disabled="item.status !== '订单配送中'" @click.stop="refund(item.id)"
                         style="background:#fefefe;box-shadow: 2px 2px 3px #eee;border: 1px solid #eee;"
                         size="small">退款</mt-button>
            </div>
          </div>
        </div>
    </div>
    <p v-if="!notMore" class="showLoading">
      <mt-spinner style="width: 35px;height: 35px;" type="fading-circle"></mt-spinner>
      加载中...
    </p>
    <p v-else style="padding: 0.2rem 0 1.8rem 0;text-align: center;background: #f4f6f2;border-top: 1px solid #eee;">没有更多了...</p>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {MessageBox, Toast} from 'mint-ui'
import {root} from '../../request/api'

export default {
  name: 'orderList',
  components: {
    commonHeader
  },
  data () {
    return {
      title: '我的订单',
      pageNumber: 0,
      pageSize: 10,
      loading: false,
      notMore: false,
      orderList: [],
      root
    }
  },
  computed: {},
  methods: {
    toDetail(id) {
      for (let order of this.orderList) {
        if (order.id === id) {
          this.$router.push({name: 'orderDetail', params: order})
        }
      }
    },
    refund(id) {
      MessageBox.confirm(`您确认退款吗，退款之后金额会返回到您的账户。`).then(action => {
        this.$requests.orderRefund({id}).then(res => {
          for (let i = 0; i < this.orderList.length; i++) {
            let order = this.orderList[i]
            if (order.id === id) {
              let content = ''
              for (let i = 0; i < res.orderItems.length; i++) {
                let item = res.orderItems[i]
                content += item.food.title + (i === res.orderItems.length-1 ? '':'+')
              }
              res.content = content.substr(0, 7)
                + ( content.length >=7 ? '...':'')
              this.$set(this.orderList, i, res)
              this.$store.commit('currentUserAddMoney', order.allPrice)
              Toast('退款成功')
              return
            }
          }
        })
      }).catch(res => Toast('取消退款'))

    },
    loadMore() {
      this.loading = true

      if (this.notMore) {
        return
      }
      setTimeout(() => {
        this.$requests.orderFindAllPagedU({pageNumber:this.pageNumber, pageSize:this.pageSize})
          .then(res => {
            let orderList = res.content
            // 防止无限加载
            if (orderList.length === 0) {
              this.notMore = true
              this.loading = false
              return
            }
            this.pageNumber ++
            for (let order of orderList) {
              let content = ''
              for (let i = 0; i < order.orderItems.length; i++) {
                let item = order.orderItems[i]
                content += item.food.title + (i === order.orderItems.length-1 ? '':'+')
              }
              order.content = content.substr(0, 7)
                    + ( content.length >=7 ? '...':'')
              this.orderList.push(order)
            }
            this.loading = false
            if (res.totalElements === this.orderList.length) {
              this.notMore = true
            }
          }).catch(res => this.loading = false)
      }, 1000)
    },
  },
  created () {
    this.orderList = []
  }
}
</script>
