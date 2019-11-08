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
  // 修改密码的功能 POST /admin/editPwd/save
  modifyPassword: (oldpass, newpass, password) => {
    return request({
      url: '/admin/user/password',
      method: 'post',
      data: { oldpass, newpass, password }
    })
  },
  // 获取菜单列表
  Menu: (TokenAdmin) => {
    return request({
      url: 'admin/index/listmenu',
      method: 'get',
      data: { TokenAdmin }
    })
  },
  // 后台用户组列表
  ListGroup: (TokenAdmin) => {
    return request({
      url: 'admin/index/listGroup',
      method: 'get',
      data: { TokenAdmin }
    })
  }
}
