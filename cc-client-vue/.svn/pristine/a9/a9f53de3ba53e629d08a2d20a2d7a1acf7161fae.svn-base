import * as types from './mutation-types'
import * as gtypes from '../../mutation-types'
import webchat from '../../api/webchat'
import customer from '../../api/customer'
import config from '../../api/config'
import { formatShortTime, getFormatDateTime, m7Language, getCache, deepClone } from '../../../utils/m7Utils.js'
import { renderEmoji, msgConvertion, userStayTimeConverse } from '../../../utils/webchat.js'
import { filter } from 'lodash'
import Vue from 'vue'
import * as monitotTypes from '../monitor/mutation-types'

export const updateWebchatAutoClaimStatus = ({commit}, data) => {
  let req = {}
  if (data.status === 'open') {
    req.status = 'open'
  } else {
    req.status = 'close'
  }
  webchat.updateWebchatAutoClaimStatus(req).then(response => {
    if (response.success) {
      commit(types.SET_WEBCHAT_AUTOCLAIM, data)
    }
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, err)
  })
}
/**
 * 获取当前座席的待处理数和所在技能组下的待领取数
 */
export const refreshWebchatMenuNum = ({commit}) => {
  webchat.refreshMenuNum().then(response => {
    if (response.success) {
      let undealNum = response.openNum
      let todoNum = response.todoNum
      commit(types.SET_WEBCHAT_UNDEALNUM, {undealNum, todoNum})
      if (todoNum > 0 || undealNum > 0) {
        commit(types.SET_WEBCHAT_MODULE_READ, true)
      }
    }
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, err)
  })
}
export const getUndealInvitation = ({commit, dispatch}) => {
  return webchat.getUndealInvitation({}).then(response => {
    if (response.success) {
      response.data.forEach((obj) => {
        commit(types.CHANGE_INVITE_NOTIFY, {
          userName: obj.userName,
          sessionId: obj._id,
          sid: obj.sid,
          toPeer: obj.toPeer
        })
        dispatch('changeInvite', true)
        commit(types.SHOW_INVITE_NOTIFY, true)
      })
    }
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, err)
  })
}
/**
 * 查询处理中或全部IM会话数据
 */
export const queryWebchatList = ({commit, state}, data) => {
  let submenu = data.submenu
  return webchat.queryWebchatSession(data)
    .then(response => {
      if (submenu === 'webchat_todo') {
        response.list.forEach((data) => {
          if (!state.current.webchat_todo.timerList[data._id]) {
            webchatHourMeter({commit, state}, {
              startWaitTimer: data.startWaitTimer,
              online: data.userStatus,
              sessionId: data._id
            })
          }
          // if (data.status === 'changePeer') {
          //  let obj = {
          //    '_id': data._id,
          //    'type': 'out',
          //    'contentType': 'text',
          //    'message': '用户流转进了【' + data.DisplayName + '】技能组',
          //    'user': 'system',
          //    'status': 'deal',
          //    'platform': 'pc',
          //    'accessId': '66b8bcd0-a011-11e6-9eeb-a5c33b678ea5',
          //    'showHtml': 'false'
          //  }
          //  commit(types.UPDATE_WEBCHAT_MESSAGE_LIST, obj)
          // }
        })
      }
      commit(types.QUERY_WEBCHAT_LIST, {webchatList: response, submenu})
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 导出全部中有处理类型的会话
 */
export const exportWebchat = ({commit, state}, data) => {
  return webchat.exportWebchat(data)
    .then(response => {
      if (response.success) {
        commit(gtypes.SET_FILEDOWNLOAD, {path: response.path, isSession: true})
      }
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 根据id查询客户名称和创建时间数据
 */
export const popupWebchatById = ({commit}, data) => {
  delete data.submenu
  return webchat.popupWebchat(data)
    .then(response => {
      return response
      // commit(types.QUERY_WEBCHAT_SESSION_BY_ID, {chatSessionById: response.chatSession, submenu})
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 获取当前会话详细信息
 */
export const popupWebchat = ({commit, dispatch}, data) => {
  let submenu = data.submenu
  delete data.submenu
  return webchat.popupWebchat(data)
    .then(response => {
      let webchatSession = response.user
      let customer = {}
      if (response.row) {
        webchatSession.custId = response.row._id
        customer = response.row || {}
      }
      if (webchatSession.invitedUserName && webchatSession.inviteUserStatus === 'accept') {
        webchatSession.shwoInviteBtn = false
        webchatSession.assistAgent = true
      } else {
        if (webchatSession.invitedUserName && webchatSession.inviteUserStatus === 'undeal') {
          dispatch('changeInvite', true)
          commit(types.CHANGE_INVITE_NOTIFY, {
            userName: webchatSession.invitedUserName,
            sessionId: webchatSession._id,
            sid: webchatSession.sid,
            toPeer: ''
          })
          commit(types.SHOW_KICK_NOTIFY, true)
        }
        webchatSession.shwoInviteBtn = true
      }
      webchatSession.username = getCache('agents', webchatSession.user).displayName
      commit(types.POPUP_WEBCHAT_INFO, {session: webchatSession, submenu})
      commit(gtypes.SET_CURRENT_CUSTOMER, {data: customer, type: 'webchat', tabType: submenu, businessId: data._id})
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 获取当前会话历史记录
 */
export const queryUserHistory = ({commit, state, rootState}, data) => {
  let submenu = data.submenu
  let arr = []
  delete data.submenu
  return new Promise((resolve) => {
    webchat.queryUserHistory(data)
      .then(response => {
        if (response.list) {
          arr = response.list.reverse()
          let userSessionId = rootState.session.sessionId
          arr.forEach((item, index) => {
            let uid = item.user
            let type = item.type // in, out
            if (type === 'out') {
              let user = { displayName: '我' }
              if (uid !== userSessionId) {
                user = getCache('agents', uid) || { displayName: 'NA' }
              }
              item.uidDesc = user.displayName
              if (uid === 'system') {
                item.uidDesc = '系统'
              }
              if (uid === 'robot') {
                item.uidDesc = '机器人'
                item.robot = true
              }
            }
          })
          let run = (arr, i) => {
            return new Promise((resolve) => {
              let item = arr[i]
              if (item) {
                let isEsc = false
                let msgType = item.contentType
                if (msgType === 'text') {
                  if (item.showHtml === true || item.showHtml === 'true') {
                    isEsc = true
                  }
                  item.contentHasUrl = ''
                  let oldContent = item.message
                  let contentNew = msgConvertion(item.message)
                  item.message = contentNew
                  if (oldContent !== contentNew) {
                    isEsc = true
                    item.contentHasUrl = 'have'
                  }
                } else if (msgType === 'image') {
                  isEsc = true
                } else if (msgType === 'file') {
                  item.fileName = transferFileContent(item.message)
                  isEsc = true
                } else if (msgType === 'voice') {
                  Vue.set(item, 'play', false)
                }
                item.message = renderEmoji(item.message, isEsc)
                item.showTime = item.dateTime.substring(5)
                if (item.contentType === 'text') {
                  autoMatchMsg({commit, state}, {
                    message: item.message,
                    sessionId: data.sessionId,
                    flag: 'new'
                  }).then(() => {
                    resolve()
                  })
                } else {
                  resolve()
                }
              } else {
                resolve()
              }
            }).then(() => {
              if (i < arr.length - 1) {
                run(arr, i + 1)
              } else {
                resolve()
              }
            })
          }
          run(arr, 0)
        }
      })
  }).then(() => {
    if (submenu === 'qualityCheck') {
      commit(types.QUALITY_QUERY_WEBCHAT_HISTORY, {
        page: data.page,
        historyList: arr,
        sessionId: data.sessionId,
        submenu: submenu
      })
    } else {
      commit(types.QUERY_WEBCHAT_HISTORY, {
        page: data.page,
        historyList: arr,
        sessionId: data.sessionId,
        submenu: submenu
      })
    }
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 根据id查询会话数据
 */
export const queryChatSessionById = ({commit}, data) => {
  let submenu = data.submenu
  delete data.submenu
  return webchat.queryChatSessionById(data)
    .then(response => {
      commit(types.QUERY_WEBCHAT_SESSION_BY_ID, {chatSessionById: response.chatSession, submenu})
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 根据id查询会话数据
 */
export const queryChatInformationById = ({commit}, data) => {
  delete data.submenu
  return webchat.queryChatInfoById(data)
    .then(response => {
      return response
      // commit(types.QUERY_WEBCHAT_SESSION_BY_ID, {chatSessionById: response.chatSession, submenu})
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 根据id获取历史记录
 */
export const queryUserContactHistory = ({commit, rootState, state}, data) => {
  let arr = []
  delete data.submenu
  return webchat.queryUserHistory(data)
      .then(response => {
        if (response.list) {
          arr = response.list.reverse()
          let userSessionId = rootState.session.sessionId
          arr.forEach((item, index) => {
            let uid = item.user
            let type = item.type // in, out
            if (type === 'out') {
              let user = { displayName: '我' }
              if (uid !== userSessionId) {
                user = getCache('agents', uid) || { displayName: 'NA' }
              }
              item.uidDesc = user.displayName
              if (uid === 'system') {
                item.uidDesc = '系统'
              }
              if (uid === 'robot') {
                item.uidDesc = '机器人'
                item.robot = true
              }
            }
            if (item) {
              let isEsc = false
              let msgType = item.contentType
              if (msgType === 'text') {
                if (item.showHtml === true || item.showHtml === 'true') {
                  isEsc = true
                }
                item.contentHasUrl = ''
                let oldContent = item.message
                let contentNew = msgConvertion(item.message)
                item.message = contentNew
                if (oldContent !== contentNew) {
                  isEsc = true
                  item.contentHasUrl = 'have'
                }
              } else if (msgType === 'image') {
                isEsc = true
              } else if (msgType === 'file') {
                item.fileName = transferFileContent(item.message)
                isEsc = true
              } else if (msgType === 'voice') {
                Vue.set(item, 'play', false)
              }
              item.message = renderEmoji(item.message, isEsc)
              item.showTime = item.dateTime.substring(5)
            }
          })
        }
        return response
        // commit(types.QUERY_WEBCHAT_SESSION_BY_ID, {chatSessionById: response.chatSession, submenu})
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}
/**
 * 根据id查询会话数据
 */
export const queryChatInfoById = ({commit, state, rootState, dispatch}, data) => {
  let submenu = data.submenu
  if (submenu === 'webchat_todo') {
    data.queryHistory = true
  }
  delete data.submenu
  return webchat.queryChatInfoById(data)
    .then(response => {
      commit(types.QUERY_WEBCHAT_INFO_BY_ID, {
        chatInfoById: response.chatSession,
        visitInfoList: response.historyList || [],
        submenu
      })
    }).then(() => {
      // dispatch('loadUbaInfo', {_id: data._id})
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 查询当前座席信息
 */
export const getCurrentUser = ({commit}, data) => {
  return config.getCurrentUser(data)
    .then(response => {
      commit(types.GET_CURRENT_USER, {currentUser: response.user})
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 更新当前座席信息最大处理数
 */
export const updateCurrentUser = ({commit}, data) => {
  return config.updateCurrentUser(data)
    .then(response => {
      if (response.success) {
        commit(gtypes.SET_SUCCESS, 'message.editSucess')
        commit(types.UPDATE_CURRENT_USER, data)
      }
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 根据id查询会话数据
 */
export const getWebchatTodoShowConfig = ({commit}, data) => {
  let submenu = data.submenu
  delete data.submenu
  return webchat.getWebchatTodoShowConfig(data)
    .then(response => {
      commit(types.GET_WEBCHAT_TODO_SHOW_CONFIG, {todoShowConfig: response.data, submenu})
    }).catch(err => {
      console.log(err)
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 定位客户
 * @param {Stirng} data.customerId 客户id
 * @param {Stirng} data.callId
 * @param {Stirng} data.custName 客户名称
 */
export const locationCustomer = ({commit}, data) => {
  let customer = data.customer
  let submenu = data.submenu
  let sessionId = data.sessionId
  console.log(data)
  delete data.submenu
  delete data.sessionId
  delete data.customer
  return webchat.locationCustomer(data)
    .then(
      response => {
        if (response.success) {
          commit(types.LOCATION_CUSTOMER, {customer, submenu, sessionId})
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 解除客户绑定
 * @param {Stirng} data.customerId 客户id
 */
export const deleteCustomerImRelation = ({commit}, data) => {
  let sessionId = data.sessionId
  let sid = data.sid
  let sName = data.sName
  delete data.sid
  delete data.sName
  delete data.sessionId
  return webchat.deleteCustomerImRelation(data)
    .then(
      response => {
        if (response.success) {
          commit(types.DELETE_CUSTOMER_IM_RELATION, sessionId)
          commit(types.UPDATE_WEBCHAT_RELATION_CUSTOMER, {sid: sid, customer: {status: '', _id: '', name: sName}})
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 座席接受到消息
 * @param {Stirng} data._id 会话id
 */
export const dealMsg = ({commit}, data) => {
  if (data.tabType === 'webchat_todo') {
    delete data.tabType
    return webchat.dealMsg(data)
      .then(
        response => {
          if (response.success) {
            commit(types.DEAL_MSG, {sessionId: data._id})
          }
        }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
  }
}
/**
 * 座席回复消息
 * @param {String} contentType 消息类型,
 * @param {String} platform 平台
 * @param {String} accessId 接入号ID，全局唯一
 * @param {String} agentFirstReplyTime 座席首次回复时间
 * @param {String} manualTime  人工接待时间戳
 * @param {String} status 消息状态
 * @param {String} lastRedirectTime 最后转接座席或技能组时间戳
 * @param {String} lastClaimTime 最后领取时间戳
 * @param {String} content 消息内容
 * @param {String} firstReply 是否是首次回复
 * @param {String} timeStamp 时间戳
 * @param {String} createTime 创建时间
 * @param {String} uploadTimestamp 发送图片/文件时才有的上传时间戳
 */
export const replyMsg = ({commit, state}, {data, index}) => {
  let contentNew = data.contentNew
  let contentHasUrl = data.contentHasUrl
  delete data.contentHasUrl
  delete data.contentNew
  return webchat.replyMsg(data)
    .then(
      response => {
        response.row.message = decodeURIComponent(response.row.content)
        response.row.message = renderEmoji(response.row.message)
        removeTimer({commit, state}, data.sessionId)
        if (response.success) {
        } else {
          response.row.sendStatus = 'fail'
        }
        if (response.row.contentType === 'file') {
          response.row.fileName = transferFileContent(response.row.message)
        }
        if (contentNew) {
          response.row.message = contentNew
          response.row.contentHasUrl = contentHasUrl
        }
        commit(types.REPLY_MSG, {data: response.row, index: index})
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 点击更多历史消息时查询更多消息历史
 * @param {Stirng} data.sid 访客id
 * @param {Stirng} data.dateTime 时间
 * @param {Stirng} data.page 页码
 * @param {Stirng} data.limit 每页多少条
 * @param {Stirng} data.sessionId 会话id
 * @param {Stirng} data.submenu 当前菜单webchat_todo /webchat_all
 */
export const queryHistory = ({commit, state, rootState}, data) => {
  let submenu = data.submenu
  let sessionId = data.sessionId
  delete data.submenu
  delete data.sessionId
  return webchat.queryHistory(data)
    .then(
      response => {
        if (response.success) {
          let arr = response.list || []
          let userSessionId = rootState.session.sessionId
          arr.forEach((item, index) => {
            let uid = item.user
            let type = item.type // in, out
            if (type === 'out') {
              let user = { displayName: '我' }
              if (uid !== userSessionId) {
                user = getCache('agents', uid) || { displayName: 'NA' }
              }
              item.uidDesc = user.displayName
              if (uid === 'system') {
                item.uidDesc = '系统'
              }
              if (uid === 'robot') {
                item.uidDesc = '机器人'
                item.robot = true
              }
            }
          })
          let run = (arr, i) => {
            let item = arr[i]
            return new Promise((resolve) => {
              let isEsc = false
              let msgType = item.contentType
              if (msgType === 'text') {
                if (item.showHtml === true || item.showHtml === 'true') {
                  isEsc = true
                }
                item.contentHasUrl = ''
                let oldContent = item.message
                let contentNew = msgConvertion(item.message)
                item.message = contentNew
                if (oldContent !== contentNew) {
                  isEsc = true
                  item.contentHasUrl = 'have'
                }
              } else if (msgType === 'image') {
                isEsc = true
              } else if (msgType === 'file') {
                item.fileName = transferFileContent(item.message)
                isEsc = true
              } else if (msgType === 'voice') {
                Vue.set(item, 'play', false)
              }
              item.message = renderEmoji(item.message, isEsc)
              item.showTime = item.dateTime.substring(5)
              if (msgType === 'text') {
                autoMatchMsg({commit, state}, {
                  message: item.message,
                  sessionId: sessionId,
                  flag: 'history'
                }).then(() => {
                  resolve()
                })
              } else {
                resolve()
              }
            }).then(() => {
              if (i < arr.length - 1) {
                run(arr, i + 1)
              } else {
                commit(types.QUERY_HISTORY, {page: data.page, historyList: arr, sessionId: sessionId, submenu})
              }
            })
          }
          if (arr.length) {
            run(arr, 0)
          } else {
            commit(types.QUERY_HISTORY, {page: data.page, historyList: arr, sessionId: sessionId, submenu})
          }
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 保存自定义快捷回复语
 * @param {Stirng} data.quickreplys ["1","2"]
 * @param {Stirng} data.moduleType "webchat"/"email"
 */
export const saveQuickReply = ({commit}, data) => {
  return webchat.saveQuickReply(data)
    .then(
      response => {
        if (response.success) {
          commit(types.SAVE_QUICK_REPLY, true)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 获取自定义的快捷回复
 * @param {Stirng} data.moduleType "webchat"/"email"
 */
export const getQuickReplyList = ({commit}, data) => {
  return webchat.getQuickReplyList(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_QUICK_REPLY_LIST, response.quickreplys)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 快捷回复输入联系时,查询全部回复语(自定义+系统)
 * @param {Stirng} data.moduleType "webchat"/"email"
 */
export const getAllQuickReplyList = ({commit}, data) => {
  return webchat.getAllQuickReplyList(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_ALL_QUICK_REPLY_LIST, response.list)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 查询全部系统通用快捷回复语:
 * @param {Stirng} data.moduleType "webchat"/"email"
 */
export const queryWebChatAllTags = ({commit}, data) => {
  return webchat.queryWebChatAllTags(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_WEBCHAT_ALL_TAGS, response.list)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

export const queryWebChatTagsById = ({commit}, data) => {
  let index = data.index
  return webchat.queryWebChatTagsById(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_WEBCHAT_ALL_TAGS_CHILDREN, {list: response.list, index})
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 会话转接给指定座席或技能组
 * @param {String} data._id
 * @param {String} data.toUser 转接到座席id
 * @param {String} data.toUserName 座席名称
 * @param {String} data.sid 访客id
 * @param {String} data.queueId 转入技能组id
 * @param {String} data.toPeer 转入技能组id
 */
export const redirectWebchatSession = ({commit, state}, data) => {
  let result = state.webchatList.webchat_todo.list.filter((item) => item._id === data._id)
  if (result && result.length > 0) {
    data.message = result[0].lastMessage
    data.contentType = result[0].contentType
    data.showHtml = result[0].showHtml || ''
  }
  return new Promise(function (resolve) {
    webchat.redirectWebchatSession(data)
      .then(
        response => {
          if (response.success) {
            removeTimer({commit, state}, data._id)
            commit(types.REMOVE_SESSION, data._id)
            resolve(response.success)
          }
        }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
  })
}
/**
 * 推送排队信息至客户端:
 * @param {Stirng}
 */
export const pushQueueNumToWebChatClients = ({commit}, data) => {
  return webchat.pushQueueNumToWebChatClients(data)
    .then(
      response => {
        if (response.success) {
          commit(types.PUSH_QUEUE_NUM_TO_WEBCHAT_CLIENTS, true)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 邀请座席协助
 * @param {Stirng} data._id
 * @param {Stirng} data.invitedUser 被邀请座席id
 * @param {Stirng} data.invitedUserName 被邀请座席名称
 * @param {Stirng} data.sid
 */
export const inviteGroupSession = ({commit}, data) => {
  return new Promise(function (resolve) {
    webchat.inviteGroupSession(data)
      .then(
        response => {
          if (response.success) {
            commit(types.CHANGE_INVITE_NOTIFY, {
              userName: data.invitedUserName,
              sessionId: data._id,
              sid: data.sid,
              toPeer: ''
            })
            commit(types.SHOW_KICK_NOTIFY, true)
          }
          resolve(response.success)
        }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
  })
}
/**
 * 接受会话邀请
 * @param {Stirng} data._id
 * @param {Stirng} data.sid 会话sid,可以为空字符串
 * @param {Stirng} data.toPeer 技能组编号
 * invitedUserName
 */
export const acceptGroupSession = ({commit, state}, data) => {
  return webchat.acceptGroupSession(data)
    .then(
      response => {
        if (response.success) {
          response.session.inviteUserStatus = 'accept'
          let isEsc = false
          let data = response.session
          if (data.contentType === 'text') {
            if (data.showHtml === true || data.showHtml === 'true') {
              isEsc = true
            }
          }
          data.message = data.message === 'undefined' ? '' : data.message
          data.message = renderEmoji(data.message, isEsc)
          if (data.contentType === 'text') {
            data.contentHasUrl = ''
            let oldContent = data.message
            let contentNew = msgConvertion(data.message)
            data.message = contentNew
            if (oldContent !== contentNew) {
              data.contentHasUrl = 'have'
            }
          }
          if (data.contentType === 'file') {
            data.fileName = transferFileContent(data.message)
          } else if (data.contentType === 'voice') {
            Vue.set(data, 'play', false)
          }
          commit(types.UPDATE_WEBCHAT_MESSAGE_LIST, data)
          //  commit(types.UPDATE_WEBCHAT_MESSAGE_LIST, data)
          //  webchatTodoItemAdd
        }
      }
    )
    .catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 拒绝会话邀请
 * @param {Stirng} data._id 会话id
 */
export const refusedGroupSession = ({commit}, data) => {
  return webchat.refusedGroupSession(data)
    .then(
      response => {
        if (response.success) {
          commit(types.REFUSED_GROUP_SESSION, true)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 踢出邀请的座席
 * @param {Stirng} data._id 会话id
 */
export const kickGroupSession = ({commit}, data) => {
  return webchat.kickGroupSession(data)
    .then(
      response => {
        if (response.success) {
          commit(types.SHOW_INVITE_BTN, {flag: true, sessionId: data._id})
          commit(types.UPDATE_INVITE_INFO, {
            _id: data._id,
            inviteUserStatus: '',
            invitedUserName: '',
            assistAgent: false
          })
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
export const grabWebchatSession = ({commit}, data) => {
  return new Promise(function (resolve) {
    webchat.grabWebchatSession(data)
      .then(
        response => {
          if (response.success) {
            commit(gtypes.SET_SUCCESS, 'webchat.grabSuccess')
            resolve()
          }
        }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
  })
}
/**
 * 推送满意度评价
 * @param {String} id 会话id
 * @param {String} sid 访客id,
 * @param {String} currUser 当前座席
 * @param {String} contentType 消息类型
 * @param {String} platform 平台
 * @param {String} accessId 接入号ID，全局唯一
 * @param {String} agentFirstReplyTime 座席首次回复时间
 * @param {String} manualTime  人工接待时间戳
 * @param {String} status 消息状态
 * @param {String} lastRedirectTime 最后转接座席或技能组时间戳
 * @param {String} lastClaimTime 最后领取时间戳
 * @param {String} content 消息内容
 * @param {String} firstReply 是否是首次回复
 * @param {String} timeStamp 时间戳
 * @param {String} createTime 创建时间
 * @param {String} uploadTimestamp 发送图片/文件时才有的上传时间戳
 */
export const pushImCSRInfo = ({commit, state}, data) => {
  return webchat.pushImCSRInfo(data)
    .then(
      response => {
        if (response.success) {
          let obj = {
            type: 'system',
            platform: data.platform,
            sid: data.sid,
            createTime: response.time,
            message: '评价已发出',
            _id: data.sessionId
          }
          removeTimer({commit, state}, data._id)
          commit(types.UPDATE_WEBCHAT_MESSAGE_LIST, obj)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 结束会话
 * @param {Stirng} data._id 会话id
 * @param {Stirng} data.sid 访客id
 * @param {Stirng} data.finishReason 结束类型
 * @param {Stirng} data.finishKey 结束会话类型id
 * @param {Stirng} data.remark 备注
 */
export const finishWebchatSession = ({commit, state}, data) => {
  let finishiArr = data.finishiArr || []
  return new Promise(function (resolve) {
    webchat.finishWebchatSession(data)
      .then(
        response => {
          if (response.success) {
            if (!finishiArr.length) {
              finishiArr.push({_id: data._id})
            }
            finishiArr.forEach((item) => {
              removeTimer({commit, state}, item._id)
              commit(types.REMOVE_SESSION, item._id)
            })
            resolve(response.success)
          }
        }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
  })
}
/**
 * 取消会话邀请
 * @param {Stirng} data._id 会话id
 */
export const cancelGroupSession = ({commit}, data) => {
  return webchat.cancelGroupSession(data)
    .then(
      response => {
        if (response.success) {
          commit(types.CANCEL_GROUP_SESSION, true)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 提醒访客座席正在输入中
 * @param {Stirng} data.sid 会话id
 * @param {Stirng} data.timestamp 时间戳
 */
export const typeNotice = ({commit}, data) => {
  return webchat.typeNotice(data)
    .then(
      response => {
        if (response.success) {
          commit(types.TYPE_NOTICE, true)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 更新会话的备注信息
 * @param {Stirng} data.accessId 接入号
 * @param {Stirng} data.sid 访客id
 * @param {Stirng} data.content 备注内容
 */
export const updateWebchatSessionRemark = ({commit}, remark) => {
  return webchat.updateWebchatSessionRemark(remark)
    .then(
      response => {
        if (response.success) {
          commit(gtypes.SET_SUCCESS, 'webchat.remarkSuccess')
          commit(types.UPDATE_WEBCHAT_SESSION_REMARK, remark)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

export const loadUsers2Chat = ({dispatch}, data) => {
  return new Promise(function (resolve) {
    let isEnable = data.isEnable
    let hideMe = data.hideMe
    let currentId = data.currentId
    let isEmpty = data.isEmpty
    dispatch('getCache', {type: 'agents'}).then((agents) => {
      let agents1 = []
      if (isEnable) {
        for (let i = 0; i < agents.length; i++) {
          if (agents[i].status === 'enable') {
            agents1.push(agents[i])
          }
        }
      } else {
        for (let k = 0; k < agents.length; k++) {
          agents1.push(agents[k])
        }
      }
      if (hideMe) {
        for (let j = 0; j < agents1.length; j++) {
          if (agents1[j]._id === currentId) {
            agents1.splice(j, 1)
            break
          }
        }
      }
      let agents2 = []
      if (isEmpty) {
        let emptyAgents = [{_id: '', displayName: '放入领取池', pinyin: 'wusuoshuren', exten: '', status: 'enable'}]
        agents2 = emptyAgents.concat(agents1)
      } else {
        agents2 = agents1
      }
      resolve(agents2)
    })
  })
}

export const getOnlineAgent = ({commit, rootState, dispatch}, {data, type}) => {
  return new Promise(function (resolve) {
    webchat.showAllSkillGroup(data)
      .then(
        response => {
          let newGroups = []
          Promise.all(response.data.map((item) => {
            return new Promise(function (resolve) {
              let p1 = dispatch('loadUsers2Chat', {
                isEnable: true,
                isEmpty: true,
                currentId: rootState.session.user._id,
                hideMe: true
              })
              let p2 = dispatch('getCache', {type: 'onlineChannelAgent'})
              let p3 = dispatch('getCache', {type: 'accessChannelAgent', id: item.Exten})
              let p = Promise.all([p1, p2, p3])
              p.then(([agents, onlines, peer]) => {
                let accessAgents = []
                if (peer) {
                  accessAgents = peer.agents
                }
                let resultAgents = []
                let resultAgents2 = []
                for (let i = 0; i < accessAgents.length; i++) {
                  let agent = accessAgents[i]
                  for (let j = 0; j < agents.length; j++) {
                    let _agent = agents[j]
                    if (_agent._id === agent.agentID) {
                      resultAgents.push(_agent)
                      break
                    }
                  }
                }
                for (let i = 0; i < onlines.length; i++) {
                  let agent = onlines[i]
                  for (let j = 0; j < resultAgents.length; j++) {
                    let _agent = resultAgents[j]
                    if (_agent._id === agent._id) {
                      _agent.online = true
                      resultAgents2.push(_agent)
                      break
                    }
                  }
                }
                item.open = false
                item.onlineNum = resultAgents2.length
                if (item.onlineNum > 0) {
                  item.AssignMembers = resultAgents2
                  resolve(newGroups.push(item))
                } else {
                  resolve(newGroups)
                }
              })
            })
          })).then(() => {
            resolve(newGroups)
          })
        }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
  })
}

export const getPeerOnlineAgent = ({commit, rootState, dispatch}, peerId) => {
  return new Promise(function (resolve) {
    let newGroups = []
    let p1 = dispatch('loadUsers2Chat', {
      isEnable: true,
      isEmpty: true,
      currentId: rootState.session.user._id,
      hideMe: true
    })
    let p2 = dispatch('getCache', {type: 'onlineChannelAgent'})
    let p3 = dispatch('getCache', {type: 'accessChannelAgent', id: peerId})
    let p = Promise.all([p1, p2, p3])
    p.then(([agents, onlines, peer]) => {
      let accessAgents = []
      if (peer) {
        accessAgents = peer.agents
      }
      let resultAgents = []
      let resultAgents2 = []
      for (let i = 0; i < accessAgents.length; i++) {
        let agent = accessAgents[i]
        for (let j = 0; j < agents.length; j++) {
          let _agent = agents[j]
          if (_agent._id === agent.agentID) {
            resultAgents.push(_agent)
            break
          }
        }
      }
      for (let i = 0; i < onlines.length; i++) {
        let agent = onlines[i]
        for (let j = 0; j < resultAgents.length; j++) {
          let _agent = resultAgents[j]
          if (_agent._id === agent._id) {
            _agent.online = true
            resultAgents2.push(_agent)
            break
          }
        }
      }
      if (resultAgents2.length) {
        newGroups.push({AssignMembers: resultAgents2})
      }
      resolve(newGroups)
    })
  })
}

let syncOnlineAgent = function ({dispatch, commit}, data) {
  dispatch('getCache', {type: 'onlineChannelAgent'}).then((onlines) => {
    let uid = data.userId
    let online = data.online
    let has = false
    for (let i = 0; i < onlines.length; i++) {
      let agent = onlines[i]
      if (agent._id === uid) {
        has = true
        break
      }
    }
    if (online) {
      if (!has) {
        dispatch('addCache', {type: 'onlineChannelAgent', data: {_id: uid}})
        commit(monitotTypes.UPDATE_CLAIM_STATUS, {user: uid, status: true})
      }
    } else {
      if (has) {
        dispatch('removeCache', {type: 'onlineChannelAgent', id: uid})
        commit(monitotTypes.UPDATE_CLAIM_STATUS, {user: uid, status: false})
      }
    }
  })
}

let transferFileContent = function (params) {
  let paramsNew = params.split('?fileName=')
  let html = ''
  if (paramsNew.length > 1) {
    let params2 = paramsNew[1].split('?fileSize=')
    if (params2.length) {
      html = params2[0]
    }
  }
  return html
}

export const dispatchWebchat = ({commit, state, rootState, dispatch}, evtJson) => {
  let data = evtJson.Data
  let event = evtJson.Event
  let isMe = evtJson.Foryou
  let obj = {}
  for (let i in data) {
    let value = data[i]
    let key = i.replace(/^\S/, function (s) {
      return s.toLowerCase()
    })
    obj[key] = value
  }
  try {
    if (obj.sName) {
      obj.sName = decodeURIComponent(obj.sName)
    }
  } catch (e) {

  }
  if (obj.content) {
    try {
      obj.content = decodeURIComponent(obj.content)
    } catch (e) {
      obj.content = obj.content.replace(/%26/g, '&')
      obj.content = obj.content.replace(/%23/g, '#')
      obj.content = obj.content.replace(/%3A/g, ':')
      obj.content = obj.content.replace(/%24/g, '$')
      obj.content = obj.content.replace(/%40/g, '@')
      obj.content = obj.content.replace(/%2B/g, '+')
      obj.content = obj.content.replace(/%3D/g, '=')
      obj.content = obj.content.replace(/%2F/g, '/')
    }
  }
  if (event === 'NewNotify' && obj.operation === 'claim') {
  } else if (event === 'NewNotify' && obj.type === 'agentPushStatus') {
    syncOnlineAgent({dispatch, commit}, obj)
  } else if (event === 'NewNotify' && obj.type === 'chatSessionClose') {
    if (isMe) {
      removeTodoItem({commit, state}, obj._id)
    } else {
    }
  // } else if (event === 'NewNotify' && obj.operation === 'invitedVideo') {
  //   // 接收到视频聊天邀请
  //   commit(types.UPDATE_VIDEO_INVITE_STATUS, true)
  //   let inviteMsg = {
  //     videoInviteSessionid: obj._id,
  //     videoInviteToken: obj.token
  //   }
  //   commit(types.UPDATE_VIDEO_INVITE_DATA, inviteMsg)
  } else if (event === 'NewNotify' && obj.type === 'delete_relation') {
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'autoClose') {
    if (isMe) {
      removeTodoItem({commit, state}, obj._id)
      let content = m7Language('notify.webchat6')
      commit(gtypes.SET_SUCCESS, obj.sName + content)
      commit(gtypes.SET_NOTIFY, {tag: 'webchat', notify: obj})
    } else {
    }
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'changePeer') {
    removeTodoItem({commit, state}, obj._id)
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'redirectAgent') {
    removeTodoItem({commit, state}, obj._id)
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'grab_redirect') {
    removeTodoItem({commit, state}, obj._id)
    let content1 = m7Language('notify.webchat7')
    let content2 = m7Language('notify.webchat8')
    commit(gtypes.SET_SUCCESS, obj.toUserName + content1 + obj.sName + content2)
    commit(gtypes.SET_NOTIFY, {tag: 'webchat', notify: obj})
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'invited') {
    commit(types.CHANGE_INVITE_NOTIFY, {userName: obj.userName, sessionId: obj._id, sid: obj.sid, toPeer: obj.toPeer})
    dispatch('changeInvite', true)
    commit(types.SHOW_INVITE_NOTIFY, true)
    commit(gtypes.SET_NOTIFY, {tag: 'webchat', notify: obj})
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'invited_redirect') {
    // 会话被转接了
    removeTodoItem({commit, state}, obj._id)
    dispatch('queryWebchatList', {'submenu': 'webchat_todo'})
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'invited_cancel') {
    // 取消邀请
    dispatch('changeInvite', false)
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'invite_kick') {
    // 被踢出
    commit(gtypes.SET_SUCCESS, 'notify.webchat15')
    removeTodoItem({commit, state}, obj._id)
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'invite_close') {
    // 会话被关闭
    commit(gtypes.SET_SUCCESS, 'notify.webchat16')
    removeTodoItem({commit, state}, obj._id)
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'invite_handle' && obj.accept === true) {
    // 对方同意了邀请
    commit(types.SHOW_INVITE_BTN, {flag: false, sessionId: obj._id})
    let invitedUserName = getCache('agents', obj.from).displayName
    commit(types.UPDATE_INVITE_INFO, {_id: obj._id, inviteUserStatus: 'accept', invitedUserName, assistAgent: true})
    dispatch('changeInvite', false)
    commit(gtypes.SET_SUCCESS, 'notify.webchat17')
  } else if (event === 'NewNotify' && obj.type === 'webchat' && obj.operation === 'invite_handle' && obj.accept === false) {
    // 对方拒绝了邀请
    commit(types.SHOW_INVITE_BTN, {flag: true, sessionId: obj._id})
    commit(types.UPDATE_INVITE_INFO, {
      _id: data._id,
      inviteUserStatus: 'undeal',
      invitedUserName: '',
      assistAgent: false
    })
    dispatch('changeInvite', false)
    commit(gtypes.SET_SUCCESS, 'notify.webchat18')
  } else if (event === 'NewNotify' && obj.type === 'changePeer') {
    let mailQueues = getCache('mailQueues')
    let queueDisplayName = ';'
    for (let i = 0; i < mailQueues.length; i++) {
      if (mailQueues[i].Exten === obj.toPeer) {
        queueDisplayName = mailQueues[i].DisplayName
      }
    }
    obj.status = 'changePeer'
    obj.content = '用户流转进了【' + queueDisplayName + '】技能组'
    if (state.webchatList.webchat_todo.init) {
      webchatTodoItemAdd({commit, state}, obj)
    } else {
      let data = {submenu: 'webchat_todo'}
      dispatch('queryWebchatList', data)
    }
  } else if (event === 'NewNotify' && obj.type === 'invited_changePeer') {
    if (data.invitedUser === rootState.session.user._id) {
      removeTodoItem({commit, state}, obj._id)
    }
  } else if (event === 'NewNotify' && obj.type === 'refreshUndealNum') {
  } else if (event === 'GroupMsg') {
    obj.msgType = 'groupMsg'
    if (obj.type === 'out') {
      removeTimer({commit, state}, obj.sessionId)
    }
    if (state.webchatList.webchat_todo.init) {
      webchatTodoItemAdd({commit, state}, obj)
    } else {
      let data = {submenu: 'webchat_todo'}
      dispatch('queryWebchatList', data)
    }
  } else if (event === 'NewWebchat' && obj.msgType === 'typeNotice') {
    if (obj.ubaSessionId) {
      // commit(types.UPDATE_PRELOADED_STATE, obj)
      dispatch('changeStatus', obj)
    }
    commit(types.UPDATE_PRELOADED_MSG, {message: obj.content, flag: true, _id: obj._id})
  } else {
    if (isMe && obj.content && obj.msgType === 'newMsg') {
      commit(gtypes.SET_NOTIFY, {tag: 'webchat', notify: obj})
      if (event === 'NewWebchat' && obj.msgType === 'newMsg' && obj.ubaSessionId) {
        // commit(types.UPDATE_PRELOADED_STATE, obj)
        dispatch('changeStatus', obj)
      }
    } else {
      if (isMe && obj.msgType === 'disConn') {
        commit(types.UPDATE_PRELOADED_MSG, {message: '', flag: false, _id: obj._id})
        commit(types.SET_OFFORONLINE_STATUS, {_id: obj._id, statu: 'offline'})
        commit(gtypes.SET_NOTIFY, {tag: 'webchat', notify: obj})
      } else if (isMe && obj.msgType === 'newConn') {
        commit(types.SET_OFFORONLINE_STATUS, {_id: obj._id, statu: 'online'})
        commit(gtypes.SET_NOTIFY, {tag: 'webchat', notify: obj})
      } else if (isMe && (obj.operation === 'changePeer' || obj.msgType === 'convertManual')) {
        commit(gtypes.SET_NOTIFY, {tag: 'webchat', notify: obj})
      } else if (isMe && obj.operation === 'redirect') {
        commit(gtypes.SET_NOTIFY, {tag: 'webchat', notify: obj})
      }
    }
    if (isMe) {
      commit(types.UPDATE_PRELOADED_MSG, {message: '', flag: false, _id: obj._id})
      if (evtJson.assign) {
        dispatch('pushQueueNumToWebChatClients', {toPeer: obj.toPeer})
      }
      if (state.webchatList.webchat_todo.init) {
        webchatTodoItemAdd({commit, state}, obj)
      } else {
        let data = {submenu: 'webchat_todo'}
        dispatch('queryWebchatList', data)
      }
      if (isMe && obj.content && obj.msgType === 'newMsg') {
      }
    } else {
    }
  }
}
let webchatTodoItemAdd = function ({commit, state}, dataObj) {
  let data = deepClone(dataObj)
  new Promise(function (resolve) {
    data.sName = data.sName || ' '
    if (data.createTime) {
      let _t = formatShortTime(data.createTime)
      data.shortTime = _t.name
    } else {
      data.shortTime = ''
    }
    if (data.msgType === 'newConn') {
      let strarr = data.createTime.split(' ')
      data.message = strarr[1] + ' ' + m7Language('webchat.newCon')
      data.type = 'system'
    } else if (data.msgType === 'disConn') {
      let strarr = data.createTime.split(' ')
      data.message = strarr[1] + ' ' + m7Language('webchat.disCon')
      data.type = 'system'
    } else if (data.msgType === 'invited') {
      data.message = '邀请' + data.invitedUserName + m7Language('webchat.invited')
      data.type = 'system'
    } else if (data.msgType === 'invite_accept') {
      data.message = '座席' + data.invitedUserName + m7Language('webchat.inviteAccept')
      data.type = 'system'
    } else if (data.msgType === 'invite_refuesd') {
      data.message = '座席' + data.invitedUserName + m7Language('webchat.inviteRefuesd')
      data.type = 'system'
    } else if (data.msgType === 'invite_cancel') {
      data.message = m7Language('webchat.inviteCancel1') + data.invitedUserName + m7Language('webchat.inviteCancel2')
      data.type = 'system'
    } else if (data.msgType === 'invite_kick') {
      data.message = m7Language('webchat.inviteKick1') + data.invitedUserName + m7Language('webchat.inviteKick2')
      data.type = 'system'
    } else if (data.msgType === 'saveImCSRInfo') {
      data.createTime = data.createTime
      if (data.platform !== 'pc' && data.isInvestigate !== undefined && !data.isInvestigate) { // 已经评价过了
        return
      }
      data.message = data.message
      data.type = 'system'
      /* } */
    } else if (data.msgType === 'groupMsg') {
      data.type = 'out'
      data.message = data.content
    } else { // newMsg ,investigate
      data.message = data.content
    }
    data.dateTime = data.createTime
    data.showTime = data.dateTime.substring(5)
    // if (data.contentType !== 'video') {
    //     data.message = data.content
    //   }
    // }
    // if (data.contentType !== 'video') {
    //   data.dateTime = data.createTime
    //   data.showTime = data.dateTime.substring(5)
    // } else {
    //   data.showTime = data.dateTime.substring(5)
    // }
    if (data.msgType === 'newMsg' || data.msgType === 'newConn' || data.msgType === 'sendImQAMsg' || data.msgType === 'newSystem') {
      if (data.userStatus && data.userStatus === 'offline') {
        data.userStatus = 'offline'
        data.userStatusClass = 'nonline'
        data.userStatusDesc = '离线 ' + data.shortTime
      } else {
        data.userStatus = 'online'
        data.userStatusClass = 'online'
        data.userStatusDesc = '在线'
      }
      resetTimerList({commit, state}, {sessionId: data._id, online: data.userStatus})
    }
    if (data.msgType === 'disConn') {
      data.userStatus = 'offline'
      data.userStatusClass = 'nonline'
      data.userStatusDesc = '离线 ' + data.shortTime
      resetTimerList({commit, state}, {sessionId: data._id, online: data.userStatus})
    }
    if (data.status !== 'finish' && data.msgType !== 'disConn') {
      if (data.userStatus === 'offline') {
        data.userStatus = 'offline'
        data.userStatusClass = 'nonline'
        let offlineTime = getFormatDateTime(new Date(data.sBreakTime))
        data.userStatusDesc = '离线 ' + formatShortTime(offlineTime)
        resetTimerList({commit, state}, {sessionId: data._id, online: data.userStatus})
      } else if (data.userStatus === 'online') {
        data.userStatus = 'online'
        data.userStatusClass = 'online'
        data.userStatusDesc = '在线'
        resetTimerList({commit, state}, {sessionId: data._id, online: data.userStatus})
      }
    }
    if (data.type === 'changePeer') {
      data.contentType = 'text'
      data.type = 'out'
      data.userStatus = ''
      data.userStatusClass = ''
      data.userStatusDesc = ''
    }
    data.type = data.type || 'in'
    data.leakNum = data.leakNum || 0
    data.status = data.status || 'deal'
    let isEsc = false
    if (data.contentType === 'text') {
      if (data.showHtml === true || data.showHtml === 'true') {
        isEsc = true
      }
    }
    data.message = data.message === 'undefined' ? '' : data.message
    data.message = renderEmoji(data.message, isEsc)
    if (data.contentType === 'text') {
      data.contentHasUrl = ''
      let oldContent = data.message
      let contentNew = msgConvertion(data.message)
      data.message = contentNew
      if (oldContent !== contentNew) {
        data.contentHasUrl = 'have'
      }
    }
    if (data.contentType === 'file') {
      data.fileName = transferFileContent(data.message)
    } else if (data.contentType === 'voice') {
      Vue.set(data, 'play', false)
    }
    // if (data.contentType === 'video' && state.isinviteVideo && data.videoStatus === 'cancel') {
    //   // 视频聊天邀请被取消
    //   commit(types.UPDATE_VIDEO_INVITE_STATUS, false)
    //   let inviteMsg = {
    //     videoInviteSessionid: '',
    //     videoInviteToken: ''
    //   }
    //   commit(types.UPDATE_VIDEO_INVITE_DATA, inviteMsg)
    // }
    // if (data.contentType === 'video' && state.isVideoing && data.videoStatus === 'refuse') {
    //   // 视频邀请被对方拒绝
    //   commit(types.UPDATE_VIDEO_CHAT_STATUS, false)
    //   let videoMsg = {
    //     videoSessionid: '',
    //     videoToken: '',
    //     videoUsername: ''
    //   }
    //   commit(types.UPDATE_VIDEO_CHATDATA, videoMsg)
    // }
    // if (data.contentType === 'video' && state.isVideoing && data.videoStatus === 'Hangup') {
    //   // 视频聊天对方挂断
    //   commit(types.UPDATE_VIDEO_CHAT_STATUS, false)
    //   let videoMsg = {
    //     videoSessionid: '',
    //     videoToken: '',
    //     videoUsername: ''
    //   }
    //   commit(types.UPDATE_VIDEO_CHATDATA, videoMsg)
    // }
    // console.log(data)
    commit(types.UPDATE_WEBCHAT_MESSAGE_LIST, data)
    resolve()
  }).then(() => {
    if (state.load) {
      if (!state.current.webchat_todo.timerList[data._id]) {
        webchatHourMeter({commit, state}, {
          startWaitTimer: data.startWaitTimer,
          online: data.userStatus,
          sessionId: data._id
        })
      } else {
        if (data.type === 'in' && data.when) {
          if (data.contentType === 'text') {
            autoMatchMsg({commit, state}, {message: data.message, sessionId: data._id, flag: 'new'})
          }
          if (!state.current.webchat_todo.timerList[data._id]) {
            webchatHourMeter({commit, state}, {
              startWaitTimer: data.startWaitTimer,
              online: 'online',
              sessionId: data._id
            })
          }
        }
      }
      if (state.current.webchat_todo.currentOpenSession === data._id && document.getElementsByClassName('webchat_todo_conbox').length) {
        dealMsg({commit}, {tabType: 'webchat_todo', _id: data._id})
      }
    }
  })
}

export const changeStatus = ({commit, state, rootState}, data) => {
  let sessionId = data.ubaSessionId
  let ubaSession = state.inviteUbaSessionList.list.filter(obj => obj._id === sessionId)[0]
  if (ubaSession) {
    if (ubaSession.status !== 'webchat.inviteStatusTypingTable' && ubaSession.status !== 'webchat.inviteStatusSuccess' && data.msgType === 'typeNotice') {
      let oldVal = ubaSession.status
      let status = 'webchat.inviteStatusTypingTable'
      // ubaSession.status = 'webchat.inviteStatusTyping'
      // ubaSession.dis_click = true
      commit(types.UPDATE_PRELOADED_STATE, {status, sessionId})
      setTimeout(() => {
        if (ubaSession.status !== 'webchat.inviteStatusSuccess') {
          status = oldVal
          commit(types.UPDATE_PRELOADED_STATE, {status, sessionId})
          // ubaSession.status = oldVal
          // ubaSession.dis_click = true
        }
      }, 5000)
    } else if (data.msgType === 'newMsg') {
      let status = 'webchat.inviteStatusSuccess'
      commit(types.UPDATE_PRELOADED_STATE, {status, sessionId})
      // ubaSession.status = 'webchat.inviteStatusSuccess'
      // ubaSession.dis_click = true
    }
  }
}

export const dispatchUba = ({commit, state, rootState, dispatch}, evtJson) => {
  let obj = evtJson.Data
  if (obj.type === 'newUbaInfo') {
    let page = obj.page
    let pageId = page.id
    let ubaSessionId = obj.ubaSessionId
    let ubaSession = state.current.webchat_todo.ubaInfoList[ubaSessionId]
    console.log(ubaSession)
    if (ubaSession.pages.length > 0) {
      let data = {}
      let stayTimeDesc = ''
      let hasPage = ubaSession.pages.filter(obj => obj._id === pageId)[0]
      if (page.stayTime) {
        let stayTime = userStayTimeConverse(page.stayTime)
        if (!stayTime) {
          stayTime = '0秒'
        }
        stayTimeDesc = '停' + stayTime
        if (typeof (hasPage) !== 'undefined') {
          commit(types.UBAINFO_PUSH, {_id: pageId, stayTimeDesc: stayTimeDesc, sessionId: ubaSessionId, change: true})
        } else {
          for (let key in page) {
            data[key] = page[key]
          }
          data._id = data.id
          data.account = obj.account
          data.sessionId = obj.ubaSessionId
          data.userId = obj.ubaUserId
          data.isStartPage = false
          data.sessionId = obj.ubaSessionId
          data.timeStart = getFormatDateTime(new Date(data.timeStart)).split(' ')[1]
          data.stayTimeDesc = stayTimeDesc
          commit(types.UBAINFO_PUSH, data)
        }
      } else {
        // 新添加
        if (typeof (hasPage) === 'undefined') {
          for (let key in page) {
            data[key] = page[key]
          }
          data._id = data.id
          data._id = data.id
          data.account = obj.account
          data.sessionId = obj.ubaSessionId
          data.userId = obj.ubaUserId
          data.isStartPage = false
          data.sessionId = obj.ubaSessionId
          data.timeStart = getFormatDateTime(new Date(data.timeStart)).split(' ')[1]
          commit(types.UBAINFO_PUSH, data)
        }
      }
    }
  }
}

export const getMatchMsgResponse = ({commit, state}, data) => {
  return new Promise(function (resolve) {
    customer.queryCustomerByPopup(data)
      .then(
        response => {
          response.count = response.list
          let info = {
            autoCustName: state.autoCust[data.callTel].autoCustName,
            autoCustPhone: state.autoCust[data.callTel].autoCustPhone,
            autoCustObj: response,
            autoCustLength: response.list.length || 0
          }
          commit(types.AUTO_CUST_INFO, {sessionId: data.callTel, data: info})
          resolve()
        }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
  })
}
export const autoMatchMsg = ({commit, state}, {message, sessionId, flag}) => {
  return new Promise(function (resolve) {
    let regName = /[\s,.?;!:、，。？；！： ]+(.*(先生|小姐|女士|男士|公司))/gm
    let regName2 = /(.*(先生|小姐|女士|男士|公司))/gm
    let regPhone = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/gm
    let ary
    let useName = true
    let usePhone = true
    let request = false
    let info
    if (state.autoCust[sessionId]) {
      info = {
        autoCustName: state.autoCust[sessionId].autoCustName,
        autoCustPhone: state.autoCust[sessionId].autoCustPhone,
        autoCustLength: state.autoCust[sessionId].autoCustLength,
        autoCustObj: state.autoCust[sessionId].autoCustObj
      }
    } else {
      info = {
        autoCustName: '',
        autoCustPhone: '',
        autoCustLength: 0,
        autoCustObj: {}
      }
    }
    if (flag === 'new') {
      ary = regName.exec(message)
    } else {
      if (info.autoCustName) {
        useName = false
      }
      if (info.autoCustPhone) {
        usePhone = false
      }
      if (info.autoCustName && info.autoCustPhone) {
        resolve()
        return
      }
      if (useName) {
        ary = regName.exec(message)
      }
    }
    let data = {
      callId: sessionId + '_popupWebchat',
      callTel: sessionId
    }
    if (ary && ary.length > 0) {
      info.autoCustName = data.combox = RegExp.$1
      data.field = 'displayName'
      request = true
    } else if (useName) {
      let _ary = regName2.exec(message)
      if (_ary && _ary.length > 0) {
        info.autoCustName = data.combox = RegExp.$1
        data.field = 'displayName'
        request = true
      }
    }
    let ary1 = []
    if (usePhone) {
      ary1 = regPhone.exec(message)
    }
    if (ary1 && ary1.length > 0) {
      data.field = 'phone'
      info.autoCustPhone = data.combox = ary1[0]
      request = true
    }
    if (info.autoCustName && info.autoCustPhone) {
      data.field = 'webchat'
      data.combox = info.autoCustPhone
      data.displayName = info.autoCustName
    }
    if (request) {
      commit(types.AUTO_CUST_INFO, {sessionId: data.callTel, data: info})
      getMatchMsgResponse({commit, state}, data).then(() => {
        resolve()
      })
    } else {
      resolve()
    }
  })
}
let webchatHourMeter = function ({commit, state}, {startWaitTimer, online, sessionId}) {
  if (startWaitTimer >= 0) {
    if (!state.current.webchat_todo.timerList[sessionId]) {
      let timerObj = {
        start: function (startWaitTimer) {
          let that = this
          that.initSecondTime = startWaitTimer
          that.startfun = setInterval(function () {
            that.initSecondTime += 1
            let showTime = that.initSecondTime
            let minute = Math.floor(showTime / 60)
            let second = Math.floor(showTime % 60)
            if (second < 10) {
              second = '0' + second
            }
            let time = minute + ':' + second
            if (that.online === 'online') {
              if (startWaitTimer < 0) {
                commit(types.UPDATE_WAIT_TIME, {time: time, flag: false, sessionId: that.sessionId})
              } else {
                commit(types.UPDATE_WAIT_TIME, {time: time, flag: true, sessionId: that.sessionId})
              }
            } else {
              commit(types.UPDATE_WAIT_TIME, {time: time, flag: false, sessionId: that.sessionId})
            }
          }, 1000)
        },
        online: online,
        startfun: null,
        sessionId: sessionId,
        end: function () {
          var that = this
          clearInterval(that.startfun)
          delete state.current.webchat_todo.timerList[sessionId]
        }
      }
      timerObj.start(startWaitTimer)
      commit(types.BIND_TIMEER_OBJ, {timerObj: timerObj, sessionId: sessionId})
    }
  } else {
    if (startWaitTimer === -1 && state.current.webchat_todo.timerList[sessionId]) {
      removeTimer({commit, state}, sessionId)
    }
  }
}

let removeTimer = function ({commit, state}, sessionId) {
  if (state.current.webchat_todo.timerList[sessionId]) {
    state.current.webchat_todo.timerList[sessionId].end()
    commit(types.UPDATE_WAIT_TIME, {time: '', flag: false, sessionId: sessionId})
  }
}

let removeTodoItem = function ({commit, state}, sessionId) {
  commit(types.REMOVE_SESSION, sessionId)
  removeTimer({commit, state}, sessionId)
}

let resetTimerList = function ({commit, state}, {sessionId, online}) {
  commit(types.RESET_TIMER_LIST, {sessionId, online})
}

// let wxObjContentHasUrl = function (data) {
//   if (data.contentDesc) {
//     let old = data.contentDesc
//     data.contentDesc = msgConvertion(data.contentDesc)
//     if (old !== data.contentDesc) {
//       data.contentHasUrl = 'have'
//     }
//   }
// }

// let msgConvertion = function (data) {
//   let array0 = data.match(/src=|href=/) || []
//   let obstr = data
//   if (!(array0[0])) {
//     // let re = /(www\.|(http|https|ftp):\/\/)+[A-Za-z0-9]+[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<> \"\"])(\S[^,，。;； ！!：:]*)/gi
//     let re1 = /^(http:\/\/|https:\/\/)?/
//     let arry1
//     let arry2 = []
//     while (arry1 = re.exec(data)) {
//       arry2.push(arry1[0])
//       obstr = obstr.replace(arry1[0], '######')
//     }
//     let subos = ''
//     if (arry2.length) {
//       for (let i = 0; i < arry2.length; i++) {
//         let arry3 = re1.exec(arry2[i])
//         if (arry3[0]) {
//           subos = '<a href="' + arry2[i] + '" target="_blank">' + arry2[i] + '</a>'
//         } else {
//           subos = '<a href="http://' + arry2[i] + '" target="_blank">' + arry2[i] + '</a>'
//         }
//         obstr = obstr.replace('######', subos)
//       }
//     }
//   }
//   return obstr
// }
// let formatChatShortTime = function (date, showSencond) {
//   if (!date) {
//     return ''
//   }
//   let _d = date.substring(0, 10)
//   let _t = ''
//   if (showSencond) {
//     _t = date.substring(11, 19)
//   } else {
//     _t = date.substring(11, 16)
//   }
//   let a = _d.split('-')
//   let dd = parseInt(a[0], 10) + '/' + parseInt(a[1], 10) + '/' + parseInt(a[2], 10)
//   let today = new Date()
//   let now = countDay(0)
//   let yesterday = countDay(-1)
//   let _yesterday = countDay(-2)
//   let result = new Object()
//   result.time = date
//   result.name = _d
//   if (dd === now) {
//     result.name = _t
//   } else if (dd === yesterday) {
//     result.name = '昨天 ' + _t
//   } else if (dd === _yesterday) {
//     result.name = '前天 ' + _t
//   } else if (a[0] < today.getFullYear()) {
//     result.name === a[0] + '年' + a[1] + '月' + a[2] + '日 ' + _t
//   } else if (Date.parse(dd) < Date.parse(now)) {
//     result.name = a[1] + '月' + a[2] + '日 ' + _t
//   }
//   return result.name
// }
/**
 * 获取主动邀请会话列表
 * @param commit
 * @param rootState
 * @param dispatch
 * @param data
 * @param data.pageSize 条数
 * @returns {Promise.<T>|Promise<R>}
 */
export const getSessionsByAccount = ({commit, state, rootState, dispatch}, data) => {
  return webchat.getSessionsByAccount({
    account: rootState.session.user.account,
    pageSize: data.pageSize,
    page: data.page,
    page_pageSize: 10
  }).then(res => {
    if (res.success) {
      let sessions = res.sessions
      for (let i = 0; i < sessions.length; i++) {
        let _data = sessions[i]
        if (_data.platform.seokeywords === undefined || _data.platform.seokeywords === 'undefined') {
          _data.platform.seokeywords = ''
        }
        let pages = _data.pages
        let pageCreateTime = pages[0].timeStart
        for (let j = 0; j < pages.length; j++) {
          if (pages[j].timeStart > pageCreateTime) {
            pageCreateTime = pages[j].timeStart
          }
          pages[j].stayTime = pages[j].stayTime || ''
          if (pages[j].stayTime) {
            pages[j].stayTime = userStayTimeConverse(pages[j].stayTime)
          }
          pages[j].timeStart = getFormatDateTime(new Date(pages[j].timeStart)).split(' ')[1]
        }
        _data.pageCreateTime = pageCreateTime
        _data.num = (data.page - 1) * data.pageSize + i + 1
        _data.status = 'webchat.inviteStatusStaying'
        _data.page = 1
      }
      commit(types.INVITE_SESSION_LIST, sessions)
    }
    return res
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 主动会话列表中的轨迹翻页
 * @param commit
 * @param rootState
 * @param dispatch
 * @param data
 * @param data.sid 轨迹的ubaSessionId
 */
export const getMoreTrack = ({commit, state, rootState, dispatch}, data) => {
  let sid = data.sid
  let ubaSession = filter(state.inviteUbaSessionList.list, {_id: sid})[0]
  let _data = {
    timeStart: ubaSession.pageCreateTime,
    page: (ubaSession.page || 1) + 1,
    pageSize: 10,
    ubaSessionId: sid,
    account: rootState.session.account.account
  }
  return webchat.getUbaPagesBySessionId(_data).then(res => {
    if (res.success) {
      let pages = res.data.page
      if (pages.length > 0) {
        for (let i = 0; i < pages.length; i++) {
          let pageLi = pages[i]
          pageLi.stayTime = pageLi.stayTime || ''
          if (pageLi.stayTime) {
            pageLi.stayTime = userStayTimeConverse(pageLi.stayTime)
          }
          pageLi.timeStart = getFormatDateTime(new Date(pageLi.timeStart)).split(' ')[1]
        }
        commit(types.INVITE_SESSION_MORETRACK, {_id: ubaSession._id, pages})
      }
    }
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 邀请会话
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data.sessionIds //要邀请的轨迹会话id
 * @param data.inviteMessage //邀请语
 * @returns {*|Promise<R2|R1>|Promise<R>|Promise.<TResult>}
 */
export const inviteCustomers = ({commit, state, rootState, dispatch}, data) => {
  return webchat.inviteCustomers({
    agentId: rootState.session.sessionId,
    sessionIds: data.sessionIds,
    account: rootState.session.user.account,
    inviteMessage: data.inviteMessage
  }).then(res => {
    if (res.success) {
      commit(types.INVITE_SESSION_INVITE, res.rsList)
    } else {
      commit(gtypes.SET_ERROR, 'webchat.' + res.message)
    }
    return res
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}

/**
 * 加载浏览轨迹
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data._id
 * @returns {Promise.<T>|Promise<R>}
 */
export const loadUbaInfo = ({commit, state, rootState, dispatch}, data) => {
  let _id = data._id
  let ubaSessionId = data.ubaSessionId
  // let page_id = data.ubaPageId || ''
  let wSesssion = ''
  if (data.tabType === 'webchat_todo') {
    wSesssion = state.current.webchat_todo.currentSession[_id]
  } else {
    wSesssion = state.current.webchat_all.currentSession
  }
  let reqData = {pageSize: 10, account: rootState.session.account.account}
  if (wSesssion && wSesssion.ubaInfo) {
    reqData.ubaSessionId = wSesssion.ubaInfo.ubaSessionId
    reqData.ubaPageId = wSesssion.ubaInfo.ubaPageId
  }
  if (data.ubaPageId && data.ubaSessionId) {
    reqData.ubaSessionId = data.ubaSessionId
    reqData.ubaPageId = data.ubaPageId
  }
  let ubaInfo = state.current.webchat_todo.ubaInfoList[ubaSessionId]
  let commitData = {_id: _id}
  if (ubaInfo && !data.ubaHisttory) {
    reqData.page = ubaInfo.page + 1
    reqData.timeStart = ubaInfo.lastPageTimeStart
    commitData.page = ubaInfo.page + 1
  } else if (data.currentPage) {
    reqData.page = data.currentPage
    commitData.page = data.currentPage
    reqData.timeStart = ''
  } else {
    reqData.page = 1
    commitData.page = 1
    reqData.timeStart = ''
  }

  return webchat.getUbaPagesBySessionIdForWebchat(reqData).then(response => {
    if (response.success) {
      let page = response.data.page || []
      if (page.length) {
        let lastPageTimeStart = page[0].timeStart
        for (let i = 0; i < page.length; i++) {
          let _data = page[i]
          if (page[i].timeStart > lastPageTimeStart) {
            lastPageTimeStart = page[i].timeStart
          }
          if (_data.stayTime) {
            _data.stayTimeDesc = '停' + userStayTimeConverse(_data.stayTime)
          }
          _data.timeStart = getFormatDateTime(new Date(page[i].timeStart)).split(' ')[1]
          if (page[i]._id === reqData.ubaPageId) {
            page[i].isStartPage = true
          } else {
            page[i].isStartPage = false
          }
        }
        if (!ubaInfo) {
          commitData.lastPageTimeStart = lastPageTimeStart
        }
        commitData.pages = page
        // let ubaInfoList = state.current.webchat_todo.ubaInfoList[response.data.sessionId]
        // if (ubaInfoList && ubaInfoList.pages.length && reqData.page === 1) { // 处理切换卡片轨迹重新请求的问题
        //   return response.data.sessionId
        // }
        commitData.sessionId = response.data.sessionId
        commit(types.UBAINFO, commitData)
        return commitData.sessionId
      }
    }
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}

/**
 * 将访客加入黑名单
 * @param commit
 * @param state
 * @param data
 */
export const customerAddBlack = ({commit, state}, data) => {
  let reqData = {}
  let currentInfo = state.current.webchat_todo.currentSession[data._id]
  reqData._id = data.sid
  reqData.addBlackReason = data.addBlackReason
  reqData.ip = currentInfo.ip
  reqData.area = currentInfo.area
  reqData.sName = currentInfo.sName
  return webchat.addBlack(reqData).then((res) => {
    if (res.success) {
      commit(gtypes.SET_SUCCESS, '加入黑名单成功')
    }
    return res
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}

export const updateCurrentWebchatListCustomer = ({commit}, data) => {
  commit(types.UPDATE_WEBCHAT_RELATION_CUSTOMER, data)
}

/**
 * 保存Funtab信息
 */
export const saveFunTabInfo = ({commit}, data) => {
  commit(types.UPDATE_FUNTAB_INFO, data)
}
/**
 * 更新时间检索状态
 */
export const updateTimeSearchState = ({commit}, data) => {
  commit(types.UPDATE_TIME_SEARCH_STATE, data)
}

// /**
//  * 拒绝视频邀请
//  * @param data
//  * */
// export const rejectVideoInvite = ({commit}, data) => {
//   return webchat.rejectVideoInvite(data)
//     .then(
//       response => {
//         if (response.success) {
//           commit(types.UPDATE_VIDEO_INVITE_STATUS, false)
//         }
//       }
//     ).catch(() => {
//       commit(gtypes.SET_ERROR, 'message.default_tips')
//     })
// }
// /**
//  * 取消视频邀请
//  * @param data
//  * */
// export const cancelVideoInvite = ({commit}, data) => {
//   return webchat.cancelVideoInvite(data)
//     .then(
//       response => {
//         if (response.success) {
//           commit(types.UPDATE_VIDEO_CHAT_STATUS, false)
//           let msg = {
//             videoSessionid: '',
//             videoToken: '',
//             videoUsername: ''
//           }
//           commit(types.UPDATE_VIDEO_CHATDATA, msg)
//         }
//       }
//     ).catch(() => {
//       commit(gtypes.SET_ERROR, 'message.default_tips')
//     })
// }
// /**
//  * 座席请求视频聊天
//  * @param data
//  * */
// export const requestVideoChat = ({commit}, data) => {
//   return webchat.requestVideoChat(data)
//     .then(
//       response => {
//         if (response.success) {
//           commit(types.UPDATE_VIDEO_CHAT_STATUS, true)
//           let msg = {
//             videoSessionid: data.sessionId,
//             videoToken: response.token,
//             videoUsername: data.sName
//           }
//           commit(types.UPDATE_VIDEO_CHATDATA, msg)
//         }
//       }
//     ).catch(() => {
//       commit(gtypes.SET_ERROR, 'message.default_tips')
//     })
// }
