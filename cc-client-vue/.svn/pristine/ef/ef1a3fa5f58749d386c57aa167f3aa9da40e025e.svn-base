import * as types from './mutation-types'
import Vue from 'vue'

export default {
  [types.SMSTEMPLATE] (state, data) {
    // state.sms.smsTemplate = data
    Vue.set(state, 'smsTemplate', data)
  },

  [types.QUERY_MY_SMS] (state, data) {
    Vue.set(state, 'mySms', data)
  },

  [types.QUERY_ALL_SMS] (state, data) {
    Vue.set(state, 'allSms', data)
  },

  [types.QUERY_SMS_IMPORT_TASK] (state, data) {
    Vue.set(state, 'smsImportTask', data)
  },

  [types.QUERY_TASK_IMPORT] (state, data) {
    Vue.set(state, 'taskImport', data)
  },

  [types.QUERY_TASK_INVALID] (state, data) {
    Vue.set(state, 'taskInvalid', data)
  },

  [types.QUERY_SMS_TEMPLATE_TO_CHECK] (state, data) {
    Vue.set(state, 'smsTemplateToCheck', data)
  },

  [types.QUERY_SMS_TEMPLATE_TO_CHECK_MESSAGE] (state, data) {
    Vue.set(state, 'smsTemplateToCheckMessage', data)
  },
  [types.SET_STATUS] (state, {index, status}) {
    Vue.set(state.smsTemplateToCheck.list[index], 'status', status)
  },
  [types.SET_TEMP_UNREADADMINMESSAGE] (state, index) {
    Vue.set(state.smsTemplateToCheck.list[index], 'unreadAdminMessage', false)
  },
  [types.REFRESH_LEFT] (state, flag) {
    Vue.set(state, 'refreshLeft', flag)
  }
}
