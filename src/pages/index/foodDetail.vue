<style scoped lang="less">
  .warp {
    margin: 1rem 0;
    .image {
      width: 8rem;
      -webkit-border-radius: 8px;
      -moz-border-radius: 8px;
      border-radius: 8px;
    }
    .title {
      font-size: 20px;
    }
    .detail {
      margin: 0.3rem 0;
      height: 1.8rem;
    }
    .center {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 5rem;
      margin: 0 2rem 0 3rem;

      .price {
        font-size: 14px;
        line-height: 0.8rem;
        margin-right: 1.5rem;
        color: #cc352f;
      }
      .add {
        width: 0.6rem;
        height: 0.6rem;
        margin: 0.1rem;
      }
      .num {
        font-size: 15px;
        line-height: 0.8rem;
        font-weight: bold;
      }
    }
  }
</style>
<template>
  <div id="foodDetail" class="foodDetail">
    <common-header :tittle="title" :showback="true"/>
    <div class="warp">
      <img class="image" alt="菜品图片" :src="foodDetail.image">
      <h3 class="title">{{foodDetail.title}}</h3>
      <div class="detail">{{foodDetail.detail}}</div>
      <div class="center">
        <div class="price">仅需￥{{foodDetail.sumPrice}}</div>
        <div class="num">{{foodDetail.num}}</div>
        <img class="add" @click="addOne" src="../../assets/imgs/add.png">
      </div>

      <mt-button style="background:#ffcc00;width: 9.2rem;margin: 0.6rem 0.4rem;"
                 type="primary" size="large" @click="addAll">加入购物车</mt-button>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {Toast} from 'mint-ui'

export default {
  name: 'foodDetail',
  components: {
    commonHeader
  },
  data () {
    return {
      title: '菜品详情',
      foodDetail: {}
    }
  },
  computed: {},
  methods: {
    addOne () {
      this.foodDetail.num ++;
      this.foodDetail.sumPrice = this.foodDetail.num * this.foodDetail.price
      this.foodDetail = JSON.parse(JSON.stringify(this.foodDetail))
    },
    addAll () {
      if (this.foodDetail.num !== 0) {
        this.$store.commit('addFoodToSelected', this.foodDetail)
        this.$router.goBack()
      }
      else {
        Toast('请至少选择一件')
      }
    }
  },
  created () {
    this.foodDetail = this.$route.params
    for (let food of this.$store.state.foodSelected) {
      if (food.id === this.foodDetail.id) {
        this.foodDetail = food
        return
      }
    }
    this.foodDetail.num = this.foodDetail.num || 0
    this.foodDetail.sumPrice = this.foodDetail.num * this.foodDetail.price
  }
}
</script>
