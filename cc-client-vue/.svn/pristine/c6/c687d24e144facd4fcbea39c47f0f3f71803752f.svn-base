import * as types from './mutation-types'
import * as webchatTypes from './modules/webchat/mutation-types'
import * as callTypes from './modules/call/mutation-types'
import common from './api/common'
import * as m7Utils from '../utils/m7Utils'
import loginApi from './api/login'
import user from './api/user'
import call from './api/call'

export const initSystemConfig = ({commit, state}, data) => {
  return common.initSystemConfig(data).then(response => {
    let data = response
    commit(types.INIT_CONFIG, { data })
  })
}

export const signIn = ({ commit, state, dispatch }, user) => {
  return loginApi.login(user).then(response => {
    let data = response
    let loginBody = document.getElementById('login-body')
    if (data.success) {
      if (data.logType === 'bind' || data.lastCodeKey || user.logType === 'bind') {
        return data
      } else {
        commit(types.SIGNIN, {data})
        window.sessionStorage.setItem('sessionId', data.sessionId)
        window.sessionStorage.setItem('loginData', JSON.stringify(user))
        window.sessionStorage.setItem('notifySwitch', JSON.stringify({
          customerPlan: true
        }))
        commit(webchatTypes.SET_WEBCHAT_AUTOCLAIM, {status: data.user.imClaimStatus})
        return dispatch('initSocket')
          .then(() => {
            dispatch('refreshWebchatMenuNum')
            dispatch('refreshEmailMenuNum')
            return dispatch('initCache')
          }).then(() => {
            // TODO 全局loading
            loginBody.className = ''
            return data
          })
      }
    } else {
      loginBody.className = ''
      return data
    }
  }).catch((err) => {
    console.log(err)
  })
}

export const checkBeforeLogin = ({ commit, state, dispatch }, data) => {
  return loginApi.checkBeforeLogin(data).then(response => response).catch((err) => {
    console.log(err)
  })
}

export const initPhone = ({commit, state, dispatch}) => {
  let loginForm = JSON.parse(window.localStorage.loginForm)
  let account = state.session.account
  let loginName = state.session.user.loginName + '@' + account.name
  let password = state.session.user.password
  let extenType = 'gateway'
   // 获取状态
  let busyType = loginForm.login_busyType ? '0' : '1'
  if (loginForm.extenType) {
    extenType = loginForm.extenType
  }
  let pbxid = state.session.user.pbx
  let curpbx = ''
  // 获取pbx信息
  let pbxs = []
  getCache({commit, state}, {type: 'pbx'}).then((res) => {
    pbxs = res
    for (let i = 0; i < pbxs.length; i++) {
      if (pbxs[i]._id === pbxid) {
        curpbx = pbxs[i]
        state.cti.globalLet.phone_pbxs[pbxs[i]._id] = pbxs[i]
        break
      }
    }
    let url = ''
    window.location.protocol === 'https:' ? url = curpbx.assDomain : url = curpbx.assAddr
    let config = {
      monitor: true,
      proxy_url: url,
      extenType: extenType,
      password: password,
      user: loginName,
      busyType: busyType.toString(),
      pbxNick: curpbx.name,
      curPbx: curpbx._id,
      pbx_in_ip: curpbx._id,
      accountId: account.account,
      exten: state.session.user.exten
    }
    if ((state.session.user.idAmin && state.session.user.isAdmin === true) || (state.session.user.type && state.session.user.type === 'manager')) {
      config.monitor = true
    } else {
      config.monitor = false
    }
    dispatch('ctiRegister', config)
  })
}

export const initMenu = ({commit, state}) => {
  let data = {idle: ''}
  return common.getUserInMenu(data).then(response => {
    let data = response
    let success = data.success
    if (success) {
      console.log('initMenu finish')
      commit(types.SET_MENU, data)
    } else {
      console.log('getMenuFail')
    }
  }).catch(error => {
    Promise.reject('request_fail,' + error)
  })
}

export const initCache = ({ commit, state }) => {
  let data = {idle: ''}
  return common.getDicCache(data).then(response => {
    let data = response
    commit(types.SET_DICMAP, {dicMap: data.dicMap})
    getCache({ commit, state }, { type: 'tabUrlAddress' }) // 获取客户TAB页对接数据
    // getCache({ commit, state }, { type: 'qualityTasks' }) // 获取质检任务
    // getCache({ commit, state }, { type: 'qualityConditionTemplates' }) // 获取条件模板
    getCache({ commit, state }, { type: 'urls' }) // 获取首页对接
    getCache({ commit, state }, { type: 'custTmpls' }) // 客户模板
    getCache({ commit, state }, { type: 'callLabel' }) // 通话标签
    call.findOneAppDic({name: '满意度调查选项'})
      .then(
        res => {
          if (res.success && res.data && res.data.options && Array.isArray(res.data.options)) {
            let data = []
            let options = res.data.options
            for (let i = 0; i < options.length; i++) {
              let name = options[i].name
              let value = options[i].options[0].name
              data.push({name, value})
            }
            commit(types.SET_TYPE_DICDATA, {data: data, type: 'investigate'})
          }
        }
    )
    call.queryCallLabelType().then(
      resp => {
        if (resp.success && resp.data) {
          commit(callTypes.QUERY_CALL_LABEL_TYPE, resp.data)
        }
      }
    )
    // 这里面放的是必须登录后就同步加载完毕的数据,如果不是,就放到上面,异步去加载就行
    return Promise.all([
      getCache({ commit, state }, { type: 'options' }), // 字典
      getCache({ commit, state }, { type: 'queues' }) // 通话 技能组
    ])
  }
  ).catch(error => {
    Promise.reject('request_fail,' + error)
  })
}

export const getCache = ({ commit, state }, req, retryTimes = 1) => {
  if (retryTimes > 3) {
    return
  }
  let type = req.type
  let loadFromServer = req.loadFromServer
  let id = req.id
  if (!type) {
    return []
  }
  let cache = []
  if (state.session.dicMap && state.session.dicMap[type] && !loadFromServer) {
    cache = state.session.dicMap[type]
    if (id) {
      for (let i = 0; i < cache.length; i++) {
        if (cache[i]._id === id) {
          return Promise.resolve(m7Utils.copy(cache[i]))
        }
      }
      return Promise.resolve(null)
    }
    return Promise.resolve(cache)
  } else {
    return new Promise((resolve, reject) => {
      let data = {type: type}
      common.getDicCache(data).then(response => {
        let resData = response
        if (resData.success) {
          commit(types.SET_TYPE_DICDATA, {data: resData.data, type: type})
          if (state.session.dicMap.options) {
            cleanMarkDic({commit, state}, state.session.dicMap.options)
          }
        } else {
          commit(types.SET_TYPE_DICDATA, {data: [], type: type})
        }
        resolve(getCache({commit, state}, {type: type, id: id}, ++retryTimes))
      }).catch(() => {
        if (retryTimes === 3) {
          commit(types.SET_ERROR, 'getCacheError')
        }
        commit(types.SET_TYPE_DICDATA, {data: null, type: type})
        resolve(getCache({commit, state}, {type: type, id: id}, ++retryTimes))
      })
    })
  }
}

export const getDicCacheByValue = ({ state }, req) => {
  let type = req.type || ''
  let value = req.value
  let cache = state.session.dicMap[type] || []
  if (value) {
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].code_value === value) {
        return m7Utils.copy(cache[i])
      }
    }
    return null
  }
  return cache
}

export const getCacheByKey = ({commit, state}, req) => {
  return new Promise((resolve, reject) => {
    let type = req.type
    let key = req.key
    let value = req.value
    type = type || ''
    getCache({commit, state}, {type: type}).then(cache => {
      for (let i = 0; i < cache.length; i++) {
        let cacheItem = cache[i]
        if (cacheItem[key] === value) {
          resolve(cacheItem)
          break
        }
      }
      resolve(null)
    })
  })
}

export const getDicCacheName = ({commit, state}, req) => {
  let type = req.type
  let value = req.value
  type = type || ''
  value = value || ''
  return getCache({commit, state}, {type: type}).then(dic => {
    for (let i = 0; i < dic.length; i++) {
      if (dic[i].code_value === value) {
        return dic[i].code_name
      }
    }
    return value
  })
}

export const addCache = ({commit, state}, req) => {
  let type = req.type
  let data = req.data
  if (data) {
    getCache({commit, state}, {type: type, id: data._id}).then(addData => {
      if (!addData) {
        commit(types.PUSH_TYPE_DICDATA, {data: data, type: type})
      }
    })
  }
}

export const removeCache = ({commit, state}, req) => {
  let type = req.type
  let id = req.id
  getCache({commit, state}, {type: type}).then(cache => {
    if (cache) {
      for (var i = 0; i < cache.length; i++) {
        if (cache[i]._id === id) {
          cache.splice(i, 1)
          break
        }
      }
    }
  })
}

export const updateCache = ({commit, state}, req) => {
  let type = req.type
  let id = req.id
  let data = req.data
  getCache({commit, state}, {type: type}).then(cache => {
    if (cache) {
      for (var i = 0; i < cache.length; i++) {
        if (cache[i]._id === id) {
          cache[i] = data
          break
        }
      }
    }
  })
}

export const refreshCache = ({commit, state}, req) => {
  let type = req.type
  let data = req.data
  if (!type) {
    return
  }
  data = data || []
  commit(types.SET_TYPE_DICDATA, {data})
}

/**
 * 从数据库获取数据更新缓存
 * @param type
 * @returns {Array}
 */
export const refreshCacheFromDb = ({commit, state}, req) => {
  let type = req.type
  if (!type) {
    return []
  }
  let data = {type: type}
  return common.getDicCache(data).then(
    response => {
      let resData = response
      if (resData.success) {
        commit(types.SET_TYPE_DICDATA, {data: resData.data, type: type})
        if (state.session.dicMap.options) {
          cleanMarkDic({commit, state}, state.session.dicMap.options)
        }
      } else {
        commit(types.SET_TYPE_DICDATA, {data: [], type: type})
      }
      getCache({commit, state}, {type: type})
    }).catch(error => {
      console.log(error)
      state.session.dicMap[type] = []
      getCache({commit, state}, {type: type})
    })
}

export const cleanMarkDic = ({ commit, state }, diccm) => {
  let oneFlag = []
  let twoFlag = []
  let threeFlag = []
  for (let i = 0; i < diccm.length; i++) {
    let options = diccm[i].options || []
    for (let m = 0; m < options.length; m++) {
      if (options[m] !== '' && (options[m].state)) {
        if (options[m].state === '1') {
          oneFlag.push(options[m].key)
          continue
        }
        options[m].options = options[m].options || []
        for (let j = 0; j < options[m].options.length; j++) {
          let options1 = options[m].options
          if (options1[j] !== '') {
            if (options1[j].state === '1') {
              twoFlag.push(options1[j].key)
              continue
            }
            options1[j].options = options1[j].options || []
            for (let k = 0; k < options1[j].options.length; k++) {
              let options2 = options1[j].options
              if (options2[k] && (options2[k].state === '1')) {
                threeFlag.push(options2[k].key)
              }
            }
          }
        }
      }
    }
  }
  for (let i = 0; i < diccm.length; i++) {
    let options = diccm[i].options || []
    for (let m = 0; m < options.length; m++) {
      if (options[m] !== '') {
        if (oneFlag.length > 0) {
          if (oneFlag.indexOf(options[m].key)) {
            options.splice(m, 1)
            m = m - 1
            continue
          }
        }
        options[m].options = options[m].options || []
        for (let j = 0; j < options[m].options.length; j++) {
          let options1 = options[m].options
          if (options1[j] !== '') {
            if (twoFlag.length > 0) {
              if (twoFlag.indexOf(options1[j].key)) {
                options1.splice(j, 1)
                continue
              }
            }
            options1[j].options = options1[j].options || []
            for (let k = 0; k < options1[j].options.length; k++) {
              let options2 = options1[j].options
              if (options2[k] !== '') {
                if (threeFlag.length > 0) {
                  if (threeFlag.indexOf(options2[k].key)) {
                    options2.splice(k, 1)
                    continue
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  commit(types.SET_OPTIONS_DICMAP, diccm)
}

export const getToken = ({ commit, state }, data) => {
  return user.getTokenId(data)
    .then(
      response => {
        let data = response
        commit(types.USER_TOKEN, { data })
        return response
      }
    )
}

export const userEdit = ({commit}, data) => {
  return user.editUser(data).then(response => {
    if (response.success) {
      if (data.password) {
        data.password = data.password
      }
      commit(types.USER_EDIT, data)
    }
    return response.success
  })
}

export const getImTestQiniuToken = () => {
  return common.getWeinxinQiniuUptoken()
}

/**
 * 更改邀请多方会话的窗口的展示情况
 * */
export const changeInvite = ({ commit }, data) => {
  commit(types.CHANGE_STATE_INVITECON, data)
}

/**
 * 重新发送邮箱验证码
 * @param {Object} data
 * @param {String} data.lastCodeKey
 */
export const retryMail2Authcode = ({ commit }, data) => {
  return loginApi.retryMail2Authcode(data)
    .catch(err => {
      console.error(err)
      commit(types.SET_ERROR, 'message.default_tips')
    })
}
