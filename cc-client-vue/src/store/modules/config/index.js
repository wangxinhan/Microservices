import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  config: {}
}
export default {
  state,
  getters,
  actions,
  mutations
}
