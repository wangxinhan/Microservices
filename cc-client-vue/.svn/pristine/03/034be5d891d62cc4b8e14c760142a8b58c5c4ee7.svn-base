import * as types from './mutation-types'
import Vue from 'vue'
import { filter } from 'lodash'
export default {
  [types.SET_TOP10_LIST] (state, {reportData, agents}) {
    reportData.todayTop10.imTop10.forEach((data) => {
      let agentId = data._id
      let agent = filter(agents, {_id: agentId})
      data.name = agent.length > 0 ? agent[0].displayName : ''
    })
    reportData.todayTop10.mailTop10.forEach((data) => {
      let agentId = data._id
      let agent = filter(agents, {_id: agentId})
      data.name = agent.length > 0 ? agent[0].displayName : ''
    })
    // reportData.todayTop10.cdrTop10.forEach((data) => {
    //  let agentId = data._id
    //  let agent = filter(agents, {_id: agentId})
    //  data.name = agent[0].displayName
    // })
    reportData.todayTop10.businessTop10.forEach((data) => {
      let agentId = data._id
      let agent = filter(agents, {_id: agentId})
      data.name = agent.length > 0 ? agent[0].displayName : ''
    })
    reportData.monthTop10.imTop10.forEach((data) => {
      let agentId = data._id
      let agent = filter(agents, {_id: agentId})
      data.name = agent.length > 0 ? agent[0].displayName : ''
    })
    reportData.monthTop10.mailTop10.forEach((data) => {
      let agentId = data._id
      let agent = filter(agents, {_id: agentId})
      data.name = agent.length > 0 ? agent[0].displayName : ''
    })
    reportData.monthTop10.cdrTop10.forEach((data) => {
      let agentId = data._id
      let agent = filter(agents, {_id: agentId})
      data.name = agent.length > 0 ? agent[0].displayName : ''
    })
    reportData.monthTop10.businessTop10.forEach((data) => {
      let agentId = data._id
      let agent = filter(agents, {_id: agentId})
      data.name = agent.length > 0 ? agent[0].displayName : ''
    })

    Vue.set(state, 'top10list', reportData)
  },
  [types.SET_CONTACT_PLANLIST] (state, {noteList}) {
    let planningList = []
    noteList.forEach(note => {
      let plan = {}
      plan.remark = note.action
      plan.customer = note.name
      plan.time = note.notifyTime
      plan._id = note._id
      planningList.push(plan)
    })
    Vue.set(state, 'planningList', planningList)
  },
  [types.SET_BUSINESS_UNDEALCOUNT] (state, {undealCount}) {
    Vue.set(state.business, 'waiting', undealCount)
  },
  [types.SET_BUSINESS_DATA] (state, {business}) {
    Vue.set(state.business, 'todayDeal', business.todayDeal)
    Vue.set(state.business, 'monthDeal', business.monthDeal)
  },
  [types.SET_AGENT_MULTICHANNEL_DATA] (state, {summaryList}) {
    // delete summaryList.monthCdrData
    delete summaryList.todayCdrData
    Vue.set(state, 'summaryList', summaryList)
  }
}
