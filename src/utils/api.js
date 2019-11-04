import request from '../utils/request'
export const API = {
  // 登录的接口
  login: (username, password) => {
    return request({
      url: 'admin/user/login',
      method: 'post',
      data: {
        username,
        password
      }
    })
  }
}
