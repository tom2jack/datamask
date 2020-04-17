// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入element-ui响应式显示和隐藏布局
import 'element-ui/lib/theme-chalk/display.css'
// 引用API文件,封装接口访问的文件
import api from './utils/api'
import cookie from './utils/cookie'
import crypto from 'crypto'
Vue.use(ElementUI)

// 将API方法绑定到全局
Vue.prototype.$api = api
Vue.prototype.$cookie = cookie
Vue.prototype.$crypto = crypto

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data () {
    return {
      Bus: new Vue()
    }
  }
})
