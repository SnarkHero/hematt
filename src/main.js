import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import hljs from 'highlight.js' // hljs对象
import 'highlight.js/styles/default.css' // 代码高亮的样式
import './vant'

import directiveObj from '@/utils/directive'
Vue.directive('highlight', function (el) { // 自定义一个代码高亮指令
  const highlight = el.querySelectorAll('pre, code') // 获取里面所有pre或者code标签
  highlight.forEach((block) => {
    hljs.highlightElement(block) // 突出显示这些标签(以及内部代码, 会自动识别语言)
  })
})
Vue.use(directiveObj)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
