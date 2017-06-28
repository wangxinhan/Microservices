import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  searchList: {
    page: 0,
    pageSize: 10,
    list: [],
    count: 0
  },
  agentRanking: {
    rankingagenthtml: []
  },
  queryGradeList: { // 质检结果查询
    page: 0,
    pageSize: 10,
    list: [],
    sessionList: [],
    count: 0
  },
  queryGradeResult: { // 质检座席查询
    page: 0,
    pageSize: 10,
    list: [],
    count: 0
  },
  tempList: [],
  currentWebchatDetail: {}, // 当前在线咨询评分会话详情
  randomTemplete: {}, // 随机抽取模板
  qualityTaskTemplate: {}, // 质检任务监测模板
  queryQualityCheckedtabletitle: [], // 质检周期查询  质检模板
  queryQualityCheckedCycle: [], // 质检周期查询  周期下拉框数据
  singleLabelChange: ''
}
export default {
  state,
  getters,
  actions,
  mutations
}
