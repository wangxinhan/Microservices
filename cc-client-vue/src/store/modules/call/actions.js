import * as types from './mutation-types'
import call from '../../api/call'
import {getCache} from '../../actions'
import * as globalTypes from '../../mutation-types'
import customerApi from '../../api/customer'
import userApi from '../../api/user'
var querystring = require('querystring')

export const queryCallList = ({commit, state, rootState, dispatch}, searchCondition) => {
  if (searchCondition.type === 'cdr_call') {
    return Promise.resolve(state.callList.cdr_call)
  }
  let type = searchCondition.type
  let phoneBarFlag = searchCondition.phoneBar
  delete searchCondition.phoneBar
  delete searchCondition.type
  return call.queryCallList(searchCondition)
    .then(
      response => {
        if (response.success) {
          if (!phoneBarFlag) { // 软电话外呼按钮触发的action不往vuex里面存值
            commit(types.QUERY_CALL_LIST, {data: response, type})
          } else {
            return response.list
          }
        }
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
}
/*
 点击某条通话记录后触发的action
 */
export const getSelectedCallInfo = ({commit, state, rootState}, {data, type}) => {
  let promises = []
  let current
  return call.queryCallList({_id: data})
    .then((respon) => {
      if (respon.success && respon.list && respon.list.length > 0) {
        current = respon.list[0]
        commit(types.SET_CALL_INFO, {data: current, type})
      }
      let _id = data
      let p1 = call.queryIvrContrail(_id)
        .then(
          response => {
            if (response.success) {
              commit(types.QUERY_IVR_CONTRAIL, {data: response.data, type})
            }
          }
        ).catch(
          (e) => {
            console.log(e)
            commit(globalTypes.SET_ERROR, 'message.default_tips')
          }
        )
      let p2 = queryTransferContrail({commit, rootState}, {data: current, type})
      promises.push(p1)
      promises.push(p2)
      if (!rootState.session.dicMap.investigate) {
        let p3 = call.findOneAppDic({name: '满意度调查选项'})
          .then(
            res => {
              if (res.success && res.data && res.data.options && Array.isArray(res.data.options)) {
                let data = []
                let options = res.data.options
                for (let i = 0; i < options.length; i++) {
                  let name = options[i].name
                  let value = options[i].options[0].name
                  data.push({name, value})
                }
                commit(globalTypes.SET_TYPE_DICDATA, {data: data, type: 'investigate'})
              } else {
                commit(globalTypes.SET_ERROR, 'message.default_tips')
              }
            }
          )
        promises.push(p3)
      }
      if (!rootState.session.dicMap.queues) {
        let p4 = getCache({commit, state: rootState}, {type: 'queues'})
          .then(
            queues => {
              commit(globalTypes.SET_TYPE_DICDATA, {type: 'callQueues', data: queues})
            }
          )
        promises.push(p4)
      }
      return Promise.all(promises)
    })
}
export const relocationCustomer = ({commit, state, rootState}, {data, type}) => {
  return call.relocationCustomer({_id: data}).then(
      resp => {
        if (resp.success) {
          let relocationCustomerType
          if (resp.row.CUSTOMER_ID === '00000000000000000000') {
            if (resp.list.length > 0) {
              relocationCustomerType = 'multi'
              let autoCust = {
                autoCustObj: {
                  list: resp.list,
                  count: resp.list.length || 0
                },
                autoCustLength: resp.list.length || 0
              }
              commit(types.SET_AUTO_CUST, {callSheetId: data, autoCust})
            } else {
              relocationCustomerType = 'none'
            }
          } else {
            if (resp.list.length === 0) {
              relocationCustomerType = 'deleted'
            } else {
              relocationCustomerType = 'one'
            }
          }
          commit(types.RELOCATION_CUSTOMER, {relocationCustomerType, type})
          // 来电  set current customer 多传一个 businessId
          if (relocationCustomerType === 'one') {
            commit(globalTypes.SET_CURRENT_CUSTOMER, { data: resp.list[0], type: 'call', tabType: type })
          } else {
            commit(globalTypes.SET_CURRENT_CUSTOMER, {data: null, type: 'call', tabType: type})
          }
        }
      }
  )
}
let queryTransferContrail = function ({commit, rootState}, {data: callSheet, type}) {
  if (!callSheet) {
    return
  }
  if (callSheet.CONNECT_TYPE === 'transfer' || callSheet.CONNECT_TYPE === 'dialTransfer') {
    let transferRecords = []
    let p1 = getCache({commit, state: rootState}, {type: 'agents'})
    let p2 = getCache({commit, state: rootState}, {type: 'queues'})
    let p = Promise.all([p1, p2])
    return p.then(([agents, skillgroups]) => {
      let getAgentName = function (exten) {
        for (let i = 0; i < agents.length; i++) {
          if (agents[i].exten === exten) {
            return agents[i].displayName
          }
        }
      }
      let getSkillGroupName = function (exten) {
        for (let j = 0; j < skillgroups.length; j++) {
          if (skillgroups[j].Exten === exten) {
            return skillgroups[j].DisplayName
          }
        }
      }
      let getTransferRecord = function (callRecordId) {
        let transferRecord = {transferFrom: '', transferAction: '', transferTo: '', beginTime: ''}
        call.getCdrInfo(callRecordId).then(res => {
          if (res.data) {
            transferRecord.beginTime = res.data.BEGIN_TIME ? res.data.BEGIN_TIME : ''
          }
          if (res.success && res.data && res.data.TRANSFER_MODE && res.data.TRANSFER_NUM && res.data.TRANSFER_AGENT && res.data.DISPOSAL_AGENT && res.data.REF_CALL_SHEET_ID) {
            transferRecord.transferFrom = getAgentName(res.data.TRANSFER_AGENT) + '[' + res.data.TRANSFER_AGENT + ']'
            if (res.data.TRANSFER_MODE === 'skillgroup') {
              transferRecord.transferAction = getSkillGroupName(res.data.TRANSFER_NUM)
            } else if (res.data.TRANSFER_NUM.length < 5) {
              transferRecord.transferAction = getAgentName(res.data.TRANSFER_NUM) + '[' + res.data.TRANSFER_NUM + ']'
            } else {
              transferRecord.transferAction = res.data.TRANSFER_NUM
            }
            if (res.data.TRANSFER_MODE === 'num' && res.data.TRANSFER_NUM.length > 5) {
              transferRecord.transferTo = res.data.TRANSFER_NUM
            } else {
              for (let h = 0; h < agents.length; h++) {
                if (agents[h]._id === res.data.DISPOSAL_AGENT) {
                  transferRecord.transferTo = agents[h].displayName + '[' + agents[h].exten + ']'
                }
              }
            }
            transferRecords.push(transferRecord)
            getTransferRecord(res.data.REF_CALL_SHEET_ID)
          } else if (res.success) {
            commit(types.QUERY_TRANSFER_CONTRAIL, {transferRecords, type})
          } else {
            commit(globalTypes.SET_ERROR, 'message.default_tips')
          }
        }).catch((e) => {
          console.log(e)
          commit(globalTypes.SET_ERROR, 'message.default_tips')
        })
      }
      getTransferRecord(callSheet._id)
    }).catch((e) => {
      console.log(e)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
  }
}
/*
 提交批量导出录音任务触发的action
 */
export const addExportMonitorTask = ({commit}, data) => {
  return call.addExportMonitorTask(data)
    .then(
      response => {
        if (response.success) {
          commit(globalTypes.SET_SUCCESS, 'call.exportMonitorTaskSuccess')
        } else if (response.message === '404') {
          commit(globalTypes.SET_ERROR, 'call.exportMonitorTaskNotExist')
        }
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
}
/*
  点击 导出 触发的action
*/
export const exportCdrExcel = ({commit}, {data, type}) => {
  return call.exportCdrExcel(data)
    .then(
      response => {
        if (response.Succeed) {
          // commit(types.EXPORT_CDR_EXCEL, {path: response.path, type})
          // commit(globalTypes.SET_SUCCESS, {success: response.message})
          commit(globalTypes.SET_FILEDOWNLOAD, {path: response.path, isSession: true})
        } else {
          commit(globalTypes.SET_ERROR, 'message.default_tips')
        }
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
}
/*
  修改备注触发的action
*/
export const saveCdrMemo = ({commit}, {data, type, currentCallId}) => {
  return call.saveCdrMemo(data)
    .then(
      response => {
        if (response.success) {
          if (data.CALL_SHEET_ID === currentCallId) {
            commit(types.SAVE_CDR_MEMO, {memo: data.memo, type})
          }
          commit(globalTypes.SET_SUCCESS, 'saveEditSucess')
        }
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
}

/*
  添加,删除通话标签触发的action
*/
export const markCallSheet = ({commit}, {data, type}) => {
  return call.markCallSheet(data)
    .then(
      response => {
        if (response.success) {
          return true
        } else {
          return false
        }
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
}
/*
  查看通话标签操作日志触发的action
*/
export const getCallLabelOPHistory = ({commit}, {data, type}) => {
  return call.getCallLabelOPHistory(data)
    .then(
      response => {
        return response
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
}
/*
   保存黑名单
 */
export const saveBlackList = ({commit, rootState}, {data, type}) => {
  return getCache({commit, state: rootState}, {type: 'inBlackList'})
  .then(blackList => {
    for (let i = 0; i < blackList.length; i++) {
      if (data.BlackNum === blackList[i].BlackNum && data.Type === blackList[i].Type) {
        commit(globalTypes.SET_ERROR, 'call.blackNumExisted')
        return 'existed'
      }
    }
  }).then(
    (isExist) => {
      if (isExist !== 'existed') {
        call.saveBlackList(data)
          .then(
            response => {
              if (response.success) {
                getCache({commit, state: rootState}, {type: 'inBlackList'})
                  .then(
                    list => {
                      list.push({data})
                    }
                  )
                commit(globalTypes.SET_SUCCESS, 'call.successAddBlack')
              }
            }
          )
      }
    }
  ).catch(
    (e) => {
      console.log(e)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    }
  )
}
/*
    移除通话标记
 */
export const removeKeyTag = ({commit}, data) => {
  return call.removeKeyTag(data)
    .then(
      response => {
        if (response.success) {
          commit(globalTypes.SET_SUCCESS, 'call.removeKeyTagSuc')
        }
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
}
/*
    来电后触发此action
 */
export const callItemAdd = ({commit, state, rootState}, data) => {
  data.unRead = true
  let promises = [
    getCache({commit, state: rootState}, {type: 'agents'}),
    getCache({commit, state: rootState}, {type: 'queues'}),
    getCache({commit, state: rootState}, {type: 'callUrls'})]
  if (rootState.session.account.tokenCheck) {
    let loginName = rootState.session.user.loginName
    let password = rootState.session.user.password
    promises.push(userApi.getTokenId({loginName, password}))
  }
  Promise.all(
    promises
  ).then(([agents, skillgroups, callUrls, token]) => {
    // 来电对接 3个类别 内嵌，tab ,new window
    let BussinessTypeId = ''
    for (let u = 0; u < skillgroups.length; u++) {
      if (data.queue === skillgroups[u].Exten) {
        BussinessTypeId = skillgroups[u].BussinessTypeId.split('_')[1]
      }
    }
    if (BussinessTypeId !== '') {
      for (let y = 0; y < callUrls.length; y++) {
        if (callUrls[y]._id === BussinessTypeId) {
          let url = callUrls[y].url + '?' + querystring.stringify(data) + '&loginName=' + rootState.session.user.loginName
          if (token && token.token && token.tokenId) {
            url += '&token=' + token.token + '&tokenId=' + token.tokenId
          }
          if (callUrls[y].type === '1') {
            commit(types.SET_IFRAME_URL, url)
          } else if (callUrls[y].type === '2' && callUrls[y].outOpenType === 'tab') {
            window.open(url)
          } else if (callUrls[y].type === '2' && callUrls[y].outOpenType === 'win') {
            window.open(url, '_blank', 'toolbar=0,location=0,menubar=0')
          }
          break
        }
      }
    }
    let getAgentName = function (exten) {
      for (let i = 0; i < agents.length; i++) {
        if (agents[i].exten === exten) {
          return agents[i].displayName
        }
      }
    }
    let getSkillGroupName = function (exten) {
      for (let j = 0; j < skillgroups.length; j++) {
        if (skillgroups[j].Exten === exten) {
          return skillgroups[j].DisplayName
        }
      }
    }
    if (!data.ivrkey) {
      data.ivrkey = ''
    }
    if (!data.queueName) {
      data.queueName = ''
    }
    if (data.data && data.data.TransferMode && data.data.TransferNum && data.data.TransferAgent) {
      data.TransferMode = data.TransferMode || data.data.TransferMode
      data.TransferNum = data.TransferNum || data.data.TransferNum
      data.TransferAgent = data.TransferAgent || data.data.TransferAgent
    }
    if (data.TransferMode && data.TransferNum && data.TransferAgent) {
      let transferTo = ''
      let transferFrom = ''
      transferFrom = getAgentName(data.TransferAgent) + '[' + data.TransferAgent + ']'
      if (data.TransferMode === 'skillgroup') {
        transferTo = getSkillGroupName(data.TransferNum)
      } else {
        transferTo = getAgentName(data.TransferNum) + '[' + data.TransferNum + ']'
      }
      data.transferFrom = transferFrom
      data.transferTo = transferTo
    }
  }).then(
    () => {
      customerApi.queryCustomerList({phone: data.originCallNo})
        .then(
          response => {
            if (response.success) {
              if (response.list.length < 1) {
                data.CUSTOMER_TYPE = 'unk'
                if (rootState.session.account.autoSave) {
                  // 客户配置--》自动保存未定位到的客户
                  generateUnkCustomerInfo(data, {commit, state, rootState}).then(
                    (addCustomerData) => {
                      customerApi.addCustomer(addCustomerData).then(
                        res1 => {
                          if (res1.success && res1.data) {
                            commit(types.UPDATE_CURRENT_CUSTOMER_INFO, {customer: res1.data, callId: data.callSheetId})
                          }
                        }
                      )
                    }
                  )
                }
              } else if (response.list && response.list.length === 1) {
                data.CUSTOMER_ID = response.list[0]._id
                data.CUSTOMER_STATUS = response.list[0].status
                data.CUSTOMER_NAME = response.list[0].name
                data.CUSTOMER_TYPE = 'one'
                customerApi.queryCustomerInfo({_id: response.list[0]._id})
                  .then(res1 => {
                    if (res1.success && res1.data) {
                      // commit(globalTypes.SET_CURRENT_CUSTOMER, { data: res1.data, type: 'call', tabType: 'cdr_call', businessId: data.callSheetId })
                      commit(types.SET_CUSTOMER_INFO, {data: res1.data, callSheetId: data.callSheetId})
                    }
                  })
              } else if (response.list && response.list.length > 1) {
                data.CUSTOMER_TYPE = 'multi'
                let autoCust = {
                  autoCustObj: {
                    list: response.list,
                    count: response.list.length || 0
                  },
                  autoCustLength: response.list.length || 0
                }
                commit(types.SET_AUTO_CUST, {callSheetId: data.callSheetId, autoCust})
              }
              // 往通话列表左侧添加数据
              commit(types.PUSH_CDR_CALL, data)
              commit(types.PUSH_CURRENT_CDR_CALL, data)
              commit(types.SET_STORAGE_CALLLIST)
              // 计算未读来电数
              commit(types.COUNT_UNREAD_CDR)
              // commit(types.RELOCATION_CUSTOMER, {relocationCustomerType, type: 'cdr_call'})
              let notify = {
                tag: 'cdr',
                id: data.callSheetId,
                NOcallnum: 1,
                random: Math.random()
              }
              commit(globalTypes.SET_NOTIFY, notify)
            }
          }
        ).catch(
        (e) => {
          console.log(e)
          commit(globalTypes.SET_ERROR, 'message.default_tips')
        }
      )
    }
  )
}

export const callItemPush = ({commit, state, rootState}, data) => {
  commit(types.SET_CALL_LIST_PUSH, data)
}

export const callScreenLocationCustomer = ({commit, state, rootState}, data) => {
  return call.callScreenLocationCustomer(data).then(res => {
  }).catch(
    (e) => {
      console.log(e)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    }
  )
}
// 选择已存在客户
export const callLocationCustomer = ({commit, state}, data) => {
  // data
  /* customerId:,
   callId:,
   custName:,
   phone: */
  let callInfo = {}
  let customerPhone = ''
  for (let tab in state.current) {
    if (state.current[tab].callInfo && state.current[tab].callInfo._id === data.callId) {
      callInfo = state.current[tab].callInfo && state.current[tab].callInfo
    }
  }
  if (callInfo.CONNECT_TYPE === 'normal' || callInfo.CONNECT_TYPE === 'transfer') {
    customerPhone = callInfo.CALL_NO
  } else {
    customerPhone = callInfo.CALLED_NO
  }
  if (data.customer && data.customer.phone && data.customer.phone.length > 0) {
    let exists = false
    data.customer.phone.forEach(function (obj) {
      if (obj.tel === customerPhone) {
        exists = true
      }
    })
    if (!exists) {
      data.customer.phone.push({tel: customerPhone, memo: ''})
    }
  }
  let postData = {}
  postData.customerId = data.customerId
  postData.callId = data.callId
  postData.custName = data.custName
  postData.phone = data.customer.phone
  if (data.dealSrc) {
    postData.dealSrc = data.dealSrc
  }
  commit(types.UPDATE_CURRENT_CUSTOMER_INFO, data)
  return call.locationCustomer(postData)
}
// 新增客户
export const callLocationCustomer2Add = ({commit, state}, data) => {
  if (data.type) {
    delete data.type
  }
  if (data.tabType) {
    delete data.tabType
  }
  return customerApi.addCustomer(data).then(res => {
    if (res.success && res.data) {
      commit(types.UPDATE_CURRENT_CUSTOMER_INFO, {callId: data.callId, customer: res.data})
    }
  })
}
function generateUnkCustomerInfo (data, {commit, state, rootState}) {
  return new Promise(function (resolve, reject) {
    let customer = {}
    let promises = [
      getCache({commit, state: rootState}, {type: 'custTmpls'}),
      getCache({commit, state: rootState}, {type: 'options', id: 'd7b9c68a-b50f-21d1-d5fd-41ea93f5f49c'})
    ]
    Promise.all(promises).then(
      ([custTmpls, provinceCache]) => {
        customer.dbType = custTmpls[0]._id
        let list = provinceCache.options
        for (let i = 0; i < list.length; i++) {
          if (list[i].name === data.callerProvince) {
            customer.province = list[i].key
            let cityList = list[i].options
            for (let j = 0; j < cityList.length; j++) {
              if (cityList[j].name === data.callerCity) {
                customer.city = cityList[j].key
                break
              }
            }
            break
          }
        }
        customer.callTel = data.originCallNo
        customer.callId = data.callSheetId
        customer.name = '未知客户'
        customer.status = 'status0'
        customer.title = ''
        customer.address = ''
        customer.note = ''
        customer.web = ''
        customer.categoryId = 'NA'
        customer.owner = rootState.session.user._id
        customer.category = ''
        customer.dealSrc = 'popup'
        customer.email = []
        customer.weixin = []
        customer.actionType = 'self'
        let phoneObj = {tel: data.originCallNo, memo: ''}
        customer.phone = [phoneObj]
        customer.attaches = []
        resolve(customer)
      }
    )
  }).catch(
    (e) => {
      console.log(e)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    }
  )
}
export const callUpdateCustomer = ({ commit, state, rootState }, {callId, customer}) => {
  return customerApi.updateCustomer(customer)
    .then(response => {
      if (!response.success) {
        return false
      } else {
        return customerApi.queryCustomerInfo({ _id: customer._id })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

