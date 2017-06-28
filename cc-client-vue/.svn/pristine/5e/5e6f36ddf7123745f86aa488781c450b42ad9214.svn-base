/**
 * Created by lenovo on 2017/1/8.
 */
import store from '../store'
import {getCache, copy, getDicByIdFor, getTimeByMs} from './m7Utils.js'
import {qiniu7moorDomain} from './qiniuUtils'
export function hasAccessForFlow (flow) {
  let result = false
  if (flow.status === 'disable') {
    return result
  }
  let stepItem = getStartStep(flow)
  if (!stepItem) {
    return result
  }
  let roles = getStepRoles(stepItem._id)
  for (let j = 0; j < roles.length; j++) {
    let rolesItem = roles[j]
    if (arrayContainsStr(store.state.session.user.role, rolesItem)) {
      result = true
    }
  }
  return result
}
export function getStartStep (flow) {
  let steps = (flow && flow.steps) ? flow.steps : []
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].isBegin) {
      return steps[i]
    }
  }
  return ''
}
export function getFlowStepById (flow, id) {
  let steps = (flow && flow.steps) ? flow.steps : []
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]._id === id) {
      return steps[i]
    }
  }
  return ''
}
export function getStepRoles (stepId) {
  let step = getCache('businessFlowStep', stepId)
  let actions = (step && step.actions) ? step.actions : []
  let roles = []
  for (let i = 0; i < actions.length; i++) {
    let actionsItem = actions[i]
    roles.push(actionsItem.actionRole)
  }
  return roles
}
export function arrayContainsStr (array, str) {
  array = array || []
  for (let i = 0; i < array.length; i++) {
    if (array[i] === str) {
      return true
    }
  }
  return false
}
export function getObjectById (datas, id) {
  datas = datas || []
  for (let i = 0; i < datas.length; i++) {
    let datasItem = datas[i]
    if (datasItem._id === id) {
      return copy(datasItem)
    }
  }
  return null
}
export function getFlowAction (flowId, actionId) {
  let flow = getCache('businessFlowStep', flowId)
  let actions = flow.actions || []
  for (let i = 0; i < actions.length; i++) {
    let actionsItem = actions[i]
    if (actionsItem._id === actionId) {
      return actionsItem
    }
  }
}
export function getRoleActions (stepItem) {
  let _actions = []
  if (!stepItem) {
    return []
  }
  let actions = stepItem.actions || []
  for (let i = 0; i < actions.length; i++) {
    let actionsItem = actions[i]
    if (arrayContainsStr(store.state.session.user.role, actionsItem.actionRole)) {
      _actions.push(actionsItem)
    }
  }
  return _actions
}
export function getRoleAgents (roles) {
  let agents = getCache('agents')
  let ids = []
  let result = []
  for (let k = 0; k < roles.length; k++) {
    let roleId = roles[k]
    for (let i = 0; i < agents.length; i++) {
      let agentsItem = agents[i]
      if (arrayContainsStr(agentsItem.role, roleId)) {
        if (!arrayContainsStr(ids, agentsItem._id)) {
          result.push(agentsItem)
          ids.push(agentsItem._id)
        }
      }
    }
    // 如果是角色是工单创建人
    if (roleId === 'busCreateUser') {
      let createUserObj = {}
      createUserObj._id = 'busCreateUser'
      createUserObj.displayName = '工单创建人'
      result.push(createUserObj)
      ids.push(createUserObj._id)
    }
  }
  return sortAgents(result)
}
function sortAgents (agents) {
  agents = agents || []
  agents.sort(function (a, b) {
    if (a.pinyin && b.pinyin) {
      if (a.pinyin > b.pinyin) {
        return 1
      } else if (a.pinyin === b.pinyin) {
        return 0
      } else {
        return -1
      }
    } else {
      if (a.displayName > b.displayName) {
        return 1
      } else if (a.displayName === b.displayName) {
        return 0
      } else {
        return -1
      }
    }
  })
  return agents
}
function initCascateSelectData (business, field, form) {
  let labels = []
  let dic = getCache('options', field.dic)
  let options = dic.options
  let selectOption = function (options, val) {
    options = options || []
    for (let opIndex = 0; opIndex < options.length; opIndex++) {
      if (options[opIndex].key === val) {
        return options[opIndex]
      }
    }
    return []
  }
  let defaultSelectValue = null
  for (let cascateIndex = 0; cascateIndex < dic.cascade; cascateIndex++) {
    field.name = dic.headers[cascateIndex]
    let selectName = field._id
    if (cascateIndex !== 0) {
      selectName += '_' + cascateIndex
    }
    let label = {label: field.name, name: selectName, inputType: 'select', data: [{value: '', label: '--请选择--'}], cascadeIndex: cascateIndex}
    form[selectName] = null
    labels.push(label)
    if (cascateIndex === 0) {
      let hasDic = false
      if (!business[field._id]) {
        hasDic = true
      }
      for (let i = 0; i < options.length; i++) {
        let optionsItem = options[i]
        label.data.push({value: optionsItem.key, label: optionsItem.name})
        if ((business[field._id] && optionsItem.key === business[field._id])) {
          hasDic = true
        }
      }
        // 设置默认值的,高级搜索不需要
      if (hasDic) {
        form[selectName] = business[field._id] || field['default']
        label.selectValue = business[field._id] || field['default']
        defaultSelectValue = business[field._id] || field['default']
      } else {
        form[selectName] = business[field._id + '_default']
        label.selectValue = business[field._id + '_default']
        defaultSelectValue = business[field._id + '_default']
        label.data.push({value: business[field._id + '_default'], label: business[field._id + '_default']})
      }
    } else {
      let lastVal = defaultSelectValue
      if (lastVal) {
        let hasDic = false
        if (!business[field._id + '_' + cascateIndex]) {
          hasDic = true
        }
        options = selectOption(options, lastVal).options || []
        for (let i = 0; i < options.length; i++) {
          let optionsItem = options[i]
          label.data.push({value: optionsItem.key, label: optionsItem.name})
          if (business[field._id + '_' + cascateIndex] && optionsItem.key === business[field._id + '_' + cascateIndex]) {
            hasDic = true
          }
        }
        if (hasDic) {
          form[selectName] = business[field._id + '_' + cascateIndex]
          label.selectValue = business[field._id + '_' + cascateIndex]
        } else {
          form[selectName] = business[field._id + '_' + cascateIndex + '_default']
          label.selectValue = business[field._id + '_' + cascateIndex + '_default']
          label.data.push({value: business[field._id + '_' + cascateIndex + '_default'], label: business[field._id + '_' + cascateIndex + '_default']})
        }
      }
    }
  }
  return labels
}
function initCheckBoxData (business, field) {
  let data = []
  let dic = getCache('options', field.dic)
  let options = dic.options
  for (let i = 0; i < options.length; i++) {
    let optionsItem = options[i]
    if (arrayContainsStr(business[field._id], optionsItem.key)) {
      data.push({label: optionsItem.name, value: optionsItem.key, checked: 'checked'})
    } else {
      data.push({label: optionsItem.name, value: optionsItem.key})
    }
  }
  return data
}
function initRadioData (field) {
  let data = []
  let dic = getCache('options', field.dic)
  let options = dic.options
  for (let i = 0; i < options.length; i++) {
    let optionsItem = options[i]
    if (field['default'] === optionsItem.key) {
      data.push({label: optionsItem.name, value: optionsItem.key, checked: 'checked'})
    } else {
      data.push({label: optionsItem.name, value: optionsItem.key})
    }
  }
  return data
}
export function createFlowCustomFields (customFields, flowFields, isAdvSearch) {
  let advFields = []
  let customForm = {}
  customFields = customFields || []
  console.log(customFields)
  for (let i = 0; i < customFields.length; i++) {
    let row = customFields[i]
    for (let j = 0; j < row.cols.length; j++) {
      let col = row.cols[j]
      for (let k = 0; k < col.fields.length; k++) {
        let field = col.fields[k]
        let cacheField = getObjectById(flowFields, field._id)
        console.log(cacheField)
        if (cacheField) {
          let type = cacheField.type
          switch (type) {
            case 'single':
              advFields.push({label: cacheField.name, name: cacheField._id, inputType: 'input'})
              customForm[cacheField._id] = null
              break
            case 'multi':
              advFields.push({label: cacheField.name, name: cacheField._id, inputType: 'textarea'})
              customForm[cacheField._id] = null
              break
            case 'date':
              advFields.push({label: cacheField.name, name: cacheField._id, inputType: 'date'})
              customForm[cacheField._id] = null
              break
            case 'number':
              advFields.push({label: cacheField.name, name: cacheField._id, inputType: 'input', type: 'Number'})
              customForm[cacheField._id] = null
              break
            case 'dropdown':
              let selectLabels = initCascateSelectData({}, cacheField, customForm)
              selectLabels.forEach((label) => {
                advFields.push(label)
              })
              customForm[cacheField._id] = ''
              break
            case 'checkbox':
              let checkData = initCheckBoxData({}, cacheField)
              advFields.push({label: cacheField.name, name: cacheField._id, inputType: 'checkbox', data: checkData})
              customForm[cacheField._id] = []
              break
            case 'radio':
              let radioData = initRadioData(cacheField)
              advFields.push({label: cacheField.name, name: cacheField._id, inputType: 'radio', data: radioData})
              customForm[cacheField._id] = null
              break
            case 'file':
              // if(isAdvSearch){
              //  break;
              // }else {
                // if (business && business[cacheField._id]) {
                //  if (handler.business.isStartStep(business.step) || business.isProcessAction) {
                //    let qid = uuid.v1();//考虑多个附件字段
                //    let fileContent = template("tmpl_bus_add_attach", {
                //      qiniuId: qid,
                //      _id: field._id
                //    });
                //    cacheField.fileContent = fileContent;
                //    colPane.append(render.replaceDataByObject(cacheField, fileTmp));
                //    utils.workflow._initQiniuUpload(qid, pane);
                //
                //    let attachs = business[cacheField._id] || [];
                //    let list = [];
                //    for (let l = 0; l < attachs.length; l++) {
                //      let obj = attachs[l];
                //      obj.fid = field._id;
                //      list.push(template("tmpl_bus_attach_show_edit", obj));
                //    }
                //    let containerId = qid + '-business-qiniu';
                //    let p1 = pane.find("#" + containerId).closest(".bus_attach_upload_container");
                //    let p1 = p1.find(".thumbnails_customer");
                //    p1.html(list.join(""));
                //  } else {
                //    let attachs = business[cacheField._id] || [];
                //    let list = [];
                //    for (let l = 0; l < attachs.length; l++) {
                //      let obj = attachs[l];
                //      obj.fid = field._id;
                //      list.push(template("tmpl_bus_attach_show", obj));
                //    }
                //    let _html = list.join("");
                //    if (list.length == 0) {
                //      _html = "<li style='margin-top: 3px;'>无</li>";
                //    }
                //    let html = '<ul class="thumbnails_customer">' + _html + '</ul>';
                //    cacheField.fileContent = html;
                //    colPane.append(render.replaceDataByObject(cacheField, fileTmp));
                //  }
                // } else {
                //  let qid = uuid.v1();
                //  let fileContent = template("tmpl_bus_add_attach", {
                //    qiniuId: qid,
                //    _id: field._id
                //  });
                //  cacheField.fileContent = fileContent;
                //  colPane.append(render.replaceDataByObject(cacheField, fileTmp));
                //  utils.workflow._initQiniuUpload(qid, pane);
                // }
              // }
              break
            default :
              console.log('the type [' + type + '] is not support!')
          }
        } else {
        }
      }
    }
  }
  return {advFields: advFields, customForm: customForm}
}
export function addBusienssSelectCascade (store, fieldValue, fieldId, casIndex, rootValue) {
  return new Promise((resolve, reject) => {
    store.dispatch('getCache', {type: 'businessFlowField', id: fieldId}).then((field) => {
      let dic = getCache('options', field.dic)
      let casCount = dic.cascade
      if (casIndex + 1 === casCount) {
        resolve([])
      }
      let fun = function (options, key) {
        options = options || []
        for (let i = 0; i < options.length; i++) {
          let optionsItem = options[i]
          if (optionsItem.key === key) {
            return options[i].options
          }
        }
        return []
      }

      if (casIndex === 0) {
        let labels = [{label: '--请选择--', value: ''}]
        let options = fun(dic.options, fieldValue)
        for (let i = 0; i < options.length; i++) {
          let optionsItem = options[i]
          labels.push({label: optionsItem.name, value: optionsItem.key})
        }
        resolve(labels)
      } else if (casIndex === 1) {
        let labels = [{label: '--请选择--', value: ''}]
        let prevOtions = fun(dic.options, rootValue)
        let options = fun(prevOtions, fieldValue)
        for (let i = 0; i < options.length; i++) {
          let optionsItem = options[i]
          labels.push({label: optionsItem.name, value: optionsItem.key})
        }
        resolve(labels)
      }
    })
  })
}
export function getFlowStepNameByCache (flowId, stepId) {
  let flow = getCache('businessFlow', flowId)
  let steps = (flow && flow.steps) ? flow.steps : []
  for (let i = 0; i < steps.length; i++) {
    let stepsItem = steps[i]
    if (stepsItem._id === stepId) {
      return stepsItem.name
    }
  }
  return stepId
}
export function getFlowStepActionById (actions, id) {
  actions = actions || []
  for (let i = 0; i < actions.length; i++) {
    let actionsItem = actions[i]
    if (actionsItem._id === id) {
      return actionsItem
    }
  }
  return {}
}
export function getBusinessStepActionName (stepId, actionId) {
  let step = getCache('businessFlowStep', stepId)
  let actions = (step && step.actions) ? step.actions : []
  for (let i = 0; i < actions.length; i++) {
    let actionsItem = actions[i]
    if (actionsItem._id === actionId) {
      return actionsItem.name
    }
  }
  return actionId
}
export function showCountDown (countDownTime) {
  let cc = ''
  let leftsecond = parseInt(Math.abs(countDownTime) / 1000)
  let hour = Math.floor(leftsecond / 3600)
  let minute = Math.floor((leftsecond - hour * 3600) / 60)
  let second = Math.floor(leftsecond - hour * 3600 - minute * 60)
  hour = checkTime(hour)
  minute = checkTime(minute)
  second = checkTime(second)
  cc = hour + ':' + minute + ':' + second
  return cc
}
export function getBusinessHisotryInfo (history, stepId, fromStep, actionId) {
  let action = history
  if (typeof history === 'object') {
    action = history.action
  }
  if (!action || !stepId) {
    let result = {}
    result.error = '读取业务单历史信息失败！'
    return result
  }
  let step = getCache('businessFlowStep', stepId)
  let result = {}
  result.action = action
  result.stepName = step.name
  if (fromStep) {
    let fromstep = getCache('businessFlowStep', fromStep)
    result.fromStepName = fromstep.name
  }

  if (action === 'create') {
    result.actionName = '创建 工单！'
  } else if (action === 'transformIn') {
    let actionName = getBusinessStepActionName(fromStep, actionId)
    result.actionName = actionName
  } else if (action === 'backIn') {
    result.actionName = '退回工单'
  } else if (action === 'recreate') {
    result.actionName = '重新提交 工单！'
  } else if (action === 'comment') {
    result.actionName = '添加 新的备注！'
  } else if (action === 'assign') {
    let username = getUserNameById(history.excuteData.master)
    if (username === history.excuteData.master) {
      username = '自动分配'
    }
    result.actionName = '变更 工单处理人为【' + username + '】'
  } else {
    result.actionName = '未知的动作！'
  }
  return result
}
export function getUserNameById (uid, maxLen) {
  if (!uid) {
    return uid
  }
  let user = getCache('agents', uid)
  if (user) {
    if (!maxLen) {
      return user.displayName
    } else {
      if (user.displayName.length > maxLen) {
        return user.displayName.substring(0, maxLen - 1) + '...'
      } else {
        return user.displayName
      }
    }
  }
  return uid
}
export function getBusinessHistoryData (history, business, flag) {
  let data = history.excuteData || {}
  let result = {}
  let arr = []
  for (let m in data) {
    arr.push(m)
  }
  arr.sort()
  for (let i in arr) {
    let key = arr[i]
    let filedKey = key
    if (key.substring(key.length - 2, key.length - 1) === '_') {
      filedKey = key.substring(0, key.length - 2)
    }
    let field = getCache('businessFlowField', filedKey)
    if (field) {
      if (field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'radio') {
        let dic = getDicByIdFor(data[key], getCache('options'))
        if (dic) {
          if (result[field.name]) {
            if (dic.name) {
              result[field.name] += ('-->' + dic.name)
            }
          } else {
            result[field.name] = dic.name
          }
        } else {
          if (result[field.name]) {
            if (data[key + '_default']) {
              result[field.name] += ('-->' + data[key + '_default'])
            }
          } else {
            if (field.type === 'checkbox') {
              if (data[key + '_default'] && data[key + '_default'].length) {
                result[field.name] = ''
                data[key + '_default'].forEach((item) => {
                  result[field.name] += item + ','
                })
                result[field.name] = result[field.name].substring(0, result[field.name].length - 1)
              } else {
                result[field.name] = ''
              }
            } else {
              result[field.name] = data[key + '_default'] || ''
            }
          }
        }
      } else if (field.type === 'file') {
        let attachs = data[key] || []
        let html = ''
        for (var l = 0; l < attachs.length; l++) {
          var obj = attachs[l]
          obj.fid = key
          html += '<a href=' + qiniu7moorDomain + obj.id + '?attname=' + obj.name + ' download>' + obj.name + '</a><br>'
        }
        result[field.name] = html
      } else {
        result[field.name] = data[key] || ''
      }
    } else {
      if (filedKey === 'number') {
        if (flag === 'businessFlow') {
          result['工单编号'] = data[key]
        } else {
          // let item = `<span @click="showBusDetail(${business._id})" class="bus-detail">${data[key]}</span>`
          result['工单编号'] = data[key]
        }
      }
    }
  }
  if (history.action === 'backIn') {
    result['退回原因'] = data.backInfo
  } else if (history.action === 'comment') {
    result['备注内容'] = data.backInfo
  }
  return result
}
export function taskTimeAll (ctype, ctime) {
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
  return showCountDown(resultStr)
}
export function timer (time) {
  let ts = time // 计算剩余的毫秒数
  let dd = parseInt(ts / 1000 / 60 / 60 / 24, 10)
  let hh = parseInt(ts / 1000 / 60 / 60 % 24, 10)
  let mm = parseInt(ts / 1000 / 60 % 60, 10)
  let ss = parseInt(ts / 1000 % 60, 10)
  hh = checkTime(hh)
  mm = checkTime(mm)
  ss = checkTime(ss)
  if (dd > 0) {
    return dd + '天'
  } else if (hh > 0) {
    return hh + '小时' + mm + '分' + ss + '秒'
  } else {
    return mm + '分' + ss + '秒'
  }
}
export function checkTime (i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}
export function busTimeDown (timeContent, currentBusiness, callBack) {
  let stepTimeState, totalTimeState
  if (currentBusiness.status === 'complete' || currentBusiness.status === 'cancel') {
    let totalExpireTime, stepExpireTime
    stepTimeState = 'business.stepTimeStateComplete'
    stepExpireTime = currentBusiness.processTime * 1000
    let flowObj = getCache('businessFlow', currentBusiness.flow)
    if (flowObj.ctype && flowObj.ctime) {
      totalExpireTime = getTimeByMs(flowObj.ctype, flowObj.ctime)
      totalTimeState = 'business.totalTimeStateComplete'
    }
    callBack({stepExpireTime, totalExpireTime, stepTimeState, totalTimeState})
  } else if (currentBusiness.history && currentBusiness.history.length === 0) {
    // 暂存工单
    let totalExpireTime, stepExpireTime
    let flowObj = getCache('businessFlow', currentBusiness.flow)
    if (flowObj.ctype && flowObj.ctime) {
      totalExpireTime = getTimeByMs(flowObj.ctype, flowObj.ctime)
      totalTimeState = 'business.totalTimeStateComplete'
      callBack({stepExpireTime, totalExpireTime, stepTimeState, totalTimeState})
    }
  } else {
    clearInterval(timeContent.stop)
    let totalExpireTime = currentBusiness.totalExpireTime || 0.1
    let stepExpireTime = currentBusiness.stepExpireTime || 0.1
    let timedown = function () {
      if (totalExpireTime !== 0.1) {
        if (totalExpireTime > 0) {
          totalTimeState = 'business.totalTimeStateUncomplete1'
        } else {
          totalTimeState = 'business.totalTimeStateUncomplete2'
        }
        totalExpireTime -= 1000
      } else {
      }
      if (stepExpireTime !== 0.1) {
        if (stepExpireTime > 0) {
          stepTimeState = 'business.stepTimeStateUncomplete1'
        } else {
          stepTimeState = 'business.stepTimeStateUncomplete2'
        }
        stepExpireTime -= 1000
      } else {
      }
      callBack({stepExpireTime, totalExpireTime, stepTimeState, totalTimeState})
    }
    timedown()
    timeContent.stop = setInterval(timedown, 1000)
  }
}

export function advancedSearchBack (custom) {
  let result = {}
  for (let i in custom) {
    let key = i
    let filedKey = key
    if (key && key.split('_')) {
      filedKey = key.split('_')[0]
    }
    let field = getCache('businessFlowField', filedKey)
    if (field) {
      if (field.type === 'dropdown' || field.type === 'radio') {
        let dic = getDicByIdFor(custom[key], getCache('options'))
        if (dic && dic.key) {
          if (result[field.name]) {
            if (dic.name) {
              result[field.name] += (' ' + dic.name)
            }
          } else {
            result[field.name] = dic.name
          }
        }
      } else if (field.type === 'checkbox') {
        for (let m = 0; m < custom[key].length; m++) {
          let dic = getDicByIdFor(custom[key][m], getCache('options'))
          if (dic) {
            if (result[field.name]) {
              if (dic.name) {
                result[field.name] += (' ' + dic.name)
              }
            } else {
              result[field.name] = dic.name
            }
          }
        }
      } else if (field.type === 'date') {
        if (custom[i]) {
          result[field.name] = custom[i].split(' ')[0]
        }
      } else {
        if (custom[i]) {
          result[field.name] = custom[i]
        }
      }
    }
  }
  return result
}
