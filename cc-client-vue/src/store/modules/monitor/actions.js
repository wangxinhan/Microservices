import * as ctiTypes from '../cti/mutation-types'
import * as ctiAction from '../cti/actions'
import * as types from './mutation-types'
import * as globalTypes from '../../mutation-types'
import {getCache, refreshCacheFromDb, getCacheByKey} from '../../actions'
import monitor from '../../api/monitor'
import report from '../../api/report'

/**
 * 初始化
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @returns {Promise<R>|Promise.<T>}
 * @private
 */
export const imMonitorInit = ({commit, state, rootState, dispatch}) => {
  let p1 = getCache({commit, state: rootState}, {type: 'agents'}).then(agents => {
    commit(types.INIT_MONITOR_AGENTS, {agents})
  })
  let p2 = getCache({commit, state: rootState}, {type: 'webchatAndSdkConfig'}).then(config => {
    commit(types.INIT_MONITOR_IM_CHANNEL, {config})
  })
  let p = Promise.all([p1, p2])
  return p.then(() => {
    return monitor.getPushOnlineAgentAndDealingCount({})
      .then(response => {
        console.log(response)
        return getCache({commit, state: rootState}, {type: 'mailQueues'}).then(mailQueues => {
          console.log(response)
          commit(types.INIT_AGENT_AND_QUEUE, {res: response, mailQueues})
        })
      })
  }).then(() => {
    return monitor.queryMonitorInitData({account: rootState.session.account.account})
      .then(response => {
        if (response.success) {
          commit(types.INIT_MONITOR_ACCESSNO, {res: response})
        }
      })
  }).then(() => {
    getAgentMonitorHeader({commit, state, rootState, dispatch})
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * im推送处理
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @returns {Promise<R>|Promise.<T>}
 * @private
 */
export const imMonitorEventProcess = ({commit, state, rootState, dispatch}, event) => {
  event = event.Data
  if (event.im_monitor_type === 'accessNo') {
    return refreshCacheFromDb({commit, state: rootState}, {type: 'webchatAndSdkConfig'}).then(() => {
      return getCacheByKey({commit, state: rootState}, {
        type: 'webchatAndSdkConfig',
        key: 'accessId',
        value: event.accessId
      })
    }).then(curAccess => {
      commit(types.EVENT_MONITOR_IM_CHANNEL, {event, curAccess})
    }).catch(err => {
      console.log(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
  } else if (event.im_monitor_type === 'agent') {
    commit(types.EVENT_MONITOR_IM_AGENT, {event})
  } else if (event.im_monitor_type === 'queue') {
    return refreshCacheFromDb({commit, state: rootState}, {type: 'mailQueues'}).then(() => {
    }).then(() => {
      getCacheByKey({commit, state: rootState}, {
        type: 'mailQueues',
        key: 'Exten',
        value: event.queueExten
      }).then((curQueue) => {
        commit(types.EVENT_MONITOR_IM_QUEUE, {event, curQueue})
      })
    }).catch(err => {
      console.log(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
  }
}
/**
 * 邮件推送处理
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @returns {Promise<R>|Promise.<T>}
 * @private
 */
export const mailMonitorEventProcess = ({commit, state, rootState, dispatch}, event) => {
  event = event.Data
  if (event.im_monitor_type === 'agent') {
    commit(types.EVENT_MONITOR_MAIL, {event})
  }
}
/**
 * 保存自定义表头
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @returns {Promise<R>|Promise.<T>}
 * @private
 */
export const saveTableHeader = ({commit, state, rootState, dispatch}, data) => {
  return report.saveReportTableHeader(data)
    .then(response => {
      data.Config = data.headers
      commit(types.TABLEHEADER_AGENT, {data: data})
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 获取座席监控自定义
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @returns {*|Promise<R>|Promise.<TResult>|Promise<R2|R1>}
 */
let getAgentMonitorHeader = ({commit, state, rootState, dispatch}) => {
  return report.getReportTableHeader('im_monitor_agent').then(response => {
    if (response.success) {
      commit(types.TABLEHEADER_AGENT, {data: response.data})
    }
  })
}
export function ctiMonitorProcess (evtJson, state, commit, rootState) {
  ctiMonitorPeer({commit, state, rootState}, evtJson)
  ctiMonitorQueue({commit, state}, evtJson)
  ctiMonitorServiceNo({commit, state}, evtJson)
  ctiMonitorAccount({commit, state}, evtJson)
}

function ctiMonitorServiceNo ({commit, state}, evtJson) {
  if (evtJson.Event === 'TrunkStatus') {
    let serviceNo
    let displayName
    if (evtJson.DisplayName) {
      displayName = evtJson.DisplayName
      if (displayName.indexOf('serviceno-') === 0) {
        displayName = ''
      }
    }
    if (!state.globalLet.phone_serviceNos[evtJson.ServiceNo]) {
      serviceNo = {
        serviceNo: evtJson.ServiceNo,
        inCalls: evtJson.InCalls,
        inLost: evtJson.InLost,
        inComplete: evtJson.InComplete,
        outCalls: 0,
        outComplete: 0,
        displayName: displayName,
        pbx: evtJson.PBX
      }
    } else {
      serviceNo = {
        inCalls: evtJson.InCalls,
        inLost: evtJson.InLost,
        inComplete: evtJson.InComplete,
        outCalls: 0,
        outComplete: 0,
        displayName: displayName
      }
    }
    let data = {
      serviceNo: evtJson.ServiceNo,
      numberInfo: serviceNo
    }
    commit(ctiTypes.PHONE_SERVICENOS, data)
    ctiAction.phonePublishEvent(commit, state, 'EvtMonitorServiceNo', [state.globalLet.phone_serviceNos[evtJson.ServiceNo]])
  }
}

function ctiMonitorPeer ({commit, state, rootState}, evtJson) {
  if (evtJson.Event === 'ChannelStatus') {
    if (evtJson.ChannelStatus === 'Hangup') {
      if (evtJson.UserID === undefined) {
        return
      }
    }
    let peer = ctiAction.ctiGetUserFromSip(evtJson.Exten, state, commit)
    if (!peer) {
      return
    }
    let peerToCommit = {}
    if (evtJson.ChannelStatus === 'Down') {
      peerToCommit.callStatus = 'Down'
      peerToCommit.channel = evtJson.Channel
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.ctiUpdateQueueInfo(state, commit)
    } else if (evtJson.ChannelStatus === 'Ring') {
      commit(ctiTypes.CURRENTCALLSHEETID, evtJson.Data.CallSheetID)
      peerToCommit.callStatus = 'Ring'
      peerToCommit.called = false
      peerToCommit.C5Status = evtJson.C5Status
      peerToCommit.timestamp = evtJson.Timestamp
      peerToCommit.channel = evtJson.Channel
      peerToCommit.queueName = ''
      if (evtJson.C5Status === 'OutboundCall' || evtJson.C5Status === 'InboundCall' || evtJson.C5Status === 'listen') {
        peerToCommit.callNo = evtJson.Data.ListenExten
      } else if (evtJson.FromDid) {
        peerToCommit.callNo = evtJson.FromDid
      }
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peer])
      if (evtJson.ChannelType === 'dialout') {
        if (evtJson.UserID === rootState.session.sessionId) {
          if (evtJson.Data.CallSheetID) {
            showDialoutData({commit, state, rootState}, evtJson)
          }
        }
      }
    } else if (evtJson.ChannelStatus === 'Ringing') {
      commit(ctiTypes.CURRENTCALLSHEETID, evtJson.Data.CallSheetID)
      peerToCommit.called = true
      peerToCommit.callStatus = 'Ringing'
      peerToCommit.C5Status = evtJson.C5Status
      peerToCommit.channel = evtJson.Channel
      peerToCommit.linkedChannel = evtJson.LinkedChannel.Channel
      if (evtJson.LinkedChannel) {
        peerToCommit.queueName = evtJson.LinkedChannel.QueueName
      }
      if (evtJson.ChannelType === 'dialTransfer') {
        peerToCommit.callNo = evtJson.FromDid
      } else {
        peerToCommit.callNo = evtJson.FromCid
      }
      peerToCommit.timestamp = evtJson.Timestamp
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peer])
    } else if (evtJson.ChannelStatus === 'Up') {
      if (evtJson.ChannelType === 'listen') {
        peerToCommit.callNo = evtJson.Data.ListenExten
        peerToCommit.timestamp = evtJson.Timestamp
        peerToCommit.C5Status = evtJson.C5Status
        peerToCommit.callStatus = evtJson.ChannelType
        peerToCommit.linked = true
        peerToCommit.channel = evtJson.Channel
        commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
        commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
        ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peer])
      }
    } else if (evtJson.ChannelStatus === 'Link') {
      commit(ctiTypes.CURRENTCALLSHEETID, evtJson.Data.CallSheetID)
      commit(ctiTypes.CTI_LINKED, true)
      peerToCommit.timestamp = evtJson.Timestamp
      peerToCommit.C5Status = evtJson.C5Status
      peerToCommit.linked = true
      peerToCommit.channel = evtJson.Channel
      peerToCommit.linkedChannel = evtJson.LinkedChannel.Channel
      peerToCommit.callStatus = evtJson.ChannelType
      if (evtJson.LinkedChannel) {
        peerToCommit.queueName = evtJson.LinkedChannel.QueueName
      }
      if (evtJson.ChannelType === 'dialout' || evtJson.ChannelType === 'dialTransfer') {
        peerToCommit.callNo = evtJson.LinkedChannel.FromDid
      } else {
        peerToCommit.callNo = evtJson.LinkedChannel.FromCid
      }
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peer])
    } else if (evtJson.ChannelStatus === 'Unlink') {
      commit(ctiTypes.CTI_LINKED, false)
    } else if (evtJson.ChannelStatus === 'Hangup') {
      if (evtJson.ChannelType === 'listen') {
        if (state.globalLet.phone_data._curChannel === evtJson.Channel) {
          if (evtJson.ChannelType === 'listen') {
            commit(ctiTypes.PHONE_DATA, {phoneData: {_otherChannel: ''}})
            ctiAction.phonePublishEvent(commit, state, 'EvtEndListen', [])
          }
        }
      }
      if (peer.channel === evtJson.Channel) {
        if (state.globalLet.phone_data._otherChannel === evtJson.Channel &&
          (state.globalLet._cti_stateDescription[state.globalLet._cti_currentState] === 'listening' || state.globalLet._cti_stateDescription[state.globalLet._cti_currentState] === 'listened')) {
          ctiAction.phoneHangup({commit, state})
        }
      }
      peerToCommit.callNo = ''
      peerToCommit.callStatus = 'Idle'
      peerToCommit.timestamp = evtJson.Timestamp
      peerToCommit.channel = ''
      peerToCommit.linkedChannel = ''
      peerToCommit.queueName = ''
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.ctiUpdateQueueInfo(state, commit)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peer])
      if (evtJson.ChannelType === 'dialout' && state.globalLet._cti_linked) {
        // handler.cdr.hideCallBackLeakListItem(evtJson.Data.ListenExten)
      }
      commit(ctiTypes.CTI_LINKED, false)
    }
  } else if (evtJson.Event === 'UserStatus') {
    let isRegistered = false
    let peerToCommit = {}
    if (evtJson.PeerStatus === 'Registered') {
      isRegistered = true
    }
    if (!state.globalLet.phone_peers[evtJson.UserID]) {
      peerToCommit = {
        exten: evtJson.Exten,
        sipNo: evtJson.SipNum,
        name: evtJson.User,
        DisplayName: evtJson.DisplayName,
        loginExten: evtJson.LoginExten,
        peerStatus: evtJson.PeerStatus,
        status: evtJson.Status,
        C5Status: evtJson.C5Status,
        busy: evtJson.Busy,
        extenType: evtJson.ExtenType,
        login: evtJson.Login,
        userId: evtJson.UserID,
        user: evtJson.User,
        localNo: evtJson.Local,
        register: isRegistered,
        InCalls: evtJson.InCalls,
        InComplete: evtJson.InComplete,
        TransferComplete: evtJson.TransferComplete,
        OutCalls: evtJson.OutCalls,
        OutComplete: evtJson.OutComplete,
        DialinTimeLength: evtJson.DialinTimeLength,
        DialoutTimeLength: evtJson.DialoutTimeLength,
        linked: false,
        channel: '',
        linkedChannel: '',
        called: false,
        callStatus: 'Idle',
        callNo: '',
        timestamp: evtJson.Login ? (evtJson.BusyTimestamp) : '',
        busyTimestamp: evtJson.BusyTimestamp,
        loginTimestamp: evtJson.LoginTimestamp,
        busyType: evtJson.BusyType,
        // pinyin: cnToSpell.getSpell(evtJson.DisplayName),
        pbx: evtJson.PBX
      }
      let data = {
        peer: peerToCommit,
        userId: evtJson.UserID
      }
      commit(ctiTypes.PHONE_PEERS, data)
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      if (evtJson.SipNum) {
        ctiUpdateUserSip(commit, evtJson.SipNum, peerToCommit)
      }
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peerToCommit])
    } else {
      let peer = state.globalLet.phone_peers[evtJson.UserID]
      peerToCommit.peerStatus = evtJson.PeerStatus
      peerToCommit.status = evtJson.Status
      peerToCommit.exten = evtJson.Exten
      peerToCommit.sipNo = evtJson.SipNum
      peerToCommit.C5Status = evtJson.C5Status
      peerToCommit.busy = evtJson.Busy
      peerToCommit.extenType = evtJson.ExtenType
      peerToCommit.login = evtJson.Login
      peerToCommit.loginExten = evtJson.LoginExten
      peerToCommit.name = evtJson.User
      peerToCommit.DisplayName = evtJson.DisplayName
      peerToCommit.userId = evtJson.UserID
      peerToCommit.user = evtJson.User
      peerToCommit.localNo = evtJson.Local
      peerToCommit.register = isRegistered
      peerToCommit.InCalls = evtJson.InCalls
      peerToCommit.InComplete = evtJson.InComplete
      peerToCommit.TransferComplete = evtJson.TransferComplete
      peerToCommit.DialinTimeLength = evtJson.DialinTimeLength
      peerToCommit.DialoutTimeLength = evtJson.DialoutTimeLength
      peerToCommit.OutCalls = evtJson.OutCalls
      peerToCommit.OutComplete = evtJson.OutComplete
      peerToCommit.busyTimestamp = evtJson.BusyTimestamp
      peerToCommit.loginTimestamp = evtJson.LoginTimestamp
      peerToCommit.busyType = evtJson.BusyType
      peerToCommit.timestamp = peer.login ? (peer.busyTimestamp) : ''
      if (evtJson.SipNum) {
        ctiUpdateUserSip(commit, evtJson.SipNum, peer)
      }
      if (!peer.sipNo) {
        peerToCommit.callStatus = 'Idle'
        peerToCommit.callNo = ''
      }
      let data = {
        peer: peerToCommit,
        userId: evtJson.UserID
      }
      commit(ctiTypes.PHONE_PEERS, data)
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peer])
      ctiAction.ctiUpdateQueueInfo(state, commit)
    }
  } else if (evtJson.Event === 'UserBusy') {
    if (state.globalLet.phone_peers[evtJson.UserID]) {
      let peer = state.globalLet.phone_peers[evtJson.UserID]
      let peerToCommit = {}
      peerToCommit.busy = evtJson.Busy
      peerToCommit.busyType = evtJson.BusyType
      peerToCommit.busyTimestamp = evtJson.BusyTimestamp
      peerToCommit.timestamp = peer.login ? (peerToCommit.busyTimestamp) : ''
      peerToCommit.loginTimestamp = evtJson.LoginTimestamp
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.ctiUpdateQueueInfo(state, commit)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peerToCommit])
    }
  } else if (evtJson.Event === 'UserCallsUpdate') {
    if (state.globalLet.phone_peers[evtJson.UserID]) {
      let peerToCommit = {}
      peerToCommit.InCalls = evtJson.InCalls
      peerToCommit.InComplete = evtJson.InComplete
      peerToCommit.TransferComplete = evtJson.TransferComplete
      peerToCommit.DialoutTimeLength = evtJson.DialoutTimeLength
      peerToCommit.DialinTimeLength = evtJson.DialinTimeLength
      peerToCommit.OutCalls = evtJson.OutCalls
      peerToCommit.OutComplete = evtJson.OutComplete
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peerToCommit])
      ctiAction.ctiUpdateQueueInfo(state, commit)
    }
  } else if (evtJson.Event === 'UserSignIn') {
    if (state.globalLet.phone_peers[evtJson.UserID]) {
      let peerToCommit = {}
      peerToCommit.extenType = evtJson.ExtenType
      peerToCommit.login = evtJson.Login
      peerToCommit.sipNo = evtJson.SipNum
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peerToCommit])
      ctiAction.ctiUpdateQueueInfo(state, commit)
    }
  } else if (evtJson.Event === 'UserSignOut') {
    if (state.globalLet.phone_peers[evtJson.UserID]) {
      let peerToCommit = {}
      peerToCommit.extenType = evtJson.ExtenType
      peerToCommit.sipNo = evtJson.SipNum
      peerToCommit.login = evtJson.Login
      commit(ctiTypes.PHONE_PEERS, {userId: evtJson.UserID, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peerToCommit])
      ctiAction.ctiUpdateQueueInfo(state, commit)
    }
  } else if (evtJson.Event === 'PeerStatus') {
    let isRegistered = false
    if (evtJson.PeerStatus === 'Registered') {
      isRegistered = true
    }
    let peer = ctiAction.ctiGetUserFromSip(evtJson.Exten, state, commit)
    let peerToCommit = {}
    if (peer) {
      peerToCommit.register = isRegistered
      peerToCommit.status = evtJson.Status
      if (peer.userId === state.globalLet.phone_data.userId) {
        commit(ctiTypes.PHONE_DATA, {phoneData: {Status: evtJson.Status}})
      }
      commit(ctiTypes.PHONE_PEERS, {userId: peer.userId, peer: peerToCommit})
      commit(types.AGENT_STATE_CHANGE, evtJson.UserID)
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorPeer', [peer])
      ctiAction.ctiUpdateQueueInfo(state, commit)
    }
  }
}

function ctiMonitorQueue ({commit, state}, evtJson) {
  if (evtJson.Event === 'QueueParams') {
    let queueItem = {}
    let queue = ctiQueryQueueItem(state, evtJson)
    if (queue) {
      if (evtJson.Removed) {
        queueItem.removed = true
      }
      queueItem.queueName = evtJson.DisplayName
      queueItem.idleAgentCount = evtJson.Members - evtJson.BusyMembers
      queueItem.busyAgentCount = evtJson.BusyMembers
      queueItem.totalAgentCount = evtJson.Members
      queueItem.queueWaitCount = evtJson.Calls
      queueItem.abadonedCalls = evtJson.Abandoned
      queueItem.totalCalls = evtJson.TotalCalls
      queueItem.DisplayName = evtJson.DisplayName
      queueItem.members = {}
      for (let i in evtJson.QueueMember) {
        let member = evtJson.QueueMember[i]
        queueItem.members[member] = member
      }
      commit(ctiTypes.PHONE_QUEUES, {queue: evtJson.Queue, queueItem: queueItem})
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorQueue', [queueItem, 'needWaitCount'])
    } else {
      queueItem = {
        queueName: evtJson.DisplayName,
        queueId: evtJson.Queue,
        idleAgentCount: evtJson.Members - evtJson.BusyMembers,
        busyAgentCount: evtJson.BusyMembers,
        totalAgentCount: evtJson.Members,
        queueWaitCount: evtJson.Calls,
        abadonedCalls: evtJson.Abandoned,
        DisplayName: evtJson.DisplayName,
        totalCalls: evtJson.TotalCalls,
        members: {},
        removed: false,
        pbx: evtJson.PBX
      }
      for (let i in evtJson.QueueMember) {
        let member = evtJson.QueueMember[i]
        queueItem.members[member] = member
      }
      commit(ctiTypes.PHONE_QUEUES, {queue: evtJson.Queue, queueItem: queueItem})
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorQueue', [queueItem, 'needWaitCount'])
    }
  } else if (evtJson.Event === 'QueueMemberAdded') {
    let queue = ctiQueryQueueItem(state, evtJson)
    let queueItem = {
      members: {}
    }
    if (queue) {
      for (let i in queue.members) {
        queueItem.members[i] = queue.members[i]
      }
      if (!queue.members[evtJson.Exten]) {
        queueItem.members[evtJson.Exten] = evtJson.Exten
        queueItem.totalAgentCount = queue.totalAgentCount + 1
        commit(ctiTypes.PHONE_QUEUES, {queue: evtJson.Queue, queueItem: queueItem})
        ctiAction.ctiUpdateQueueInfo(state, commit)
      }
    }
  } else if (evtJson.Event === 'QueueMemberRemoved') {
    let queue = ctiQueryQueueItem(state, evtJson)
    let queueItem = {
      members: {}
    }
    if (queue) {
      for (let i in queue.members) {
        queueItem.members[i] = queue.members[i]
      }
      if (queueItem.members[evtJson.Exten]) {
        delete queueItem.members[evtJson.Exten]
        queueItem.totalAgentCount = queue.totalAgentCount - 1
        commit(ctiTypes.PHONE_QUEUES, {queue: evtJson.Queue, queueItem: queueItem})
        ctiAction.phonePublishEvent(commit, state, 'EvtMonitorQueue', [queueItem, 'noNeedWaitCount'])
      }
    }
  } else if (evtJson.Event === 'Join') {
    let queue = ctiQueryQueueItem(state, evtJson)
    let queueItem = {}
    if (queue) {
      queueItem.queueWaitCount = queue.queueWaitCount + 1
      commit(ctiTypes.PHONE_QUEUES, {queue: evtJson.Queue, queueItem: queueItem})
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorQueue', [queueItem, 'needWaitCount'])
    }
  } else if (evtJson.Event === 'Leave') {
    let queue = ctiQueryQueueItem(state, evtJson)
    let queueItem = {}
    if (queue) {
      queueItem.totalCalls = queue.totalCalls + 1
      queueItem.queueWaitCount = queue.queueWaitCount - 1
      if (queueItem.queueWaitCount < 0) {
        queueItem.queueWaitCount = 0
      }
      commit(ctiTypes.PHONE_QUEUES, {queue: evtJson.Queue, queueItem: queueItem})
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorQueue', [queueItem, 'needWaitCount'])
    }
  } else if (evtJson.Event === 'QueueCallerAbandon') {
    let queue = ctiQueryQueueItem(state, evtJson)
    let queueItem = {}
    if (queue) {
      queueItem.abadonedCalls = queue.abadonedCalls + 1
      commit(ctiTypes.PHONE_QUEUES, {queue: evtJson.Queue, queueItem: queueItem})
      ctiAction.phonePublishEvent(commit, state, 'EvtMonitorQueue', [queueItem, 'noNeedWaitCount'])
    }
  }
}

function ctiMonitorAccount ({commit, state}, evtJson) {
  if (evtJson.Event === 'AccountStatus') {
    if (!state.globalLet.phone_accountCalls[evtJson.PBX]) {
      let account = {
        account: evtJson.Account,
        inCalls: evtJson.InCalls,
        outComplete: evtJson.OutComplete,
        inComplete: evtJson.InComplete,
        outCalls: evtJson.OutCalls,
        inCallsPerHour: evtJson.InCallsPerHour,
        currentOutCalls: evtJson.CurrentOutCalls,
        pbx: evtJson.PBX,
        inCompletePerHour: evtJson.InCompletePerHour,
        outCallsPerHour: evtJson.OutCallsPerHour,
        currentInCalls: evtJson.CurrentInCalls,
        outCompletePerHour: evtJson.OutCompletePerHour
      }
      commit(ctiTypes.PHONE_ACCOUNTCALLS, {pbx: evtJson.PBX, account: account})
      ctiAction.phonePublishEvent(commit, state, 'EvtAccountCalls', [account])
    } else {
      let account = {
        account: evtJson.Account,
        inCalls: evtJson.InCalls,
        outComplete: evtJson.OutComplete,
        inComplete: evtJson.InComplete,
        outCalls: evtJson.OutCalls,
        inCallsPerHour: evtJson.InCallsPerHour,
        currentOutCalls: evtJson.CurrentOutCalls,
        pbx: evtJson.PBX,
        inCompletePerHour: evtJson.InCompletePerHour,
        outCallsPerHour: evtJson.OutCallsPerHour,
        currentInCalls: evtJson.CurrentInCalls,
        outCompletePerHour: evtJson.OutCompletePerHour
      }
      commit(ctiTypes.PHONE_ACCOUNTCALLS, {pbx: evtJson.PBX, account: account})
      ctiAction.phonePublishEvent(commit, state, 'EvtAccountCalls', [account])
    }
  }
}

function ctiUpdateUserSip (commit, sipNo, peer) {
  let data = {
    sipNo: sipNo,
    numberInfo: peer
  }
  commit(ctiTypes.PHONE_PEERSFROMSIP, data)
}

function ctiQueryQueueItem (state, evtJson) {
  return state.globalLet.phone_queues[evtJson.Queue]
}

function showDialoutData ({commit, state, rootState}, evtJson) {
  let result = {}
  if (evtJson) {
    result.CallNo = evtJson.FromCid
    result.CalledNo = evtJson.FromDid
    result.CallSheetID = evtJson.Data.CallSheetID
    result.CallType = evtJson.ChannelType
    result.Ring = evtJson.Timestamp
    getCache({commit, state: rootState}, {type: 'agents', id: evtJson.UserID}).then((res) => {
      result.Agent = res.exten
      // result.ActionID = evtJson.ACTION_ID;外呼接口调用外呼 是否会有这个值
      result.Province = evtJson.CalleeProvince
      result.District = evtJson.CalleeCity
      result.CallID = evtJson.Uniqueid
      ctiAction.showDialoutUrlOrInPopupCust({commit, state, rootState}, result)
    })
  }
}
