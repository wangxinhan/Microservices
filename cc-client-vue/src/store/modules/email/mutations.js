import * as types from './mutation-types'
import Vue from 'vue'

export default {
  // 邮件全局状态
  [types.SET_EMAIL_AUTOCLAIM] (state, {emailStatus}) {
    Vue.set(state, 'isOn', emailStatus)
  },
  [types.SET_EMAIL_UNDEALNUM] (state, {undealNum}) {
    Vue.set(state, 'queueNum', undealNum)
  },
  [types.SET_EMAIL_TODONUM] (state, {todoNum}) {
    Vue.set(state, 'todoNum', todoNum)
  },
  [types.SET_EMAIL_SEND_STATUS] (state, {mailId, emailStatus}) {
    state.current.email_todo.currentSessionHistory.forEach((item, index) => {
      if (item.mailId === mailId) {
        Vue.set(state.current.email_todo.currentSessionHistory[index], 'status', emailStatus)
      }
    })
  },
  [types.SET_EMAIL_MODULE_READ] (state, read) {
    Vue.set(state, 'menuNews', read)
  },
  [types.REFRESH_EMAIL_LEAKNUM] (state, sessionId) {
    state.emailList.email_todo.list.forEach((item, index) => {
      if (item._id === sessionId) {
        state.emailList.email_todo.list[index].leakNum = 0
      }
    })
  },

  // 邮件列表相关
  [types.QUERY_EMAIL_LIST] (state, {data, type}) {
    state.emailList[type] = data
    if (type === 'email_todo') {
      Vue.set(state.emailList.email_todo, 'init', true)
    }
  },
  [types.REMOVE_EMAIL_SESSION] (state, id) {
    state.emailList.email_todo.list.forEach((item, index) => {
      if (item._id === id) {
        state.emailList.email_todo.list.splice(index, 1)
        state.emailList.email_todo.count = state.emailList.email_todo.count - 1
        Vue.set(state, 'todoNum', parseInt(state.todoNum) - 1)
      }
    })
  },
  [types.BATCH_REMOVE_EMAIL_SESSION] (state, finishiArr) {
    let sessionIds = finishiArr.map((item) => item._id)
    let result = []
    let count = 0
    state.emailList.email_todo.list.forEach((item) => {
      if (sessionIds.indexOf(item._id) === -1) {
        result.push(item)
      } else {
        count++
      }
    })
    state.emailList.email_todo.list = result
    Vue.set(state, 'todoNum', parseInt(state.todoNum) - count)
  },
  [types.UPDATE_EMAIL_LIST] (state, data) {
    state.emailList.email_todo.list.unshift(data)
    state.emailList.email_todo.count = state.emailList.email_todo.count + 1
    Vue.set(state, 'todoNum', parseInt(state.todoNum) + 1)
  },
  [types.UPDATE_EMAIL_LIST_HISTORY] (state, {sessionId, email}) {
    state.current.email_todo.currentSessionHistory.push(email)
    state.emailList.email_todo.list.forEach((item, index) => {
      if (item._id === sessionId) {
        Vue.set(state.emailList.email_todo.list[index], 'leakNum', state.emailList.email_todo.list[index].leakNum + 1)
      }
    })
  },
  // 邮件详情相关
  [types.POPUP_EMAIL_INFO] (state, {session, submenu}) {
    if (session.multiCusts) {
      let custInfo = {
        autoCustObj: {
          list: session.multiCusts,
          count: session.multiCusts.length
        },
        autoCustLength: session.multiCusts.length || 0
      }
      state.autoCust = custInfo
    }
    state.current[submenu].currentSession = session
  },
  [types.LOAD_EMAIL_HISTORY] (state, {history, submenu}) {
    state.current[submenu].currentSessionHistory = history
  },
  [types.GET_LAST_EMAIL] (state, {email}) {
    Vue.set(state, 'lastEmail', email)
  },
  [types.REPLY_EMAIL_INBOX] (state, {email}) {
    state.current.email_todo.currentSessionHistory.push(email)
  },
  [types.FORWARD_EMAIL] (state, success) {
    Vue.set(state, 'success', success)
  },
  [types.SAVE_EMAIL_REMARK] (state, success) {
    Vue.set(state, 'success', success)
  },
  [types.REDIRECT_EMAIL_SESSION] (state, success) {
    Vue.set(state, 'success', success)
  },
  [types.DO_EMAIL_MARK] (state, {success, data}) {
    Vue.set(state, 'success', success)
    let todoList = state.emailList.email_todo.list
    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i]._id === data.sessionId) {
        if (data.starMark === 'mark') {
          Vue.set(state.emailList.email_todo.list[i], 'mailMarks', {'starMark': data.starMark})
          Vue.set(state.current.email_todo.currentSession, 'mailMarks', {'starMark': data.starMark})
        } else if (data.starMark === 'unmark') {
          Vue.set(state.emailList.email_todo.list[i], 'mailMarks', {})
          Vue.set(state.current.email_todo.currentSession, 'mailMarks', {})
        } else if (data.readMark === 'read') {
          Vue.set(state.emailList.email_todo.list[i], 'leakNum', 0)
          Vue.set(state.current.email_todo.currentSession, 'leakNum', 0)
        } else if (data.readMark === 'unread') {
          Vue.set(state.emailList.email_todo.list[i], 'leakNum', 1)
          Vue.set(state.current.email_todo.currentSession, 'leakNum', 1)
        }
        return
      }
    }
  },
  [types.DEFINE_EMAIL_CATEGORY] (state, data) {
    if (data.categoryId === 'uncategorized') {
      Vue.set(state.current.email_todo.currentSession, 'category', '')
    } else {
      Vue.set(state.current.email_todo.currentSession, 'category', data.categoryId)
    }
    let todoList = state.emailList.email_todo.list
    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i]._id === data.mailSessionId) {
        Vue.set(state.emailList.email_todo.list[i], 'category', data.categoryId)
        return
      }
    }
  },

  // 邮件客户相关
  [types.UPDATE_EMAIL_RELATION_CUSTOMER] (state, {addr, customer}) {
    for (let emailTab in state.current) {
      Vue.set(state.current[emailTab], 'currentCustomer', customer)
      state.current[emailTab].currentSession.custId = customer._id
      state.current[emailTab].currentSession.customerId = customer._id
      state.current[emailTab].currentSession.custName = customer.name
      state.current[emailTab].currentSession.cust_status = customer.status
    }

    // 更新邮件模块列表客户名称
    for (let emailTab in state.emailList) {
      state.emailList[emailTab].list && state.emailList[emailTab].list.forEach(emailInfo => {
        if (emailInfo.from && emailInfo.from.addr === addr) {
          Vue.set(emailInfo, 'custName', customer.name)
          Vue.set(emailInfo, 'custId', customer._id)
          Vue.set(emailInfo, 'customerId', customer._id)
          Vue.set(emailInfo, 'cust_status', customer.status)
        }
      })
    }
  },
  // 解除绑定客户
  [types.DELETE_EMAIL_RELATION_CUSTOMER] (state, {customerId, email}) {
    for (let emailTab in state.current) {
      Vue.set(state.current[emailTab], 'currentCustomer', {})
      state.current[emailTab].currentSession.custId = null
      state.current[emailTab].currentSession.customerId = null
      state.current[emailTab].currentSession.custName = null
      state.current[emailTab].currentSession.cust_status = null
    }
    // 多个客户情况下的解绑
    let autoCustList = state.autoCust.autoCustObj
    if (autoCustList && autoCustList.list && autoCustList.list.length > 0) {
      let resultList = []
      let custList = autoCustList.list
      for (let i = 0; i < custList.length; i++) {
        if (custList[i]._id !== customerId) {
          resultList.push(custList[i])
        }
      }
      state.autoCust.autoCustObj = {list: resultList, count: resultList.length}
      state.autoCust.autoCustLength = resultList.length
    }

    // 更新邮件模块列表客户名称
    for (let emailTab in state.emailList) {
      state.emailList[emailTab].list && state.emailList[emailTab].list.forEach(emailInfo => {
        if (emailInfo.from && emailInfo.from.addr === email) {
          Vue.set(emailInfo, 'custName', null)
          Vue.set(emailInfo, 'custId', null)
          Vue.set(emailInfo, 'customerId', null)
          Vue.set(emailInfo, 'cust_status', null)
        }
      })
    }
  },
  [types.EMAIL_LOCATION_CUSTOMER] (state, {customer, submenu}) {
    Vue.set(state.current[submenu].currentSession, 'currentCustomer', customer)
  },

  // 快捷回复相关
  [types.SAVE_QUICK_REPLY] (state, data) {
    Vue.set(state, 'success', data)
  },
  [types.GET_QUICK_REPLY_LIST] (state, list) {
    list.forEach((item, index) => {
      list[index] = {value: item}
    })
    let replyObject = {
      rdata: list,
      nodeKey: '',
      isShow: true,
      isShow1: true
    }
    Vue.set(state.current['email_todo'], 'customQuickReply', replyObject)
  },
  [types.GET_ALL_QUICK_REPLY_LIST] (state, list) {
    Vue.set(state.current['email_todo'], 'allQuickReply', list)
  },
  [types.QUERY_EMAIL_ALL_TAGS] (state, list) {
    list.forEach((data) => {
      data.open = false
    })
    Vue.set(state.current['email_todo'], 'sysQuickReply', list)
  },
  [types.QUERY_EMAIL_ALL_TAGS_CHILDREN] (state, {list, index}) {
    list.forEach((data) => {
      data.open = false
    })
    Vue.set(state.current['email_todo'].sysQuickReply[index], 'children', list)
  },
  [types.SET_QUICK_REPLY_LIST_BY_RDATA] (state, value) {
    state.current['email_todo'].customQuickReply.rdata.push({value: value})
  },
  [types.DEL_QUICK_REPLY_LIST_BY_RDATA] (state, index) {
    state.current['email_todo'].customQuickReply.rdata.splice(index, 1)
  },
  [types.EDIT_QUICK_REPLY_LIST_BY_RDATA] (state, index, data) {
    state.current['email_todo'].customQuickReply.rdata[index].value = data
  },
  [types.GET_ALL_QUICK_REPLY_LIST] (state, list) {
    Vue.set(state.current['email_todo'], 'allQuickReply', list)
  },
  [types.SET_CUST_QUICK_REPLY] (state, data) {
    Vue.set(state.current.email_todo, 'customQuickReply', data)
  }
}
