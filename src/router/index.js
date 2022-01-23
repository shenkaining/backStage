import Vue from 'vue'
import Router from 'vue-router'
// import { constantRoutes, asyncRoutes, anyRoutes } from './routeRules.js'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 常量路由：任何人登录都可以看到
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

// 异步路由：需要根据登录用户的权限，判断哪些路由是需要显示的
export const asyncRoutes = [
  // 权限管理
  {
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    name: 'Acl',
    meta: { title: '权限管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'user/list',
        name: 'User',
        component: () => import('@/views/acl/user/list.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role/list',
        name: 'Role',
        component: () => import('@/views/acl/role/list.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'role/auth/:id',
        name: 'RoleAuth',
        component: () => import('@/views/acl/role/roleAuth.vue'),
        meta: { title: '角色授权' },
        hidden: true // 路由规则中添加 hidden 可以使该路由不被渲染，但可以通过路由地址进行跳转
      },
      {
        path: 'permission/list',
        name: 'Permission',
        component: () => import('@/views/acl/permission/list.vue'),
        meta: { title: '菜单管理' }
      }
    ]
  },
  // 商品管理
  {
    path: '/product',
    name: 'Product',
    redirect: '/product/trademark',
    component: Layout,
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [{
      path: 'trademark',
      name: 'TradeMark',
      component: () => import('@/views/product/tradeMark'),
      meta: { title: '品牌管理' }
    },
    {
      path: 'attr',
      name: 'Attr',
      component: () => import('@/views/product/attr'),
      meta: { title: '平台属性管理' }
    },
    {
      path: 'spu',
      name: 'Spu',
      component: () => import('@/views/product/spu'),
      meta: { title: 'Spu管理' }
    },
    {
      path: 'sku',
      name: 'Sku',
      component: () => import('@/views/product/sku'),
      meta: { title: 'Sku管理' }
    }
    ]
  }]

// 任意路由：搜索不存在的路由时显示，必须放在 最后
export const anyRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
// const routes = [...constantRoutes, ...asyncRoutes, ...anyRoutes]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
