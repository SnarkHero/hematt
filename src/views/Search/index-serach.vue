<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-fofo
        v-model.trim="kw"
        @input="inputFn"
        @search="enterFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length > 0">
      <div
        class="sugg-item"
        v-for="(obj, index) in suggestList"
        :key="index"
        v-html="lightFn(obj, kw)"
        @click="clickFn(obj)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(obj, index) in history"
          :key="index"
          @click="hisClickFn(obj)"
          >{{ obj }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api/index.js'
import { getStorage, setStorage } from '@/utils/storage'
export default {
  name: 'sousuo',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖定时器
      suggestList: [], // 建议关键字列表
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
    }
  },
  methods: {
    // 搜索框搜索
    inputFn () {
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          const res = await suggestListAPI({ keywords: this.kw })
          this.suggestList = res.data.data.options
          console.log(this.suggestList)
        }, 500)
      }
    },
    // 处理高亮字符
    lightFn (originStr, target) {
      // originStr:原来的字符串
      // target:关键字
      // replace()替换第一个符合条件的，replaceAll()替换全部 返回来时一个完整的字符串
      // 如果使用变量作为正则条件，不能用简化语法，需要用RegExp
      const reg = new RegExp(target, 'ig') // i忽略大小写，g全局
      return originStr.replace(reg, match => {
        // match就是匹配中时原型字符串那个字符，用人家的，我们给个颜色
        return `<span style="color:red;">${match}</span>`
      })
    },
    moveFn (theKw) {
      setTimeout(() => {
        this.$router.push({ path: `/search_results/${theKw}` })
      })
    },
    // 回车跳转
    enterFn () {
      if (this.kw.length > 0) {
        this.history.push(this.kw)
        this.moveFn(this.kw)
      }
    },
    // 点击跳转
    clickFn (obj) {
      this.history.push(obj)
      this.moveFn(obj)
    },
    // 历史记录跳转
    hisClickFn (obj) {
      this.$router.push({ path: `/search_results/${obj}` })
    },
    // 清空历史记录
    clearFn () {
      this.history = []
    }
  },
  watch: {
    history: {
      deep: true,
      handler () {
        // 去重，数组去重set
        const theSet = new Set(this.history)
        // 将set类型转化为数组
        const arr = Array.from(theSet)
        setStorage('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
