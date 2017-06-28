/**
 * Created by hotchwong on 17/1/11.
 */

import send from './http'
export default {
  getKmUptoken (data) {
    let req = {
      data,
      action: 'app.km.getKmUptoken'
    }
    return send.fetch(req, 'post')
  },
  queryCatalogList (data) {
    let req = {
      data,
      action: 'app.km.queryCatalogList'
    }
    return send.fetch(req, 'post')
  },
  addCatalog (data) {
    let req = {
      data,
      action: 'app.km.addCatalog'
    }
    return send.fetch(req, 'post')
  },
  updateCatalog (data) {
    let req = {
      data,
      action: 'app.km.updateCatalog'
    }
    return send.fetch(req, 'post')
  },
  delCatalog (data) {
    let req = {
      data,
      action: 'app.km.delCatalog'
    }
    return send.fetch(req, 'post')
  },
  showCatalogEdit (data) {
    let req = {
      data,
      action: 'app.km.showCatalogEdit'
    }
    return send.fetch(req, 'post')
  },
  queryRecentList (data) {
    let req = {
      data,
      action: 'app.km.queryRecentList'
    }
    return send.fetch(req, 'post')
  },
  queryItemList (data) {
    let req = {
      data,
      action: 'app.km.queryItemList'
    }
    return send.fetch(req, 'post')
  },
  uploadDoc (data) {
    let req = {
      data,
      action: 'app.km.uploadDoc'
    }
    return send.fetch(req, 'post')
  },
  saveItem (data) {
    let req = {
      data,
      action: 'app.km.saveItem'
    }
    return send.fetch(req, 'post')
  },
  showItemEdit (data) {
    let req = {
      data,
      action: 'app.km.showItemEdit'
    }
    return send.fetch(req, 'post')
  },
  updateItem (data) {
    let req = {
      data,
      action: 'app.km.updateItem'
    }
    return send.fetch(req, 'post')
  },
  delItem (data) {
    let req = {
      data,
      action: 'app.km.delItem'
    }
    return send.fetch(req, 'post')
  },
  delAttach (data) {
    let req = {
      data,
      action: 'app.km.delAttach'
    }
    return send.fetch(req, 'post')
  },
  queryKmDic (data) {
    let req = {
      data,
      action: 'app.km.queryKmDic'
    }
    return send.fetch(req, 'post')
  },
  queryWholeKmDic (data) {
    let req = {
      data,
      action: 'app.km.queryWholeKmDic'
    }
    return send.fetch(req, 'post')
  },
  queryKmHotWords (data) {
    let req = {
      data,
      action: 'app.km.queryKmHotWords'
    }
    return send.fetch(req, 'post')
  }
}
