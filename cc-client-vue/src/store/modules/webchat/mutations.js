import * as types from './mutation-types'
import Vue from 'vue'

export default {
  [types.SET_WEBCHAT_AUTOCLAIM] (state, {status}) {
    Vue.set(state, 'isOn', status)
  },
  [types.LEAK_NUM] (state, sessionId) {
    state.current.webchat_todo.list.forEach((item, index) => {
      if (item._id === sessionId && sessionId !== state.current.webchat_todo) {
        Vue.set(state.current.webchat_todo.list[index], 'leakNum', state.current.webchat_todo.list[index].leakNum + 1)
      }
    })
  },
  [types.SET_WEBCHAT_UNDEALNUM] (state, {undealNum, todoNum}) {
    Vue.set(state, 'queueNum', undealNum)
    Vue.set(state, 'todoNum', todoNum)
  },
  [types.SET_WEBCHAT_MODULE_READ] (state, read) {
    Vue.set(state, 'menuNews', read)
  },
  [types.QUERY_WEBCHAT_LIST] (state, {webchatList, submenu}) {
    // init为false代表是第一次查询待处理列表
    if (!state.webchatList.webchat_todo.init) {
      Vue.set(state, 'todoNum', webchatList.list.length)
    }
    Vue.set(state.webchatList, submenu, webchatList)
    if (submenu === 'webchat_todo') {
      Vue.set(state.webchatList.webchat_todo, 'init', true)
    }
  },
  [types.POPUP_WEBCHAT_INFO] (state, {session, submenu}) {
    if (submenu === 'webchat_todo') {
      if (session.invitedUserName === state.currentUser.displayName) {
        session.showFunBtn = true
      }
      if (session.status === 'changePeer') {
        session.leavemsg = true
      }
      session.preloadedMsgCon = ''
      session.preloadedFlag = false
      Vue.set(state.current.webchat_todo.currentSession, session._id, session)
      let list = state.current.webchat_todo.messageList[session._id] || []
      Vue.set(state.current.webchat_todo.messageList, session._id, list)
    } else {
      Vue.set(state.current.webchat_all, 'currentSession', session)
    }
  },
  [types.QUERY_WEBCHAT_HISTORY] (state, {page, historyList, sessionId, submenu}) {
    if (submenu === 'webchat_todo') {
      if (page === 1) {
        state.current[submenu].messageList[sessionId] = []
      }
      for (let i = historyList.length - 1; i >= 0; i--) {
        state.current[submenu].messageList[sessionId].unshift(historyList[i])
      }
      if (page > 1) {
        if (historyList.length < 10) {
          Vue.set(state.current[submenu].chatInfoById[sessionId], 'showHistoryBtn', true)
          Vue.set(state.current[submenu].chatInfoById[sessionId], 'finishChatScroll', true)
        }
        Vue.set(state.current[submenu].chatInfoById[sessionId], 'chatScrollPage', page + 1)
      }
    } else {
      if (page === 1) {
        Vue.set(state.current[submenu], 'messageList', historyList)
      }
      if (page > 1) {
        for (let i = historyList.length - 1; i >= 0; i--) {
          state.current[submenu].messageList.unshift(historyList[i])
        }
        if (historyList.length < 10) {
          Vue.set(state.current[submenu].chatInfoById, 'showHistoryBtn', true)
          Vue.set(state.current[submenu].chatInfoById, 'finishChatScroll', true)
        }
        Vue.set(state.current[submenu].chatInfoById, 'chatScrollPage', page + 1)
      }
    }
  },
  [types.QUALITY_QUERY_WEBCHAT_HISTORY] (state, {page, historyList}) {
    if (page === 1) {
      Vue.set(state.transCache.qualityCheck, 'messageList', historyList)
    } else {
      for (let i = historyList.length - 1; i >= 0; i--) {
        state.transCache.qualityCheck.messageList.unshift(historyList[i])
      }
      if (historyList.length < 10) {
        Vue.set(state.transCache.qualityCheck, 'finishChatScroll', true)
      }
    }
    Vue.set(state.transCache.qualityCheck, 'page', page + 1)
  },
  [types.QUALITY_QUERY_WEBCHAT_HISTORY_CLEAR] (state) {
    Vue.set(state.transCache.qualityCheck, 'messageList', [])
    Vue.set(state.transCache.qualityCheck, 'finishChatScroll', false)
    Vue.set(state.transCache.qualityCheck, 'page', 1)
  },
  [types.QUERY_WEBCHAT_INFO_BY_ID] (state, {chatInfoById, visitInfoList, submenu}) {
    if (submenu === 'webchat_todo') {
      if (!state.current[submenu].chatInfoById[chatInfoById._id]) {
        chatInfoById.chatScrollPage = 2
        chatInfoById.chatHistoryPage = 1
        chatInfoById.showHistoryBtn = false
        chatInfoById.waitTime = ''
        chatInfoById.showWaitTime = false
      }
      Vue.set(state.current[submenu].chatInfoById, chatInfoById._id, chatInfoById)
      Vue.set(state.current[submenu].visitInfoList, chatInfoById._id, visitInfoList)
      Vue.set(state.current[submenu].historyMsgList, chatInfoById._id, [])
      Vue.set(state.current[submenu], 'currentOpenSession', chatInfoById._id)
    } else {
      if (state.current[submenu].chatInfoById._id !== chatInfoById._id) {
        chatInfoById.chatScrollPage = 2
        chatInfoById.chatHistoryPage = 1
        chatInfoById.showHistoryBtn = false
      }
      Vue.set(state.current[submenu], 'historyMsgList', [])
      Vue.set(state.current[submenu], 'chatInfoById', chatInfoById)
      Vue.set(state.current[submenu], 'visitInfoList', visitInfoList)
    }
  },
  [types.QUERY_WEBCHAT_CURRENT_SESSION] (state, {_id, tabType}) {
    Vue.set(state.current[tabType], 'currentOpenSession', _id)
  },
  [types.GET_CURRENT_USER] (state, {currentUser}) {
    Vue.set(state, 'currentUser', currentUser)
  },
  [types.UPDATE_CURRENT_USER] (state, data) {
    state.currentUser['imDealCount'] = data.imDealCount
  },
  [types.GET_WEBCHAT_TODO_SHOW_CONFIG] (state, {todoShowConfig, submenu}) {
    state.current[submenu].todoShowConfig = todoShowConfig
  },
  [types.LOCATION_CUSTOMER] (state, {customer, submenu, sessionId}) {
    if (submenu === 'webchat_todo') {
      state.current[submenu].currentSession[sessionId].currentCustomer = customer
      Vue.set(state.current[submenu].currentSession[sessionId], 'currentCustomer', customer)
    } else {
      Vue.set(state.current[submenu], 'currentCustomer', customer)
    }
  },
  [types.DELETE_CUSTOMER_IM_RELATION] (state, sessionId) {
    if (state.current.webchat_todo.currentSession[sessionId]) {
      Vue.set(state.current.webchat_todo.currentSession[sessionId], 'currentCustomer', {})
    }
    if (state.current.webchat_all.currentSession._id === sessionId) {
      Vue.set(state.current.webchat_all.currentSession, 'currentCustomer', {})
    }
  },
  [types.DEAL_MSG] (state, {sessionId}) {
    state.webchatList.webchat_todo.list.forEach((item, index) => {
      if (item._id === sessionId) {
        state.webchatList.webchat_todo.list[index].leakNum = 0
      }
    })
  },
  [types.REPLY_MSG] (state, {data, index}) {
    data.dateTime = data.createTime
    data.showTime = data.dateTime.substring(5)
    data.uidDesc = '我'
    if (data.displayName) {
      data.displayName = decodeURIComponent(data.displayName)
    }
    if (data.sendStatus !== 'sending') {
      state.current.webchat_todo.messageList[data.sessionId].splice(index, 1)
      state.current.webchat_todo.messageList[data.sessionId][index] = data
      Vue.set(state.current.webchat_todo.messageList, [data.sessionId], state.current.webchat_todo.messageList[data.sessionId])
    } else {
      state.current.webchat_todo.messageList[data.sessionId].push(data)
    }
    // 更新卡片上最后一条消息内容
    state.webchatList.webchat_todo.list.forEach((item, index) => {
      if (item._id === data.sessionId && data.contentType !== 'system') {
        Vue.set(state.webchatList.webchat_todo.list[index], 'lastMessage', decodeURIComponent(data.content))
        Vue.set(state.webchatList.webchat_todo.list[index], 'contentType', data.contentType)
      }
    })

    state.webchatList.webchat_todo.list.forEach((item, index) => {
      if (item._id === data.sessionId) {
        Vue.set(state.webchatList.webchat_todo.list[index], 'lastMessage', decodeURIComponent(data.content))
        Vue.set(state.webchatList.webchat_todo.list[index], 'contentType', data.contentType)
      }
    })
  },
  [types.QUERY_HISTORY] (state, {page, historyList, sessionId, submenu}) {
    if (submenu === 'webchat_todo') {
      if (page === 1) {
        state.current[submenu].historyMsgList[sessionId] = historyList.reverse()
      } else {
        state.current[submenu].historyMsgList[sessionId] = historyList.reverse().concat(state.current[submenu].historyMsgList[sessionId])
      }
      if (historyList.length < 50) {
        Vue.set(state.current[submenu].chatInfoById[sessionId], 'showHistoryBtn', false)
      }
      Vue.set(state.current[submenu].chatInfoById[sessionId], 'chatHistoryPage', page + 1)
    } else {
      if (page === 1) {
        state.current[submenu].historyMsgList = historyList.reverse()
      } else {
        state.current[submenu].historyMsgList = historyList.reverse().concat(state.current[submenu].historyMsgList)
      }
      if (historyList.length < 50) {
        Vue.set(state.current[submenu].chatInfoById, 'showHistoryBtn', false)
      }
      Vue.set(state.current[submenu].chatInfoById, 'chatHistoryPage', page + 1)
    }
  },
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
    Vue.set(state.current['webchat_todo'], 'customQuickReply', replyObject)
  },
  [types.SET_QUICK_REPLY_LIST_BY_RDATA] (state, value) {
    state.current['webchat_todo'].customQuickReply.rdata.push({value: value})
  },
  [types.DEL_QUICK_REPLY_LIST_BY_RDATA] (state, index) {
    state.current['webchat_todo'].customQuickReply.rdata.splice(index, 1)
  },
  [types.EDIT_QUICK_REPLY_LIST_BY_RDATA] (state, index, data) {
    state.current['webchat_todo'].customQuickReply.rdata[index].value = data
  },
  [types.GET_ALL_QUICK_REPLY_LIST] (state, list) {
    Vue.set(state.current.webchat_todo['allQuickReply'], 'list', list)
    Vue.set(state.current.webchat_todo['allQuickReply'], 'flag', false)
  },
  [types.QUERY_WEBCHAT_ALL_TAGS] (state, list) {
    list.forEach((data) => {
      data.open = false
    })
    Vue.set(state.current['webchat_todo'], 'sysQuickReply', list)
  },
  [types.QUERY_WEBCHAT_ALL_TAGS_CHILDREN] (state, {list, index}) {
    list.forEach((data) => {
      data.open = false
    })
    Vue.set(state.current['webchat_todo'].sysQuickReply[index], 'children', list)
  },
  [types.PUSH_QUEUE_NUM_TO_WEBCHAT_CLIENTS] (state, data) {
    Vue.set(state, 'success', data)
  },
  [types.ACCEPT_GROUP_SESSION] (state, data) {
    Vue.set(state, 'currentSession', data)
  },
  [types.REFUSED_GROUP_SESSION] (state, data) {
    Vue.set(state, 'success', data)
  },
  [types.KICK_GROUP_SESSION] (state, data) {
    Vue.set(state, 'success', data)
  },
  [types.CANCEL_GROUP_SESSION] (state, data) {
    Vue.set(state, 'success', data)
  },
  [types.QUREY_CUSTOMER_BY_POPUP] (state, data) {
    Vue.set(state, 'customerList', data)
  },
  [types.REMOVE_SESSION] (state, id) {
    state.webchatList.webchat_todo.list.forEach((item, index) => {
      if (item._id === id) {
        state.webchatList.webchat_todo.list.splice(index, 1)
        Vue.set(state.webchatList.webchat_todo, 'list', state.webchatList.webchat_todo.list)
        Vue.set(state.webchatList.webchat_todo, 'count', state.webchatList.webchat_todo.count - 1)
        Vue.set(state, 'todoNum', parseInt(state.todoNum) - 1)
        delete state.current.webchat_todo.currentSession[id]
        delete state.current.webchat_todo.messageList[id]
        delete state.current.webchat_todo.historyMsgList[id]
        delete state.current.webchat_todo.chatInfoById[id]
        Vue.set(state.current.webchat_todo, 'showRightDetail', false)
      }
      Vue.set(state.current.webchat_todo, 'showRightDetail', false)
    })
  },
  [types.TYPE_NOTICE] (state, data) {
    Vue.set(state, 'success', data)
  },
  [types.CHANGE_INVITE_NOTIFY] (state, {userName, sessionId, sid, toPeer}) {
    Vue.set(state.current.webchat_todo, 'inviteUserName', userName)
    Vue.set(state.current.webchat_todo, 'inviteSessionId', sessionId)
    Vue.set(state.current.webchat_todo, 'sid', sid)
    Vue.set(state.current.webchat_todo, 'toPeer', toPeer)
  },
  [types.SHOW_KICK_NOTIFY] (state, flag) {
    Vue.set(state.current.webchat_todo, 'kickInvitedFlag', flag)
    Vue.set(state.current.webchat_todo, 'invitedFlag', !flag)
  },
  [types.SHOW_INVITE_NOTIFY] (state, flag) {
    Vue.set(state.current.webchat_todo, 'invitedFlag', flag)
    Vue.set(state.current.webchat_todo, 'kickInvitedFlag', !flag)
  },
  [types.SHOW_INVITE_BTN] (state, {flag, sessionId}) {
    Vue.set(state.current.webchat_todo.currentSession[sessionId], 'shwoInviteBtn', flag)
  },
  [types.UPDATE_INVITE_INFO] (state, data) {
    Vue.set(state.current.webchat_todo.currentSession[data._id], 'invitedUserName', data.invitedUserName)
    Vue.set(state.current.webchat_todo.currentSession[data._id], 'inviteUserStatus', data.inviteUserStatus)
    Vue.set(state.current.webchat_todo.currentSession[data._id], 'assistAgent', data.assistAgent)
  },
  [types.UPDATE_WEBCHAT_MESSAGE_LIST] (state, data) {
    let flag = true
    let updateArr = {}
    state.webchatList.webchat_todo.list.forEach((item, index) => {
      if (item._id === data._id) {
        if (item._id !== state.current.webchat_todo.currentOpenSession) {
          Vue.set(state.webchatList.webchat_todo.list[index], 'leakNum', state.webchatList.webchat_todo.list[index].leakNum + 1)
        }
        // 更新卡片上最后一条消息内容
        if (data.status === 'changePeer') {
          Vue.set(state.current.webchat_todo.currentSession[data._id], 'leavemsg', 'true')
          Vue.set(state.webchatList.webchat_todo.list[index], 'status', data.status)
        }
        let contentType = data.contentType
        if (data.msgType && data.msgType === 'saveImCSRInfo') {
          contentType = data.msgType
        }
        // Vue.set(state.webchatList.webchat_todo.list, index, data)
        let newFlag = true
        if (data.contentType && data.contentType === 'system') {
          newFlag = false
        }
        if (data.type && data.type === 'system') {
          newFlag = false
        }
        if (data.user && data.user === 'system') {
          newFlag = false
        }
        if (newFlag) {
          Vue.set(state.webchatList.webchat_todo.list[index], 'lastMessage', data.message)
          Vue.set(state.webchatList.webchat_todo.list[index], 'lastMessageUser', data.user)
          Vue.set(state.webchatList.webchat_todo.list[index], 'contentType', contentType)
          updateArr = state.webchatList.webchat_todo.list[index]
          state.webchatList.webchat_todo.list.splice(index, 1)
          state.webchatList.webchat_todo.list.unshift(updateArr)
        }
        flag = false
        return false
      }
    })
    // 时间检索的时候   仍然需要更新消息树中的消息
    if (state.current.webchat_todo.messageList[data._id]) {
      state.current.webchat_todo.messageList[data._id].push(data)
      Vue.set(state.current.webchat_todo, 'messageList', state.current.webchat_todo.messageList)
    }
    // 时间检索状态的时候  list中的数据产生了变化   因此这个地方需要判断是否在进行时间检索
    if (flag && !state.onTimeSearch) {
      state.webchatList.webchat_todo.list.unshift(data)
      Vue.set(state.webchatList.webchat_todo, 'list', state.webchatList.webchat_todo.list)
      if (data.contentType !== 'system') {
        Vue.set(state.webchatList.webchat_todo.list[0], 'lastMessage', data.message || data.lastMessage)
        Vue.set(state.webchatList.webchat_todo.list[0], 'lastMessageUser', data.user)
        Vue.set(state.webchatList.webchat_todo.list[0], 'contentType', data.contentType)
      }
      Vue.set(state.webchatList.webchat_todo, 'count', state.webchatList.webchat_todo.count + 1)
      Vue.set(state, 'todoNum', parseInt(state.todoNum) + 1)
      Vue.set(state.webchatList.webchat_todo.list[0], 'leakNum', state.webchatList.webchat_todo.list[0].leakNum + 1)
    }
  },
  [types.AUTO_CUST_INFO] (state, {sessionId, data}) {
    Vue.set(state.autoCust, sessionId, data)
  },
  [types.INVITE_SESSION_LIST] (state, data) {
    state.inviteUbaSessionList.list = data
  },
  [types.INVITE_SESSION_MORETRACK] (state, {_id, pages}) {
    let ubaSession = state.inviteUbaSessionList.list.filter(obj => obj._id === _id)[0]
    if (ubaSession && pages.length) {
      ubaSession.pages = ubaSession.pages.concat(pages)
      ubaSession.page += 1
    }
  },
  [types.INVITE_SESSION_INVITE] (state, data) {
    let rsList = data
    if (rsList.length) {
      for (var i = 0; i < rsList.length; i++) {
        let rsLi = rsList[i]
        let ubaSession = state.inviteUbaSessionList.list.filter(obj => obj._id === rsLi.sessionId)[0]
        if (rsLi.success) {
          ubaSession.status = 'webchat.inviteStatusInviting'  // 正在邀请
        } else {
          if (rsLi.message === 'haveInvited') {
            ubaSession.status = 'webchat.inviteStatusHaveInvited' // 已被邀请
          }
          if (rsLi.message === 'offline') {
            ubaSession.status = 'webchat.inviteStatusOffline'   // 关闭页面
          }
          if (rsLi.message === 'haveSession') {
            ubaSession.status = 'webchat.inviteStatusHaveSession'  // 已有会话
          }
          if (rsLi.message === 'blackUser') {
            ubaSession.status = 'webchat.inviteStatusBlackUser'  // 已被封禁
          }
        }
        ubaSession.dis_click = true
      }
    }
  },
  [types.UBAINFO] (state, { _id, page, lastPageTimeStart, sessionId, pages, allPages }) {
    let ubaInfo = state.current.webchat_todo.ubaInfoList[sessionId]
    if (ubaInfo) {
      if (page === 1) {
        ubaInfo.pages = []
      }
      ubaInfo.page = page
      ubaInfo.pages = ubaInfo.pages.concat(pages)
      ubaInfo.count = ubaInfo.pages.length
    } else {
      ubaInfo = {
        _id, page, lastPageTimeStart, pages, count: pages.length
      }
      state.current.webchat_todo.ubaInfoList[sessionId] = ubaInfo
    }
  },
  [types.UBAINFO_PUSH] (state, page) {
    let ubaInfo = state.current.webchat_todo.ubaInfoList[page.sessionId]
    if (page.change) {
      let changePage = ubaInfo.pages.filter(obj => obj._id === page._id)[0]
      Vue.set(changePage, 'stayTimeDesc', page.stayTimeDesc)
    } else {
      ubaInfo.pages.unshift(page)
      Vue.set(ubaInfo, 'count', ubaInfo.pages.length)
    }
  },
  [types.UBAINFO_PUSH_STAY_TIME] (state, { _id, stayTimeDesc, sessionId }) {
    let ubaSession = state.current.webchat_todo.ubaInfoList[sessionId].pages.filter(obj => obj._id === _id)[0]
    ubaSession.stayTimeDesc = stayTimeDesc
  },
  [types.SHOW_OR_HIDE_HISTORY_BTN] (state, {submenu, sessionId, length}) {
    if (submenu === 'webchat_todo') {
      if (length < 10) {
        Vue.set(state.current[submenu].chatInfoById[sessionId], 'showHistoryBtn', true)
        Vue.set(state.current[submenu].chatInfoById[sessionId], 'finishChatScroll', true)
      }
      Vue.set(state.current[submenu].chatInfoById[sessionId], 'chatScrollPage', 2)
    } else {
      if (length < 10) {
        Vue.set(state.current[submenu].chatInfoById, 'showHistoryBtn', true)
        Vue.set(state.current[submenu].chatInfoById, 'finishChatScroll', true)
      }
      Vue.set(state.current[submenu].chatInfoById, 'chatScrollPage', 2)
    }
  },
  [types.UPDATE_PRELOADED_MSG] (state, {message, flag, _id}) {
    message = decodeURIComponent(message)
    if (state.current.webchat_todo.currentSession[_id]) {
      Vue.set(state.current.webchat_todo.currentSession[_id], 'preloadedMsgCon', message)
      Vue.set(state.current.webchat_todo.currentSession[_id], 'preloadedFlag', flag)
    }
  },
  [types.UPDATE_PRELOADED_STATE] (state, {status, sessionId}) {
    let ubaSession = state.inviteUbaSessionList.list.filter(obj => obj._id === sessionId)[0]
    ubaSession.status = status
    ubaSession.dis_click = true
    // let sessionId = data.ubaSessionId
    // let ubaSession = state.inviteUbaSessionList.list.filter(obj => obj._id === sessionId)[0]
    // if (ubaSession) {
    //   if (ubaSession.status !== 'webchat.inviteStatusTyping' && ubaSession.status !== 'webchat.inviteStatusSuccess' && data.msgType === 'typeNotice') {
    //     let oldVal = ubaSession.status
    //     ubaSession.status = 'webchat.inviteStatusTyping'
    //     ubaSession.dis_click = true
    //     setTimeout(() => {
    //       debugger
    //       if (ubaSession.status !== 'webchat.inviteStatusSuccess') {
    //         ubaSession.status = oldVal
    //         ubaSession.dis_click = true
    //       }
    //     }, 5000)
    //   } else if (data.msgType === 'newMsg') {
    //     ubaSession.status = 'webchat.inviteStatusSuccess'
    //     ubaSession.dis_click = true
    //   }
    // }
  },
  [types.UPDATE_WAIT_TIME] (state, {time, flag, sessionId}) {
    if (state.current.webchat_todo.chatInfoById[sessionId]) {
      Vue.set(state.current.webchat_todo.chatInfoById[sessionId], 'waitTime', time)
      Vue.set(state.current.webchat_todo.chatInfoById[sessionId], 'showWaitTime', flag)
    }
    state.webchatList.webchat_todo.list.forEach((item, index) => {
      if (sessionId === item._id) {
        Vue.set(state.webchatList.webchat_todo.list[index], 'waitTime', time)
        Vue.set(state.webchatList.webchat_todo.list[index], 'showWaitTime', flag)
        return
      }
    })
  },
  [types.BIND_TIMEER_OBJ] (state, {timerObj, sessionId}) {
    state.current.webchat_todo.timerList[sessionId] = timerObj
  },
  [types.CHANGE_LOAD_STATUS] (state, data) {
    Vue.set(state, 'load', true)
  },
  /**
   * 绑定客户后更新webchatlist客户信息
   * @param state
   * @param message
   * @param flag
   */
  [types.UPDATE_WEBCHAT_RELATION_CUSTOMER] (state, {sid, customer}) {
    // 更新在线咨询模块客户信息
    for (let webchatTab in state.current) {
      if (webchatTab === 'webchat_todo') {
        for (let _id in state.current.webchat_todo.currentSession) {
          let session = state.current.webchat_todo.currentSession[_id]
          if (session.sid === sid) {
            session.custId = customer.custId
            Vue.set(state.current.webchat_todo.currentSession[_id], 'sName', customer.name)
            Vue.set(state.current.webchat_todo.currentSession[_id], 'cust_status', customer.status)
            Vue.set(state.current.webchat_todo.currentSession[_id], 'custId', customer._id)
            Vue.set(state.current.webchat_todo.currentSession[_id], 'currentCustomer', customer)
            if (customer._id) {
              Vue.set(state.current.webchat_todo, 'currentCustomer', customer)
            } else {
              Vue.set(state.current.webchat_todo, 'currentCustomer', {})
            }
          }
        }
      } else if (webchatTab === 'webchat_all') {
        if (state.current.webchat_all.currentSession) {
          let session = state.current.webchat_all.currentSession
          if (session.sid === sid) {
            session.custId = customer.custId
            Vue.set(state.current.webchat_all.currentSession, 'sName', customer.name)
            Vue.set(state.current.webchat_all.currentSession, 'cust_status', customer.status)
            Vue.set(state.current.webchat_all.currentSession, 'custId', customer._id)
            Vue.set(state.current.webchat_all.currentSession, 'currentCustomer', customer)
            if (customer._id) {
              Vue.set(state.current.webchat_all, 'currentCustomer', customer)
            } else {
              Vue.set(state.current.webchat_all, 'currentCustomer', {})
            }
          }
        }
      }
    }
    // 更新在线咨询模块列表客户名称
    for (let webchatTab in state.webchatList) {
      state.webchatList[webchatTab].list && state.webchatList[webchatTab].list.forEach(webchatInfo => {
        if (webchatInfo.sid === sid) {
          if (customer.name) {
            // webchatInfo.sName = customer.name
            Vue.set(webchatInfo, 'sName', customer.name)
          }
          Vue.set(webchatInfo, 'custId', customer._id)
          Vue.set(webchatInfo, 'cust_status', customer.status)
        }
      })
    }
  },
  // 点击搜索到的文本复制到发送框
  [types.COPY_IMSEARCH_VALUE] (state, data) {
    state.transCache.copyImSearchValue.value = data.value
    state.transCache.copyImSearchValue.random = data.random
  },
  // 保存Funtab信息到List
  [types.UPDATE_FUNTAB_INFO] (state, {sessionId, funTabActiveName}) {
    state.current.webchat_todo.funTabInfo[sessionId] = funTabActiveName
  },
  // 保存自动定位到客户时的电话号码
  [types.SET_AUTOCUSTPHONE_VAL] (state, {sessionId, data}) {
    Vue.set(state.autoCust[sessionId], 'autoCustPhone', data)
  },
  // 保存自动定位到客户时的客户名称
  [types.SET_AUTOCUSTNAME_VAL] (state, {sessionId, data}) {
    Vue.set(state.autoCust[sessionId], 'autoCustName', data)
  },
  // 保存自动定位到客户时的联系人
  [types.SET_AUTOCUSTPERSON_VAL] (state, {sessionId, data}) {
    Vue.set(state.autoCust[sessionId], 'autoContectPerson', data)
  },
  // webchat_todo页面右侧detail页面的展示
  [types.SET_RIGHTDETAL_FLAG] (state, {data}) {
    Vue.set(state.current.webchat_todo, 'showRightDetail', data)
  },
  [types.SET_OFFORONLINE_STATUS] (state, {_id, statu}) {
    let num = 0
    let flag = false
    for (let i = 0; i < state.webchatList.webchat_todo.list.length; i++) {
      if (state.webchatList.webchat_todo.list[i]._id === _id) {
        num = i
        flag = true
      }
    }
    if (flag) {
      Vue.set(state.webchatList.webchat_todo.list[num], 'userStatus', statu)
    }
  },
  [types.SET_QUICK_REPLY_DATA] (state, data) {
    Vue.set(state.current.webchat_todo, 'customQuickReply', data)
  },
  [types.UPDATE_WEBCHAT_SESSION_REMARK] (state, data) {
    if (state.current.webchat_todo.currentSession[data.sid]) {
      Vue.set(state.current.webchat_todo.currentSession[data.sid], 'remark', data.content)
    }
  },
  [types.SET_CHAT_VOICE_PLAY] (state, data) {
    if (data.tabType === 'webchat_todo') {
      if (data.flag === 'user') {
        state.current.webchat_todo.messageList[data._id] && state.current.webchat_todo.messageList[data._id].forEach(item => {
          if (item.contentType === 'voice' && item.when === data.when) {
            Vue.set(item, 'play', data.data)
          }
        })
      } else if (data.flag === 'history') {
        state.current.webchat_todo.historyMsgList[data._id] && state.current.webchat_todo.historyMsgList[data._id].forEach(item => {
          if (item.contentType === 'voice' && item.when === data.when) {
            Vue.set(item, 'play', data.data)
          }
        })
      }
    } else if (data.tabType === 'webchat_all') {
      if (data.flag === 'user') {
        state.current.webchat_todo.messageList && state.current.webchat_all.messageList.forEach(item => {
          if (item.contentType === 'voice' && item.when === data.when) {
            Vue.set(item, 'play', data.data)
          }
        })
      } else if (data.flag === 'history') {
        state.current.webchat_todo.historyMsgList && state.current.webchat_all.historyMsgList.forEach(item => {
          if (item.contentType === 'voice' && item.when === data.when) {
            Vue.set(item, 'play', data.data)
          }
        })
      }
    }
  },
  [types.RESET_USER_HISTORY_VOICE_PLAY] (state, data) {
    if (data.tabType === 'webchat_todo') {
      state.current.webchat_todo.messageList[data._id] && state.current.webchat_todo.messageList[data._id].forEach(item => {
        if (item.contentType === 'voice') {
          Vue.set(item, 'play', false)
        }
      })
      state.current.webchat_todo.historyMsgList[data._id] && state.current.webchat_todo.historyMsgList[data._id].forEach(itemAll => {
        if (itemAll.contentType === 'voice') {
          Vue.set(itemAll, 'play', false)
        }
      })
    } else if (data.tabType === 'webchat_all') {
      state.current.webchat_all.messageList && state.current.webchat_all.messageList.forEach(item => {
        if (item.contentType === 'voice') {
          Vue.set(item, 'play', false)
        }
      })
      state.current.webchat_all.historyMsgList && state.current.webchat_all.historyMsgList.forEach(itemAll => {
        if (itemAll.contentType === 'voice') {
          Vue.set(itemAll, 'play', false)
        }
      })
    }
  },
  [types.UPDATE_TIME_SEARCH_STATE] (state, data) {
    state.onTimeSearch = data
    Vue.set(state.current.webchat_todo, 'showRightDetail', false)
  },
  [types.UPDATE_PRELOADED_MSG_FLAG] (state, data) {
    Vue.set(state.current.webchat_todo.currentSession[data._id], 'preloadedFlag', data.value)
  },
  [types.RESET_TIMER_LIST] (state, {sessionId, online}) {
    if (state.current.webchat_todo.timerList[sessionId]) {
      if (online === 'online') {
        Vue.set(state.current.webchat_todo.timerList[sessionId], 'online', 'online')
      } else {
        Vue.set(state.current.webchat_todo.timerList[sessionId], 'online', 'offline')
      }
    }
  }
  // // 更新视频邀请状态
  // [types.UPDATE_VIDEO_INVITE_STATUS] (state, data) {
  //   state.isinviteVideo = data
  // },
  // // 更新视频邀请信息
  // [types.UPDATE_VIDEO_INVITE_DATA] (state, data) {
  //   state.videoInvitedData.videoInviteSessionid = data.videoInviteSessionid
  //   state.videoInvitedData.videoInviteToken = data.videoInviteToken
  // },
  // // 更新视频聊天状态
  // [types.UPDATE_VIDEO_CHAT_STATUS] (state, data) {
  //   state.isVideoing = data
  // },
  // // 更新视频聊天信息
  // [types.UPDATE_VIDEO_CHATDATA] (state, data) {
  //   state.videoChatData.videoSessionid = data.videoSessionid
  //   state.videoChatData.videoUsername = data.videoUsername
  //   state.videoChatData.videoToken = data.videoToken
  // }
}

