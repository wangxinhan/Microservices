import * as callTypes from '../call/mutation-types'
import * as types from './mutation-types'
import * as globalTypes from '../../mutation-types'
import cti from '../../api/cti'
import {getCache} from '../../actions'
import {startWith} from '../../../utils/m7Utils'
import * as monitorAction from '../monitor/actions'
import call from '../../api/call'
// import customer from '../../api/customer'
import user from '../../api/user'

export const ctiRegister = ({commit, state, rootState, dispatch}, config) => {
  commit(types.CTI_URL, config.proxy_url)
  let phoneJson = {
    Command: 'Action',
    Action: 'Login',
    ActionID: 'Login' + Math.random(),
    ExtenType: config.extenType,
    Password: config.password,
    BusyType: config.busyType,
    Monitor: config.monitor,
    User: config.user,
    AppVersion: 'service'
  }
  if ((rootState.session.user.isAdmin && rootState.session.user.isAdmin === true) || rootState.session.phoneTokenInUse === true) {
    phoneJson = {
      Command: 'Action',
      Action: 'Login',
      ActionID: 'Login' + Math.random(),
      PBX: config.curPbx,
      Account: rootState.session.account.account,
      Password: '7pu3refwds98172e',
      UserID: '2387rufhinjvcx73rfws',
      MonitorUser: true
    }
    config.userId = '2387rufhinjvcx73rfws'
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (!_response.Succeed) {
        let code = _response.Result
        if (code) {
         // commit(types.CODE, code)
          if (code === 601) {
            commit(globalTypes.SET_EXIT, 'cti.agentmaxOroverdue')
            // commit(globalTypes.LOGINED, false)
          } else if (code === 602) {
            commit(globalTypes.SET_EXIT, 'cti.agentmaxOroverdueUserTypeLogin')
            // commit(globalTypes.LOGINED, false)
            window.location = document.location.href
          } else if (code === 500) {
            if (config.extenType === 'Local') {
              commit(globalTypes.SET_EXIT, 'cti.unBindPhone')
            // commit(globalTypes.LOGINED, false)
            } else {
              commit(globalTypes.SET_EXIT, 'cti.unBindGateway')
            }
          } else if (code === 406) {
            commit(globalTypes.SET_EXIT, 'cti.systemVersionError')
            // commit(globalTypes.LOGINED, false)
          } else {
            if (code === '400') {
              commit(globalTypes.SET_EXIT, 'cti.loginError')
            // commit(globalTypes.LOGINED, false)
            }
          }
        }
      } else if (_response.SessionID) {
        config.uniqueId = _response.SessionID
        let date = new Date()
        let identity = date.valueOf()
        config.currentServerTime = identity - _response.Timestamp * 1000
        config.phonebarConfig = _response.PhonebarConfig
        config.autoBusyTime = _response.AutoBusyTime
        if (_response.UserID) {
          config.userId = _response.UserID
        }
        if (_response.PBX) {
          config.pbx_in_ip = _response.PBX
        }
        if (_response.Account) {
          config.accountId = _response.Account
        }
        config.loginName = config.User || config.user
        config.sipNo = _response.SipNum
        config.monitorUser = _response.MonitorUser
        config.monitorPassword = _response.MonitorPassword
        // cti-ui.src.js  softphonebar_init()
        ctiInit(commit, state, config)
        // ctiWaitEvent(commit, state, rootState, dispatch)
        dispatch('ctiWaitEvent')
        if (rootState.session.user.channelMail === false || rootState.session.user.channelWx === false) {
          let _d1 = {}
          if (rootState.session.user.channelMail === false) {
            _d1.channelMail = false
          } else {
            _d1.channelMail = true
          }
          if (rootState.session.user.channelWx === false) {
            _d1.channelWx = false
          } else {
            _d1.channelWx = true
          }
          syncChannelSet(_d1, function () {})
        }
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'cti.requestTimeout')
      dispatch('ctiWaitEvent')
    })
}

function ctiInit (commit, state, config) {
  let phoneData = {
    uniqueId: config.uniqueId,
    currentServerTime: config.currentServerTime,
    autoBusyTime: config.autoBusyTime,
    userId: config.userId,
    pbx_in_ip: config.pbx_in_ip,
    accountId: config.accountId,
    loginName: config.loginName,
    sipNo: config.sipNo,
    monitor: config.monitor,
    user: config.user,
    password: config.password,
    extenType: config.extenType,
    busyType: config.busyType,
    monitorUser: config.monitorUser,
    monitorPassword: config.monitorPassword,
    exten: config.exten
  }
  phoneData.phonebarConfig = {}
  if (config.phonebarConfig) {
    let peerstates = config.phonebarConfig.split(',')
    for (let i = 0; i < peerstates.length; i++) {
      phoneData.phonebarConfig[peerstates[i].split(':')[0]] = peerstates[i].split(':')[1]
    }
  }
  commit(types.BUSYTYPENAME, phoneData.phonebarConfig)
  commit(types.PHONE_DATA, {phoneData: phoneData})
  commit(types.CTI_CURRENTSTATE, state.globalLet._cti_unregister)
  phonePublishEvent(commit, state, 'toolbarupdate', state.globalLet._cti_stateDescription[state.globalLet._cti_currentState], '')
}

export const ctiWaitEvent = ({commit, state, rootState, dispatch}) => {
  if (state.globalLet._cti_is_waiting_event) {
    return
  }
  commit(types.CTI_IS_WAITING_EVENT, true)
  let phoneJson = {
    Command: 'Action',
    Action: 'GetState',
    ActionID: 'GetState' + Math.random(),
    SessionID: state.globalLet.phone_data.uniqueId,
    User: state.globalLet.phone_data.userId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      commit(types.CTI_RECONNECTION_COUNT, 0)
      //  _cti_display('')
      if (!response) {
        return
      }
      let datas = response
      let _response = datas.Response
      if (typeof _response !== 'object') {
        _response = datas
      }
      if (_response.Succeed && !_response.HasEvent) {
      } else if (!_response.Succeed) {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
          commit(types.CTI_IS_WAITING_EVENT, false)
          return
        }
      } else {
        if (_response.Kick) {
          let comments = ''
          if (_response.Comments) {
            comments = _response.Comments
          }
          if (comments === 'ukick' || comments === 'ekick') {
            commit(globalTypes.SET_EXIT, 'cti.sessionInvalidation1')
          } else {
            commit(globalTypes.SET_EXIT, 'cti.sessionInvalidation2')
          }
          commit(globalTypes.LOGINED, false)
         // window.location = './'
          return
        } else {
          let events = datas.Event
          if (events != null) {
            ctiEventHandler(events, false, state, commit, rootState, dispatch)
          }
        }
      }
      commit(types.CTI_IS_WAITING_EVENT, false)
      // ctiWaitEvent(commit, state, rootState, dispatch)
      setInterval(function () {
        dispatch('ctiWaitEvent')
      }, 10)
    }).catch(() => {
      commit(types.CTI_IS_WAITING_EVENT, false)
      window.setTimeout(function () {
        let count = state.globalLet._cti_reconnection_count
        let currentCount = count + 1
        if (currentCount > 3) { // 请求超过3次
          commit(globalTypes.SET_ERROR, 'cti.connectServiceTimeout')
        }
        commit(types.CTI_RECONNECTION_COUNT, currentCount)
        // ctiWaitEvent(commit, state, rootState, dispatch)
        dispatch('ctiWaitEvent')
      }, 1000)
    })
}

function ctiEventHandler (evtJsons, isMonitorOnly, state, commit, rootState, dispatch) {
  for (let i = 0; i < evtJsons.length; i++) {
    ctiNewEvent(evtJsons[i], isMonitorOnly, state, commit, rootState, dispatch)
  }
}

function ctiNewEvent (evtJson, isMonitorOnly, state, commit, rootState, dispatch) {
  if (!isMonitorOnly) {
    ctiStateProcess(evtJson, state, commit, dispatch)
  }
  monitorAction.ctiMonitorProcess(evtJson, state, commit, rootState, dispatch)
}

function ctiStateProcess (evtJson, state, commit, dispatch) {
  if (evtJson.Event === 'RecycleNewMail') {
    // handler.callMail.emailItemRemove(evtJson);
    return
  } else if (evtJson.Event === 'NewWebchat') {
    return
  }

  if (evtJson.Event === 'taskCreate') {
    // handler.task.taskCreateEvtHandler(evtJson)
    return
  } else if (evtJson.Event === 'taskComplete') {
    // handler.task.taskCompleteEvtHandler(evtJson)
    return
  } else if (evtJson.Event === 'custAssign') {
    // handler.customer.custAssignEvtHandler(evtJson)
    return
  } else if (evtJson.Event === 'businessAssignRole') {
    // handler.business.busAssignRoleEvtHandler(evtJson)
    return
  } else if (evtJson.Event === 'businessAssign') {
    // handler.business.busAssignEvtHandler(evtJson)
    return
  }

  ctiSuper(evtJson, state, commit, dispatch)
  switch (state.globalLet._cti_currentState) {
    case state.globalLet._cti_unregister:
      if (evtJson.Event === 'PeerStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.PeerStatus === 'Registered') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            ctiUpdate(evtJson, state, commit, dispatch)
          }
        }
      } else if (evtJson.Event === 'UserStatus') {
        if (state.globalLet.phone_data.userId === evtJson.UserID) {
          if (state.globalLet.phone_data.sipNo !== evtJson.SipNum) {
            if (evtJson.PeerStatus === 'Registered') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_peerstate:
      if (evtJson.Event === 'UserBusy') {
        if (state.globalLet.phone_data.userId === evtJson.UserID) {
          commit(types.PHONE_DATA, {phoneData: {busyType: evtJson.BusyType}})
          commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
          ctiUpdate(evtJson, state, commit, dispatch)
        }
      } else if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Ringing') {
            if (evtJson.LinkedChannel.ChannelType === 'normal') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_belling)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'inner') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_innerBelling)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'transfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_transferBelling)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'dialTransfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_transferDialing)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          } else if (evtJson.ChannelStatus === 'Ring') {
            if (evtJson.ChannelType === 'dialout') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_dialing)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.ChannelType === 'inner') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_innerDialing)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.ChannelType === 'listen') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_listening)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'normal') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_talking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'threeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'inner') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_innerTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'dialout') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_dialTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'transfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_transfer)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'dialTransfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_dialoutTransfer)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          } else if (evtJson.ChannelStatus === 'Up') {
            if (evtJson.ChannelType === 'listen') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_listened)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      } else if (evtJson.Event === 'PeerStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.PeerStatus !== 'Registered') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_unregister)
            ctiUpdate(evtJson, state, commit, dispatch)
          }
        }
      }
      break
    case state.globalLet._cti_dialing:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.ChannelType === 'dialout') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_dialTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_innerDialing:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.ChannelType === 'inner') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_innerTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_belling:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'normal') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_talking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'threeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'transfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_transfer)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'dialTransfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_dialoutTransfer)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_innerBelling:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'threeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'inner') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_innerTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_listening:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Up') {
            if (evtJson.ChannelType === 'listen') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_listened)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_talking:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'ThreeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_transfer:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'ThreeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_dialoutTransfer:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'ThreeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_threeWayTalking:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          }
        }
      }
      break
    case state.globalLet._cti_innerTalking:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          }
        }
      }
      break
    case state.globalLet._cti_dialTalking:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'ThreeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_listened:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          }
        }
      }
      break
    case state.globalLet._cti_transferBelling:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'normal') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_talking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'threeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'transfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_transfer)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'dialTransfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_dialoutTransfer)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
    case state.globalLet._cti_transferDialing:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          if (evtJson.ChannelStatus === 'Hangup') {
            commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
            commit(types.CTI_SHOWNUMBER, false)
            ctiUpdate(evtJson, state, commit, dispatch)
          } else if (evtJson.ChannelStatus === 'Link') {
            if (evtJson.LinkedChannel.ChannelType === 'normal') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_talking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'threeWayCall') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_threeWayTalking)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'transfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_transfer)
              ctiUpdate(evtJson, state, commit, dispatch)
            } else if (evtJson.LinkedChannel.ChannelType === 'dialTransfer') {
              commit(types.CTI_CURRENTSTATE, state.globalLet._cti_dialoutTransfer)
              ctiUpdate(evtJson, state, commit, dispatch)
            }
          }
        }
      }
      break
  }
}

function ctiSuper (evtJson, state, commit, dispatch) {
  if (evtJson.Event === 'UserStatus') {
    if (state.globalLet.phone_data.userId === evtJson.UserID) {
      commit(types.PHONE_DATA, {phoneData: {busyType: evtJson.BusyType}})
      if (state.globalLet.phone_data.sipNo !== evtJson.SipNum) {
        commit(types.PHONE_DATA, {phoneData: {sipNo: evtJson.SipNum}})
        if (evtJson.PeerStatus === 'Unregistered') {
          commit(types.CTI_CURRENTSTATE, state.globalLet._cti_unregister)
          ctiUpdate(evtJson, state, commit, dispatch)
        } else if (evtJson.PeerStatus === 'Registered') {
          commit(types.CTI_CURRENTSTATE, state.globalLet._cti_peerstate)
          ctiUpdate(evtJson, state, commit, dispatch)
        }
      }
    }
  } else if (evtJson.Event === 'UserBusy') {
    if (state.globalLet.phone_data.userId === evtJson.UserID) {
      commit(types.PHONE_DATA, {phoneData: {busyType: evtJson.BusyType}})
    }
  } else if (evtJson.Event === 'ChannelStatus') {
    if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
      if (evtJson.ChannelStatus === 'Unlink') {
        commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _callId: ''}})
      }
    }
  } else if (evtJson.Event === 'PeerStatus') {
    if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
      if (state.globalLet._cti_currentState !== state.globalLet._cti_peerstate) {
        return
      }
      if (state.globalLet.phone_data.busyType === state.globalLet._cti_systemBusy) {
        return
      }
      let peer = ctiGetUserFromSip(evtJson.Exten, state, commit)
      if (peer) {
        phonePublishEvent(commit, state, 'toolbarupdate', state.globalLet._cti_stateDescription[state.globalLet._cti_currentState], '')
      }
    }
  } else if (evtJson.Event === 'TransferSuccess' || evtJson.Event === 'TransferFailed') {
    evtJson.Type = 'Transfer'
    if (evtJson.Investigate) {
      evtJson.Type = 'Investigate'
    }
    phonePublishEvent(commit, state, 'transfering', evtJson.Event, '')
  } else if (evtJson.Event === 'IvrMenuEnd') {
    // phone_publishEvent('ivrMenuTransfering', [evtJson])
  }
}

function ctiUpdate (evtJson, state, commit, dispatch) {
  let timestamp = ''
  if (evtJson.Event === 'ChannelStatus') {
    if (evtJson.Timestamp) {
      timestamp = evtJson.Timestamp
    }
  } else if (evtJson.Event === 'UserStatus') {
    timestamp = (evtJson.Login ? (evtJson.BusyTimestamp) : '')
  } else if (evtJson.Event === 'UserBusy') {
    timestamp = evtJson.BusyTimestamp
  }
  phonePublishEvent(commit, state, 'toolbarupdate', state.globalLet._cti_stateDescription[state.globalLet._cti_currentState], timestamp)
  switch (state.globalLet._cti_currentState) {
    case state.globalLet._cti_unregister:
      break
    case state.globalLet._cti_peerstate:
      if (evtJson.Event === 'ChannelStatus') {
        if (evtJson.Exten === state.globalLet.phone_data.sipNo) {
          commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel}})
          // dsevent.publish(dsevent.evt.callItemRinged, {callId: evtJson.Data.CallSheetID})
        }
      }
      /**
      if(window.jQuery.fn.tooltip){
        $('#softphone_phonestate_dropdown').tooltip('destroy')
      }
       */
      break
    case state.globalLet._cti_dialing:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel}})
      if (evtJson.CalleeProvince !== '') {
        commit(types.CALLEEAREA, evtJson.CalleeProvince + '  ' + evtJson.CalleeCity)
      }
      /**
      $('#dial_popup_modal_callSheetID').val(evtJson.Data.CallSheetID)
       */
      // TODO
      break
    case state.globalLet._cti_innerDialing:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel}})
      // TODO
      break
    case state.globalLet._cti_belling:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      if (evtJson.Link) {
        let linkedChannel = evtJson.LinkedChannel
        if (state.globalLet._phone_callObject.callId !== linkedChannel.Uniqueid) {
          commit(types.PHONECALLOBJECT, {phoneCallObject: {callId: linkedChannel.Uniqueid}})
          let callsheetid = ''
          let ivrkey = ''
          let phoneCallObject = {
            originCallNo: linkedChannel.FromCid,
            originCalledNo: linkedChannel.FromDid,
            queue: linkedChannel.Queue,
            offeringTime: phoneDateParse(new Date(evtJson.Timestamp * 1000)),
            callerProvince: decodeURIComponent(evtJson.CallerProvince),
            callerCity: decodeURIComponent(evtJson.CallerCity)
          }
          if (linkedChannel.Data) {
            if (linkedChannel.Data.CallSheetID) {
              callsheetid = linkedChannel.Data.CallSheetID
              phoneCallObject.callSheetId = callsheetid
            }
            if (linkedChannel.Data.IVRKEY) {
              ivrkey = linkedChannel.Data.IVRKEY
              phoneCallObject.ivrkey = ivrkey
            }
            for (let key in linkedChannel.Data) {
              if (key === 'CallSheetID' || key === 'callSheetID' || key === 'IVRKEY') {
                continue
              }
              phoneCallObject[key] = linkedChannel.Data[key]
            }
          } else {
            phoneCallObject.callSheetId = callsheetid
          }

          let queue = state.globalLet.phone_queues[phoneCallObject.queue]
          if (queue) {
            phoneCallObject.queueName = queue.queueName
          }
          commit(types.PHONECALLOBJECT, {phoneCallObject: phoneCallObject})
          dispatch('callItemAdd', phoneCallObject)
          // phonePublishEvent(commit, state, 'EvtRing', phoneCallObject, '')
        }
      }
      break
    case state.globalLet._cti_innerBelling:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      // TODO
      break
    case state.globalLet._cti_listening:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel}})
      // TODO
      break
    case state.globalLet._cti_talking:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      // TODO
      break
    case state.globalLet._cti_transfer:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      // TODO
      break
    case state.globalLet._cti_dialoutTransfer:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      // TODO
      break
    case state.globalLet._cti_threeWayTalking:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      // TODO
      break
    case state.globalLet._cti_innerTalking:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      // TODO
      break
    case state.globalLet._cti_dialTalking:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      if (evtJson.CalleeProvince !== '') {
        commit(types.CALLEEAREA, evtJson.CalleeProvince + '  ' + evtJson.CalleeCity)
      }
      /**
      if(window.jQuery.fn.tooltip){
        if(evtJson.CalleeProvince != ''){
          $('#softphone_phonestate_dropdown').tooltip('destroy')
          $('#softphone_phonestate_dropdown').tooltip({placement:'bottom',trigger:'hover',title:evtJson.CalleeProvince+'  '+evtJson.CalleeCity}).tooltip('show')
        }
      }
       */
      // TODO
      break
    case state.globalLet._cti_listened:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel}})
      break
    case state.globalLet._cti_transferBelling:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      if (evtJson.Link) {
        let linkedChannel = evtJson.LinkedChannel
        if (state.globalLet._phone_callObject.callId !== linkedChannel.Uniqueid) {
          commit(types.PHONECALLOBJECT, {phoneCallObject: {callId: linkedChannel.Uniqueid}})
          let callsheetid = ''
          let ivrkey = ''
          if (linkedChannel.Data && linkedChannel.Data.CallSheetID) {
            callsheetid = linkedChannel.Data.CallSheetID
          }
          let phoneCallObject = {
            callSheetId: callsheetid,
            originId: linkedChannel.Uniqueid,
            originCallNo: linkedChannel.FromCid,
            originCalledNo: linkedChannel.FromDid,
            callType: linkedChannel.ChannelType,
            callId: linkedChannel.Uniqueid,
            queue: linkedChannel.Queue,
            location: linkedChannel.Location,
            offeringTime: phoneDateParse(new Date(evtJson.Timestamp * 1000)),
            callerProvince: decodeURIComponent(evtJson.CallerProvince),
            callerProvinceCode: evtJson.CallerProvinceCode,
            callerCity: decodeURIComponent(evtJson.CallerCity),
            callerCityCode: evtJson.CallerCityCode,
            data: {}
          }
          if (linkedChannel.Data) {
            phoneCallObject.data = linkedChannel.Data
            phoneCallObject.data.callSheetId = callsheetid
            if (linkedChannel.Data.IVRKEY) {
              ivrkey = linkedChannel.Data.IVRKEY
              phoneCallObject.ivrkey = ivrkey
            }
            for (let key in linkedChannel.Data) {
              if (key === 'CallSheetID' || key === 'callSheetID' || key === 'IVRKEY') {
                continue
              }
              phoneCallObject[key] = linkedChannel.Data[key]
            }
          }
          let queue = state.globalLet.phone_queues[phoneCallObject.queue]
          if (queue) {
            phoneCallObject.queueName = queue.queueName
          }
          commit(types.PHONECALLOBJECT, {phoneCallObject: phoneCallObject})
          dispatch('callItemAdd', phoneCallObject)
        }
      }
      break
    case state.globalLet._cti_transferDialing:
      commit(types.PHONE_DATA, {phoneData: {_curChannel: evtJson.Channel, _otherChannel: evtJson.LinkedChannel.Channel}})
      if (evtJson.Link) {
        let linkedChannel = evtJson.LinkedChannel
        if (state.globalLet._phone_callObject.callId !== linkedChannel.Uniqueid) {
          commit(types.PHONECALLOBJECT, {phoneCallObject: {callId: linkedChannel.Uniqueid}})
          let callsheetid = ''
          if (linkedChannel.Data && linkedChannel.Data.CallSheetID) {
            callsheetid = linkedChannel.Data.CallSheetID
          }
          let phoneCallObject = {
            callSheetId: callsheetid,
            originId: linkedChannel.Uniqueid,
            originCallNo: linkedChannel.FromCid,
            originCalledNo: linkedChannel.FromDid,
            callType: linkedChannel.ChannelType,
            callId: linkedChannel.Uniqueid,
            queue: linkedChannel.Queue,
            location: linkedChannel.Location,
            offeringTime: phoneDateParse(new Date(evtJson.Timestamp * 1000)),
            callerProvince: decodeURIComponent(evtJson.CallerProvince),
            callerProvinceCode: evtJson.CallerProvinceCode,
            callerCity: decodeURIComponent(evtJson.CallerCity),
            callerCityCode: evtJson.CallerCityCode,
            data: {}
          }
          if (linkedChannel.Data) {
            phoneCallObject.data = linkedChannel.Data
            phoneCallObject.data.callSheetId = callsheetid
          }
          let queue = state.globalLet.phone_queues[phoneCallObject.queue]
          if (queue) {
            phoneCallObject.queueName = queue.queueName
          }
          commit(types.PHONECALLOBJECT, {phoneCallObject: phoneCallObject})
          dispatch('callItemAdd', phoneCallObject)
        }
      }
      break
  }
  // TODO publish
}

function phoneDateParse (date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  return year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) +
    ' ' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute)
}

export function ctiRelogin (commit, state, rootState, dispatch) {
  if (!state.globalLet.phone_data.user) {
    return
  }
  if (state.globalLet._cti_isRelogin) {
    return
  }
  commit(types.CTI_ISRELOGIN, true)

  let phoneJson = {
    Command: 'Action',
    Action: 'Login',
    ActionID: 'Login' + Math.random(),
    ExtenType: state.globalLet.phone_data.extenType,
    Password: state.globalLet.phone_data.password,
    BusyType: state.globalLet.phone_data.busyType,
    Monitor: state.globalLet.phone_data.monitor,
    User: state.globalLet.phone_data.user,
    AppVersion: 'service'
  }

  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (!_response.Succeed) {
        let code = _response.Result
        if (code) {
          // commit(types.CODE, code)
          if (code === 601) {
            commit(globalTypes.SET_EXIT, 'cti.agentmaxOroverdue')
          } else if (code === 602) {
            commit(globalTypes.SET_EXIT, 'cti.agentmaxOroverdueUserTypeLogin')
          } else if (code === 500) {
            commit(globalTypes.SET_EXIT, 'cti.unBindGateway')
          } else if (code === 406) {
            commit(globalTypes.SET_EXIT, 'cti.systemVersionError')
          } else {
            commit(globalTypes.SET_EXIT, 'cti.loginError')
          }
        } else {
          commit(globalTypes.SET_EXIT, 'cti.sessionInvalidation2')
        }
      } else if (_response.SessionID) {
        let date = new Date()
        let identity = date.valueOf()
        let phoneData = {
          uniqueId: _response.SessionID,
          currentServerTime: identity - _response.Timestamp * 1000
        }
        commit(types.PHONE_DATA, {phoneData: phoneData})
        if (state.globalLet._cti_currentState === state.globalLet._cti_peerstate) {
          if (state.globalphoneSetBusyLet && state.globalphoneSetBusyLet.phone_data.busyType === '0') {
            dispatch('phoneSetBusy', { isBusy: false, busyType: 0 })
          } else if (state.globalLet.phone_data.busyType !== '99') {
            dispatch('phoneSetBusy', { isBusy: true, busyType: state.globalLet.phone_data.busyType })
          }
        }
        // ctiWaitEvent(commit, state, rootState, dispatch)
        dispatch('ctiWaitEvent')
      }
      commit(types.CTI_ISRELOGIN, false)
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'cti.requestTimeout')
      dispatch('ctiWaitEvent')
      commit(types.CTI_ISRELOGIN, false)
    })
}

export const ctiExit = ({commit, state, rootState, dispatch}, removeQueue) => {
  if (!state.globalLet.phone_data.uniqueId) {
    commit(types.PHONE_DATA, {phoneData: ''})
    commit(globalTypes.LOGINED, false)
    window.location = '/login'
    return
  }
  let phoneJson = {
    Command: 'Action',
    Action: 'Logoff',
    ActionID: 'Logoff' + Math.random(),
    QueueRemove: removeQueue,
    User: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      commit(types.PHONE_DATA, {phoneData: ''})
      commit(globalTypes.LOGINED, false)
      window.location = '/login'
    })
}
/**
 * cti-action-monotor.js
 */
export const phoneDialout = ({commit, state, rootState, dispatch}, data) => {
  commit(types.CALLINGNUM, data.phoneNum)
  if (/^\d+$/.test(data.phoneNum)) {
    commit(types.CTI_SHOWNUMBER, true)
    let callType = ''
    if (data.phoneNum.length < 5 && data.phoneNum.length !== 4) {
      let peer = ctiGetUserFromExten(data.phoneNum, state)
      if (!peer) {
        data.phoneNum = '9' + data.phoneNum
        callType = 'dialout'
      } else {
        callType = 'inner'
      }
    } else if (data.phoneNum.length === 4) {
      callType = 'inner'
    } else {
      data.phoneNum = '9' + data.phoneNum
      callType = 'dialout'
    }
    let phoneJson = {
      Command: 'Action',
      Action: 'Originate',
      ActionID: 'Originate' + Math.random(),
      Channel: 'SIP/' + state.globalLet.phone_data.sipNo,
      Context: state.globalLet.phone_data.accountId,
      Exten: data.phoneNum,
      Priority: '1',
      UserID: state.globalLet.phone_data.userId,
      Timeout: 60000,
      Async: 'true',
      CallType: callType,
      PBX: state.globalLet.phone_data.pbx_in_ip,
      Account: state.globalLet.phone_data.accountId,
      SessionID: state.globalLet.phone_data.uniqueId
    }
    if (data.cdrletiable) {
      phoneJson.HasCdrlet = 'true'
      phoneJson.ActionID = data.cdrletiable + '@' + Math.random()
    }
    if (data.ques_id) { // 当是问卷模块时需要添加ques_id字段
      phoneJson.ActionID = 'QUES_ID:' + data.ques_id + '@' + Math.random()
      phoneJson.HasCdrVar = 'true'
    }
    cti._cti_sendAction(phoneJson, state).then(
      response => {
        let _response = response
        if (!_response.Succeed) {
          if (_response.Expired) {
            ctiRelogin(commit, state, rootState, dispatch)
          }
        }
      })
    return true
  } else {
    commit(globalTypes.SET_ERROR, 'cti.phoneNumError')
    return false
  }
}

export const showDialoutUrlOrInPopupCust = ({commit, state, rootState}, data) => {
  // 外呼弹屏数据
  let dialoutUrls = []
  if (data.CallSheetID) {
    commit(types.SCREEN_CALL_SHEET_ID, data.CallSheetID)
  }
  getCache({commit, state: rootState}, {type: 'dialoutUrls', loadFromServer: true}).then((res) => {
    dialoutUrls = res
    let dialoutUrl = ''
    for (let i = 0; i < dialoutUrls.length; i++) {
      if (dialoutUrls[i].enable === 'true') {
        dialoutUrl = dialoutUrls[i]
      }
    }
    let phoneNum = data.CalledNo
    if (isHasFunc('func_dial_popup', rootState)) {
      if (dialoutUrl) {
        if (dialoutUrl && dialoutUrl !== '') {
          let business = {}
          if (dialoutUrl.type === '1') {
            business.callType = 'dialoutUrlIn'
            business.type = dialoutUrl.type
          } else if (dialoutUrl.type === '2') {
            business.callType = 'dialoutUrlOut'
            business.type = dialoutUrl.type
            if (dialoutUrl.outOpenType) {
              business.outOpenType = dialoutUrl.outOpenType
            }
          }
          business.url = dialoutUrl.url
          // callsheetId
          let callId = data.CallSheetID
          if (business.callType === 'dialoutUrlIn') {
            let urlInData = {'callId': callId, 'phoneNum': phoneNum, 'callBack': function () {}, 'url': business.url, 'data': data}
            showDialoutUrlInPopupCust({commit, state, rootState}, urlInData) // 外呼对接嵌入
          } else if (business.callType === 'dialoutUrlOut') {
            let urlOutData = {'callId': callId, 'phoneNum': phoneNum, 'callBack': function () {}, 'business': business, 'data': data}
            showCallUrlOutPopupCust({commit, state, rootState}, urlOutData)  // 外呼对接弹出
          } else {
            // handler.call.showPopupCust(callId, phoneNum, data.queue,data) // 经讨论，老版系统中的此方法可以干掉。
          }
        }
      } else {
        ctiQueryCustomerList({commit, state, rootState}, {'phone': phoneNum}) // 弹出客户资料
      }
    }
  })
}

export const phoneHangup = ({commit, state, rootState, dispatch}) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Hangup',
    ActionID: 'Hangup' + Math.random(),
    Channel: state.globalLet.phone_data._curChannel,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (!_response.Succeed) {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    })
}

export const phoneHold = ({commit, state, rootState, dispatch}) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Hold',
    ActionID: 'Hold' + Math.random(),
    Channel: state.globalLet.phone_data._otherChannel,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        commit(types.CTI_ISRELOGIN, state.globalLet._cti_currentState)
        commit(types.CTI_STATEBEFOREHOLD, state.globalLet._cti_currentState)
        commit(types.CTI_CURRENTSTATE, '16')
        phonePublishEvent(commit, state, 'toolbarupdate', 'hold', '')
      } else {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    })
}

export const phoneUnhold = ({commit, state, rootState, dispatch}) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Unhold',
    ActionID: 'Unhold' + Math.random(),
    Channel: state.globalLet.phone_data._otherChannel,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        commit(types.CTI_CURRENTSTATE, state.globalLet._cti_stateBeforeHold)
        commit(types.CTI_STATEBEFOREHOLD, '')
        phonePublishEvent(commit, state, 'toolbarupdate', state.globalLet._cti_stateDescription[state.globalLet._cti_stateBeforeHold], '')
      } else {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    })
}

export const getMark = ({commit, state, rootState, dispatch}) => {
  if (rootState.session.user.allFun.indexOf('func_mark_cdr')) {
    call.querySingleCallLabel().then(
      resp => {
        if (resp.success) {
          commit(callTypes.QUERY_CALL_LABEL, {labels: resp.list})
        }
      }
    )
  }
}
export const markCallSheetThroughCall = ({commit, state, rootState, dispatch}, data) => {
  return cti.markCallSheetThroughCall(data, state)
    .then(
      response => {
        // if (response.success) {
        //  commit(types.GET_CALL_LABEL_OP_HISTORY, {history: response.history, type})
        // }
        return response
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
  )
}
export const phoneMark = ({commit, state, rootState, dispatch}, labelId) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'SetVar',
    ActionID: 'SetVar' + Math.random(),
    Channel: state.globalLet.phone_data._curChannel,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId
  }
  phoneJson.Value = 'LABELS' + labelId
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (!_response.Succeed) {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    })
}

export const phoneConsult = ({commit, state, rootState, dispatch}, data) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Consult',
    ActionID: 'Consult' + Math.random(),
    FromExten: state.globalLet.phone_data.sipNo,
    // Exten: data.phoneNum,
    Timeout: 60000,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  // TODO ask how to solve
  if (data.mode === 'number') {
    if (data.phoneNum.length <= 5) {
      data.phoneNum = data.phoneNum.substr(1)
      // 判断 咨询座席  处于忙碌状态且不允许忙碌转接或咨询  提示对方忙碌
      let p1 = getCache({commit, state: rootState}, {type: 'agents'})
      let p2 = getCache({commit, state: rootState}, {type: 'roles'})
      let p = Promise.all([p1, p2])
      p.then(([agents, roles]) => {
        let currentAgents = agents
        let currentRoles = roles
        for (let i in state.globalLet.phone_peers) {
          let peer = state.globalLet.phone_peers[i]
          let agentRoles = []
          if (peer.exten === data.phoneNum) {
            let notAllowBusyTransferOrConsult = false
            for (let m = 0; m < currentAgents.length; m++) {
              if (currentAgents[m]._id === i) {
                agentRoles = currentAgents[m].role
                m = currentAgents.length
              }
            }
            for (let k = 0; k < agentRoles.length; k++) {
              for (let j = 0; j < currentRoles.length; j++) {
                if (agentRoles[k] === currentRoles[j]._id) {
                  let role = currentRoles[j]
                  if (role.limits_in.indexOf('func_not_allow_busy_transfer_or_consult') !== -1) {
                    notAllowBusyTransferOrConsult = true
                    k = agentRoles.length
                  }
                }
              }
            }
            if (peer.login && peer.busy && notAllowBusyTransferOrConsult) {
              commit(globalTypes.SET_ERROR, 'cti.busyNoTransfer')
              return
            }
            ctiUiShowTranster(commit, state, '工号 ' + data.phoneNum + ' ', false)
            phoneJson.Exten = data.phoneNum
            cti._cti_sendAction(phoneJson, state).then(
              response => {
                let _response = response
                // cti-ui.src.js softphonebar_close();
                softPhonebarClose(state)
                if (_response.Succeed) {
                  commit(globalTypes.SET_SUCCESS, 'cti.consultSuccess')
                  // cti-ui.src.js softphonebar_closeModel();
                  commit(types.SHOWCONSULTDIALOG, false)
                  commit(types.SHOWTRANSFERCANCELDIALOG, false)
                  phonePublishEvent(commit, state, 'toolbarupdate', 'consultTalking', 'continueTime')
                } else {
                  commit(types.SHOWTRANSFERCANCELDIALOG, false)
                  commit(globalTypes.SET_ERROR, 'cti.consultError')
                  if (_response.Expired) {
                    ctiRelogin(commit, state, rootState, dispatch)
                  }
                }
              }).catch(() => {
                // cti-ui.src.js softphonebar_close();
                softPhonebarClose(state)
                commit(globalTypes.SET_ERROR, 'cti.consultError')
              })
          }
        }
      }).catch((e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      })
    } else {
      ctiUiShowTranster(commit, state, data.phoneNum + ' ', false)
      phoneJson.Exten = data.phoneNum
      cti._cti_sendAction(phoneJson, state).then(
        response => {
          let _response = response
          // cti-ui.src.js softphonebar_close();
          softPhonebarClose(state)
          if (_response.Succeed) {
            commit(globalTypes.SET_SUCCESS, 'cti.consultSuccess')
            // cti-ui.src.js softphonebar_closeModel();
            commit(types.SHOWCONSULTDIALOG, false)
            commit(types.SHOWTRANSFERCANCELDIALOG, false)
            phonePublishEvent(commit, state, 'toolbarupdate', 'consultTalking', 'continueTime')
          } else {
            commit(types.SHOWTRANSFERCANCELDIALOG, false)
            commit(globalTypes.SET_ERROR, 'cti.consultError')
            if (_response.Expired) {
              ctiRelogin(commit, state, rootState, dispatch)
            }
          }
        }).catch(() => {
          // cti-ui.src.js softphonebar_close();
          softPhonebarClose(state)
          commit(globalTypes.SET_ERROR, 'cti.consultError')
        })
    }
  } else if (data.mode === 'skillgroup') {
    ctiUiShowTranster(commit, state, data.phoneNum + ' ', false)
    phoneJson.Exten = data.phoneNum
    cti._cti_sendAction(phoneJson, state).then(
      response => {
        let _response = response
        softPhonebarClose(state)
        if (_response.Succeed) {
          commit(globalTypes.SET_SUCCESS, 'cti.consultSuccess')
          commit(types.SHOWCONSULTDIALOG, false)
          commit(types.SHOWTRANSFERCANCELDIALOG, false)
          phonePublishEvent(commit, state, 'toolbarupdate', 'consultTalking', 'continueTime')
        } else {
          commit(types.SHOWTRANSFERCANCELDIALOG, false)
          commit(globalTypes.SET_ERROR, 'cti.consultError')
          if (_response.Expired) {
            ctiRelogin(commit, state, rootState, dispatch)
          }
        }
      }).catch(() => {
        softPhonebarClose(state)
        commit(globalTypes.SET_ERROR, 'cti.consultError')
      })
  }
}

export const phoneStopConsult = ({commit, state, rootState, dispatch}) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'StopConsult',
    ActionID: 'StopConsult' + Math.random(),
    FromExten: state.globalLet.phone_data.sipNo,
    Timeout: 60000,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        if (_response.Message !== undefined) {
          if (response.Message === 'Idle') {
            phonePublishEvent(commit, state, 'toolbarupdate', 'peerstate', 'continueTime')
          } else {
            phonePublishEvent(commit, state, 'toolbarupdate', 'talking', 'continueTime')
          }
        } else {
          phonePublishEvent(commit, state, 'toolbarupdate', 'talking', 'continueTime')
        }
      } else {
        commit(globalTypes.SET_ERROR, 'cti.endConsultError')
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'cti.endConsultError')
    })
}

export const getInvestigate = ({commit, state, rootState, dispatch}) => {
  getCache({commit, state: rootState}, {type: 'investigateList'}).then(investigateList => {
    commit(types.INVESTIGATELIST, investigateList)
  }).catch((e) => {
    console.log(e)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const getIvrMenu = ({commit, state, rootState, dispatch}) => {
  getCache({commit, state: rootState}, {type: 'ivrMenu'}).then(ivrMenu => {
    commit(types.IVRMENU, ivrMenu)
  }).catch((e) => {
    console.log(e)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const phoneInvestigate = ({commit, state, rootState, dispatch}, nodeNum) => {
  if (state.globalLet._cti_isInvestigatting) {
    return
  }
  commit(types.CTI_ISINVESTIGATTING, true)
  let phoneJson = {
    Command: 'Action',
    Action: 'Transfer',
    ActionID: 'Transfer' + Math.random(),
    Exten: 's',
    Channel: state.globalLet.phone_data._otherChannel,
    Timeout: 60000,
    CallType: 'investigate',
    UserID: state.globalLet.phone_data.userId,
    Context: state.globalLet.phone_data.accountId + '-investigate',
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  if (nodeNum && nodeNum !== '') {
    phoneJson.Context = state.globalLet.phone_data.accountId + '-' + nodeNum + '-satisfaction'
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      // cti-ui.src.js softphonebar_closeModel();
      if (!_response.Succeed) {
        if (response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
      commit(types.CTI_ISINVESTIGATTING, false)
    }).catch(() => {
      commit(types.CTI_ISINVESTIGATTING, false)
    })
}

export const phoneTransfer = ({commit, state, rootState, dispatch}, data) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Transfer',
    ActionID: 'Transfer' + Math.random(),
    // Exten: phoneNum,
    Channel: state.globalLet.phone_data._otherChannel,
    ExtraChannel: state.globalLet.phone_data._curChannel,
    UserID: state.globalLet.phone_data.userId,
    Context: state.globalLet.phone_data.accountId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  let phoneNum = data.phoneNum
  let mode = data.mode
  if (mode === 'number') {
    if (phoneNum.length <= 5) {
      phoneNum = phoneNum.substr(1)
      // 判断 转接座席  处于忙碌状态且不允许忙碌转接或咨询  提示对方忙碌
      let p1 = getCache({commit, state: rootState}, {type: 'agents'})
      let p2 = getCache({commit, state: rootState}, {type: 'roles'})
      let p = Promise.all([p1, p2])
      p.then(([agents, roles]) => {
        let currentAgents = agents
        let currentRoles = roles
        for (let i in state.globalLet.phone_peers) {
          let peer = state.globalLet.phone_peers[i]
          let agentRoles = []
          if (peer.exten === phoneNum) {
            let notAllowBusyTransferOrConsult = false
            for (let m = 0; m < currentAgents.length; m++) {
              if (currentAgents[m]._id === i) {
                agentRoles = currentAgents[m].role
                m = currentAgents.length
              }
            }
            for (let k = 0; k < agentRoles.length; k++) {
              for (let j = 0; j < currentRoles.length; j++) {
                if (agentRoles[k] === currentRoles[j]._id) {
                  let role = currentRoles[j]
                  if (role.limits_in.indexOf('func_not_allow_busy_transfer_or_consult') !== -1) {
                    notAllowBusyTransferOrConsult = true
                    k = agentRoles.length
                  }
                }
              }
            }
            if (peer.login && peer.busy && notAllowBusyTransferOrConsult) {
              commit(globalTypes.SET_ERROR, 'cti.busyNoTransfer')
              return
            }
          }
        }
        ctiUiShowTranster(commit, state, '工号 ' + phoneNum + ' ', true)
        phoneJson.Exten = phoneNum
        cti._cti_sendAction(phoneJson, state).then(
          response => {
            let _response = response
            if (_response.Succeed) {
              commit(types.SHOWTRANSFERDIALOG, false)
            } else {
              commit(types.SHOWTRANSFERCANCELDIALOG, false)
              softPhonebarClose(state)
              if (response.Message === '310') {
                commit(globalTypes.SET_ERROR, 'cti.unline')
              } else if (response.Message === '311') {
                commit(globalTypes.SET_ERROR, 'cti.transferUserBusy')
              } else if (response.Message === '312') {
                commit(globalTypes.SET_ERROR, 'cti.transferUserCheckOut')
              } else if (response.Message === '313') {
                commit(globalTypes.SET_ERROR, 'cti.transferUserOnDial')
              } else if (response.Message === '314') {
                commit(globalTypes.SET_ERROR, 'cti.transferUserLoginTypeError')
              } else if (response.Message === '315') {
                commit(globalTypes.SET_ERROR, 'cti.dialTransferUserError')
              } else if (response.Message === '316') {
                commit(globalTypes.SET_ERROR, 'cti.transferUserNoExist')
              } else {
                commit(globalTypes.SET_ERROR, 'cti.transferError')
              }
              if (response.Expired) {
                ctiRelogin(commit, state, rootState, dispatch)
              }
            }
          }).catch(() => {
            softPhonebarClose(state)
            commit(globalTypes.SET_ERROR, 'cti.transferError')
          })
      }).catch((e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      })
    } else {
      ctiUiShowTranster(commit, state, phoneNum + ' ', true)
      phoneJson.Exten = phoneNum
      cti._cti_sendAction(phoneJson, state).then(
        response => {
          let _response = response
          if (_response.Succeed) {
            commit(types.SHOWTRANSFERDIALOG, false)
          } else {
            commit(types.SHOWTRANSFERCANCELDIALOG, false)
            softPhonebarClose(state)
            if (response.Message === '310') {
              commit(globalTypes.SET_ERROR, 'cti.unline')
            } else if (response.Message === '311') {
              commit(globalTypes.SET_ERROR, 'cti.transferUserBusy')
            } else if (response.Message === '312') {
              commit(globalTypes.SET_ERROR, 'cti.transferUserCheckOut')
            } else if (response.Message === '313') {
              commit(globalTypes.SET_ERROR, 'cti.transferUserOnDial')
            } else if (response.Message === '314') {
              commit(globalTypes.SET_ERROR, 'cti.transferUserLoginTypeError')
            } else if (response.Message === '315') {
              commit(globalTypes.SET_ERROR, 'cti.dialTransferUserError')
            } else if (response.Message === '316') {
              commit(globalTypes.SET_ERROR, 'cti.transferUserNoExist')
            } else {
              commit(globalTypes.SET_ERROR, 'cti.transferError')
            }
            if (response.Expired) {
              ctiRelogin(commit, state, rootState, dispatch)
            }
          }
        }).catch(() => {
          softPhonebarClose(state)
          commit(globalTypes.SET_ERROR, 'cti.transferError')
        })
    }
  } else if (mode === 'skillgroup') {
    ctiUiShowTranster(commit, state, phoneNum + ' ', true)
    phoneJson.Exten = phoneNum
    cti._cti_sendAction(phoneJson, state).then(
      response => {
        let _response = response
        if (_response.Succeed) {
          commit(types.SHOWTRANSFERDIALOG, false)
        } else {
          commit(types.SHOWTRANSFERCANCELDIALOG, false)
          softPhonebarClose(state)
          if (response.Message === '310') {
            commit(globalTypes.SET_ERROR, 'cti.unline')
          } else if (response.Message === '311') {
            commit(globalTypes.SET_ERROR, 'cti.transferUserBusy')
          } else if (response.Message === '312') {
            commit(globalTypes.SET_ERROR, 'cti.transferUserCheckOut')
          } else if (response.Message === '313') {
            commit(globalTypes.SET_ERROR, 'cti.transferUserOnDial')
          } else if (response.Message === '314') {
            commit(globalTypes.SET_ERROR, 'cti.transferUserLoginTypeError')
          } else if (response.Message === '315') {
            commit(globalTypes.SET_ERROR, 'cti.dialTransferUserError')
          } else if (response.Message === '316') {
            commit(globalTypes.SET_ERROR, 'cti.transferUserNoExist')
          } else {
            commit(globalTypes.SET_ERROR, 'cti.transferError')
          }
          if (response.Expired) {
            ctiRelogin(commit, state, rootState, dispatch)
          }
        }
      }).catch(() => {
        softPhonebarClose(state)
        commit(globalTypes.SET_ERROR, 'cti.transferError')
      })
  }
}

function ctiUiShowTranster (commit, state, destExten, isTransfer) {
  let waitState = {
    time: '00:00',
    isTransfer: isTransfer,
    Exten: destExten
  }
  commit(types.WAITSATE, waitState)
  commit(types.SHOWTRANSFERCANCELDIALOG, true)
  let softPhonebarCount = 1
  let ctiUiNotifydialoginterval = window.setInterval(function () {
    let count = softPhonebarCount++
    let time = '00:' + (count < 10 ? '0' + count : count)
    commit(types.WAITSATE, {time: time})
    if (state.globalLet_cti_ui_dialogBoxRemain <= 0) {
      softPhonebarClose(state)
    }
    let remain = state.globalLet._cti_ui_dialogBoxRemain - 1000
    commit(types.CTI_UI_DIALOGBOXREMAIN, remain)
  }, 1000)
  commit(types.CTI_UI_NOTIFYDIALOGINTERVAL, ctiUiNotifydialoginterval)
}

function softPhonebarClose (state) {
  if (state.globalLet._cti_ui_notifyDialogInterval) {
    window.clearInterval(state.globalLet._cti_ui_notifyDialogInterval)
  }
}

export const phoneCancelTransfer = ({commit, state, rootState, dispatch}) => {
  if (state.globalLet.phone_data._otherChannel) {
    let phoneJson = {
      Command: 'Action',
      Action: 'CancelTransfer',
      ActionID: 'CancelTransfer' + Math.random(),
      Channel: state.globalLet.phone_data._otherChannel,
      PBX: state.globalLet.phone_data.pbx_in_ip,
      Account: state.globalLet.phone_data.accountId,
      SessionID: state.globalLet.phone_data.uniqueId
    }
    cti._cti_sendAction(phoneJson, state).then(
      response => {
        let _response = response
        softPhonebarClose(state)
        if (_response.Succeed) {
          commit(types.SHOWTRANSFERCANCELDIALOG, false)
          commit(globalTypes.SET_SUCCESS, 'cti.cancelTransferSuccess')
        } else {
          commit(types.SHOWTRANSFERCANCELDIALOG, false)
          commit(globalTypes.SET_ERROR, 'cti.cancelTransferError')
          if (response.Expired) {
            ctiRelogin(commit, state, rootState, dispatch)
          }
        }
      }).catch(() => {
        softPhonebarClose(state)
        commit(types.SHOWTRANSFERCANCELDIALOG, false)
        commit(globalTypes.SET_ERROR, 'cti.cancelTransferError')
      })
  }
}

export const phoneThreewaycall = ({commit, state, rootState, dispatch}, phoneNum) => {
  // cti-ui.src.js softphonebar_closeModel();
  if (phoneNum.length <= 5) {
    phoneNum = phoneNum.substr(1)
    // cti-ui.src.js _cti_ui_showTranster('工号 ' + phoneNum + ' ');
  } else {
    phoneNum = phoneNum.substr(1)
    // cti-ui.src.js _cti_ui_showTranster(phoneNum + ' ');
  }
  let phoneJson = {
    Command: 'Action',
    Action: 'ThreeWayCall',
    ActionID: 'ThreeWayCall' + Math.random(),
    FromExten: state.globalLet.phone_data.sipNo,
    Exten: phoneNum,
    Timeout: 60000,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      // cti-ui.src.js softphonebar_close();
      if (_response.Succeed) {
        commit(globalTypes.SET_SUCCESS, 'cti.threewaycallSuccess')
        phonePublishEvent(commit, state, 'toolbarupdate', 'threeWayTalking', '')
      } else {
        commit(globalTypes.SET_ERROR, 'cti.threewaycallError')
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    }).catch(() => {
      // cti-ui.src.js softphonebar_close();
      commit(globalTypes.SET_ERROR, 'cti.threewaycallError')
    })
}

export const phoneKick = ({commit, state, rootState, dispatch}, userId) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Kick',
    ActionID: 'Kick' + Math.random(),
    Exten: userId,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        let peer = state.globalLet.phone_peers[userId]
        if (peer) {
          peer.C5Status = ''
          peer.callNo = ''
          peer.callStatus = 'Idle'
          let date = new Date()
          let identity = date.valueOf()
          peer.timestamp = identity / 1000
          peer.channel = ''
          peer.linkedChannel = ''
          // phone_publishEvent('EvtMonitorPeer', [peer]);
          ctiUpdateQueueInfo(state, commit)
        }
      } else {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

export const phoneKickFromPbx = ({commit, state, rootState, dispatch}, data) => {
  // let phonePbx = state.globalLet.phone_pbxs[pbx]
  // let url = state.globalLet.phone_pbx.proxyUrl
  let phoneJson = {
    Command: 'Action',
    Action: 'Kick',
    ActionID: 'Kick' + Math.random(),
    Exten: data.userId,
    UserID: state.globalLet.phone_data.userId,
    PBX: data.pbx,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_pbx.sessionId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        let peer = state.globalLet.phone_peers[data.userId]
        if (peer) {
          peer.C5Status = ''
          peer.callNo = ''
          peer.callStatus = 'Idle'
          let date = new Date()
          let identity = date.valueOf()
          peer.timestamp = identity / 1000
          peer.channel = ''
          peer.linkedChannel = ''
         //  phone_publishEvent('EvtMonitorPeer', [peer])
          ctiUpdateQueueInfo(state, commit)
        }
      } else {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

export const phonePick = ({commit, state, rootState, dispatch}, data) => {
  let userId = data.userId
  let extenType = data.extenType
  let peer = state.globalLet.phone_peers[userId]
  if (!extenType) {
    if (peer === null || peer.localNo === null || peer.localNo === '') {
      commit(globalTypes.SET_ERROR, 'cti.agentUnBindlinePhone')
      return {Local: false}
    }
  }
  let phoneJson = {
    Command: 'Action',
    Action: 'SignIn',
    ActionID: 'SignIn' + Math.random(),
    User: userId,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  if (extenType) {
    phoneJson.ExtenType = extenType
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        commit(globalTypes.SET_SUCCESS, 'cti.agentSignInSuccess')
      } else {
        if (extenType && extenType === 'gateway') {
          if ('isBeyond' in response) {
            commit(globalTypes.SET_ERROR, 'cti.agentFull')
          } else {
            commit(globalTypes.SET_ERROR, 'cti.agentUnBindGateway')
          }
        } else {
          commit(globalTypes.SET_ERROR, 'cti.agentFull')
        }
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

export const saveLocalNumForPhonePick = ({commit, state, rootState, dispatch}, data) => {
  user.editUser(data)
    .then(response => {
      if (response.success) {
        commit(types.PHONE_PEERS, {userId: data._id, peer: {localNo: data.mobile}})
        // commit(globalTypes.SET_SUCCESS, 'userInfo.editSuccess')
        phonePick({commit, state, rootState, dispatch}, {userId: data._id})
        return {}
      } else {
        commit(globalTypes.SET_ERROR, 'userInfo.editFail')
      }
    })
    .catch(() => {
      commit(globalTypes.SET_ERROR, 'userInfo.editFail')
    })
}

export const phonePickFromPbx = ({commit, state, rootState, dispatch}, data) => {
  let userId = data.userId
  let pbx = data.pbx
  let peer = state.globalLet.phone_peers[userId]
  if (peer === null || peer.localNo === null || peer.localNo === '') {
    commit(globalTypes.SET_ERROR, 'cti.agentUnBindlinePhone')
    return
  }
  let phonePbx = state.globalLet.phone_pbxs[pbx]
  let phoneJson = {
    Command: 'Action',
    Action: 'SignIn',
    ActionID: 'SignIn' + Math.random(),
    User: userId,
    UserID: state.globalLet.phone_data.userId,
    PBX: pbx,
    Account: state.globalLet.phone_data.accountId,
    SessionID: phonePbx.sessionId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        commit(globalTypes.SET_SUCCESS, 'cti.agentSignInSuccess')
      } else {
        commit(globalTypes.SET_ERROR, 'cti.agentFull')
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

export const phoneHangupChannel = ({commit, state, rootState, dispatch}, channel) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Hangup',
    ActionID: 'ForceHangup' + Math.random(),
    Channel: channel,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state)
}

export const phoneHangupChannelFromPbx = ({commit, state, rootState, dispatch}, data) => {
  let channel = data.channel
  let pbx = data.pbx
  let phonePbx = state.globalLet.phone_pbxs[pbx]
  let phoneJson = {
    Command: 'Action',
    Action: 'Hangup',
    ActionID: 'ForceHangup' + Math.random(),
    Channel: channel,
    UserID: state.globalLet.phone_data.userId,
    PBX: pbx,
    Account: state.globalLet.phone_data.accountId,
    SessionID: phonePbx.sessionId
  }
  cti._cti_sendAction(phoneJson, state)
}

export const phoneLoot = ({commit, state, rootState, dispatch}, channel) => {
  if (state.globalLet.phone_data.busyType === '0') {
    commit(globalTypes.SET_ERROR, 'cti.configPhoneBusy')
    return
  }
  let phoneJson = {
    Command: 'Action',
    Action: 'Transfer',
    ActionID: 'Transfer' + Math.random(),
    Exten: state.globalLet.phone_data.exten,
    Channel: channel,
    CallType: 'Loot',
    Context: state.globalLet.phone_data.accountId,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (!_response.Succeed) {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

export const phoneListen = ({commit, state, rootState, dispatch}, curChannel) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Originate',
    ActionID: 'Originate' + Math.random(),
    Channel: 'SIP/' + state.globalLet.phone_data.sipNo,
    Application: 'ChanSpy',
    Data: curChannel + '|q',
    Callerid: state.globalLet.phone_data.sipNo,
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        let phoneData = {
          _otherChannel: curChannel
        }
        commit(types.PHONE_DATA, {phoneData: phoneData})
      } else {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
      return true
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

export const phoneToMenu = ({commit, state, rootState, dispatch}, data) => {
  let exten = data.exten
  // let displayName = data.displayName
  // cti-ui.src.js softphonebar_closeModel()`
  // cti-ui.src.js _cti_ui_showToMenu(displayName)
  let phoneJson = {
    Command: 'Action',
    Action: 'IvrMenu',
    ActionID: 'IvrMenu' + Math.random(),
    Channel: state.globalLet.phone_data._otherChannel,
    Context: exten,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        commit(globalTypes.SET_SUCCESS, 'cti.callPhoneTransferCheck')
        // cti-ui.src.js softphonebar_closeModel()
      } else {
        // cti-ui.src.js softphonebar_close();
        commit(globalTypes.SET_ERROR, 'cti.transferIvrError')
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
    }).catch(() => {
      // cti-ui.src.js softphonebar_close()
      commit(globalTypes.SET_ERROR, 'cti.transferIvrError')
    })
}

export const ctiMonitorServiceNo = ({commit, state, rootState, dispatch}, evtJson) => {
  if (evtJson.Event === 'TrunkStatus') {
    let displayName
    if (evtJson.DisplayName) {
      displayName = evtJson.DisplayName
      if (startWith(displayName, 'serviceno-')) {
        displayName = ''
      }
    }
    if (!state.globalLet.phone_serviceNos[evtJson.ServiceNo]) {
      let serviceNo = {
        serviceNo: evtJson.ServiceNo,
        inCalls: evtJson.InCalls,
        inLost: evtJson.InLost,
        inComplete: evtJson.InComplete,
        outCalls: 0,
        outComplete: 0,
        displayName: displayName,
        pbx: evtJson.PBX
      }
      state.globalLet.phone_serviceNos[evtJson.ServiceNo] = serviceNo
    } else {
      let serviceNo = state.globalLet.phone_serviceNos[evtJson.ServiceNo]
      serviceNo.inCalls = evtJson.InCalls
      serviceNo.inLost = evtJson.InLost
      serviceNo.inComplete = evtJson.InComplete
      serviceNo.outCalls = 0
      serviceNo.outComplete = 0
      serviceNo.displayName = displayName
    }
    // phone_publishEvent('EvtMonitorServiceNo', [phone_serviceNos[evtJson.ServiceNo]])
  }
}

export const phonePbxMonitor = ({commit, state, rootState, dispatch}, pbx) => {
  for (let i in state.globalLet.phone_pbxs) {
    if (i === state.globalLet.phone_data.pbx_in_ip) {
      continue
    }
    if (i === pbx) {
      if (!state.globalLet.phone_pbxs[pbx].monitor) {
        phonePbxMonitorResister(i)
      }
    } else {
      if (state.globalLet.phone_pbxs[pbx].monitor) {
        phonePbxMonitorLogOff(i)
      }
    }
  }
}

export const phonePbxMonitorResister = ({commit, state, rootState, dispatch}, pbx) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'Login',
    ActionID: 'Login' + Math.random(),
    PBX: pbx,
    Account: state.globalLet.phone_data.accountId,
    UserID: state.globalLet.phone_data.monitorUser,
    Password: state.globalLet.phone_data.monitorPassword,
    MonitorUser: true,
    AppVersion: 'service'
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      let data = {}
      if (_response.Succeed) {
        data.sessionId = _response.SessionID
        data.isWaitingPbxEvent = false
        data.monitor = true
        dispatch('phoneWaitPbxEvent', pbx)
      } else {
        data.monitor = false
      }
      commit(types.PHONE_PBXS, {data: data, type: pbx})
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'cti.requestTimeout')
      dispatch('ctiWaitEvent')
      let data = {
        monitor: false
      }
      commit(types.PHONE_PBXS, {data: data, type: pbx})
    })
}

export const phonePbxMonitorLogOff = ({commit, state, rootState, dispatch}, pbx) => {

}

export const phoneWaitPbxEvent = ({commit, state, rootState, dispatch}, pbx) => {
  let phonePbx = state.globalLet.phone_pbxs[pbx]
  if (!phonePbx.monitor) {
    return
  }
  if (phonePbx.isWaitingPbxEvent) {
    return
  }
  commit(types.PHONE_PBXS, {data: {isWaitingPbxEvent: true}, type: pbx})
  let phoneJson = {
    Command: 'Action',
    Action: 'GetState',
    ActionID: 'GetState' + Math.random(),
    SessionID: phonePbx.sessionId,
    User: state.globalLet.phone_data.monitorUser
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      if (!response) {
        return
      }
      let _response = response.Response
      if (!_response.Succeed) {
        if (_response.Expired) {
          commit(types.PHONE_PBXS, {data: {isWaitingPbxEvent: false}, type: pbx})
          dispatch('phonePbxMonitorResister', pbx)
          return
        }
      } else if (_response.Succeed && _response.HasEvent) {
        let events = response.Event
        if (events !== null) {
          ctiEventHandler(events, true, state, commit, dispatch)
        }
      }
      commit(types.PHONE_PBXS, {data: {isWaitingPbxEvent: false}, type: pbx})
      setInterval(function () {
        dispatch('phoneWaitPbxEvent', pbx)
      }, 10)
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'cti.requestTimeout')
      dispatch('ctiWaitEvent')
      commit(types.PHONE_PBXS, {data: {isWaitingPbxEvent: false}, type: pbx})
    })
}

export function syncChannelSet (commit, state, data, callback) {
  let phoneJson = {
    Command: 'Action',
    Action: 'SetMultiChannelReceiveStatus',
    ActionID: 'SetMultiChannelReceiveStatus' + Math.random(),
    UserID: state.globalLet.phone_data.userId,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    Mail: data.channelMail + '',
    Weixin: data.channelWx + '',
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (_response.Succeed) {
        if (typeof callback === 'function') {
          callback(response)
        }
      } else {
        commit(globalTypes.SET_ERROR, 'cti.synchronizationAssError')
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'cti.synchronizationAssError')
    })
}

export const phoneSwitchExtenType = ({commit, state, rootState, dispatch}, data) => {
  let phoneJson = {
    Command: 'Action',
    Action: 'SetExtenType',
    ActionID: 'SetExtenType' + Math.random(),
    PBX: rootState.session.user.pbx,
    Account: rootState.session.user.account,
    User: state.globalLet.phone_data.userId,
    ExtenType: data.extenType,
    LoginExten: data.extenNum
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      if (response.Succeed) {
        commit(types.PHONE_DATA, {phoneData: {extenType: data.extenType}})
        commit(globalTypes.SET_SUCCESS, 'cti.changeExtenTypeSucess')
      } else {
        commit(globalTypes.SET_ERROR, 'cti.changeExtenTypeError' + response.Message)
      }
    }).catch(() => {
      commit(globalTypes.SET_ERROR, 'cti.changeExtenTypeError')
    })
  return true
}

export const phoneSetBusy = ({commit, state, rootState, dispatch}, data) => {
  if (state.globalLet._cti_isSettingbusy) {
    return
  } else {
    commit(types.CTI_ISSETTINGBUSY, true)
  }
  let phoneJson = {
    Command: 'Action',
    Action: 'Busy',
    ActionID: 'Busy' + Math.random(),
    Exten: state.globalLet.phone_data.userId,
    Busy: data.isBusy,
    BusyType: '' + data.busyType,
    PBX: state.globalLet.phone_data.pbx_in_ip,
    Account: state.globalLet.phone_data.accountId,
    SessionID: state.globalLet.phone_data.uniqueId
  }
  cti._cti_sendAction(phoneJson, state).then(
    response => {
      let _response = response
      if (!_response.Succeed) {
        if (_response.Expired) {
          ctiRelogin(commit, state, rootState, dispatch)
        }
      }
      commit(types.CTI_ISSETTINGBUSY, false)
    }).catch(() => {
      commit(types.CTI_ISSETTINGBUSY, false)
    })
}

function ctiGetUserFromExten (exten, state) {
  if (!state.globalLet.phone_peers) {
    return null
  }
  for (let i in state.globalLet.phone_peers) {
    if (state.globalLet.phone_peers[i].exten === exten) {
      return state.globalLet.phone_peers[i]
    }
  }
  return null
}

export function ctiGetUserFromSip (sipNo, state, commit) {
  let peer = state.globalLet._phone_peersFromSip[sipNo]
  if (peer === null || peer === '') {
    if (!state.globalLet.phone_peers) {
      return null
    }
    for (let i in state.globalLet.phone_peers) {
      if (state.globalLet.phone_peers[i].sipNo === sipNo) {
        let data = {
          sipNo: sipNo,
          numberInfo: state.globalLet.phone_peers[i]
        }
        commit(types.PHONE_PEERSFROMSIP, data)
        // state.globalLet._phone_peersFromSip[sipNo] = state.globalLet.phone_peers[i]
        return state.globalLet._phone_peersFromSip[sipNo]
      }
    }
    return null
  } else {
    return peer
  }
}

function isHasFunc (key, rootState) {
  let user = rootState.session.user
  if (user.type === 'admin' && user.exten === '0000') {
    let reverse = ['func_hide_tel', 'func_nodelete_customer']
    if (reverse.indexOf(key) !== -1) {
      return false
    } else {
      return true
    }
  }
  let funcIds = user.funcIds
  if (funcIds.indexOf(key) !== -1) {
    return true
  } else {
    return false
  }
}

export function ctiUpdateQueueInfo (state, commit) {
  for (let i in state.globalLet.phone_queues) {
    let queueI = state.globalLet.phone_queues[i]
    let members = queueI.members
    let queueItem = {
      busyAgentCount: 0,
      idleAgentCount: 0
    }
    for (let j in members) {
      let peer = ctiGetUserFromSip(members[j], state, commit)
      if (peer) {
        if (peer.extenType === 'sip') {
          if (!peer.register || !peer.login || peer.busy || peer.callStatus !== 'Idle') {
            queueItem.busyAgentCount ++
          } else {
            queueItem.idleAgentCount ++
          }
        } else if (peer.extenType === 'gateway') {
          if (!peer.register || peer.busy || peer.callStatus !== 'Idle') {
            queueItem.busyAgentCount ++
          } else {
            queueItem.idleAgentCount ++
          }
        } else if (peer.extenType === 'Local') {
          if (peer.busy || peer.callStatus !== 'Idle') {
            queueItem.busyAgentCount ++
          } else {
            queueItem.idleAgentCount ++
          }
        } else {
          queueItem.busyAgentCount ++
        }
      } else {
        queueItem.idleAgentCount ++
      }
    }
    let data = {
      queue: i,
      queueItem: queueItem
    }
    commit(types.PHONE_QUEUES, data)
    phonePublishEvent(commit, state, 'EvtMonitorQueue', [queueI, 'noNeedWaitCount'])
  }
}

/**
 * cti-ui.src.js
 */
export function phonePublishEvent (commit, state, event, param1, param2) {
  if (event === 'toolbarupdate') {
    ctiUiToolbarupdate(commit, state, param1, param2)
  }

  if (event === 'transfering') {
    ctiUiTransfering(commit, state, param1)
  }
}

function ctiUiTransfering (commit, state, value) {
  if (value === 'TransferSuccess') {
    softPhonebarClose(state)
    commit(types.SHOWTRANSFERCANCELDIALOG, false)
    commit(globalTypes.SET_SUCCESS, 'cti.transferSuccess')
  } else if (value === 'TransferFailed') {
    softPhonebarClose(state)
    commit(types.SHOWTRANSFERCANCELDIALOG, false)
    commit(globalTypes.SET_ERROR, 'cti.transferError')
  }
}

function ctiUiToolbarupdate (commit, state, lastState, timestamp) {
  if (!state.globalLet._cti_ui_last_state) {
    commit(types.CTI_UI_LAST_STATE, lastState)
  }
  ctiUiSwitchState(commit, state, lastState, timestamp)
}

function ctiUiSwitchState (commit, state, lastState, timestamp) {
  let resetTimer = false
  let currentState = state.globalLet._cti_currentState
  if (lastState === 'peerstate') {
    if (state.globalLet._cti_ui_last_state !== lastState) {
      resetTimer = true
    }
    commit(types.CTI_EXTENSTATE, '')
    if (state.globalLet.phone_data.busyType === '99') { // 后处理状态
      ctiUiSystemBusy(commit, state)
    }
  }

  if (lastState === 'consultTalking' && (currentState === 10 || currentState === 7)) {
    commit(types.CTI_EXTENSTATE, lastState)
  } else if (lastState === 'talking' && currentState === 10) {
    commit(types.CTI_EXTENSTATE, lastState)
  } else if (lastState === 'threeWayTalking' && (currentState === 10 || currentState === 7)) {
    commit(types.CTI_EXTENSTATE, lastState)
  } else {
    commit(types.CTI_EXTENSTATE, '')
  }

  if (state.globalLet.phone_data.busyType === '99') {
    // _softphonebar_countTimer = 0;
    return
  }
  if (timestamp === 'continueTime') {
    return
  }
  if (timestamp !== '') {
    let date = new Date()
    let identity = date.valueOf()
    let oldTime = ((identity - state.globalLet.phone_data.currentServerTime) - parseFloat(timestamp) * 1000) / 1000
    if (oldTime < 0) {
      commit(types.CTI_UI_COUNTTIMER, 0)
    } else {
      commit(types.CTI_UI_COUNTTIMER, oldTime)
    }
  } else {
    if (resetTimer) {
      commit(types.CTI_UI_COUNTTIMER, 0)
    }
  }
  if (state.globalLet._cti_ui_calculagraph !== null) {
    window.clearInterval(state.globalLet._cti_ui_calculagraph)
    let ctiUiCalculagraph = window.setInterval(function () {
      ctiUiDoCallTimer(commit, state)
    }, 1000)
    commit(types.CTI_UI_CALCULAGRAPH, ctiUiCalculagraph)
  }
  commit(types.CTI_UI_LAST_STATE, lastState)
}

function ctiUiDoCallTimer (commit, state) {
  let ctiUiCountTimer = state.globalLet._cti_ui_countTimer
  ctiUiGetTimer(commit, state, ctiUiCountTimer)
  let currentCtiUiCountTimer = ctiUiCountTimer + 1
  commit(types.CTI_UI_COUNTTIMER, currentCtiUiCountTimer)
}

function ctiUiGetTimer (commit, state, countTimer) {
  let minute = '0'
  let second = '0'
  let hour = '0'
  countTimer = parseInt(countTimer) + 1
  hour = parseInt(countTimer / 3600)
  minute = parseInt((countTimer % 3600) / 60)
  second = (countTimer % 3600) % 60
  let mtime = (hour < 10) ? '0' + hour : hour
  mtime += ':'
  mtime += (minute < 10) ? '0' + minute : minute
  mtime += ':'
  mtime += (second < 10) ? '0' + second : second
  commit(types.MTIME, mtime)
}
function ctiUiSystemBusy (commit, state) {
  let autoBusyTime = state.globalLet.phone_data.autoBusyTime
  if (autoBusyTime < 1) {
    return
  }
  if (state.globalLet._cti_ui_calculagraph !== null) {
    window.clearInterval(state.globalLet._cti_ui_calculagraph)
  }
  let ctiUiCalculagraph = window.setInterval(function () {
    autoBusyTime--
    ctiUiAutoBusyTime(commit, state, autoBusyTime)
  }, 1000)
  commit(types.CTI_UI_CALCULAGRAPH, ctiUiCalculagraph)
}
function ctiUiAutoBusyTime (commit, state, autoBusyTime) {
  let minute = '0'
  let second = '0'
  let hour = '0'
  if (autoBusyTime >= 60 * 60) {
    hour = parseInt(autoBusyTime / (60 * 60))
    minute = parseInt((autoBusyTime - hour * (60 * 60)) / (60))
    second = autoBusyTime - hour * (60 * 60) - minute * (60)
  } else if (autoBusyTime >= 60 && (autoBusyTime < 60 * 60)) {
    hour = '0'
    minute = parseInt(autoBusyTime / 60)
    second = autoBusyTime - minute * 60
  } else if (autoBusyTime > 0 && autoBusyTime < 60) {
    hour = '0'
    minute = '0'
    second = autoBusyTime
  } else if (autoBusyTime <= 0) {
    hour = '0'
    minute = '0'
    second = '0'
  }
  if (hour < 0) {
    hour = 0
  }
  if (minute < 0) {
    minute = 0
  }
  if (second < 0) {
    second = 0
  }
  let mtime = ((hour < 10) ? ('0' + hour) : hour) + ':' + ((minute < 10) ? ('0' + minute) : minute) + ':' + ((second < 10) ? ('0' + second) : second)
  commit(types.MTIME, mtime)
}
export const ctiQueryCustomerList = ({commit, state, rootState, dispatch}, data) => {
  return new Promise((resolve, reject) => {
    cti.popupCust({phone: data.phone}, state)
      .then(
        response => {
          if (response.success) {
            let customer = {}
            if (response.list.length < 1) {
              customer.CUSTOMER_TYPE = 'unk'
            } else if (response.list && response.list.length === 1) {
              customer.CUSTOMER_ID = response.list[0]._id
              customer.CUSTOMER_STATUS = response.list[0].status
              customer.CUSTOMER_NAME = response.list[0].name
              customer.CUSTOMER_TYPE = 'one'
              customer.list = response.list[0]
              /**
               customer.queryCustomerInfo({_id: response.list[0]._id})
               .then(res1 => {
                if (res1.success && res1.data) {
                  // commit(globalTypes.SET_CURRENT_CUSTOMER, { data: res1.data, type: 'call', tabType: 'cdr_call', businessId: data.callSheetId })
                  commit(types.SET_CUSTOMER_INFO, {data: res1.data, callSheetId: data.callSheetId})
                }
              })
               */
            } else if (response.list && response.list.length > 1) {
              customer.CUSTOMER_TYPE = 'multi'
            }
            // commit(types.RELOCATION_CUSTOMER, {relocationCustomerType, type: 'cdr_call'})
            /**
             let notify = {
            tag: 'cdr',
            id: data.callSheetId,
            NOcallnum: 1,
            random: Math.random()
          }
             commit(globalTypes.SET_NOTIFY, notify)
             */
            commit(types.CALL_CUSTOMER_DETAIL, customer)
            commit(types.SCREEN_FLAG, true)
            resolve(customer)
          }
        }
      ).catch(
        (e) => {
          console.log(e)
          commit(globalTypes.SET_ERROR, 'message.default_tips')
        })
  })
}

export const getConcurrent = ({commit, state}) => {
  return cti.getConcurrent({}, state).then(
    response => {
      if (response.success) {
        commit(types.LIMITS, response.limit)
      }
    }
  ).catch(
    (e) => {
      console.log(e)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

export const showDialoutUrlInPopupCust = ({commit, state, rootState}, data) => {
  getCache({commit, state: rootState}, {type: 'custTmpls'}).then((res) => {
    let custtmpls = res
    let custmpl = []
    for (let i = 0; i < custtmpls.length; i++) {
      let cust = custtmpls[i]
      if (cust.call_popup && cust.active + '' !== 'false') {
        custmpl.push(cust._id)
      }
    }
    let newData = {accountId: rootState.session.user.account, phone: data.phoneNum, dbType: {$in: custmpl}}
    return cti.popupCust(newData, state).then(
      response => {
        let params = ''
        if (data.data) {
          for (var param in data.data) {
            params += param + '=' + data.data[param] + '&'
          }
          if (rootState.session.user) {
            params += 'loginName=' + rootState.session.user.loginName
          }
        }
        if (params) {
          if (data.url.indexOf('?') === -1) {
            data.url += '?' + params
          } else {
            data.url += '&' + params
          }
          if (rootState.session.account.tokenCheck) {
            let userData = {loginName: rootState.session.user.loginName, password: rootState.session.user.password}
            user.getTokenId(userData)
              .then(
                resp => {
                  if (resp.success) {
                    data.url += '&token=' + resp.token + '&tokenId=' + resp.tokenId
                    if (data.url.indexOf('#') !== -1) {
                      data.url = data.url.replace(/#/g, '%23')
                    }
                    commit(types.CALL_SCREEN, data.url)
                  }
                }
            )
          } else {
            if (data.url.indexOf('#') !== -1) {
              data.url = data.url.replace(/#/g, '%23')
            }
            commit(types.CALL_SCREEN, data.url)
          }
        }
        if (response.success) {
          console.log(response)
        }
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      })
  })
}

export const showCallUrlOutPopupCust = ({commit, state, rootState}, data) => {
  getCache({commit, state: rootState}, {type: 'custTmpls'}).then((res) => {
    let custtmpls = res
    let custmpl = []
    for (let i = 0; i < custtmpls.length; i++) {
      let cust = custtmpls[i]
      if (cust.call_popup && cust.active + '' !== 'false') {
        custmpl.push(cust._id)
      }
    }
    let newData = {accountId: rootState.session.user.account, phone: data.phoneNum, dbType: {$in: custmpl}}
    return cti.popupCust(newData, state).then(
      response => {
        let params = ''
        if (data.data) {
          for (var param in data.data) {
            params += param + '=' + data.data[param] + '&'
          }
          if (rootState.session.user) {
            params += 'loginName=' + rootState.session.user.loginName
          }
        }
        if (params !== '') {
          if (data.business.url.indexOf('?') === -1) {
            data.business.url += '?' + params
          } else {
            data.business.url += '&' + params
          }
          if (rootState.session.account.tokenCheck) {
            let userData = {loginName: rootState.session.user.loginName, password: rootState.session.user.password}
            user.getTokenId(userData)
              .then(
                resp => {
                  if (resp.success) {
                    data.business.url += '&token=' + res.token + '&tokenId=' + res.tokenId
                    if (data.business.url.indexOf('#') !== -1) {
                      data.business.url = data.business.url.replace(/#/g, '%23')
                    }
                    if (data.business.outOpenType) {
                      if (data.business.outOpenType === 'tab') {
                        window.open(data.business.url, '', '')
                      } else {
                        window.open(data.business.url, '', 'fullscreen=yes')
                      }
                    } else {
                      window.open(data.business.url, '', 'fullscreen=yes')
                    }
                  }
                }
              )
          } else {
            if (data.business.url.indexOf('#') !== -1) {
              data.business.url = data.business.url.replace(/#/g, '%23')
            }
            if (data.business.outOpenType) {
              if (data.business.outOpenType === 'tab') {
                window.open(data.business.url, '', '')
              } else {
                window.open(data.business.url, '', 'fullscreen=yes')
              }
            } else {
              window.open(data.business.url, '', 'fullscreen=yes')
            }
          }
        }
      }).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      })
  })
}

