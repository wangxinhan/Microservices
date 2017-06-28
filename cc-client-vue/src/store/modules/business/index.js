import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  roleNum: 0, // 待领取的工单数
  total: 0, // 我的待处理工单数
  noReadNum: 0, // 我未读的工单数
  businessData: {},
  businessCondition: {},
  businessList: {
    list: [],
    count: 0
  },
  current: {
    currentCustomer: {},
    businessInfo: {},
    businessAction: {}
  },
  transCache: {// 公共
    businessTypes: [],
    refreshCustomerBusinessHistory: {},
    closeBusinessRight: true,
    refreshLeft: '',
    refreshBusRight: ''
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
