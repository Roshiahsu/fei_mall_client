import Vue from 'vue'
/*導入App.vue*/
import App from './App.vue'
import router from './router'
import store from './store'
/*添加eui*/
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/*添加axios*/
import axios from "axios";


Vue.use(ElementUI)
Vue.prototype.axios=axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
