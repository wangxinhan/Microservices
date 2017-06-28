import * as globalTypes from '../../mutation-types'
import * as types from './mutation-types'
import report from '../../api/report'

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
 */
export const getReportTableHeader = ({ commit, state, rootState }, data) => {
  return report.getReportTableHeader(data)
    .then(response => response.data)
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 保存报表表头
 * @param {Object} data
 * @param {String} data.reportType 报表类型
 * @param {String} data.reportName 报表名称
 * @param {Array} data.headers 表头配置 [{ name: String, order: Number, show: Boolean }]
 */
export const saveReportTableHeader = ({ commit, state, rootState }, data) => {
  return report.saveReportTableHeader(data)
    .then(response => {
      if (response.success) {
        commit(types.SET_REPORT_HEADER_CONFIG, { data })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
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
export const queryCallRelayTimeReport = ({ commit, state, rootState }, data) => {
  return report.queryCallRelayTimeReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_RELAY_TIME_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportCallRelayTimeReport = ({ commit, state, rootState }, data) => {
  return report.exportCallRelayTimeReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryCallRelayAreaReport = ({ commit, state, rootState }, data) => {
  return report.queryCallRelayAreaReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_RELAY_AREA_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const openRelayAreaCity = ({ commit, state, rootState }, data) => {
  return report.openRelayAreaCity(data)
    .then(response => {
      if (response.success) {
        commit(types.OPEN_RELAY_AREA_CITY, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportCallRelayAreaReport = ({ commit, state, rootState }, data) => {
  return report.exportCallRelayAreaReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryCallCalloutTimeReport = ({ commit, state, rootState }, data) => {
  return report.queryCallCalloutTimeReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_CALLOUT_TIME_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportCallCalloutTimeReport = ({ commit, state, rootState }, data) => {
  return report.exportCallCalloutTimeReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryCallDialoutAreaReport = ({ commit, state, rootState }, data) => {
  return report.queryCallDialoutAreaReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_DIALOUT_AREA_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportCallDialoutAreaReport = ({ commit, state, rootState }, data) => {
  return report.exportCallDialoutAreaReport(data)
    .then(response => {
      if (response.success) {
        if (response.success) {
          commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
        }
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryCallQueueReport = ({ commit, state, rootState }, data) => {
  return report.queryCallQueueReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_QUEUE_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportCallQueueReport = ({ commit, state, rootState }, data) => {
  return report.exportCallQueueReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryCallQueueTimeReport = ({ commit, state, rootState }, data) => {
  return report.queryCallQueueTimeReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_QUEUE_TIME_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportCallQueueTimeReport = ({ commit, state, rootState }, data) => {
  return report.exportCallQueueTimeReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryCallAgentReport = ({ commit, state, rootState }, data) => {
  return report.queryCallAgentReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_AGENT_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
export const queryCallAgentReportWorkbench = ({ commit, state, rootState }, data) => {
  return report.queryCallAgentReport(data)
    .then(response => {
      if (response.success) {
        return response
      }
    }).catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
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
export const exportCallAgentReport = ({ commit, state, rootState }, data) => {
  return report.exportCallAgentReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 获取座席的工作量报表
 * @param {Object} data
 * @param {String} data.AgentID 座席id
 * @param {String} data.includeSubordinate 是否包含以下座席
 * @param {String} data.TimeType 时间类型（'day', 'month', 'year', 'other_half_hour'）
 * @param {String} [data.yearReport] 年
 * @param {String} [data.monthReport] 月
 * @param {String} [data.dayReport] 日
 * @param {String} [data.StartTime] 开始时间，YYYY-MM-DD HH:mm
 * @param {String} [data.EndTime] 结束时间，YYYY-MM-DD HH:mm
 * @param {String} data.YearID 格式YYYY0MMDD
 */
export const queryAgentTime = ({ commit, state, rootState }, data) => {
  return report.queryAgentTime(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_AGENT_TIME, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 获取座席工作量报表的软电话条状态
 * @param {Object} data
 * @param {String} data.Account 账户
 * @param {String} data.PBX pbx
 * @param {String} data.IsEnable
 */
export const queryAgentReportCti = ({ commit, state, rootState }, data) => {
  return report.queryAgentReportCti(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_AGENT_REPORT_CTI, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryCallApproveSurveyReport = ({ commit, state, rootState }, data) => {
  return report.queryCallApproveSurveyReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CALL_APPROVE_SURVEY_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportCallApproveSurveyReport = ({ commit, state, rootState }, data) => {
  return report.exportCallApproveSurveyReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
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
export const queryImMessageReport = ({ commit, state, rootState, dispatch }, data) => {
  return report.queryImMessageReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_IM_MESSAGE_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportImMessageReport = ({ commit, state, rootState }, data) => {
  return report.exportImMessageReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryImBusinessAnalyseReport = ({ commit, state, rootState }, data) => {
  return report.queryImBusinessAnalyseReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_IM_BUSINESS_ANALYSE_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportImBusinessAnalyseReport = ({ commit, state, rootState }, data) => {
  return report.exportImBusinessAnalyseReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryImAgentReport = ({ commit, state, rootState }, data) => {
  return report.queryImAgentReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_IM_AGENT_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportImAgentReport = ({ commit, state, rootState }, data) => {
  return report.exportImAgentReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryImCsrReport = ({ commit, state, rootState }, data) => {
  return report.queryImCsrReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_IM_CSR_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportImCsrReport = ({ commit, state, rootState }, data) => {
  return report.exportImCsrReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryImChannelCsrReport = ({ commit, state, rootState }, data) => {
  return report.queryImChannelCsrReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_IM_CHANNEL_CSR_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportImChannelCsrReport = ({ commit, state, rootState }, data) => {
  return report.exportImChannelCsrReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryImSessionTimeReport = ({ commit, state, rootState }, data) => {
  return report.queryImSessionTimeReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_IM_SESSION_TIME_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportImSessionTimeReport = ({ commit, state, rootState }, data) => {
  return report.exportImSessionTimeReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryImSessionFromReport = ({ commit, state, rootState }, data) => {
  return report.queryImSessionFromReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_IM_SESSION_FROM_REPORT, { data: response, type: data.reportType })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportImSessionFromReport = ({ commit, state, rootState }, data) => {
  return report.exportImSessionFromReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryImAgentResponseReport = ({ commit, state, rootState }, data) => {
  return report.queryImAgentResponseReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_IM_AGENT_RESPONSE_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportImAgentResponseReport = ({ commit, state, rootState }, data) => {
  return report.exportImAgentResponseReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
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
export const queryMailAgentReport = ({ commit, state, rootState }, data) => {
  return report.queryMailAgentReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_MAIL_AGENT_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportMailAgentReport = ({ commit, state, rootState }, data) => {
  return report.exportMailAgentReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryMailCategoryReport = ({ commit, state, rootState }, data) => {
  return report.queryMailCategoryReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_MAIL_CATEGORY_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportMailCategoryReport = ({ commit, state, rootState }, data) => {
  return report.exportMailCategoryReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
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
export const queryCustomerIncreaseReport = ({ commit, state, rootState }, data) => {
  return report.queryCustomerIncreaseReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_CUSTOMER_INCREASE_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportCustomerIncreaseReport = ({ commit, state, rootState }, data) => {
  return report.exportCustomerIncreaseReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
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
export const queryBusinessAnalyseReport = ({ commit, state, rootState }, data) => {
  return report.queryBusinessAnalyseReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_BUSINESS_ANALYSE_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportBusinessAnalyseReport = ({ commit, state, rootState }, data) => {
  return report.exportBusinessAnalyseReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryBusinessAgentReport = ({ commit, state, rootState }, data) => {
  return report.queryBusinessAgentReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_BUSINESS_AGENT_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportBusinessAgentReport = ({ commit, state, rootState }, data) => {
  return report.exportBusinessAgentReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryQuesResultReport = ({ commit, state, rootState }, data) => {
  return report.queryQuesResultReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_QUES_RESULT_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportQuesResultReport = ({ commit, state, rootState }, data) => {
  return report.exportQuesResultReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const queryQuesAnwserReport = ({ commit, state, rootState }, data) => {
  return report.queryQuesAnwserReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_QUES_ANWSER_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportQuesAnwserReport = ({ commit, state, rootState }, data) => {
  return report.exportQuesAnwserReport(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
/* 问卷报表 end */

/* 机器人报表 start */

/**
 * 机器人消息报表查询
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
export const queryRobotMessageReport = ({ commit, state, rootState }, data) => {
  return report.queryRobotMessageReport(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_ROBOT_MESSAGE_REPORT, { data: response })
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

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
export const exportRobotMessageExcel = ({ commit, state, rootState }, data) => {
  return report.exportRobotMessageExcel(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/**
 * 热点问题报表查询
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
export const queryRobotTop20Report = ({commit, state, rootState}, data) => {
  return report.queryRobotTop20Report(data)
    .then(response => {
      if (response.success) {
        commit(types.QUERY_ROBOT_TOP20_REPORT, {data: response})
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}
/**
 * 机器人热点问题报表导出
 */
export const exportRobotTop20Excel = ({ commit, state, rootState }, data) => {
  return report.exportRobotTop20Excel(data)
    .then(response => {
      if (response.success) {
        commit(globalTypes.SET_FILEDOWNLOAD, { path: response.path, isSession: true })
      } else {
        commit(globalTypes.SET_ERROR, 'report.exportError')
      }
    })
    .catch(err => {
      console.error(err)
      commit(globalTypes.SET_ERROR, 'message.default_tips')
    })
}

/* 机器人报表 end */
