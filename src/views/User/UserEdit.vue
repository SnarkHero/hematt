<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profile.photo"
            @click="imgclickFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="profile.name"
        @click="showNameDialogFn"
      />
      <van-cell
        title="生日"
        is-link
        :value="profile.birthday"
        @click="isShowBirthFn"
      />
    </van-cell-group>
    <van-dialog
      v-model="show"
      title="标题"
      show-cancel-button
      :beforeClose="onNameDialogBeforeClose"
      v-fofo
    >
      <input type="text" v-model="userName" />
    </van-dialog>
    <van-popup
      v-model="isShowBirth"
      position="bottom"
      :style="{ height: '30%' }"
      round
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isShowBirth = false"
        @confirm="confirmFn"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { userProfileAPI, updatePhotoAPI, updateProfileAPI } from '@/api/index'
import Notify from '@/ui/Notify'
import { formatDate } from '@/utils/date'
export default {
  name: 'UserEdit',
  data () {
    return {
      profile: {}, // 用户基本资料
      show: false,
      userName: '', // 编辑用户名
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(), // 当前显示的时间
      isShowBirth: false
    }
  },
  async created () {
    const res = await userProfileAPI()
    this.profile = res.data.data
    console.log(res)
  },
  methods: {
    // 点击图片
    imgclickFn () {
      this.$refs.iptFile.click()
    },
    // 选择文件的方法
    async onFileChange (e) {
      if (e.target.files.length === 0) return
      console.log(e.target.files[0])
      const fd = new FormData()
      fd.append('photo', e.target.files[0])
      const res = await updatePhotoAPI(fd)
      this.profile.photo = res.data.data.photo
      this.SET_USERPHOTO(res.data.data.photo)
    },
    showNameDialogFn () {
      this.show = true
      this.userName = this.profile.name
    },
    async onNameDialogBeforeClose (action, done) {
      if (action === 'confirm') {
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.userName)) {
          await updateProfileAPI({
            name: this.userName
          })
          this.profile.name = this.userName
          done()
        } else {
          // 提示用户
          Notify({ type: 'warning', message: '用户名中英文和数字1-7位' })
          // 阻止弹窗关闭
          done(false)
        }
      } else if (action === 'cancel') {
        // 取消
        done()
      }
    },
    isShowBirthFn () {
      this.isShowBirth = true
      this.currentDate = new Date(this.profile.birthday)
    },
    async confirmFn () {
      const res = await updateProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      console.log(res)
      this.isShowBirth = false
      this.profile.birthday = formatDate(this.currentDate)
    },
    ...mapMutations(['SET_USERPHOTO'])
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/.van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    border: none;
    outline: none;
  }
}
</style>
