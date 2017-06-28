import * as types from './mutation-types'

export default {
  [types.SET_REPORT_HEADER_CONFIG] (state, { data }) {
    for (let type in state) {
      for (let reportType in state[type]) {
        if (state[type][reportType].tableHeader) {
          if (state[type][reportType].tableHeader.Type === data.reportType) {
            data.headers.map(header => {
              header.name = header.name.split('@')[0]
            })
            state[type][reportType].tableHeader.Config = data.headers
            return
          }
        }
      }
    }
  },
  [types.QUERY_CALL_RELAY_TIME_REPORT] (state, { data }) {
    state.call.relayTimeReport = data
  },
  [types.QUERY_CALL_RELAY_AREA_REPORT] (state, { data }) {
    state.call.relayAreaReport = data
  },
  [types.OPEN_RELAY_AREA_CITY] (state, { data }) {
    state.call.openRelayAreaCity = data
  },
  [types.QUERY_AGENT_TIME] (state, { data }) {
    state.call.queryAgentTime = data
  },
  [types.QUERY_CALL_CALLOUT_TIME_REPORT] (state, { data }) {
    state.call.calloutTimeReport = data
  },
  [types.QUERY_CALL_DIALOUT_AREA_REPORT] (state, { data }) {
    state.call.callDialoutAreaReport = data
  },
  [types.QUERY_CALL_QUEUE_REPORT] (state, { data }) {
    state.call.queueReport = data
  },
  [types.QUERY_CALL_QUEUE_TIME_REPORT] (state, { data }) {
    state.call.queueTimeReport = data
  },
  [types.QUERY_CALL_AGENT_REPORT] (state, { data }) {
    state.call.agentReport = data
  },
  [types.QUERY_CALL_AGENT_REPORT_CTI] (state, { data }) {
    state.call.queryAgentReportCti = data
  },
  [types.QUERY_CALL_APPROVE_SURVEY_REPORT] (state, { data }) {
    state.call.approveSurveyReport = data
  },
  [types.QUERY_IM_MESSAGE_REPORT] (state, { data }) {
    state.im.messageReport = data
  },
  [types.QUERY_IM_BUSINESS_ANALYSE_REPORT] (state, { data }) {
    state.im.businessAnalyseReport = data
  },
  [types.QUERY_IM_AGENT_REPORT] (state, { data }) {
    state.im.agentReport = data
  },
  [types.QUERY_IM_CSR_REPORT] (state, { data }) {
    state.im.csrReport = data
  },
  [types.QUERY_IM_CHANNEL_CSR_REPORT] (state, { data }) {
    state.im.channelCsrReport = data
  },
  [types.QUERY_IM_SESSION_TIME_REPORT] (state, { data }) {
    state.im.sessionTimeReport = data
  },
  [types.QUERY_IM_SESSION_FROM_REPORT] (state, { data, type }) {
    state.im.sessionFromReport[type] = data
  },
  [types.QUERY_IM_AGENT_RESPONSE_REPORT] (state, { data }) {
    state.im.agentResponseReport = data
  },
  [types.QUERY_MAIL_AGENT_REPORT] (state, { data }) {
    state.email.agentReport = data
  },
  [types.QUERY_MAIL_CATEGORY_REPORT] (state, { data }) {
    state.email.categoryReport = data
  },
  [types.QUERY_CUSTOMER_INCREASE_REPORT] (state, { data }) {
    state.customer.increaseReport = data
  },
  [types.QUERY_BUSINESS_ANALYSE_REPORT] (state, { data }) {
    state.business.analyseReport = data
  },
  [types.QUERY_BUSINESS_AGENT_REPORT] (state, { data }) {
    state.business.agentReport = data
  },
  [types.QUERY_QUES_RESULT_REPORT] (state, { data }) {
    state.questionnaire.resultReport = data
  },
  [types.QUERY_QUES_ANWSER_REPORT] (state, { data }) {
    state.questionnaire.anwserReport = data
  },
  [types.QUERY_ROBOT_MESSAGE_REPORT] (state, { data }) {
    state.robot.messageReport = data
  },
  [types.QUERY_ROBOT_TOP20_REPORT] (state, { data }) {
    state.robot.top20Report = data
  }
}
