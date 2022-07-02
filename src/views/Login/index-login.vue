<template>
  <div>
    <van-nav-bar title="黑马头条-登录" />
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          name="mobile"
          label="手机号"
          required
          placeholder="请输入11位手机号"
          :rules="[
            {
              required: true,
              message: '请填写手机号',
              pattern: /^1[3456789]\d{9}$/,
            },
          ]"
        />
        <van-field
          v-model="user.code"
          type="password"
          name="code"
          label="密码"
          required
          placeholder="请输入6位密码"
          :rules="[
            { required: true, message: '请填写密码', pattern: /^\d{6}$/ },
          ]"
        />
        <div style="margin: 16px">
          <van-button
            round
            :disabled="isLogin"
            :loading="isLogin"
            loading-text="程序员拼命加载ing..."
            block
            type="info"
            native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import Notify from '@/ui/Notify'
import { setToken } from '@/utils/token.js'
import { loginAPI } from '@/api'
import { setStorage } from '@/utils/storage'
export default {
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isLogin: false
    }
  },
  methods: {
    async onSubmit (values) {
      this.isLogin = true
      try {
        const res = await loginAPI(this.user)
        console.log(res)
        Notify({ type: 'success', message: '登录成功！' })
        this.isLogin = false
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        // 跳转一定要卸载最后最后执行
        // location.href='http://'当前浏览器地址和要跳转的地址不一样（不包含#后面的锚点信息）会刷新网页
        // this.$router.push()压栈（会产生历史记录，可以回退），this.$router.replace()替换(不会产生历史记录)
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (err) {
        console.log(err)
        Notify({ type: 'danger', message: '验证码或密码错误' })
        // this.isLogin = true
      }
      this.isLogin = false
    }
  }
}
</script>

// <style scoped lang="less">
// // scoped中加/deep/data-v-hash值选择器写到类名的前面,lang='less'是启用less语法
// .van-nav-bar{
//    background: #007bff;
// }
// /deep/ .van-nav-bar__title{
// color: white;
// }
</style>
