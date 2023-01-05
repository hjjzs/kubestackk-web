import axios from 'axios'
import useStore from '../stores'
import { ElMessage } from 'element-plus'

const service = axios.create({
  // baseURL: 'https://10.255.9.207:6443',
  // baseURL: '/api'
})

// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

/**
 * 每次请求在 header 中带上 token
 */
service.interceptors.request.use((config: any) => {
  const {user} = useStore()
  // if (config.method === 'post') {
  //   config.data = qs.stringify(config.data)
  // }
  if (user.token) {
    config.headers["Authorization"] = "Bearer " + user.token
    config.headers['Content-Type'] = 'application/json'
    config.headers['Accept'] = '*/*'
  }
  return config
})


/**
 * 拦截每一次响应，判断是否 token 失效
 * 如果 token 失效就退出登录并提示信息
 */
service.interceptors.response.use(response => {
  console.log("router res",response)
  const res = response.data
  const {user} = useStore()
  // console.log("router res",res)
  // token 无效
  if (res.code === 401) {
    ElMessage({
      message: res.msg || '账号密码错误，请重新登录',
      type: 'warning',
      duration: 5000
    })
    user.logout()
    return Promise.reject(new Error(res.message || 'Error'))
  } 
  else if (response.status !== 200 && response.status !== 201) {
    ElMessage({
      message: res.msg || 'Error',
      type: 'error',
      duration: 5000
    })
    return Promise.reject(new Error(res.message || 'Error'))
  }
   else {
    return res
  }
})

export default service