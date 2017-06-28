/**
 * customer utils
 */
import store from '../store'
import { getCache, deepClone, m7Language, isHasFunc } from './m7Utils.js'
import { qiniu7moorDomain } from './qiniuUtils.js'

const areaKey = 'd7b9c68a-b50f-21d1-d5fd-41ea93f5f49c'

// 获取必要的缓存数据
store.dispatch('getCache', { type: 'custTmpls' })
store.dispatch('getCache', { type: 'agents' })
store.dispatch('getCache', { type: 'options' })
store.dispatch('getCache', { type: 'sys_status' })
/**
 * 获取来源名称
 */
function _getSourceDesc (val) {
  const custTmpl = getCache('custTmpls')[0]
  let sources = custTmpl.sources || []
  for (let i = 0; i < sources.length; i++) {
    let obj = sources[i]
    if (obj.key === val) {
      return obj.name
    }
  }
  return ''
}

/**
 * 获取所属人名称
 */
function _getOwnerName (uid) {
  if (uid) {
    let user = getCache('agents', uid)
    if (user) {
      return user.displayName
    }
  }
  return '已删除座席'
}

/**
 * 获取图片后缀
 */
function _getImgSuffix (name) {
  if (!name) {
    return ''
  }
  return name.substring(name.lastIndexOf('.'))
}

/**
 * 获取自定义客户字段名称
 */
function _getCustomFieldDicName (type, key, value) {
  const custTmpl = getCache('custTmpls')[0]
  let customFields = custTmpl.custom_fields
  let desc = []

  for (let i = 0; i < customFields.length; i++) {
    let obj = customFields[i]
    if (obj._id === key) {
      let choices = obj.choices
      for (let k in choices) {
        if (type === 'checkbox') {
          for (let j = 0; j < value.length; j++) {
            if (k === value[j]) {
              desc.push(choices[k])
              break
            }
          }
        } else {
          if (k === value) {
            desc.push(choices[k])
            break
          }
        }
      }
      break
    }
  }

  return desc.join(',')
}

/**
 * 性别
 */
function _getSexName (val) {
  if (val === '0') {
    return '男'
  } else if (val === '1') {
    return '女'
  }
  return ''
}

/**
 * 省份
 */
function _getProvinceName (key) {
  const areaCache = getCache('options', areaKey)
  for (let i = 0; i < areaCache.options.length; i++) {
    if (areaCache.options[i].key === key) {
      return areaCache.options[i].name
    }
  }
  return ''
}

/**
 * 市
 */
function _getCityName (key, parentKey) {
  const areaCache = getCache('options', areaKey)
  let province
  for (let i = 0; i < areaCache.options.length; i++) {
    if (areaCache.options[i].key === parentKey) {
      province = areaCache.options[i]
      break
    }
  }
  if (province) {
    for (let j = 0; j < province.options.length; j++) {
      if (province.options[j].key === key) {
        return province.options[j].name
      }
    }
  }

  return ''
}

function _replaceUrl (str) {
  try {
    let reg = /(http[s]{0,1}):\/\/([\w-]+\.)+[\w-]+([\u4e00-\u9fa5\w-./?%&=]*)?/ig
    let result = null
    let urls = []
    let nstr = str
    while ((result = reg.exec(str)) !== null) {
      urls.push(result[0])
    }
    for (let i = 0; i < urls.length; i++) {
      let html = `<a href="${urls[i]}" target="_blank">${urls[i]}</a>`
      nstr = nstr.replace(urls[i], html)
    }
    return nstr
  } catch (e) {
    return str
  }
}

function _getCustomerSysStatus (val) {
  let arr = getCache('sys_status')
  for (let i = 0; i < arr.length; i++) {
    let obj = arr[i]
    if (obj.code_value === val) {
      return obj.code_name
    }
  }
  return ''
}

function countDay (mount) {
  let today = new Date()
  today.setDate(today.getDate() + mount)
  return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
}
/**
 * 处理客户字段名称
 */
export function showFieldDesc (type, val, ...args) {
  if (type === 'source') {
    return _getSourceDesc(val)
  } else if (type === 'owner') {
    return _getOwnerName(val)
  } else if (type === 'imgUrl') {
    return `${qiniu7moorDomain}${val}?imageView2/1/w/50`
  } else if (type === 'img') {
    return _getImgSuffix(val)
  } else if (type === 'weixin') {
    // return _showWeixinInfo(val, args[0])
  } else if (type === 'field') {
    return _getCustomFieldDicName(val, args[0], args[1])
  } else if (type === 'sex') {
    return _getSexName(val)
  } else if (type === 'province') {
    return _getProvinceName(val)
  } else if (type === 'city') {
    return _getCityName(val, args[0])
  } else if (type === 'html') {
    return _replaceUrl(val)
  } else if (type === 'taskId') {
    // return getTaskName(val)
  } else if (type === 'taskCalled') {
    // return getDialStatus(val)
  } else if (type === 'sysStatus') {
    return _getCustomerSysStatus(val)
  } else if (type === 'custCategory') {

  }

  return ''
}

/**
 * 根据数据权限获取座席
 */
export function filterUserByScope () {
  let agents = getCache('agents')
  let scope = store.state.session.user.moduleUsers.customer
  let _agents = []
  let lowAgents = scope || []

  if (scope === 'all') {
    _agents = deepClone(agents)
  } else {
    for (let i = 0; i < agents.length; i++) {
      if (lowAgents.indexOf(agents[i]._id) !== -1) {
        _agents.push(deepClone(agents[i]))
      }
    }
  }

  return _agents
}

/**
 * 获取公海
 */
export function filterCategoryByManager () {
  let custCategorys = getCache('custCategorys')
  let userId = store.state.session.user._id
  let _custCategorys = []
  for (let i = 0; i < custCategorys.length; i++) {
    let custCategory = deepClone(custCategorys[i])
    let managers = custCategory.managers
    let category = custCategory.category
    if (category === '0' || category === '3' || category === '4') {
      if (category === '0' || category === '3') {
        category = custCategory.category = '2'
      }
      if (category === '4') {
        category = custCategory.category = '3'
      }
      if (managers.indexOf(userId) !== -1) {
        let desc = ''
        if (category === '2') {
          desc = m7Language('customer.manualCategory')
        } else if (category === '3') {
          desc = m7Language('customer.autoCategory')
        }
        custCategory.displayName = desc ? `${custCategory.cName}[${desc}]` : custCategory.cName
        _custCategorys.push(custCategory)
      }
    }
  }
  return _custCategorys
}

export function filterCategoryByScope () {
  let custCategorys = getCache('custCategorys')
  let userId = store.state.session.user._id
  let _custCategorys = []
  for (let i = 0; i < custCategorys.length; i++) {
    let custCategory = deepClone(custCategorys[i])
    let managers = custCategory.managers
    let members = custCategory.members
    let category = custCategory.category
    if (category === '0' || category === '3' || category === '4') {
      if (category === '0' || category === '3') {
        category = custCategory.category = '2'
      }
      if (category === '4') {
        category = custCategory.category = '3'
      }
      if (managers.indexOf(userId) !== -1 || members.indexOf(userId) !== -1) {
        let desc = ''
        if (category === '2') {
          desc = m7Language('customer.manualCategory')
        } else if (category === '3') {
          desc = m7Language('customer.autoCategory')
        }
        custCategory.displayName = desc ? `${custCategory.cName}[${desc}]` : custCategory.cName
        _custCategorys.push(custCategory)
      }
    }
  }
  return _custCategorys
}

export function filterAllCategory () {
  let custCategorys = getCache('custCategorys')
  let _custCategorys = []
  for (let i = 0; i < custCategorys.length; i++) {
    let custCategory = deepClone(custCategorys[i])
    let category = custCategory.category
    if (category === '0' || category === '3' || category === '4') {
      if (category === '0' || category === '3') {
        category = custCategory.category = '2'
      }
      if (category === '4') {
        category = custCategory.category = '3'
      }
      let desc = ''
      if (category === '2') {
        desc = m7Language('customer.manualCategory')
      } else if (category === '3') {
        desc = m7Language('customer.autoCategory')
      }
      custCategory.displayName = desc ? `${custCategory.cName}[${desc}]` : custCategory.cName
      _custCategorys.push(custCategory)
    }
  }
  return _custCategorys
}

/**
 * 自定义字段排序
 */
export function sortCustomFields (customFields) {
  let customFieldsCopy = deepClone(customFields)
  return customFieldsCopy.sort((f1, f2) => {
    let f1Value = 0
    let f2Value = 0
    if (f1.type === 'multi') {
      f1Value = 1
    }
    if (f1.type === 'checkbox' || f1.type === 'radio') {
      f1Value = 2
    }
    if (f2.type === 'multi') {
      f2Value = 1
    }
    if (f2.type === 'checkbox' || f2.type === 'radio') {
      f2Value = 2
    }
    return f1Value > f2Value
  })
}

/**
 * 是否允许修改状态
 */
export function isNotAllowEditStatus (user) {
  return isHasFunc('func_not_update_customer_status', user)
}

/**
 * 是否允许修改来源
 */
export function isNotAllowEditSource (user) {
  return isHasFunc('func_not_update_customer_increase', user)
}

/**
 * 是否允许修改归属
 */
export function isNotAllowEditOwner (user) {
  return isHasFunc('func_not_allow_user_edit_owner', user)
}

/**
 * 是否默认为无归属
 */
export function isDefaultNoOwner (user) {
  return isHasFunc('func_cust_owner_empty', user)
}

/**
 * 是否允许删除客户
 */
export function isAllowDeleteCustomer (user) {
  return isHasFunc('func_customer_delete', user)
}

/**
 * 是否允许导出客户
 */
export function isAllowExportCustomer (user) {
  return isHasFunc('func_customer_export', user)
}

/**
 * 是否允许分配客户
 */
export function isAllowAssignCustomer (user) {
  return isHasFunc('func_customer_assign', user)
}

/**
 * 是否允许转移客户
 */
export function isAllowConvertCustomer (user) {
  return isHasFunc('func_customer_convert', user)
}

/**
 * 是否允许导出通话记录
 */
export function isAllowExportCustomerCdr (user) {
  return isHasFunc('func_customer_export_cdr', user)
}

/**
 * 是否允许提交批量下载录音任务
 */
export function isAllowExportBatchMonitor (user) {
  return isHasFunc('func_customer_export_batch_monitor', user)
}

/**
 * 是否允许合并客户
 */
export function isAllowMergeCustomer (user) {
  return isHasFunc('func_customer_merge', user)
}

/**
 * 是否允许弹屏可修改无归属的客户
 */
export function isAllowPopupEditNoOwnerCustomer (user) {
  return isHasFunc('func_popup_commonCust_owner', user)
}

/**
 * 是否隐藏号码
 */
export function isHideTel (user) {
  return isHasFunc('func_hide_tel', user)
}

/**
 *
 * 处理联系计划时间
 */
export function getNotifyDate (date) {
  let a = date.substring(0, 10).split('-')
  let dd = parseInt(a[0]) + '/' + parseInt(a[1]) + '/' + parseInt(a[2])
  let today = new Date()
  let now = countDay(0)
  let yesterday = countDay(-1)
  let tomorrow = countDay(1)
  let _tomorrow = countDay(2)
  let result = {}
  result.time = date.substring(11, 16)
  result.isToday = false
  result.displayName = date
  if (dd === now) {
    result.name = '今天'
    result.type = 'today-action'
    result.isToday = true
  } else if (dd === yesterday) {
    result.name = '昨天'
    result.type = 'overdue'
  } else if (dd === tomorrow) {
    result.name = '明天'
    result.type = 'usable'
  } else if (dd === _tomorrow) {
    result.name = '后天'
    result.type = 'usable'
  } else if (a[0] > today.getFullYear()) {
    result.name = '年后'
    result.type = 'usable'
  } else if (a[0] < today.getFullYear()) {
    result.name = '年前'
    result.type = 'overdue'
  } else if (Date.parse(dd) > Date.parse(now)) {
    result.name = a[1] + '-' + a[2]
    result.type = 'usable'
  } else if (Date.parse(dd) < Date.parse(now)) {
    result.name = a[1] + '-' + a[2]
    result.type = 'overdue'
  }

  result.displayName = result.name + ' ' + result.time
  if (result.isToday) {
    result.displayName = result.time
  }

  return result
}
