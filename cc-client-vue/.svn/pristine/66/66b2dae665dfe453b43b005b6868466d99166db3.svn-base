/**
 * Created by qyg on 2017/1/18.
 */
import {getCache} from './m7Utils.js'

let emojiFaces = [
  ['smile', 'smiley', 'laughing', 'blush'],
  ['heart_eyes', 'smirk', 'flushed', 'kissing_heart'],
  ['grin', 'wink', 'stuck_out_tongue_winking_eye', 'stuck_out_tongue_closed eyes'],
  ['sleeping', 'worried', 'expressionless', 'sweat_smile'],
  ['joy', 'cold_sweat', 'sob', 'angry'],
  ['mask', 'scream', 'sunglasses', 'heart'],
  ['broken_heart', 'star', 'anger', 'exclamation'],
  ['question', 'zzz', 'thumbsup', 'thumbsdown'],
  ['ok_hand', 'punch', 'yeah', 'clap'],
  ['muscle', 'pray', 'skull', 'trollface']
]
let wechatQQFace = ['/::)', '/::~', '/::B', '/::|', '/:8-)', '/::<', '/::$', '/::X', '/::Z', '/::\'(', '/::-|', '/::@', '/::P', '/::D', '/::O', '/::(', '/::+', '/:-b', '/::Q', '/::T', '/:,@P', '/:,@-D', '/::d', '/:,@o', '/::g', '/:|-)', '/::!', '/::L', '/::>', '/::,@', '/:,@f', '/::-S', '/:?', '/:,@x', '/:,@@', '/::8', '/:,@!', '/:!!!', '/:xx', '/:bye', '/:wipe', '/:dig', '/:handclap', '/:&-(', '/:B-)', '/:<@', '/:@>', '/::-O', '/:>-|', '/:P-(', '/::\'|', '/:X-)', '/::*', '/:@x', '/:8*', '/:pd', '/:<W>', '/:beer',
  '/:basketb', '/:oo', '/:coffee', '/:eat', '/:pig', '/:rose', '/:fade', '/:showlove', '/:heart', '/:break', '/:cake', '/:li', '/:bome', '/:kn', '/:footb', '/:ladybug', '/:shit', '/:moon', '/:sun', '/:gift', '/:hug', '/:strong', '/:weak', '/:share', '/:v', '/:@)', '/:jj', '/:@@', '/:bad', '/:lvu', '/:no', '/:ok']

export function renderEmoji (message, isEsc) {
  let x = 25
  let y = 25
  if (!message) return ''
  if (!isEsc) {
    message = escapeChatHtml(message)
  }
  let ary = emojiFaces || []
  for (let i = 0; i < ary.length; i++) {
    for (let j = 0; j < ary[i].length; j++) {
      let item = ary[i][j]
      if (message.indexOf(item) !== -1) {
        let span = '<span class="emoji-face" style="background-position: ' + (-(x * j)) + 'px ' + (-(y * i)) + 'px;"></span>'
        let pattern = new RegExp(':' + item + ':', 'gm')
        message = message.replace(pattern, span)
      }
    }
  }
  message = renderWechatQQFace(message, isEsc)
  return message
}

export function escapeChatHtml (str) {
  str = String(str).replace(/</gm, '&lt;').replace(/>/gm, '&gt;')
  return str
}

export function renderWechatQQFace (message, isEsc) {
  let ary = wechatQQFace || []
  for (let i = 0; i < ary.length; i++) {
    let item = ary[i]
    if (!isEsc) {
      item = escapeChatHtml(item)
    }

    if (message.indexOf(item) !== -1) {
      let tempItem = item
      if (tempItem.match(/[\^$.*+\-?|()]/g)) {
        tempItem = tempItem.replace(/\$/gm, '\\$')
        tempItem = tempItem.replace(/\./gm, '\\.')
        tempItem = tempItem.replace(/\*/gm, '\\*')
        tempItem = tempItem.replace(/\+/gm, '\\+')
        tempItem = tempItem.replace(/-/gm, '\\-')
        tempItem = tempItem.replace(/\?/gm, '\\?')
        tempItem = tempItem.replace(/\|/gm, '\\|')
        tempItem = tempItem.replace(/\(/gm, '\\(')
        tempItem = tempItem.replace(/\)/gm, '\\)')
      }

      let span = '<span class="qq-face" style="background-position: 0px ' + (-(24 * i)) + 'px;"></span>'
      try {
        let pattern = new RegExp(tempItem, 'gm')
        message = message.replace(pattern, span)
      } catch (e) {
        console.log(e)
        return message
      }
    }
  }
  return message
}
export function getChannelDic (type) {
  getCache('channelDic').then((dics) => {
    let _dics = []
    for (let i = 0; i < dics.length; i++) {
      let obj = dics[i]
      if (obj.type === type) {
        _dics = obj.options || []
        break
      }
    }
    return _dics
  })
}

export function getQualityCheckConfigs (configs) {
  let flog = false
  for (let ind in configs) {
    configs[ind].order = configs[ind].order.toString()
    if (configs[ind].weight) {
      flog = true
    }
  }
  if (flog) {
    configs = configs.sort(function (a, b) {
      if (parseInt(b.weight) !== parseInt(a.weight)) {
        return parseInt(b.weight) - parseInt(a.weight)
      } else {
        return parseInt(b.order) - parseInt(a.order)
      }
    })
  }
  return configs
}

export function msgConvertion (data) {
  let dataNew = data
  let array0 = dataNew.match(/src=|href=/) || []
  let obstr = dataNew
  if (!(array0[0])) {
    let re = /(www\.|(http|https|ftp):\/\/)+[A-Za-z0-9]+[A-Za-z0-9]+[/=?%\-&_~`@[\]':+!]*([^<>""])(\S[^,，。;； ！!：:]*)/gi
    let re1 = /^(http:\/\/|https:\/\/)?/
    let arry1
    let arry2 = []
    while ((arry1 = re.exec(dataNew)) !== null) {
      arry2.push(arry1[0])
      obstr = obstr.replace(arry1[0], '######')
    }
    let subos = ''
    if (arry2.length) {
      for (let i = 0; i < arry2.length; i++) {
        let arry3 = re1.exec(arry2[i])
        if (arry3[0]) {
          subos = '<a href="' + arry2[i] + '" target="_blank">' + arry2[i] + '</a>'
        } else {
          subos = '<a href="http://' + arry2[i] + '" target="_blank">' + arry2[i] + '</a>'
        }
        obstr = obstr.replace('######', subos)
      }
    }
  }
  return obstr
}

export function userStayTimeConverse (timelength) {
  let formatTime = ''
  let minutes = Math.floor(timelength / (60 * 1000))
  let restTime = timelength % (60 * 1000)
  let seconds = 0
  formatTime += minutes + '’'
  if (restTime > 0) {
    seconds = Math.ceil(restTime / 1000)
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    formatTime += seconds + '”'
  }
  return formatTime
}
