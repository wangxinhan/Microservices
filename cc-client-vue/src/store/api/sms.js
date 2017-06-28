/**
 * Created by JDL on 2017/1/18.
 */
import send from './http'
export default {
  sendsms (data) {
    let req = {
      data: data,
      action: 'app.sms.sendSms'
    }
    return send.fetch(req, 'post')
  },

  queryMySms (data) {
    let req = {
      data: data,
      action: 'app.sms.queryMySms'
    }
    return send.fetch(req, 'post')
  },

  queryAllSms (data) {
    let req = {
      data: data,
      action: 'app.sms.queryAllSms'
    }
    return send.fetch(req, 'post')
  },

  sendBatchSms (data) {
    let req = {
      data: data,
      action: 'app.sms.sendBatchSms'
    }
    return send.fetch(req, 'post')
  },

  querySmsImportTask (data) {
    let req = {
      data: data,
      action: 'app.sms.querySmsImportTask'
    }
    return send.fetch(req, 'post')
  },

  queryTaskImport (data) {
    let req = {
      data: data,
      action: 'app.sms.queryTaskImport'
    }
    return send.fetch(req, 'post')
  },

  queryTaskInvalid (data) {
    let req = {
      data: data,
      action: 'app.sms.queryTaskInvalid'
    }
    return send.fetch(req, 'post')
  },

  querySmsTemplateToCheck (data) {
    let req = {
      data: data,
      action: 'app.sms.querySmsTemplateToCheck'
    }
    return send.fetch(req, 'post')
  },

  smsCountImportToSend (data) {
    let req = {
      data: data,
      action: 'app.sms.smsCountImportToSend'
    }
    return send.fetch(req, 'post')
  },

  smsImportSend (data) {
    let req = {
      data: data,
      action: 'app.sms.smsImportSend'
    }
    return send.fetch(req, 'post')
  },

  querySmsTemplateToCheckMessage (data) {
    let req = {
      data: data,
      action: 'app.sms.querySmsTemplateToCheckMessage'
    }
    return send.fetch(req, 'post')
  },
  postSmsTemplate (data) {
    let req = {
      data: data,
      action: 'app.sms.postSmsTemplate'
    }
    return send.fetch(req, 'post')
  },
  cancelSmsTemplateToCheck (data) {
    let req = {
      data: data,
      action: 'app.sms.cancelSmsTemplateToCheck'
    }
    return send.fetch(req, 'post')
  },
  updateSmsTemplateToCheck (data) {
    let req = {
      data: data,
      action: 'app.sms.updateSmsTemplateToCheck'
    }
    return send.fetch(req, 'post')
  },
  changeSmsTemplateToCheckStatus (data) {
    let req = {
      data: data,
      action: 'app.sms.changeSmsTemplateToCheckStatus'
    }
    return send.fetch(req, 'post')
  },
  addSmsTemplateToCheckMessages (data) {
    let req = {
      data: data,
      action: 'app.sms.addSmsTemplateToCheckMessages'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 导出短信
   * @param {Object} data
   * @param {String} data.Method 导出类型，'exportAllSmsExcel'
   * @param {String} data.BEGIN_TIME 查询开始时间
   * @param {String} data.END_TIME 查询结束时间
   * @param {String} data.m7Status 短信状态
   * @param {String} data.num 手机号码
   * @param {String} data.sign 签名
   * @param {String} data.createUser 座席
   * @param {String} data.accountId 账户编号
   */
  exportAllSms (data) {
    const req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  }
}
