import * as types from './mutation-types'
import Vue from 'vue'
export default {
  [types.QUES_LIST_ALL] (state, {res}) {
    state.questionnaireList.list = res.list
    state.questionnaireList.count = res.count
  },
  [types.QUES_LIST_MY] (state, {res}) {
    state.questionnaireList.list = res.list
    state.questionnaireList.count = res.count
  },
  [types.QUES_CURRENT] (state, {data}) {
    Vue.set(state, 'current', data)
  },
  [types.QUES_DELETE] (state, {data}) {
    Vue.set(state, 'current', {})
    state.questionnaireList.list = []
    state.questionnaireList.count = 0
  },
  [types.QUES_TOTALCOUNT] (state, {data}) {
    if (data.menu === 'all') {
      state.questionnaireList.questionnaire_all.totalCount = data.totalCount
    } else {
      state.questionnaireList.questionnaire_my.totalCount = data.totalCount
    }
  },
  [types.QUES_CONFIRM] (state, {data}) {
    Vue.set(state, 'refreshLeft', Math.random())
  },
  [types.ADD_COMMENT] (state, data) {
    let comments = state.current.comments || []
    comments.push(data)
    state.current.comments = comments
    // Vue.set(state.current, 'comments', comments)
  }
}
