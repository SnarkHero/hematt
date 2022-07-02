<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 文章列表 -->
        <ArticleItem
          v-for="item in list"
          :key="item.art_id"
          :obj="item"
          @dislike="dislikeFn"
          @reports="reportsFn"
          @click.native="itemclickFn(item.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem.vue'
import { getAllarticlesListAPI, dislikeArticleAPI, articleReportsAPI } from '@/api/index.js'
import Notify from '@/ui/Notify'
export default {
  props: {
    channelId: Number
  },
  data () {
    return {
      list: [],
      loading: false, // 上拉加载
      finished: false, // 上拉刷新是否完成
      theTime: new Date().getTime(), // 分页
      isLoading: false// 下拉加载的数据
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    this.getArticleListFn()
  },
  methods: {
    async getArticleListFn () {
      const res2 = await getAllarticlesListAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      })
      // console.log(res2)
      this.list = [...this.list, ...res2.data.data.results]
      this.theTime = res2.data.data.pre_timestamp
      this.loading = false// 如果不关闭，底部就一直是加载中，下次触底会再触发loading
      // 判断最后是否还有数据
      if (res2.data.data.pre_timestamp === null) {
        this.finished = true
      }
      this.isLoading = false
    },
    // 底部加载
    async onLoad () {
      if (this.theTime === 0) {
        this.finished = true
      }
      this.getArticleListFn()
    },
    // 顶部加载
    async onRefresh () {
      this.list = []
      this.getArticleListFn()
    },
    // 不感兴趣
    async dislikeFn (id) {
      try {
        const res = await dislikeArticleAPI({
          artId: id
        })
        console.log(res)
        Notify({ type: 'success', message: '反馈成功' })
      } catch (err) {
        Notify({ type: 'warning', message: '反馈失败-联系程序员' })
      }
    },
    // 举报文章
    async reportsFn (id, val) {
      await articleReportsAPI({
        target: id,
        type: val
      })
      Notify({ type: 'success', message: '举报成功' })
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
