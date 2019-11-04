import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import router from '@/router'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 3600000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['X-Token'] = getToken()
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 100000) {
      // MessageBox.confirm('你还未登录，可以取消后继续留在该页面，或者重新登录', '提示', {
      //   confirmButtonText: '登录',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   router.push('/login')
      //   return Promise.reject(res.msg)
      // }).catch(() => { })
      router.push('/login')
      return Promise.reject(res.msg)
    } else if (res.code === 100001) {
      // MessageBox.confirm('你已登录超时登录，可以取消继续留在该页面，或者重新登录', '提示', {
      //   confirmButtonText: '重新登录',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   router.push('/login')
      //   return Promise.reject(res.msg)
      // }).catch(() => { })
      router.push('/login')
      return Promise.reject(res.msg)
    } else if (res.code === 100002) {
      Message({
        message: '抱歉，您无权操作',
        type: 'warning',
        duration: 3 * 1000
      })
      return Promise.reject(res.msg)
    } else if (res.code === 100003) {
      return Promise.reject(res.msg)
    } else {
      return response.data
    }
  }, error => {
    console.log('err' + error)// for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 3 * 1000
    // })
    return Promise.reject(error)
  })

export default service
