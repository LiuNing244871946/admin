import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/admin/index/listMenu',
    name: 'admin',
    meta: { title: '系统管理' },
    children: [
      {
        path: '/admin/index/listMenu',
        name: '菜单管理',
        meta: { title: '菜单管理', noKeepAlive: true },
        component: () => import('@/views/Menu')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/product/productList',
    name: 'spgl',
    meta: { title: '商品管理' },
    children: [
      {
        path: '/admin/product/productList',
        name: '商品列表',
        meta: { title: '商品列表', noKeepAlive: true },
        component: () => import('@/views/ProductList')
      },
      {
        path: '/admin/product/classList',
        name: '商品分类列表',
        meta: { title: '商品分类列表', noKeepAlive: true },
        component: () => import('@/views/product/classList')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/index/account',
    name: 'account',
    meta: { title: '账户管理' },
    children: [
      {
        path: '/admin/index/account',
        name: '后台账户',
        meta: { title: '后台账户列表', noKeepAlive: true },
        component: () => import('@/views/account/Account')
      },
      {
        path: '/admin/index/listGroup',
        name: '后台用户组列表',
        meta: { title: '后台用户组列表', noKeepAlive: true },
        component: () => import('@/views/account/ListGroup')
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
