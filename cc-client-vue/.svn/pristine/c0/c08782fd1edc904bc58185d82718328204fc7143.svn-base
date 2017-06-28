import * as types from './mutation-types'
import business from '../../api/business'
import * as gtypes from '../../mutation-types'
import {getCache} from '../../actions'
/**
 * 刷新工作台业务待处理数
 */
export const refreshUndealNum = ({commit}) => {
  return business.refreshUndealNum({})
    .then(
      response => {
        if (response.success) {
          commit(types.REFRESH_BUSINESS_UNDEALNUM, {roleNum: response.roleNum, total: response.total, noReadNum: response.noReadNum})
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
export const readBusiness = ({commit}, data) => {
  return business.readBusiness(data)
    .then(
      response => {
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 待领取工单查询
 * @param {Object} data
 * @param {String} data.flow 工单类型
 * @param {Number} data.page 第几页
 * @param {Number} data.limt 一页多少行
 * @param {String} data.query 客户名称
 * @param {String} data.ownercomCreateUser 高级查询中，创建人，所属者
 * @param {String} data.createUser 高级查询中，创建人
 * @param {String} data.step 高级查询中，工单步骤
 * @param {String} data.number 高级查询中，工单编号
 * @param {String} data.createTime$begin 高级查询中，创建时间开始时间
 * @param {String} data.createTime$end 高级查询中，创建时间结束时间
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 高级查询中，查询工单字段的内容
 */
export const getRoleUnDealBusiness = ({commit}, data) => {
  return business.getRoleUnDealBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_ROLE_UNDEAL_BUSINESS, {list: response.list, count: response.count, businessTime: response.businessTime})
          commit(types.SET_BUSINESS_CONDITION, response.condition)
        }
        return response
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 我的待办工单查询
 * @param {Object} data
 * @param {String} data.flow 工单类型
 * @param {Number} data.page 第几页
 * @param {Number} data.limt 一页多少行
 * @param {String} data.query 客户名称
 * @param {String} data.ownercomCreateUser 高级查询中，创建人，所属者
 * @param {String} data.createUser 高级查询中，创建人
 * @param {String} data.step 高级查询中，工单步骤
 * @param {String} data.number 高级查询中，工单编号
 * @param {String} data.createTime$begin 高级查询中，创建时间开始时间
 * @param {String} data.createTime$end 高级查询中，创建时间结束时间
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 高级查询中，查询工单字段的内容
 */
export const getUnDealBusiness = ({commit}, data) => {
  return business.getUnDealBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_UNDEAL_BUSINESS, {list: response.list, count: response.count, businessTime: response.businessTime})
          commit(types.SET_BUSINESS_CONDITION, response.condition)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 我创建的工单查询
 * @param {Object} data
 * @param {String} data.flow 工单类型
 * @param {Number} data.page 第几页
 * @param {Number} data.limt 一页多少行
 * @param {String} data.query 客户名称
 * @param {String} data.ownercomCreateUser 高级查询中，创建人，所属者
 * @param {String} data.createUser 高级查询中，创建人
 * @param {String} data.step 高级查询中，工单步骤
 * @param {String} data.number 高级查询中，工单编号
 * @param {String} data.createTime$begin 高级查询中，创建时间开始时间
 * @param {String} data.createTime$end 高级查询中，创建时间结束时间
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 高级查询中，查询工单字段的内容
 */
export const getAssignedBusiness = ({commit}, data) => {
  return business.getAssignedBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_ASSIGNED_BUSINESS, {list: response.list, count: response.count})
          commit(types.SET_BUSINESS_CONDITION, response.condition)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 我参入的工单查询
 * @param {Object} data
 * @param {String} data.flow 工单类型
 * @param {Number} data.page 第几页
 * @param {Number} data.limt 一页多少行
 * @param {String} data.query 客户名称
 * @param {String} data.ownercomCreateUser 高级查询中，创建人，所属者
 * @param {String} data.createUser 高级查询中，创建人
 * @param {String} data.step 高级查询中，工单步骤
 * @param {String} data.number 高级查询中，工单编号
 * @param {String} data.createTime$begin 高级查询中，创建时间开始时间
 * @param {String} data.createTime$end 高级查询中，创建时间结束时间
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 高级查询中，查询工单字段的内容
 */
export const getFollowedBusiness = ({commit}, data) => {
  return business.getFollowedBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_FOLLOWED_BUSINESS, {list: response.list, count: response.count})
          commit(types.SET_BUSINESS_CONDITION, response.condition)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 全部的工单查询
 * @param {Object} data
 * @param {String} data.flow 工单类型
 * @param {Number} data.page 第几页
 * @param {Number} data.limt 一页多少行
 * @param {String} data.query 客户名称
 * @param {String} data.ownercomCreateUser 高级查询中，创建人，所属者
 * @param {String} data.master 当前处理人同事（座席id）
 * @param {String} data.ownerdep 当前处理人部门（部门id）
 * @param {String} data.ownercom 当前处理人常用：我自己、我的我的下属、我的部门、我和我的下级部门
 * @param {String} data.step 高级查询中，工单步骤
 * @param {String} data.number 高级查询中，工单编号
 * @param {String} data.createTime$begin 高级查询中，创建时间开始时间
 * @param {String} data.createTime$end 高级查询中，创建时间结束时间
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 高级查询中，查询工单字段的内容
 */
export const queryAllBusiness = ({commit}, data) => {
  return business.queryAllBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.QUERY_ALL_BUSINESS, {list: response.list, count: response.count})
          commit(types.SET_BUSINESS_CONDITION, response.condition)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 全部的代办工单查询
 * @param {Object} data
 * @param {String} data.flow 工单类型
 * @param {Number} data.page 第几页
 * @param {Number} data.limt 一页多少行
 * @param {String} data.query 客户名称
 * @param {String} data.ownercomCreateUser 高级查询中，创建人，所属者
 * @param {String} data.master 当前处理人同事（座席id）
 * @param {String} data.ownerdep 当前处理人部门（部门id）
 * @param {String} data.ownercom 当前处理人常用：我自己、我的我的下属、我的部门、我和我的下级部门
 * @param {String} data.step 高级查询中，工单步骤
 * @param {String} data.number 高级查询中，工单编号
 * @param {String} data.createTime$begin 高级查询中，创建时间开始时间
 * @param {String} data.createTime$end 高级查询中，创建时间结束时间
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 高级查询中，查询工单字段的内容
 */
export const getAllUncompleteBusiness = ({commit}, data) => {
  return business.getAllUncompleteBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_ALL_UNCOMPLETE_BUSINESS, {list: response.list, count: response.count})
          commit(types.SET_BUSINESS_CONDITION, response.condition)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 全部完成的工单查询
 * @param {Object} data
 * @param {String} data.flow 工单类型
 * @param {Number} data.page 第几页
 * @param {Number} data.limt 一页多少行
 * @param {String} data.query 客户名称
 * @param {String} data.ownercomCreateUser 高级查询中，创建人，所属者
 * @param {String} data.master 当前处理人同事（座席id）
 * @param {String} data.ownerdep 当前处理人部门（部门id）
 * @param {String} data.ownercom 当前处理人常用：我自己、我的我的下属、我的部门、我和我的下级部门
 * @param {String} data.step 高级查询中，工单步骤
 * @param {String} data.number 高级查询中，工单编号
 * @param {String} data.createTime$begin 高级查询中，创建时间开始时间
 * @param {String} data.createTime$end 高级查询中，创建时间结束时间
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 高级查询中，查询工单字段的内容
 */
export const getAllFinishedBusiness = ({commit}, data) => {
  return business.getAllFinishedBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_ALL_FINISHED_BUSINESS, {list: response.list, count: response.count})
          commit(types.SET_BUSINESS_CONDITION, response.condition)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 工单保存
 * @param {Object} data
 * @param {String} data._id 工单id
 * @param {String} data.flow 工单类型
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 工单字段
 * @param {String} data.nextAction 下一步处理动作
 * @param {String} data.nextUser 下一步处理人
 */
export const addBusinessTask = ({commit, rootState}, data) => {
  return new Promise(function (resolve) {
    processBusinessData({commit, rootState}, data).then((res) => {
      business.addBusinessTask(res)
        .then(
          response => {
            if (response.success) {
              commit(types.SET_BUSINESS_ACTION, response.data)
              resolve(response.data._id)
            } else if (response.errorCode === '403') {
              commit(gtypes.SET_ERROR, 'businessChangeError')
            } else {
              commit(gtypes.SET_ERROR, response.message || 'default_tips')
            }
          }
        ).catch(() => {
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
    })
  })
}
/**
 * 工单暂存
 * @param {Object} data
 * @param {String} data._id 工单id
 * @param {String} data.flow 工单类型
 * @param {String} data.d38a19e0-c5af-11e5-a307-19b0da236bee 工单字段
 * @param {String} data.nextAction 下一步处理动作
 * @param {String} data.nextUser 下一步处理人
 * @param {String} data.customer 客户id
 * @param {String} data.callId 通话id
 */
export const addTempBusinessTask = ({commit, rootState}, data) => {
  return new Promise(function (resolve) {
    processBusinessData({commit, rootState}, data).then((res) => {
      business.addTempBusinessTask(res)
        .then(
          response => {
            if (response.success) {
              commit(types.SET_BUSINESS_ACTION, response.data)
              resolve(response.data._id)
            }
          }
        ).catch(() => {
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
    })
  })
}
/**
 * 根据id获取工单详细信息
 * @param {Object} data
 * @param {String} data._id 工单id
 */
export const getBusinessDetailById = ({commit}, data) => {
  // let tabType = data.tabType || ''
  // delete data.tabType
  return business.getBusinessDetailById(data)
      .then(
        response => {
          if (response.success) {
            commit(types.SET_BUSINESS_ACTION, response.data)
            return true
            // if (tabType !== 'add') {
            //  commit(types.GET_BUSINESS_DETAIL_BY_ID, {data: response.data, tabType})
            // } else {
            //  commit(types.SET_BUSINESS_ACTION, response.data)
            // }
          }
        }
      ).catch((err) => {
        console.log(err)
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
}
/**
 * 添加工单备注
 * @param {Object} data
 * @param {String} data._id 工单id
 * @param {Number} data.backInfo 退回原因
 */
export const addBusinessBackInfo = ({commit}, data) => {
  return business.addBusinessBackInfo(data)
    .then(
      response => {
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 变更当前处理人
 * @param {Object} data
 * @param {String} data._id 工单id
 * @param {Number} data.master 变更的处理人
 */
export const changeBusinessMaster = ({commit}, data) => {
  return business.changeBusinessMaster(data)
    .then(
      response => {
        return response
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 变更当前处理人
 * @param {String} _id 工单id
 */
export const setTaskToMe = ({commit, rootState}, data) => {
  let req = {}
  req._id = data
  req.master = rootState.session.user._id
  return business.setTaskToMe(req)
    .then(
      response => {
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 执行工单动作
 * @param {Object} data
 * @param {String} data._id 工单id
 * @param {Number} data.master 领取座席
 * @param {Number} data.actionId 动作id
 */
export const excuteBusinessStepAction = ({commit, rootState}, data) => {
  return new Promise(function (resolve) {
    processBusinessData({commit, rootState}, data).then((res) => {
      return business.excuteBusinessStepAction(res)
        .then(
          response => {
            if (response.success) {
              commit(types.SET_BUSINESS_ACTION, response.data)
            } else if (response.errorCode === '403') {
              commit(gtypes.SET_ERROR, 'businessChangeError')
            } else {
              commit(gtypes.SET_ERROR, response.message || 'default_tips')
            }
            resolve(response.data)
          }
        ).catch(() => {
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
    })
  })
}
/**
 * 工单退回
 * @param {Object} data
 * @param {String} data._id 工单id
 * @param {Number} data.master 领取座席
 * @param {Number} data.actionId 动作id
 */
export const excuteBusinessBackAction = ({commit, rootState}, data) => {
  return new Promise(function (resolve) {
    return processBusinessData({commit, rootState}, data).then((res) => {
      business.excuteBusinessBackAction(res)
        .then(
          response => {
            if (response.success) {
              commit(types.SET_BUSINESS_ACTION, response.data)
            } else if (response.errorCode === '403') {
              commit(gtypes.SET_ERROR, 'businessChangeError')
            } else {
              commit(gtypes.SET_ERROR, response.message || 'default_tips')
            }
            resolve()
          }
        ).catch(() => {
          commit(gtypes.SET_ERROR, 'message.default_tips')
        })
    })
  })
}
/**
 * 工单附件删除
 * @param {Object} data
 * @param {String} data._id 工单id
 * @param {Number} data.fileId 字段id
 * @param {Number} data.fileId 附件id
 */
export const delBusAttach = ({commit}, data) => {
  return new Promise(function (resolve) {
    business.delBusAttach(data)
      .then(
        response => {
          if (response.success) {
            resolve()
          }
        }
      ).catch(() => {
        commit(gtypes.SET_ERROR, 'message.default_tips')
      })
  })
}
/**
 * 删除工单
 * @param {Object} data
 * @param {Object} data._id 工单id集合 {$in:[]}
 */
export const deleteBusiness = ({commit}, data) => {
  return business.deleteBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.DELETE_BUSINESS, true)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 获取客户的最后一次工单信息
 * @param {Object} data
 * @param {String} data.customer 客户id
 */
export const getCustomerHistoryBusiness = ({commit, rootState}, {data, type}) => {
  return business.getCustomerHistoryBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(types.GET_CUSTOMER_HISTORY_BUSINESS, {data: response.data, type: type})
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 工单导出
 * @param {Object} data
 * @param {Object} data._id 工单id集合 {$in:[]}
 */
export const exportBusiness = ({commit}, data) => {
  return business.exportBusiness(data)
    .then(
      response => {
        if (response.success) {
          commit(gtypes.SET_FILEDOWNLOAD, {path: response.path, isSession: true})
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}

let processBusinessData = function ({commit, rootState}, data) {
  return new Promise(function (resolve) {
    if (data.shortCut) {
      delete data.shortCut
    }
    getCache({commit, state: rootState}, {type: 'businessFlowField'}).then(() => {
      Promise.all(Object.keys(data).map((key) => {
        return new Promise(function (resolve) {
          let searchKey = key
          if (key.indexOf('_') !== -1) {
            searchKey = key.split('_')[0]
          }
          getCache({commit, state: rootState}, {type: 'businessFlowField', id: searchKey}).then((field) => {
            if (field && field.dic) {
              return new Promise(function (resolve) {
                getCache({commit, state: rootState}, {type: 'options', id: field.dic}).then((dic) => {
                  let options = []
                  getAllDicOptions(dic, options)
                  if (typeof data[key] === 'object') {
                    if (key.indexOf('_default') < 0) {
                      let defaultValue = []
                      for (let m = 0; m < data[key].length; m++) {
                        let keyItem = data[key][m]
                        for (let i = 0; i < options.length; i++) {
                          let optionItem = options[i]
                          if (optionItem.key === keyItem) {
                            defaultValue.push(optionItem.name)
                            continue
                          }
                        }
                      }
                      data[key + '_default'] = defaultValue
                    }
                  } else {
                    for (let i = 0; i < options.length; i++) {
                      let optionItem = options[i]
                      if (optionItem.key === data[key]) {
                        data[key + '_default'] = optionItem.name
                        continue
                      }
                    }
                  }
                  resolve(data)
                })
              }).then(() => {
                resolve(data)
              })
            } else {
              resolve(data)
            }
          })
        })
      })).then(() => {
        resolve(data)
      })
    })
  })
}

let getAllDicOptions = function (dic, result) {
  let options = dic.options || []
  for (let i = 0; i < options.length; i++) {
    let optionItem = options[i]
    result.push({key: optionItem.key, name: optionItem.name})
    let nextOptions = optionItem.options || []
    if (nextOptions.length !== 0) {
      getAllDicOptions(optionItem, result)
    }
  }
}

export const getBusinessFlow = ({commit, dispatch}) => {
  return dispatch('getCache', {type: 'businessFlow'}).then((flows) => {
    commit(types.SET_BUSINESS_FLOWS, flows)
  })
}
