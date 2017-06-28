import * as types from './mutation-types'
import * as gtypes from '../../mutation-types'
import report from '../../api/report'
import customer from '../../api/customer'

/**
 * 获取工作台,座席工作量数据,包括top10, 当前座席的多渠道处理数
 */
export const queryAgentMultiChannelData = ({rootState, commit, dispatch}) => {
  let data = {}
  data.account = rootState.session.user.account
  data.agentId = rootState.session.user._id
  return report.queryAgentMultiChannelData(data).then(response => {
    if (response.success) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response.message || 'default_tips')
    }
  }).then((response) => {
    commit(types.SET_BUSINESS_DATA, {business: response.business})
    commit(types.SET_AGENT_MULTICHANNEL_DATA, {summaryList: response.summaryList})
    return dispatch('getCache', {type: 'agents'}).then(agents => {
      commit(types.SET_TOP10_LIST, {reportData: response.top10list, agents: agents})
    })
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, err)
  })
}

/**
 * 获取联系计划,工单待处理数
 */
export const queryPlanningList = ({commit, rootState}) => {
  return customer.queryWorkbenchContactPlan({}).then(response => {
    if (response.success) {
      commit(types.SET_CONTACT_PLANLIST, {noteList: response.dateList})
      commit(types.SET_BUSINESS_UNDEALCOUNT, {undealCount: response.busToDeal})
    } else {
      commit(gtypes.SET_ERROR, response.message || 'default_tips')
    }
  }).catch(err => {
    console.log(err)
    commit(gtypes.SET_ERROR, err)
  })
}
