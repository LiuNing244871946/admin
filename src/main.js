import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import { formatDate } from './utils/auth'
import '@/icons' // icon
import '@/permission' // permission control

import 'font-awesome/css/font-awesome.css'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.prototype.$formatDate = formatDate
