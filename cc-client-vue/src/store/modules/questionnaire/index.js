import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

// const 声明 一个常量才不会导致每次刷新会改变 store 的值
const state = {
  // 切换即刷新的,因此保留一个list即可
  refreshLeft: '',
  questionnaireList: {
    list: [],
    count: 0
  },
  current: {// 当前会话
    '_id': '',
    'name': '',
    'phone': '',
    'createTime': '',
    'lastUpdateTime': '',
    'owner': '',
    'temp_id': '',
    'batchNo': '',
    'batchRemark': '',
    'status': '',
    'comments': [],
    custDetial: [ // 详情信息
      /* {
        'key': 'name',
        'name': '客户姓名',
        'value': '中国平安5'
      },
      {
        'key': 'phone',
        'name': '联系方式',
        'value': '18910195609'
      },
      {
        'key': '192798f0-dc62-11e6-b175-5934bfa874e9',
        'name': '自定义字段1',
        'value': '2016-12-13 16:57:23'
      },
      {
        'key': '1fd61b90-dc62-11e6-a9e1-8b7397c7b219',
        'name': '自定义字段2',
        'value': '回访成功'
      } */
    ],
    'anws': { // 答案
      /* 'f2b483b5-0140-11e6-818f-835ee4132d04': {
        'aws': [
          'f2b483b0-0140-11e6-818f-835ee4132d04'
        ],
        'other': ''
      },
      '10543300-182c-11e6-86f1-dfdecb6fde79': {
        'aws': [
          '2ef81a50-418b-11e6-af4f-ebbd3c232ba0'
        ],
        'other': ''
      },
      'b4385874-470c-11e6-859f-414c988c9951': {
        'aws': [
          'b4385870-470c-11e6-859f-414c988c9951',
          'b4385871-470c-11e6-859f-414c988c9951'
        ],
        'other': ''
      } */
    }
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
