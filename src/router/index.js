import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/Login.vue'
import UserView from '../views/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/user',
    name: 'user',
    // 路由懒加载
    component: UserView
  }
]

const router = new VueRouter({
  mode: 'history', // 使用 history 模式，避免 URL 中的 # 号
  routes
})

export default router