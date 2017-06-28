import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui'
import { m7Language } from '../utils/m7Utils.js'
import * as actions from './actions'
import * as types from './mutation-types'
import * as getters from './getters'
import customer from './modules/customer/'
import call from './modules/call/'
import webchat from './modules/webchat/'
import socketPush from './modules/socket-push'
import email from './modules/email/'
import monitor from './modules/monitor'
import cti from './modules/cti'
import workbench from './modules/workbench'
import business from './modules/business'
import km from './modules/km'
import sms from './modules/sms'
import questionnaire from './modules/questionnaire'
import qualityCheck from './modules/quality-check'
import report from './modules/report'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const store = new Vuex.Store({
  state: {
    loading: true,
    login: false,
    ip: false,
    masking: {show: false, type: 'login'},
    serverDiffTime: 0,
    pushServerUrl: '',
    session: {},
    error: '',
    exit: '',
    success: '',
    info: '',
    softPhoneBar: {},
    multiChannelVoice: true,
    closeAdvSearch: '',
    isPopup: false,
    inviteCon: false,
    fileDown: {url: '', isSession: ''},
    notify: {},
    dragPop: {name: '', url: '', token: '', open: false},
    bigImg: {
      imgUrl: '',
      imgShow: false
    },
    oemFlag: ''
  },
  mutations: {
    [types.SET_BIGIMG] (state, data) {
      state.bigImg.imgUrl = data.url
      state.bigImg.imgShow = data.show
    },
    /**
     * types.SET_ERROR
     * types.SET_SUCCESS
     * 处理必要返回的响应的message
     * types.SET_EXIT
     * 同账号在不同地方登陆将用户强制退出登录
     */
    [types.SET_ERROR] (state, err) {
      state.error = err
    },
    [types.SET_EXIT] (state, exit) {
      state.exit = exit
    },
    [types.SET_SUCCESS] (state, success) {
      state.success = success
    },
    [types.SET_INFO] (state, info) {
      state.info = info
    },
    // end
    [types.SET_CURRENT_CUSTOMER] (state, { data, type, tabType, businessId }) {
      if (tabType === 'cdr_call') {
        Vue.set(state[type].current[tabType], 'currentCustomer', data)
        // Vue.set(state[type].current[tabType][businessId], 'currentCustomer', data)
      } else if (tabType === 'webchat_todo') {
        Vue.set(state[type].current[tabType], 'currentCustomer', data)
        Vue.set(state[type].current[tabType].currentSession[businessId], 'currentCustomer', data)
      } else if (type === 'business') {
        Vue.set(state[type].current, 'currentCustomer', data)
      } else {
        Vue.set(state[type].current[tabType], 'currentCustomer', data)
      }
    },
    [types.UPDATE_CUSTOMER_INFO] (state, { data }) {
      // 更新通话模块客户信息
      for (let callTab in state.call.current) {
        if (data) {
          if (state.call.current[callTab].currentCustomer && state.call.current[callTab].currentCustomer._id === data._id) {
            Object.assign(state.call.current[callTab].currentCustomer, data)
          }
        }
      }

      // 更新通话模块列表客户名称
      for (let callTab in state.call.callList) {
        state.call.callList[callTab].list && state.call.callList[callTab].list.forEach(callInfo => {
          if (data) {
            if (callInfo.CUSTOMER_ID === data._id) {
              if (data.name) {
                callInfo.CUSTOMER_NAME = data.name
              }
              if (data.status) {
                callInfo.CUSTOMER_STATUS = data.status
              }
            }
          }
        })
        if (callTab === 'cdr_call') {
          if (window.sessionStorage.callList) { // 来电里面切换客户头像或者是更改客户名字时，更改session里面的值
            window.sessionStorage.callList = JSON.stringify(state.call.callList[callTab].list)
          }
        }
      }

      // 更新在线咨询模块客户信息
      for (let webchatTab in state.webchat.current) {
        if (webchatTab === 'webchat_todo') {
          for (let sessionId in state.webchat.current.webchat_todo.currentSession) {
            let currentCustomer = state.webchat.current.webchat_todo.currentSession[sessionId].currentCustomer
            if (currentCustomer && currentCustomer._id === data._id) {
              Object.assign(currentCustomer, data)
            }
          }
        } else {
          if (state.webchat.current[webchatTab].currentCustomer && state.webchat.current[webchatTab].currentCustomer._id === data._id) {
            Object.assign(state.webchat.current[webchatTab].currentCustomer, data)
          }
        }
      }

      // 更新在线咨询模块列表客户名称
      for (let webchatTab in state.webchat.webchatList) {
        state.webchat.webchatList[webchatTab].list && state.webchat.webchatList[webchatTab].list.forEach(webchatInfo => {
          if (webchatInfo.custId === data._id) {
            if (data.name) {
              webchatInfo.sName = data.name
            }
            if (data.status) {
              webchatInfo.cust_status = data.status
            }
          }
        })
      }

      // 更新邮件模块客户信息
      for (let emailTab in state.email.current) {
        if (state.email.current[emailTab].currentCustomer && state.email.current[emailTab].currentCustomer._id === data._id) {
          Object.assign(state.email.current[emailTab].currentCustomer, data)
        }
      }

      // 更新邮件模块列表客户名称
      for (let emailTab in state.email.emailList) {
        state.email.emailList[emailTab].list && state.email.emailList[emailTab].list.forEach(emailInfo => {
          if (emailInfo.customerId === data._id) {
            if (data.name) {
              emailInfo.custName = data.name
            }
            if (data.status) {
              emailInfo.cust_status = data.status
            }
          }
        })
      }

      // 更新客户模块客户信息
      for (let customerTab in state.customer.current) {
        if (state.customer.current[customerTab].currentCustomer && state.customer.current[customerTab].currentCustomer._id === data._id) {
          Object.assign(state.customer.current[customerTab].currentCustomer, data)
        }
      }

      // 更新客户模块列表客户信息
      for (let customerTab in state.customer.customerList) {
        state.customer.customerList[customerTab].list && state.customer.customerList[customerTab].list.forEach((customer, index) => {
          if (customer._id === data._id) {
            if (customerTab === 'customer_my' && data.owner && customer.owner !== data.owner) {
              Vue.set(state.customer.transCache, 'refreshLeft', Math.random())
            } else {
              Object.assign(customer, data)
            }
          }
        })
      }

      // 更新工单模块客户信息
      if (state.business.current.currentCustomer && state.business.current.currentCustomer._id === data._id) {
        Object.assign(state.business.current.currentCustomer, data)
      }

      // 更新工单模块列表客户名称
      state.business.businessList.list && state.business.businessList.list.forEach(businessInfo => {
        if (businessInfo.customer === data._id) {
          if (data.name) {
            businessInfo.name = data.name
          }
          if (data.status) {
            businessInfo.cust_status = data.status
          }
        }
      })

      // 更新来电弹屏模块客户信息
      if (state.cti.currentCustInfo && state.cti.currentCustInfo._id === data._id) {
        Object.assign(state.cti.currentCustInfo, data)
      }
    },
    [types.INIT_CONFIG] (state, { data }) {
      state.pushServerUrl = data.ccPushUrl
      state.serverDiffTime = data.serverDiffTime
    },
    [types.SIGNIN] (state, {data}) {
      Vue.set(state, 'login', data.success)
      Vue.set(state, 'session', data)
    },
    // [types.SINGIN1] (state, {data}) {
    //   Vue.set(state, 'bloon', data)
    // },
    [types.SIGNOUT] (commit) {

    },
    [types.MASKING] (state, data) {
      state.masking = data
    },
    // 以防dicMap还不存在的时候已经去请求了其它的cache
    [types.SET_DICMAP] (state, {dicMap}) {
      if (state.session.dicMap) {
        Object.assign(state.session.dicMap, dicMap)
      } else {
        state.session.dicMap = dicMap
      }
    },
    [types.PUSH_TYPE_DICDATA] (state, {type, data}) {
      let dicMap = state.session.dicMap
      dicMap[type].push(data)
      Vue.set(state.session.dicMap, type, dicMap[type])
    },
    [types.SET_TYPE_DICDATA] (state, {type, data}) {
      if (!state.session.dicMap) {
        Vue.set(state.session, 'dicMap', {})
      }
      Vue.set(state.session.dicMap, type, data)
    },
    [types.SET_OPTIONS_DICMAP] (state, options) {
      if (!state.session.dicMap) {
        Vue.set(state.session, 'dicMap', {})
      }
      Vue.set(state.session.dicMap, 'options', options)
    },
    [types.SET_MENU] (state, {data}) {
      Vue.set(state.session, 'clientMenu', data)
    },
    [types.USER_TOKEN] (state, {data}) {
      Vue.set(state.session.user, 'userToken', data)
    },
    [types.USER_EDIT] (state, data) {
      if (data) {
        for (let key in data) {
          if (data[key]) {
            state.session.user[key] = data[key]
          }
        }
      }
      if (data.password) {
        let user = JSON.parse(window.sessionStorage.getItem('loginData'))
        user.password = data.password
        window.sessionStorage.setItem('loginData', JSON.stringify(user))
      }
    },
    [types.LOGINED] (state, data) {
      Vue.set(state.session, 'logined', data)
    },
    [types.SET_FILEDOWNLOAD] (state, data) {
      state.fileDown = data
    },
    [types.SET_NOTIFY] (state, data) {
      state.notify = data
    },
    [types.SET_DRAGPOP] (state, data) {
      if (data === 'close') {
        state.dragPop.open = false
      } else {
        state.dragPop = data
      }
    },
    [types.CHANGE_STATE_INVITECON] (state, data) {
      console.log('1111111111111111111111111111111111111111')
      console.log(data)
      Vue.set(state, 'inviteCon', data)
      console.log(state.inviteCon)
    },
    // 关闭高级搜索
    [types.CLOSE_ADV_SEARCH] (state, data) {
      Vue.set(state, 'closeAdvSearch', Math.random())
    },
    [types.CHANGE_PASSWORD_ADVICE] (state) {
      let newDate = new Date()
      let time = newDate.getTime()
      let lastUpdate = state.session.user.passwordLastUpdate
      let differ = Math.floor((time - lastUpdate) / 1000 / 60 / 60 / 24)
      differ > 90 && Vue.set(state, 'isPopup', state.login)
    },
    // 质检 往session添加任务模板
    [types.PUSH_TASK_TEM] (state, data) {
      state.session.dicMap.qualityTasks.push(data)
    },
    // 质检 往session添加条件模板
    [types.PUSH_CONDITION_TEM] (state, data) {
      state.session.dicMap.qualityConditionTemplates.unshift(data)
    }
  },
  actions,
  getters,
  modules: {
    customer,
    call,
    webchat,
    email,
    socketPush,
    monitor,
    business,
    cti,
    workbench,
    km,
    sms,
    questionnaire,
    report,
    qualityCheck
  },
  // 方便开发时观察的状态的值
  //
  strict: process.env.NODE_ENV !== 'production'
})
let errorObj = {name: '', number: 0}
store.subscribe((mutation, state) => {
  // console.log(mutation.type)
  if (mutation.type === 'SET_ERROR') {
    let one = Message({message: m7Language(state.error), type: 'error', duration: 3000})
    if (errorObj.name === state.error) {
      errorObj.number++
    } else {
      errorObj.number = 0
      errorObj.name = ''
    }
    if (errorObj.number > 3) {
      one.close()
    }
    errorObj.name = state.error
  }
  if (mutation.type === 'SET_SUCCESS') {
    Message({message: m7Language(state.success), type: 'success', duration: 3000})
  }
  if (mutation.type === 'SET_INFO') {
    Message({message: m7Language(state.info), type: 'info', duration: 3000})
  }
})
export default store
