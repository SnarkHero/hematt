<template>
  <div>
    <!-- 头部导航标签 -->
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <img src="@/assets/logo.png" alt="" class="logo" />
        </template>
        <template #right>
          <van-icon
            name="search"
            size="0.66rem"
            color="#fff"
            @click="moveSearchPageFn"
          />
        </template>
      </van-nav-bar>
    </div>
    <!-- 右边加好 -->
    <van-icon
      name="plus"
      size="0.37333334rem"
      class="moreChannels"
      @click="showPopup"
      get-container="body"
    />
    <!--tab标签页标签 -->
    <div class="main">
      <van-tabs
        v-model="channelId"
        sticky
        offset-top="1.226667rem"
        animated
        @click="channelChangeFn"
      >
        <van-tab
          :title="item.name"
          v-for="item in userChannelList"
          :key="item.id"
          :name="item.id"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 频道管理弹出层 -->
    <van-popup v-model="show" class="channel_popup">
      <ChannelEdit
        :userList="userChannelList"
        :unCheckList="unCheckChannelList"
        @addChannelEV="addChannelFn"
        @removeChannelEV="userChannelClickFn"
        @colseEV="closeFn"
        ref="editRef"
        v-model="channelId"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
import {
  updateChannelAPI,
  getUserChannelAPI,
  getAllChannelsAPI,
  removeTheChannelAPI
} from '@/api'

export default {
  data () {
    return {
      channelId: 0,
      userChannelList: [], // 获取用户频道数据
      allChannelList: [], // 获取所有频道数据
      // articleList: [] // 接收文章列表的数据
      show: false,
      channeLScrollTobj: {}
    }
  },
  async created () {
    const res = await getUserChannelAPI()
    // console.log(res)
    this.userChannelList = res.data.data.channels
    // this.channelChangeFn()
    const res2 = await getAllChannelsAPI()
    this.allChannelList = res2.data.data.channels
  },
  methods: {
    channelChangeFn () {
      // const res2 = await articlesListAPI({
      //   channel_id: this.channelId,
      //   timestamp: new Date().getTime()
      // })
      // console.log(res2)
      // this.articleList = res2.data.data.results
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channeLScrollTobj[this.channelId]
      })
    },
    showPopup () {
      this.show = true
    },
    // 添加频道
    async addChannelFn (channelobj) {
      this.userChannelList.push(channelobj)
      const newArr = this.userChannelList.filter((obj) => obj.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj }
        delete newObj.name
        newObj.seq = index
        return newObj
      })
      await updateChannelAPI({
        channels: theNewArr
      })
    },
    // 删除频道
    async userChannelClickFn (channelobj) {
      const index = this.userChannelList.findIndex(
        (obj) => obj.id === channelobj.id
      )
      this.userChannelList.splice(index, 1)
      await removeTheChannelAPI({
        channelId: channelobj.id
      })
    },
    // 关闭弹出层
    closeFn () {
      this.show = false
      this.$refs.editRef.isEdit = false
    },
    // 跳转路由
    moveSearchPageFn () {
      // 必须用push跳转不能用replace  push可以退回  replace代替不能退回
      this.$router.push('/search')
    },
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop
      this.channeLScrollTobj[this.channelId] = document.documentElement.scrollTop
    }
  },
  computed: {
    unCheckChannelList () {
      const newArr = this.allChannelList.filter((bigobj) => {
        const index = this.userChannelList.findIndex((smallobj) => {
          return smallobj.id === bigobj.id
        })
        // index>-1就是找到了
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  watch: {},
  filters: {},
  components: {
    ArticleList,
    ChannelEdit
  },
  activated () {
    // console.log(this.$route)
    window.addEventListener('scroll', this.scrollFn)
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped>
.logo {
  width: 100px;
  height: 30px;
}
.main {
  padding-top: 46px;
}

div/deep/.van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

.moreChannels {
  position: fixed;
  top: 59px;
  right: 8px;
  z-index: 999;
}
.channel_popup {
  width: 100vw;
  height: 100vh;
}
</style>
