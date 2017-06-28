/**
 * Created by zengyx on 16/12/19.
 */
import io from 'socket.io-client'
import * as types from './mutation-types'
import * as gtypes from '../../mutation-types'
import * as customerTypes from '../../modules/customer/mutation-types'
import * as monitor from '../monitor/actions'
import login from '../../api/login'

const state = {
  lastSocketId: ''
}
export default {
  state,
  actions: {
    initSocket: ({commit, state, rootState, dispatch}) => {
      let socket = io.connect(rootState.pushServerUrl, {
        'force new connection': true,
        reconnectionDelay: 3000,
        query: {
          username: rootState.session.user.exten,
          password: rootState.session.user.password,
          account: rootState.session.user.account
        }
      })
      socket.on('connect', function (data) {
        // 掉线自动登录后的处理,去判断在线客服是否存在窗口,然后去获取离线消息展示
        if (state.lastSocketId != null) {
          dispatch('processAutoOnlineAfterOffline')
        }
      })

      socket.on('error', function (data) {
        console.log('push connection error' + JSON.stringify(data))
      })
      socket.on('socketId', function (socketData) {
        let socketId = socketData.socketId
        commit(types.UPDATE_SOCKETID, {socketId: socketId})
        // let port = socketData.port;
        // let ip = socketData.ip;
        // do something...
        // 如建立跟后端服务的联系，他们之间可以用session维系
        // 后端可以维护这样的关系：{socketId:socketId, ip: ip, port:port, session:session}，
        // 后端服务就可以根据session找寻socketId, ip, port

        // 掉线了,记住上一次用户的选择
        // if(handler.push.lastSocketId != null){
        //  var status = '';
        //  if(handler.webchat.autoClaim == false){
        //    status = 'close';
        //  }else{
        //    status = 'open';
        //  }
        //  handler.webchat.updateAutoClaimWebchatSessionStatus(status);
        //
        //  //added by wangyn 更新离线后上线邮件领取状态
        //  var emailStatus = '';
        //  if(handler.email.autoClaim == false){
        //    emailStatus = 'close';
        //  }else{
        //    emailStatus = 'open';
        //  }
        //  handler.email.updateAutoClaimEmailSessionStatus(emailStatus);
        // }else{
        //  if(session.user.imClaimStatus == 'close'){
        //    handler.webchat.autoClaim = false;
        //  }
        // }
        // handler.push.lastSocketId = socketId;
        dispatch('pushSocketLogined', socketData)
      })
      socket.on('pushMsg', function (data, fn) {
        // 回给服务器进行确认
        if (fn && typeof fn === 'function') {
          fn('success')
        }
        // todo
        // 这里是服务端接收到的事件，根据事件类型进行不同处理
        if (data.Event === 'NewWebchat' || data.Event === 'BatchNewWebchat' || data.Event === 'GroupMsg' || data.Event === 'NewNotify') {
          //  //do something...
          //  handler.webchat.dispatch(data);
          dispatch('dispatchWebchat', data)
        } else if (data.Event === 'ImMonitor') {
          monitor.imMonitorEventProcess({commit, state, rootState, dispatch}, data)
        } else if (data.Event === 'MailMonitor') {
          monitor.mailMonitorEventProcess({commit, state, rootState, dispatch}, data)
        } else if (data.Event === 'NewEmail' || data.Event === 'NewEmailNotify') {
          dispatch('dispatchEmail', data)
          // } else if(data.Event == 'IvrSoundTransferNotify'){
          //  handler.config.callConfig.sound.uploadTransferSuccess(data);
          // } else if(data.Event == 'NewEmail' || data.Event == 'NewEmailNotify'){
          //  handler.email.dispatch(data);
          // } else if(data.Event == 'leakAssignMsg'){
          //  handler.cdr.dispatch(data.Data);
        } else if (data.Event === 'customerPlan') {
          let param = data.Data || {}
          let notify = {
            notifyTime: param.notifyTime,
            custName: param.custName,
            remark: param.remark
          }
          commit(gtypes.SET_NOTIFY, { tag: 'customerPlan', notify: notify })
          // } else if(data.Event == 'quesNotify'){
          //  var param=data.Data||{};
          //  var msg = '您有问卷定于' + param.notifyTime + '回访，请及时回访';
          //  emitQuesNotify('您有一条问卷回访提醒', msg);
        } else if (data.Event === 'saleChance') {
          let notify = data.Data || {}
          let paths = rootState.route && rootState.route.fullPath ? rootState.route.fullPath.split('/') : []
          let type = paths[2]
          let tabType = paths[3]
          let cId = paths[4]
          commit(gtypes.SET_NOTIFY, { tag: 'saleChance', notify: notify })
          commit(customerTypes.REFRESH_LEFT)

          if (type === 'customer' && (tabType === 'customer_my' || tabType === 'customer_plan') && notify.type === 'updateOwner' && cId === notify.cid) {
            commit(customerTypes.EMPTY_RIGHT)
          }
        } else if (data.Event === 'business') {
          let msg = data.Data.content || ''
          commit(gtypes.SET_NOTIFY, {tag: 'business', notify: {msg: msg}})
        } else if (data.Event === 'UbaNotify') {
          dispatch('dispatchUba', data)
        }
        // 更多业务处理...
      })

      // 关闭事件时，调用socket的
      if (window.addEventListener) {
        window.addEventListener('close', function () {
          socket.disconnect()
        })
      } else {
        window.attachEvent('onclose', function () {
          socket.disconnect()
        })
      }
    },
    processAutoOnlineAfterOffline: () => {

    },
    pushSocketLogined: ({commit}, data) => {
      return login.pushSocketLogined(data)
      .then(response => {
        if (response.success) {
          commit(types.PUSH_SOCKET_LOGIN, true)
        }
      }).catch(err => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
    }
  },
  mutations: {
    [types.UPDATE_SOCKETID] (state, {socketId}) {
      state.lastSocketId = socketId
    },
    [types.PUSH_SOCKET_LOGIN] (state, data) {
      state.success = data
    }

  }
}
