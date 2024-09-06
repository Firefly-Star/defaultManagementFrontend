import Vue from 'vue'
import App from './App.vue'
import router from './router' // 引入路由配置

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 使用 Element UI
Vue.use(ElementUI)


Vue.config.productionTip = false

new Vue({
  router, // 注入路由
  render: h => h(App)
}).$mount('#app')