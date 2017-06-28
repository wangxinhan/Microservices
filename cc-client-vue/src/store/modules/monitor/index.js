import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  tableHeader: {
    agent: {

    }
  },
  table: {
    callIn: {

    },
    MultiChannel: {

    },
    callSkill: {

    },
    MultiChannelSkill: {

    },
    callOut: {

    },
    agentMonitor: {

    }
  },
  chart: {
    todayCall: {
      todayCallin: {

      },
      todayCallout: {

      }
    },
    serveNums: {

    },
    multiChannelSkill: {

    },
    hour24Callin: {

    },
    hour24Callout: {

    }
  },
  agentStateChange: {random: '', userId: ''}
}
export default {
  state,
  getters,
  actions,
  mutations
}
