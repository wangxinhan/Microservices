import * as types from './mutation-types'
import * as globalTypes from '../../mutation-types'
import {getCache, getCacheByKey} from '../../actions' // getCache, refreshCacheFromDb,
import qualityCheck from '../../api/quality-check'
import business from '../../api/business'
import * as utils from '../../../utils/m7Utils'

export const queryRecordWebchatSessionLog = ({commit, rootState}, data) => {
  return qualityCheck.queryRecordWebchatSessionLog(data).then(res => {
    if (res.success) {
      res.list.forEach((item) => {
        rootState.session.dicMap.agents.forEach((agent) => {
          if (agent._id === item.userId) {
            item.user = agent.displayName + '【' + agent.exten + '】'
            return
          }
        })
      })
      commit(types.RECORD_LIST, res)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const queryRecordCallListenLog = ({commit, rootState}, data) => {
  return qualityCheck.queryRecordCallListenLog(data).then(res => {
    if (res.success) {
      res.list.forEach((item) => {
        rootState.session.dicMap.agents.forEach((agent) => {
          if (agent._id === item.userId) {
            item.user = agent.displayName + '【' + agent.exten + '】'
            return
          }
        })
      })
      commit(types.RECORD_LIST, res)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const saveWebchatSessionGrade = ({commit, rootState}, data) => {
  return qualityCheck.saveWebchatSessionGrade(data).then(res => {
    if (res.success) {
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const recordWebchatSessionLog = ({commit}, data) => {
  return qualityCheck.recordWebchatSessionLog(data).then(res => {
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const formatData = ({commit, state, rootState, dispatch}, data) => {
  return new Promise(function (resolve) {
    getCacheByKey({commit, state: rootState}, {
      type: 'qualityCheckTemplates',
      key: '_id',
      value: data.TEMPLATE
    }).then(temp => {
      let maxGrade = data.maxGrade
      delete data.maxGrade
      if (data.user && !data.user.length) {
        delete data.user
      }
      if (data.grade_user && !data.grade_user.length) {
        delete data.grade_user
      }
      if (data.toPeer && !data.toPeer.length) {
        delete data.toPeer
      }
      if (data.callTime && data.callTime.length) {
        delete data.callTime
      }
      if (data.DISPOSAL_AGENT && !data.DISPOSAL_AGENT.length) {
        delete data.DISPOSAL_AGENT
      }
      if (data.CONNECT_TYPE && !data.CONNECT_TYPE.length) {
        delete data.CONNECT_TYPE
      }
      if (data.ERROR_MEMO && !data.ERROR_MEMO.length) {
        delete data.ERROR_MEMO
      }
      if (data.GRADE_USER && !data.GRADE_USER.length) {
        delete data.GRADE_USER
      }
      delete data.checkTime
      delete data.claimTime
      if (data.CALL_TIME_LENGTH_BEGIN && data.CALL_TIME_LENGTH_END) {
        let arraySta = parseInt(data.CALL_TIME_LENGTH_BEGIN)
        let arrayEnd = parseInt(data.CALL_TIME_LENGTH_END)
        if (arrayEnd <= arraySta) {
          commit(globalTypes.SET_ERROR, 'qualityCheck.callTimeError')
          return
        }
      } else if (data.CALL_TIME_LENGTH_END === '0') {
        commit(globalTypes.SET_ERROR, 'qualityCheck.callTimeError')
        return
      }
      if (!maxGrade && (parseInt(data.GRADE_MIN) < 0 || parseInt(data.GRADE_MAX) > 100 || parseInt(data.GRADE_MIN) > 100)) {
        commit(globalTypes.SET_ERROR, 'qualityCheck.gradeParamError')
        return
      }
      if (parseInt(data.GRADE_MIN) > parseInt(maxGrade) || parseInt(data.GRADE_MIN) < 0) {
        commit(globalTypes.SET_ERROR, 'qualityCheck.gradeParamError')
        return
      }
      if (parseInt(data.GRADE_MAX) > parseInt(maxGrade) || parseInt(data.GRADE_MAX) < 0) {
        commit(globalTypes.SET_ERROR, 'qualityCheck.gradeParamError')
        return
      }
      if (parseInt(data.GRADE_MAX) < parseInt(data.GRADE_MIN)) {
        commit(globalTypes.SET_ERROR, 'qualityCheck.gradeParamError')
        return
      }
      let query = getSearchCondition(data)
      if (query.LEVEL) {
        var curTemplate = temp
        if (query.LEVEL === 'A') {
          query.GRADE_AMOUNT = {$gte: parseFloat(curTemplate['A-begin']) - 0.5}
        } else if (query.LEVEL === 'B') {
          query.GRADE_AMOUNT = {
            $gte: parseFloat(curTemplate['B-begin']) - 0.5,
            $lte: parseFloat(curTemplate['B-end']) + 0.4
          }
        } else if (query.LEVEL === 'C') {
          query.GRADE_AMOUNT = {
            $gte: parseFloat(curTemplate['C-begin']) - 0.5,
            $lte: parseFloat(curTemplate['C-end']) + 0.4
          }
        } else if (query.LEVEL === 'D') {
          query.GRADE_AMOUNT = {$lte: parseFloat(curTemplate['D-end']) + 0.4}
        }
        delete query.LEVEL
      }
      // let floors = data.floors
      delete query.floors
      resolve({temp, query})
    })
  })
}

export const formatDataExcel = ({commit, state, rootState, dispatch}, data) => {
  return new Promise(function (resolve) {
    getCacheByKey({commit, state: rootState}, {
      type: 'qualityCheckTemplates',
      key: '_id',
      value: data.TEMPLATE
    }).then(temp => {
      if (temp.QUALITY_TYPE === 'qualityWebchat') {
/*        if (data.user && !data.user.length) {
          delete data.user
        }
        if (data.grade_user && !data.grade_user.length) {
          delete data.grade_user
        }
        if (data.toPeer && !data.toPeer.length) {
          delete data.toPeer
        } */
        data.user = data.user.join(',')
        data.grade_user = data.grade_user.join(',')
        data.toPeer = data.toPeer.join(',')
      } else {
        data.GRADE_USER = data.GRADE_USER.join(',')
        data.ERROR_MEMO = data.ERROR_MEMO.join(',')
        data.DISPOSAL_AGENT = data.DISPOSAL_AGENT.join(',')
        data.CONNECT_TYPE = data.CONNECT_TYPE.join(',')
      }
      let query = getSearchCondition(data)
      // 查总分时，传空字符串
      if (!query.GRADE_CONFIG) {
        query.GRADE_CONFIG = ''
      }
      resolve({temp, query})
    })
  })
}
/**
 * 质检结果查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise<R>|Promise.<T>}
 */
export const queryQualityCheckList = ({commit, state, rootState, dispatch}, data) => {
  // 查找templete
  getCacheByKey({commit, state: rootState}, {
    type: 'qualityCheckTemplates',
    key: '_id',
    value: data.TEMPLATE
  }).then(temp => {
    if (temp && temp.QUALITY_TYPE === 'qualityWebchat') {
      return formatData({commit, state, rootState, dispatch}, data).then((res) => {
        // 在线咨询质检结果查询
        return queryWebchatQualityCheckList({commit, state, rootState, dispatch}, res.query)
      }).catch(err => {
        console.log(err)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      })
    } else {
      return formatData({commit, state, rootState, dispatch}, data).then((res) => {
        // 通话质检结果查询
        return queryCallQualityCheckList({commit, state, rootState, dispatch}, res.query)
      }).catch(err => {
        console.log(err)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      })
    }
  })
}

var getSearchCondition = (data) => {
  let conditon = {}
  for (var key in data) {
    if (data[key]) {
      conditon[key] = data[key]
    }
  }
  return conditon
}

/**
 * 在线咨询质检结果查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise<R>|Promise.<T>}
 */
export const queryWebchatQualityCheckList = ({commit, rootState}, data) => {
  return qualityCheck.queryWebchatGradeList(data).then(res => {
    if (res.success) {
      for (let i = 0; i < res.list.length; i++) {
        let item = res.list[i]
        item.userName = utils.getCache('agents', item.user).displayName
        item.gradeUserName = utils.getCache('agents', item.grade_user).displayName
        for (let j = 0; j < rootState.session.dicMap.mailQueues.length; j++) {
          if (rootState.session.dicMap.mailQueues[j].Exten === item.toPeer) {
            item.queueName = rootState.session.dicMap.mailQueues[j].DisplayName
            break
          }
        }
        item.qtime = utils.getFormatDateTime(new Date(item.grade_time))
      }
      commit(types.QCLIST, res)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

/**
 * 通话质检结果查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise<R>|Promise.<T>}
 */
export const queryCallQualityCheckList = ({commit, rootState}, data) => {
  let userPower = rootState.session.user
  return qualityCheck.queryCallSheetGradeList(data).then(res => {
    if (res.success) {
      let list = res.list
      let p1 = _getSatisfaction({commit, state: rootState}, 'options')
      return Promise.all([p1]).then(([options]) => {
        let labelData = utils.getCache('callLabel')
        for (let i = 0; i < list.length; i++) {
          // 处理座席
          let userName = ''
          if (list[i].DISPOSAL_AGENT && list[i].DISPOSAL_AGENT !== '') {
            let user = utils.getCache('agents', list[i].DISPOSAL_AGENT)
            if (user) {
              userName = user.displayName + '[' + user.exten + ']'
            }
          }
          list[i].DISPOSAL_AGENT = userName
          // 呼叫类型
          let CONNECT_TYPE = ''
          if (utils.getCacheByKey('callType', 'code_value', list[i].CONNECT_TYPE) != null) {
            CONNECT_TYPE = utils.getCacheByKey('callType', 'code_value', list[i].CONNECT_TYPE).code_name
          }
          if (list[i].CONNECT_TYPE != null) {
            if (list[i].CONNECT_TYPE === 'dialout') {
              list[i].CALLED_NO_SHOW = utils.checkHideTel(list[i].CALLED_NO, userPower)
              list[i].CALL_NO_SHOW = list[i].CALL_NO
            } else {
              list[i].CALLED_NO_SHOW = list[i].CALLED_NO
              list[i].CALL_NO_SHOW = utils.checkHideTel(list[i].CALL_NO, userPower)
            }
          }
          list[i].CONNECT_TYPE = CONNECT_TYPE
          // 满意度
          let satisfaction = ''
          let appraiseKey = list[i].INVESTIGATE ? list[i].INVESTIGATE : ''
          if (appraiseKey === '') {
            satisfaction = ''
          } else {
            for (var n = 0; n < options.length; n++) {
              if (options[n].options[0].name === appraiseKey) {
                satisfaction = options[n].name
                break
              }
            }
          }
          list[i].INVESTIGATE = satisfaction
          // 技能组
          let queueName = ''
          if (utils.getCacheByKey('queues', 'Exten', list[i].ERROR_MEMO) != null) {
            queueName = utils.getCacheByKey('queues', 'Exten', list[i].ERROR_MEMO).DisplayName
          }
          list[i].ERROR_MEMO = queueName
          // 质检人员
          let qualityNum = ''
          if (list[i].GRADE_USER && list[i].GRADE_USER !== '') {
            let user = utils.getCache('agents', list[i].GRADE_USER)
            if (user) {
              qualityNum = user.displayName + '[' + user.exten + ']'
            }
          }
          list[i].GRADE_USER = qualityNum
          // 通话标签
          let label = ''
          if (labelData !== -1) {
            // dicMap里有通话标签
            if (list[i].LABELS && list[i].LABELS.length > 0) {
              for (let y = 0; y < list[i].LABELS.length; y++) {
                let first = list[i].LABELS[y]
                if (first.indexOf('@') !== -1) {
                  let multi = ''
                  for (let h = 0; h < first.split('@').length; h++) {
                    if (first.split('@')[h]) {
                      multi += getAllUseCallLabel(first.split('@')[h]) + '-'
                    }
                  }
                  multi = multi.substring(0, multi.length - 1)
                  label += multi + ','
                } else {
                  label += utils.getCache('callLabel', first).name + ','
                }
              }
            }
            list[i].LABELS = label.substring(0, label.length - 1)
          } else {
            list[i].LABELS = ''
          }
          // 服务质量标签
          let SQ_LABEL = ''
          if (utils.getCacheByKey('sqLabels', '_id', list[i].SQ_LABEL) != null) {
            SQ_LABEL = utils.getCacheByKey('sqLabels', '_id', list[i].SQ_LABEL).name
          }
          list[i].SQ_LABEL = SQ_LABEL
          // pass选项和总体
          if (typeof list[i].GRADE_AMOUNT === 'object') {
            for (let option in list[i].GRADE_AMOUNT) {
              if (list[i].GRADE_AMOUNT[option] === 'yes') {
                list[i].GRADE_AMOUNT[option] = '通过'
              } else if (list[i].GRADE_AMOUNT[option] === 'no') {
                list[i].GRADE_AMOUNT[option] = '不通过'
              } else {
                list[i].GRADE_AMOUNT[option] = '不涉及'
              }
            }
            if (list[i].GRADE_AMOUNT && list[i].GRADE_AMOUNT.amount) {
              for (let v in list[i].GRADE_AMOUNT) {
                list[i][v] = list[i].GRADE_AMOUNT[v]
              }
            }
          }
          // 呼叫时长
          if (list[i].CALL_TIME_LENGTH) {
            list[i].CALL_TIME_LENGTH = utils.millsToDate(list[i].CALL_TIME_LENGTH * 1000)
          }
          /* let chatDuration = '00:00:00'
          if (list[i].BEGIN_TIME && list[i].END_TIME) {
            chatDuration = utils.millsToDate(new Date(list[i].END_TIME).getTime() - new Date(list[i].BEGIN_TIME).getTime())
          }
          list[i].CALL_TIME_LENGTH = chatDuration */
        }
        /* commit(types.SEARCHLIST, {
          list: res.list,
          page: data.page,
          count: res.count,
          menuId: data.menuId,
          type: 'normalCallCheck'
        }) */
        commit(types.QCLIST, res)
      })
    } else {
      commit(globalTypes.SET_ERROR, 'qualityCheck.searchError')
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

function getAllUseCallLabel (id) {
  let label = ''
  let allLabels = []
  let objList = utils.getCache('callLabel')
  for (let i = 0; i < objList.length; i++) {
    if (objList[i].type === 'single') {
      allLabels.push(objList[i])
    } else {
      allLabels.push(objList[i])
      if (objList[i].child) {
        for (let y = 0; y < objList[i].child.length; y++) {
          allLabels.push(objList[i].child[y])
          if (objList[i].child[y].child) {
            for (let h = 0; h < objList[i].child[y].child.length; h++) {
              allLabels.push(objList[i].child[y].child[h])
            }
          }
        }
      }
    }
  }
  for (let z = 0; z < allLabels.length; z++) {
    if (id === allLabels[z]._id) {
      label = allLabels[z].name
      break
    }
  }
  return label
}

/**
 * 在线咨询座席质检查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {*|Promise.<TResult>|Promise<R2|R1>|Promise<R>}
 */
export const queryWebchatGradeResult = ({commit}, data) => {
  return qualityCheck.queryWebchatGradeResult(data).then(res => {
    if (res.success) {
      for (let i = 0; i < res.list.length; i++) {
        let item = res.list[i]
        let agents = utils.getCache('agents', item.user)
        if (agents && agents.displayName) {
          item.DISPOSAL_AGENT = agents.displayName + '[' + agents.exten + ']'
        }
      }
      commit(types.QCRESULT, res)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

/**
 * 通话座席质检查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {*|Promise.<TResult>|Promise<R2|R1>|Promise<R>}
 */
export const queryCallSheetGradeResult = ({commit}, data) => {
  return qualityCheck.queryCallSheetGradeResult(data).then(res => {
    if (res.success) {
      for (let i = 0; i < res.list.length; i++) {
        let item = res.list[i]
        let agents = utils.getCache('agents', item.DISPOSAL_AGENT)
        if (agents && agents.displayName) {
          item.DISPOSAL_AGENT = agents.displayName + '[' + agents.exten + ']'
        }
      }
      commit(types.QCRESULT, res)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 质检结果排名
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {*|Promise.<TResult>|Promise<R2|R1>|Promise<R>}
 */
export const agenCalltRanking = ({commit, rootState}, data) => {
  return getCache({commit, state: rootState}, {type: 'agents'}
  ).then(() => {
    return qualityCheck.agentRanking(data)
  }).then(res => {
    if (res.success) {
      // 排序
      if (res.list || res.list.length !== 0) {
        // _quickSort(res.list, 0, res.list.length - 1, res.type)
        res.list = res.list.sort(function (a, b) {
          let n1
          if (res.type === 'pass') {
            n1 = b.all_cent.split('%')[0] - a.all_cent.split('%')[0]
          } else {
            if (!b.all_cent) {
              b.all_cent = 0
            }
            if (!a.all_cent) {
              a.all_cent = 0
            }
            n1 = b.all_cent - a.all_cent
          }
          return n1
        })
      }
      let rankingagenthtml = []
      let rankingagenthead = []
      if (res.type === 'pass') {
        rankingagenthead.push({name: '排名', order: '0'})
        rankingagenthead.push({name: '座席人员', order: '1'})
        rankingagenthead.push({name: '通过率', order: '2'})
      } else {
        rankingagenthead.push({name: '排名', order: '0'})
        rankingagenthead.push({name: '座席人员', order: '1'})
        rankingagenthead.push({name: '平均得分', order: '2'})
      }
      for (let i = 0, len = res.list.length; i < len; i++) {
        for (let j = 0, selen = res.agentlist.length; j < selen; j++) {
          let rankAgent = res.list[i].DISPOSAL_AGENT ? res.list[i].DISPOSAL_AGENT : res.list[i].user
          if (res.agentlist[j] === rankAgent) {
            rankingagenthtml.push([parseInt(i + 1), utils.getCache('agents', rankAgent) ? (utils.getCache('agents', rankAgent).displayName) : '', res.list[i].all_cent])
            continue
          }
        }
      }
      commit(types.AGENT_RANKING, {
        list: res.list,
        rankingagenthead,
        rankingagenthtml,
        agentlist: res.agentlist
      })
    }
  })
}

/**
 * 在线咨询座席质检查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {*|Promise.<TResult>|Promise<R2|R1>|Promise<R>}
 */
export const agentChatRanking = ({commit, rootState}, data) => {
  return getCache({commit, state: rootState}, {type: 'agents'}
  ).then(() => {
    return qualityCheck.agentChatRanking(data)
  }).then(res => {
    if (res.success) {
      // 排序
      if (res.list || res.list.length !== 0) {
        // _quickSort(res.list, 0, res.list.length - 1, res.type)
        res.list = res.list.sort(function (a, b) {
          let n1
          if (!b.all_cent) {
            b.all_cent = 0
          }
          if (!a.all_cent) {
            a.all_cent = 0
          }
          n1 = b.all_cent - a.all_cent
          return n1
        })
      }
      let rankingagenthtml = []
      let rankingagenthead = []
      if (res.type === 'pass') {
        rankingagenthead.push({name: '排名', order: '0'})
        rankingagenthead.push({name: '座席人员', order: '1'})
        rankingagenthead.push({name: '通过率', order: '2'})
      } else {
        rankingagenthead.push({name: '排名', order: '0'})
        rankingagenthead.push({name: '座席人员', order: '1'})
        rankingagenthead.push({name: '平均得分', order: '2'})
      }
      for (let i = 0, len = res.list.length; i < len; i++) {
        for (let j = 0, selen = res.agentlist.length; j < selen; j++) {
          let rankAgent = res.list[i].DISPOSAL_AGENT ? res.list[i].DISPOSAL_AGENT : res.list[i].user
          if (res.agentlist[j] === rankAgent) {
            rankingagenthtml.push([parseInt(i + 1), utils.getCache('agents', rankAgent) ? (utils.getCache('agents', rankAgent).displayName) : '', res.list[i].all_cent])
            continue
          }
        }
      }
      commit(types.AGENT_RANKING, {
        list: res.list,
        rankingagenthead,
        rankingagenthtml,
        agentlist: res.agentlist
      })
    }
  })
}

/**
 * 质检座席查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const queryGradeResult = ({commit, state, rootState, dispatch}, data) => {
  data.pageSize = state.queryGradeResult.pageSize
  data.page = data.page || 1 // 分页查询需要传date.page
  let query = getSearchCondition(data)
  return getCacheByKey({commit, state: rootState}, {
    type: 'qualityCheckTemplates',
    key: '_id',
    value: data.TEMPLATE
  }).then(temp => {
    if (temp && temp.QUALITY_TYPE === 'qualityWebchat') {
      // 在线咨询座席质检查询
      return queryWebchatGradeResult({commit, state, rootState, dispatch}, query)
    } else {
      // todo通话座席质检查询
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

/**
 *
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data.TEMPLATE
 * @param data.RANKING_AGENT  //参与排名的座席
 */
export const agentRanking = ({commit, state, rootState, dispatch}, data) => {
  if (data.RANKING_AGENT && data.RANKING_AGENT !== '') {
    data.RANKING_AGENT = data.RANKING_AGENT.split(/,/g)
    data.RANKING_AGENT.shift()
  }
  return getCacheByKey({commit, state: rootState}, {
    type: 'qualityCheckTemplates',
    key: '_id',
    value: data.TEMPLATE
  }).then(temp => {
    if (temp && temp.QUALITY_TYPE === 'qualityWebchat') {
      // 在线咨询座席排名
      return agentChatRanking({commit, state, rootState, dispatch}, data)
    } else {
      // todo 通话座席排名
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const exportQualityCheckExcel = ({commit}, data) => {
  return qualityCheck.exportQualityCheckExcel(data)
    .then(
      response => {
        if (response.Succeed) {
          commit(globalTypes.SET_FILEDOWNLOAD, {path: response.path, isSession: true})
        } else {
          commit(globalTypes.SET_ERROR, 'message.default_tips')
        }
      }
    ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
}

export const exportQualityCheckResultExcel = ({commit, state, rootState, dispatch}, data) => {
  return formatDataExcel({commit, state, rootState, dispatch}, data.Query).then((res) => {
    data.Query = res.query
    qualityCheck.exportQualityCheckExcel(data)
      .then(
        response => {
          if (response.Succeed) {
            commit(globalTypes.SET_FILEDOWNLOAD, {path: response.path, isSession: true})
          } else {
            commit(globalTypes.SET_ERROR, 'message.default_tips')
          }
        }
      ).catch(
      (e) => {
        console.log(e)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    )
  })
}

var _quickSort = (rankinglist, low, high, type) => {
  if (low < high) {
    let middle = getMiddle(rankinglist, low, high, type)  // 将list数组进行一分为二
    _quickSort(rankinglist, low, middle - 1, type)        // 对低字表进行递归排序
    _quickSort(rankinglist, middle + 1, high, type)       // 对高字表进行递归排序
  }
}
var getMiddle = (list, low, high, type) => {
  let tmp = list[low]    // 数组的第一个作为中轴
  while (low < high) {
    if (type === 'pass') {
      while (low < high && parseInt(list[high].all_cent.substr(0, list[high].all_cent.length - 1)) <= parseInt(tmp.all_cent.substr(0, tmp.all_cent.length - 1))) {
        high--
      }
      list[low] = list[high]   // 比中轴小的记录移到低端
      while (low < high && parseInt(list[low].all_cent.substr(0, list[low].all_cent.length - 1)) >= parseInt(tmp.all_cent.substr(0, tmp.all_cent.length - 1))) {
        low++
      }
      list[high] = list[low] // 比中轴大的记录移到高端
    } else {
      while (low < high && parseFloat(list[high].all_cent) <= parseFloat(tmp.all_cent)) {
        high--
      }
      list[low] = list[high]   // 比中轴小的记录移到低端
      while (low < high && parseFloat(list[low].all_cent) >= parseFloat(tmp.all_cent)) {
        low++
      }
      list[high] = list[low]// 比中轴大的记录移到高端
    }
  }
  list[low] = tmp              // 中轴记录到尾
  return low                   // 返回中轴的位置
}

/**
 * 普通查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data.TEMPLATE
 */
export const normalSearch = ({commit, state, rootState, dispatch}, data) => {
  data.pageSize = state.searchList.pageSize
  data.page = data.page || 1
  return getCacheByKey({commit, state: rootState}, {
    type: 'qualityCheckTemplates',
    key: '_id',
    value: data.TEMPLATE
  }).then(temp => {
    delete data.TEMPLATE
    if (temp && temp.QUALITY_TYPE === 'qualityWebchat') {
      // 在线咨询座席排名
      return normalWebchatSearch({commit, state, rootState, dispatch}, data)
    } else {
      // todo 通话普通查询
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 获取条件模板
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const getQualityCheckRandomTemplates = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.getQualityCheckRandomTemplates({}).then(res => {
    if (res.success) {
      commit(types.RANDOM_TEMPLETE, res.list)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 条件查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data.templateId 条件模板id
 */
export const conditionSearch = ({commit, state, rootState, dispatch}, data) => {
  data.pageSize = state.searchList.pageSize
  data.page = data.page || 1
  return new Promise((resolve, reject) => {
    let conditionTemp = state.randomTemplete[data.templateId]
    if (conditionTemp) {
      if (conditionTemp && conditionTemp.QUALITY_TYPE === 'qualityWebchat') {
        // 在线咨询座席排名
        let p = conditionWebchatSearch({commit, state, rootState, dispatch}, data)
        resolve(p)
      } else {
        // todo 通话普通查询
      }
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 条件模板删除
 * @param data.templateId 条件模板id
 */
export const removeQualityCheckRandomTemplates = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.removeQualityCheckRandomTemplates(data).then(res => {
    return res.success
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 条件模板添加（通话）
 */
export const addQualityCheckRandomTemplates = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.addQualityCheckRandomTemplates(data).then(res => {
    if (res.success) {
      return dispatch('getCache', {type: 'qualityConditionTemplates'}).then(() => {
        let qualityConditionTemplates = rootState.session.dicMap.qualityConditionTemplates
        if (res.condition && qualityConditionTemplates.indexOf(res.condition) === -1) {
          commit(globalTypes.PUSH_CONDITION_TEM, res.condition)
        }
        return res
      })
    } else {
      return res
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 条件模板添加（在线咨询）
 */
export const addOrSelectRandomTemplate = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.addOrSelectRandomTemplate(data).then(res => {
    if (res.success) {
      return dispatch('getCache', {type: 'qualityConditionTemplates'}).then(() => {
        let qualityConditionTemplates = rootState.session.dicMap.qualityConditionTemplates
        if (res.condition && qualityConditionTemplates.indexOf(res.condition) === -1) {
          commit(globalTypes.PUSH_CONDITION_TEM, res.condition)
        }
        return res
      })
    } else {
      return res
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 通话质检关联工单查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data.callId 通话id
 * @param data.customer 客户id
 */
export const queryBusiness = ({commit, state, rootState, dispatch}, data) => {
  return business.getCustomerHistoryBusiness(data).then(res => {
    // commit(types.SEARCHLIST, {
    //  list: res.list,
    //  page: data.page,
    //  count: res.count,
    //  menuId: data.menuId,
    //  type: 'normalCallCheck'
    // })
    if (res.success) {
      return res.data
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 试听日志
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data.CALL_SHEET_ID 通话id
 */
export const recordListenLog = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.recordListenLog(data).then(res => {
    return res
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 通话普通查询模式
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>|Promise<R>}
 */
export const normalCallSearch = ({commit, state, rootState, dispatch}, data) => {
  if (data.beginTime && data.beginTime.length) {
    delete data.beginTime
  }
  let query = getSearchCondition(data)
  let userPower = rootState.session.user
  return qualityCheck.getQualityCheckCallSheet(query).then(res => {
    if (res.success) {
      let list = res.list
      let p1 = _getSatisfaction({commit, state: rootState}, 'options')
      return Promise.all([p1]).then(([options]) => {
        for (let i = 0; i < list.length; i++) {
          // 处理座席
          let userName = ''
          if (list[i].DISPOSAL_AGENT && list[i].DISPOSAL_AGENT !== '') {
            let user = utils.getCache('agents', list[i].DISPOSAL_AGENT)
            if (user) {
              userName = user.displayName + '[' + user.exten + ']'
            }
          }
          list[i].DISPOSAL_AGENT_show = userName
          // 呼叫类型
          let CONNECT_TYPE = ''
          if (utils.getCacheByKey('callType', 'code_value', list[i].CONNECT_TYPE) != null) {
            CONNECT_TYPE = utils.getCacheByKey('callType', 'code_value', list[i].CONNECT_TYPE).code_name
          }
          if (list[i].CONNECT_TYPE != null) {
            if (list[i].CONNECT_TYPE === 'dialout') {
              list[i].CALLED_NO_SHOW = utils.checkHideTel(list[i].CALLED_NO, userPower)
              list[i].CALL_NO_SHOW = list[i].CALL_NO
            } else {
              list[i].CALLED_NO_SHOW = list[i].CALLED_NO
              list[i].CALL_NO_SHOW = utils.checkHideTel(list[i].CALL_NO, userPower)
            }
          }
          list[i].CONNECT_TYPE_show = CONNECT_TYPE
          // 接听状态
          let STATUS = ''
          if (utils.getCacheByKey('callStatus', 'code_value', list[i].STATUS) != null) {
            STATUS = utils.getCacheByKey('callStatus', 'code_value', list[i].STATUS).code_name
          }
          list[i].STATUS_show = STATUS
          // 满意度
          let satisfaction = ''
          let appraiseKey = list[i].INVESTIGATE ? list[i].INVESTIGATE : ''
          if (appraiseKey === '') {
            satisfaction = ''
          } else {
            for (var n = 0; n < options.length; n++) {
              if (options[n].options[0].name === appraiseKey) {
                satisfaction = options[n].name
                break
              }
            }
          }
          list[i].INVESTIGATE_show = satisfaction
          // 呼叫时长
          let chatDuration = '00:00:00'
          if (list[i].BEGIN_TIME && list[i].END_TIME) {
            chatDuration = utils.millsToDate(new Date(list[i].END_TIME).getTime() - new Date(list[i].BEGIN_TIME).getTime())
          }
          list[i].CALL_TIME_LENGTH_show = chatDuration
        }
        commit(types.SEARCHLIST, {
          list: res.list,
          page: data.page,
          count: res.count,
          menuId: data.menuId,
          type: 'normalCallCheck'
        })
        commit(types.TEMPLIST, {list: list, concat: false})
        return res.selectedId
      })
    } else {
      commit(globalTypes.SET_ERROR, 'qualityCheck.searchError')
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 在线咨询抽取查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @returns {Promise.<T>|Promise<R>}
 */
export const webchatSearch = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.getQualityCheckWebchatSession(data).then(res => {
    if (res.success) {
      let list = res.list
      let p1 = getCache({commit, state: rootState}, {type: 'agents'})
      let p2 = getCache({commit, state: rootState}, {type: 'mailQueues'})
      let p3 = _getChannelDic({commit, state: rootState}, 'webchatCSR')
      return Promise.all([p1, p2, p3]).then(([agents, mailQueues, wechatCSR]) => {
        for (let i = 0; i < list.length; i++) {
          let userName = ''
          if (list[i].user && list[i].user !== '') {
            let user = utils.getCache('agents', list[i].user)
            userName = user.displayName + '[' + user.exten + ']'
          }
          list[i].userName = userName
          let toPeerName = ''
          if (utils.getCacheByKey('mailQueues', 'Exten', list[i].toPeer) != null) {
            toPeerName = utils.getCacheByKey('mailQueues', 'Exten', list[i].toPeer).DisplayName
          }
          list[i].toPeerName = toPeerName
          let satisfaction = ''
          let appraiseKey = list[i].appraiseKey ? list[i].appraiseKey : ''
          if (appraiseKey === '') {
            satisfaction = ''
          } else {
            for (var n = 0; n < wechatCSR.length; n++) {
              if (wechatCSR[n].key === appraiseKey) {
                satisfaction = wechatCSR[n].name
              }
            }
          }
          list[i].satisfaction = satisfaction
          let ts = list[i].lastTimeStamp
          if (ts) {
            let date = new Date()
            date.setTime(ts)
            let desc = utils.getFormatDateTime(date)
            list[i].lastTimeDesc = desc
          }
          let chatDuration = '00:00:00'
          if (list[i].lastTimeDesc && list[i].manualTime) {
            chatDuration = utils.millsToDate(new Date(list[i].lastTimeDesc).getTime() - new Date(list[i].manualTime).getTime())
          }
          list[i].chatDuration = chatDuration
          if (!list[i].beginTime) {
            list[i].beginTime = ''
          }
          if (!list[i].totalMsgCount) {
            list[i].totalMsgCount = 0
          }
          if (list[i].sourceName && list[i].sName) {
            list[i].custName = list[i].sName
          }
          if (!list[i].sourceName) {
            list[i].sourceName = list[i].sName
          }
          if (list[i].firstReplyTime) {
            list[i].firstTime = utils.getFormatDateTime(new Date(list[i].firstReplyTime))
          }
        }
        commit(types.SEARCHLIST, {
          list: list,
          page: data.page,
          count: res.count,
          menuId: data.menuId,
          type: 'qualityWebchat'
        })
        commit(types.TEMPLIST, {list: list, concat: false})
      })
    } else {
      commit(globalTypes.SET_ERROR, 'qualityCheck.searchError')
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 在线咨询普通查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const normalWebchatSearch = ({commit, state, rootState, dispatch}, data) => {
  if (data.beginTimeBegin && data.beginTimeEnd) {
    let arraySta = parseInt(data.beginTimeBegin.replace(/-/g, '').replace(/:/g, '').replace(/ /g, ''))
    let arrayEnd = parseFloat(data.beginTimeEnd.replace(/-/g, '').replace(/:/g, '').replace(/ /g, ''))
    if (arrayEnd <= arraySta) {
      commit(globalTypes.SET_ERROR, 'qualityCheck.searchTimeError')
      return
    }
  }
  data.menuId = 'quality_check_query'
  return webchatSearch({commit, state, rootState, dispatch}, data)
}
/**
 * 在线咨询条件查询
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const conditionWebchatSearch = ({commit, state, rootState, dispatch}, data) => {
  data.menuId = 'quality_check_query_random'
  return webchatSearch({commit, state, rootState, dispatch}, data)
}

let _getChannelDic = ({commit, state}, type) => {
  return getCache({commit, state}, {type: 'channelDic'}).then(dics => {
    let _dics = []
    for (let i = 0; i < dics.length; i++) {
      var obj = dics[i]
      if (obj.type === type) {
        _dics = obj.options || []
        break
      }
    }
    return _dics
  })
}

let _getSatisfaction = ({commit, state}, type) => {
  return getCache({commit, state}, {type: type}).then(dics => {
    let _dics = []
    for (let i = 0; i < dics.length; i++) {
      var obj = dics[i]
      if (obj.name === '满意度调查选项') {
        _dics = obj.options || []
        break
      }
    }
    return _dics
  })
}

var getQualityCheckConfigs = ({commit, state, rootState, dispatch}, templateId) => {
  return getCacheByKey({commit, state: rootState}, {
    type: 'qualityCheckTemplates',
    key: '_id',
    value: templateId
  }).then((templete) => {
    let configs = templete.config
    var flog = false
    for (let ind in configs) {
      if (configs[ind].weight) {
        flog = true
        break
      }
    }
    if (flog) {
      configs = configs.sort(function (a, b) {
        if (parseInt(b.weight) !== parseInt(a.weight)) {
          return parseInt(b.weight) - parseInt(a.weight)
        } else {
          return parseInt(b.order) - parseInt(a.order)
        }
      })
    }
    return configs
  })
}
/**
 * 获取在线咨询详情页信息
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data._id
 * @param data.isReGrade 是否是重新评分
 * @param data.templateId 模板id
 */
export const showDetailviewWebchat = ({commit, state, rootState, dispatch}, data) => {
  let chat1 = null
  let currentGrade = null // 当前会话的评分信息，只有重新评分会有
  if (data.isReGrade) {
    chat1 = state.queryGradeList.sessionList.filter(obj => obj._id === data._id)[0]
    let currentGrade1 = state.queryGradeList.list.filter(obj => obj._id === data._id)[0]
    currentGrade = utils.deepClone(currentGrade1)
  } else {
    chat1 = state.searchList.list.filter(obj => obj._id === data._id)[0]
  }
  let chat = utils.deepClone(chat1)
  let p1 = getCache({commit, state: rootState}, {type: 'agents', id: chat.user})
  let p2 = getCacheByKey({commit, state: rootState}, {type: 'mailQueues', key: 'Exten', value: chat.toPeer})
  let p3 = _getChannelDic({commit, state: rootState}, 'webchatCSR')
  let p4 = getQualityCheckConfigs({commit, state, rootState, dispatch}, data.templateId)
  return Promise.all([p1, p2, p3, p4]).then(([agent, peer, _wechatCSR, config]) => {
    if (!Array.isArray(agent)) {
      chat.agentName = '[' + agent.exten + ']' + agent.displayName
    } else {
      chat.agentName = ''
    }
    if (peer == null) {
      peer = {}
      peer.DisplayName = ''
    }
    let ts = chat.lastTimeStamp
    if (ts) {
      let date = new Date()
      date.setTime(ts)
      let desc = utils.getFormatDateTime(date)
      chat.lastTimeDesc = desc
    }
    chat.duration = '00:00:00'
    chat.firstResponseTimeLength = ''
    if (chat.lastTimeDesc && chat.manualTime) {
      chat.duration = utils.millsToDate(new Date(chat.lastTimeDesc).getTime() - new Date(chat.manualTime).getTime())
    }
    if (chat.manualTime) {
      chat.manualTime = utils.getFormatDateTime(new Date(chat.manualTime)).split(' ')[1]
    }
    if (chat.endTime) {
      chat.endTime = utils.getFormatDateTime(new Date(chat.endTime))
    }
    if (chat.firstReplyTime) {
      chat.firstReplyTime = utils.getFormatDateTime(new Date(chat.firstReplyTime)).split(' ')[1]
    } else {
      chat.firstReplyTime = ''
    }
    if (chat.agentFirstReplyTime) {
      chat.agentFirstReplyTime = utils.getFormatDateTime(new Date(chat.agentFirstReplyTime)).split(' ')[1]
    }
    if (chat.seoSource === undefined || chat.seoSource === 'undefined') {
      chat.seoSource = ''
    }
    if (chat.seoKeywords === undefined || chat.seoKeywords === 'undefined') {
      chat.seoKeywords = ''
    }
    if (!chat.invitedUserName) {
      chat.invitedUserName = '无'
    }
    if (!chat.inviteUserStatus) {
      chat.inviteUserStatus = '未邀请'
    }
    if (chat.inviteUserStatus === 'undeal') {
      chat.inviteUserStatus = '未接受'
    } else if (chat.inviteUserStatus === 'accept') {
      chat.inviteUserStatus = '已接受'
    }
    if (chat.fromUrl === undefined || chat.fromUrl === 'undefined') {
      chat.fromUrl = ''
    }
    let satisfaction = ''
    let appraiseKey = chat.appraiseKey ? chat.appraiseKey : ''
    if (appraiseKey === '') {
      satisfaction = ''
    } else {
      for (let n = 0; n < _wechatCSR.length; n++) {
        if (_wechatCSR[n].key === appraiseKey) {
          satisfaction = _wechatCSR[n].name
        }
      }
    }
    let dialogInfo = {
      custId: chat.custId,
      user: chat.sName,
      beginTime: chat.beginTime,
      duration: chat.duration,
      firstReplyTime: chat.firstReplyTime,
      endTime: chat.endTime,
      totalMsgCount: chat.totalMsgCount,
      agentName: chat.agentName,
      finishReason: chat.finishReason,
      fromUrl: chat.fromUrl,          // 来源：fromUrl，
      urlTitle: chat.urlTitle,                  // 来源：urlTitle，
      area: chat.area,                 // 地域：area
      ip: chat.ip,                     // ip:ip
      seoSource: chat.seoSource,       // 搜索来源:seoSource
      seoKeywords: chat.seoKeywords,   // 关键字:seoKeywords
      DisplayName: peer.DisplayName,          // 所属技能组:toPeer
      satisfaction: satisfaction,
      sourceName: chat.sourceName ? chat.sourceName : '',
      isReGrade: data.isReGrade,
      config: config,
      currentGrade: currentGrade || {}
    }
    qualityCheck.recordWebchatSessionLog({_id: data._id})
    // todo 加载在线咨询聊天记录详情 handler.qualityCheck.QualityShowChatDetail(chat._id, chat.custId)
    commit(types.WEBCHAT_DETAIL, dialogInfo)
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const saveCallGradeForScore = ({commit, state, rootState, dispatch}, {data}) => {
  return qualityCheck.saveCallSheetGrade(data).then(res => {
    commit(types.GRADE_SUCCESS, data.CALL_SHEET_ID)
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const saveCallShellGrade = ({commit, state, rootState, dispatch}, {data}) => {
  return qualityCheck.saveCallShellGrade(data).then(res => {
    commit(types.GRADE_SUCCESS, data.CALL_SHEET_ID)
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

/**
 * 在线咨询质检评分
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 * @param data._id 质检条目id
 * @param data.TEMPLATE 质检模板id
 * @param data.COMMENTS 备注
 * @param data.values 单项分
 * @param data.grade 总分
 * @param data.isReGrade 是否是重新评分
 */
export const saveWebchatSheetGrade = ({commit, state, rootState, dispatch}, {data, currentItem}) => {
  let currentGrade = data.values || {}
  let grade = data.grade
  grade = parseFloat(grade)
  // todo 校验放在vue做
  return _getChannelDic({commit, state: rootState}, 'webchatCSR').then(_wechatCSR => {
    let _id = data._id
    if (data.isReGrade) {
      currentGrade._id = _id
      currentGrade.GRADE_AMOUNT = grade
      currentGrade.comments = data.COMMENT
    } else {
      currentGrade._id = _id
      currentGrade.comments = data.COMMENT
      currentGrade.beginTime = currentItem.beginTime
      currentGrade.user = currentItem.user
      currentGrade.sName = currentItem.sName
      currentGrade.toPeer = currentItem.toPeer
      currentGrade.finishKey = currentItem.finishKey
      currentGrade.appraiseKey = currentItem.appraiseKey ? currentItem.appraiseKey : ''
      if (currentGrade.appraiseKey === '') {
        currentGrade.satisfaction = ''
      } else {
        for (let i = 0; i < _wechatCSR.length; i++) {
          if (_wechatCSR[i].key === currentGrade.appraiseKey) {
            currentGrade.satisfaction = _wechatCSR[i].name
          }
        }
      }
      currentGrade.GRADE_AMOUNT = grade
      currentGrade.TEMPLATE = data.TEMPLATE
      currentGrade.totalMsgCount = currentItem.totalMsgCount
      currentGrade.totalDialLength = currentItem.totalDialLength
    }

    let postData = {
      _id: _id,
      comments: data.COMMENT,
      grade_data: currentGrade
    }
    return qualityCheck.saveWebchatSessionGrade(postData)
  }).then(res => {
    if (res.success) {
      if (data.isReGrade) {
        // 重新评分
      } else {
        if (state.searchList.list.length <= 0) {

        } else {
          // todo 评价下一条
          /* if (state.searchList.list.length < 5) {
           setTimeout(getMoreQualityCheckCallSheet, 1000)
           }
           showNextWebchatSheetGrade() */
        }
      }
    } else {
      commit(globalTypes.SET_ERROR, 'qualityCheck.gradeError')
      return
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

export const getMoreQualityCheckCallSheet = ({commit, rootState}, {data, tempList, type}) => {
  if (data.cdrId === 'quality_check_query_random' || data.menuId === 'quality_check_query_random') {
    data.reset = false
  }
  let userPower = rootState.session.user
  let lastCallSheet = tempList[tempList.length - 1]
  if (lastCallSheet) {
    if (type === 'webchat') {
      data.createTime = {'$lt': lastCallSheet.createTime}
      return qualityCheck.getQualityCheckWebchatSession(data).then(res => {
        if (res.success && res.list && res.list.length > 0) {
          let list = res.list
          let p1 = getCache({commit, state: rootState}, {type: 'agents'})
          let p2 = getCache({commit, state: rootState}, {type: 'mailQueues'})
          let p3 = _getChannelDic({commit, state: rootState}, 'webchatCSR')
          return Promise.all([p1, p2, p3]).then(([agents, mailQueues, wechatCSR]) => {
            for (let i = 0; i < list.length; i++) {
              let userName = ''
              if (list[i].user && list[i].user !== '') {
                let user = utils.getCache('agents', list[i].user)
                userName = user.displayName + '[' + user.exten + ']'
              }
              list[i].userName = userName
              let toPeerName = ''
              if (utils.getCacheByKey('mailQueues', 'Exten', list[i].toPeer) != null) {
                toPeerName = utils.getCacheByKey('mailQueues', 'Exten', list[i].toPeer).DisplayName
              }
              list[i].toPeerName = toPeerName
              let satisfaction = ''
              let appraiseKey = list[i].appraiseKey ? list[i].appraiseKey : ''
              if (appraiseKey === '') {
                satisfaction = ''
              } else {
                for (var n = 0; n < wechatCSR.length; n++) {
                  if (wechatCSR[n].key === appraiseKey) {
                    satisfaction = wechatCSR[n].name
                  }
                }
              }
              list[i].satisfaction = satisfaction
              let ts = list[i].lastTimeStamp
              if (ts) {
                let date = new Date()
                date.setTime(ts)
                let desc = utils.getFormatDateTime(date)
                list[i].lastTimeDesc = desc
              }
              let chatDuration = '00:00:00'
              if (list[i].lastTimeDesc && list[i].manualTime) {
                chatDuration = utils.millsToDate(new Date(list[i].lastTimeDesc).getTime() - new Date(list[i].manualTime).getTime())
              }
              list[i].chatDuration = chatDuration
              if (!list[i].beginTime) {
                list[i].beginTime = ''
              }
              if (!list[i].totalMsgCount) {
                list[i].totalMsgCount = 0
              }
              if (list[i].sourceName && list[i].sName) {
                list[i].custName = list[i].sName
              }
              if (!list[i].sourceName) {
                list[i].sourceName = list[i].sName
              }
              if (list[i].firstReplyTime) {
                list[i].firstTime = utils.getFormatDateTime(new Date(list[i].firstReplyTime))
              }
            }
            commit(types.TEMPLIST, {list: list, concat: true})
          })
        }
        // if (res.success) {
        //  if (res.list && res.list.length > 0) {
        //    commit(types.TEMPLIST, {list: res.list, concat: true})
        //  }
        // }
      }).catch(err => {
        console.log(err)
        commit(globalTypes.SET_ERROR, err)
      })
    } else {
      data.OFFERING_TIME = {'$lt': lastCallSheet.OFFERING_TIME}
      return qualityCheck.getQualityCheckCallSheet(data).then(res => {
        if (res.success && res.list && res.list.length > 0) {
          let list = res.list
          let p1 = _getSatisfaction({commit, state: rootState}, 'options')
          return Promise.all([p1]).then(([options]) => {
            for (let i = 0; i < list.length; i++) {
              // 处理座席
              let userName = ''
              if (list[i].DISPOSAL_AGENT && list[i].DISPOSAL_AGENT !== '') {
                let user = utils.getCache('agents', list[i].DISPOSAL_AGENT)
                userName = user.displayName + '[' + user.exten + ']'
              }
              list[i].DISPOSAL_AGENT_show = userName
              // 呼叫类型
              let CONNECT_TYPE = ''
              if (utils.getCacheByKey('callType', 'code_value', list[i].CONNECT_TYPE) != null) {
                CONNECT_TYPE = utils.getCacheByKey('callType', 'code_value', list[i].CONNECT_TYPE).code_name
              }
              if (list[i].CONNECT_TYPE != null) {
                if (list[i].CONNECT_TYPE === 'dialout') {
                  list[i].CALLED_NO_SHOW = utils.checkHideTel(list[i].CALLED_NO, userPower)
                  list[i].CALL_NO_SHOW = list[i].CALL_NO
                } else {
                  list[i].CALLED_NO_SHOW = list[i].CALLED_NO
                  list[i].CALL_NO_SHOW = utils.checkHideTel(list[i].CALL_NO, userPower)
                }
              }
              list[i].CONNECT_TYPE_show = CONNECT_TYPE
              // 接听状态
              let STATUS = ''
              if (utils.getCacheByKey('callStatus', 'code_value', list[i].STATUS) != null) {
                STATUS = utils.getCacheByKey('callStatus', 'code_value', list[i].STATUS).code_name
              }
              list[i].STATUS_show = STATUS
              // 满意度
              let satisfaction = ''
              let appraiseKey = list[i].INVESTIGATE ? list[i].INVESTIGATE : ''
              if (appraiseKey === '') {
                satisfaction = ''
              } else {
                for (var n = 0; n < options.length; n++) {
                  if (options[n].options[0].name === appraiseKey) {
                    satisfaction = options[n].name
                    break
                  }
                }
              }
              list[i].INVESTIGATE_show = satisfaction
              // 呼叫时长
              let chatDuration = '00:00:00'
              if (list[i].BEGIN_TIME && list[i].END_TIME) {
                chatDuration = utils.millsToDate(new Date(list[i].END_TIME).getTime() - new Date(list[i].BEGIN_TIME).getTime())
              }
              list[i].CALL_TIME_LENGTH_show = chatDuration
            }
            commit(types.TEMPLIST, {list: list, concat: true})
          })
        }
        // if (res.success) {
        //  if (res.list && res.list.length > 0) {
        //    commit(types.TEMPLIST, {list: res.list, concat: true})
        //  }
        // }
      }).catch(err => {
        console.log(err)
        commit(globalTypes.SET_ERROR, err)
      })
    }
  }
}

// 质检任务监测表格数据
export const getQualityTaskTemplateList = ({commit}, data) => {
  return qualityCheck.getQualityTaskTemplateList(data).then(res => {
    if (res.success) {
      commit(types.QUALITYTASK, res)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, err)
  })
}

// 质检周期查询  质检模板数据
export const queryQualityCheckedtabletitle = ({commit}, data) => {
  return qualityCheck.queryQualityCheckedtabletitle(data).then(res => {
    if (res.success) {
      commit(types.QCTABLETITLE, res.docs)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, err)
  })
}

// 质检周期查询  周期下拉框数据
export const queryQualityCheckedCycle = ({commit}, data) => {
  return qualityCheck.queryQualityCheckedCycle(data).then(res => {
    if (res.success) {
      commit(types.QCCYCLESELECTDATA, res.cycles)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, err)
  })
}

// 质检周期查询
export const queryCycleReport = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.queryCycleReport(data).then(res => {
    if (res.success) {
      // commit(types.QCCYCLESELECTDATA, res.cycles)
    }
    return res
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, err)
  })
}
/**
 * 任务模板
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const getQualityTaskTemplates = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.getQualityTaskTemplates({}).then(res => {
    return res
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 添加任务模板
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const addQualityTaskTemplate = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.addQualityTaskTemplate(data).then(res => {
    if (res.success) {
      return dispatch('getCache', {type: 'qualityTasks'}).then(() => {
        let qualityTasks = rootState.session.dicMap.qualityTasks
        if (res.task && qualityTasks.indexOf(res.task) === -1) {
          commit(globalTypes.PUSH_TASK_TEM, res.task)
        }
        return res
      })
    } else {
      return res
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

/**
 * 删除任务模板
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const removeQualityCheckTaskTemplates = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.removeQualityCheckTaskTemplates(data).then(res => {
    return res
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 通话任务模板置换数据
 * @param {Object} data
 * @param {String} [data.randomTemplateId] 条件模板ID //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} [data.user] 会话所属座席 //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} data.sessionId 会话id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} [data.idList[]] 已经被置换过的数据的id的集合 //["a5a59760-7956-11e6-bd2e-f7cad8b571c4"]
 */
export const replacementRecord = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.replacementRecord(data).then(res => {
    return res
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 通话条件模板置换数据
 * @param {Object} data
 * @param {String} [data.randomTemplateId] 条件模板ID //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} [data.user] 会话所属座席 //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} data.sessionId 会话id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} [data.idList[]] 已经被置换过的数据的id的集合 //["a5a59760-7956-11e6-bd2e-f7cad8b571c4"]
 */
export const queryAllConditionData = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.queryAllConditionData(data).then(res => {
    return res
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 在线咨询  条件模板置换数据
 * @param {Object} data
 * @param {String} [data.randomTemplateId] 条件模板ID //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} [data.user] 会话所属座席 //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} data.sessionId 会话id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
 * @param {String} [data.idList[]] 已经被置换过的数据的id的集合 //["a5a59760-7956-11e6-bd2e-f7cad8b571c4"]
 */
export const displacesTmpWebchatSession = ({commit, state, rootState, dispatch}, data) => {
  return qualityCheck.displacesTmpWebchatSession(data).then(res => {
    return res
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
