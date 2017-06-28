import * as types from './mutation-types'
import Vue from 'vue'

export default {
  [types.REFRESH_BUSINESS_UNDEALNUM] (state, data) {
    Vue.set(state, 'roleNum', data.roleNum)
    Vue.set(state, 'total', data.total)
    Vue.set(state, 'noReadNum', data.noReadNum)
  },
  [types.GET_ROLE_UNDEAL_BUSINESS] (state, data) {
    Vue.set(state, 'businessList', data)
  },
  [types.GET_UNDEAL_BUSINESS] (state, data) {
    Vue.set(state, 'businessList', data)
  },
  [types.GET_ASSIGNED_BUSINESS] (state, data) {
    Vue.set(state, 'businessList', data)
  },
  [types.GET_FOLLOWED_BUSINESS] (state, data) {
    Vue.set(state, 'businessList', data)
  },
  [types.QUERY_ALL_BUSINESS] (state, data) {
    Vue.set(state, 'businessList', data)
  },
  [types.GET_ALL_UNCOMPLETE_BUSINESS] (state, data) {
    Vue.set(state, 'businessList', data)
  },
  [types.GET_ALL_FINISHED_BUSINESS] (state, data) {
    Vue.set(state, 'businessList', data)
  },
  [types.GET_BUSINESS_DETAIL_BY_ID] (state, {data, tabType}) {
    Vue.set(state.current, 'businessInfo', data)
    // if (tabType === 'business_all') {
    //  state.businessList.list.forEach((item, index) => {
    //    if (item._id === data._id) {
    //      Vue.set(state.businessList.list, index, data)
    //    }
    //  })
    // }
  },
  [types.REMOVE_BUSINESS] (state, id) {
    state.businessList.list.forEach((item, index) => {
      if (item._id === id) {
        state.businessList.list.splice(index, 1)
        state.businessList.count = state.businessList.count - 1
      }
    })
  },
  [types.DELETE_BUSINESS] (state, data) {
    state.success = data
  },
  [types.GET_CUSTOMER_HISTORY_BUSINESS] (state, {data, type}) {
    Vue.set(state.current[type], 'businessHistory', data)
  },
  [types.EXPORT_BUSINESS] (state, {data, type}) {
    Vue.set(state.current[type], 'exportPath', data)
  },
  [types.SET_BUSINESS_FLOWS] (state, flows) {
    let data = []
    flows.forEach((item) => {
      data.push({_id: item._id, name: item.name})
    })
    Vue.set(state.transCache, 'businessTypes', data)
  },
  [types.ADD_BUSINESS_ACTION_HISTORY] (state, data) {
    let newHistory = state.current.businessAction[data.data.businessId]['history']
    if (newHistory) {
      newHistory.unshift(data.data)
      Vue.set(state.current.businessAction[data.data.businessId], 'history', newHistory)
    }
  },
  [types.SET_BUSINESS_ACTION] (state, data) {
    Vue.set(state.current.businessAction, data._id, data)
  },
  [types.REFRESH_CUSTOMER_BUSINESS_HISTORY] (state, data) {
    Vue.set(state.transCache, 'refreshCustomerBusinessHistory', {random: Math.random(), customer: data})
  },
  [types.SET_BUSINESS_CONDITION] (state, data) {
    Vue.set(state, 'businessCondition', data)
  },
  [types.CHANGE_BUSINESS_MASTER] (state, data) {
    if (state.current.businessAction[data._id]) {
      let business = state.current.businessAction[data._id]
      business.master = data.master
      Vue.set(state.current.businessAction, data._id, business)
    }
    // state.businessList.list.forEach((item, index) => {
    //  if (item._id === data._id) {
    //    Vue.set(state.businessList.list[index], 'master', data.value)
    //  }
    // })
  },
  [types.CLOSE_BUSINESS_RIGHT] (state, data) {
    Vue.set(state.transCache, 'closeBusinessRight', data)
  },
  [types.REFRESH_LEFT] (state, data) {
    Vue.set(state.transCache, 'refreshLeft', data)
  },
  [types.REFRESH_BUS_RIGHT] (state, data) {
    Vue.set(state.transCache, 'refreshBusRight', data)
  },
  [types.CHANGE_READ_STATUS] (state, data) {
    state.businessList.list.forEach((item, index) => {
      if (item._id === data) {
        state.businessList.list[index].isRead = true
        Vue.set(state.businessList, 'list', state.businessList.list)
      }
    })
  }
}
