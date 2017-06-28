import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  callList: {
    cdr_call: {
    },
    cdr_my: {
    },
    cdr_all: {
    }
  },
  current: {// 当前通话记录信息
    cdr_call: {
    },
    cdr_my: {
      callInfo: {},                // 通话记录信息
      callLabelOpHistory: [],    // 通话标签操作日志
      cdrExcelDownloadPath: '',    // 导出通话记录excel文件下载地址
      callStatus: '' // 当前通话记录中的状态
    },
    cdr_all: {// 同上
      callInfo: {},                // 通话记录信息
      callLabelOpHistory: [],    // 通话标签操作日志
      cdrExcelDownloadPath: '', // 导出通话记录excel文件下载地址
      callStatus: '' // 当前通话记录中的状态
    }
  },
  transCache: {// 公共
    callLabelType: '',            // 通话标签类型 single 单级标签，multi 多级标签
    multiLabel: {}, // 多级标签
    singleLabel: {}, // 单标签
    megNum: '',
    showKeyTagArr: []
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
