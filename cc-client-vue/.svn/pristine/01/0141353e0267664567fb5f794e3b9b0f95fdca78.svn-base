import * as types from './mutation-types'
import * as globalTypes from '../../mutation-types'
import customer from '../../api/customer'
import call from '../../api/call'
import {m7Language, getCache} from '../../../utils/m7Utils'

/**
 * 查询客户列表
 * @param {Object} data
 * @param {String} data.dbType 客户模板id
 * @param {String} data.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
 * @param {Number} [data.limit] 分页查询limit，默认10
 * @param {Number} [data.page] 分页查询page，默认1
 * @param {String} [data.combox] 客户名称或电话
 * ---- 以下为高级搜索 ----
 * @param {String} [data.categoryId] 公海id
 * @param {String} [data.name] 客户名称
 * @param {String} [data.tel.phone] 客户电话
 * @param {String} [data.status] 客户状态
 * @param {String} [data.notifyTime_begin_date] 联系时间begin
 * @param {String} [data.notifyTime_end_date] 联系时间end
 * @param {String} [data.custsource1] 数据来源
 * @param {String} [data.batchNo] 导入批次
 * @param {String} [data.province] 省
 * @param {String} [data.city] 市
 * @param {String} [data.lastUpdateTime_begin_time] 更新时间begin
 * @param {String} [data.lastUpdateTime_end_date] 更新时间end
 * @param {String} [data.createTime_begin_date] 创建时间start
 * @param {String} [data.createTime_end_date] 创建时间end
 * @param {String} [data.actionType] 是否有联系计划，有则传'date'
 */
export const queryCustomerList = ({commit, state, rootState, dispatch}, data) => {
  return customer.queryCustomerList(data)
    .then(response => {
      if (response.success) {
        if (response.notify) {
          commit(globalTypes.SET_INFO, 'customer.queryCustomerListNotify')
        }
        commit(types.QUERY_CUSTOMER_LIST, { data: response, type: data.menu })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 查询客户信息
 * 如果不传type和tabType直接返回查询到的客户信息
 *
 * @param {Object} data
 * @param {String} [data.type] 模块
 * @param {String} [data.tabType] 标签页
 * @param {String} data._id 客户id
 */
export const queryCustomerInfo = ({ commit, state, rootState }, data) => {
  if (!data._id) {
    return Promise.resolve()
  }
  const type = data.type
  const tabType = data.tabType
  delete data.type
  delete data.tabType
  return customer.queryCustomerInfo(data)
    .then(response => {
      if (response.success) {
        if (type && tabType) {
          if (response.data.isRead === 'notify') {
            commit(globalTypes.UPDATE_CUSTOMER_INFO, { data: { _id: data._id, isRead: false } })
          }
          commit(globalTypes.SET_CURRENT_CUSTOMER, { data: response.data, type, tabType })
        } else {
          return response.data
        }
      } else {
        commit(globalTypes.SET_CURRENT_CUSTOMER, { data: null, type, tabType })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 新增客户
 * @param {Object} data
 * @param {String} data.type 模块
 * @param {String} data.tabType 标签页
 * @param {String} data.dealSrc 新增客户的页面
 * @param {String} data.callId 会话id、通话id等
 * @param {String} [data.callTel]l电话
 * @param {*} data.* 客户其他属性
 */
export const addCustomer = ({ commit, state, rootState, dispatch }, data) => {
  const type = data.type
  const tabType = data.tabType
  let businessId = data.callId
  delete data.type
  delete data.tabType
  return customer.addCustomer(data)
    .then(response => {
      if (response.success) {
        return customer.queryCustomerInfo({ _id: response.data._id })
      }
      return response
    })
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_CURRENT_CUSTOMER, { data: response.data, type, tabType, businessId })
        commit(types.REFRESH_LEFT)
      }
      return response
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 更新客户信息
 * @param {Object} data
 * @param {String} data.type 模块
 * @param {String} data.tabType 标签页
 * @param {String} data._id 客户id
 * @param {String} data.dbType 客户模板id
 * @param {String} [data.callId] 模块业务id
 * @param {*} data.* 客户其他属性
 */
export const updateCustomer = ({ commit, state, rootState }, data) => {
  const type = data.type
  const tabType = data.tabType
  const businessId = data.callId
  delete data.type
  delete data.tabType
  delete data.dealSrc
  delete data.callId
  return customer.updateCustomer(data)
    .then(response => {
      if (!response.success) {
        return response
      } else {
        return customer.queryCustomerInfo({ _id: data._id })
      }
    })
    .then((response) => {
      if (response.success) {
        if (type !== 'cti') {
          commit(globalTypes.SET_CURRENT_CUSTOMER, { data: response.data, type, tabType, businessId })
        }
        commit(globalTypes.UPDATE_CUSTOMER_INFO, { data: response.data })
      }
      return response
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 删除客户附件
 * @param {Object} data
 * @param {String} data._id 客户id
 * @param {Array} data.attachs 删除后的附件
 * @param {String} data.fildId 删除的附件id
 */
export const delCustomerAttach = ({ commit, state, rootState }, data) => {
  return customer.delCustomerAttach(data)
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 快捷修改客户状态
 * @param {Object} data
 * @param {String} data._id 客户id
 * @param {String} [data.status] 客户状态
 */
export const updateCustomerStatus = ({ commit }, data) => {
  return customer.updateCustomerStatusOrSource(data)
    .then(response => {
      commit(globalTypes.UPDATE_CUSTOMER_INFO, { data })
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 快捷修改客户数据来源
 * @param {Object} data
 * @param {String} data._id 客户id
 * @param {String} [data.custsource1] 数据来源
 */
export const updateCustomerSource = ({ commit }, data) => {
  return customer.updateCustomerStatusOrSource(data)
    .then(response => {
      commit(globalTypes.UPDATE_CUSTOMER_INFO, { data })
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 修改客户归属
 * @param {Object} data
 * @param {String} data._id 客户id
 * @param {String} data.owner 客户归属人id，没有传"NA"
 * @param {String} data.category 归属类型（"" -> 座席， 1 -> 无归属，2 -> 手动公海, 3 -> 自动公海）
 * @param {String} data.categoryId 公海id，没有传"NA"
 */
export const updateCustomerOwner = ({ commit }, data) => {
  return customer.updateCustomerOwner(data)
    .then(response => {
      commit(globalTypes.UPDATE_CUSTOMER_INFO, { data })
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 根据查询条件删除用户
 *
 * @param {Object} data
 * @param {Object} [data._id] _id查询条件，{ $in: [] }
 * @param {String} data.dbType 客户模板id
 * @param {*} [data.*] 其他条件
 */
export const deleteCustomer = ({ commit, state, rootState, dispatch }, data) => {
  return customer.deleteCustomer(data)
    .then(response => {
      commit(types.REFRESH_LEFT)
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 合并客户（A合并至B，删除A）
 * @param {Object} data
 * @param {String} data._id 合并后的客户id
 * @param {String} data.custAId 客户A的id
 * @param {String} data.custBId 客户B的id
 * @param {*} data.* 客户其他属性
 */
export const mergeCustomer = ({ commit, state, rootState }, data) => {
  return customer.mergeCustomer(data)
    .then(response => {
      if (response.success) {
        commit(types.REFRESH_LEFT)
      } else {
        if (response.code === '1001') {
          commit(globalTypes.SET_ERROR, '电话号码重复')
        } else if (response.code === '1002') {
          commit(globalTypes.SET_ERROR, '客户名称重复')
        } else if (response.code === '1005') {
          commit(globalTypes.SET_ERROR, '客户A处于待审核状态，若要合并，请等待审核完成')
        }
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 查询客户工单历史
 * @param {Object} data
 * @param {String} data.customer 客户id
 */
export const queryCustomerBusinessHistory = ({ commit, state, rootState, dispatch }, data) => {
  const getListItemById = (list, id) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i]._id === id) {
        return list[i]
      }
    }
  }

  return Promise.all([
    customer.queryCustomerCommonHistory(data),
    dispatch('getCache', { type: 'agents' }),
    dispatch('getCache', { type: 'businessFlow' }),
    dispatch('getCache', { type: 'businessFlowStep' })
  ])
    .then(([response, agents, businessFlows, businessFlowSteps]) => {
      const list = response.data.list
      list.forEach(history => {
        // 处理座席
        let agentObj = getListItemById(agents, history.agent || '')
        let agentName = agentObj ? (agentObj.displayName ? agentObj.displayName + agentObj.exten : '') : ''
        history.agentName = agentName
        // 当前处理人
        if (history.master) {
          let masterObj = getListItemById(agents, history.master || '')
          let masterName = agentObj ? (masterObj.displayName ? masterObj.displayName + masterObj.exten : '') : ''
          history.masterName = masterName
        }
        // 业务类型
        let businessTypeName = ''
        if (history.type === 'business') {
          let businessFlow = getListItemById(businessFlows, history.businessType || '')
          businessTypeName = businessFlow ? (businessFlow.name ? businessFlow.name : '') : ''
        }
        history.businessTypeName = businessTypeName
        // 处理结果
        let disposeDisplay = ''
        if (history.type === 'business') {
          let businessStep = getListItemById(businessFlowSteps, history.status)
          disposeDisplay = businessStep ? (businessStep.name ? businessStep.name : '') : ''
        } else if (history.type === 'approval') {
          disposeDisplay = history.status === 'unPass' ? 'customer.contactHistoryDisposeDisplay.approvalUnPass' : 'customer.contactHistoryDisposeDisplay.approvalPass'
        }
        history.disposeDisplay = disposeDisplay
      })
      return {
        customer: data.customer,
        count: response.data.count,
        list
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 查询客户联系计划历史
 * @param {Object} data
 * @param {String} data.customerId 客户id
 * @param {Number} [data.page] 分页查询page，默认1
 * @param {Number} [data.limit] 分页查询limit，默认10
 */
export const queryCustomerContactPlanHistory = ({ commit, state, rootState }, data) => {
  return customer.queryCustomerContactPlanHistory(data)
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 查询客户联系历史
 * @param {Object} data
 * @param {String} data.customer 客户id
 * @param {String} [data.type] 类型（'' => 全部，'note' => 联系计划，'business' => 工单，'chat' => 在线咨询，'email' => 邮件，'callin' => 呼入，'callout' => 呼出）
 * @param {String} [data.date] 日期（'week' => 最近7天，'month' => 最近1个月，'month3' => '最近3个月'，'' => 全部）
 * @param {Numbser} [data.page] 分页查询page，默认1
 * @param {Number} [data.limit] 分页查询limit，默认20
 */
export const queryCustomerContactHistory = ({ commit, state, rootState, dispatch }, data) => {
  const getListItemById = (list, id) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i]._id === id) {
        return list[i]
      }
    }
  }

  return Promise.all([
    customer.queryCustomerCommonHistory(data),
    dispatch('getCache', { type: 'agents' }),
    dispatch('getCache', { type: 'businessFlow' }),
    dispatch('getCache', { type: 'businessFlowStep' })
  ])
  .then(([response, agents, businessFlows, businessFlowSteps]) => {
    const list = response.data.list
    let contactHistory = {}

    list.forEach(history => {
      // 处理座席
      let agentObj = getListItemById(agents, history.agent || '')
      let agentName = agentObj ? (agentObj.displayName ? agentObj.displayName : '') : ''
      history.agentName = agentName

      // 时间
      let createTime = history.createTime || ''
      let date = createTime.split(' ')[0] || ''
      let time = createTime.split(' ')[1] || ''
      time = date && time ? `${time.split(':')[0]}:${time.split(':')[1]}` : ''
      let datetime = `${date} ${time}`
      history.date = date
      history.time = time
      history.datetime = datetime

      // 业务类型
      let businessTypeName = ''
      if (history.type === 'business') {
        let businessFlow = getListItemById(businessFlows, history.businessType || '')
        businessTypeName = businessFlow ? (businessFlow.name ? businessFlow.name : '') : ''
      } else if (history.type === 'callin' || history.type === 'callout') {
        businessTypeName = `customer.contactHistoryBusinessTypeName.${history.type}`
      } else if (history.type === 'approval') {
        businessTypeName = `customer.contactHistoryBusinessTypeName.approval${history.apprType}`
      }
      history.businessTypeName = businessTypeName

      // 处理结果
      let disposeDisplay = ''
      if (history.type === 'business') {
        let businessStep = getListItemById(businessFlowSteps, history.status)
        disposeDisplay = businessStep ? (businessStep.name ? businessStep.name : '') : ''
      } else if (history.type === 'callin' || history.type === 'callout') {
        let isTransStatus = history.status === 'dealing' || history.status === 'notDeal' || history.status === 'queueLeak' ||
          history.status === 'voicemail' || history.status === 'leak' || history.status === 'blackList'

        if (isTransStatus) {
          disposeDisplay = `customer.contactHistoryDisposeDisplay.${history.status}`
        }
      } else if (history.type === 'approval') {
        disposeDisplay = history.status === 'unPass' ? 'customer.contactHistoryDisposeDisplay.approvalUnPass' : 'customer.contactHistoryDisposeDisplay.approvalPass'
      }

      history.disposeDisplay = disposeDisplay

      if (date) {
        if (contactHistory[date]) {
          contactHistory[date].push(history)
        } else {
          contactHistory[date] = []
          contactHistory[date].push(history)
        }
      }
    })

    return {
      count: response.data.count,
      contactHistory
    }
  })
  .catch(err => {
    console.error(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}
/**
 * 查询客户操作日志
 * @param {Object} data
 * @param {String} data.cid 客户id
 * @param {String} [data.user] 操作人（'' => 全部，'system' => 系统，座席id）
 * @param {String} [data.type] 类型
 * ---- 类型 ----
 * add                  新增客户
 * import               导入客户
 * update               更改客户
 * updateStatus         修改状态
 * updateOwner          修改归属
 * updateSource         修改来源
 * assign               分配客户
 * batchUpdateStatus    批量修改了状态
 * claim                领取
 * autoAssignPool       自动分配
 * recyclePool          自动回收
 * changePool           转移客户
 * updateSysStatus      变更跟进状态
 * mergeCust            合并客户
 * ''                   全部
 * @param {Number} [data.limit] 分页查询limit，默认10
 * @param {Number} [data.page] 分页查询page，默认1
 */
export const queryCustomerChangeLog = ({ commit, state, rootState, dispatch }, data) => {
  if (!data.cid) {
    return {
      count: 0,
      changeLog: {}
    }
  }
  return Promise.all([
    customer.queryCustomerChangeLog(data),
    dispatch('getCache', { type: 'agents' })
  ])
  .then(([response, agents]) => {
    const list = response.list
    let changeLog = {}
    list.forEach((log) => {
      let type = log.type
      let date = log.time.split(' ')[0]
      let time = log.time.split(' ')[1]
      time = `${time.split(':')[0]}:${time.split(':')[1]}`
      let datetime = `${date} ${time}`
      let content = log.content
      let desc = `customer.changeLog.${type}`
      let user = log.user
      for (let i = 0; i < agents.length; i++) {
        if (agents[i]._id === user) {
          user = agents[i].displayName
          break
        }
      }
      if (user === 'system') {
        user = m7Language('public.system')
      }

      if (type === 'import' || type === 'add' || type === 'del') {
        content = m7Language(desc)
      }

      let formatLog = {
        type,
        date,
        time,
        user,
        datetime,
        content,
        desc
      }
      if (changeLog[date]) {
        changeLog[date].push(formatLog)
      } else {
        changeLog[date] = []
        changeLog[date].push(formatLog)
      }
    })

    return {
      count: response.count,
      changeLog
    }
  })
  .catch(err => {
    console.error(err)
    commit(globalTypes.SET_ERROR, 'message.default_tips')
  })
}

/**
 * 查询快捷搜索列表
 * @param {Object} data
 * @param {Number} [data.limit] 分页查询limit，默认10
 * @param {Number} [data.page] 分页查询page，默认1
 */
export const queryCustomerQuickSearchList = ({commit, state, rootState, dispatch}, data) => {
  return customer.queryCustomerQuickSearchList(data)
    .then(response => {
      if (response.success) {
        response.list.forEach((item) => {
          let userInfo = getCache('agents', item.createUser)
          item.displayName = userInfo.displayName
          if (item.menu === 'customer_my') {
            item.menuName = '我的客户'
          } else if (item.menu === 'customer_plan') {
            item.menuName = '联系计划'
          } else if (item.menu === 'customer_all') {
            item.menuName = '全部'
          }
        })
        commit(types.QUERY_CUSTOMER_QUICK_SEARCH_LIST, {data: response})
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 根据id查询快捷搜索
 * @param {Object} data
 * @param {String} data._id 快捷搜索id
 */
export const queryCustomerQuickSearchById = ({ commit, state, rootState }, data) => {
  return customer.queryCustomerQuickSearchById(data)
    .then(response => response.data)
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 增加快捷搜索
 * @param {Object} data
 * @param {String} data.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
 * @param {String} data.kName 快捷搜索名称
 * @param {Object} data.query 查询条件
 */
export const addCustomerQuickSearch = ({ commit, state, rootState, dispatch }, data) => {
  return customer.addCustomerQuickSearch(data)
    .then(response => {
      if (response.success) {
        return dispatch('queryCustomerQuickSearchList', {limit: 10, page: 1}).then(() => {
          return response.success
        })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 修改快捷搜索
 * @param {Object} data
 * @param {String} data.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
 * @param {String} data.kName 快捷搜索名称
 * @param {String} data.kId 快捷搜索id
 * @param {Object} data.query 查询条件
 */
export const updateCustomerQuickSearch = ({commit, state, rootState, dispatch}, data) => {
  return customer.updateCustomerQuickSearch(data)
    .then(response => {
      if (response.success) {
        commit(types.UPDATE_CUSTOMER_QUICK_SEARCH, {data: response.data})
        return response.success
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 删除快捷搜索
 * @param {Object} data
 * @param {String} data.kId 快捷搜索id
 */
export const deleteCustomerQuickSearch = ({commit, state, rootState, dispatch}, data) => {
  return customer.deleteCustomerQuickSearch(data)
    .then(response => {
      return dispatch('queryCustomerQuickSearchList', {limit: 10, page: 1})
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 新增联系计划
 * @param {Object} data
 * @param {String} data.accountId 账户id
 * @param {String} data.userId 座席id
 * @param {String} data.remark 联系计划内容
 * @param {String} data.notifyTime 提醒时间，格式YYYY-MM-DD HH:MM
 * @param {String} data.customerId 客户id
 */
export const addCustomerContactPlan = ({ commit, state, rootState, dispatch }, data) => {
  return customer.addCustomerContactPlan(data)
    .then(response => {
      return dispatch('queryCustomerContactPlanHistory', { customerId: data.customerId })
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 更新联系计划
 * @param {Object} data
 * @param {String} data._id 联系计划id
 * @param {String} data.accountId 账户id
 * @param {String} data.userId 座席id
 * @param {String} data.remark 联系计划内容
 * @param {String} data.notifyTime 提醒时间，格式YYYY-MM-DD HH:MM
 * @param {String} data.customerId 客户id
 */
export const updateCustomerContactPlan = ({ commit, state, rootState, dispatch }, data) => {
  return customer.updateCustomerContactPlan(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.UPDATE_CUSTOMER_INFO, { data: { _id: data.customerId, action: data.remark, notifyTime: data.notifyTime, actionUser: data.userId } })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 根据_id询联系计划
 * @param {String} data 联系计划id
 */
export const queryCustomerContactPlan = ({ commit, state, rootState }, data) => {
  return customer.queryCustomerContactPlan(data)
    .then(response => response.data)
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 完成或取消完成联系计划
 * @param {Object} data
 * @param {String} data.actionId 联系计划id
 * @param {String} data._id 客户id
 * @param {String} data.notifyTime 提醒时间，完成传''，取消完成传之前的时间
 * @param {String} data.action 联系计划内容，完成传''，取消完成传之前的内容
 * @param {String} data.status 状态，完成传'1'，取消完成传'2'
 */
export const dealCustomerContactPlan = ({ commit, state, rootState, dispatch }, data) => {
  return customer.dealCustomerContactPlan(data)
    .then(response => {
      return dispatch('queryCustomerContactPlanHistory', { customerId: data._id })
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 根据查询条件取消联系计划
 * @param {Object} data
 * @param {Object} data.query 查询条件
 * @param {Object} [data.query._id] 联系计划_id的查询条件，{ $in: [] }
 * @param {*} [data.query.*] 其他条件
 * @param {Number} data.total 总数
 */
export const cancelCustomerContactPlan = ({ commit, state, rootState }, data) => {
  return customer.cancelCustomerContactPlan(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_SUCCESS, 'customer.cancelContactPlanSuccess')
        commit(types.REFRESH_LEFT)
      } else if (response.code === '1001') {
        commit(globalTypes.SET_ERROR, 'customer.cancelContactPlanNumNotMatch')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 导出客户
 * @param {Object} data
 * @param {String} data.Method 导出类型，'exportCustomer2In'
 * @param {Object} data.Query 查询条件
 * @param {String} data.Query.dbType 客户模板id
 * @param {Object} [data.Query._id] 联系计划_id的查询条件，{ $in: [] }
 * @param {*} [data.Query.*] 其他条件
 * @param {String} data.Query.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
 */
export const exportCustomer = ({ commit, state, rootState }, data) => {
  return customer.exportCustomer(data)
    .then(response => {
      commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 导出客户（超过一万条）
 * @param {Object} data
 * @param {String} data.Method 导出类型，'exportCustomer'
 * @param {Object} data.Query 查询条件
 * @param {String} data.Query.dbType 客户模板id
 * @param {*} [data.Query.*] 其他条件
 * @param {String} data.Query.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
 */
export const exportCustomerMore = ({ commit, state, rootState }, data) => {
  return customer.exportCustomerMore(data)
    .then(response => {
      commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 导出客户通话记录
 * @param {Object} data
 * @param {String} data.Method 导出类型，'exportCustomerCdr'
 * @param {Object} data.Query 查询条件
 * @param {String} data.Query.dbType 客户模板id
 * @param {Object} [data.Query._id] 联系计划_id的查询条件，{ $in: [] }
 * @param {*} [data.Query.*] 其他条件
 * @param {String} data.Query.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
 */
export const exportCustomerCdr = ({ commit, state, rootState }, data) => {
  return customer.exportCustomerCdr(data)
    .then(response => {
      commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 分配客户
 * @param {Object} data
 * @param {Object} data.query 查询条件
 * @param {String} data.query.dbType 客户模板id
 * @param {Object} [data.query._id] 联系计划_id的查询条件，{ $in: [] }
 * @param {*} [data.query.*] 其他条件
 * @param {Array} data.owners 座席及分配数量列表 [{ owner: '', count: number }]
 * @param {Number} data.total 总数
 */
export const assignCustomer = ({ commit, state, rootState }, data) => {
  return customer.assignCustomer(data)
    .then(response => {
      commit(types.REFRESH_LEFT)
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 根据查询条件批量更新客户状态
 * @param {Object} data
 * @param {Object} data.query 查询条件
 * @param {String} data.query.dbType 客户模板id
 * @param {Object} [data.query._id] 客户_id查询条件，{ $in: [] }
 * @param {*} [data.query.*] 其他条件
 * @param {String} data.status 客户状态
 * @param {Number} data.total 总数
 */
export const batchUpdateCustomerStatus = ({ commit, state, rootState, dispatch }, data) => {
  return customer.batchUpdateCustomerStatus(data)
    .then(response => {
      if (response.success) {
        commit(types.REFRESH_LEFT)
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 根据查询条件批量转移客户
 * @param {Object} data
 * @param {Object} data.query 查询条件
 * @param {String} data.query.dbType 客户模板id
 * @param {Object} [data.query._id] 客户_id查询条件，{ $in: [] }
 * @param {*} [data.query.*] 其他条件
 * @param {String} data.categoryId 客户归属
 * @param {Number} data.total 总数
 */
export const batchUpdateCustomerCategory = ({ commit, state, rootState, dispatch }, data) => {
  return customer.batchUpdateCustomerCategory(data)
    .then(response => {
      if (response.success) {
        commit(types.REFRESH_LEFT)
      } else {
        if (response.code === '1001') {
          commit(globalTypes.SET_ERROR, '您转移的数据总数发生变化，请重新确认后再操作')
        } else if (response.code === '1002') {
          commit(globalTypes.SET_ERROR, '您不是该公海管理员，不能将客户转移到该公海')
        } else if (response.code === '1005') {
          commit(globalTypes.SET_ERROR, '选中的客户中有处于待审核状态的客户，若要批量转移归属，请先等待客户审核完成!')
        }
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 提交批量录音下载任务
 * @param {Object} data
 * @param {Object} [data._id] 客户_id查询条件，{ $in: [] }
 * @param {String} data.dbType 客户模板id
 * @param {*} [data.*] 其他条件
 */
export const addCustomerExportMonitorTask = ({ commit, state, rootState }, data) => {
  return customer.addCustomerExportMonitorTask(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_SUCCESS, m7Language('customer.exportMonitorTaskSuccess'))
      } else if (response.message === '404') {
        commit(globalTypes.SET_ERROR, m7Language('customer.exportMonitorTaskNotExist'))
      } else {
        commit(globalTypes.SET_ERROR, 'message.default_tips')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 查询导出任务
 * @param {Object} data
 * @param {Number} [data.limit] 分页查询limit，默认10
 * @param {Number} [data.page] 分页查询page，默认1
 */
export const queryCustomerExportTaskList = ({ commit, state, rootState }, data) => {
  return customer.queryCustomerExportTaskList(data)
    .then(response => {
      if (response.success) {
        return response
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 撞单查询
 * @param {Object} data
 * @param {String} data.combox 客户名称或电话
 * @param {Number} [data.limit] 分页查询limit，默认10
 * @param {Number} [data.page] 分页查询page，默认1
 */
export const queryCustomerHitList = ({ commit, state, rootState }, data) => {
  return customer.queryCustomerHitList(data)
    .then(response => {
      return response
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 定位客户
 * @param {Object} data
 * @param {String} data.field 字段类型 displayName, phone, email, weixin
 * @param {String} data.combox 值
 * @param {Boolean} [data.mergeFlag] 合并客户查询时传入，合并客户有权限控制
 */
export const queryCustomerByPopup = ({ commit, state, rootState }, data) => {
  return customer.queryCustomerByPopup(data)
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 更新客户通话备注
 */
export const updateCustomerCdrRemark = ({ commit, state, rootState }, data) => {
  return call.saveCdrMemo(data)
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
