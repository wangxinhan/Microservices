import * as types from './mutation-types'
import * as globalTypes from '../../mutation-types'
import {getCache, getCacheByKey} from '../../actions'
import questionnaire from '../../api/questionnaire'
import * as utils from '../../../utils/m7Utils'
/**
 * 获取所有
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 */
export const quesList = ({commit, state, rootState, dispatch}, searchData) => {
  let type = searchData.queryType
  let querydata = searchData.querydata || {}
  return new Promise(function (resolve, reject) {
    switch (type) {
      case 'questionnaire_my':
        questionnaire.getUserAllQues(querydata).then(response => {
          if (response.success) {
            resolve({type: types.QUES_LIST_MY, res: response})
          }
        })
        break
      case 'my_questionnaire_uncomplete' :
        questionnaire.getUserUncompleteQues(querydata).then(response => {
          if (response.success) {
            resolve({type: types.QUES_LIST_MY, res: response})
          }
        })
        break
      case 'my_questionnaire_unconfirm' :
        questionnaire.getUserUnconfirmQues(querydata).then(response => {
          if (response.success) {
            resolve({type: types.QUES_LIST_MY, res: response})
          }
        })
        break
      case 'my_questionnaire_complete':
        questionnaire.getUserCompleteQues(querydata).then(response => {
          if (response.success) {
            resolve({type: types.QUES_LIST_MY, res: response})
          }
        })
        break
      case 'questionnaire_uncomplete':
        questionnaire.getAllUncompleteQues(querydata).then(response => {
          if (response.success) {
            resolve({type: types.QUES_LIST_ALL, res: response})
          }
        })
        break
      case 'questionnaire_complete':
        questionnaire.getAllCompleteQues(querydata).then(response => {
          if (response.success) {
            resolve({type: types.QUES_LIST_ALL, res: response})
          }
        })
        break
      case 'questionnaire_all':
        questionnaire.getAllQues(querydata).then(response => {
          if (response.success) {
            resolve({type: types.QUES_LIST_ALL, res: response})
          }
        })
        break
      case 'questionnaire_unconfirm':
        questionnaire.getAllUnconfirmQues(querydata).then(response => {
          if (response.success) {
            resolve({type: types.QUES_LIST_ALL, res: response})
          }
        })
        break
      default :
        break
    }
  }).then(({type, res}) => {
    return getCache({commit, state: rootState}, {
      type: 'questionnaireTemp'
    }).then(() => {
      let list = res.list
      // 处理list中的数据
      let pList = []
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let pItem = item => {
          return getStatueNameByCache({commit, state: rootState}, item.status, item.result, item.temp_id
          ).then(statusName => {
            item.statusName = statusName
            return getQuestionnaireLabelByStatus(item.status, item.result)
          }).then(labelName => {
            item.labelName = labelName
            return getTempNameByCache({commit, state: rootState}, item.temp_id)
          }).then(temp => {
            item.tempName = temp ? temp.name : item.temp_id
            return getDisplayOwner({commit, state: rootState}, null, null, item.owner)
          }).then(displayOwner => {
            item.displayOwner = displayOwner
            return utils.checkHideTel(item.phone, rootState.session.user)
          }).then(phone => {
            item.phone = phone
            return
          }).catch(err => {
            console.log(err)
            commit(globalTypes.SET_ERROR, 'message.default_tips')
          })
        }
        pList.push(pItem(item))
      }
      return Promise.all(pList).then(() => {
        commit(type, {res})
      }).catch(err => {
        console.log(err)
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      })
    })
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
 * @param data._id 问卷id
 * @param data.notifyTime 问卷提醒时间，从列表数据中获取
 * @returns {Promise<R>|*|Promise.<TResult>|Promise<R2|R1>}
 */
export const showQuestionnaireDetail = ({commit, state, rootState, dispatch}, data) => {
  return questionnaire.getQuesById({_id: data._id}).then(response => {
    if (response.success) {
      let quesData = response.data
      let tempId = quesData.temp_id
      let tempData = null
      let fields = null
      let needShowFields = [] // 需要显示的字段。

      if (!quesData.comments) {
        quesData.comments = []
      }

      return getCacheByKey({commit, state: rootState}, {
        type: 'questionnaireTemp',
        key: '_id',
        value: tempId
      }).then(data => {
        tempData = data || {}
        return getCache({commit, state: rootState}, {
          type: 'questionnaireField'
        })
      }).then(list => {
        fields = list
        for (let i = 0; i < fields.length; i++) {
          if (fields[i].temp_id === tempId) {
            // 遍历属性
            let field = fields[i]
            if (field) {
              let needShowField = {}
              needShowField.name = field.name
              needShowField.desc = field.desc
              if (field._id.substr(-5) === '_name') {
                needShowField.value = quesData.name
              } else if (field._id.substr(-6) === '_phone') {
                needShowField.value = quesData.phone
              } else {
                needShowField.value = quesData[field._id]
              }
              needShowFields.push(needShowField)
            }
          }
        }
        quesData.tempData = tempData || {}
        quesData.basePhone = utils.checkHideTel(quesData.phone, rootState.session.user)
        // quesData.phone = utils.checkEncryptTel(quesData.phone, rootState.session.user)
        quesData.custDetial = needShowFields
        quesData.notifyTime = quesData.notifyTime || ''
        return getTempQues({commit, state: rootState}, tempId).then(ques => {
          quesData.ques = ques
          quesData.tempType = tempData.type
          if (quesData.owner === rootState.session.user._id) {
            quesData.canSubmit = true
          } else {
            quesData.canSubmit = false
          }
          quesData.disabled = false
          if (tempData.type === 'static') {
            // 静态问卷
            if (quesData.status === 'uncomplete' || quesData.status === 'confirm') {
              let pList = []
              for (let i = 0; i < ques.length; i++) {
                let p = replaceQues({commit, state: rootState}, ques[i], tempId, quesData).then(oneQues => {
                  return
                })
                pList.push(p)
              }
              return Promise.all(pList)
            } else if (quesData.status === 'complete') {
              // 不能进行回访
              quesData.disabled = true
              quesData.canSubmit = false
              let answs = quesData.anws || {}
              let pList = []
              for (let i = 0; i < ques.length; i++) {
                let p = replaceQues({commit, state: rootState}, ques[i], tempId, quesData).then(oneQues => {
                  let value = answs[ques[i]._id]
                  oneQues.answValue = value ? value.aws : []
                  oneQues.otherValue = value ? value.other : ''
                  return
                })
                pList.push(p)
              }
              return Promise.all(pList)
            }
          } else {
            // 动态问卷
            if (quesData.status === 'uncomplete' || quesData.status === 'confirm') {
              let pList = []
              for (let i = 0; i < ques.length; i++) {
                let p = replaceQues({commit, state: rootState}, ques[i], tempId, quesData).then(oneQues => {
                  return
                })
                pList.push(p)
              }
              return Promise.all(pList)
            } else if (quesData.status === 'complete') {
              // 不能进行回访
              quesData.disabled = true
              quesData.canSubmit = false
              let answs = quesData.anws || {}
              let pList = []
              for (let i = 0; i < ques.length; i++) {
                let p = replaceQues({commit, state: rootState}, ques[i], tempId, quesData).then(oneQues => {
                  let value = answs[ques[i]._id]
                  oneQues.answValue = value ? value.aws : []
                  oneQues.otherValue = value ? value.other : ''
                  return
                })
                pList.push(p)
              }
              return Promise.all(pList)
            }
          }
        }).then(() => {
          if (tempData.type === 'dynamic' && (quesData.status === 'uncomplete' || quesData.status === 'confirm')) {
            let startQues = getStartQues(quesData.ques, tempId)
            quesData.startQues = startQues
          }
          commit(types.QUES_CURRENT, {data: quesData})
        })
      })
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 问卷导出
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 *
 */
export const exportQues = ({commit, state, rootState, dispatch}, data) => {
  let count = state.questionnaireList.count
  if (!data.temp_id) {
    commit(globalTypes.SET_ERROR, 'questionnaire.noTempId')
    return
  }
  if (count && count > 500000) {
    commit(globalTypes.SET_ERROR, 'message.limitCountExport')
    return
  }
  return questionnaire.exportQues(data).then(response => {
    if (response.success) {
      let url = response.path
      commit(globalTypes.SET_FILEDOWNLOAD, {path: url, isSession: true})
    }
  })
}

/**
 * 获取要删除的问卷数量
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const getQuesCount = ({commit, state, rootState, dispatch}, data) => {
  return questionnaire.getQuesCount(data)
}
/**
 * 删除问卷
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const deleteQues = ({commit, state, rootState, dispatch}, data) => {
  return questionnaire.deleteQues(data).then(response => {
    if (response.success) {
      // 成功后重置批量选择
      commit(types.QUES_DELETE, {})
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 获取问卷联系历史
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data //{}
 * @returns {*|Promise<R2|R1>|Promise<R>|Promise.<TResult>}
 */
export const showActiveHistory = ({commit, state, rootState, dispatch}, data) => {
  return questionnaire.getQuesCallSheet(data).then(res => {
    if (res.success) {
      let ques = Object.assign({}, state.current)
      ques.history = res.list
      ques.historyCount = res.count
      commit(types.QUES_CURRENT, {data: ques})
      console.debug('commit(types.QUES_CURRENT, {data: ques})' + state.current)
    }
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 提交稍后回访
 * @param commit
 * @param state
 * @param rootState
 * @param dispatch
 * @param data
 */
export const confirmQuesCallTask = ({commit, state, rootState, dispatch}, data) => {
  let notifyTime = data.notifyTime_date + ' ' + data.notifyTime_time
  let notifyTimeObj = new Date(notifyTime)
  if (notifyTimeObj.toString() === 'Invalid Date') {
    commit(globalTypes.SET_ERROR, 'questionnaire.dateWrong')
  } else {
    return questionnaire.confirmQuesCallTask({
      _id: data._id,
      status: 'confirm',
      notifyTime: notifyTime
    }).then(response => {
      if (response.success) {
        // todo 刷新列表
        commit(types.QUES_CONFIRM, {})
      }
    })
  }
}
/**
 * 完成问卷
 * @param commit
 * @param state
 * @param rootState
 * @param dispatchgetQuesCallSheet
 * @param data
 */
export const completeTask = ({commit, state, rootState, dispatch}, data) => {
  return questionnaire.completeQuestionnaire(data).then(response => {
    if (response.success) {
      // todo 刷新列表
      commit(globalTypes.SET_SUCCESS, 'questionnaire.submitQuesSuccess')
      commit(types.QUES_CONFIRM, {})
    }
    return response
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, err.toString())
  })
}

export const getQuesTmpls = ({commit, dispatch}) => {
  return dispatch('getCache', {type: 'questionnaireTemp'})
}

export const addQuesComment = ({commit, state, rootState}, data) => {
  return questionnaire.addQuesComment(data).then(response => {
    if (response.success) {
      commit(types.ADD_COMMENT, {comment: data.comment, user: rootState.session.user._id, time: utils.getCurrentDateTime()})
    }
    return response
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, err.toString())
  })
}

/**
 * 分配问卷给做座席
 * data:{query, owners, total}
 */
export const saveQuesAssign = ({commit, state}, data) => {
  // 可以被分配的个数
  return questionnaire.saveQuesAssign(data).then(response => {
    if (response.success) {
      commit(globalTypes.SET_SUCCESS, 'questionnaire.assignSuccess')
    } else {
      if (response.code === '1001') {
        commit(globalTypes.SET_ERROR, 'questionnaire.assignFailTips')
      } else {
        commit(globalTypes.SET_ERROR, response.message)
      }
    }
    return response
  }).catch(err => {
    console.log(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
    return {success: false}
  })
}

export const getBatchNoByTime = ({commit, state}, data) => {
  return questionnaire.getBatchNoByTime(data)
}

export const getBatchRemarkByTime = ({commit, state}, data) => {
  return questionnaire.getBatchRemarkByTime(data)
}

var getStatueNameByCache = ({commit, state}, status, result, tempId) => {
  if (status === 'uncomplete') {
    return new Promise(function (resolve, reject) {
      resolve('待回访')
    })
  } else if (status === 'confirm') {
    return new Promise(function (resolve, reject) {
      resolve('待确认')
    })
  } else {
    return getCacheByKey({commit, state}, {
      type: 'questionnaireTemp',
      key: '_id',
      value: tempId
    }).then(tempData => {
      let qstatus
      if (tempData) {
        qstatus = tempData.qstatus
      }
      if (qstatus && qstatus[result]) {
        return qstatus[result]
      } else {
        if (result === 'success') {
          return '回访成功'
        } else if (result === 'invalid') {
          return '无效电话'
        } else if (result === 'noAnswer') {
          return '无人接听'
        } else if (result === 'imparity') {
          return '客户不配合'
        } else if (result === 'other') {
          return '其他'
        }
      }
      return '已完成'
    })
  }
}

var getQuestionnaireLabelByStatus = (status, result) => {
  if (status === 'uncomplete' || status === 'confirm') {
    return 'label-important'
  } else {
    if (result === 'success') {
      return 'label-success'
    } else if (result === 'invalid') {
      return ''
    } else if (result === 'noAnswer') {
      return 'label-info'
    } else if (result === 'imparity') {
      return 'label-warning'
    } else if (result === 'other') {
      return 'label-success'
    } else if (utils.startWith(result, 'qstatus')) {
      return 'label-' + result
    }
    return 'label-success'
  }
}

var getTempNameByCache = ({commit, state}, tempId) => {
  return getCacheByKey({commit, state}, {
    type: 'questionnaireTemp',
    key: '_id',
    value: tempId
  }).then(data => {
    return data
  })
}
var getDisplayOwner = ({commit, state}, status, result, agentId) => {
  if (!agentId) {
    return '未分配'
  }
  return getCacheByKey({commit, state}, {
    type: 'agents',
    key: '_id',
    value: agentId
  }).then(agentData => {
    if (agentData) {
      let displayName = agentData.displayName
      if (utils.getStrLength(displayName) >= 10) {
        return displayName.substring(0, 8) + '...'
      }
      return agentData.displayName
    }
    return '未分配'
  })
}
var getQuesFieldByName = ({commit, state}, name, tempId) => {
  return getCache({commit, state}, {type: 'questionnaireField'}).then(fields => {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].temp_id === tempId && fields[i].name === name) {
        return fields[i]
      }
    }
  })
}

var getStartQues = (ques, tempId) => {
  for (let i = 0; i < ques.length; i++) {
    let quesObj = ques[i]
    if (quesObj.temp_id === tempId && quesObj.isBegin === true) {
      return utils.deepClone(quesObj)
    }
  }
  return null
}
var getTempQues = ({commit, state}, tempId) => {
  return getCache({commit, state}, {type: 'questionnaireQues'}).then(ques => {
    let result = []
    for (let i = 0; i < ques.length; i++) {
      let quesObj = ques[i]
      if (quesObj.temp_id === tempId) {
        result.push(utils.deepClone(quesObj))
      }
    }
    return result
  })
}

var replaceQues = ({commit, state}, ques, tempId, data) => {
  return new Promise((resolve, reject) => {
    let context = ques.context
    if (/^.*\$\{.+\}.*$/.test(context)) {
      let r = context.match(/\$\{.+?\}/g)
      if (r != null) {
        let pList = []
        for (let i = 0; i < r.length; i++) {
          let name = r[i].substring(2, r[i].length - 1)
          let p = getQuesFieldByName({commit, state}, name, tempId).then(field => {
            if (field) {
              if (field._id.substr(-5) === '_name') {
                context = context.replace(r[i], data.name)
              } else if (field._id.substr(-6) === '_phone') {
                context = context.replace(r[i], data.basePhone)
              } else {
                var str = ''
                if (data[field._id]) {
                  str = data[field._id]
                }
                context = context.replace(r[i], str)
              }
              ques.context = context
            }
            return
          })
          pList.push(p)
        }
        resolve(Promise.all(pList).then(() => {
          return ques
        }))
      } else {
        resolve(ques)
      }
    } else {
      resolve(ques)
    }
  })
}
