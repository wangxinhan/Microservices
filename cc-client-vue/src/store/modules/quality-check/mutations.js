import * as types from './mutation-types'
import Vue from 'vue'
export default {
  [types.QCLIST] (state, data) {
    Vue.set(state, 'queryGradeList', data)
  },
  [types.CLEAR_LIST] (state, data) {
    Vue.set(state, 'queryGradeList', {page: 0, pageSize: 10, list: [], sessionList: [], count: 0})
  },
  [types.QCRESULT] (state, data) {
    Vue.set(state, 'queryGradeResult', data)
  },
  [types.AGENT_RANKING] (state, data) {
    Vue.set(state, 'agentRanking', data)
  },
  [types.SEARCHLIST] (state, data) {
    Vue.set(state, 'searchList', data)
  },
  [types.TEMPLIST] (state, {list, concat}) {
    if (concat) {
      state.tempList = state.tempList.concat(list)
    } else {
      Vue.set(state, 'tempList', list)
    }
  },
  [types.RANDOM_TEMPLETE] (state, data) {
    let rt = {}
    data.forEach(item => {
      rt[item._id] = item
    })
    state.randomTemplete = rt
  },
  [types.WEBCHAT_DETAIL] (state, data) {
    state.currentWebchatDetail = data
  },
  [types.GRADE_SUCCESS] (state, data) {
    // state.currentWebchatDetail = {}
    // let tempList = state.searchList.list.filter(obj => obj._id !== data)
    // state.searchList.list = tempList
  },
  [types.RECORD_LIST] (state, data) {
    Vue.set(state, 'recordList', data)
  },
  [types.SINGLE_LABEL_CHANGE] (state) {
    Vue.set(state, 'singleLabelChange', Math.random())
  },
  [types.DELETE_GRADED] (state, data) {
    state.tempList.splice(0, data)
  },
  [types.QUALITYTASK] (state, data) {
    Vue.set(state, 'qualityTaskTemplate', data)
  },
  [types.QCTABLETITLE] (state, data) {
    Vue.set(state, 'queryQualityCheckedtabletitle', data)
  },
  [types.QCCYCLESELECTDATA] (state, data) {
    Vue.set(state, 'queryQualityCheckedCycle', data)
  }
}
