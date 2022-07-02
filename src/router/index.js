import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'
// import Login from '@/views/Login/index-login.vue'
// import Layout from '@/views/Layout/index-layout.vue'
// import Home from '@/views/Home/index-home.vue'
// import User from '@/views/User/index-user.vue'
// import Search from '@/views/Search/index-serach.vue'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail/Artic-index.vue'
// import UserEditor from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/layout/home' },
  {
    path: '/login',
    component: () => import('@/views/Login/index-login.vue'),
    // 独享守卫，如果专挑去这个页面才触发守卫
    beforeEnter (to, from, next) {
      if (getToken()?.length > 0) {
        // 不放行
        next('/layout/Home')
      } else {
        next()
      }
    }
  },
  {
    path: '/layout',
    component: () => import('@/views/Layout/index-layout.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home/index-home.vue'),
        meta: {
          scrollT: 0
        }
      },
      { path: 'user', component: () => import('@/views/User/index-user.vue') }
    ]
  },
  { path: '/search', component: () => import('@/views/Search/index-serach.vue') },
  { path: '/search_results/:kw', component: () => import('@/views/Search/SearchResult.vue') },
  { path: '/datail', component: () => import('@/views/ArticleDetail/Artic-index.vue') },
  { path: '/user_editor', component: () => import('@/views/User/UserEdit.vue') },
  { path: '/chat', component: () => import('@/views/Chat/index.vue') }
]

const router = new VueRouter({
  routes
})
// 路由前置守卫，如果登陆了就不能切换到登录界面
// router.beforeEach((to, from, next) => {
//   if (getToken()?.length > 0 && to.path === '/login') {
//     // 不放行
//     next(false)
//   } else {
//     next()
//   }
// })

export default router
