import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const SessionKey = 'usertoken'

export function setlocalStorage(token) {
  return localStorage.setItem(SessionKey, token)
}

export function getlocalStorage() {
  return localStorage.getItem(SessionKey)
}
export function removelocalStorage() {
  return localStorage.setItem(SessionKey, null)
}
// token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function formatDate(datetime) {
  let datetimeStr = datetime
  if (datetime < 10000000000) {
    datetimeStr = datetime * 1000
  }
  var date = new Date(datetimeStr)
  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var year = date.getFullYear(),
    month = ('0' + (date.getMonth() + 1)).slice(-2),
    sdate = ('0' + date.getDate()).slice(-2),
    hour = ('0' + date.getHours()).slice(-2),
    minute = ('0' + date.getMinutes()).slice(-2),
    second = ('0' + date.getSeconds()).slice(-2)
  // 拼接
  var result = year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute + ':' + second
  // 返回
  return result
}
