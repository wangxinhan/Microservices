/**
 * Created by zengyx on 16/12/15.
 */
import send from './http'

const CACHE_ACTION = 'common.getDicCache'
const MENU_ACTION = 'common.getUserInMenu'
const SYSTEM_CONFIG_ACTION = 'system.getUpNf'
const WEIXINUPTOKEN = 'app.weixin.getUptoken'
const WEBCHATUPTOKEN = 'app.webchat.getImUptoken'
export default {

  getDicCache (postData) {
    let req = {
      data: postData,
      action: CACHE_ACTION
    }
    return send.fetch(req, 'post')
  },

  getUserInMenu (postData) {
    let req = {
      data: postData,
      action: MENU_ACTION
    }
    return send.fetch(req, 'post')
  },

  initSystemConfig (postData) {
    let req = {
      data: postData,
      action: SYSTEM_CONFIG_ACTION
    }
    return send.fetchByPublic(req, 'get')
  },

  getWeinxinQiniuUptoken () {
    let req = {
      data: {},
      action: WEIXINUPTOKEN
    }
    return send.fetch(req, 'post')
  },

  getWebchatQiniuUptoken () {
    let req = {
      data: {},
      action: WEBCHATUPTOKEN
    }
    return send.fetch(req, 'post')
  }

}
