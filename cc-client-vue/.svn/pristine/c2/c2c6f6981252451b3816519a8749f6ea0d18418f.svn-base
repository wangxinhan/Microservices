import * as types from './mutation-types'
import * as gtypes from '../../mutation-types'
import email from '../../api/email'
import webchat from '../../api/webchat'
import {Base64, deepClone} from '../../../utils/m7Utils'

export const updateEmailAutoClaimStatus = ({commit}, data) => {
  let req = {}
  if (data.emailStatus === true) {
    req.emailStatus = 'open'
  } else {
    req.emailStatus = 'close'
  }
  email.updateEmailAutoClaimStatus(req).then(response => {
    if (response.success) {
      commit(types.SET_EMAIL_AUTOCLAIM, data)
    }
  })
}

export const refreshEmailMenuNum = ({commit}) => {
  email.refreshMenuNum().then(response => {
    if (response.success) {
      let undealNum = response.openNum
      let todoNum = response.todoNum
      commit(types.SET_EMAIL_UNDEALNUM, {undealNum})
      commit(types.SET_EMAIL_TODONUM, {todoNum})
      if (todoNum > 0 || undealNum > 0) {
        commit(types.SET_EMAIL_MODULE_READ, true)
      }
    }
  })
}

export const queryEmailList = ({commit}, data) => {
  let type = data.type
  delete data.type
  if (type === 'email_todo') {
    return email.queryMyDealMailList(data)
        .then(
            response => {
              let data = response
              commit(types.QUERY_EMAIL_LIST, {data, type})
            }
        ).catch(err => {
          console.log(err)
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
  } else {
    return email.queryAllMailList(data)
        .then(
            response => {
              let data = response
              commit(types.QUERY_EMAIL_LIST, {data, type})
            }
        ).catch(err => {
          console.log(err)
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
  }
}

/**
 * 获取邮件会话详细信息
 */
export const popupEmail = ({commit}, data) => {
  let submenu = data.submenu
  delete data.submenu
  return email.popupEmail(data)
      .then(response => {
        let mailSession = response.user
        let customer = {}
        if (response.row) {
          mailSession.custId = response.row._id
          customer = response.row
        }
        if (response.multiCusts) {
          mailSession.multiCusts = response.multiCusts
        }
        commit(types.POPUP_EMAIL_INFO, {session: mailSession, submenu: submenu})
        commit(gtypes.SET_CURRENT_CUSTOMER, {data: customer, type: 'email', tabType: submenu})
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 获取邮件会话历史
 */
export const loadEmailHistory = ({commit}, data) => {
  let submenu = data.submenu
  delete data.submenu
  return email.loadEmailHistory(data)
      .then(response => {
        commit(types.LOAD_EMAIL_HISTORY, {history: response.list, submenu})
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 获取邮件会话的最后一封邮件
 */
export const getLastEmail = ({commit}, data) => {
  return email.getLastEmail(data)
      .then(response => {
        commit(types.GET_LAST_EMAIL, {email: response.email})
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 回复邮件
 */
export const replyInbox = ({commit}, data) => {
  let attachments = []
  data.attachment.forEach((item) => {
    attachments.push({url: Base64.encode(item.url), name: Base64.encode(item.name)})
  })
  let postData = {
    sessionId: data.sessionId,
    shortId: data.shortId,
    to: data.to.addr,
    toName: encodeURIComponent(data.to.name || ''),
    from: data.from.addr,
    fromName: encodeURIComponent(data.from.name || ''),
    subject: Base64.encode(data.subject),
    supportEmail: data.supportEmail,
    attachment: attachments,
    cc: data.cc || [],
    content: Base64.encode(data.content),
    contentText: Base64.encode(data.contentText),
    carryAgentInfo: data.carryAgentInfo,
    displayName: data.displayName,
    firstReplyTime: data.firstReplyTime,
    agentFirstReplyTime: data.agentFirstReplyTime
  }
  return email.replyInbox(postData)
      .then(
          response => {
            if (response.success) {
              let resultEmail = deepClone(response.data)
              let toArray = [{name: data.to.name || '', addr: data.to.addr}]
              resultEmail.to = toArray
              let fromObj = {name: data.from.name || '', addr: data.from.addr}
              resultEmail.from = fromObj
              try {
                resultEmail.subject = Base64.decode(resultEmail.subject)
                resultEmail.content = Base64.decode(resultEmail.content)
                resultEmail.contentText = Base64.decode(resultEmail.contentText)
                resultEmail.attachment = data.attachment
              } catch (e) {}
              commit(types.REPLY_EMAIL_INBOX, {email: resultEmail})
            }
          }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 转发邮件
 */
export const forwardEmail = ({commit}, data) => {
  let postData = {
    sessionId: data.sessionId,
    shortId: data.shortId,
    to: data.to,
    from: data.from.addr,
    fromName: encodeURIComponent(data.from.name || ''),
    subject: Base64.encode(data.subject),
    supportEmail: data.supportEmail,
    attachment: data.attachment || [],
    cc: data.cc || [],
    content: Base64.encode(data.content),
    contentText: Base64.encode(data.contentText),
    carryAgentInfo: true,
    displayName: data.displayName
  }
  return new Promise(function (resolve) {
    email.forwardEmail(postData)
        .then(
            response => {
              if (response.success) {
                commit(gtypes.SET_SUCCESS, 'email.forwardSuccess')
                commit(types.FORWARD_EMAIL, {success: response.success})
                resolve(response.success)
              }
            }
        ).catch((err) => {
          console.log(err)
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
  })
}

/**
 * 保存备注
 */
export const saveRemark = ({commit}, data) => {
  return email.saveRemark(data)
      .then(response => {
        if (response.success) {
          commit(gtypes.SET_SUCCESS, 'message.editSucess')
          commit(types.SAVE_EMAIL_REMARK, {success: response.success})
        }
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 刷新未处理数
 */
export const refreshLeakNum = ({commit}, data) => {
  return email.refreshLeakNum(data)
      .then(response => {
        if (response.success) {
          commit(types.REFRESH_EMAIL_LEAKNUM, data._id)
        }
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 结束会话
 */
export const finishEmailSession = ({commit}, data) => {
  return email.finishEmailSession(data)
      .then(response => {
        if (response.success) {
          if (data._id) {
            commit(types.REMOVE_EMAIL_SESSION, data._id)
          } else if (data.finishiArr) {
            commit(types.BATCH_REMOVE_EMAIL_SESSION, data.finishiArr)
          }
        }
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 转接会话 更新处理数
 */
export const redirectEmailSession = ({commit}, data) => {
  return new Promise(function (resolve) {
    email.redirectEmailSession(data)
        .then(
            response => {
              if (response.success) {
                commit(types.REMOVE_EMAIL_SESSION, data._id)
                resolve(response.success)
              }
            }
        ).catch(() => {
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
  })
}

/**
 * 邮件标记为星标或未读
 */
export const doMailMark = ({commit}, data) => {
  return email.doMailMark(data)
      .then(response => {
        if (response.success) {
          commit(gtypes.SET_SUCCESS, 'message.editSucess')
          commit(types.DO_EMAIL_MARK, {success: response.success, data})
        }
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 手动标记邮件分类
 */
export const defineMailCategory = ({commit}, data) => {
  return email.defineMailCategory(data)
      .then(response => {
        if (response.success) {
          commit(gtypes.SET_SUCCESS, 'message.editSucess')
          commit(types.DEFINE_EMAIL_CATEGORY, data)
        }
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 保存自定义快捷回复语
 * @param {Stirng} data.quickreplys ["1","2"]
 * @param {Stirng} data.moduleType "webchat"/"email"
 */
export const saveQuickReplyForEmail = ({commit}, data) => {
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
export const getQuickReplyListForEmail = ({commit}, data) => {
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
export const getAllQuickReplyListForEmail = ({commit}, data) => {
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
export const queryEmailAllTagsForEmail = ({commit}, data) => {
  return webchat.queryWebChatAllTags(data)
      .then(
          response => {
            if (response.success) {
              commit(types.QUERY_EMAIL_ALL_TAGS, response.list)
            }
          }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 根据标签id查询字标签
 * @param commit
 * @param data
 * @returns {Promise.<T>}
 */
export const queryEmailTagsById = ({commit}, data) => {
  let index = data.index
  return webchat.queryWebChatTagsById(data)
      .then(
          response => {
            if (response.success) {
              commit(types.QUERY_EMAIL_ALL_TAGS_CHILDREN, {list: response.list, index})
            }
          }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 定位客户
 * @param {Stirng} data.customerId 客户id
 * @param {Stirng} data.callId
 * @param {Stirng} data.custName 客户名称
 */
export const locationCustomerForEmail = ({commit}, data) => {
  let customer = data.customer
  let submenu = data.submenu
  delete data.submenu
  delete data.sessionId
  delete data.customer
  return email.locationCustomer(data)
      .then(
          response => {
            if (response.success) {
              commit(types.EMAIL_LOCATION_CUSTOMER, {customer, submenu})
            }
          }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

/**
 * 解除邮件用户绑定
 * @param {Stirng} data.customerId 客户id
 * @param {Stirng} data.callId
 * @param {Stirng} data.custName 客户名称
 */
export const deleteCustomerImRelationForMail = ({commit}, data) => {
  return email.deleteCustomerImRelation(data).then(
          response => {
            if (response.success) {
              commit(types.DELETE_EMAIL_RELATION_CUSTOMER, data)
            }
          }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}

export const dispatchEmail = ({commit, state, rootState, dispatch}, evtJson) => {
  let obj = evtJson.Data
  let event = evtJson.Event
  let isMe = evtJson.Foryou
  if (event === 'NewEmail') {
    if (isMe) {
      commit(gtypes.SET_NOTIFY, {tag: 'email', notify: obj})
      if (state.emailList.email_todo.init) {
        emailTodoItemAdd({commit, state}, obj)
      } else {
        let data = {type: 'email_todo'}
        dispatch('queryEmailList', data)
        dispatch('refreshEmailMenuNum')
      }
    }
    let undealNum = obj.undealNum
    if (obj.type === 'pushUndealNum') {
      commit(types.SET_EMAIL_UNDEALNUM, {undealNum})
      if (undealNum > 0) {
        commit(types.SET_EMAIL_MODULE_READ, true)
      }
    }
  } else if (event === 'NewEmailNotify') {
    if (obj.emailStatus === 'fail') {
      commit(gtypes.SET_NOTIFY, {tag: 'email', notify: obj})
    }
    var times = 1
    commit(types.SET_EMAIL_SEND_STATUS, {mailId: obj.mailId, emailStatus: obj.emailStatus})
    var interval = setInterval(function () {
      times++
      if (times > 10) {
        clearInterval(interval)
        return
      }
      var flag
      var currentSession = state.current.email_todo.currentSessionHistory.filter((item) => item.mailId === obj.mailId)
      if (currentSession.length > 0) {
        flag = currentSession[0].status
      }
      if (flag) {
        clearInterval(interval)
      } else {
        commit(types.SET_EMAIL_SEND_STATUS, {mailId: obj.mailId, emailStatus: obj.emailStatus})
      }
    }, 1000)
  }
}

// 获取邮件在线座席
export const getEmailOnlineAgent = ({commit, rootState, dispatch}, data) => {
  return new Promise(function (resolve) {
    let p1 = dispatch('loadUsers2Chat', {
      isEnable: true,
      isEmpty: true,
      currentId: rootState.session.user._id,
      hideMe: true
    })
    let p2 = dispatch('getCache', {type: 'onlineChannelAgent'})
    let p3 = dispatch('getCache', {type: 'accessChannelAgent', id: data.toPeer})
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
      resolve(resultAgents2)
    })
  })
}

const emailTodoItemAdd = ({commit, state}, data) => {
  data.subject = decodeEmailContent(data.subject)
  data.to.name = decodeEmailContent(data.to.name)
  data.from.name = decodeEmailContent(data.from.name)
  let session = state.emailList.email_todo.list.filter(obj => obj._id === data._id)
  if (session.length > 0) {
    let pustData = {_id: data.mailId}
    email.queryMailInfo(pustData)
        .then(
            response => {
              if (response.success) {
                commit(types.UPDATE_EMAIL_LIST_HISTORY, {sessionId: data._id, email: response.row})
              }
            }
        ).catch(() => {
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
  } else {
    commit(types.UPDATE_EMAIL_LIST, data)
  }
}

export const updateCurrentEmailListCustomer = ({ commit }, data) => {
  commit(types.UPDATE_EMAIL_RELATION_CUSTOMER, data)
}

/**
 * 解码邮件相关内容
 * @param data
 * @returns {*}
 */
const decodeEmailContent = (data) => {
  if (!data || data === 'undefined') {
    return ''
  }
  try {
    data = decodeURIComponent(data)
  } catch (e) {
    data = data.replace(/%26/g, '&')
    data = data.replace(/%23/g, '#')
    data = data.replace(/%3A/g, ':')
    data = data.replace(/%24/g, '$')
    data = data.replace(/%40/g, '@')
    data = data.replace(/%3D/g, '=')
    data = data.replace(/%2B/g, '+')
    data = data.replace(/%2F/g, '+')
  }
  return data
}
