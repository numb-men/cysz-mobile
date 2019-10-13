<style scoped lang="less">
  .form {
    background: #fefefe;
    margin: 0.8rem 0;
  }
</style>
<template>
  <div id="recharge" class="recharge">
    <common-header :tittle="title" :showback="true"/>
    <div class="form">
      <mt-field label="充值金额" v-model="num" type="number" placeholder="请输入充值金额"></mt-field>
    </div>
    <mt-button @click="pay" :disabled="inPay"
               style="margin-top: 0.2rem;background:#fefefe;" size="large">充值</mt-button>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {MessageBox, Toast} from 'mint-ui'

export default {
  name: 'recharge',
  components: {
    commonHeader
  },
  data () {
    return {
      title: '充值',
      num: '',
      inPay: false
    }
  },
  computed: {},
  methods: {
    pay() {
      MessageBox.confirm(`您将支付￥${this.num}元，请确认支付。`).then(action => {
        this.$requests.cyszUserRecharge({num: this.num})
          .then(res => {
            Toast('支付成功！');
            this.$store.commit('recharge', res)
            this.$router.back()
          }).catch(res => Toast('支付取消'))
      })
    }
  },
  created () {
  }
}
</script>
