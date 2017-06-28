/**
 * Created by jiaji on 2016/12/29.
 */

import send from './http'

export default {

  /**
   * 分页获取我的问卷
   * @param {Object} data
   * @param {String} [data.name] 名称 //"1321"
   * @param {String} [data.phone] 电话 //"18210195609"
   * @param {String} [data.createTime_begin_date] 创建时间 //"2016-12-1300:00"
   * @param {String} [data.createTime_end_date]
   * @param {String} [data.lastUpdateTime_begin_date] 回访时间 //"2016-12-1307:00"
   * @param {String} [data.lastUpdateTime_end_date]
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 状态id //"invalid"
   * @param {String} [data.batchNo] 导入批次号 //"20161110162528"
   * @param {String} [data.batchRemark] 批次说明 //"10w3"
   * @param {String} [data.page] 页码 //"2"
   * @param {String} [data."limit"] 每页条数 //10
   */
  getUserAllQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.getUserAllQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 分页获取我的未完成的问卷
   * @param {Object} data
   * @param {String} [data.name] 名称 //"1321"
   * @param {String} [data.phone] 电话 //"18210195609"
   * @param {String} [data.createTime_begin_date] 创建时间 //"2016-12-1300:00"
   * @param {String} [data.createTime_end_date]
   * @param {String} [data.lastUpdateTime_begin_date] 回访时间 //"2016-12-1307:00"
   * @param {String} [data.lastUpdateTime_end_date]
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 状态id //"invalid"
   * @param {String} [data.batchNo] 导入批次号 //"20161110162528"
   * @param {String} [data.batchRemark] 批次说明 //"10w3"
   * @param {String} [data.page] 页码 //"2"
   * @param {String} [data."limit"] 每页条数 //10
   */
  getUserUncompleteQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.getUserUncompleteQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 分页获取我的已完成的问卷
   * @param {Object} data
   * @param {String} [data.name] 名称 //"1321"
   * @param {String} [data.phone] 电话 //"18210195609"
   * @param {String} [data.createTime_begin_date] 创建时间 //"2016-12-1300:00"
   * @param {String} [data.createTime_end_date]
   * @param {String} [data.lastUpdateTime_begin_date] 回访时间 //"2016-12-1307:00"
   * @param {String} [data.lastUpdateTime_end_date]
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 状态id //"invalid"
   * @param {String} [data.batchNo] 导入批次号 //"20161110162528"
   * @param {String} [data.batchRemark] 批次说明 //"10w3"
   * @param {String} [data.page] 页码 //"2"
   * @param {String} [data."limit"] 每页条数 //10
   */
  getUserCompleteQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.getUserCompleteQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 分页获取我的待确认的问卷
   * @param {Object} data
   * @param {String} [data.name] 名称 //"1321"
   * @param {String} [data.phone] 电话 //"18210195609"
   * @param {String} [data.createTime_begin_date] 创建时间 //"2016-12-1300:00"
   * @param {String} [data.createTime_end_date]
   * @param {String} [data.lastUpdateTime_begin_date] 回访时间 //"2016-12-1307:00"
   * @param {String} [data.lastUpdateTime_end_date]
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 状态id //"invalid"
   * @param {String} [data.batchNo] 导入批次号 //"20161110162528"
   * @param {String} [data.batchRemark] 批次说明 //"10w3"
   * @param {String} [data.page] 页码 //"2"
   * @param {String} [data."limit"] 每页条数 //10
   */
  getUserUnconfirmQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.getUserUnconfirmQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 分页获取所有的问卷
   * @param {Object} data
   * @param {String} [data.name] 名称 //"1321"
   * @param {String} [data.phone] 电话 //"18210195609"
   * @param {String} [data.createTime_begin_date] 创建时间 //"2016-12-1300:00"
   * @param {String} [data.createTime_end_date]
   * @param {String} [data.lastUpdateTime_begin_date] 回访时间 //"2016-12-1307:00"
   * @param {String} [data.lastUpdateTime_end_date]
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 状态id //"invalid"
   * @param {String} [data.batchNo] 导入批次号 //"20161110162528"
   * @param {String} [data.batchRemark] 批次说明 //"10w3"
   * @param {String} [data.page] 页码 //"2"
   * @param {String} [data."limit"] 每页条数 //10
   * @param {String} [data.assignStatus] 分配状态 //
   * @param {String} [data.ownercom] 当前处理人 //"myself"
   * @param {String} [data.owner] 当前处理人 //
   * @param {String} [data.ownerdep] 当前处理人 //
   */
  getAllQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.getAllQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 分页获取所有的未完成的问卷
   * @param {Object} data
   * @param {String} [data.name] 名称 //"1321"
   * @param {String} [data.phone] 电话 //"18210195609"
   * @param {String} [data.createTime_begin_date] 创建时间 //"2016-12-1300:00"
   * @param {String} [data.createTime_end_date]
   * @param {String} [data.lastUpdateTime_begin_date] 回访时间 //"2016-12-1307:00"
   * @param {String} [data.lastUpdateTime_end_date]
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 状态id //"invalid"
   * @param {String} [data.batchNo] 导入批次号 //"20161110162528"
   * @param {String} [data.batchRemark] 批次说明 //"10w3"
   * @param {String} [data.page] 页码 //"2"
   * @param {String} [data."limit"] 每页条数 //10
   * @param {String} [data.assignStatus] 分配状态 //
   * @param {String} [data.ownercom] 当前处理人 //"myself"
   * @param {String} [data.owner] 当前处理人 //
   * @param {String} [data.ownerdep] 当前处理人 //
   */
  getAllUncompleteQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.getAllUncompleteQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 分页获取所有的已完成问卷
   * @param {Object} data
   * @param {String} [data.name] 名称 //"1321"
   * @param {String} [data.phone] 电话 //"18210195609"
   * @param {String} [data.createTime_begin_date] 创建时间 //"2016-12-1300:00"
   * @param {String} [data.createTime_end_date]
   * @param {String} [data.lastUpdateTime_begin_date] 回访时间 //"2016-12-1307:00"
   * @param {String} [data.lastUpdateTime_end_date]
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 状态id //"invalid"
   * @param {String} [data.batchNo] 导入批次号 //"20161110162528"
   * @param {String} [data.batchRemark] 批次说明 //"10w3"
   * @param {String} [data.page] 页码 //"2"
   * @param {String} [data."limit"] 每页条数 //10
   * @param {String} [data.assignStatus] 分配状态 //
   * @param {String} [data.ownercom] 当前处理人 //"myself"
   * @param {String} [data.owner] 当前处理人 //
   * @param {String} [data.ownerdep] 当前处理人 //
   */
  getAllCompleteQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.getAllCompleteQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 分页获取所有的待确认问卷
   * @param {Object} data
   * @param {String} [data.name] 名称 //"1321"
   * @param {String} [data.phone] 电话 //"18210195609"
   * @param {String} [data.createTime_begin_date] 创建时间 //"2016-12-1300:00"
   * @param {String} [data.createTime_end_date]
   * @param {String} [data.lastUpdateTime_begin_date] 回访时间 //"2016-12-1307:00"
   * @param {String} [data.lastUpdateTime_end_date]
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 状态id //"invalid"
   * @param {String} [data.batchNo] 导入批次号 //"20161110162528"
   * @param {String} [data.batchRemark] 批次说明 //"10w3"
   * @param {String} [data.page] 页码 //"2"
   * @param {String} [data."limit"] 每页条数 //10
   * @param {String} [data.assignStatus] 分配状态 //
   * @param {String} [data.ownercom] 当前处理人 //"myself"
   * @param {String} [data.owner] 当前处理人 //
   * @param {String} [data.ownerdep] 当前处理人 //
   */
  getAllUnconfirmQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.getAllUnconfirmQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 根据id获取问卷信息
   * @param {Object} data
   * @param {String} [data._id] 问卷id //"7c9c7f0a-5d99-4842-8155-e2fd743452db"
   */
  getQuesById (data) {
    const req = {
      data,
      action: 'app.questionnaire.getQuesById'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 提交问卷
   * @param {Object} data
   * @param {String} [data._id] 问卷id //"7c9c7f0a-5d99-4842-8155-e2fd743452db"
   * @param {Object} [data.anws] 问卷问题答案 //结构如下
   { //问卷问题答案
          "7d2941c1-4c96-11e6-aeb0-b52a63699a00": { //问题id
              "aws": [ //答案
                  "7d2941c0-4c96-11e6-aeb0-b52a63699a00" //答案id
              ],
              "other": "阿范德萨发的" //备注
          },
          "834d5eb2-4c96-11e6-aeb0-b52a63699a00": {
              "aws": [
                  "834d5eb1-4c96-11e6-aeb0-b52a63699a00"
              ],
              "other": ""
          }
    }
   * @param {String} [data.result] //是否成功 //"success"
   * @param {String} [data.status]
   */
  completeQuestionnaire (data) {
    const req = {
      data,
      action: 'app.questionnaire.completeQuestionnaire'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 稍后回访
   * @param {Object} data
   * @param {String} [data._id] 问卷id //"7c9c7f0a-5d99-4842-8155-e2fd743452db"
   * @param {String} [data.notifyTime] //联系时间 //"2016-12-1317:30"
   * @param {String} [data.status] //设置问卷状态 //"complete"
   */
  confirmQuesCallTask (data) {
    const req = {
      data,
      action: 'app.questionnaire.confirmQuesCallTask'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查找问卷导入批次
   * @param {Object} data
   * @param {Object} [data.query] 查询条件 //结构如下
   {
       "batchNo": "20161110162528", 批次号
       "batchRemark": "10w3", 批次说明
       "flag": "finish", 导入状态 等待处理start 处理中process 解析excel入库中import 完成finish 失败failure
       "createTime_begin_date": "2015-09-03",  //创建时间
       "createTime_end_date": "2016-12-31"
   }
   * @param {String} [data.queryType] //查询类型 //"questionnaire_import"
   * @param {String} [data.option] //设置问卷状态 //{"index":1,//页数"pageSize":10//每页条数}
   */
  queryQuestionTask (data) {
    const req = {
      data,
      action: 'app.questionnaire.queryQuestionTask'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 问卷导入，获取excel文件的头信息
   * @param {Object} data
   * @param {String} [data.trueName] 文件名 //"461cf773-86c3-40c6-8f10-ed27ae3502c1.xlsx"
   * @param {String} [data.fileName] 上传至服务器的的文件名 //"050f6f1336ea69a6aa82f10571bb2f69"
   */
  getXlsHeads (data) {
    const req = {
      data,
      action: 'app.questionnaire.getXlsHeads'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 问卷导入
   * @param {Object} data
   * @param {String} [data.fileName] 文件名 //"461cf773-86c3-40c6-8f10-ed27ae3502c1.xlsx"
   * @param {String} [data.fileName] 上传至服务器的的文件名 //"050f6f1336ea69a6aa82f10571bb2f69"
   * @param {String} [data.dbType] 模板id //"8ae9f3c0-0148-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.batchNo] 导入批次号 //"20161213175721"
   * @param {String} [data.batchRemark] 导入批次说明 //"fsdafs"
   * @param {String} [data.heads] 选定的表头信息 //["name","phone"]
   * @param {String} [data.dic]
   * @param {String} [data.flag]
   */
  quesImport (data) {
    const req = {
      data,
      action: 'app.questionnaire.import'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取问卷联系历史
   * @param {Object} data
   * @param {String} [data._id] 问卷id //"4bb6cd6f-75a6-4c18-92ed-2b68f4ad5985"
   * @param {Number} [data.limit] 分页limit
   * @param {Number} [data.page] 分页page
   */
  getQuesCallSheet (data) {
    const req = {
      data,
      action: 'app.questionnaire.getQuesCallSheetWithPage'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 添加问卷备注
   * @param {Object} data
   * @param {String} [data._id] 问卷id //"4bb6cd6f-75a6-4c18-92ed-2b68f4ad5985"
   * @param {String} [data.comment] 问卷备注内容 //"阿范德萨发的"
   */
  addQuesComment (data) {
    const req = {
      data,
      action: 'app.questionnaire.addQuesComment'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 问卷导出
   * @param {Object} data
   * @param {String} [data.name] 客户名称 //"231232132"
   * @param {String} [data.phone] 电话 //"123143253456"
   * @param {String} [data.assignStatus] 分配状态 //"assigned"
   * @param {String} [data.ownercom] 当前处理人 //"myself"
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 问卷状态 //"invalid"
   * @param {String} [data.batchNo] 批次号 //"20161110162528;"
   * @param {String} [data.batchRemark] 批次说明 //"10w2;"
   * @param {String} [data.status] 完成状态 //"complete"
   * @param {String} [data.lastUpdateTime] 回访时间 //{"$lte":"2016-12-1300:0023:59:59"}
   * @param {String} [data.createTime] 创建时间 //{"$lte":"2016-12-1300:0023:59:59"}
   */
  exportQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.exportQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取问卷数量
   * @param {Object} data
   * @param {String} [data.name] 客户名称 //"231232132"
   * @param {String} [data.phone] 电话 //"123143253456"
   * @param {String} [data.assignStatus] 分配状态 //"assigned"
   * @param {String} [data.ownercom] 当前处理人 //"myself"
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 问卷状态 //"invalid"
   * @param {String} [data.batchNo] 批次号 //"20161110162528;"
   * @param {String} [data.batchRemark] 批次说明 //"10w2;"
   * @param {String} [data.status] 完成状态 //"complete"
   * @param {String} [data.lastUpdateTime] 回访时间 //{"$lte":"2016-12-1300:0023:59:59"}
   * @param {String} [data.createTime] 创建时间 //{"$lte":"2016-12-1300:0023:59:59"}
   */
  getQuesCount (data) {
    const req = {
      data,
      action: 'app.questionnaire.getQuesCount'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 删除问卷
   * @param {Object} data
   * @param {String} [data.name] 客户名称 //"231232132"
   * @param {String} [data.phone] 电话 //"123143253456"
   * @param {String} [data.assignStatus] 分配状态 //"assigned"
   * @param {String} [data.ownercom] 当前处理人 //"myself"
   * @param {String} [data.temp_id] 模板id //"82be1990-0140-11e6-8bdf-a355f20ed7ea"
   * @param {String} [data.result] 问卷状态 //"invalid"
   * @param {String} [data.batchNo] 批次号 //"20161110162528;"
   * @param {String} [data.batchRemark] 批次说明 //"10w2;"
   * @param {String} [data.status] 完成状态 //"complete"
   * @param {String} [data.lastUpdateTime] 回访时间 //{"$lte":"2016-12-1300:0023:59:59"}
   * @param {String} [data.createTime] 创建时间 //{"$lte":"2016-12-1300:0023:59:59"}
   */
  deleteQues (data) {
    const req = {
      data,
      action: 'app.questionnaire.deleteQues'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通过时间区间获取批次号
   * @param {Object} data
   * @param {String} [data.start] 创建起始时间 //"2015-07-0200:00"
   * @param {String} [data.end] 创建结束时间 //"2016-12-1316:47"
   */
  getBatchNoByTime (data) {
    const req = {
      data,
      action: 'app.questionnaire.getBatchNoByTime'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 通过时间区间获取批次说明
   * @param {Object} data
   * @param {String} [data.start] 创建起始时间 //"2015-07-0200:00"
   * @param {String} [data.end] 创建结束时间 //"2016-12-1316:47"
   */
  getBatchRemarkByTime (data) {
    const req = {
      data,
      action: 'app.questionnaire.getBatchRemarkByTime'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 分配问卷给座席
   * @param data
   * @param data.query 查询条件
   * @param data.owners [{owner, count}],座席分配量
   * @param data.total 分配总数
   * @returns {*}
   */
  saveQuesAssign (data) {
    const req = {
      data,
      action: 'app.questionnaire.saveQuesAssign'
    }
    return send.fetch(req, 'post')
  }
}

