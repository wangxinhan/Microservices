import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  customerList: {
    customer_my: {
    },
    customer_plan: {
    },
    customer_all: {
    }
  },
  current: {// 当前客户相关信息
    customer_my: {
    },
    customer_plan: {// 同上
    },
    customer_all: {// 同上
    }
  },
  quickSearchList: {
    list: [],
    count: 0
  },
  transCache: { // 快捷、高级项、客户资料编辑项等
    refreshLeft: '',
    emptyRight: '',
    status: [], // 快搜客户模块为客户状态数组对象，高级搜索等
    publicSea: [], // 公海数组对象，高级搜索等
    dataSource: [], // 数据来源数组对象，高级搜索等
    provinceCityList: [], // 省市数组对象
    fields: []// 客户自定义字段
  },
  temp: {}
}
export default {
  state,
  getters,
  actions,
  mutations
}
