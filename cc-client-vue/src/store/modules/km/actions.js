import * as types from './mutation-types'
import km from '../../api/km'
import * as gtypes from '../../mutation-types'
// import {getCache} from '../../actions'
// 目录树查询
export const queryCatalogList = ({commit}, data) => {
  return km.queryCatalogList(data).then(
    rep => {
      if (rep.success) {
        commit(types.QUERY_CATALOG_LIST, rep.tree)
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 最近更新查询
export const queryRecentList = ({commit}, data) => {
  return km.queryRecentList(data).then(
      rep => {
        if (rep.success) {
          commit(types.QUERY_RECENT_LIST, rep.list)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
// 知识点查询
export const queryItemList = ({commit}, data) => {
  return km.queryItemList(data).then(
      rep => {
        if (rep.success) {
          commit(types.QUERY_ITEM_LIST, rep)
        }
      }
    ).catch(() => {
      commit(gtypes.SET_ERROR, 'message.default_tips')
    })
}
// 添加目录
export const addCatalog = ({commit}, data) => {
  return km.addCatalog(data).then(
    rep => {
      if (rep.success) {
        commit(types.ADD_CATALOG, rep)
      }
      return rep
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 删除目录
export const delCatalog = ({commit}, data) => {
  return km.delCatalog(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        commit(types.DEL_CATALOG, rep.success)
        commit(gtypes.SET_SUCCESS, 'message.deleteSuccess')
      } else if (rep.code === '1001') {
        commit(gtypes.SET_ERROR, 'message.kmDelError')
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 更新目录
export const updateCatalog = ({commit}, data) => {
  return km.updateCatalog(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        commit(types.UPDATE_CATALOG, rep)
      }
      return rep
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 打开知识点编辑页面
export const showItemEdit = ({commit}, data) => {
  return km.showItemEdit(data).then(
    rep => {
      if (rep.success) {
        commit(types.SHOW_ITEM_EDIT, rep)
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 添加知识点
export const saveItem = ({commit}, data) => {
  return km.saveItem(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        commit(types.SAVE_ITEM, rep)
      }
      return rep
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 编辑知识点
export const updateItem = ({commit}, data) => {
  return km.updateItem(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        commit(types.UPDATE_ITEM, rep)
        commit(gtypes.SET_SUCCESS, 'userInfo.editSuccess')
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 知识点删除
export const delItem = ({commit}, data) => {
  return km.delItem(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        commit(types.DEL_ITEM, rep)
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 删除知识点中附件
export const delAttach = ({commit}, data) => {
  return km.delAttach(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        commit(types.DEL_ATTACH, rep)
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 查询知识库字典
export const queryKmDic = ({commit}, data) => {
  return km.queryKmDic(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        commit(types.QUERY_KMDIC, rep)
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 查询知识库
export const queryWholeKmDic = ({commit}, data) => {
  return km.queryWholeKmDic(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        commit(types.QUERY_WHOLE_KMDIC, rep)
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 查询知识库热词
export const queryKmHotWords = ({commit}, data) => {
  return km.queryKmHotWords(data).then(
    rep => {
      console.log(rep)
      if (rep.success) {
        rep.list.forEach((item) => {
          item.value = item.key
        })
        commit(types.QUERY_KM_HOTWORDS, rep)
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
// 解析上传文件
export const uploadDoc = ({commit}, data) => {
  return km.uploadDoc(data).then(
    rep => {
      if (rep.success) {
        commit(types.UPLOAD_DOC, rep)
      } else if (rep.Message) {
        commit(gtypes.SET_ERROR, rep.Message)
      } else {
        commit(gtypes.SET_ERROR, 'message.transformFail')
      }
    }
  ).catch(() => {
    commit(gtypes.SET_ERROR, 'message.default_tips')
  })
}
