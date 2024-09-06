import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/about',
    name: 'about',
    // 路由懒加载
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history', // 使用 history 模式，避免 URL 中的 # 号
  routes
})

export default router