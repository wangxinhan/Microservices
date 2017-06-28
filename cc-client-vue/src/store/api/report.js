/**
 * Created by zengyx on 16/12/17.
 */

import send from './http'

export default {
  /* 工作台 start */
  /**
   *
   * @param data {type:'day|month'}
   * @return  {
   * success:true
   * list:[{
   * agentId:'', 座席id
   * score:'' 接入会话数
   * }]
   * }
   */
  queryAgentMultiChannelData (data) {
    let req = {
      data: data,
      action: 'workbench.queryAgentMultiChannelData'
    }
    return send.fetchByReport(req, 'post')
  },
  /* 工作台 end */

  /* 表头 start */
  /**
   * 获取表头
   * @param {String} data 表头类型
   * --- 通话报表 ----
   * call_report_relay_time     中继呼入时间趋势报表
   * call_report_relay_area     中继呼入地域分布报表
   * call_report_callout_time   外呼时间趋势报表
   * call_report_dialout_area   外呼通话地域分布报表
   * call_report_queue          技能组对比报表
   * call_report_queue_time     技能组时间趋势报表
   * call_report_agent          座席工作量报表
   * ---- 在线客服报表 ----
   * im_report_message          在线客服消息报表
   * im_report_agent            在线客服座席工作量报表
   * im_report_agent_response   在线客服座席响应统计报表
   * ---- 邮件报表 ----
   * mail_report_agent          邮件座席工作量报表
   * ---- 监控 ----
   * im_monitor_agent           监控座席
   */
  getReportTableHeader (data) {
    const req = {
      data,
      action: 'app.report.getTableHeader'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 保存报表表头
   * @param {Object} data
   * @param {String} data.reportType 报表类型
   * @param {String} data.reportName 报表名称
   * @param {Array} data.headers 表头配置 [{ name: String, order: Number, show: Boolean }]
   */
  saveReportTableHeader (data) {
    const req = {
      data,
      action: 'app.report.saveTableHeader'
    }
    return send.fetch(req, 'post')
  },
  /* 表头 end */

  /* 通话报表 start */
  /**
   * 通话中继呼入时间趋势报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_relay_time'
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'call_report_relay_time'
   * @param {String} data.query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {Boolean} data.query.ServiceNo_xxx 服务号
   * @param {Boolean} data.query.delete_ServerNo 是否查询已删除服务号
   */
  queryCallRelayTimeReport (data) {
    const req = {
      data,
      action: 'app.report.openRelayTime'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出通话中继呼入时间趋势报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportRelayTimeReport'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'call_report_relay_time'
   * @param {String} data.Query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {Boolean} data.Query.ServiceNo_xxx 服务号
   * @param {Boolean} data.Query.delete_ServerNo 是否查询已删除服务号
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportCallRelayTimeReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通话中继呼入地域分布报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_relay_area'
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'call_report_relay_area'
   * @param {String} data.query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {Boolean} data.query.ServiceNo_xxx 服务号
   * @param {Boolean} data.query.delete_ServerNo 是否查询已删除服务号
   * @param {Boolean} data.query.Province_xxx 省
   */
  queryCallRelayAreaReport (data) {
    const req = {
      data,
      action: 'app.report.openRelayArea'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通话中继呼入地域的城市分布报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_relay_area_city'
   * @param {Object} data.query 查询条件
   * @param {String} data.query.relayAreaCityCurrentProvince 查询城市，例如：'北京市'
   * @param {String} data.query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {Boolean} data.query.ServiceNo_xxx 服务号
   * @param {Boolean} data.query.delete_ServerNo 是否查询已删除服务号
   * @param {Boolean} data.query.Province_xxx 省
   */
  openRelayAreaCity (data) {
    const req = {
      data,
      action: 'app.report.openRelayAreaCity'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出通话中继呼入地域分布报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'ReportRelayAreaExport'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'call_report_relay_area'
   * @param {String} data.Query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {Boolean} data.Query.ServiceNo_xxx 服务号
   * @param {Boolean} data.Query.delete_ServerNo 是否查询已删除服务号
   * @param {Boolean} data.Query.Province_xxx 省
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportCallRelayAreaReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通话呼出时间趋势报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_callout_time'
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'call_report_callout_time'
   * @param {String} data.query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   */
  queryCallCalloutTimeReport (data) {
    const req = {
      data,
      action: 'app.report.openCalloutTime'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出通话呼出时间趋势报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportDialoutTime'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'call_report_callout_time'
   * @param {String} data.Query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportCallCalloutTimeReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通话呼出通话地域分布报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_dialout_area'
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'call_report_dialout_area'
   * @param {String} data.query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {Boolean} data.query.Province_xxx 省
   */
  queryCallDialoutAreaReport (data) {
    const req = {
      data,
      action: 'app.report.openDialoutArea'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出通话呼出通话地域分布报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'ReportDialoutAreaExport'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'call_report_dialout_area'
   * @param {String} data.Query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {Boolean} data.Query.Province_xxx 省
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportCallDialoutAreaReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通话技能组对比报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_queue'
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'call_report_queue'
   * @param {String} data.query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.selectedQueueList] 技能组id列表，英文逗号隔开
   */
  queryCallQueueReport (data) {
    const req = {
      data,
      action: 'app.report.openQueue'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出通话技能组对比报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportReportQueue'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'call_report_queue'
   * @param {String} data.Query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.selectedQueueList] 技能组id列表，英文逗号隔开
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportCallQueueReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通话技能组时间趋势报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_queue_time'
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'call_report_queue_time'
   * @param {String} data.query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.selectedQueueList] 技能组id列表，英文逗号隔开
   */
  queryCallQueueTimeReport (data) {
    const req = {
      data,
      action: 'app.report.openQueueTime'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出通话技能组时间趋势报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportReportQueueTime'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'call_report_queue_time'
   * @param {String} data.Query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.selectedQueueList] 技能组id列表，英文逗号隔开
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportCallQueueTimeReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通话座席工作量报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_agent'
   * @param {String} data.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.yearReport] 年
   * @param {String} [data.monthReport] 月
   * @param {String} [data.dayReport] 日
   * @param {String} [data.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {Boolean} data.includeSubordinate 是否包含下属座席
   */
  queryCallAgentReport (data) {
    const req = {
      data,
      action: 'app.report.openAgent'
    }
    return send.fetch(req, 'post')
  },

 /**
 * 获取座席的工作量报表
 * @param {Object} data
 * @param {String} data.AgentID 座席id
 * @param {String} data.reportType 报表类型，'call_report_agent_time'
 * @param {String} data.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
 * @param {String} [data.Query.yearReport] 年
 * @param {String} [data.Query.monthReport] 月
 * @param {String} [data.Query.dayReport] 日
 * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
 * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
 * @param {String} data.YearID 格式YYYY0MMDD
 */
  queryAgentTime (data) {
    const req = {
      data,
      action: 'app.report.queryAgentTime'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出通话座席工作量报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportAgent'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'call_report_agent'
   * @param {String} data.Query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   * @param {String} data.Query.userTyp 座席类型
   * @param {String} data.Query.pbx pbx
   */
  exportCallAgentReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
  * 获取座席工作量报表的软电话条状态
  * @param {Object} data
  * @param {String} data.Account 账户
  * @param {String} data.PBX pbx
  * @param {String} data.IsEnable 1
  */
  queryAgentReportCti (data) {
    const req = {
      data,
      action: 'app.phoneBarConfig.queryConfig'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通话座席满意度调查报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'call_report_approve_survey'
   * @param {String} data.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.yearReport] 年
   * @param {String} [data.monthReport] 月
   * @param {String} [data.dayReport] 日
   * @param {String} [data.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {String} [data.callType] 呼出类型（'normal' => 呼入，'dialout' => 呼出，'' => 全部）
   */
  queryCallApproveSurveyReport (data) {
    const req = {
      data,
      action: 'app.report.openApproveSurvey'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出通话座席满意度调查报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportApproveSurveyReport'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'call_report_approve_survey'
   * @param {String} data.Query.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportCallApproveSurveyReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  /* 通话报表 end */

  /* 在线客服报表 start */
  /**
   * 在线客服消息报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'im_report_message'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'im_report_message'
   * @param {String} [data.query.selectedAccessIdList] 接入号id列表，英文逗号隔开
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   */
  queryImMessageReport (data) {
    const req = {
      data,
      action: 'imReport.queryImMessageReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出在线客服消息报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportImMessage'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'im_report_message'
   * @param {String} [data.Query.selectedAccessIdList] 接入号id列表，英文逗号隔开
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportImMessageReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 在线客服业务分析报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'im_report_business_analyse'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'im_report_business_analyse'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   */
  queryImBusinessAnalyseReport (data) {
    const req = {
      data,
      action: 'imReport.queryImBusinessAnalyseReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出在线客服业务分析报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportImBusiness'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'im_report_business_analyse'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportImBusinessAnalyseReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 在线客服座席工作量报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'im_report_agent'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'im_report_agent'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {Object} data.user 座席权限
   */
  queryImAgentReport (data) {
    const req = {
      data,
      action: 'imReport.queryImAgentReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出在线客服座席工作量报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportImAgent'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'im_report_agent'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportImAgentReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 在线客服座席满意度报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'im_report_csr'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'im_report_csr'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD
   * @param {String} [data.query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {Object} data.user 座席权限
   */
  queryImCsrReport (data) {
    const req = {
      data,
      action: 'imReport.queryImCsrReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出在线客服座席满意度报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportImCSR'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'im_report_csr'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD
   * @param {String} [data.Query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportImCsrReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 在线客服渠道满意度报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'im_report_channel_csr'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'im_report_channel_csr'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD
   */
  queryImChannelCsrReport (data) {
    const req = {
      data,
      action: 'imReport.queryImChannelCsrReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出在线客服渠道满意度报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportImChannelCSR'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'im_report_channel_csr'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportImChannelCsrReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 在线客服会话数时间趋势报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'im_report_session_time'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'im_report_session_time'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD
   */
  queryImSessionTimeReport (data) {
    const req = {
      data,
      action: 'imReport.queryImSessionTimeReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出在线客服会话数时间趋势报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportImSessionTime'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'im_report_session_time'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportImSessionTimeReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 在线客服访客来源分析报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'im_report_session_seoSource' => 搜索引擎，'im_report_session_area' => 地区，'im_report_session_seoKeywords' => 关键字，'im_report_session_fromUrl' => 来源页面
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，同data.reportType
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD
   * @param {String} [data.query.seoSource] 搜索引擎（关键字）
   * @param {Number} [data.limit] 分页查询limit，默认10（关键字、来源页面）
   * @param {Number} [data.page] 分页查询page，默认1（关键字、来源页面）
   */
  queryImSessionFromReport (data) {
    const req = {
      data,
      action: 'imReport.queryImSessionFromReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出在线客服访客来源分析报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportImSourceAnalyse'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'im_report_session_seoSource' => 搜索引擎，'im_report_session_area' => 地区，'im_report_session_seoKeywords' => 关键字，'im_report_session_fromUrl' => 来源页面
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD
   * @param {String} [data.Query.seoSource] 搜索引擎（关键字）
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportImSessionFromReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 在线客服座席响应统计报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'im_report_agent_response'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'im_report_agent_response'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {Boolean} data.query.includeSubordinate 是否包含下属座席
   * @param {Object} data.user 座席权限
   */
  queryImAgentResponseReport (data) {
    const req = {
      data,
      action: 'imReport.queryImAgentResponseReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出在线客服座席响应统计报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportImAgentResponse'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'im_report_agent_response'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {Boolean} data.Query.includeSubordinate 是否包含下属座席
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportImAgentResponseReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  /* 在线客服报表 end */

  /* 邮件报表 start */
  /**
   * 邮件座席工作量报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'mail_report_agent'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'mail_report_agent'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {Boolean} data.query.includeSubordinate 是否包含下属座席
   * @param {Object} data.user 座席权限
   */
  queryMailAgentReport (data) {
    const req = {
      data,
      action: 'mailReport.queryMailAgentReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出邮件座席工作量报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportMailAgent'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'mail_report_agent'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {Boolean} data.Query.includeSubordinate 是否包含下属座席
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportMailAgentReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 邮件分类报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'mail_report_category'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'mail_report_category'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   */
  queryMailCategoryReport (data) {
    const req = {
      data,
      action: 'mailReport.queryMailCategoryReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出邮件分类报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportMailCategory'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'mail_report_category'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.EndTime] 结束时间，YYYY-MM-DD HH:mm
   * @param {String} [data.Query.accountId] 账户id
   * @param {String} data.Query.user 座席id
   */
  exportMailCategoryReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  /* 邮件报表 end */

  /* 客户报表 start */
  /**
   * 客户来源分析报表
   * @param {Object} data
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'customer_report_increase'
   * @param {String} data.query.timeType 时间类型（'month', 'year'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   */
  queryCustomerIncreaseReport (data) {
    const req = {
      data,
      action: 'customerReport.queryCustomerIncreaseReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出客户来源分析报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportCustomerIncrease'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'customer_report_increase'
   * @param {String} data.Query.timeType 时间类型（'month', 'year'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.accountId] 账户id
   */
  exportCustomerIncreaseReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  /* 客户报表 end */

  /* 工单报表 start */
  /**
   * 工单分析报表
   * @param {Object} data
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'business_report_analyse'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYYMMDD
   * @param {String} [data.query.EndTime] 结束时间，YYYYMMDD
   */
  queryBusinessAnalyseReport (data) {
    const req = {
      data,
      action: 'businessReport.queryBusinessAnalyseReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出工单分析报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportBusinessAnalyse'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'business_report_analyse'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYYMMDD
   * @param {String} [data.Query.EndTime] 结束时间，YYYYMMDD
   * @param {String} [data.Query.accountId] 账户id
   */
  exportBusinessAnalyseReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 工单座席工作量报表
   * @param {Object} data
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'business_report_agent'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   * @param {String} [data.query.StartTime] 开始时间，YYYYMMDD
   * @param {String} [data.query.EndTime] 结束时间，YYYYMMDD
   * @param {String} [data.query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {Object} data.user 座席权限
   */
  queryBusinessAgentReport (data) {
    const req = {
      data,
      action: 'businessReport.queryBusinessAgentReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出工单座席工作量报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportBusinessAgent'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'business_report_agent'
   * @param {String} data.Query.timeType 时间类型（'day', 'month', 'year', 'other'）
   * @param {String} [data.Query.yearReport] 年
   * @param {String} [data.Query.monthReport] 月
   * @param {String} [data.Query.dayReport] 日
   * @param {String} [data.Query.StartTime] 开始时间，YYYYMMDD
   * @param {String} [data.Query.EndTime] 结束时间，YYYYMMDD
   * @param {String} [data.Query.selectedAgentList] 座席id列表，英文逗号隔开
   * @param {String} [data.Query.accountId] 账户id
   */
  exportBusinessAgentReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  /* 工单报表 end */

  /* 问卷报表 start */
  /**
   * 问卷回访状态报表
   * @param {Object} data
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'questionnaire_report_return'
   * @param {String} [data.query.create_time_begin] 创建时间begin，YYYY-MM-DD
   * @param {String} [data.query.create_time_end] 创建时间end，YYYY-MM-DD
   * @param {String} [data.query.return_time_begin] 回访时间begin，YYYY-MM-DD
   * @param {String} [data.query.return_time_end] 回访时间end，YYYY-MM-DD
   * @param {String} [data.query.temp_id] 模板id
   * @param {Array} [data.query.batchNo] 导入批次
   * @param {Array} [data.query.batchRemarks] 批次说明
   */
  queryQuesResultReport (data) {
    const req = {
      data,
      action: 'quesReport.queryQuesResultReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出问卷回访状态报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportQuesResultReport'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'questionnaire_report_return'
   * @param {String} [data.Query.create_time_begin] 创建时间begin，YYYY-MM-DD
   * @param {String} [data.Query.create_time_end] 创建时间end，YYYY-MM-DD
   * @param {String} [data.Query.return_time_begin] 回访时间begin，YYYY-MM-DD
   * @param {String} [data.Query.return_time_end] 回访时间end，YYYY-MM-DD
   * @param {String} [data.Query.temp_id] 模板id
   * @param {Array} [data.Query.batchNo] 导入批次
   * @param {Array} [data.Query.batchRemarks] 批次说明
   * @param {String} [data.Query.accountId] 账户id
   */
  exportQuesResultReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 问卷问题明细报表
   * @param {Object} data
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'questionnaire_report_question_detail'
   * @param {String} [data.query.create_time_begin] 创建时间begin，YYYY-MM-DD
   * @param {String} [data.query.create_time_end] 创建时间end，YYYY-MM-DD
   * @param {String} [data.query.return_time_begin] 回访时间begin，YYYY-MM-DD
   * @param {String} [data.query.return_time_end] 回访时间end，YYYY-MM-DD
   * @param {String} [data.query.temp_id] 模板id
   * @param {Array} [data.query.ques_id] 问卷问题id
   * @param {Array} [data.query.batchNo] 导入批次
   * @param {Array} [data.query.batchRemarks] 批次说明
   */
  queryQuesAnwserReport (data) {
    const req = {
      data,
      action: 'quesReport.queryQuesAnwserReport'
    }
    return send.fetchByReport(req, 'post')
  },

  /**
   * 导出问卷问题明细报表
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportQuesAnswerReport'
   * @param {Object} data.Query 查询条件
   * @param {String} data.Query.reportType 报表类型，'questionnaire_report_question_detail'
   * @param {String} [data.Query.create_time_begin] 创建时间begin，YYYY-MM-DD
   * @param {String} [data.Query.create_time_end] 创建时间end，YYYY-MM-DD
   * @param {String} [data.Query.return_time_begin] 回访时间begin，YYYY-MM-DD
   * @param {String} [data.Query.return_time_end] 回访时间end，YYYY-MM-DD
   * @param {String} [data.Query.temp_id] 模板id
   * @param {Array} [data.Query.ques_id] 问卷问题id
   * @param {Array} [data.Query.batchNo] 导入批次
   * @param {Array} [data.Query.batchRemarks] 批次说明
   * @param {String} [data.Query.accountId] 账户id
   */
  exportQuesAnwserReport (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  /* 问卷报表 end */

  /* 机器人报表 start */
  /**
   * 机器人消息报表
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'robot_report_message'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'robot_report_message'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   */
  queryRobotMessageReport (data) {
    const req = {
      data,
      action: 'robotReport.queryRobotMessageReport'
    }
    return send.fetchByReport(req, 'post')
  },
  /**
   * 机器人消息报表导出
   * @param {Object} data
   * @param {String} data.reportType 报表类型，'robot_report_message'
   * @param {String} data.account 账户id
   * @param {Object} data.query 查询条件
   * @param {String} data.query.reportType 报表类型，'robot_report_message'
   * @param {String} data.query.timeType 时间类型（'day', 'month', 'year'）
   * @param {String} [data.query.yearReport] 年
   * @param {String} [data.query.monthReport] 月
   * @param {String} [data.query.dayReport] 日
   */
  exportRobotMessageExcel (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 机器人热点问题报表
   */
  queryRobotTop20Report (data) {
    const req = {
      data,
      action: 'config.robot.queryRobotTop20Report'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 机器人热点问题报表导出
   */
  exportRobotTop20Excel (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  }
  /* 机器人报表 end */

}
