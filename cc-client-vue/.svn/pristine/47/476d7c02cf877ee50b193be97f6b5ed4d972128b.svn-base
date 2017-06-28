/**
 * Created by zengyx on 16/12/17.
 */

import send from './http'

export default {

  /**
   * 普通查询
   * @param {Object} data
   * @param {String} [data.pageSize] 每页几条 //10
   * @param {String} [data.page] 第几页 //1
   * @param {String} [data.menuId（quality_check_query）] 普通抽取 //quality_check_query
   * @param {String} [data.finishKey] 结束会话类型 //6d36ce00-970f-11e5-96c0-63f65a7c6f90
   * @param {String} [data.user] 座席 //6d36ce00-970f-11e5-96c0-63f65a7c6f90
   * @param {String} [data.includeSubordinate（true、false）] 包含已选座席下级 //true
   * @param {String} [data.msgCount] 消息条数 //10
   * @param {String} [data.msgCountType（gt、lt、eq）] 消息条数类型 //gt、lt、eq
   * @param {String} [data.beginTimeBegin] 会话领取时间的起始时间 //2016-01-0103:03
   * @param {String} [data.beginTimeEnd] 会话领取时间的结束时间 //2016-01-0103:03
   * @param {String} [data.appraiseKey] 满意度 //6d36ce00-970f-11e5-96c0-63f65a7c6f90
   */

  /**
   * 重新抽取
   * @param {Object} data
   * @param {String} [data.template{}] 当前模板信息，参数详情见表 //{}
   * @param {String} [data.reset（true）]
   * @param {String} data.menuId（quality_check_query_random）
   */

  /**
   * 条件模板直接切换，翻页
   * @param {Object} data
   * @param {String} [data.template] 当前模板信息 //{}
   * @param {String} [data.menuId]
   * @param {String} [data.pageSize]
   * @param {String} [data.page]
   */
  getQualityCheckWebchatSession (data) {
    const req = {
      data,
      action: 'app.qualityCheck.getQualityCheckWebchatSession'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话普通查询模式，质检模版切换，翻页
   * @param {Object} data
   * @param {String} [data.template] 当前模板信息 //{}
   * @param {String} [data.cdrId=quality_check_query]
   * @param {String} [data.pageSize]
   * @param {String} [data.page]
   */
  getQualityCheckCallSheet (data) {
    const req = {
      data,
      action: 'app.qualityCheck.getQualityCheckCallSheet'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 试听日志
   * @param {Object} data
   * @param {String} [data.CALL_SHEET_ID]
   * @param {String} [data.pageSize]
   * @param {String} [data.page]
   */
  recordListenLog (data) {
    const req = {
      data,
      action: 'app.qualityCheck.recordListenLog'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 仅保存或保存并抽取模板
   * @param {Object} data
   * @param {String} [data.TEMPLATE_NAME] 模板名称 //测试
   * @param {String} [data.EXT_RULE] 条件模板类型（随机抽取） //COUNT_TYPE_PERCENT、COUNT_TYPE_PERCENT
   * @param {String} [data.QUALITY_TYPE] 条件模板类型 //quality_webchat
   * @param {String} [data.COUNT_TYPE_PERCENT] 按百分比抽取 //entirety_percent、per_percent
   * @param {String} [data.COUNT_TYPE_NUM] 按条数抽取 //per_num、entirety_num
   * @param {String} [data.RANDOMNUM] 人均抽取条数 //10
   * @param {String} [data.PERCENT] 人均抽取百分比 //10
   * @param {String} [data.flag] 仅保存、保存并抽取模板 //add、addAndSelect
   * @param {String} [data.selectedAgentList] 所选座席 //["a5a59760-7956-11e6-bd2e-f7cad8b571c4"]
   * @param {String} [data.includeSubordinate（true、false）] 是否包含已选座席下级 //true、false
   * @param {String} [data.finishKey] 结束会话类型 //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} [data.msgCount] 消息条数 //10
   * @param {String} [data.msgCountType（gt、lt、eq）] 消息条数类型 //gt、lt、eq
   * @param {String} [data.beginTimeBegin] 会话领取时间的起始时间 //2016-10-0213:30
   * @param {String} [data.beginTimeEnd] 会话领取时间的结束时间 //2016-10-0213:40
   * @param {String} [data.appraiseKey] 满意度 //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   */
  addOrSelectRandomTemplate (data) {
    const req = {
      data,
      action: 'app.qualityCheck.addOrSelectRandomTemplate'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 置换
   * @param {Object} data
   * @param {String} [data.randomTemplateId] 条件模板ID //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} [data.user] 会话所属座席 //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} data.sessionId 会话id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} [data.idList[]] 已经被置换过的数据的id的集合 //["a5a59760-7956-11e6-bd2e-f7cad8b571c4"]
   */
  displacesTmpWebchatSession (data) {
    const req = {
      data,
      action: 'app.qualityCheck.displacesTmpWebchatSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 记录查看日志
   * @param {Object} data
   * @param {String} [data._id] 会话的id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   */
  recordWebchatSessionLog (data) {
    const req = {
      data,
      action: 'app.qualityCheck.recordWebchatSessionLog'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 记录查看日志
   * @param {Object} data
   * @param {String} [data.pageSize]
   * @param {String} [data.page]
   * @param {String} [data.sessionId] 会话的id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   */
  queryRecordWebchatSessionLog (data) {
    const req = {
      data,
      action: 'app.qualityCheck.queryRecordWebchatSessionLog'
    }
    return send.fetch(req, 'post')
  },

  queryRecordCallListenLog (data) {
    const req = {
      data,
      action: 'app.qualityCheck.queryListenLog'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 保存评分
   * @param {Object} data
   * @param {String} [data._id] 会话id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} [data.comments] 备注 //备注
   * @param {String} [data.grade_data] 评分信息，参数详情见表app_chat_quality_check //{}
   */
  saveWebchatSessionGrade (data) {
    const req = {
      data,
      action: 'app.qualityCheck.saveWebchatSessionGrade'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 保存评分--打分
   * @param {Object} data
   * @param {String} [data._id] 会话id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} [data.comments] 备注 //备注
   * @param {String} [data.grade_data] 评分信息，参数详情见表app_chat_quality_check //{}
   */
  saveCallSheetGrade (data) {
    const req = {
      data,
      action: 'app.qualityCheck.saveCallSheetGrade'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 保存评分--pass
   * @param {Object} data
   * @param {String} [data._id] 会话id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} [data.comments] 备注 //备注
   * @param {String} [data.grade_data] 评分信息，参数详情见表app_chat_quality_check //{}
   */
  saveCallShellGrade (data) {
    const req = {
      data,
      action: 'app.qualityCheck.saveCallShellGrade'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 质检结果查询
   * @param {Object} data
   * @param {String} data.TEMPLATE //质检模板Id
   * @param {String} data.user //会话座席
   * @param {Boolean} data.includeSubordinate //是否包含已选座席下级
   * @param {String} data.beginTimeBegin/beginTimeEnd //会话开始/结束时间 eg:"2016-12-12 00:00:00"
   * @param {String} data.CHECK_BEGIN_TIME/CHECK_END_TIME //质检开始/结束时间 eg:"2016-12-12 00:00:00"
   * @param {Array} data.toPeer //技能组 eg:["10000378"]
   * @param {String} data.appraiseKey //满意度key
   * @param {num} data.msgCountBegin/msgCountEnd //消息条数最小/最大
   * @param {num} data.GRADE_CONFIG //单项评分
   * @param {String} data.GRADE_MIN/GRADE_MAX //单项评分最小/最大
   * @param {String} data.grade_user //质检人员id
   * @param {num} data.pageSize //每页条数
   * @param {String} data.page  //页码
   * @param {Object} data.GRADE_AMOUNT //质检评级 eg:{"$gte":94.5}
   */
  queryWebchatGradeList (data) {
    const req = {
      data,
      action: 'app.qualityCheck.queryWebchatGradeList'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话质检结果查询
   * @param {Object} data
   * @param {String} data.TEMPLATE //质检模板Id
   * @param {String} data.user //会话座席
   * @param {Boolean} data.includeSubordinate //是否包含已选座席下级
   * @param {String} data.beginTimeBegin/beginTimeEnd //会话开始/结束时间 eg:"2016-12-12 00:00:00"
   * @param {String} data.CHECK_BEGIN_TIME/CHECK_END_TIME //质检开始/结束时间 eg:"2016-12-12 00:00:00"
   * @param {Array} data.toPeer //技能组 eg:["10000378"]
   * @param {String} data.appraiseKey //满意度key
   * @param {num} data.msgCountBegin/msgCountEnd //消息条数最小/最大
   * @param {num} data.GRADE_CONFIG //单项评分
   * @param {String} data.GRADE_MIN/GRADE_MAX //单项评分最小/最大
   * @param {String} data.grade_user //质检人员id
   * @param {num} data.pageSize //每页条数
   * @param {String} data.page  //页码
   * @param {Object} data.GRADE_AMOUNT //质检评级 eg:{"$gte":94.5}
   */
  queryCallSheetGradeList (data) {
    const req = {
      data,
      action: 'app.qualityCheck.queryCallSheetGradeList'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 座席质检查询
   * @param data
   * @param data.TEMPLATE //质检模板Id
   * @param data.user  //会话座席
   * @param data.includeSubordinate  //是否包含已选座席下级
   * @param data.beginTimeBegin/beginTimeEnd  //会话开始/结束时间
   * @param data.BEGIN_TIME/END_TIME  //质检开始/结束时间
   * @param data.pageSize  //每页条数
   * @param data.page  //页码
   */
  queryWebchatGradeResult (data) {
    const req = {
      data,
      action: 'app.qualityCheck.queryWebchatGradeResult'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话座席质检查询
   * @param data
   * @param data.TEMPLATE //质检模板Id
   * @param data.user  //会话座席
   * @param data.includeSubordinate  //是否包含已选座席下级
   * @param data.beginTimeBegin/beginTimeEnd  //会话开始/结束时间
   * @param data.BEGIN_TIME/END_TIME  //质检开始/结束时间
   * @param data.pageSize  //每页条数
   * @param data.page  //页码
   */
  queryCallSheetGradeResult (data) {
    const req = {
      data,
      action: 'app.qualityCheck.queryCallSheetGradeResult'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 在线咨询质检排名
   * @param data
   * @param {Array} data.RANKING_AGENT //排名座席
   * @param {Boolean} data.includeSubordinate //是否包含已选座席下级
   * @param {String} data.TEMPLATE //模板id
   * @param data
   */
  agentChatRanking (data) {
    const req = {
      data,
      action: 'app.qualityCheck.agentChatRanking'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话质检排名
   * @param data
   * @param {Array} data.RANKING_AGENT //排名座席
   * @param {Boolean} data.includeSubordinate //是否包含已选座席下级
   * @param {String} data.TEMPLATE //模板id
   * @param data
   */
  agentRanking (data) {
    const req = {
      data,
      action: 'app.qualityCheck.agentRanking'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 获取条件模板
   * @param data
   * @param {Array} data.RANKING_AGENT //排名座席
   * @param {Boolean} data.includeSubordinate //是否包含已选座席下级
   * @param {String} data.TEMPLATE //模板id
   * @param data
   */
  getQualityCheckRandomTemplates (data) {
    const req = {
      data,
      action: 'app.qualityCheck.getQualityCheckRandomTemplates'
    }
    return send.fetch(req, 'post')
  },
  exportQualityCheckExcel (data) {
    let req = {
      data: data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 质检任务监测搜索模板
   * @param data
   * @param data.BEGIN_TIME
   * @param data.END_TIME
   * @param data.hide  //true flase
   * @param data.QA_SPECIALIST
   * @param data.pageSize  //每页条数
   * @param data.page  //页码
   */
  getQualityTaskTemplateList (data) {
    const req = {
      data,
      action: 'app.qualityCheck.getQualityTaskTemplateList'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 获取客戶信息
   * @param data
   * @param {String} data._id
   */
  relocationCustomer (data) {
    let req = {
      data: data,
      action: 'app.callSheet.relocationCustomer'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 质检周期查询  质检模板数据
   * @param data.idel=''
   */
  queryQualityCheckedtabletitle (data) {
    const req = {
      data: data,
      action: 'config.qualityCheck.queryQualityCheckedtabletitle'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 质检周期查询  周期下拉框数据
   * @param data.idel=''
   */
  queryQualityCheckedCycle (data) {
    const req = {
      data: data,
      action: 'config.qualityCheck.queryQualityCheckedCycle'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 质检周期查询
   * @param data
   * @param data.QA_SPECIALIST
   * @param data.qualityChecked_cycle
   * @param data.qualityChecked_start_cycle
   * @param data.qualityChecked_end_cycle
   * @param data.qualityChecked_table
   * @param data.qualityChecked_floors
   * @param data.selectedAgent
   */
  queryCycleReport (data) {
    const req = {
      data: data,
      action: 'app.qualityCheck.queryCycleReport'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话条件模板仅保存模板
   * @param {Object} dataC
   * @param {String} [data.TEMPLATE_NAME] 模板名称 //测试
   * @param {String} [data.EXT_RULE] 条件模板类型（随机抽取） //COUNT_TYPE_PERCENT、COUNT_TYPE_PERCENT
   * @param {String} [data.QUALITY_TYPE] 条件模板类型 //quality_webchat
   * @param {String} [data.COUNT_TYPE_PERCENT] 按百分比抽取 //entirety_percent、per_percent
   * @param {String} [data.COUNT_TYPE_NUM] 按条数抽取 //per_num、entirety_num
   * @param {String} [data.RANDOMNUM] 人均抽取条数 //10
   * @param {String} [data.PERCENT] 人均抽取百分比 //10
   * @param {String} [data.BEGIN_TIME] 呼叫时间
   * @param {String} [data.END_TIME] 呼叫时间
   * @param {String} [data.CONNECT_TYPE_SELECTED] 呼叫类型
   * @param {String} [data.ERROR_MEMO_SELECTED] 技能组
   * @param {String} [data.CALL_TIME_LENGTH_BEGIN] 通话时长
   * @param {String} [data.CALL_TIME_LENGTH_END] 通话时长
   * @param {String} [data.INVESTIGATE] 满意度
   * @param {String} [data.singleLabel] 录音内容分类
   * @param {String} [data.selectedAgentList] 所选座席 //["a5a59760-7956-11e6-bd2e-f7cad8b571c4"]
   * @param {String} [data.includeSubordinate（true、false）] 是否包含已选座席下级 //true、false
   */
  addQualityCheckRandomTemplates (data) {
    const req = {
      data: data,
      action: 'app.qualityCheck.addQualityCheckRandomTemplates'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话条件模板置换数据
   * @param {Object} data
   * @param {String} [data.callId] _id
   * @param {String} [data.randomTemplate] 条件模板id
   * @param {String} [data.idList] 已经置换过的id集合
   */
  queryAllConditionData (data) {
    const req = {
      data: data,
      action: 'app.qualityCheck.queryAllConditionData'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话删除条件模板
   * @param {Object} data
   * @param {String} [data.randomTemplate] 条件模板id
   */
  removeQualityCheckRandomTemplates (data) {
    const req = {
      data: data,
      action: 'app.qualityCheck.removeQualityCheckRandomTemplates'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话任务模板保存并执行模板
   * @param {Object} data
   * @param {String} [data.TASK_NAME] 模板名称 //测试
   * @param {String} [data.TASK_TEMPLATE] 任务模板id
   * @param {String} [data.EXT_RULE] 条件模板类型（随机抽取） //COUNT_TYPE_PERCENT、COUNT_TYPE_PERCENT
   * @param {String} [data.QUALITY_TYPE] 条件模板类型 //quality_webchat
   * @param {String} [data.COUNT_TYPE_PERCENT] 按百分比抽取 //entirety_percent、per_percent
   * @param {String} [data.COUNT_TYPE_NUM] 按条数抽取 //per_num、entirety_num
   * @param {String} [data.RANDOMNUM] 人均抽取条数 //10
   * @param {String} [data.PERCENT] 人均抽取百分比 //10
   * @param {String} [data.BEGIN_TIME] 呼叫时间
   * @param {String} [data.END_TIME] 呼叫时间
   * @param {String} [data.CONNECT_TYPE_SELECTED] 呼叫类型
   * @param {String} [data.ERROR_MEMO_SELECTED] 技能组
   * @param {String} [data.CALL_TIME_LENGTH_BEGIN] 通话时长
   * @param {String} [data.CALL_TIME_LENGTH_END] 通话时长
   * @param {String} [data.INVESTIGATE] 满意度
   * @param {String} [data.singleLabel] 录音内容分类(单级)
   * @param {String} [data.multiFirst] 录音内容分类(多级1级)
   * @param {String} [data.multiTwo] 录音内容分类(多级2级)
   * @param {String} [data.multiThree] 录音内容分类(多级3级)
   * @param {String} [data.selectedAgentList] 所选座席 //["a5a59760-7956-11e6-bd2e-f7cad8b571c4"]
   * @param {String} [data.includeSubordinate（true、false）] 是否包含已选座席下级 //true、false
   * @param {String} [data.QA_SPECIALIST] 质检专员id

   *
   */
  addQualityTaskTemplate (data) {
    const req = {
      data: data,
      action: 'app.qualityCheck.addQualityTaskTemplate'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话获取所有任务模板
   * @param {Object} data {}
   *
   */
  getQualityTaskTemplates (data) {
    const req = {
      data,
      action: 'app.qualityCheck.getQualityTaskTemplates'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话删除任务模板
   * @param {Object} data
   * @param {String} [data.taskTemplate] 任务模板id
   */
  removeQualityCheckTaskTemplates (data) {
    const req = {
      data: data,
      action: 'app.qualityCheck.removeQualityCheckTaskTemplates'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 通话任务模板置换数据
   * @param {Object} data
   * @param {String} [data.randomTemplateId] 条件模板ID //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} [data.user] 会话所属座席 //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} data.sessionId 会话id //a5a59760-7956-11e6-bd2e-f7cad8b571c4
   * @param {String} [data.idList[]] 已经被置换过的数据的id的集合 //["a5a59760-7956-11e6-bd2e-f7cad8b571c4"]
   */
  replacementRecord (data) {
    const req = {
      data,
      action: 'app.qualityCheck.replacementRecord'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 获取坐席提交记录
   * @param {Object} data {}
   */
  querySubmitedCdrList (data) {
    const req = {
      data,
      action: 'app.qualityCheck.querySubmitedCdrList'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 根据id获取到具体记录
   * @param {Object} data
   * @param {Object} data[page]
   * @param {Object} data[pageSize]
   * @param {Object} data[_id] {"$in":["372431b9-8c44-48d0-a32b-b5fd4d25d3a0"]}
   */
  querySubmitedCallSheet (data) {
    const req = {
      data,
      action: 'app.qualityCheck.querySubmitedCallSheet'
    }
    return send.fetch(req, 'post')
  }
}

