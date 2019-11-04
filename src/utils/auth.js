import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const ChargeToken = 'charge-token'
const MerchantSet = 'Merchant-Set'
const SessionKey = 'usertoken'
const index = 'tab-index'
const traderPwd = 'traderPwd'
const transferPwd = 'transferPwd'
const BusinessToken = 'business-token'

export function setTraderPwd(Pwd) {
  return localStorage.setItem(traderPwd, Pwd)
}

export function getTraderPwd() {
  return localStorage.getItem(traderPwd)
}

export function setTransferPwd(val) {
  return localStorage.setItem(transferPwd, val)
}

export function getTransferPwd() {
  return localStorage.getItem(transferPwd)
}

export function setTabIndex(tabIndex) {
  return localStorage.setItem(index, tabIndex)
}

export function getTabIndex() {
  return localStorage.getItem(index)
}

export function setlocalStorage(token) {
  return localStorage.setItem(SessionKey, token)
}

export function getlocalStorage() {
  return localStorage.getItem(SessionKey)
}
export function removelocalStorage() {
  return localStorage.setItem(SessionKey, null)
}
// 资管token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 计费token
export function getChargeToken() {
  return Cookies.get(ChargeToken)
}

export function setChargeToken(token) {
  return Cookies.set(ChargeToken, token)
}

export function removeChargeToken() {
  return Cookies.remove(ChargeToken)
}

// 配资token
export function getBusinessToken() {
  return Cookies.get(BusinessToken)
}

export function setBusinessToken(token) {
  return Cookies.set(BusinessToken, token)
}

export function removeBusinessToken() {
  return Cookies.remove(BusinessToken)
}
export function getMS() {
  return Cookies.get(MerchantSet)
}

export function setMS(ms) {
  return Cookies.set(MerchantSet, ms)
}

export function removeMS() {
  return Cookies.remove(MerchantSet)
}
