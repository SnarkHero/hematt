// 封装接口方法
import axios from '@/utils/request.js'
// 即导入也导出
export * from './ArticList'

// 频道——获取所有频道
export const getAllChannelsAPI = () => axios({
  url: '/v1_0/channels'
})

// 获取用户频道
export const getUserChannelAPI = () => axios({
  url: '/v1_0/user/channels'

})
// 获取文章列表
export const getAllarticlesListAPI = ({ channel_id, timestamp }) => axios({
  url: '/v1_0/articles',

  params: {
    channel_id: channel_id,
    timestamp: timestamp || (new Date()).getTime()
  }
})
// 不感兴趣
export const dislikeArticleAPI = ({ artId }) => axios({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  }

})
// 举报文章
export const articleReportsAPI = ({ target, type, remark }) => axios({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: target,
    type: type,
    remark: remark
  }
})
// 频道 - 更新已选
export const updateChannelAPI = ({ channels }) => {
  return axios({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels: channels
    }
  })
}
// 删除频道
export const removeTheChannelAPI = ({ channelId }) => {
  return axios({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'DELETE'
  })
}
// 搜索 联想菜单
export const suggestListAPI = ({ keywords }) => {
  return axios({
    url: '/v1_0/suggestion',
    params: {
      q: keywords
    }
  })
}
// 搜索列表结果
export const searchResultListAPI = ({ page = 1, per_page = 10, q }) => {
  return axios({
    url: '/v1_0/search',
    params: {
      page,
      per_page,
      q
    }
  })
}
// 文章详情
export const articleDetailAPI = ({ id }) => {
  return axios({
    // :id是后台规定的参数名
    // 前端要在对应路径位置传值(不要写:)
    url: `/v1_0/articles/${id}`
  })
}
// 文章 - 关注作者
export const followedUserAPI = ({ target }) => {
  return axios({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target: target
    }
  })
}
// 文章 - 取消关注作者
export const unFollowedUserAPI = ({ uid }) => {
  return axios({
    // 这uid只是个变量名, 把值拼接在url发给后台(无需指定参数名)
    url: `/v1_0/user/followings/${uid}`,
    method: 'DELETE'
  })
}
// 文章 - 点赞
export const articleLikeAPI = ({ target }) => {
  return axios({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target: target
    }
  })
}
// 文章 - 取消点赞
export const articleDisLikeAPI = ({ artId }) => {
  return axios({
    url: `/v1_0/article/likings/${artId}`,
    method: 'DELETE'
  })
}
// 评论 - 获取列表
export const commentListAPI = ({ artId, offset = null, limit = 10 }) => {
  return axios({
    url: '/v1_0/comments',
    params: {
      type: 'a',
      source: artId,
      offset,
      limit
    }
  })
}
// 点赞评论
export const commentLikingAPI = ({ target }) => {
  return axios({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target
    }
  })
}
// 取消点赞
export const commentDisLikingAPI = ({ plId }) => {
  return axios({
    url: `/v1_0/comment/likings/${plId}`,
    method: 'DELETE'
  })
}
// 发布评论
export const sendCommentAPI = ({ artId, content }) => {
  return axios({
    url: '/v1_0/comments',
    method: 'POST',
    data: {
      target: artId,
      content: content
    }
  })
}
// 用户 - 基本资料
export const userInfoAPI = () => {
  return axios({
    url: '/v1_0/user'
  })
}
// 用户- 个人资料(就为了获取生日)
export const userProfileAPI = () => {
  return axios({
    url: '/v1_0/user/profile'
  })
}
// 用户- 更新头像
// 注意: formObj的值必须是一个表单对象
// new FormData() // 表单对象
export const updatePhotoAPI = (formObj) => {
  return axios({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: formObj
    // 如果你的请求体内容是表单对象, 浏览器会自动携带请求头Content-Type为multipart/form-data
  })
}
// 用户 - 更新资料
export const updateProfileAPI = (dataobj) => {
  const obj = {
    name: '',
    birthday: ''
  }
  for (const k in dataobj) {
    if (obj[k] === undefined) {
      delete dataobj[k]
    } else {
      obj[k] = dataobj[k]
    }
  }
  return axios({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}
// 用户 - 更新token
export const refreshTokenAPI = () => axios({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('refresh_token')
  }
})
