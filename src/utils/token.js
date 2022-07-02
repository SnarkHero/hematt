// 此文件用来封装三个方法操作token
const key = 'geek-itheima'
// 存储
export const setToken = (token) => localStorage.setItem(key, token)
// 获取
export const getToken = () => localStorage.getItem(key)
// 删除
export const removeToken = () => localStorage.removeItem(key)
