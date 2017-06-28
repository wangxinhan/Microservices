import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  business: {
    waiting: 0, // 待处理
    todayDeal: 0, // 当日处理
    monthDeal: 0 // 当月处理
  },
  top10list: {
    todayTop10: {
      imTop10: [],
      cdrTop10: [],
      mailTop10: [],
      businessTop10: []
    },
    monthTop10: {
      imTop10: [],
      cdrTop10: [],
      mailTop10: [],
      businessTop10: []
    }
  },
  summaryList: {
    todayCdrData: {
      all: 0,
      complete: 0
    },
    monthCdrData: {
      all: 0,
      complete: 0
    },
    todayInternetData: {
      all: 0,
      complete: 0
    },
    monthInternetData: {
      all: 0,
      complete: 0
    },
    todayWxData: {
      all: 0,
      complete: 0
    },
    monthWxData: {
      all: 0,
      complete: 0
    },
    todayAppData: {
      all: 0,
      complete: 0
    },
    monthAppData: {
      all: 0,
      complete: 0
    },
    todayMailData: {
      all: 0,
      complete: 0
    },
    monthMailData: {
      all: 0,
      complete: 0
    }
  },
  planningList: [
  ]
}
export default {
  state,
  actions,
  getters,
  mutations
}
