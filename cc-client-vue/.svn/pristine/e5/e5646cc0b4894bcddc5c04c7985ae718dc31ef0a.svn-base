/**
 * Created by zengyx on 16/12/17.
 */

import send from './http'

export default {
  /**
   * 更新在线客服的忙碌开关状态
   * @param data {status: 'close'}
   * @returns {*}
   */
  updateWebchatAutoClaimStatus (data) {
    let req = {
      data: data,
      action: 'app.webchat.updateAutoClaimWebchatSessionStatus'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 刷新所属技能组下所有的待处理数,以及当前处理的数
   * @returns {openNum:0, todoNum:0}
   */
  refreshMenuNum () {
    let req = {
      data: {},
      action: 'app.webchat.refreshMenuNum'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 刷新所属技能组下所有的待处理数,以及当前处理的数
   * @param {String} data._id 会话id
   * @param {String} data.sid 访客id
   */
  popupWebchat (data) {
    let req = {
      data,
      action: 'app.popup.popupWebchat'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 定位客户
   * @param {Stirng} data.customerId 客户id
   * @param {Stirng} data.callId
   * @param {Stirng} data.custName 客户名称
   */
  locationCustomer (data) {
    let req = {
      data,
      action: 'app.webchat.locationCustomer'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 解除客户绑定
   * @param {Stirng} data.customerId 客户id
   */
  deleteCustomerImRelation (data) {
    let req = {
      data,
      action: 'app.webchat.deleteCustomerImRelation'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 座席接受到消息
   * @param {Stirng} data._id 会话id
   */
  dealMsg (data) {
    let req = {
      data,
      action: 'app.webchat.dealMsg'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 座席回复消息
   * @param {*} 消息内容
   */
  replyMsg (data) {
    let req = {
      data,
      action: 'app.webchat.replyMsg'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 点击更多历史消息时查询更多消息历史
   * @param {Stirng} data.sid 会话id
   * @param {Stirng} data.dateTime 时间
   * @param {Stirng} data.page 页码
   * @param {Stirng} data.limit 每页多少条
   */
  queryHistory (data) {
    let req = {
      data,
      action: 'app.webchat.queryHistory'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 滚动鼠标时获取更多聊天记录:
   * @param {Stirng} data.sessionId 会话
   * @param {Stirng} data.page
   * @param {Stirng} data.limit
   */
  queryUserHistory (data) {
    let req = {
      data,
      action: 'app.webchat.queryUserHistory'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 根据客户id查询访客信息:
   * @param {Stirng} data.customerId 客户id
   * @param {Stirng} data.page
   * @param {Stirng} data.limit
   */
  queryUserByCustId (data) {
    let req = {
      data,
      action: 'app.webchat.queryUserByCustId'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询处理中或全部IM会话数据:
   * @param {Stirng} data.submenu 菜单类型
   * @param {*}  查询条件
   */
  queryWebchatSession (data) {
    let req = {
      data,
      action: 'app.webchat.queryWebchatSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 导出全部中有处理类型的会话
   * @param {Stirng} data.submenu 菜单类型
   * @param {*}  查询条件
   */
  exportWebchat (data) {
    let req = {
      data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 根据id查询会话数据
   * @param {Stirng} data._id 会话id
   */
  queryChatSessionById (data) {
    let req = {
      data,
      action: 'app.webchat.queryChatSessionById'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 提醒访客座席正在输入中
   * @param {Stirng} data.sid 会话id
   * @param {Stirng} data.timestamp 时间戳
   */
  typeNotice (data) {
    let req = {
      data,
      action: 'app.webchat.typeNotice'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取待处理页面自定义展示项设置
   * @param {Stirng}
   */
  getWebchatTodoShowConfig (data) {
    let req = {
      data,
      action: 'app.webchat.getWebchatTodoShowConfig'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 保存待处理页面自定义展示项设置:
   * @param {Stirng} data.status 是否显示客户状态(true/false)
   * @param {Stirng} data.source 是否显示来源(true/false)
   * @param {Stirng} data.skillGroup 是否显示技能组(true/false)
   */
  saveWebchatTodoShowConfig (data) {
    let req = {
      data,
      action: 'app.webchat.saveWebchatTodoShowConfig'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 会话转接给指定座席或技能组
   * @param {String} data._id
   * @param {String} data.toUser 转接到座席id
   * @param {String} data.toUserName 座席名称
   * @param {String} data.sid 会话id
   * @param {String} data.queueId 转入技能组id
   * @param {String} data.toPeer 转入技能组id
   */
  redirectWebchatSession (data) {
    let req = {
      data,
      action: 'app.webchat.redirectWebchatSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 抢接座席会话
   * @param {Stirng} data._id
   * @param {Stirng} data.toUser 发起抢接的座席id
   * @param {Stirng} data.toUserName 抢接座席名称
   * @param {Stirng} data.sid 会话id
   * @param {Stirng} data.currUser 被抢接的座席id
   */
  grabWebchatSession (data) {
    let req = {
      data,
      action: 'app.webchat.grabWebchatSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 结束会话
   * @param {Stirng} data._id 会话id
   * @param {Stirng} data.sid 访客id
   * @param {Stirng} data.finishReason 结束类型
   * @param {Stirng} data.finishKey 结束会话类型id
   * @param {Stirng} data.remark 备注
   */
  finishWebchatSession (data) {
    let req = {
      data,
      action: 'app.webchat.finishWebchatSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 更新会话的备注信息
   * @param {Stirng} data.accessId 接入号
   * @param {Stirng} data.sid 访客id
   * @param {Stirng} data.content 备注内容
   */
  updateWebchatSessionRemark (data) {
    let req = {
      data,
      action: 'app.webchat.updateWebchatSessionRemark'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询全部自定义快捷回复语
   * @param {Stirng} data.moduleType "webchat"/"email"
   */
  getQuickReplyList (data) {
    let req = {
      data,
      action: 'app.webchat.getQuickReplyList'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 快捷回复输入联系时,查询全部回复语(自定义+系统)
   * @param {Stirng} data.moduleType "webchat"/"email"
   */
  getAllQuickReplyList (data) {
    let req = {
      data,
      action: 'app.webchat.getAllQuickReplyList'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 保存自定义快捷回复语
   * @param {Stirng} data.quickreplys ["hello","world"]
   * @param {Stirng} data.moduleType "webchat"/"email"
   */
  saveQuickReply (data) {
    let req = {
      data,
      action: 'app.webchat.saveQuickReply'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询全部系统通用快捷回复语:
   * @param {Stirng}
   */
  queryWebChatAllTags (data) {
    let req = {
      data,
      action: 'app.webchat.queryWebChatAllTags'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询根据标签id查询该标签下的快捷回复语
   * @param {Stirng}
   */
  queryWebChatTagsById (data) {
    let req = {
      data,
      action: 'app.webchat.queryWebChatTagsById'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取会话详情信息
   * @param {Stirng} data._id
   * @param {Stirng} data.cust_id 客户id
   * @param {boolean} data.queryHistory
   */
  queryChatInfoById (data) {
    let req = {
      data,
      action: 'app.webchat.queryChatInfoById'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 获取上传token
   * @param {Stirng} data.scope "m7-mail-resource"
   */
  getImUptoken (data) {
    let req = {
      data,
      action: 'app.webchat.getImUptoken'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 邀请座席协助
   * @param {Stirng} data._id
   * @param {Stirng} data.invitedUser 被邀请座席id
   * @param {Stirng} data.invitedUserName 被邀请座席名称
   * @param {Stirng} data.sid
   */
  inviteGroupSession (data) {
    let req = {
      data,
      action: 'app.webchat.inviteGroupSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 接受会话邀请
   * @param {Stirng} data._id
   * @param {Stirng} data.sid 会话sid,可以为空字符串
   * @param {Stirng} data.toPeer 技能组编号
   */
  acceptGroupSession (data) {
    let req = {
      data,
      action: 'app.webchat.acceptGroupSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 拒绝会话邀请
   * @param {Stirng} data._id 会话id
   */
  refusedGroupSession (data) {
    let req = {
      data,
      action: 'app.webchat.refusedGroupSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 取消会话邀请
   * @param {Stirng} data._id 会话id
   */
  cancelGroupSession (data) {
    let req = {
      data,
      action: 'app.webchat.cancelGroupSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 踢出邀请的座席
   * @param {Stirng} data._id
   * @param {Stirng} data.sid
   */
  kickGroupSession (data) {
    let req = {
      data,
      action: 'app.webchat.kickGroupSession'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 初始登陆的时候,获取未接受的会话邀请
   * @param {}
   */
  getUndealInvitation (data) {
    let req = {
      data,
      action: 'app.webchat.getUndealInvitation'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 推送满意度评价:
   * @param {Stirng}
   */
  pushImCSRInfo (data) {
    let req = {
      data,
      action: 'app.webchat.pushImCSRInfo'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 查询所有技能组:
   * @param {Stirng}
   */
  showAllSkillGroup (data) {
    let req = {
      data,
      action: 'app.webchat.showAllSkillGroup'
    }
    return send.fetch(req, 'post')
  },

  /**
   * 推送排队信息至客户端:
   * @param {Stirng}
   */
  pushQueueNumToWebChatClients (data) {
    let req = {
      data,
      action: 'app.webchat.pushQueueNumToWebChatClients'
    }
    return send.fetch(req, 'post')
  },
  /**
   * 获取主动邀请会话列表
   * @param data
   */
  getSessionsByAccount (data) {
    let req = {
      data,
      action: 'page.getSessionsByAccount'
    }
    return send.fetchByUba(req, 'post')
  },
  /**
   * 获取主动邀请会话列表
   * @param data
   */
  inviteCustomers (data) {
    let req = {
      data,
      action: 'cc.inviteCustomers'
    }
    return send.fetchByUba(req, 'post')
  },
  /**
   * 邀请会话列表加载更多的的轨迹页面信息
   * @param data
   */
  getUbaPagesBySessionId (data) {
    let req = {
      data,
      action: 'page.getUbaPagesBySessionId'
    }
    return send.fetchByUba(req, 'post')
  },
  /**
   * 在线咨询获取轨迹信息
   * @param data
   */
  getUbaPagesBySessionIdForWebchat (data) {
    let req = {
      data,
      action: 'page.getUbaPagesBySessionIdForWebchat'
    }
    return send.fetchByUba(req, 'post')
  },
  /**
   * 将访客加入黑名单
   * @param data
   */
  addBlack (data) {
    let req = {
      data,
      action: 'app.webchat.addBlack'
    }
    return send.fetch(req, 'post')
  }
  // /**
  //  * 拒绝视频邀请
  //  * @param data
  //  * */
  // rejectVideoInvite (data) {
  //   let req = {
  //     data,
  //     action: 'app.webchat.handlerAgentVideoOperation'
  //   }
  //   return send.fetch(req, 'post')
  // },
  // /**
  //  * 取消视频邀请
  //  * @param data
  //  * */
  // cancelVideoInvite (data) {
  //   let req = {
  //     data,
  //     action: 'app.webchat.handlerAgentVideoOperation'
  //   }
  //   return send.fetch(req, 'post')
  // },
  // /**
  //  * 座席主动请求视频聊天
  //  * @param data
  //  * */
  // requestVideoChat (data) {
  //   let req = {
  //     data,
  //     action: 'app.webchat.pushImVideoToCust'
  //   }
  //   return send.fetch(req, 'post')
  // }
}
