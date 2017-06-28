import * as types from './mutation-types'
import sms from '../../api/sms'
import * as gtypes from '../../mutation-types'
import {getCache} from '../../actions'

export const getselectsms = ({commit, state, rootState, dispatch}, data) => {
  return getCache({commit, state: rootState}, {type: 'smsTemplate'}).then((templates) => {
    return getCache({commit, state: rootState}, {type: 'smsSign'}).then((selesignnames) => {
      let smsTemplates = ''
      let smsTs = []
      if (templates) {
        smsTemplates = templates
        for (let key in smsTemplates) {
          let sms = {
            _id: smsTemplates[key]._id,
            content: smsTemplates[key].content,
            sign: smsTemplates[key].sign,
            displayname: smsTemplates[key].name + ':' + smsTemplates[key].content,
            vars: smsTemplates[key].vars,
            name: smsTemplates[key].name,
            num: smsTemplates[key].num,
            smsChannel: smsTemplates[key].smsChannel,
            contented: '',
            signname: '',
            templateSign: ''
          }
          let html = smsTemplates[key].content
          for (var i = 1; i <= smsTemplates[key].vars; i++) {
            html = html.replace('{' + i + '}', '<span contenteditable="true" class="smsTemplateVar"></span>')
          }
          sms.contented = html
          for (let j = 0; j < selesignnames.length; j++) {
            if (sms.sign === selesignnames[j]._id) {
              sms.signname = selesignnames[j].name
              sms.templateSign = selesignnames[j].subcode + '_' + selesignnames[j].name
            }
          }
          smsTs.push(sms)
        }
      }
      return smsTs
    })
  })
}
export const sendsms = ({commit, state, rootState, dispatch}, data) => {
  return sms.sendsms(data).then()
}

/**
 * 我的短信查询触发
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const queryMySms = ({commit, state, rootState, dispatch}, data) => {
  return sms.queryMySms(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_MY_SMS, response)
          return response
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 查询全部短信触发
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const queryAllSms = ({commit, state, rootState, dispatch}, data) => {
  return sms.queryAllSms(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_ALL_SMS, response)
          return response
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 群发短信发送按钮
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const sendBatchSms = ({commit, state, rootState, dispatch}, data) => {
  return sms.sendBatchSms(data)
    .then(
      response => response.success
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 查找导入群发短信任务列表
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const querySmsImportTask = ({commit, state, rootState, dispatch}, data) => {
  return sms.querySmsImportTask(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_SMS_IMPORT_TASK, response)
          return response.list
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 导入群发短信成功数据查询功能
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const queryTaskImport = ({commit, state, rootState, dispatch}, data) => {
  return sms.queryTaskImport(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_TASK_IMPORT, response)
          return response.list
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 导入群发短信错误数据查询功能
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const queryTaskInvalid = ({commit, state, rootState, dispatch}, data) => {
  return sms.queryTaskInvalid(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_TASK_INVALID, response)
          return response.list
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 导入群发短信提交发送功能功能
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const smsCountImportToSend = ({commit, state, rootState, dispatch}, data) => {
  return sms.smsCountImportToSend(data)
    .then().catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

export const smsImportSend = ({commit, state, rootState, dispatch}, data) => {
  return sms.smsImportSend(data)
    .then().catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 查询短信模板列表
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const querySmsTemplateToCheck = ({commit, state, rootState, dispatch}, data) => {
  return sms.querySmsTemplateToCheck(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_SMS_TEMPLATE_TO_CHECK, response)
          return response.list
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 查看短信模板详细信息
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const querySmsTemplateToCheckMessage = ({commit, state, rootState, dispatch}, data) => {
  let tableIndex = data.index
  delete data.index
  return sms.querySmsTemplateToCheckMessage(data.id)
    .then(
      response => {
        if (response.success) {
          commit(types.SET_TEMP_UNREADADMINMESSAGE, tableIndex)
        }
        return response
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 提交短信模板
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const postSmsTemplate = ({commit, state, rootState, dispatch}, data) => {
  return sms.postSmsTemplate(data)
    .then(
      response => response.success
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 删除未通过模板
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const cancelSmsTemplateToCheck = ({commit, state, rootState, dispatch}, data) => {
  return sms.cancelSmsTemplateToCheck(data)
    .then(
      response => response.success
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 编辑未通过模板
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const updateSmsTemplateToCheck = ({commit, state, rootState, dispatch}, data) => {
  return sms.updateSmsTemplateToCheck(data)
    .then(
      response => response.success
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 已通过模板：停用（status:4）/启用（status:1）
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const changeSmsTemplateToCheckStatus = ({commit, state, rootState, dispatch}, data) => {
  let index = data.index
  let status = data.status
  delete data.index
  return sms.changeSmsTemplateToCheckStatus(data)
    .then(
      response => {
        if (response.success) {
          commit(types.SET_STATUS, {index, status})
        }
        return response.success
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 编辑短信模板：添加回复
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const addSmsTemplateToCheckMessages = ({commit, state, rootState, dispatch}, data) => {
  return sms.addSmsTemplateToCheckMessages(data)
    .then(
      response => response
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 全部短信导出功能
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>}
 */
export const exportAllSms = ({commit, state, rootState, dispatch}, data) => {
  return sms.exportAllSms(data)
    .then(
      response => {
        if (response.Succeed) {
          commit(gtypes.SET_FILEDOWNLOAD, {path: response.path, isSession: true})
        } else {
          commit(gtypes.SET_ERROR, 'message.default_tips')
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

