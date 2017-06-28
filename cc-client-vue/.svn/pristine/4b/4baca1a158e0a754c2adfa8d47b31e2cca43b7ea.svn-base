import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

//  const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  load: false,
  webchatList: {
    webchat_todo: {
      init: false,
      list: [], // 列表
      count: 0 // 结果数量
    },
    webchat_all: {
      list: [], // 列表
      count: 0 // 结果数量
    }
  },
  autoCust: {},
  onlineAgents: [],
  isOn: true,
  queueNum: 0,
  todoNum: 0, // 待处理数
  menuNews: false,
  onTimeSearch: false, // 是否处于时间检索中
  currentUser: {},
  current: {// 当前会话
    shwoInvite: {},
    webchat_todo: {
      currentOpenSession: '',
      showRightDetail: true,
      shwoInviteBtn: true,
      kickInvitedFlag: false,
      invitedFlag: false,
      inviteUserName: '',
      inviteSessionId: '',
      currentSession: {},
      messageList: {},
      currentCustomer: {},
      chatInfoById: {},
      todoShowConfig: {},
      sysQuickReply: [], // 系统公用快捷回复
      customQuickReply: {}, // 自定义快捷回复
      allQuickReply: {
        list: [],
        flag: true
      }, // 全部快捷回复
      visitInfoList: {}, // 访问信息
      ubaInfoList: {}, // 浏览轨迹
      historyMsgList: {},
      timerList: [],
      funTabInfo: {} // Funtab记录
    },
    webchat_all: {// 同上
      messageList: [],
      currentSession: {},
      currentCustomer: {},
      chatInfoById: {},
      todoShowConfig: {},
      historyMsgList: [],
      visitInfoList: {} // 访问信息
    }
  },
  inviteUbaSessionList: { // 主动会话列表
    list: []
  },
  transCache: {// 公共
    closeWebchatRight: true,
    // 在线咨询知识库搜索
    setImSearchValue: {
      value: '',
      random: ''
    },
    // 点击搜索到的文本复制到发送框
    copyImSearchValue: {
      value: '',
      random: ''
    },
    qualityCheck: {
      messageList: [],
      page: '',
      finishChatScroll: false
    }
  // },
  // isinviteVideo: false,
  // isVideoing: false,
  // videoChatData: {
  //   videoSessionid: '',
  //   videoToken: '',
  //   videoUsername: ''
  // },
  // videoInvitedData: {
  //   videoInviteUsername: '',
  //   videoInviteToken: '',
  //   videoInviteSessionid: ''
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
