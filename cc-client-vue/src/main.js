// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './routers'

import VueQuillEditor from 'vue-quill-editor'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '../theme/index.css'
import './assets/ele-customize.css'
import './assets/iconfont/iconfont.css'

import VueI18n from 'vue-i18n'
import locales from './assets/i18n/index.js'

import VueHighcharts from 'vue-highcharts'

import store from './store'
import { sync } from 'vuex-router-sync'

Vue.config.productionTip = false

let limitRouter = ['call', 'webchat', 'email', 'customer', 'business']
let firstIn = true
router.beforeEach((to, from, next) => {
  let data = {localTime: new Date().getTime()}
  if (window.parent !== window && firstIn) {
    if (window.parent.location.origin === window.location.origin) {
      firstIn = false
      next({path: '/login'})
    }
  }
  if (from.path === '/' && to.path !== '/login') {
    if (window.sessionStorage.loginData) {
      store.dispatch('initSystemConfig', data)
      .then(() => {
        console.log('123')
      }).then(() => {
        let defaultLogin = JSON.parse(window.sessionStorage.loginData)
        store.dispatch('signIn', defaultLogin)
        .then((data) => {
            // 刷新只到列表
          if (!data || !data.success) {
            next({path: '/login'})
          }
          if (limitRouter.indexOf(to.path.split('/')[2] !== -1) && to.path.split('/').length > 3) {
            next({path: '/index/' + to.path.split('/')[2]})
          } else {
            next()
          }
        })
      })
    } else {
      next('/login')
    }
  } else {
    if (to.path === '/login') {
      store.dispatch('initSystemConfig', data).then(() => {
      })
    }
    next()
  }
})
router.afterEach((route) => {
  let title = route.meta.title || ''
  document.title = `${title} - 云客服`
})
sync(store, router)
Vue.use(ElementUI)
Vue.component('el-select-menu', ElementUI.Select.components.ElSelectMenu)
Vue.use(VueHighcharts)

Vue.use(VueI18n)
Vue.use(VueQuillEditor)
Vue.set(Vue.config, 'lang', window.localStorage.lang || 'zh_CN')
Object.keys(locales).forEach(function (lang) {
  Vue.locale(lang, locales[lang])
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
Vue.config.silent = process.env.NODE_ENV !== 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'
import {vueErrorPlugin} from './utils/errorHandler'
vueErrorPlugin(Vue)
