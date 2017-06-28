import * as types from './mutation-types'
import Vue from 'vue'

export default {
  [types.CODE] (state, data) {
    state.ctiList.code = data
  },
  [types.PHONE_DATA] (state, data) {
    let phoneData = data.phoneData
    if (phoneData) {
      for (let key in phoneData) {
        if (phoneData[key]) {
          if (key === 'busyType') {
            state.globalLet.busyType = phoneData[key]
          } else if (key === 'extenType') {
            state.globalLet._cti_extenType = phoneData[key]
          }
          Vue.set(state.globalLet.phone_data, key, phoneData[key])
        }
      }
    } else {
      state.globalLet.phone_data = {}
    }
  },
  [types.CTI_STATE] (state, data) {
    let preState = state.globalLet._cti_currentState
    state.globalLet._cti_preState = preState
    state.globalLet._cti_currentState = data
  },
  [types.CTI_IS_WAITING_EVENT] (state, data) {
    state.globalLet._cti_is_waiting_event = data
  },
  [types.CTI_RECONNECTION_COUNT] (state, data) {
    state.globalLet._cti_reconnection_count = data
  },
  [types.CTI_ISRELOGIN] (state, data) {
    state.globalLet._cti_isRelogin = data
  },
  [types.CTI_ISSETTINGBUSY] (state, data) {
    state.globalLet._cti_isSettingbusy = data
  },
  [types.CTI_URL] (state, data) {
    state.globalLet._cti_url = data
  },
  [types.CTI_STATEBEFOREHOLD] (state, data) {
    state.globalLet._cti_stateBeforeHold = data
  },
  [types.CTI_ISINVESTIGATTING] (state, data) {
    state.globalLet._cti_isInvestigatting = data
  },
  [types.PHONE_PBXS] (state, {data, type}) {
    for (let key in data) {
      if (data[key]) {
        state.globalLet.phone_pbxs[type] = data[key]
      }
    }
  },
  [types.CTI_CURRENTSTATE] (state, data) {
    let preState = state.globalLet._cti_currentState
    state.globalLet._cti_preState = preState
    state.globalLet._cti_currentState = data
  },
  [types.PHONECALLOBJECT] (state, data) {
    let phoneCallObject = data.phoneCallObject
    if (phoneCallObject) {
      for (let key in phoneCallObject) {
        if (phoneCallObject[key]) {
          state.globalLet._phone_callObject[key] = phoneCallObject[key]
        }
      }
    } else {
      state.globalLet._phone_callObject = {}
    }
  },
  [types.CTI_UI_LAST_STATE] (state, data) {
    state.globalLet._cti_ui_last_state = data
  },
  [types.PHONE_SERVICENOS] (state, data) {
    let serviceNo = data.serviceNo
    let numberInfo = data.numberInfo
    if (state.globalLet.phone_serviceNos[serviceNo]) {
      for (let key in numberInfo) {
        Vue.set(state.globalLet.phone_serviceNos[serviceNo], key, numberInfo[key])
      }
    } else {
      Vue.set(state.globalLet.phone_serviceNos, serviceNo, numberInfo)
    }
  },
  [types.PHONE_PEERS] (state, data) {
    let userId = data.userId
    let peer = data.peer
    if (state.globalLet.phone_peers[userId]) {
      for (let key in peer) {
        Vue.set(state.globalLet.phone_peers[userId], key, peer[key])
      }
    } else {
      Vue.set(state.globalLet.phone_peers, userId, peer)
    }
    // Vue.$store.commit('monitor/AGENT_STATE_CHANGE', userId)
    Vue.set(state, 'agentStateChange', {random: Math.random(), userId: userId})
  },
  [types.PHONE_QUEUES] (state, data) {
    let queue = data.queue
    let queueItem = data.queueItem
    if (state.globalLet.phone_queues[queue]) {
      for (let key in queueItem) {
        Vue.set(state.globalLet.phone_queues[queue], key, queueItem[key])
      }
    } else {
      Vue.set(state.globalLet.phone_queues, queue, queueItem)
    }
  },
  [types.PHONE_ACCOUNTCALLS] (state, data) {
    let pbx = data.pbx
    let account = data.account
    if (state.globalLet.phone_accountCalls[pbx]) {
      for (let key in account) {
        Vue.set(state.globalLet.phone_accountCalls[pbx], key, account[key])
      }
    } else {
      Vue.set(state.globalLet.phone_accountCalls, pbx, data.account)
    }
  },
  [types.PHONE_PEERSFROMSIP] (state, data) {
    let sipNo = data.sipNo
    let numberInfo = data.numberInfo
    if (state.globalLet._phone_peersFromSip[sipNo]) {
      for (let key in numberInfo) {
        Vue.set(state.globalLet._phone_peersFromSip[sipNo], key, numberInfo[key])
      }
    } else {
      Vue.set(state.globalLet._phone_peersFromSip, sipNo, data.numberInfo)
    }
  },
  [types.CTI_UI_COUNTTIMER] (state, data) {
    state.globalLet._cti_ui_countTimer = data
  },
  [types.CTI_UI_CALCULAGRAPH] (state, data) {
    state.globalLet._cti_ui_calculagraph = data
  },
  [types.MTIME] (state, data) {
    state.globalLet.mtime = data
  },
  [types.BUSYTYPE] (state, data) {
    state.globalLet.busyType = data
  },
  [types.CTI_LINKED] (state, data) {
    state.globalLet._cti_linked = data
  },
  [types.CTI_SHOWNUMBER] (state, data) {
    state.globalLet._cti_showNumber = data
    if (!data) {
      state.globalLet.calleeArea = ''
    }
  },
  [types.CTI_EXTENSTATE] (state, data) {
    state.globalLet._cti_extenState = data
  },
  [types.INVESTIGATELIST] (state, data) {
    state.globalLet.investigatelist = data
  },
  [types.IVRMENU] (state, data) {
    state.globalLet.ivrMenu = data
  },
  [types.WAITSATE] (state, data) {
    for (let key in data) {
      Vue.set(state.globalLet.waitSate, key, data[key])
    }
  },
  [types.SHOWTRANSFERDIALOG] (state, data) {
    state.globalLet.showTransferDialog = data
  },
  [types.CTI_UI_NOTIFYDIALOGINTERVAL] (state, data) {
    state.globalLet._cti_ui_notifyDialogInterval = data
  },
  [types.CTI_UI_DIALOGBOXREMAIN] (state, data) {
    state.globalLet._cti_ui_dialogBoxRemain = data
  },
  [types.SHOWTRANSFERCANCELDIALOG] (state, data) {
    state.globalLet.showTransferCancelDialog = data
  },
  [types.CALLEEAREA] (state, data) {
    state.globalLet.calleeArea = data
  },
  [types.CURRENTCALLSHEETID] (state, data) {
    state.globalLet.currentCallSheetId = data
  },
  [types.CALL_SCREEN] (state, data) {
    state.globalLet.callScreen = data
  },
  [types.CALL_CUSTOMER_DETAIL] (state, data) {
    state.globalLet.callCustomerDetail = data
  },
  [types.SCREEN_FLAG] (state, data) {
    state.globalLet.callFlag = data
  },
  [types.CURRENT_CUST_INFO] (state, data) {
    state.currentCustInfo = data
  },
  [types.SCREEN_CALL_SHEET_ID] (state, data) {
    state.globalLet.screenCallSheetId = data
  },
  [types.CALLINGNUM] (state, data) {
    state.globalLet.callingNum = data
  },
  [types.BUSYTYPENAME] (state, data) {
    state.globalLet.busyTypeName = data
  },
  [types.SHOWCONSULTDIALOG] (state, data) {
    state.globalLet.showConsultDialog = data
  },
  [types.LIMITS] (state, data) {
    state.globalLet.limits = data
  }
}
