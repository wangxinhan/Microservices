import send from './http'
const LOGIN = 'login'
const checkBeforeLogin = 'checkBeforeLogin'
const PUSHSOCKETLOGINED = 'app.push.pushSocketLogined'
export default {
  login (data) {
    let req = {
      data: data,
      action: LOGIN
    }
    return send.fetch(req, 'get')
  },
  initSessionId (sessionId) {
    return sessionId
  },
  pushSocketLogined (data) {
    let req = {
      data: data,
      action: PUSHSOCKETLOGINED
    }
    return send.fetch(req, 'post')
  },
  /**
   * 重新发送邮箱验证码
   * @param {Object} data
   * @param {String} data.lastCodeKey
   */
  retryMail2Authcode (data) {
    let req = {
      action: 'config.accountConfig.retryMail2Authcode',
      data
    }
    return send.fetch(req, 'post')
  },
  checkBeforeLogin (data) {
    let req = {
      data: data,
      action: checkBeforeLogin
    }
    return send.fetch(req, 'post')
  }
}
