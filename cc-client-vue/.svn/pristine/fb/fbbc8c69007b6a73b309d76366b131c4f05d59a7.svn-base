/**
 * Created by zengyx on 16/12/16.
 */
import i18n from '../assets/i18n/index'
import store from '../store/index.js'
export function copy (obj) {
  obj = obj || {}
  let result = {}
  for (let key in obj) {
    result[key] = obj[key]
  }
  return result
}
export function deepClone (obj) {
  let o
  if (typeof obj === 'object') {
    if (obj === null) {
      o = null
    } else {
      if (obj instanceof Date) {
        o = obj
      } else if (obj instanceof Array) {
        o = []
        for (let i = 0, len = obj.length; i < len; i++) {
          o.push(deepClone(obj[i]))
        }
      } else {
        o = {}
        for (let j in obj) {
          o[j] = deepClone(obj[j])
        }
      }
    }
  } else {
    o = obj
  }
  return o
}

export const Base64 = {
    // private property
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  encode: input => {
    let output = ''
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0
    input = Base64._utf8_encode(input)
    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)
      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      output = output +
        Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
        Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4)
    }
    return output
  },

// public method for decoding
  decode: input => {
    let output = ''
    let chr1, chr2, chr3
    let enc1, enc2, enc3, enc4
    let i = 0
    // todo eslint正则表达式里面不让写特殊字符的转义了
    // input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    input = input.replace(/[^A-Za-z0-9\u002b\u002f\u003d]/g, '')
    while (i < input.length) {
      enc1 = Base64._keyStr.indexOf(input.charAt(i++))
      enc2 = Base64._keyStr.indexOf(input.charAt(i++))
      enc3 = Base64._keyStr.indexOf(input.charAt(i++))
      enc4 = Base64._keyStr.indexOf(input.charAt(i++))
      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4
      output = output + String.fromCharCode(chr1)
      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3)
      }
    }
    output = Base64._utf8_decode(output)
    return output
  },

  _utf8_encode: string => {
    string = string.replace(/\r\n/g, '\n')
    let utftext = ''
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  },

  _utf8_decode: utftext => {
    let string = ''
    let i = 0
    let [c, c2, c3] = [0, 0, 0]
    while (i < utftext.length) {
      c = utftext.charCodeAt(i)
      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }
    return string
  }
}
export function m7Language (info, params) {
  let local = i18n[window.localStorage.lang || 'zh_CN']
  let arr = []
  let language = ''
  if (typeof info === 'string') {
    arr = info.split('.')
    if (arr.length === 1) {
      language = local['message'][arr[0]] ? local['message'][arr[0]] : info
    } else if (arr.length === 2) {
      if (local[arr[0]] && local[arr[0]][arr[1]]) {
        language = local[arr[0]][arr[1]]
      } else {
        language = info
      }
    } else if (arr.length === 3) {
      if (local[arr[0]] && local[arr[0]][arr[1]] && local[arr[0]][arr[1]][arr[2]]) {
        language = local[arr[0]][arr[1]][arr[2]]
      } else {
        language = info
      }
    } else {
      language = info
    }
  } else {
    language = local['message']['unknown_err']
  }
  if (params) {
    for (let key in params) {
      let reg = new RegExp(`{${key}}`, 'g')
      language = language.replace(reg, params[key])
    }
  }

  return language
}
export function getCache (type, id) {
  if (!type) {
    return []
  }
  var cache = []
  if (store.state.session.dicMap[type]) {
    cache = store.state.session.dicMap[type]
    if (id) {
      for (var i = 0; i < cache.length; i++) {
        if (cache[i]._id === id) {
          return copy(cache[i])
        }
      }
      return null
    }
    return cache
  }
}
export function matchingOperator (obj) {
  var sub3 = obj.substr(0, 3)
  var sub4 = obj.substr(0, 4)
  let ydsmsChannel = ['134', '135', '136', '137', '138', '139', '150', '151', '152', '157', '158', '159', '182', '183', '184', '187', '178', '188', '147', '1705']
  let ltsmsChannel = ['130', '131', '132', '145', '155', '156', '176', '185', '186', '1709']
  let dxsmsChannel = ['133', '153', '177', '180', '181', '189', '1349', '1700']

  if (ydsmsChannel.indexOf(sub3) !== -1 || ydsmsChannel.indexOf(sub4) !== -1) {
    return 'yd_smsChannel'
  } else if (dxsmsChannel.indexOf(sub3) !== -1 || dxsmsChannel.indexOf(sub4) !== -1) {
    return 'dx_smsChannel'
  } else if (ltsmsChannel.indexOf(sub3) !== -1 || ltsmsChannel.indexOf(sub4) !== -1) {
    return 'lt_smsChannel'
  } else {
    return 'def_smsChannel'
  }
}
export function getCacheByCodeValue (type, value) {
  type = type || ''
  var cache = store.state.session.dicMap[type] || []
  if (value) {
    for (var i = 0; i < cache.length; i++) {
      if (cache[i].code_value === value) {
        return copy(cache[i])
      }
    }
    return null
  }
  return cache
}

export function getCacheByKey (type, key, value) {
  type = type || ''
  var cache = store.state.session.dicMap[type] || []
  for (var i = 0; i < cache.length; i++) {
    var cacheItem = cache[i]
    if (cacheItem[key] === value) {
      return cacheItem
    }
  }
  return null
}
export function getDicCacheName (type, value) {
  type = type || ''
  value = value || ''
  var dic = store.state.session.dicMap[type] || []
  for (var i = 0; i < dic.length; i++) {
    if (dic[i].code_value === value) {
      return dic[i].code_name
    }
  }
  return value
}
/**
 * (86401, true) -->  1天0小时0分1秒
 * (86401, false) -->  24:00:01
 */
export function getCallTimeLength (second, format) {
  if (second) {
    let d
    let h
    let m
    let s
    if (second === null || second < 0) {
      return
    }
    d = Math.floor(second / (24 * 3600 * 1000))
    h = second / 3600 | 0
    second = parseFloat(second) - h * 3600
    if (parseInt(h) < 10) {
      h = '0' + h
    }
    m = second / 60 | 0
    s = (parseFloat(second) - m * 60).toFixed(0)
    if (parseInt(m) < 10) {
      m = '0' + m
    }
    if (s < 10) {
      s = '0' + s
    }
    if (format) {
      let time
      if (d > 0) {
        time += d + '天'
      }
      if (h > 0) {
        time += h + '小时'
      }
      if (m > 0) {
        time += m + '分钟'
      }
      if (s > 0) {
        time += s + '秒'
      }
      return time
    } else {
      return h + ':' + m + ':' + s
    }
  } else {
    return '00:00:00'
  }
}
export function formatShortTime (date) {
  if (!date) {
    return {time: '', name: ''}
  }
  let _d = date.substring(0, 10)
  let _t = date.substring(11, 16)
  let a = _d.split('-')
  let dd = parseInt(a[0], 10) + '/' + parseInt(a[1], 10) + '/' + parseInt(a[2], 10)
  let today = new Date()
  let now = countDay(0)
  let yesterday = countDay(-1)
  let _yesterday = countDay(-2)
  let result = {}
  result.time = date
  result.name = _d
  if (dd === now) {
    result.name = _t
  } else if (dd === yesterday) {
    result.name = '昨天' + _t
  } else if (dd === _yesterday) {
    result.name = '前天' + _t
  } else if (a[0] < today.getFullYear()) {
    result.name = _d
  } else if (Date.parse(dd) < Date.parse(now)) {
    result.name = a[1] + '-' + a[2]
  }
  return result
}
/**
 * 2017-2-17 16:40:40 -->  2017-2-17
 * 2017-2-17 16:40:40 -->  16:40
 * @param dateTimeStr
 * @returns {string}
 */
export function getDateTimeByStr (dateTimeStr, type) {
  if (!dateTimeStr || !type) {
    return ''
  }
  let result = ''
  let datetime = dateTimeStr.split(' ')
  if (type === 'date') {
    result = datetime[0].substring(0, 11)
  } else if (type === 'time') {
    result = datetime[1].substring(0, 5)
  }
  return result
}

/**
 * 格式化消息时间
 * @param date
 * @param showSencond
 * @returns {*}
 */
export function formatChatShortTime (date, showSencond) {
  if (!date) {
    return ''
  }
  var _d = date.substring(0, 10)
  var _t = ''
  if (showSencond) {
    _t = date.substring(11, 19)
  } else {
    _t = date.substring(11, 16)
  }

  var a = _d.split('-')
  var dd = parseInt(a[0], 10) + '/' + parseInt(a[1], 10) + '/' + parseInt(a[2], 10)
  var today = new Date()
  var now = countDay(0)
  var yesterday = countDay(-1)
  var _yesterday = countDay(-2)
  var result = {}
  result.time = date
  result.name = _d
  if (dd === now) {
    result.name = _t
  } else if (dd === yesterday) {
    result.name = '昨天 ' + _t
  } else if (dd === _yesterday) {
    result.name = '前天 ' + _t
  } else if (a[0] < today.getFullYear()) {
    result.name = a[0] + '年' + a[1] + '月' + a[2] + '日 ' + _t
  } else if (Date.parse(dd) < Date.parse(now)) {
    result.name = a[1] + '月' + a[2] + '日 ' + _t
  }
  return result.name
}

/**
 * 规范时间差
 */
export function formatTimestamp (timelength) {
  var formatTime = ''
  var day = Math.floor(timelength / (24 * 3600 * 1000))
  var restTime = timelength % (24 * 3600 * 1000)
  var hour = 0
  var minutes = 0
  var seconds = 0
  if (restTime > 0) {
    hour = Math.floor(restTime / (3600 * 1000))
    restTime = restTime % (3600 * 1000)
  }

  if (restTime > 0) {
    minutes = Math.floor(restTime / (60 * 1000))
    restTime = restTime % (60 * 1000)
  }

  if (restTime > 0) {
    seconds = Math.floor(restTime / 1000)
  }
  if (day > 0) {
    formatTime += day + '天'
  }
  if (hour > 0) {
    formatTime += hour + '小时'
  }
  if (minutes > 0) {
    formatTime += minutes + '分钟'
  }
  if (seconds > 0) {
    formatTime += seconds + '秒'
  }
  return formatTime
}

export function getFormatTimeBySecond (second = 0) {
  return [parseInt(second / 60 / 60), parseInt(second / 60 % 60), parseInt(second % 60)].join(':')
      .replace(/\b(\d)\b/g, '0$1')
}

export function countDay (mount) {
  let today = new Date()
  today.setDate(today.getDate() + mount)
  return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
}

export function startWith (str, prefix) {
  return str.indexOf(prefix) === 0
}
export function getAllUseSingleCallLabel (singleLabels, search) {
  if (!singleLabels) {
    return []
  }
  let useLabel = []
  let searchLabel = []
  for (let i = 0; i < singleLabels.length; i++) {
    if (!singleLabels[i].type) { // 有些脏数据没有type，默认是单标签
      singleLabels[i].type = 'single'
    }
    if (singleLabels[i].type === 'multi') {
      continue
    }
    if (singleLabels[i].enable && singleLabels[i].type === 'single') {
      useLabel.push(singleLabels[i])
      if (search) { // 判断是搜索
        singleLabels[i].level = 1
        singleLabels[i].name = singleLabels[i].name + '[单标签]'
        searchLabel.push(singleLabels[i])
      }
    }
  }
  let obj = {
    singleLabel: useLabel,
    searchSingleLabel: searchLabel
  }
  return obj
}
export function getAllUseMultiCallLabel (multiLabels, singleArr, search) {
  if (!multiLabels) {
    return ''
  }
  let allLabels = []
  let firstStepLabel = []
  let searchFirstLabel = []
  let SecondStepLabel = []
  let thirdStepLabel = []
  let i = 0
  let j = 0
  let k = 0
  for (i = 0; i < multiLabels.length; i++) {
    if (!multiLabels[i].type) { // 有些脏数据没有type,默认是单标签
      multiLabels[i].type = 'single'
    }
    if (multiLabels.length > 0) {
      if (multiLabels[i].type === 'single') { // 有些脏数据没有type
        continue
      }
      if (multiLabels[i].enable) {
        allLabels.push(multiLabels[i])
        firstStepLabel.push(multiLabels[i])
        if (search) {
          let name = multiLabels[i].name + '[多级标签]'
          multiLabels[i].name = name
        }
        searchFirstLabel.push(multiLabels[i])
      }
      for (j = 0; j < multiLabels[i].child.length; j++) {
        if (multiLabels[i].child[j].enable) {
          SecondStepLabel.push(multiLabels[i].child[j])
          allLabels.push(multiLabels[i].child[j])
        }
        for (k = 0; k < multiLabels[i].child[j].child.length; k++) {
          if (multiLabels[i].child[j].child[k].enable) {
            thirdStepLabel.push(multiLabels[i].child[j].child[k])
            allLabels.push(multiLabels[i].child[j].child[k])
          }
        }
      }
    }
  }
  if (singleArr) { // 搜索的时候把单标签也合到一级标签里面
    searchFirstLabel = searchFirstLabel.concat(singleArr)
  }
  let obj = {
    allLabels: allLabels,
    firstStepLabel: firstStepLabel,
    secondStepLabel: SecondStepLabel,
    thirdStepLabel: thirdStepLabel,
    searchFirstLabel: searchFirstLabel
  }
  return obj
}
export function getSingleOrMultiLabelNameById (allLables, _id) {
  if (!allLables) {
    return ''
  }
  if (_id) {
    _id = _id.replace(',', '')
  }
  for (let i = 0; i < allLables.length; i++) {
    if (allLables[i]._id === _id) {
      return allLables[i].name || ''
    }
  }
  return ''
}
export function getFormatDateTime (date) {
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()
  let hour = date.getHours()
  let minites = date.getMinutes()
  let second = date.getSeconds()
  month = month + 1 > 9 ? month + 1 : '0' + (month + 1)
  day = day > 9 ? day : '0' + day
  hour = hour > 9 ? hour : '0' + hour
  minites = minites > 9 ? minites : '0' + minites
  second = second > 9 ? second : '0' + second
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minites + ':' + second
}
export function getCurrentDate () {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()
  month = month + 1 > 9 ? month + 1 : '0' + (month + 1)
  day = day > 9 ? day : '0' + day
  return year + '-' + month + '-' + day
}
export function getCurrentDateTime () {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  month = month + 1 > 9 ? month + 1 : '0' + (month + 1)
  day = day > 9 ? day : '0' + day
  h = h > 9 ? h : '0' + h
  m = m > 9 ? m : '0' + m
  s = s > 9 ? s : '0' + s
  return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
}
export function getStrLength (str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}
export function _getSearchCondition (isAll, arr, sessionId, advItem) { // 等高级搜索调通后要结合高级搜索的搜索条件
  let query = null
  advItem = removeEmptyProperty(advItem) || {} // 清空没有数据的高级搜索条件
  // advItem = advItem || {}
  // 高级搜索条件
  query = advItem
  if (!isAll) {
    let ids = arr
    let _q = null
    if (ids.length > 0) {
      _q = { _id: {$in: ids} }
    } else {
      _q = {_id: 'NA'}
    }
    query = _q
  }
  return query
}
export function removeEmptyProperty (obj) {
  if (!obj) {
    return
  }
  for (let property in obj) {
    let value = obj[property]
    if (!value) {
      delete obj[property]
    }
    if (Array.isArray(value) && value.length === 0) {
      delete obj[property]
    }
  }
  return obj
}
export function isHasFunc (key, user) {
  if (user.type === 'admin' && user.exten === '0000') {
    let reverse = ['func_hide_tel', 'func_nodelete_customer']
    if (reverse.indexOf(key) !== -1) {
      return false
    } else {
      return true
    }
  }
  let funcIds = user.funcIds
  if (funcIds.indexOf(key) !== -1) {
    return true
  } else {
    return false
  }
}
export function isHasMenu (key, user) {
  let funcIds = user.allFun
  if (user.type === 'admin' && user.exten === '0000') {
    return true
  }
  if (funcIds.indexOf(key) !== -1) {
    return true
  }
  return false
}
export function millsToDate (mills) {
  if (mills < 0) {
    return '00:00:00'
  }
  // 计算出相差天数
  var days = Math.floor(mills / (24 * 3600 * 1000))

  // 计算出小时数
  var leave1 = mills % (24 * 3600 * 1000)    // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)        // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))

  // 计算相差秒数
  var leave3 = leave2 % (60 * 1000)      // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)

  var str = ''
  var _hours = ''
  var _minutes = ''
  var _seconds = ''
  if (days !== 0) {
    _hours = days * 24 + hours
  } else {
    _hours = (hours === 0) ? '00' : (hours >= 10 ? hours : ('0' + hours))
  }
  _minutes = (minutes === 0) ? '00' : (minutes >= 10 ? minutes : ('0' + minutes))
  _seconds = (seconds === 0) ? '00' : (seconds >= 10 ? seconds : ('0' + seconds))
  str = _hours + ':' + _minutes + ':' + _seconds
  return str
}
export function checkHideTel (phone, user) {
  if (!phone) return ''
  if (isHasFunc('func_hide_tel', user)) {
    return _encryptPhone(phone)
  } else {
    return phone
  }
}

export function checkEncryptTel (phone, user) {
  if (!phone) return ''
  if (isHasFunc('func_hide_tel', user)) {
    phone = Base64.decode(phone)
  }
  return phone
}
export function _encryptPhone (phone) {
  if (!phone) return ''
  var len = phone.length
  if (len < 6) return phone
  var tel = ''
  var mobile = /1[3,4,5,7,8][0-9]{9}/
  if (mobile.test(phone)) {
    tel = phone.substring(0, 3) + '****' + phone.substring(7)
  } else {
    var p = len / 2
    tel = phone.substring(0, p - 2) + '****' + phone.substring(p + 2)
  }
  return tel
}
export function getDicByIdFor (key, options) {
  for (let i = 0; i < options.length; i++) {
    var dic = options[i]
    if (dic.key === key) {
      return {'key': key, 'name': dic.name}
    }
    var opts = dic.options || []
    if (opts.length !== 0) {
      let result = getDicByIdFor(key, opts)
      if (result) {
        return result
      }
    }
  }
}
export function getTimeByMs (ctype, ctime) {
  let resultStr
  if (ctype === 'day') {
    resultStr = ctime * 24 * 60 * 60 * 1000
  } else if (ctype === 'hours') {
    resultStr = ctime * 60 * 60 * 1000
  } else if (ctype === 'min') {
    resultStr = ctime * 60 * 1000
  } else if (ctype === 'second') {
    resultStr = ctime * 1000
  }
  return resultStr
}

/**
 * 重置表单
 */
export function resetForm (form) {
  for (let key in form) {
    if (form[key] instanceof Date) {
      form[key] = null
    } else if (typeof form[key] === 'object' && !Array.isArray(form[key])) {
      resetForm(form[key])
    } else if (Array.isArray(form[key])) {
      form[key] = []
    } else {
      form[key] = null
    }
  }
}
export function getDateTime (time, timeForm) {
  if (time === '' || time === undefined) {
    return ''
  }
  var date = time
  var year = date.getFullYear()
  var month = date.getMonth()
  var day = date.getDate()
  var hour = date.getHours()
  var minites = date.getMinutes()
  var second = date.getSeconds()
  month = month + 1 > 9 ? month + 1 : '0' + (month + 1)
  day = day > 9 ? day : '0' + day
  hour = hour > 9 ? hour : '0' + hour
  minites = minites > 9 ? minites : '0' + minites
  second = second > 9 ? second : '0' + second
  if (timeForm === 'date') {
    return year + '-' + month + '-' + day
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minites + ':' + second
}
export function getChannelLocationName (data) {
  if (data === 'time') {
    return 'call.schedule'
  } else if (data === 'announcement') {
    return 'call.playVoice'
  } else if (data.toLowerCase() === 'ringing') {
    return 'call.theBell'
  } else if (data.toLowerCase() === 'hangup') {
    return 'softPhoneBar.hangup'
  } else if (data.toLowerCase() === 'link') {
    return 'call.connected'
  } else if (data.toLowerCase() === 'queue') {
    return 'public.queues'
  } else if (data.toLowerCase() === 'encryptmd5') {
    return 'call.MD5Encryption'
  } else if (data.toLowerCase() === 'voicemail') {
    return 'call.leavingMessage'
  } else if (data.toLowerCase() === 'ivr') {
    return 'call.buttonMenu'
  } else if (data.toLowerCase() === 'assignment') {
    return 'call.assignment'
  } else if (data.toLowerCase() === 'callurl') {
    return 'call.callUrl'
  } else if (data.toLowerCase() === 'match-blacklist') {
    return 'contactHistoryDisposeDisplay.blackList'
  } else if (data.toLowerCase() === 'route') {
    return 'call.variableRouting'
  } else if (data.toLowerCase() === 'satisfaction') {
    return 'call.customSatisfaction'
  } else if (data.toLowerCase() === 'validate') {
    return 'call.acquisitionInput'
  } else if (data.toLowerCase() === 'room') {
    return 'call.conferenceRoom'
  } else if (data.toLowerCase() === 'extensionpeer') {
    return 'call.custom'
  } else if (data.toLowerCase() === 'superdialjobnum') {
    return 'call.collectWorkNumber'
  } else if (data.toLowerCase() === 'menu') {
    return 'cti.TransferIVR'
  } else if (data.toLowerCase() === 'dialjobnum') {
    return 'call.dialNumber'
  } else if (data.toLowerCase() === 'textannouncement') {
    return 'call.playTextNode'
  } else {
    return data
  }
}

export function contains (elems, value) {
  for (let i = 0; i < elems.length; i++) {
    if (elems[i] === value) {
      return true
    }
  }
  return false
}

/**
 * 去掉对象里的空值
 * @param obj
 */
export function trimObjEmptyValue (obj) {
  for (let key in obj) {
    if (!obj[key]) {
      delete obj[key]
    }
  }
}
/**
 * 对html符号进行编码
 * @param str
 * @returns {string|*}
 */
export function escapeHtml (str) {
  str = String(str).replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/'/gm, '&quot;').replace(/'/gm, '&#39;')
  return str
}

/**
 * 解码程html符号
 * @param str
 * @returns {*}
 */
export function unescapeHtml (str) {
  return str.replace(/&amp;/gm, '&').replace(/&lt;/gm, '<').replace(/&gt;/gm, '>').replace(/&quot;/gm, '"').replace(/&#39;/gm, '\'')
}
