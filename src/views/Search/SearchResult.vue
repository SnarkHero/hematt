<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <!-- 文章列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check=false>
      <ArticleItem v-for="item in articleList" :key="item.art_id" :obj="item" :isShow="false" @click.native="itemclickFn(item.art_id)"></ArticleItem>
    </van-list>
  </div>
</template>

<script>
import { searchResultListAPI } from '@/api/index.js'
import ArticleItem from '@/components/ArticleItem.vue'

export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1, // 页码
      articleList: [], // 文章数据
      loading: false, // 加载状态
      finished: false // 是否全部加载完成
    }
  },
  async created () {
    const res = await searchResultListAPI({
      page: this.page,
      q: this.$route.params.kw
    })
    console.log(res)
    this.articleList = res.data.data.results
  },
  components: {
    ArticleItem
  },
  methods: {
    // 下啦刷新事件
    async onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        const res = await searchResultListAPI({
          page: this.page,
          q: this.$route.params.kw
        })
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        console.log(res)
        this.articleList = [...this.articleList, ...res.data.data.results]
        this.loading = false
      }
    },
    // 点击跳转事件 click.native可以获取组件内的跳转事件
    itemclickFn (id) {
      this.$router.push({
        path: `/datail?art_id=${id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
