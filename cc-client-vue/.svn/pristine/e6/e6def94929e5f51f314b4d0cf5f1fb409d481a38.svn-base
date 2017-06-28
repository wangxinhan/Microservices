/**
 * Created by jiaji on 2017/1/4.
 */
import send from './http'
export default {
  getPushOnlineAgentAndDealingCount (data) {
    let req = {
      data: data,
      action: 'app.monitor.getPushOnlineAgentAndDealingCount'
    }
    return send.fetch(req, 'post')
  },
  queryMonitorInitData (data) {
    let req = {
      data: data,
      action: 'monitor.queryMonitorInitData'
    }
    return send.fetchByReport(req, 'post')
  }
}
