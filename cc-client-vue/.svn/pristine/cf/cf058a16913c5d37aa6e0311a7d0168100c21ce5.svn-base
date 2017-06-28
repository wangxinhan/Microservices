import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  cti: {// 软电话条其他数据
  },
  agentStateChange: {random: '', userId: ''},
  currentCustInfo: {},
  globalLet: {// 全局变量
    callScreen: '',
    callCustomerDetail: {},
    screenCallSheetId: '',
    callFlag: false,
    limits: 0,
    phone_data: {},
    _cti_url: '',
    _cti_currentState: 0,
    _cti_preState: 0,
    _cti_reconnection_count: 0,
    _cti_is_waiting_event: false,
    _cti_unregister: 0,
    _cti_peerstate: 1,
    _cti_dialing: 2,
    _cti_innerDialing: 3,
    _cti_belling: 4,
    _cti_innerBelling: 5,
    _cti_listening: 6,
    _cti_talking: 7,
    _cti_threeWayTalking: 8,
    _cti_innerTalking: 9,
    _cti_dialTalking: 10,
    _cti_listened: 11,
    _cti_transferBelling: 12,
    _cti_transferDialing: 13,
    _cti_transfer: 14,
    _cti_dialoutTransfer: 15,
    _cti_hold: 16,
    _cti_systemBusy: 99,
    _cti_linked: false,
    _cti_stateBeforeHold: '',
    _cti_extenState: '',
    investigatelist: [],
    ivrMenu: [],
    waitSate: {
      Exten: '',
      isTransfer: false,
      time: ''
    },
    showTransferCancelDialog: false,
    showTransferDialog: false,
    showConsultDialog: false,
    calleeArea: '',
    callingNum: '',
    _cti_stateDescription: ['unregister', 'peerstate', 'dialing', 'innerDialing', 'belling', 'innerBelling', 'listening', 'talking', 'threeWayTalking', 'innerTalking', 'dialTalking', 'listened', 'transferBelling', 'transferDialing', 'transfer', 'dialTransfer', 'hold'],
    _phone_peersFromSip: {},
    phone_peers: {},
    phone_queues: {},
    phone_serviceNos: {},
    phone_accountCalls: {},
    _cti_isSettingbusy: false,
    _cti_isRelogin: false,
    _cti_showNumber: false,
    _cti_extenType: '',
    phone_pbxs: {},
    _phone_callObject: {},
    _cti_isInvestigatting: false,
    _cti_ui_countTimer: 0,
    _cti_ui_calculagraph: '',
    _cti_ui_otherstateref: '',
    _cti_ui_curstateref: '',
    _cti_ui_timestateref: '',
    _cti_ui_callstateref: '',
    _softphone_phonestate_dropdown: '',
    _cti_ui_dialogBoxRemain: 40000,
    _cti_ui_notifyDialogInterval: '',
    softphonebar_count: 0,
    _cti_ui_monitorTimersHandle: '',
    _cti_ui_monitorTimers: [],
    _cti_ui_peer_index: 0,
    _cti_ui_queue_index: 0,
    _cti_ui_serviceNo_index: 0,
    _cti_ui_all_queue_obj: {},
    _cti_ui_last_state: '',
    mtime: '00:00:00',
    busyType: '',
    busyTypeName: {
    },
    _cti_ui_desc: {
      unregister: '未连接',
      peerstate: '空闲',
      dialing: '呼叫中',
      innerDialing: '呼叫中',
      belling: '来电振铃',
      innerBelling: '来电振铃',
      listening: '监听振铃',
      talking: '普通通话',
      threeWayTalking: '三方通话',
      innerTalking: '内部通话',
      dialTalking: '外呼通话',
      listened: '监听中',
      hold: '保持',
      consultTalking: '普通通话',
      dialTransfer: '外呼转接通话',
      transfer: '转接通话',
      offline: '离线接听',
      ready: '签出',
      transferBelling: '转接振铃',
      transferDialing: '转接振铃'
    },
    _cti_phoneBar_state: {
      unregister: {
        dialout: false,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true
      },
      peerstate: {
        dialout: true,
        transfer: false,
        hold: false,
        threeway: false,
        consult: false,
        sms: true,
        ivrMenu: false
      },
      dialing: {
        hangup: true,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true,
        setCallLabel: true
      },
      innerDialing: {
        hangup: true,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true
      },
      belling: {
        dialout: false,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true
      },
      innerBelling: {
        dialout: false,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true
      },
      transferBelling: {
        dialout: false,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true
      },
      transferDialing: {
        dialout: false,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true
      },
      listening: {
        hangup: true,
        sms: true
      },
      talking: {
        hangup: true,
        transfer: true,
        hold: true,
        threeway: false,
        ivrMenu: true,
        consult: true,
        Investigate: true,
        sms: true,
        setCallLabel: true
      },
      threeWayTalking: {
        hangup: true,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true,
        setCallLabel: true
      },
      innerTalking: {
        hangup: true,
        transfer: false,
        hold: false,
        threeway: false,
        sms: true
      },
      dialTalking: {
        hangup: true,
        transfer: true,
        ivrMenu: true,
        hold: true,
        threeway: false,
        consult: true,
        Investigate: true,
        sms: true,
        setCallLabel: true
      },
      listened: {
        hangup: true,
        sms: true
      },
      hold: {
        dialout: false,
        recover: true,
        transfer: false,
        threeway: false,
        sms: true
      },
      consultTalking: {
        consultThreeWayCall: true,
        consultTransfer: true,
        stopConsult: true,
        hangup: true,
        sms: true,
        setCallLabel: true
      },
      transfer: {
        hangup: true,
        hold: true,
        transfer: true,
        consult: true,
        Investigate: true,
        ivrMenu: true,
        sms: true,
        threeway: false,
        setCallLabel: true
      },
      dialTransfer: {
        hangup: true,
        hold: true,
        transfer: true,
        consult: true,
        Investigate: true,
        ivrMenu: true,
        sms: true,
        threeway: false,
        setCallLabel: true
      },
      currentCallSheetId: ''
    }
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}

