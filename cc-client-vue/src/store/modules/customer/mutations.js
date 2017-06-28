import Vue from 'vue'
import * as types from './mutation-types'
// import {deepClone} from '../../../utils/m7Utils'

export default {
  [types.QUERY_CUSTOMER_LIST] (state, { data, type }) {
    state.customerList[type] = data
  },
  [types.QUERY_CUSTOMER_QUICK_SEARCH_LIST] (state, { data }) {
    state.quickSearchList = data
  },
  [types.UPDATE_CUSTOMER_QUICK_SEARCH] (state, { data }) {
    for (let i = 0; i < state.quickSearchList.list.length; i++) {
      if (state.quickSearchList.list[i]._id === data._id) {
        if (data.menu === 'customer_my') {
          data.menuName = '我的客户'
        } else if (data.menu === 'customer_plan') {
          data.menuName = '联系计划'
        } else if (data.menu === 'customer_all') {
          data.menuName = '全部'
        }
        data.displayName = state.quickSearchList.list[i].displayName
        Vue.set(state.quickSearchList.list, i, data)
      }
    }
  },
  [types.REFRESH_LEFT] (state) {
    Vue.set(state.transCache, 'refreshLeft', Math.random())
  },
  [types.EMPTY_RIGHT] (state) {
    Vue.set(state.transCache, 'emptyRight', Math.random())
  }
}
