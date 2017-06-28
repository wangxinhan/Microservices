import * as types from './mutation-types'
import Vue from 'vue'
export default {
  [types.QUERY_CALL_LIST] (state, {data, type}) {
    Vue.set(state.callList, type, data)
  },
  [types.SET_CALL_INFO] (state, {data, type}) {
    Vue.set(state.current[type], 'callInfo', data)
  },
  [types.QUERY_IVR_CONTRAIL] (state, {data, type}) {
    Vue.set(state.current[type].callInfo, 'ivr_contrail', data)
  },
  [types.QUERY_TRANSFER_CONTRAIL] (state, {transferRecords, type}) {
    Vue.set(state.current[type].callInfo, 'transfer_contrail', transferRecords)
  },
  [types.QUERY_CALL_LABEL_TYPE] (state, data) {
    Vue.set(state.transCache, 'callLabelType', data)
  },
  [types.QUERY_CALL_LABEL] (state, {labels}) {
    Vue.set(state.transCache, 'callLabels', labels)
  },
  // [types.GET_CALL_LABEL_OP_HISTORY] (state, {history, type}) {
  //  Vue.set(state.current[type], 'callLabelOpHistory', history)
  // },
  [types.SAVE_CDR_MEMO] (state, {memo, type}) {
    Vue.set(state.current[type].callInfo, 'COMMENTS', memo)
  },
  [types.MARK_CALL_SHEET] (state, {label, type}) {
    Vue.set(state.current[type].callInfo, 'LABELS', label)
  },
  [types.RELOCATION_CUSTOMER] (state, {relocationCustomerType, type}) {
    Vue.set(state.current[type].callInfo, 'relocationCustomerType', relocationCustomerType)
  },
  [types.SET_CALL_INVESTIGATE] (state, {options}) {
    Vue.set(state.transCache, 'investigate', options)
  },
  [types.SET_CALL_NUM] (state, options) {
    Vue.set(state.transCache, 'megNum', options.phoneNum)
  },
  [types.SET_CALL_MULTI_LABEL] (state, data) {
    Vue.set(state.transCache, 'multiLabel', data)
  },
  [types.SET_CALL_SINGLE_LABEL] (state, data) {
    Vue.set(state.transCache, 'singleLabel', data)
  },
  [types.SET_SHOW_KEY_TAG] (state, data) {
    let arr = state.transCache.showKeyTagArr || []
    arr.push(data)
    Vue.set(state.transCache, 'showKeyTagArr', arr)
  },
  [types.SET_CALLLIST_CHECKED] (state, {tabType, isAllChecked}) {
    state.callList[tabType].list.forEach((item) => {
      Vue.set(item, 'checked', isAllChecked)
    })
  },
  [types.PUSH_CDR_CALL] (state, data) {
    let list = state.callList.cdr_call.list || []
    let item = {}
    item._id = data.callSheetId
    item.CALL_SHEET_ID = data.callSheetId
    item.CALL_NO = data.originCallNo
    item.QUICK_QUERY_NUM = data.originCallNo
    item.CALLED_NO = data.originCalledNo
    item.OFFERING_TIME = data.offeringTime
    item.PROVINCE = data.callerProvince
    item.DISTRICT = data.callerCity
    item.ivrkey = data.ivrkey
    item.Agent = data.Agent
    item.RingTime = data.RingTime
    item.ERROR_MEMO = data.queue
    item.STATUS = data.CallStatus
    item.QUEUE_NAME = data.queueName
    item.unRead = data.unRead
    if (data.CUSTOMER_STATUS) {
      item.CUSTOMER_STATUS = data.CUSTOMER_STATUS
    }
    if (data.CUSTOMER_NAME) {
      item.CUSTOMER_NAME = data.CUSTOMER_NAME
    }
    if (data.CUSTOMER_ID) {
      item.CUSTOMER_ID = data.CUSTOMER_ID
    }
    if (data.CUSTOMER_TYPE) {
      item.CUSTOMER_TYPE = data.CUSTOMER_TYPE
    }
    if (data.transferFrom) {
      item.transferFrom = data.transferFrom
    }
    if (data.transferTo) {
      item.transferTo = data.transferTo
    }
    if (list.length >= 20) {
      list.splice(19)
    }
    list.unshift(item)
    Vue.set(state.callList.cdr_call, 'list', list)
    Vue.set(state.callList.cdr_call, 'count', list.length)
  },
  [types.PUSH_CURRENT_CDR_CALL] (state, data) {
    let item = {}
    item._id = data.callSheetId
    item.CALL_SHEET_ID = data.callSheetId
    item.CALL_NO = data.originCallNo
    item.QUICK_QUERY_NUM = data.originCallNo
    item.CALLED_NO = data.originCalledNo
    item.OFFERING_TIME = data.offeringTime
    item.PROVINCE = data.callerProvince
    item.DISTRICT = data.callerCity
    item.ivrkey = data.ivrkey
    item.Agent = data.Agent
    item.RingTime = data.RingTime
    item.ERROR_MEMO = data.queue
    item.STATUS = data.CallStatus
    item.QUEUE_NAME = data.queueName
    if (data.CUSTOMER_STATUS) {
      item.CUSTOMER_STATUS = data.CUSTOMER_STATUS
    }
    if (data.CUSTOMER_NAME) {
      item.CUSTOMER_NAME = data.CUSTOMER_NAME
    }
    if (data.CUSTOMER_ID) {
      item.CUSTOMER_ID = data.CUSTOMER_ID
    }
    if (data.CUSTOMER_TYPE) {
      item.CUSTOMER_TYPE = data.CUSTOMER_TYPE
    }
    if (data.transferFrom) {
      item.transferFrom = data.transferFrom
    }
    if (data.transferTo) {
      item.transferTo = data.transferTo
    }
    Vue.set(state.current.cdr_call, 'callInfo', item)
  },
  [types.SET_CUSTOMER_INFO] (state, {data, callSheetId}) {
    Vue.set(state.current.cdr_call, 'currentCustomer', data)
  },
  [types.SET_IFRAME_URL] (state, url) {
    Vue.set(state.transCache, 'megNum', url)
  },
  [types.UPDATE_CURRENT_CUSTOMER_INFO] (state, {callId, customer}) {
    for (let callTab in state.callList) {
      state.callList[callTab].list && state.callList[callTab].list.forEach((callInfo, index) => {
        let info = state.callList[callTab].list[index]
        if (callInfo._id === callId && customer) {
          if (customer.name) {
            Vue.set(info, 'CUSTOMER_NAME', customer.name)
          }
          if (customer._id) {
            Vue.set(info, 'CUSTOMER_ID', customer._id)
          }
          if (customer.status) {
            Vue.set(info, 'CUSTOMER_STATUS', customer.status)
          }
          Vue.set(info, 'CUSTOMER_TYPE', 'one')
          Vue.set(state.current[callTab], 'currentCustomer', customer)
        }
      })
      // 用于 来电后 更新客户信息后刷新
      if (callTab === 'cdr_call') {
        window.sessionStorage.callList = JSON.stringify(state.callList.cdr_call.list)
      }
    }
  },
  [types.SET_AUTO_CUST] (state, {callSheetId, autoCust}) {
    if (!state.autoCust) {
      Vue.set(state, 'autoCust', {})
    }
    Vue.set(state.autoCust, callSheetId, autoCust)
  },
  [types.SET_STORAGE_CALLLIST] (state, data) {
    window.sessionStorage.callList = JSON.stringify(state.callList.cdr_call.list)
  },
  [types.SET_CALL_LIST_PUSH] (state, data) {
    Vue.set(state.callList.cdr_call, 'list', data)
    Vue.set(state.callList.cdr_call, 'count', data.length)
  },
  [types.SET_READ] (state, callSheetId) {
    let list = state.callList.cdr_call.list
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (callSheetId === list[i]._id) {
          Vue.set(state.callList.cdr_call.list[i], 'unRead', false)
        }
      }
      if (window.sessionStorage.callList) { // 把缓存里面的相对应通话也改成已读
        window.sessionStorage.callList = JSON.stringify(list)
      }
    }
  },
  [types.COUNT_UNREAD_CDR] (state) {
    let result = 0
    let list = state.callList.cdr_call.list
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].unRead) {
          result += 1
        }
      }
    }
    Vue.set(state, 'unReadCdr', result)
  }
}
