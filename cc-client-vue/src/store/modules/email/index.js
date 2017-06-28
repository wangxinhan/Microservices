import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
  todoNum: 0, // 处理中的邮件数
  isOn: false,
  queueNum: 0,
  menuNews: false,
  emailList: {
    email_todo: {
      init: false,
      list: [], // 列表
      count: 0 // 结果数量
    },
    email_all: {
      list: [], // 列表
      count: 0 // 结果数量
    }
  },
  autoCust: {}, // 邮件自动定位客户的
  current: {// 当前会话
    email_todo: {
      currentSession: {},
      currentSessionHistory: [],
      currentCustomer: {},
      sysQuickReply: [], // 系统公用快捷回复
      customQuickReply: {}, // 自定义快捷回复
      allQuickReply: [] // 全部快捷回复
    },
    email_all: {// 同上
      currentSession: {},
      currentSessionHistory: [],
      currentCustomer: {}
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
