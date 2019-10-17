<template>
  <div id="login" class="login">
    <h1>登录</h1>
    <div class="login-form">
      <mt-field class="no-bg" label="手机号" v-model="mobile" placeholder="请输入手机号"></mt-field>
      <hr style="width: 95%;">
      <mt-field label="密码" v-model="password" placeholder="请输入密码" type="password"></mt-field>
      <hr style="width: 95%;">
      <mt-button @click="login" :disabled="inLogin" style="margin-top: 0.6rem;background:#ffcc00;" type="primary" size="large">登录</mt-button>

      <p @click="goRegister">还没有账号？去<span style="color: #ffcc00">注册</span></p>
    </div>
  </div>
</template>

<script>/* eslint-disable */
import { Field, Button, Toast } from 'mint-ui'
import {hex_sha1} from '../util/sha1'

export default {
  name: 'login',
  data () {
    return {
      mobile: '',
      password: '',
      inLogin: false
    }
  },
  computed: {},
  methods: {
    goRegister() {
      this.$router.push({name: 'register'})
    },
    validate() {
      this.inLogin = true
      if (this.mobile.length === 0) {
        Toast('请填写手机号');
        return false
      }
      if (this.password.length === 0) {
        Toast('请填写密码');
        return false
      }
      if (!(/^1([34578])\d{9}$/.test(this.mobile))) {
        Toast('请检查手机号是否正确');
        return false
      }
      //验证数字、字母至少出现一次，且只能为数字和字母的组合。
      let regString = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
      if (this.password.length < 8) {
        Toast('密码最短为 8 个字符')
        return false
      }
      if (! regString.test(this.password)) {
        Toast('密码只能为字母和数字的组合')
        return false
      }
      return true
    },
    login() {
      if (this.validate()) {
        this.$manage.user.login({
          mobile: this.mobile,
          password: hex_sha1(this.password)
        }).then(res => {
          Toast('登录成功')
          this.$router.push({name:'foodList'})
          this.inLogin = false
          this.$requests.cyszUserGetSelf().then(res =>{
            this.$store.commit('setCurrentUser', res)
          })
        }).catch(res => this.inLogin = false)
      }
      else {
        this.inLogin = false
      }
    }
  },
  created () {
  }
}
</script>

<style scoped lang="less">
  .login {
    background: #fefefe;
  }
  .login-form {
    margin: 8%;
    margin-top: 16%;
  }
  h1 {
    padding: 0.5rem 0;
    color: #343131;
  }
</style>
