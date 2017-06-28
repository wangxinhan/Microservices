/**
 * Created by zengyx on 16/12/17.
 */
import send from './http'
export default {
  queryCallList (data) {
    let req = {
      data: data,
      action: 'app.callSheet.queryCallSheet'
    }
    return send.fetch(req, 'post')
  },
  locationCustomer (data) {
    let req = {
      data: data,
      action: 'app.callSheet.locationCustomer'
    }
    return send.fetch(req, 'post')
  },
  callScreenLocationCustomer (data) {
    let req = {
      data: data,
      action: 'app.customer.callLocationCustomer'
    }
    return send.fetch(req, 'post')
  },
  relocationCustomer (data) {
    let req = {
      data: data,
      action: 'app.callSheet.relocationCustomer'
    }
    return send.fetch(req, 'post')
  },
  queryIvrContrail (id) {
    let req = {
      data: id,
      action: 'app.callSheet.getCdrDetail'
    }
    return send.fetch(req, 'post')
  },
  addExportMonitorTask (data) {
    let req = {
      data: data,
      action: 'app.callSheet.addExportMonitorTask'
    }
    return send.fetch(req, 'post')
  },
  exportCdrExcel (data) {
    let req = {
      data: data,
      action: 'app.excel.exportXls'
    }
    return send.fetch(req, 'post')
  },
  saveCdrMemo (data) {
    let req = {
      data: data,
      action: 'app.callSheet.saveCdrMemo'
    }
    return send.fetch(req, 'post')
  },
  getCdrInfo (data) {
    let req = {
      data: data,
      action: 'app.callSheet.getCdrInfo'
    }
    return send.fetch(req, 'post')
  },
  queryCallLabelType () {
    let req = {
      data: {},
      action: 'config.callLabel.getCallLabelType'
    }
    return send.fetch(req, 'post')
  },
  querySingleCallLabel () {
    let req = {
      data: {},
      action: 'config.callLabel.queryCallLabel'
    }
    return send.fetch(req, 'post')
  },
  queryMultiCallLabel () {
    let req = {
      data: {},
      action: 'config.callLabel.queryMultiCallLabels'
    }
    return send.fetch(req, 'post')
  },
  markCallSheet (data) {
    let req = {
      data: data,
      action: 'app.callSheet.markCallSheet'
    }
    return send.fetch(req, 'post')
  },
  getCallLabelOPHistory (data) {
    let req = {
      data: data,
      action: 'app.callSheet.getCallLabelOPHistory'
    }
    return send.fetch(req, 'post')
  },
  saveBlackList (data) {
    let req = {
      data: data,
      action: 'config.ivr.blacklist.saveBlackList'
    }
    return send.fetch(req, 'post')
      .then(
        resp => {
          if (resp.success && resp.data && resp.data.Account && resp.data.PBX) {
            let Account = resp.data.Account
            let PBX = resp.data.PBX
            let req1 = {
              data: {Account, PBX},
              action: 'config.ivr.reloadIvr'
            }
            return send.fetch(req1, 'post')
          }
        }
      )
  },
  removeKeyTag (data) {
    let req = {
      data: data,
      action: 'app.callSheet.removeKeyTag'
    }
    return send.fetch(req, 'post')
  },
  findOneAppDic (data) {
    let req = {
      data: data,
      action: 'config.dic.findOneAppDic'
    }
    return send.fetch(req, 'post')
  }
}
