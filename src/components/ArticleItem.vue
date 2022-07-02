
<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ obj.title }}</span>
          <!-- 单图 -->
          <lazy-component>
            <img
              class="thumb"
              v-if="obj.cover.type === 1"
              v-lazy="obj.cover.images[0]"
            />
          </lazy-component>
          <!-- <van-image
            class="thumb"
            v-if="obj.cover.type === 1"
            :src="obj.cover.images[0]"
            lazy-loadd
          >
            <template v-slot:error>加载失败</template>
          </van-image> -->
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="obj.cover.type > 1">
          <lazy-component>
            <img
              class="thumb"
              v-for="(imgUrl, index) in obj.cover.images"
              :key="index"
              v-lazy="imgUrl"
            />
          </lazy-component>
          <!-- <van-image
            v-for="(imgUrl, index) in obj.cover.images"
            :key="index"
            :src="imgUrl"
            lazy-load
          >
            <template v-slot:error>加载失败</template>
          </van-image> -->
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ obj.aut_name }}</span>
            <span>{{ obj.comm_count }}</span>
            <span>{{ formatTime(obj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      :cancel-text="cancelText"
      @cancel="onCancel"
      @close="closeFn"
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report.js'
export default {
  props: {
    obj: Object,
    isShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatTime: timeAgo,
    // 点击反馈事件
    onSelect (actions) {
      console.log(actions)
      if (actions.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.cancelText = '返回'
      } else if (actions.name === '不感兴趣') {
        this.$emit('dislike', this.obj.art_id)
        this.show = false // 关闭弹窗
      } else {
        this.$emit('reports', this.obj.art_id, actions.value)
        this.show = false // 关闭弹窗
      }
    },
    onCancel () {
      if (this.cancelText === '返回') {
        this.actions = firstActions
        this.cancelText = '取消'
        this.show = true // 点返回不要让弹窗关闭, 点取消文字按钮, 弹窗默认关闭
      }
    },
    // 面板关闭事件
    closeFn () {
      this.actions = firstActions
      this.cancelText = '取消'
    }
  },
  data () {
    return {
      show: false,
      actions: firstActions,
      cancelText: '取消'
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
