import {getCache} from './m7Utils.js'
import store from '../store/index'
export function ctiUiGetQueuePeer (item, state) {
  let session = state.session
  let queue = state.cti.globalLet.phone_queues[item.queueId]
  let members
  let curPeer
  let tipTitle = ''
  if (queue) {
    members = queue.members
    let hasNoName = false
    for (var j in members) {
      curPeer = ctiGetUserFromSip(j, state.cti.globalLet)
      if (curPeer && session.user.type !== 'admin' && session.user.scope.call !== 'all') {
        var isFind = false
        var lowUsers = session.user.moduleUsers.call
        for (var i = 0; i < lowUsers.length; i++) {
          if (lowUsers[i] === curPeer.userId) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          hasNoName = true
          continue
        }
      }
      if (curPeer != null) {
        tipTitle += (curPeer.DisplayName + ',')
      } else {
        hasNoName = true
      }
    }
    if (tipTitle !== '') {
      if (hasNoName) {
        tipTitle = '(' + tipTitle + '...)'
      } else {
        tipTitle = '(' + tipTitle.substring(0, tipTitle.lastIndexOf(',')) + ')'
      }
    } else {
      if (hasNoName) {
        tipTitle = '(...)'
      }
    }
  }
  return tipTitle
}
export function ctiGetUserFromSip (sipNo, globalLet) {
  var peer = globalLet._phone_peersFromSip[sipNo]
  if (peer === null || peer === '') {
    if (!globalLet.phone_peers) {
      return null
    }
    for (var i in globalLet.phone_peers) {
      if (globalLet.phone_peers[i].sipNo === sipNo) {
        return globalLet.phone_peers[i]
      }
    }
    return null
  } else {
    return peer
  }
}
export function imMonitorGetQueueAgents (queue, newFlag) {
  if (!queue.onlineAgents) {
    imMonitorInitQueueAgents(queue)
  }
  let str = '0'
  if (queue.onlineAgents.length > 0) {
    str = queue.onlineAgents.length + '('
    for (let i = 0; i < queue.onlineAgents.length; i++) {
      str += queue.onlineAgents[i].name
      if (i !== queue.onlineAgents.length - 1) {
        str += ','
      }
    }
    if (newFlag) {
      var array = str.split('(')
      var nstr = array[1]
      return nstr
    }
    str += ')'
  }
  return str
}
export function imMonitorInitQueueAgents (queue) {
  var onlines = getCache('onlineChannelAgent')
  let resultList = []
  for (var i = 0; i < queue.AssignMembers.length; i++) {
    var curId = queue.AssignMembers[i].agentID
    for (var j = 0; j < onlines.length; j++) {
      var agent = onlines[j]
      if (agent._id === curId) {
        var agentInfo = getCache('agents', curId)
        if (!agentInfo) {
          agentInfo = {displayName: ''}
        }
        if (!agentInfo.displayName) {
          agentInfo.displayName = ''
        }
        var tmpAgent = {id: curId, name: agentInfo.displayName, autoClaim: ''}
        resultList.push(tmpAgent)
      }
    }
  }
  queue.onlineAgents = resultList
}
export function ctiUiDisplayExtenType (peer) {
  let displayExtenType = ''
  if (peer.extenType === 'sip') {
    displayExtenType = '软电话'
  } else if (peer.extenType === 'gateway') {
    displayExtenType = 'SIP话机'
  } else if (peer.extenType === 'Local') {
    displayExtenType = peer.localNo
  } else if (peer.extenType === 'none') {
    displayExtenType = '无电话接入'
  }
  return displayExtenType
}
export function ctiUiDisplayStatus (peer, ctiUiDesc, phoneData) {
  let displayName = ''
  if (peer.login && peer.extenType !== 'none') {
    if ((peer.extenType === 'sip' || peer.extenType === 'gateway') && peer.register === false) {
      displayName = {color: '', content: ctiUiDesc['unregister']}
    } else if (peer.callStatus === 'Idle') {
            // console.info(phone_data.phonebarConfig[peer.busyType]);
      if (peer.busyType === '0') {
        displayName = ctiUiGetColor(phoneData.phonebarConfig[peer.busyType], '0')
      } else {
        displayName = ctiUiGetColor(phoneData.phonebarConfig[peer.busyType], '1')
      }
    } else if (peer.callStatus === 'Ring') {
      displayName = ctiUiGetColor(ctiUiDesc['dialing'], '2')
    } else if (peer.callStatus === 'Ringing') {
      displayName = ctiUiGetColor(ctiUiDesc['belling'], '2')
    } else if (peer.callStatus === 'inner') {
      displayName = ctiUiGetColor(ctiUiDesc['innerTalking'], '2')
    } else if (peer.callStatus === 'normal') {
      displayName = ctiUiGetColor(ctiUiDesc['talking'], '2')
    } else if (peer.callStatus === 'dialout') {
      displayName = ctiUiGetColor(ctiUiDesc['dialTalking'], '2')
    } else if (peer.callStatus === 'dialTransfer') {
      displayName = ctiUiGetColor(ctiUiDesc['dialTransfer'], '2')
    } else if (peer.callStatus === 'transfer') {
      displayName = ctiUiGetColor(ctiUiDesc['transfer'], '2')
    } else if (peer.callStatus === 'listen') {
      displayName = ctiUiGetColor(ctiUiDesc['listened'], '2')
    }
    // validate?
  } else if (peer.login && peer.extenType === 'none') {
    displayName = {color: '', content: ''}
  } else {
    if (peer.callStatus === 'Ring') {
      displayName = ctiUiGetColor(ctiUiDesc['dialing'], '2')
    } else if (peer.callStatus === 'Ringing') {
      displayName = ctiUiGetColor(ctiUiDesc['belling'], '2')
    } else if (peer.callStatus === 'inner') {
      displayName = ctiUiGetColor(ctiUiDesc['innerTalking'], '2')
    } else if (peer.callStatus === 'normal') {
      displayName = ctiUiGetColor(ctiUiDesc['talking'], '2')
    } else if (peer.callStatus === 'dialout') {
      displayName = ctiUiGetColor(ctiUiDesc['dialTalking'], '2')
    } else if (peer.callStatus === 'dialTransfer') {
      displayName = ctiUiGetColor(ctiUiDesc['dialTransfer'], '2')
    } else if (peer.callStatus === 'transfer') {
      displayName = ctiUiGetColor(ctiUiDesc['transfer'], '2')
    } else if (peer.callStatus === 'listen') {
      displayName = ctiUiGetColor(ctiUiDesc['listened'], '2')
    } else {
      if (!peer.login && (peer.extenType === 'gateway' || peer.extenType === 'Local')) {
        displayName = {color: '', content: ctiUiDesc['offline']}
      } else {
        displayName = {color: '', content: ctiUiDesc['ready']}
      }
    }
  }
  return displayName
}

function ctiUiGetColor (content, type) {
  if (type === '0') {
    return {color: '<span class="cdr-status cdr-green"></span>', content: content}
  } else if (type === '1') {
    return {color: '<span class="cdr-status cdr-red"></span>', content: content}
  } else if (type === '2') {
    return {color: '<span class="cdr-status cdr-orange"></span>', content: content}
  } else {
    return {color: '<span></span>', content: content}
  }
}
export function renderAutoClaimDispaly (status) {
  if (status === undefined) {
    return ''
  } else if (status === true) {
    return 'public.open'
  } else if (status === false) {
    return 'public.close'
  }
}
export function ctiUicontrolMonitor (peer, phoneData) {
  let dataDisabled = {}
  if (peer.userId === phoneData.userId || (!peer.login && peer.extenType !== 'Local' && peer.extenType !== 'gateway')) {
    dataDisabled.kick = {disabled: true, show: true}
  } else {
    dataDisabled.kick = {disabled: false, show: true}
  }
  if (peer.userId === phoneData.userId || peer.login || (!peer.login && peer.extenType === 'Local') || (!peer.login && peer.extenType === 'gateway')) {
    dataDisabled.pick = {disabled: true, show: true}
    dataDisabled.pickGateway = {disabled: true, show: true}
  } else {
    dataDisabled.pick = {disabled: false, show: true}
    dataDisabled.pickGateway = {disabled: false, show: true}
  }
  if (peer.callStatus !== 'listen' && peer.callStatus !== 'Idle') {
    dataDisabled.forceHangup = {disabled: false, show: true}
  } else {
    dataDisabled.forceHangup = {disabled: true, show: true}
  }
  if (phoneData.extenType === 'none' || peer.userId === phoneData.userId || ctiUiIsCalling(phoneData.userId) || !ctiUiIsCalling(peer.userId)) {
    dataDisabled.loot = {disabled: true, show: true}
  } else {
    dataDisabled.loot = {disabled: false, show: true}
  }
  if (phoneData.extenType !== 'none' && peer.userId !== phoneData.userId && !ctiUiIsCalling(phoneData.userId) && (peer.callStatus === 'webcall' || peer.callStatus === 'inner' || peer.callStatus === 'normal' || peer.callStatus === 'dialout' || peer.callStatus === 'dialTransfer' || peer.callStatus === 'transfer')) {
    dataDisabled.listen = {disabled: false, show: true}
  } else {
    dataDisabled.listen = {disabled: true, show: true}
  }
  if (peer.pbx !== phoneData.pbx_in_ip) {
    dataDisabled.loot = {disabled: true, show: false}
    dataDisabled.listen = {disabled: true, show: false}
  }
  if (!peer.sipNo) {
    dataDisabled.pick = {disabled: false, show: true}
    dataDisabled.pickGateway = {disabled: false, show: true}
    dataDisabled.kick = {disabled: true, show: true}
    dataDisabled.loot = {disabled: true, show: true}
    dataDisabled.forceHangup = {disabled: true, show: true}
    dataDisabled.listen = {disabled: true, show: true}
    dataDisabled.endlisten = {disabled: true, show: false}
  }
  return dataDisabled
}
function ctiUiIsCalling (userId) {
  var peer = store.state.cti.globalLet.phone_peers[userId]
  if (peer) {
    if (peer.callStatus === 'Ring' || peer.callStatus === 'Ringing' || peer.callStatus === 'inner' || peer.callStatus === 'normal' || peer.callStatus === 'dialout' || peer.callStatus === 'dialTransfer' || peer.callStatus === 'transfer' || peer.callStatus === 'listen') {
      return true
    }
  }
  return false
}
export function imMonitorGetQueueAutoClaimAgents (queue, newFlag) {
  if (!queue.onlineAgents) {
    imMonitorInitQueueAgents(queue)
  }
  // var autoCount = 0
  let nameList = []
  if (queue.onlineAgents.length > 0) {
    for (let i = 0; i < queue.onlineAgents.length; i++) {
      nameList.push(queue.onlineAgents[i].name)
    }
    if (nameList.length > 0) {
      var str = nameList.length + '('
      for (var i = 0; i < nameList.length; i++) {
        str += nameList[i]
        if (i !== nameList.length - 1) {
          str += ','
        }
      }
      if (newFlag) {
        let array = str.split('(')
        var nstr = array[1]
        return nstr
      }
      str += ')'
      return str
    } else {
      return '0'
    }
  } else {
    return '0'
  }
}
