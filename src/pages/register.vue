<template>
  <div id="register" class="register">
    <h1>注册</h1>
    <div class="register-form">
      <mt-field label="用户名" v-model="username" placeholder="请输入用户名"></mt-field>
      <hr style="width: 95%;">
      <mt-field label="手机号" v-model="mobile" placeholder="请输入手机号"></mt-field>
      <hr style="width: 95%;">
      <mt-field label="密码" v-model="password" placeholder="请输入密码" type="password"></mt-field>
      <hr style="width: 95%;">
      <!-- 验证码 -->
      <mt-field label="验证码" v-model="code" >
        <img alt :src="imgUrl" style="width: 3rem;" @click="initSecurityCode">
      </mt-field>
      <hr style="width: 95%;">
      <p style="text-align: right;color: #aaa;">注册代表您同意我们搜集并使用您的用户信息</p>
      <mt-button @click="register" :disabled="inRegister" style="margin-top: 0.8rem;background:#ffcc00;" type="primary" size="large">注册</mt-button>
    </div>
  </div>
</template>

<script>
import { Field, Button, Toast } from 'mint-ui'
import {hex_sha1} from '../util/sha1'

export default {
  name: 'register',
  data () {
    return {
      username: '',
      mobile: '',
      password: '',
      imgUrl: '',
      code: '',
      captchaToken: '',
      inRegister: false
    }
  },
  computed: {},
  methods: {
    validate() {
      this.inRegister = true
      if (this.username.length === 0) {
        Toast('请填写用户名')
        return false
      }
      if (this.mobile.length === 0) {
        Toast('请填写手机号')
        return false
      }
      if (this.password.length === 0) {
        Toast('请填写密码')
        return false
      }
      if (this.code.length === 0) {
        Toast('请填写验证码')
        return false
      }
      if (this.username.length > 10) {
        Toase('用户名应在10字符以内')
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
      if (!(regString.test(this.password))) {
        Toast('密码必须为字母和数字的组合')
        return false
      }
      if (this.code.length !== 4) {
        Toast('验证码应为4位')
        return false
      }
      return true
    },
    initSecurityCode () {
      this.$requests.createCaptcha().then(resData => {
        this.captchaToken = resData.captchaToken
        this.imgUrl = resData.image
      })
    },
    register() {
      if (this.validate()) {
        let form = {
          username: this.username,
          mobile: this.mobile,
          // 加密密码
          password: hex_sha1(this.password),
          code: this.code,
          captchaToken: this.captchaToken,
        }
        this.$manage.user.register(form).then(res => {
          console.log(res)
          this.inRegister = true
          Toast('注册成功')
          this.$router.push({name: 'login'})
        }).catch(res => {
          console.log('xxx')
          this.inRegister = false
        })
      }
      else {
        this.inRegister = false
      }
    }
  },
  created () {
    this.initSecurityCode()
  }
}
</script>

<style scoped lang="less">
  .register {
    background: #fefefe;
  }
  .register-form {
    margin: 8%;
    margin-top: 12%;
  }
  h1 {
    padding: 0.5rem 0;
    color: #343131;
  }
</style>
