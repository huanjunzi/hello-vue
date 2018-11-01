import menu from '@/components/menu'
import index from '@/components/index'
import register from '@/components/register'
import login from '@/components/login'

export const menuIndex = [
  { path: '/', redirect: '/index' }, // 默认就跳转此页面
    {
      path: '/menu',
      name: 'menu',
      component: menu,
      children: [
        // { path: 'welcome', meta: {title: 'welcome'}, name: 'welcome', component:() => import('../components/welcome.vue') },
        // 懒加载
        { path: 'welcome', meta: {title: 'welcome'}, name: 'welcome', component: resolve => require(['../components/welcome.vue'], resolve)},
        { path: 'custom/index', meta: {title: 'custom'}, name: 'custom', component: resolve => require(['../custom/index.vue'], resolve) }
      ]
    },
    // {
    //   path: '*',
    //   redirect: '/index',
    // }
]
export const indexs = {
  path: '/index',
  name: 'index',
  component: resolve => require(['@/components/index.vue'], resolve), // 懒加载
}
export const notFound = {
  path: '/*',
  name: 'error-404',
  meta: {
      title: '404-页面不存在'
  },
  component:() => import('../components/404.vue')
}

export const loginUser = {
    path: '/index/login',
    name: 'login',
    component: login,
}
export const registerUser = {
  path: '/index/register',
  name: 'register',
  component: register,
}

export const routers = [
    indexs,
    ...menuIndex,
    loginUser,
    registerUser,
    notFound
]
