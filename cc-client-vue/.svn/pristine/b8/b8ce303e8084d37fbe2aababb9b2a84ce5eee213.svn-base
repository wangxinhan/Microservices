import store from '../index.js'
import fetchJsonp from 'fetch-jsonp'
import { Message } from 'element-ui'
import { m7Language } from '../../utils/m7Utils'
const URL = '/action'
const PUBLIC_URL = '/public'
const REPORT_URL = '/report'
const UBA_URL = '/uba/service'

const ignoreMessages = [
  '404 customer not found!',
  'phone is repeat!',
  'customer name is repeat!',
  'The customer is in the state of being audited'
]

function openMessage (res) {
  let info = res.message
  if (info && info !== '') {
    let reTag = /<(?:.|\s)*?>/g
    let language = m7Language(info).replace(reTag, '')
    if (!res.success) {
      if (ignoreMessages.indexOf(language) !== -1) {
        return
      }
      Message({message: language, type: 'error', duration: 3000})
    }
  }
}

function fetchByPost (action) {
  let sessionId = window.sessionStorage.getItem('sessionId')
  let data = {
    data: JSON.stringify(action.data),
    action: action.action,
    sessionId: sessionId || ''
  }
  return window.fetch(action.url, {
    method: action.method || 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    let response = res.json()
    response.then(function (data) {
      openMessage(data)
    })
    store.commit('MASKING', {show: false, type: 'common'})
    return response
  })
}

function fetchByGet (action) {
  let sessionId = window.sessionStorage.getItem('sessionId')
  let data = {
    data: JSON.stringify(action.data),
    action: action.action,
    sessionId: ''
  }
  action.action !== 'login' ? data.sessionId = sessionId : ''
  let url = action.url + '?action=' + data.action + '&data= ' + data.data + '&sessionId=' + data.sessionId
  return window.fetch(url, {
    method: action.method || 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    let response = res.json()
    response.then(function (data) {
      openMessage(data)
    })
    store.commit('MASKING', {show: false, type: 'common'})
    return response
  })
}

function fetchByJsonpGet (data) {
  let url = data.url + '?json=' + encodeURIComponent(JSON.stringify(data.jsonData))
  let timeout = 15000
  if (data.jsonData.Timeout !== undefined) {
    timeout = data.jsonData.Timeout
  }
  return new Promise((resolve, reject) => {
    fetchJsonp(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      jsonpCallback: 'callbackName',
      timeout: timeout
    }).then(function (res) {
      resolve(res.json())
      store.commit('MASKING', {show: false, type: 'common'})
    }).catch(function (ex) {
      let count = store.state.cti.globalLet._cti_reconnection_count
      let currentCount = count + 1
      if (currentCount > 3) { // 请求超过3次
        store.commit('SET_ERROR', 'cti.connectServiceTimeout')
        return
      }
      store.commit('CTI_RECONNECTION_COUNT', currentCount)
      store.commit('CTI_IS_WAITING_EVENT', false)
      store.dispatch('ctiWaitEvent')
    })
  })
}

export default {
  fetch (data, method) {
    let action = data
    action.url = URL
    store.commit('MASKING', {show: true, type: 'common'})
    return method === 'post' ? fetchByPost(action) : fetchByGet(action)
  },
  fetchByPublic (data, method) {
    let action = data
    action.url = PUBLIC_URL
    store.commit('MASKING', {show: true, type: 'common'})
    return method === 'post' ? fetchByPost(action) : fetchByGet(action)
  },
  fetchByReport (data, method) {
    let action = data
    action.url = REPORT_URL
    store.commit('MASKING', {show: true, type: 'common'})
    return method === 'post' ? fetchByPost(action) : fetchByGet(action)
  },
  fetchByUba (data, method) {
    let action = data
    action.url = UBA_URL
    store.commit('MASKING', {show: true, type: 'common'})
    return method === 'post' ? fetchByPost(action) : fetchByGet(action)
  },
  fetchByJsonp (data, method) {
    store.commit('MASKING', {show: false, type: 'common'})
    return fetchByJsonpGet(data)
  }
}
