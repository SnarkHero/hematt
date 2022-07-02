<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 文章加载中... -->
    <van-loading color="#1989fa" v-if="Object.keys(artObj).length === 0" class="loading"
      >文章疯狂加载ing...</van-loading
    >
    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{ artObj.title }}</h1>

        <!-- 用户信息 -->
        <van-cell
          center
          :title="artObj.aut_name"
          :label="formaData(artObj.pubdate)"
        >
          <template #icon>
            <img :src="artObj.aut_photo" alt="" class="avatar" />
          </template>
          <template #default>
            <div>
              <van-button
                type="info"
                size="mini"
                v-if="artObj.is_followed === true"
                @click="followedFn(true)"
                >已关注</van-button
              >
              <van-button
                icon="plus"
                type="info"
                size="mini"
                plain
                v-else
                @click="followedFn(false)"
                >关注</van-button
              >
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="artObj.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            v-if="artObj.attitude === 1"
            @click="loveFn(true)"
            >已点赞</van-button
          >
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            v-else
            @click="loveFn(false)"
            >点赞</van-button
          >
        </div>
      </div>
      <div>
        <!-- Header 区域 -->
        <!-- 文章信息区域 -->

        <!-- 文章评论区域 -->
        <CommentList></CommentList>
      </div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import CommentList from './CommentList.vue'
import { articleDetailAPI, followedUserAPI, unFollowedUserAPI, articleLikeAPI, articleDisLikeAPI } from '@/api/index.js'
export default {
  name: 'wenzhang',
  async created () {
    const res = await articleDetailAPI({
      id: this.$route.query.art_id
    })
    this.artObj = res.data.data
  },
  data () {
    return {
      artObj: {}
    }
  },
  methods: {
    formaData: timeAgo,
    async followedFn (bool) {
      if (bool === true) { // 用户点了已关注按钮身上
        // 业务: 取消关注用户
        // 显示: 关注按钮
        this.artObj.is_followed = false
        const res = await unFollowedUserAPI({
          uid: this.artObj.aut_id

        })
        console.log(res)
      } else { // 用户点了关注按钮
        // 业务: 关注用户
        // 显示: 已关注按钮
        this.artObj.is_followed = true

        const res = await followedUserAPI({
          target: this.artObj.aut_id
        })
        console.log(res)
      }
    },
    async loveFn (bool) {
      if (bool === true) {
        this.artObj.attitude = -1
        const res = await articleDisLikeAPI({
          artId: this.artObj.art_id
        })
        console.log(res)
      } else {
        this.artObj.attitude = 1
        const res = await articleLikeAPI({
          target: this.artObj.art_id
        })
        console.log(res)
      }
    }

  },
  components: {
    CommentList
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
.loading {
  margin-top: 50px;
  text-align: center;
}
</style>
