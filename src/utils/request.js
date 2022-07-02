// 封装axios网络请求
import router from '@/router/index.js'
import theAxios from 'axios'
import { Notify } from 'vant'
import { getToken, removeToken } from './token' // setToken
// import { refreshTokenAPI } from '@/api/index'
const axios = theAxios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // ?.可选操作链，如果面前对象里面没有length，整个表达式原地返回undefined
  // 如果getToken()在原地有值有长度才能调用length获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) { // 当状态码为2xx/3xx开头的进这里
  // 对响应数据做点什么
  return response
}, async function (error) { // 响应状态码4xx/5xx进这里
  // 对响应错误做点什么 4xx 5xx在这里
  console.dir(error)
  if (error.response.status === 401) { // 身份过期
    // token续签方式1:  去登录页重新登录, token无用, 清掉-确保路由守卫if进不去
    removeToken()
    // router.currentRoute相当于vue文件中的this.$router
    // fullPath,路由对象里完整的路径#后面的一切
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
    // router.push({ path: '/login' })
    // token续签方式2：自动续签
    // 1.更新token在本地
    // 2.更新新的token在请求头里
    // const res = await refreshTokenAPI()
    // setToken(res.data.data.token)
    // error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // console.log(res)
    // 3.未完成这次请求，再发起一次
    // return axios(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    Notify({ type: 'warning', message: '身份验证已过期,请重新登录' })
    localStorage.clear()
    router.replace('/login')
  }
  return Promise.reject(error)
})
// 导出自定义函数，参数对象解构赋值
export default ({
  url, method = 'GET', params, data, headers
}) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })
}
