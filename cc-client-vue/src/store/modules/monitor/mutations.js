import * as types from './mutation-types'
import Vue from 'vue'
export default {
  [types.INIT_AGENT_AND_QUEUE] (state, {res, mailQueues}) {
    for (let i = 0; i < res.onlineList.length; i++) {
      if ('status' in res.onlineList[i]) {
        if (res.onlineList[i].status === 'close') {
          Vue.set(state.table.agentMonitor[res.onlineList[i]._id], 'autoClaim', false)
        } else {
          Vue.set(state.table.agentMonitor[res.onlineList[i]._id], 'autoClaim', true)
        }
      } else {
        Vue.set(state.table.agentMonitor[res.onlineList[i]._id], 'autoClaim', true)
      }
      if ('emailStatus' in res.onlineList[i]) {
        if (res.onlineList[i].emailStatus === 'close') {
          Vue.set(state.table.agentMonitor[res.onlineList[i]._id], 'mailAutoClaim', false)
        } else {
          Vue.set(state.table.agentMonitor[res.onlineList[i]._id], 'mailAutoClaim', true)
        }
      } else {
        Vue.set(state.table.agentMonitor[res.onlineList[i]._id], 'mailAutoClaim', false)
      }
      // _im_monitor_onPeerChanged(state.table.agentMonitor[res.onlineList[i]._id])
    }
    for (let i = 0; i < res.dealList.length; i++) {
      if (state.table.agentMonitor[res.dealList[i]._id]) {
        Vue.set(state.table.agentMonitor[res.dealList[i]._id], 'dealing', res.dealList[i].count)
      }
    }
    // queue table init need agentData so in there init queues.
    let imQueues = mailQueues
    for (let i = 0; i < imQueues.length; i++) {
      imQueues[i].manualSession = 0
      imQueues[i].waitClaim = 0
      Vue.set(state.table.MultiChannelSkill, imQueues[i].Exten, imQueues[i])
    }
    for (let i = 0; i < res.queueAccessList.length; i++) {
      if (state.table.MultiChannelSkill[res.queueAccessList[i]._id]) {
        Vue.set(state.table.MultiChannelSkill[res.queueAccessList[i]._id], 'manualSession', res.queueAccessList[i].accessCount)
      }
    }
    for (let i = 0; i < res.queueUndealList.length; i++) {
      if (state.table.MultiChannelSkill[res.queueUndealList[i]._id]) {
        Vue.set(state.table.MultiChannelSkill[res.queueAccessList[i]._id], 'waitClaim', res.queueAccessList[i].undealCount)
      }
    }
  },
  [types.INIT_MONITOR_AGENTS] (state, {agents}) {
    for (let i = 0; i < agents.length; i++) {
      agents[i].claim = 0
      agents[i].invitsession = 0
      agents[i].dealing = 0
      agents[i].autoClaim = false
      agents[i].mailAutoClaim = false // 邮件开关
      Vue.set(state.table.agentMonitor, agents[i]._id, agents[i])
    }
  },
  [types.INIT_MONITOR_IM_CHANNEL] (state, {config}) {
    for (let i = 0; i < config.length; i++) {
      config[i].newSession = 0
      config[i].accessSession = 0
      config[i].closeSession = 0
      config[i].robotSession = 0
      config[i].manualSession = 0
      config[i].robotToManualSession = 0
      if (config[i].nick_name) {
        // 如果是微信,特殊处理,因为字段名不同
        config[i].accessId = config[i]._id
        config[i].name = config[i].nick_name
        config[i].platform = 'weixin'
        config[i].ToPeer = config[i].to_peer
        Vue.set(state.table.MultiChannel, config[i]._id, config[i])
      } else {
        Vue.set(state.table.MultiChannel, config[i].accessId, config[i])
      }
    }
  },
  [types.INIT_MONITOR_ACCESSNO] (state, {res}) {
    for (let i = 0; i < res.agentList.length; i++) {
      Vue.set(state.table.agentMonitor[res.agentList[i]._id], 'claim', res.agentList[i].count)
      Vue.set(state.table.agentMonitor[res.agentList[i]._id], 'invitsession', res.agentList[i].invitsessionCount)
    }
    for (let i = 0; i < res.accessList.length; i++) {
      let accessId = res.accessList[i].accessId
      if (state.table.MultiChannel[accessId]) {
        if ('totalSessionCount' in res.accessList[i]) {
          Vue.set(state.table.MultiChannel[accessId], 'newSession', res.accessList[i].totalSessionCount)
        }
        if ('accessSessionCount' in res.accessList[i]) {
          Vue.set(state.table.MultiChannel[accessId], 'accessSession', res.accessList[i].accessSessionCount)
        }
        if ('finishSessionCount' in res.accessList[i]) {
          Vue.set(state.table.MultiChannel[accessId], 'closeSession', res.accessList[i].finishSessionCount)
        }
        if ('robotSessionCount' in res.accessList[i]) {
          Vue.set(state.table.MultiChannel[accessId], 'robotSession', res.accessList[i].robotSessionCount)
        }
        if ('manualSessionCount' in res.accessList[i]) {
          Vue.set(state.table.MultiChannel[accessId], 'manualSession', res.accessList[i].manualSessionCount)
        }
        if ('robotToManualSessionCount' in res.accessList[i]) {
          Vue.set(state.table.MultiChannel[accessId], 'robotToManualSession', res.accessList[i].robotToManualSessionCount)
        }
      }
    }
  },
  [types.EVENT_MONITOR_IM_CHANNEL] (state, {event, curAccess}) {
    if (!state.table.MultiChannel[event.accessId]) {
      if (curAccess) {
        if (curAccess.nick_name) {
          curAccess.accessId = curAccess._id
          curAccess.name = curAccess.nick_name
          curAccess.platform = 'weixin'
          curAccess.ToPeer = curAccess.to_peer
          Vue.set(state.table.MultiChannel, curAccess._id, curAccess)
        } else {
          Vue.set(state.table.MultiChannel, curAccess.accessId, curAccess)
        }
      }
    }
    if (!state.table.MultiChannel[event.accessId]) {
      let accessNo = {
        accessId: event.accessId,
        newSession: event.newSession,
        accessSession: event.accessSession,
        closeSession: event.closeSession,
        robotSession: event.robotSession,
        manualSession: event.manualSession,
        robotToManualSession: event.robotToManualSession
      }
      Vue.set(state.table.MultiChannel, event.accessId, accessNo)
    } else {
      Vue.set(state.table.MultiChannel[event.accessId], 'newSession', event.newSession)
      Vue.set(state.table.MultiChannel[event.accessId], 'closeSession', event.closeSession)
      Vue.set(state.table.MultiChannel[event.accessId], 'robotSession', event.robotSession)
      Vue.set(state.table.MultiChannel[event.accessId], 'manualSession', event.manualSession)
      Vue.set(state.table.MultiChannel[event.accessId], 'accessSession', event.accessSession)
      Vue.set(state.table.MultiChannel[event.accessId], 'robotToManualSession', event.robotToManualSession)
    }
  },
  [types.EVENT_MONITOR_IM_AGENT] (state, {event}) {
    let agent
    if (!state.table.agentMonitor[event._id]) {
      agent = {
        _id: event._id,
        claim: event.claim,
        invitsession: event.invitsession,
        dealing: event.dealing,
        autoClaim: event.autoClaim,
        mailAutoClaim: event.mailAutoClaim
      }
      Vue.set(state.table.agentMonitor, event._id, agent)
    } else {
      Vue.set(state.table.agentMonitor[event._id], 'claim', event.claim)
      Vue.set(state.table.agentMonitor[event._id], 'invitsession', event.invitsession)
      Vue.set(state.table.agentMonitor[event._id], 'dealing', event.dealing)
      Vue.set(state.table.agentMonitor[event._id], 'autoClaim', event.autoClaim)
      // Vue.set(state.table.agentMonitor[event._id], 'mailAutoClaim', event.mailAutoClaim)
    }
    Vue.set(state, 'agentStateChange', {random: Math.random(), userId: event._id})
  },

  [types.EVENT_MONITOR_IM_QUEUE] (state, {event, curQueue}) {
    if (!state.table.MultiChannelSkill[event.queueExten]) {
      if (curQueue) {
        Vue.set(state.table.MultiChannelSkill, curQueue.Exten, curQueue)
      }
    }
    if (state.table.MultiChannelSkill[event.queueExten]) {
      Vue.set(state.table.MultiChannelSkill[event.queueExten], 'manualSession', event.manualSession)
      Vue.set(state.table.MultiChannelSkill[event.queueExten], 'waitClaim', event.waitClaim)
    }
  },
  [types.EVENT_MONITOR_MAIL] (state, {event}) {
    let agent
    if (!state.table.agentMonitor[event._id]) {
      agent = {
        _id: event._id,
        claim: event.claim,
        dealing: event.dealing,
        mailAutoClaim: event.mailAutoClaim // 邮件开关
      }
      Vue.set(state.table.agentMonitor, event._id, agent)
    } else {
      Vue.set(state.table.agentMonitor[event._id], 'mailAutoClaim', event.mailAutoClaim)
    }
    Vue.set(state, 'agentStateChange', {random: Math.random(), userId: event._id})
  },
  [types.TABLEHEADER_AGENT] (state, {data}) {
    data.Config.splice(0, 4)
    Vue.set(state.tableHeader, 'agent', data)
  },
  [types.UPDATE_CLAIM_STATUS] (state, {user, status}) {
    if (state.table.agentMonitor && state.table.agentMonitor[user]) {
      Vue.set(state.table.agentMonitor[user], 'autoClaim', status)
    }
  },
  [types.AGENT_STATE_CHANGE] (state, userId) {
    Vue.set(state, 'agentStateChange', {random: Math.random(), userId: userId})
  }
}
