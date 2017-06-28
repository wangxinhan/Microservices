/**
 * Created by zengyx on 16/12/17.
 */
import send from './http'

export default {

  /**
   * 更新邮件的忙碌开关状态
   * @param data {emailStatus: 'close'}
   * @returns {*}
   */
  updateEmailAutoClaimStatus (data) {
    let req = {
      data: data,
      action: 'app.email.updateAutoClaimEmailSessionStatus'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 更新技能组下的待处理数量
   * @returns {openNum:0, todoNum:0}
   */
  refreshMenuNum () {
    let req = {
      data: {},
      action: 'app.email.refreshMenuNum'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取邮件信息
   * @param {Object} data
   * @param {String} data.fromEmail 访客邮箱地址
   * @param {String} data.id 会话id
   */
  popupEmail (data) {
    let req = {
      data,
      action: 'app.popup.popupEmail'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 邮件选择已存在的客户定位
   * @param {Object} data
   * @param {String} data.customerId 客户id
   * @param {String} data.custName 客户名称
   * @param {String} data.callId
   */
  locationCustomer (data) {
    let req = {
      data,
      action: 'app.email.locationCustomer'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 解除客户绑定
   * @param {Object} data
   * @param {String} data.customerId 客户id
   * @param {String} data.email 邮箱地址
   */
  deleteCustomerImRelation (data) {
    let req = {
      data,
      action: 'app.email.deleteCustomerImRelation'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 座席回复邮件
   * @param {Object} data
   * @param {*} 邮件信息
   */
  replyInbox (data) {
    let req = {
      data,
      action: 'app.email.replyInbox'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 转发访客发的邮件
   * @param {Object} data
   * @param {*} 邮件信息
   */
  forwardEmail (data) {
    let req = {
      data,
      action: 'app.email.forwardEmail'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询座席正在处理的邮件
   * @param {Object} data
   */
  queryMyDealMailList (data) {
    let req = {
      data,
      action: 'app.email.queryMyDealMailList'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询全部邮件
   * @param {Object} data
   * @param {*} 查询条件
   */
  queryAllMailList (data) {
    let req = {
      data,
      action: 'app.email.queryAllMailList'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 保存备注
   * @param {Object} data
   * @param {String} data.remark 备注内容
   */
  saveRemark (data) {
    let req = {
      data,
      action: 'app.email.saveRemark'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 更新邮件状态
   * @param {Object} data
   * @param {*}
   */
  updateEmailSession (data) {
    let req = {
      data,
      action: 'app.email.updateEmailSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取新的邮件会话数据
   * @param {Object} data
   * @param {String} data.currDealEmailNum 正在处理数
   */
  claimNewEmailSession (data) {
    let req = {
      data,
      action: 'app.email.claimNewEmailSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 刷新未读数
   * @param {Object} data
   * @param {String} data._id 会话id
   */
  refreshLeakNum  (data) {
    let req = {
      data,
      action: 'app.email.refreshLeakNum '
    }
    return send.fetch(req, 'post')
  },

  /**
   * 完成邮件会话
   * @param {Object} data
   * @param {String} data.finishReason 完成原因
   * @param {String} data.finishKey 完成类型id
   * @param {String} data.finishiArr 完成会话数组
   */
  finishEmailSession (data) {
    let req = {
      data,
      action: 'app.email.finishEmailSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取邮件会话历史
   * @param {Object} data
   * @param {String} data.sessionId 邮件会话id
   */
  getLastEmail (data) {
    let req = {
      data,
      action: 'app.email.getLastEmail'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 转接会话
   * @param {Object} data
   * @param {String} data._id 会话id
   * @param {String} data.toUser  转接到座席id
   * @param {String} data.toUserName 转接到座席名称
   * @param {String} data.fromEmail 访客邮箱
   */
  redirectEmailSession (data) {
    let req = {
      data,
      action: 'app.email.redirectEmailSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 星标 未读标记
   * @param {Object} data
   * @param {String} data.sessionId 会话id
   * @param {String} data.readMark 未读 'read' 'unread'
   * @param {String} data.starMark 星标 'mark' 'unmark'
   */
  doMailMark  (data) {
    let req = {
      data,
      action: 'app.email.doMailMark'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 标记为指定分类
   * @param {Object} data
   * @param {String} data.sessionId 会话id
   * @param {String} data.categoryId 分类id
   * @param {String} data.categoryName 分类名称
   */
  defineMailCategory (data) {
    let req = {
      data,
      action: 'app.email.defineMailCategory'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取邮件分类
   * @param {Object} data
   * @param {*}
   */
  getMailCategory (data) {
    let req = {
      data,
      action: 'app.email.getMailCategory'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取邮件会话历史
   * @param {Object} data
   * @param {String} data.sessionId 会话id
   */
  loadEmailHistory (data) {
    let req = {
      data,
      action: 'app.email.loadEmailHistory'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 根据mailId获取邮件信息
   * @param {Object} data
   * @param {String} data._id 邮件id
   */
  queryMailInfo (data) {
    let req = {
      data,
      action: 'app.email.queryMailInfo'
    }
    return send.fetch(req, 'post')
  }
}
