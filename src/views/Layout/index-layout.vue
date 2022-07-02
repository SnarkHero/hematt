<template>
  <div>
    <!-- 二级路由页面 -->
    <keep-alive >
      <router-view></router-view>
    </keep-alive>

    <!-- 下面底部导航 -->
    <div>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o" to="/layout/home">标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/layout/user"
          >我的</van-tabbar-item
        >
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index-Layout',
  data () {
    return {
      active: 0
    }
  }
}
</script>
