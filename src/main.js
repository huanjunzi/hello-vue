// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import {validForm} from './utils/utils'
import {routers} from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router';
import loading from './components/loading'
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(iView)
Vue.prototype.$axios = axios
Vue.prototype.$validForm = validForm
Vue.config.productionTip = false
const routeConfig = {
  mode: 'history',
  routes : routers
}

// 以下是注册组件的方法
Vue.component('loadIng', loading)

const router = new VueRouter(routeConfig)
// 每次路由跳转到的时候都会调用该函数
router.beforeEach((to, from, next) => { //beforeEach是router的钩子函数，在进入路由前执行
  console.log('路由初始化')
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
axios.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,\'Origin\',Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (req.method === 'OPTIONS') {
      res.sendStatus(200);
  } else {
      next();
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
