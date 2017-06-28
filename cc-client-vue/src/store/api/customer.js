/**
 * Created by zengyx on 16/12/14.
 * 客户模块,与后端的请求交互
 */

import send from './http'

export default {
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
  queryCustomerList (data) {
    const req = {
      data,
      action: 'app.customer.queryCustPage2In'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询客户信息
   *
   * @param {Object} data
   * @param {String} data._id 客户id
   */
  queryCustomerInfo (data) {
    const req = {
      data,
      action: 'app.customer.queryCustInfo'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 新增客户
   * @param {Object} data
   * @param {String} data.dealSrc 新增客户的页面
   * @param {String} data.callId 会话id、通话id等
   * @param {String} [data.callTel] 电话
   * @param {*} data.* 客户其他属性
   */
  addCustomer (data) {
    const req = {
      data,
      action: 'app.customer.addCustomer'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 更新客户信息
   * @param {Object} data
   * @param {String} data._id 客户id
   * @param {String} data.dbType 客户模板id
   * @param {*} data.* 客户其他属性
   */
  updateCustomer (data) {
    const req = {
      data,
      action: 'app.customer.updateCustomer'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 删除客户附件
   * @param {Object} data
   * @param {String} data._id 客户id
   * @param {Array} data.attachs 删除后的附件
   * @param {String} data.fildId 删除的附件id
   */
  delCustomerAttach (data) {
    const req = {
      data,
      action: 'app.customer.delCustomerAttach'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 快捷修改客户状态或数据来源
   * @param {Object} data
   * @param {String} data._id 客户id
   * @param {String} [data.status] 客户状态
   * @param {String} [data.custsource1] 数据来源
   */
  updateCustomerStatusOrSource (data) {
    const req = {
      data,
      action: 'app.customer.updateCustomerStatusOrSource'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 修改客户归属
   * @param {Object} data
   * @param {String} data._id 客户id
   * @param {String} data.owner 客户归属人id，没有传"NA"
   * @param {String} data.category 归属类型（"" -> 座席， 1 -> 无归属，2 -> 手动公海, 3 -> 自动公海）
   * @param {String} data.categoryId 公海id，没有传"NA"
   */
  updateCustomerOwner (data) {
    const req = {
      data,
      action: 'app.customer.updateCustForOwner'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 根据_id查询条件删除用户
   *
   * @param {Object} data
   * @param {Object} data._id _id查询条件，{ $in: [] }
   * @param {Object} data.dbType 客户模板id
   */
  deleteCustomer (data) {
    const req = {
      data,
      action: 'app.customer.delCustQuery2In'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 合并客户（A合并至B，删除A）
   * @param {Object} data
   * @param {String} data._id 合并后的客户id
   * @param {String} data.custAId 客户A的id
   * @param {String} data.custBId 客户B的id
   * @param {*} data.* 客户其他属性
   */
  mergeCustomer (data) {
    const req = {
      data,
      action: 'app.customer.mergeCustomer'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询客户联系历史
   * @param {Object} data
   * @param {String} data.customer 客户id
   * @param {String} data.type 类型（'note' => 联系计划，'business' => 工单，'' => 联系历史全部，'chat' => 在线咨询，'email' => 邮件，'callin' => 呼入，'callout' => 呼出）
   * @param {String} [data.date] 联系历史筛选（'week' => 最近7天，'month' => 最近1个月，'month3' => '最近3个月'，'' => 全部）
   */
  queryCustomerCommonHistory (data) {
    const req = {
      data,
      action: 'app.customer.queryCustCommonHistory'
    }
    return send.fetch(req, 'post')
  },

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
  queryCustomerChangeLog (data) {
    const req = {
      data,
      action: 'customerReport.queryChangeLogReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 增加快捷搜索
   * @param {Object} data
   * @param {String} data.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
   * @param {String} data.kName 快捷搜索名称
   * @param {Object} data.query 查询条件
   */
  addCustomerQuickSearch (data) {
    const req = {
      data,
      action: 'app.customer.addQuickSearch'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 修改快捷搜索
   * @param {Object} data
   * @param {String} data.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
   * @param {String} data.kName 快捷搜索名称
   * @param {String} data.kId 快捷搜索id
   * @param {Object} data.query 查询条件
   */
  updateCustomerQuickSearch (data) {
    const req = {
      data,
      action: 'app.customer.upQuickSearch'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 根据id查询快捷搜索
   * @param {Object} data
   * @param {String} data._id 快捷搜索id
   */
  queryCustomerQuickSearchById (data) {
    const req = {
      data,
      action: 'app.customer.queryQuickSearchById'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询快捷搜索列表
   * @param {Object} data
   * @param {Number} [data.limit] 分页查询limit，默认10
   * @param {Number} [data.page] 分页查询page，默认1
   */
  queryCustomerQuickSearchList (data) {
    const req = {
      data,
      action: 'app.customer.queryQuickSearch'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 删除快捷搜索
   * @param {Object} data
   * @param {String} data.kId 快捷搜索id
   */
  deleteCustomerQuickSearch (data) {
    const req = {
      data,
      action: 'app.customer.deleteQuickSearch'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询客户联系计划历史
   * @param {Object} data
   * @param {String} data.customerId 客户id
   * @param {Number} [data.page] 分页查询page，默认1
   * @param {Number} [data.limit] 分页查询limit，默认10
   */
  queryCustomerContactPlanHistory (data) {
    const req = {
      data,
      action: 'app.customer.queryCustNote'
    }

    return send.fetch(req, 'post')
  },

  /**
   * 新增联系计划
   * @param {Object} data
   * @param {String} data.accountId 账户id
   * @param {String} data.userId 座席id
   * @param {String} data.remark 联系计划内容
   * @param {String} data.notifyTime 提醒时间，格式YYYY-MM-DD HH:MM
   * @param {String} data.customerId 客户id
   */
  addCustomerContactPlan (data) {
    const req = {
      data,
      action: 'app.customer.addNote'
    }
    return send.fetch(req, 'post')
  },

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
  updateCustomerContactPlan (data) {
    const req = {
      data,
      action: 'app.customer.updateNote'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 根据_id询联系计划
   * @param {String} data 联系计划id
   */
  queryCustomerContactPlan (data) {
    const req = {
      data,
      action: 'app.customer.getNote'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询工作台的联系计划列表,是按提醒时间进行排序的
   * @param {String} data.agentId 当前座席
   * @param {String} data.account 账户id
   */
  queryWorkbenchContactPlan (data) {
    const req = {
      data,
      action: 'app.workbench.workbenchRefresh'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 完成或取消完成联系计划
   * @param {Object} data
   * @param {String} data.actionId 联系计划id
   * @param {String} data._id 客户id
   * @param {String} data.notifyTime 提醒时间，完成传''，取消完成传之前的时间
   * @param {String} data.action 联系计划内容，完成传''，取消完成传之前的内容
   * @param {String} data.status 状态，完成传'1'，取消完成传'2'
   */
  dealCustomerContactPlan (data) {
    const req = {
      data,
      action: 'app.customer.dealNote'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 根据查询条件取消联系计划
   * @param {Object} data
   * @param {Object} data.query 查询条件
   * @param {Object} [data.query._id] 联系计划_id的查询条件，{ $in: [] }
   * @param {*} [data.query.*] 其他条件
   * @param {Number} data.total 总数
   */
  cancelCustomerContactPlan (data) {
    const req = {
      data,
      action: 'app.customer.cancelPlanning'
    }
    return send.fetch(req, 'post')
  },

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
  exportCustomer (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出客户（超过一万条）
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportCustomer'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.dbType 客户模板id
   * @param {*} [data.Query.*] 其他条件
   * @param {String} data.Query.menu tab页（'customer_my' => 我的客户，'customer_plan' => 联系计划，'customer_all' => 全部）
   */
  exportCustomerMore (data) {
    const req = {
      data,
      action: 'app.excel.exportMoreXls'
    }
    return send.fetch(req, 'post')
  },

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
  exportCustomerCdr (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

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
  assignCustomer (data) {
    const req = {
      data,
      action: 'app.customer.saveCustAssign2In'
    }
    return send.fetch(req, 'post')
  },

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
  batchUpdateCustomerStatus (data) {
    const req = {
      data,
      action: 'app.customer.batchUpdateStatus2In'
    }
    return send.fetch(req, 'post')
  },

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
  batchUpdateCustomerCategory (data) {
    const req = {
      data,
      action: 'app.customer.batchUpdateCustomerCategory'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 提交批量录音下载任务
   * @param {Object} data
   * @param {Object} [data._id] 客户_id查询条件，{ $in: [] }
   * @param {String} data.dbType 客户模板id
   * @param {*} [data.*] 其他条件
   */
  addCustomerExportMonitorTask (data) {
    const req = {
      data,
      action: 'app.customer.addCustomerExportMonitorTask'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询导出任务
   * @param {Object} data
   * @param {Number} [data.limit] 分页查询limit，默认10
   * @param {Number} [data.page] 分页查询page，默认1
   */
  queryCustomerExportTaskList (data) {
    const req = {
      data,
      action: 'app.customer.queryExportTaskSearch'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 撞单查询
   * @param {Object} data
   * @param {String} data.combox 客户名称或电话
   * @param {Number} [data.limit] 分页查询limit，默认10
   * @param {Number} [data.page] 分页查询page，默认1
   */
  queryCustomerHitList (data) {
    const req = {
      data,
      action: 'app.customer.queryHitSingleSearch'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 定位客户
   * @param {Object} data
   * @param {String} data.field 字段类型 displayName, phone, email, weixin
   * @param {String} data.combox 值
   * @param {Boolean} [data.mergeFlag] 合并客户查询时传入，合并客户有权限控制
   */
  queryCustomerByPopup (data) {
    const req = {
      data,
      action: 'app.popup.queryCustomerByPopup'
    }
    return send.fetch(req, 'post')
  }
}
