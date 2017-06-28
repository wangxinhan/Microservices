/**
 * Created by liujing on 16/12/26.
 * 用户模块,与后端的请求交互
 */

import send from './http'
export default {
  getTokenId (postData) {
    let req = {
      data: postData,
      action: 'app.user.getToken'
    }
    return send.fetch(req, 'post')
  },

  editUser (postData) {
    let req = {
      data: postData,
      action: 'app.user.editUser'
    }
    return send.fetch(req, 'post')
  }
}
