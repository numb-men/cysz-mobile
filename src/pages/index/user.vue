<style scoped lang="less">
  .top {
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding: 1.2rem 1rem;
    background: #fefefe;

    img {
      width: 1.5rem;
      height: 1.5rem;
      box-shadow: 3px 3px 5px #c9c9c9;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;

    }
    .title {
      h2 {
        width: 4rem;
        text-align: left;
        margin: 0.1rem 0.2rem 0.25rem 1rem;
      }
      p {
        width: 4rem;
        text-align: left;
        color: #cc352f;
        font-size: 13px;
        margin: 0.1rem 0.2rem 0.25rem 1rem;
      }
    }
  }
</style>
<template>
  <div id="user" class="user">
    <common-header :tittle="title" :showback="false"/>
    <div class="top">
      <img alt src="http://localhost:10001/static/barbecue.jpg">
      <div class="title">
        <h2>{{user.username}}</h2>
        <p>余额：￥{{user.balance}}</p>
      </div>
    </div>

    <mt-button @click="recharge" style="margin-top: 0.6rem;background:#fefefe;color: #ffcc00;"
               size="large">充值</mt-button>

    <mt-button @click="exit" style="margin-top: 0.2rem;background:#fefefe;"
               size="large">退出账号</mt-button>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'

export default {
  name: 'user',
  components: {
    commonHeader
  },
  data () {
    return {
      title: '我的',
      user: {
        username: '未命名',
        balance: 0
      }
    }
  },
  computed: {},
  methods: {
    recharge() {
      this.$router.push({name: 'recharge'})
    },
    exit() {
      localStorage.setItem('token', '')
      this.$router.push({name: 'login'})
    }
  },
  created () {
    this.$requests.cyszUserGetSelf().then(res => {
      this.user = res
      this.$store.commit('setCurrentUser', res)
    })
  }
}
</script>
