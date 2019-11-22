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

