/**
 * Created by wangxh on 16/12/26.
 */
import send from './http'
export default {
  _cti_sendAction (jsonData, state) {
    let req = {
      url: state.globalLet._cti_url,
      jsonData
    }
    return send.fetchByJsonp(req, 'get')
  },
  markCallSheetThroughCall (data, state) {
    let req = {
      data: data,
      action: 'app.callSheet.markCallSheetThroughCall',
      action_id: Math.random(),
      sessionId: state.globalLet.phone_data.userId
    }
    return send.fetch(req, 'post')
  },
  getConcurrent (data, state) {
    let req = {
      data: data,
      action: 'app.batch.getConcurrent',
      action_id: Math.random(),
      sessionId: state.globalLet.phone_data.userId
    }
    return send.fetch(req, 'post')
  },
  popupCust (data, state) {
    let req = {
      data: data,
      action: 'app.popup.popupCust',
      action_id: Math.random(),
      sessionId: state.globalLet.phone_data.userId
    }
    return send.fetch(req, 'post')
  }
}
