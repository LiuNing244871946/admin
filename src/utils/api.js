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
  },
  // 获取菜单列表
  Menu: (TokenAdmin) => {
    return request({
      url: 'admin/index/listmenu',
      method: 'get',
      data: { TokenAdmin }
    })
  }
}
